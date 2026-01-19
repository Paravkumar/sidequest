import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("No user found with this email");
        if (user.provider === "credentials" && !user.emailVerified) {
          throw new Error("Email not verified");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Incorrect password");

        return { id: user._id, name: user.name, email: user.email, phone: user.phone, community: user.community };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.userId || token.sub) {
        session.user.id = token.userId || token.sub;
        session.user.phone = token.phone; 
        
        // --- FETCH FRESH COMMUNITY ---
        // This ensures if they just selected a college, the session updates
        await connectDB();
        const freshUser = await User.findById(session.user.id);
           if (freshUser && freshUser.community) {
             session.user.community = freshUser.community;
           }
        // -----------------------------
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.phone = user.phone;
        token.community = user.community;
        token.userId = user.id || user._id;
        token.email = user.email || token.email;
      }

      if (!token.userId && token.email) {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.userId = dbUser._id;
          token.phone = dbUser.phone || token.phone;
          token.community = dbUser.community || token.community;
        }
      }

      return token;
    },
    async signIn({ user, account }) {
      if (account.provider === "google") {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            provider: "google",
            emailVerified: true,
          });
        } else if (!existingUser.emailVerified) {
          existingUser.emailVerified = true;
          await existingUser.save();
        }
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };