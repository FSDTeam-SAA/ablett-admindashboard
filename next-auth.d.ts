/* eslint-disable */
import NextAuth, { DefaultSession } from "next-auth";

type SessionError = "AccessTokenExpired";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      _id?: string;
      userId?: string;
      email?: string;
      name?: string;
      fullName?: string;
      image?: string;
      role?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      gender?: string;
      status?: string;
      tag?: string;
      createdAt?: string;
      profileImage?: string;
      accessRoutes?: string[];
      updatedAt?: string;
      version?: number;
    };

    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    message?: string;
    success?: boolean;
    statusCode?: number;
    responseTime?: string;
    role?: string;
    error?: SessionError;
  }

  interface User {
    _id?: string;
    userId?: string;
    email?: string;
    name?: string;
    fullName?: string;
    image?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    gender?: string;
    status?: string;
    tag?: string;
    createdAt?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    profileImage?: string;
    accessRoutes?: string[];
    updatedAt?: string;
    version?: number;
    message?: string;
    success?: boolean;
    statusCode?: number;
    responseTime?: string;
    error?: SessionError;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    userId?: string;
    email?: string;
    name?: string;
    fullName?: string;
    image?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    gender?: string;
    status?: string;
    tag?: string;
    createdAt?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    profileImage?: string;
    accessRoutes?: string[];
    updatedAt?: string;
    version?: number;
    message?: string;
    success?: boolean;
    statusCode?: number;
    responseTime?: string;
    error?: SessionError;
  }
}
