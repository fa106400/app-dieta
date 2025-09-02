'use client'

import { useAuthContext } from '@/contexts/AuthContext'

export function AuthStatus() {
  const { user, isAuthenticated, loading, signOut } = useAuthContext()

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
        <span>Loading...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="text-sm text-gray-600">
        Not signed in
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="text-sm">
        <span className="text-gray-600">Signed in as:</span>
        <span className="ml-2 font-medium text-gray-900">
          {user?.user_metadata?.name || user?.email}
        </span>
      </div>
      <button
        onClick={() => signOut()}
        className="text-sm text-red-600 hover:text-red-800 underline"
      >
        Sign out
      </button>
    </div>
  )
}
