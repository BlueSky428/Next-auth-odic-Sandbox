import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import AccessDenied from "../components/access-denied";
import Layout from "../components/layout";

export default function ClientPage() {
  const { isLoggedIn, isLoading, session } = useAuthUser();

  if (typeof window !== undefined && isLoading) return null;
  if (!isLoggedIn) return <AccessDenied />;

  return (
    <Layout>
      ProtectedPage
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </Layout>
  );
}

function useAuthUser() {
  const { data: session, status } = useSession();

  // if (typeof window !== "undefined" && loading) return null;

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(!!session);
  }, [session]);

  return {
    user: session?.user ?? {},
    isLoggedIn,
    session,
    isLoading: status === "loading",
  };
}
