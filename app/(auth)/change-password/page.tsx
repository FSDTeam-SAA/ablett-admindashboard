'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff } from 'lucide-react'

export default function ChangePasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Change password attempt:', formData)
  }

  const isPasswordMatch = formData.newPassword && formData.confirmPassword === formData.newPassword
  const isFormValid = formData.newPassword && isPasswordMatch

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
                Change Password
              </h2>
              <p className="text-[#D7D7D7] text-base">
                Create a new password for your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password Field */}
              <div className="space-y-2">
                <label className="text-base font-normal text-[#FFFFFF]">
                  Create New Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="newPassword"
                    placeholder="Enter Password..."
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="bg-[#333333] h-[51px] border-none rounded-full text-white placeholder:text-gray-500 pl-5 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-base font-normal text-[#FFFFFF]">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Enter Password..."
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-[#333333] h-[51px] border-none rounded-full text-white placeholder:text-gray-500 pl-5 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className={`text-sm ${isPasswordMatch ? 'text-green-500' : 'text-red-500'}`}>
                  {isPasswordMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                </div>
              )}

              {/* Continue Button */}
              <Button
                type="submit"
                disabled={!isFormValid}
                className="w-full bg-[#BB7B1D] hover:bg-[#BB7B1D]/80 disabled:bg-[#333333] disabled:cursor-not-allowed text-white h-[51px] text-base font-semibold py-2 rounded-full transition-colors"
              >
                Continue
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
