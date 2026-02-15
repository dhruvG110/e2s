import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

useEffect(() => {
  let isMounted = true;

  const checkAdmin = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!isMounted) return;
    setIsAdmin(!!data && !error);
  };

  const handleSession = async (session: Session | null) => {
    if (!isMounted) return;

    setSession(session);
    setUser(session?.user ?? null);

    if (session?.user) {
      await checkAdmin(session.user.id);
    } else {
      setIsAdmin(false);
    }

    if (isMounted) setLoading(false);
  };

  // Initial session load
  supabase.auth.getSession().then(({ data }) => {
    handleSession(data.session);
  });

  // Auth state listener
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    handleSession(session);
  });

  return () => {
    isMounted = false;
    subscription.unsubscribe();
  };
}, []);


  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
