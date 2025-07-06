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
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function CardDemo() {
    const { data: session } = useSession();
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await signIn('credentials', {
            username,
            password,
            redirect: false,
        })
        if (res?.ok) {
            router.push('/') // redirect to homepage or dashboard
        } else {
            setError('Invalid credentials')
        }
    }
    return (
        <Card className="w-full max-w-sm ">
            <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
                <CardAction>
                    <Button onClick={()=>router.push('/signup')} variant="link">Sign Up</Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="username"
                                type="username"
                                placeholder="john doe"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <a
                                    href="#"
                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                >
                                    Forgot your password?
                                </a>
                            </div>
                            <Input id="password" type="password" value={password}
  onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="button" onClick={handleSubmit} className="w-full">
                    Login
                </Button>
                <Button onClick={() => signIn('github')} variant="outline" className="w-full">
                    Login with github
                </Button>
                <Button onClick={() => signIn('google')} variant="outline" className="w-full">
                    Login with google
                </Button>
            </CardFooter>
        </Card>
    )
}
