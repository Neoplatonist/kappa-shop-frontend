import { providers, signIn, getSession } from "next-auth/client"

function Login({ session, providers }) {
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return (
    <div>
      <h1>Login Page</h1>

      {Object.values(providers).map((provider) => {
        return (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id)}>
              Sign In with {provider.name}
            </button>
          </div>
        )
      })}
    </div>
  )
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx.req)

  // User is already logged in
  // Redirect to another page
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
      providers: await providers(ctx),
    },
  }
}

export default Login
