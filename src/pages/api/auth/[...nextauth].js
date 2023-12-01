import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const adminUsername = process.env.ADMIN_USERNAME;
        const knownPlainTextPassword = process.env.ADMIN_PASSWORD;

        if (
          credentials.username === adminUsername &&
          credentials.password === knownPlainTextPassword
        ) {
          return { id: adminUsername, name: adminUsername };
        } else {
          return null;
        }
      },
      callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
          return true; // Return true to indicate successful sign in
        },
        async redirect({ url, baseUrl }) {
          return baseUrl; // Redirect to the base URL after sign in
        },
      },
    }),
  ],
};

export default NextAuth(authOptions);
