import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card className="border-blue-500/20 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Check Your Email</CardTitle>
              <CardDescription className="text-slate-300">Confirm your account to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 mb-4">
                We&apos;ve sent you a confirmation email. Please check your inbox and click the link to activate your
                account.
              </p>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/auth/login">Back to Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
