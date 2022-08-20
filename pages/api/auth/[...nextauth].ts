import axios from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import querystring from 'query-string';
// import AppleProvider from "next-auth/providers/apple"
// import EmailProvider from "next-auth/providers/email"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    {
      id: "oidc",
      name: "OIDC",
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
  events: {
    async signOut({token}) {
      var refreshToken = token.refreshToken
      let headers = { "Content-Type": "application/x-www-form-urlencoded" };
      try {
        await axios.post("http://localhost:3255/auth/realms/DevRealm/protocol/openid-connect/logout",
        querystring.stringify({
          refresh_token: refreshToken,
          client_secret: '974d6f71-d41b-4601-9a7a-a33081f82188',
          client_id: 'recipe_management.next',
      }),
          { headers },
        );
      } catch (e) { }
    },
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_at * 1000,
          refreshToken: account.refresh_token,
          user,
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.user = token.user
      session.accessToken = token.accessToken
      session.error = token.error

      return session
    },
  },
  cookies:{
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    },
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    },
    csrfToken: {
      name: `__Host-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true
      }
    },
  }
}

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
 async function refreshAccessToken(token: JWT) {
  try {
    var params = querystring.stringify({
      client_secret: '974d6f71-d41b-4601-9a7a-a33081f82188',
      client_id: 'recipe_management.next',
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
  });
    const url = `http://localhost:3255/auth/realms/DevRealm/protocol/openid-connect/token?${params}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_at * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  } catch (error) {
    console.log(error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export default NextAuth(authOptions)
