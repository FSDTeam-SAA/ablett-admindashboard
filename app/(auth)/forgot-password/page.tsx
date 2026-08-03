'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Forgot password request:', email)
    setIsSubmitted(true)
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
      </div>

      {/* Form Section */}
      <div className="relative flex items-center justify-center overflow-hidden bg-black">
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
                Forgot Password!
              </h2>
              <p className="text-[#D7D7D7] text-base">
                Enter your email to recover your password
              </p>
            </div>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-base font-normal text-[#FFFFFF]">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter Your Email Address..."
                    value={email}
                    onChange={handleChange}
                    className="bg-[#333333] h-[51px] border-none rounded-full text-white placeholder:text-gray-500 pl-5"
                    required
                  />
                </div>

                {/* Send OTP Button */}
                <Button
                  type="submit"
                  className="w-full bg-[#BB7B1D] hover:bg-[#BB7B1D]/80 text-white h-[51px] text-base font-semibold py-2 rounded-full transition-colors"
                >
                  Send OTP
                </Button>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <div className="bg-[#333333] rounded-[12px] p-6 border border-[#444444]">
                  <p className="text-[#D7D7D7] mb-2">
                    We&apos;ve sent a password reset link to:
                  </p>
                  <p className="text-white font-semibold text-sm break-all mb-4">
                    {email}
                  </p>
                  <p className="text-[#D7D7D7] text-sm">
                    Please check your email and follow the instructions to reset your password.
                  </p>
                </div>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="w-full border-[#BB7B1D] text-[#BB7B1D] hover:bg-[#BB7B1D]/10 h-[51px] text-base font-semibold rounded-full"
                >
                  Try Another Email
                </Button>
              </div>
            )}

            {/* Back to Login */}
            <div className="text-center ">
              <Link
                href="/login"
                className="text-[#BB7B1D] hover:text-[#BB7B1D] transition-colors font-medium text-sm"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
