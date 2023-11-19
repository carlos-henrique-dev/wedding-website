import { useSession, signIn } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const withAuthorization = (WrappedComponent: React.FC) => {
  return function ProtectedRoute(props: any) {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
      if (status === 'loading') return // Do nothing while loading

      if (!session) signIn() // Redirect to sign in if not authenticated
    }, [session, status, router])

    if (session) {
      return <WrappedComponent {...props} />
    }

    // Optionally, add a loading spinner or a placeholder here
    return null
  }
}

export default withAuthorization
