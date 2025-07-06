'use client'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Signup() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [otp, setOtp] = useState('')
    const [otpSent, setOtpSent] = useState(false)
    const [formStep, setFormStep] = useState(1)

    const handleSendOtp = async (e) => {
      e.preventDefault()
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setOtpSent(true)
        setFormStep(2)
      } else {
        setError('Failed to send OTP')
      }
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, otp }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push('/signin')
      } else {
        setError(data.message || 'Something went wrong')
      }
    }

    return (
      <div className="flex justify-center items-center h-screen">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>create your account</CardTitle>
            <CardDescription>
              Enter your email below to create to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formStep === 1 ? handleSendOtp : handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {formStep === 2 && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="otp">OTP</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}
              </div>
              <Button type="submit" className="w-full" style={{ marginTop: 24 }}>
                {formStep === 1 ? 'Send OTP' : 'Register'}
              </Button>
            </form>
            {error && (
              <div className="text-red-500 mt-2 text-center">{error}</div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button onClick={() => signIn('github')} variant="outline" className="w-full">
              signin with GitHub
            </Button>
            <Button onClick={() => signIn('google')} variant="outline" className="w-full">
              signin with google
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
}
