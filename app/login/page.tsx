import { signIn } from "@/auth"
import { AuthError } from "next-auth"
import { checkBotId } from "botid/server"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>
}) {
  const params = await searchParams
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-sm space-y-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your credentials to access the dashboard
          </p>
        </div>
        
        {params?.error === "CredentialsSignin" && (
          <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-400">
              Invalid username or password
            </p>
          </div>
        )}
        
        {params?.error === "BotDetected" && (
          <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-400">
              Bot detected. Access denied.
            </p>
          </div>
        )}
        
        <form
          action={async (formData) => {
            "use server"
            
            // Check if the request is from a bot
            const verification = await checkBotId()
            
            if (verification.isBot) {
              // Redirect back to login with bot error
              const url = new URL("/login", process.env.NEXTAUTH_URL || "http://localhost:3000")
              url.searchParams.set("error", "BotDetected")
              if (params?.callbackUrl) {
                url.searchParams.set("callbackUrl", params.callbackUrl)
              }
              throw new Error("Bot detected")
            }
            
            try {
              await signIn("credentials", {
                username: formData.get("username"),
                password: formData.get("password"),
                redirectTo: params?.callbackUrl ?? "/dashboard",
              })
            } catch (error) {
              if (error instanceof AuthError) {
                if (error.type === "CredentialsSignin") {
                  throw error
                }
              }
              throw error
            }
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800"
              placeholder="admin"
              defaultValue="admin"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800"
              placeholder="admin"
              defaultValue="admin"
            />
          </div>
          
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Sign In
          </button>
        </form>
        
        <div className="rounded-lg bg-gray-50 p-4 text-sm dark:bg-gray-800">
          <p className="font-medium mb-1">Demo Credentials:</p>
          <p>Username: <code className="bg-gray-200 px-1 rounded dark:bg-gray-700">admin</code></p>
          <p>Password: <code className="bg-gray-200 px-1 rounded dark:bg-gray-700">admin</code></p>
        </div>
      </div>
    </div>
  )
}