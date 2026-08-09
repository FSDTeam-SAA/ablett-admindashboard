"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { io, type Socket } from "socket.io-client";
import {
  FileText,
  ImageIcon,
  Inbox,
  Loader2,
  Paperclip,
  RefreshCcw,
  Search,
  SendHorizontal,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const allowedAttachmentTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];
const selectedConversationStorageKey = "ablett-admin-selected-conversation-id";

type ChatUser = {
  _id?: string;
  fullName?: string;
  email?: string;
  role?: string;
  profilePicture?: string;
  profileImage?: string;
  status?: string;
};

type ChatAttachment = {
  type: "image" | "pdf";
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
};

type ChatParticipant = string | ChatUser;

type ChatMessage = {
  _id: string;
  senderId: ChatParticipant;
  receiverId: ChatParticipant;
  text?: string;
  attachments?: ChatAttachment[];
  readAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

type ChatInboxItem = {
  user: ChatUser | null;
  lastMessage: ChatMessage;
  unreadCount: number;
};

type ApiResponse<T> = {
  success?: boolean;
  status?: boolean;
  message?: string;
  error?: string;
  data?: T;
};

function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured.");
  }

  return apiBaseUrl.replace(/\/+$/, "");
}

function getSocketBaseUrl(apiBaseUrl: string) {
  return apiBaseUrl.replace(/\/api\/v1\/?$/, "");
}

function getSavedConversationUserId() {
  if (typeof window === "undefined") return "";

  const queryUserId = new URLSearchParams(window.location.search).get("userId");
  if (queryUserId) return queryUserId;

  return window.localStorage.getItem(selectedConversationStorageKey) ?? "";
}

function saveConversationUserId(userId: string) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(selectedConversationStorageKey, userId);

  const url = new URL(window.location.href);
  url.searchParams.set("userId", userId);
  window.history.replaceState(null, "", `${url.pathname}${url.search}`);
}

function getParticipantId(participant: ChatParticipant | undefined) {
  if (!participant) return "";
  return typeof participant === "string" ? participant : participant._id ?? "";
}

function getUserName(user?: ChatUser | null) {
  return user?.fullName?.trim() || user?.email || "Unknown user";
}

function getInitials(user?: ChatUser | null) {
  const name = getUserName(user);
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";
}

function getMessagePreview(message?: ChatMessage) {
  if (!message) return "No messages yet";
  if (message.text?.trim()) return message.text.trim();
  if (message.attachments?.length) {
    return `${message.attachments.length} attachment${
      message.attachments.length > 1 ? "s" : ""
    }`;
  }
  return "No message text";
}

function formatChatTime(value?: string) {
  if (!value) return "";

  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatInboxDate(value?: string) {
  if (!value) return "";

  const date = new Date(value);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  if (isToday) return formatChatTime(value);

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function notify(
  title: string,
  description: string,
  type: "success" | "error" | "info" = "info",
) {
  toast.add({
    title,
    description,
    type,
    priority: type === "error" ? "high" : "low",
  });
}

async function fetchChatJson<T>(
  path: string,
  accessToken: string,
  init?: RequestInit,
) {
  const headers = new Headers(init?.headers);
  headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers,
  });
  const data: ApiResponse<T> | null = await response.json().catch(() => null);

  if (!response.ok || data?.success === false || data?.status === false) {
    throw new Error(data?.message || data?.error || "Chat request failed.");
  }

  return data?.data as T;
}

async function sendAdminMessage({
  userId,
  text,
  files,
  accessToken,
}: {
  userId: string;
  text: string;
  files: File[];
  accessToken: string;
}) {
  const formData = new FormData();
  const trimmedText = text.trim();

  formData.append("userId", userId);

  if (trimmedText) {
    formData.append("text", trimmedText);
  }

  files.forEach((file) => {
    formData.append("attachments", file);
  });

  return fetchChatJson<ChatMessage>("/chat/messages", accessToken, {
    method: "POST",
    body: formData,
  });
}

