import { SessionProvider, signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import "./styles.css";

import type { AppProps } from "next/app";

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <PrivateRoutes>
        <Component {...pageProps} />
      </PrivateRoutes>
    </SessionProvider>
  );
}

interface PrivateRoutesProps {
  children: React.ReactNode;
}
function PrivateRoutes({ children }: PrivateRoutesProps) {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn("oidc"); // Force sign in to hopefully resolve error
    }
  }, [session]);
  return <>{children}</>;
}
