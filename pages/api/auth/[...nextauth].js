import NextAuth from "next-auth"
import Providers from "next-auth/providers"

const options = {
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // database: process.env.NEXT_PUBLIC_DATABASE_URL,
  database: {
    type: "postgres",
    host: process.env.NEXT_PUBLIC_DATABASE_HOST,
    port: process.env.NEXT_PUBLIC_DATABASE_PORT,
    username: process.env.NEXT_PUBLIC_DATABASE_USERNAME,
    password: process.env.NEXT_PUBLIC_DATABASE_PASSWORD,
    database: process.env.NEXT_PUBLIC_DATABASE_NAME,
    synchronize: true,
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
        domain: ".cuppakappa.studio",
      },
    },
  },
  session: {
    jwt: true,
  },
  callbacks: {
    session: async (session, user) => {
      console.log("session", {
        jwt: user.jwt,
        id: user.id,
      })
      session.jwt = user.jwt
      session.id = user.id
      return Promise.resolve(session)
    },
    jwt: async (token, user, account) => {
      const isSignIn = user ? true : false

      if (isSignIn) {
        const response = await fetch(
          process.env.NEXT_PUBLIC_STRAPI_API_URL +
            "/auth/" +
            account.provider +
            "/callback?access_token=" +
            account?.accessToken
        )
        const data = await response.json()

        console.log("jwt", {
          jwt: data.jwt,
          id: data.id,
        })

        token.jwt = data.jwt
        token.id = data.user.id
      }

      console.log("jwt", { isSignIn })
      return Promise.resolve(token)
    },
  },
  pages: {
    signIn: "/login",
  },
}

const Auth = (req, res) => NextAuth(req, res, options)

export default Auth
