import NextAuth, { NextAuthOptions } from "next-auth"
// import AppleProvider from "next-auth/providers/apple"
// import EmailProvider from "next-auth/providers/email"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    /* EmailProvider({
         server: process.env.EMAIL_SERVER,
         from: process.env.EMAIL_FROM,
       }),
    // Temporarily removing the Apple provider from the demo site as the
    // callback URL for it needs updating due to Vercel changing domains

    Providers.Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: {
        appleId: process.env.APPLE_ID,
        teamId: process.env.APPLE_TEAM_ID,
        privateKey: process.env.APPLE_PRIVATE_KEY,
        keyId: process.env.APPLE_KEY_ID,
      },
    }),
    */
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_ID,
    //   clientSecret: process.env.FACEBOOK_SECRET,
    // }),
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_ID,
    //   clientSecret: process.env.GOOGLE_SECRET,
    // }),
    // TwitterProvider({
    //   clientId: process.env.TWITTER_ID,
    //   clientSecret: process.env.TWITTER_SECRET,
    // }),
    // Auth0Provider({
    //   clientId: process.env.AUTH0_ID,
    //   clientSecret: process.env.AUTH0_SECRET,
    //   issuer: process.env.AUTH0_ISSUER,
    // }),
    // {
    //   id: "MyKeycloak",
    //   name: "MyKeycloak",
    //   type: "oauth",
    //   wellKnown: "http://localhost:3255/auth/realms/SpecialRealm/.well-known/openid-configuration",
    //   authorization: { params: { scope: "openid email profile" } },
    //   idToken: true,
    //   checks: ["pkce"],
    //   clientId: "recipe_management.nextjs",
    //   clientSecret: "974d6f71-d41b-4601-9a7a-a33081f80622",
    //   profile(profile) {
    //     return {
    //       id: profile.sub,
    //       name: profile.name,
    //       email: profile.email,
    //       image: profile.picture,
    //     }
    //   },
    // }
    {
      id: "myKey",
      name: "Paul's Key",
      type: "oauth",
      wellKnown: "http://localhost:3255/auth/realms/DevRealm/.well-known/openid-configuration",
      authorization: { params: { scope: "openid email profile recipe_management" } },
      idToken: true,
      checks: ["pkce", "state"],
        clientId: "recipe_management.next",
        clientSecret: "974d6f71-d41b-4601-9a7a-a33081f82188",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
    }
  ],
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    async jwt({ token }) {
      token.userRole = "admin"
      return token
    },
  },
}

export default NextAuth(authOptions)
