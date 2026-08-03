'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function VerifyEmailPage() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [timeLeft, setTimeLeft] = useState(59)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true)
      return
    }
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)
    return () => clearTimeout(timer)
  }, [timeLeft])

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const otpCode = otp.join('')
    console.log('OTP submission:', otpCode)
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
                Verify Email
              </h2>
              <p className="text-[#D7D7D7] text-base">
                Enter OTP to verify your email address
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Inputs */}
              <div className="space-y-3">
                <label className="text-base font-normal text-[#FFFFFF] block">
                  Enter OTP
                </label>
                <div className="flex gap-2 md:gap-3 justify-center">
                  {otp.map((value, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={value}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleBackspace(e, index)}
                      className="w-12 h-12 md:w-14 md:h-14 text-center text-lg md:text-2xl font-bold bg-[#333333] border border-[#BB7B1D] text-[#BB7B1D] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#BB7B1D]"
                      disabled={isExpired}
                    />
                  ))}
                </div>
              </div>

              {/* Timer */}
          
              {/* Resend Link */}
        

              {/* Verify Button */}
              <Button
                type="submit"
                disabled={!otp.every(v => v) || isExpired}
                className="w-full bg-[#BB7B1D] hover:bg-[#BB7B1D]/80 disabled:bg-[#333333] disabled:cursor-not-allowed text-white h-[51px] text-base font-semibold py-2 rounded-full transition-colors"
              >
                Verify
              </Button>
            </form>

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
