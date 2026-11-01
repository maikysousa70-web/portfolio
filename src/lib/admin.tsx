import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export const ADMIN_DOMAIN = "admin.local";
export const usernameToEmail = (u: string) =>
  `${u.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "")}@${ADMIN_DOMAIN}`;

export type Category = "competencias" | "experiencia" | "projetos" | "certificacoes";
export const CATEGORY_LABEL: Record<Category, string> = {
  competencias: "Competências",
  experiencia: "Experiência",
  projetos: "Projetos",
  certificacoes: "Certificações",
};

export interface PortfolioUpdate {
  id: string;
  category: string;
  title: string;
  content: string;
  link: string | null;
  created_at: string;
}

interface AdminState {
  isAdmin: boolean;
  updates: PortfolioUpdate[];
  login: (u: string, p: string) => Promise<string | null>;
  logout: () => Promise<void>;
  add: (u: Omit<PortfolioUpdate, "id" | "created_at">) => Promise<string | null>;
  remove: (id: string) => Promise<void>;
}

const Ctx = createContext<AdminState | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [updates, setUpdates] = useState<PortfolioUpdate[]>([]);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("portfolio_updates")
      .select("*")
      .order("created_at", { ascending: false });
    setUpdates(data ?? []);
  }, []);

  const checkRole = useCallback(async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return setIsAdmin(false);
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin");
    setIsAdmin(!!data?.length);
  }, []);

  useEffect(() => {
    load();
    checkRole();
    const { data } = supabase.auth.onAuthStateChange((e) => {
      if (e === "SIGNED_IN" || e === "SIGNED_OUT") setTimeout(checkRole, 0);
    });
    return () => data.subscription.unsubscribe();
  }, [load, checkRole]);

  const value: AdminState = {
    isAdmin,
    updates,
    login: async (u, p) => {
      const { error } = await supabase.auth.signInWithPassword({ email: usernameToEmail(u), password: p });
      if (error) return "Usuário ou senha inválidos";
      await checkRole();
      return null;
    },
    logout: async () => {
      await supabase.auth.signOut();
      setIsAdmin(false);
    },
    add: async (row) => {
      const { error } = await supabase.from("portfolio_updates").insert(row);
      if (error) return error.message;
      await load();
      return null;
    },
    remove: async (id) => {
      await supabase.from("portfolio_updates").delete().eq("id", id);
      await load();
    },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAdmin = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAdmin outside provider");
  return c;
};
