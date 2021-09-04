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
  session: {
    jwt: true,
  },
  callbacks: {
    session: async (session, user) => {
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

        token.jwt = data.jwt
        token.id = data.user.id
      }

      return Promise.resolve(token)
    },
  },
  pages: {
    signIn: "/login",
  },
}

const Auth = (req, res) => NextAuth(req, res, options)

export default Auth
