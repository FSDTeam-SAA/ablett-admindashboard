'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSession, signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/components/ui/toast'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

const getSafeCallbackUrl = (callbackUrl: string | null) => {
  if (!callbackUrl) return '/'

  if (callbackUrl.startsWith('/')) {
    return callbackUrl
  }

  try {
    const url = new URL(callbackUrl)

    if (typeof window !== 'undefined' && url.origin === window.location.origin) {
      return `${url.pathname}${url.search}${url.hash}`
    }
  } catch {
    return '/'
  }

  return '/'
}

const getLoginErrorMessage = (error?: string | null) => {
  if (!error || error === 'CredentialsSignin') {
    return 'Invalid email or password. Please try again.'
  }

  if (error === 'Configuration') {
    return 'Login service is not configured. Please contact support.'
  }

  return error
}

function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleRememberMeChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      rememberMe: checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const email = formData.email.trim()

    if (!email || !formData.password) {
      toast.add({
        title: 'Login failed',
        description: 'Please enter your email and password.',
        type: 'error',
        priority: 'high',
      })
      return
    }

    setIsSubmitting(true)
    const toastId = toast.add({
      title: 'Signing in',
      description: 'Please wait...',
      type: 'loading',
      timeout: 0,
    })

    try {
      const result = await signIn('credentials', {
        email,
        password: formData.password,
        redirect: false,
      })

      if (!result?.ok) {
        toast.update(toastId, {
          title: 'Login failed',
          description: getLoginErrorMessage(result?.error),
          type: 'error',
          timeout: 5000,
          priority: 'high',
        })
        return
      }

      const session = await getSession()
      const destination = getSafeCallbackUrl(searchParams.get('callbackUrl'))

      toast.update(toastId, {
        title: 'Login successful',
        description: session?.message || 'Welcome back to admin dashboard.',
        type: 'success',
        timeout: 3000,
      })
      router.push(destination)
      router.refresh()
    } catch {
      toast.update(toastId, {
        title: 'Login failed',
        description: 'Something went wrong. Please try again.',
        type: 'error',
        timeout: 5000,
        priority: 'high',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:grid md:grid-cols-2 ">
      {/* Image Section - Hidden on mobile, shown on desktop */}
      <div className="hidden md:flex flex-col justify-between bg-[#00000033] p-8 relative overflow-hidden">
        <Image
          src="/auth.png"
          alt="Construction background"
          fill
          className="object-cover absolute inset-0"
          priority
        />
        <div className="relative z-10">
         
        </div>
        <div className="relative z-10">
          <h3 className="text-base text-[#BB7B1D]">A7 Property Solutions</h3>
          <h1 className="text-white text-4xl font-bold italic mb-2">
            Building Excellence.
          </h1>
          <p className="text-white text-4xl font-bold italic mb-6">
            Delivering Results.
          </p>
          <p className="text-gray-300 text-sm max-w-xs">
            Premium residential and commercial construction across Southeast Queensland.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="relative flex items-center justify-center overflow-hidden bg-[#000000]">
        <Image
          src="/auth2.png"
          alt="Construction background"
          fill
          className="absolute inset-0 object-cover"
          priority
        />
        {/* <div className="absolute inset-0 bg-black/70" /> */}
        <div className="relative z-10 w-full max-w-[560px] bg-[#FFFFFF14]  p-6 md:p-8 border border-[#333333] rounded-[12px]">
          {/* Mobile Logo */}
          <div className="md:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A7</span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            <div className="text-center">
              <Image 
                src="/logo.png"
                alt="A7 Logo"
                width={100}
                height={100}
                className="mx-auto"
              />
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2 mt-6">
                Welcome back
              </h2>
              <p className="text-[#D7D7D7] text-base">
                Sign in to your A7 Property Account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-base font-normal text-[#FFFFFF]">
                  Email Address
                </label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter Your Email Address..."
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-[#333333] h-[51px] border-none rounded-full text-white placeholder:text-gray-500 pl-5"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-base font-normal text-[#FFFFFF]">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter Password..."
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-[#333333] h-[51px] border-none rounded-full text-white placeholder:text-gray-500 pl-5 pr-10"
                    disabled={isSubmitting}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={handleRememberMeChange}
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-white text-base cursor-pointer"
                  >
                    Remember Me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-[#BB7B1D] text-base hover:text-amber-500 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="w-full bg-[#BB7B1D] hover:bg-[#BB7B1D]/80 text-white h-[51px] text-base font-semibold py-2 rounded-full transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

         
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginPage />
    </Suspense>
  )
}
