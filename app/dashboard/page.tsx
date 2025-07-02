import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg border bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome to your protected dashboard!
          </p>
          
          <div className="mt-8 space-y-4">
            <div>
              <h2 className="text-xl font-semibold">User Information</h2>
              <div className="mt-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Name:</span>{" "}
                    {session.user.name || "Not provided"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Email:</span>{" "}
                    {session.user.email || "Not provided"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Provider:</span>{" "}
                    {session.user.id || "OAuth"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 pt-4">
              <form
                action={async () => {
                  "use server"
                  await signOut()
                }}
              >
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Sign Out
                </button>
              </form>
              
              <Link
                href="/"
                className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}