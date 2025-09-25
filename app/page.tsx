import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">ATO Platform</h1>
          <p className="text-muted-foreground">Adaptive Timetabling Optimizer for Higher Education</p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Sign In</CardTitle>
            <CardDescription className="text-muted-foreground">Access your timetabling dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
