import Link from "next/link"
import Head from "next/head"
import { getSession, signIn, signOut } from "next-auth/client"

const LoginPage = ({ session }) => {
  const signInButtonNode = () => {
    if (session) {
      return false
    }

    const handleSignIn = (e) => {
      e.preventDefault()
      // signIn('google', { callbackUrl: '/dashboard' })
      signIn("google")
    }

    return (
      <div>
        <Link href="/api/auth/signin" passHref>
          <button onClick={handleSignIn}>Sign In with Google</button>
        </Link>
      </div>
    )
  }

  const signOutButtonNode = () => {
    if (!session) {
      return false
    }

    const handleSignOut = (e) => {
      e.preventDefault()
      signOut({ callbackUrl: "/" })
    }

    return (
      <div>
        <Link href="/api/auth/signout" passHref>
          <button onClick={handleSignOut}>Sign Out</button>
        </Link>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="hero">
        <div className="navbar">
          {signOutButtonNode()}
          {signInButtonNode()}
        </div>

        <div className="text">You aren&apos;t authorized to view this page</div>
      </div>
    )
  }

  return (
    <div className="hero">
      <Head>
        <title>Index Page</title>
      </Head>

      <div className="navbar">
        {signOutButtonNode()}
        {signInButtonNode()}
      </div>

      <div className="text">Hello world</div>
    </div>
  )
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)
  return {
    props: {
      session,
    },
  }
}

export default LoginPage
