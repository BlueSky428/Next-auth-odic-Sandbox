import { withAuth } from "next-auth/middleware";

// // More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
// export default withAuth(function middleware(req) {}, {
//   callbacks: {
//     authorized: ({ token, req }) => {
//       // home is public
//       if (req.nextUrl.pathname === "/") {
//         return true;
//       }

//       return !!token;
//     },
//   },
// });

// More on how NextAuth.js middleware works: https://next-auth.js.org/configuration/nextjs#middleware
export default withAuth(function middleware(req) {}, {
  callbacks: {
    authorized: ({ token, req }) => {
      return true;
    },
  },
});
