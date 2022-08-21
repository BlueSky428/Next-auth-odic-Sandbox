import { SessionProvider, signIn, useSession } from "next-auth/react";
import "./styles.css";

import type { AppProps } from "next/app";
import { useEffect, useState } from "react";

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <RouteGuard isPublic={Component?.isPublic}>
        <Component {...pageProps} />
      </RouteGuard>
    </SessionProvider>
  );
}

interface RouteGuardProps {
  children: React.ReactNode;
  isPublic?: boolean;
}
function RouteGuard({ children, isPublic = false }: RouteGuardProps) {
  const { isLoggedIn, isLoading } = useAuthUser();

  if (isPublic) return <>{children}</>;

  if (typeof window !== undefined && isLoading) return null;
  if (!isLoggedIn) {
    signIn("oidc");
    return null;
  }

  return <>{children}</>;
}

function useAuthUser() {
  const { data: session, status } = useSession();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(!!session);

    if (session?.error === "RefreshAccessTokenError") signIn("oidc"); // Force sign in to hopefully resolve error
  }, [session]);

  return {
    user: session?.user ?? {},
    isLoggedIn,
    session,
    isLoading: status === "loading",
  };
}
