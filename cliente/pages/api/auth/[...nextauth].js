import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import axios from "axios";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export default NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
     async authorize(credentials, req) {
        const { email, password } = credentials;

        console.log(credentials)
        console.log(email)
        console.log(password)
        var getCompra = {correo:email,password:password}
        var user
        var config_request={
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
        await axios.post('http://localhost:3001' + '/login', getCompra, { config_request })
        .then(res => {                                         
          user = res.data
        })
        .catch((error) => {
            console.log(error)
        });
        user.name=user[0].fullname
        user.image=user[0]
        user.email=user[0].correo
        user.id=user[0]._id
        console.log(user)


        return user;
        
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
