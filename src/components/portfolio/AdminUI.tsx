import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Lock, LogOut, Plus, Trash2, ExternalLink, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAdmin, type Category, CATEGORY_LABEL } from "@/lib/admin";
import { ease } from "./Motion";

export function AdminButton() {
  const { isAdmin, login, logout } = useAdmin();
  const [open, setOpen] = useState(false);
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [busy, setBusy] = useState(false);

  if (isAdmin)
    return (
      <button
        onClick={async () => {
          await logout();
          toast("Sessão de admin encerrada");
        }}
        className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:text-foreground"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-accent" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
        </span>
        Admin <LogOut className="h-3.5 w-3.5" />
      </button>
    );

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const err = await login(u, p);
    setBusy(false);
    if (err) { toast.error(err); return; }
    setOpen(false);
    setU("");
    setP("");
    toast.success("Bem-vindo, admin!");
  };

  return (
    <>
      <button
        aria-label="Entrar como admin"
        onClick={() => setOpen(true)}
        className="glass grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:text-primary"
      >
        <Lock className="h-3.5 w-3.5" />
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass-strong rounded-3xl sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Área do administrador</DialogTitle>
            <DialogDescription>Acesso restrito para publicar atualizações.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-3">
            <Input placeholder="Login" autoComplete="username" value={u} onChange={(e) => setU(e.target.value)} required />
            <Input placeholder="Senha" type="password" autoComplete="current-password" value={p} onChange={(e) => setP(e.target.value)} required />
            <Button type="submit" disabled={busy} className="w-full bg-gradient-primary text-primary-foreground shadow-glow">
              {busy ? "Entrando…" : "Entrar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function CategoryUpdates({ category }: { category: Category }) {
  const { isAdmin, updates, add, remove } = useAdmin();
  const items = updates.filter((x) => x.category === category);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const err = await add({ category, title: title.trim(), content: content.trim(), link: link.trim() || null });
    if (err) { toast.error(err); return; }
    setTitle("");
    setContent("");
    setLink("");
    setOpen(false);
    toast.success(`Atualização publicada em ${CATEGORY_LABEL[category]}`);
  };

  if (!items.length && !isAdmin) return null;

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Atualizações recentes
        </h3>
        {isAdmin && (
          <Button size="sm" variant="outline" onClick={() => setOpen((o) => !o)} className="glass rounded-full">
            <Plus className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
            {open ? "Cancelar" : "Nova atualização"}
          </Button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease }}
            className="overflow-hidden"
          >
            <div className="glass mb-4 space-y-3 rounded-2xl p-4">
              <Input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={140} />
              <Textarea placeholder="Descrição" value={content} onChange={(e) => setContent(e.target.value)} rows={3} maxLength={2000} />
              <Input placeholder="Link (opcional)" type="url" value={link} onChange={(e) => setLink(e.target.value)} />
              <Button type="submit" className="bg-gradient-primary text-primary-foreground">Publicar</Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <ul className="grid gap-3 sm:grid-cols-2">
        <AnimatePresence>
          {items.map((it, i) => (
            <motion.li
              key={it.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.45, ease, delay: i * 0.04 }}
              className="glass group relative rounded-2xl p-4"
            >
              <div className="font-mono text-[11px] text-muted-foreground">
                {new Date(it.created_at).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
              </div>
              <div className="mt-1 font-display font-semibold">{it.title}</div>
              {it.content && <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{it.content}</p>}
              {it.link && (
                <a href={it.link} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                  Abrir link <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {isAdmin && (
                <button
                  aria-label="Excluir"
                  onClick={() => remove(it.id)}
                  className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {isAdmin && !items.length && !open && (
        <p className="text-sm text-muted-foreground">Nenhuma atualização ainda nesta categoria.</p>
      )}
    </div>
  );
}