export function AdminMessagesPanel() {
  const { data: session, status } = useSession();
  const [inboxItems, setInboxItems] = useState<ChatInboxItem[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingInbox, setIsLoadingInbox] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const accessToken = session?.accessToken;
  const adminUserId = session?.user?._id ?? session?.user?.userId ?? "";
  const selectedInboxItem = inboxItems.find(
    (item) => item.user?._id === selectedUserId,
  );
  const selectedUser = selectedInboxItem?.user ?? null;
  const canSend =
    Boolean(accessToken) &&
    Boolean(selectedUserId) &&
    !isSending &&
    (messageText.trim().length > 0 || selectedFiles.length > 0);

  const loadInbox = useCallback(
    async (options?: { selectFirst?: boolean; silent?: boolean }) => {
      if (!accessToken) return;

      if (!options?.silent) {
        setIsLoadingInbox(true);
      }
      setChatError(null);

      try {
        const inbox = await fetchChatJson<ChatInboxItem[]>(
          "/chat/inbox",
          accessToken,
        );
        setInboxItems(inbox ?? []);

        if (options?.selectFirst) {
          const savedUserId = getSavedConversationUserId();
          const availableUserIds = (inbox ?? [])
            .map((item) => item.user?._id ?? "")
            .filter(Boolean);
          const nextUserId = availableUserIds.includes(savedUserId)
            ? savedUserId
            : availableUserIds[0];

          if (nextUserId) {
            setSelectedUserId(nextUserId);
            saveConversationUserId(nextUserId);
          }
        }
      } catch (error) {
        setChatError(
          error instanceof Error ? error.message : "Failed to load inbox.",
        );
      } finally {
        if (!options?.silent) {
          setIsLoadingInbox(false);
        }
      }
    },
    [accessToken],
  );

  const loadMessages = useCallback(
    async (userId: string) => {
      if (!accessToken || !userId) return;

      setIsLoadingMessages(true);
      setChatError(null);

      try {
        const history = await fetchChatJson<ChatMessage[]>(
          `/chat/messages?userId=${encodeURIComponent(userId)}&limit=200`,
          accessToken,
        );
        setMessages(history ?? []);
        setInboxItems((current) =>
          current.map((item) =>
            item.user?._id === userId ? { ...item, unreadCount: 0 } : item,
          ),
        );
        void fetchChatJson(`/chat/read?userId=${encodeURIComponent(userId)}`, accessToken, {
          method: "PATCH",
        }).catch(() => null);
      } catch (error) {
        setChatError(
          error instanceof Error ? error.message : "Failed to load messages.",
        );
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [accessToken],
  );

  useEffect(() => {
    if (status === "loading") return;

    if (!accessToken) {
      setIsLoadingInbox(false);
      setChatError("Please login as admin to open messages.");
      return;
    }

    void loadInbox({ selectFirst: true });
  }, [accessToken, loadInbox, status]);

  useEffect(() => {
    if (!selectedUserId) {
      setMessages([]);
      return;
    }

    void loadMessages(selectedUserId);
  }, [loadMessages, selectedUserId]);

  useEffect(() => {
    if (!accessToken || !adminUserId) return;

    const socket = io(`${getSocketBaseUrl(getApiBaseUrl())}/chat`, {
      auth: { token: accessToken },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("chat:ready", () => {
      setChatError(null);
    });

    socket.on("message:new", (message: ChatMessage) => {
      const senderId = getParticipantId(message.senderId);
      const receiverId = getParticipantId(message.receiverId);
      const otherUserId = senderId === adminUserId ? receiverId : senderId;

      if (selectedUserId && otherUserId === selectedUserId) {
        setMessages((current) => {
          if (current.some((item) => item._id === message._id)) return current;
          return [...current, message];
        });
        socket.emit("conversation:read", { userId: selectedUserId });
      }

      void loadInbox({ silent: true });
    });

    socket.on("conversation:updated", () => {
      void loadInbox({ silent: true });
    });

    socket.on("chat:error", (payload: { message?: string }) => {
      setChatError(payload?.message || "Realtime chat connection failed.");
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken, adminUserId, loadInbox, selectedUserId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length, selectedUserId]);

  const filteredInbox = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return inboxItems;

    return inboxItems.filter((item) => {
      const name = getUserName(item.user).toLowerCase();
      const email = item.user?.email?.toLowerCase() ?? "";
      const preview = getMessagePreview(item.lastMessage).toLowerCase();
      return (
        name.includes(query) ||
        email.includes(query) ||
        preview.includes(query)
      );
    });
  }, [inboxItems, searchQuery]);

  const handleSelectConversation = (userId?: string) => {
    if (!userId) return;
    setSelectedUserId(userId);
    saveConversationUserId(userId);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    const allowedFiles = files.filter((file) => {
      const isAllowed = allowedAttachmentTypes.includes(file.type);
      const isWithinLimit = file.size <= 10 * 1024 * 1024;

      if (!isAllowed) {
        notify("Attachment blocked", `${file.name} is not supported.`, "error");
      }

      if (!isWithinLimit) {
        notify("Attachment blocked", `${file.name} is larger than 10 MB.`, "error");
      }

      return isAllowed && isWithinLimit;
    });

    setSelectedFiles((current) => [...current, ...allowedFiles].slice(0, 5));
    event.target.value = "";
  };

  const handleRemoveFile = (fileName: string) => {
    setSelectedFiles((current) =>
      current.filter((file) => file.name !== fileName),
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!accessToken) {
      notify("Login required", "Please login to send a message.", "error");
      return;
    }

    if (!selectedUserId) {
      notify("No conversation selected", "Select a user conversation first.", "error");
      return;
    }

    if (!canSend) return;

    setIsSending(true);
    setChatError(null);

    try {
      const savedMessage = await sendAdminMessage({
        userId: selectedUserId,
        text: messageText,
        files: selectedFiles,
        accessToken,
      });

      setMessages((current) => {
        if (current.some((message) => message._id === savedMessage._id)) {
          return current;
        }
        return [...current, savedMessage];
      });
      setMessageText("");
      setSelectedFiles([]);
      void loadInbox({ silent: true });
    } catch (error) {
      notify(
        "Message failed",
        error instanceof Error ? error.message : "Message could not be sent.",
        "error",
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="flex h-[calc(100vh-138px)] min-h-[620px] overflow-hidden rounded-lg border border-[#2d2d2d] bg-[#111111] text-white">
      <aside className="flex w-[360px] shrink-0 flex-col border-r border-[#2d2d2d] bg-[#171717] max-lg:w-[310px] max-md:hidden">
        <div className="border-b border-[#2d2d2d] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold leading-7">Messages</h2>
              <p className="mt-1 text-sm text-[#9d9d9d]">
                {inboxItems.length} conversation{inboxItems.length === 1 ? "" : "s"}
              </p>
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label="Refresh conversations"
              className="text-[#d7d7d7] hover:bg-white/10 hover:text-white"
              onClick={() => void loadInbox({ silent: false })}
              disabled={isLoadingInbox}
            >
              <RefreshCcw
                className={cn("size-4", isLoadingInbox && "animate-spin")}
              />
            </Button>
          </div>

          <label className="mt-4 flex h-10 items-center gap-2 rounded-md border border-[#3a3a3a] bg-[#222222] px-3">
            <Search className="size-4 shrink-0 text-[#8a8a8a]" />
            <input
              type="search"
              placeholder="Search conversations"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#7d7d7d]"
            />
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLoadingInbox ? (
            <div className="flex h-full items-center justify-center text-sm text-[#cfcfcf]">
              <Loader2 className="mr-2 size-4 animate-spin" />
              Loading inbox...
            </div>
          ) : filteredInbox.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center text-sm text-[#9d9d9d]">
              <Inbox className="mb-3 size-9 text-[#6f6f6f]" />
              No conversations found.
            </div>
          ) : (
            filteredInbox.map((item) => {
              const userId = item.user?._id ?? "";
              const isActive = userId === selectedUserId;

              return (
                <button
                  key={userId || item.lastMessage._id}
                  type="button"
                  onClick={() => handleSelectConversation(userId)}
                  className={cn(
                    "flex w-full gap-3 border-b border-[#292929] px-4 py-3 text-left transition hover:bg-[#222222]",
                    isActive && "bg-[#252525]",
                  )}
                >
                  <UserAvatar user={item.user} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="truncate text-sm font-semibold text-white">
                        {getUserName(item.user)}
                      </p>
                      <span className="shrink-0 text-xs text-[#898989]">
                        {formatInboxDate(item.lastMessage.createdAt)}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-xs leading-5 text-[#a9a9a9]">
                      {getMessagePreview(item.lastMessage)}
                    </p>
                    {item.user?.email ? (
                      <p className="truncate text-[11px] leading-4 text-[#777777]">
                        {item.user.email}
                      </p>
                    ) : null}
                  </div>
                  {item.unreadCount > 0 ? (
                    <span className="mt-6 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#bb7b1d] px-1.5 text-[11px] font-semibold text-white">
                      {item.unreadCount}
                    </span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          user={selectedUser}
          selectedUserId={selectedUserId}
        />

        {chatError ? (
          <div className="border-b border-[#382727] bg-[#2a1515] px-4 py-2 text-sm text-[#ffc4c4]">
            {chatError}
          </div>
        ) : null}

        <div
          ref={scrollRef}
          className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-[#101010] px-4 py-5"
        >
          {!selectedUserId ? (
            <EmptyChatState title="Select a conversation" description="Choose a user from the sidebar to open the chat." />
          ) : isLoadingMessages ? (
            <div className="flex flex-1 items-center justify-center text-sm text-[#cfcfcf]">
              <Loader2 className="mr-2 size-4 animate-spin" />
              Loading conversation...
            </div>
          ) : messages.length === 0 ? (
            <EmptyChatState title="No messages yet" description="Send a reply to start this conversation." />
          ) : (
            messages.map((message) => {
              const isAdminMessage =
                getParticipantId(message.senderId) === adminUserId;

              return (
                <MessageBubble
                  key={message._id}
                  message={message}
                  isRight={isAdminMessage}
                />
              );
            })
          )}
        </div>

        {selectedFiles.length ? (
          <div className="flex shrink-0 gap-2 overflow-x-auto border-t border-[#2d2d2d] bg-[#202020] px-4 py-2">
            {selectedFiles.map((file) => (
              <div
                key={file.name}
                className="flex max-w-[220px] shrink-0 items-center gap-2 rounded-md bg-[#333333] px-2.5 py-1.5 text-xs text-[#e6e6e6]"
              >
                {file.type === "application/pdf" ? (
                  <FileText className="size-3.5 shrink-0" />
                ) : (
                  <ImageIcon className="size-3.5 shrink-0" />
                )}
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  className="text-[#cfcfcf] transition hover:text-white"
                  onClick={() => handleRemoveFile(file.name)}
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <form
          className="flex h-[64px] shrink-0 items-center gap-3 border-t border-[#2d2d2d] bg-[#1c1c1c] px-4"
          onSubmit={handleSubmit}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
            multiple
            onChange={handleFileChange}
          />
          <button
            type="button"
            aria-label="Attach file"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#d0d0d0] transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending || !accessToken || !selectedUserId}
          >
            <Paperclip className="size-4" />
          </button>

          <input
            type="text"
            aria-label="Type a reply"
            placeholder={
              selectedUserId ? "Type a reply..." : "Select a conversation first"
            }
            className="min-w-0 flex-1 rounded-full border border-[#3a3a3a] bg-[#2a2a2a] px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-[#8f8f8f] focus:border-[#bb7b1d] focus:ring-2 focus:ring-[#bb7b1d]/20 disabled:cursor-not-allowed disabled:opacity-60"
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            disabled={isSending || !accessToken || !selectedUserId}
          />

          <button
            type="submit"
            aria-label="Send reply"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#bb7b1d] text-white transition hover:bg-[#a96f1a] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canSend}
          >
            {isSending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <SendHorizontal className="size-4" />
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

function UserAvatar({ user }: { user?: ChatUser | null }) {
  const imageUrl = user?.profilePicture || user?.profileImage;

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={getUserName(user)}
        className="size-11 shrink-0 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#4b372f] text-sm font-semibold text-white">
      {getInitials(user)}
    </div>
  );
}

function ChatHeader({
  user,
  selectedUserId,
}: {
  user: ChatUser | null;
  selectedUserId: string;
}) {
  return (
    <header className="flex min-h-[72px] shrink-0 items-center justify-between gap-4 border-b border-[#2d2d2d] bg-[#191919] px-4">
      <div className="flex min-w-0 items-center gap-3">
        {selectedUserId ? <UserAvatar user={user} /> : null}
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold leading-6 text-white">
            {selectedUserId ? getUserName(user) : "Messages"}
          </h2>
     
        </div>
      </div>

   
    </header>
  );
}

function EmptyChatState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <Inbox className="mb-3 size-10 text-[#5d5d5d]" />
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-[#9d9d9d]">
        {description}
      </p>
    </div>
  );
}

function MessageBubble({
  message,
  isRight,
}: {
  message: ChatMessage;
  isRight: boolean;
}) {
  return (
    <div className={cn("flex", isRight ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[min(520px,82%)] rounded-[10px] px-3.5 py-2.5 text-sm leading-6 text-[#eeeeee]",
          isRight ? "bg-[#5b5b5b]" : "bg-[#563203]",
        )}
      >
        {message.text ? (
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        ) : null}
        {message.attachments?.length ? (
          <div className="mt-2 space-y-2">
            {message.attachments.map((attachment) =>
              attachment.type === "image" ? (
                <a
                  key={attachment.url}
                  href={attachment.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block overflow-hidden rounded-md border border-white/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={attachment.url}
                    alt={attachment.originalName}
                    className="max-h-60 w-full object-cover"
                  />
                </a>
              ) : (
                <a
                  key={attachment.url}
                  href={attachment.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-md border border-white/10 bg-black/15 px-2.5 py-2 text-[#f2d8a8] transition hover:bg-black/25"
                >
                  <FileText className="size-4 shrink-0" />
                  <span className="truncate">{attachment.originalName}</span>
                </a>
              ),
            )}
          </div>
        ) : null}
        {message.createdAt ? (
          <p className="mt-1 text-right text-[10px] leading-4 text-white/55">
            {formatChatTime(message.createdAt)}
          </p>
        ) : null}
      </div>
    </div>
  );
}
