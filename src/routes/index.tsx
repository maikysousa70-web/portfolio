import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "motion/react";
import { Suspense, lazy, useEffect, useState } from "react";
import {
  Phone, Mail, Linkedin, MapPin, ShieldCheck, Cpu, Network, Code2, ArrowUpRight, Award, GraduationCap, Briefcase, Printer, Copy, X, ExternalLink, Check, FileText,
} from "lucide-react";
import { AdminProvider } from "@/lib/admin";
import { Reveal, GlassCard, ease } from "@/components/portfolio/Motion";
import fotoPerfil from "@/assets/perfil/foto.png";
import certCisco from "@/../certificados/DEFESA DE REDE-CISCO.pdf";
import certSuporte from "@/../certificados/SUPORTE DE TI-COURSERA.pdf";

// Lazy load admin components to keep them out of the public bundle for non-admin users
const AdminButton = lazy(() => import("@/components/portfolio/AdminUI").then(m => ({ default: m.AdminButton })));
const CategoryUpdates = lazy(() => import("@/components/portfolio/AdminUI").then(m => ({ default: m.CategoryUpdates })));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wesley Sousa de Oliveira | Suporte de TI & Infraestrutura" },
      { name: "description", content: "Portfólio de Wesley Sousa de Oliveira — Técnico de Suporte de TI, Help Desk, Redes e Hardware em Japeri, RJ." },
      { property: "og:title", content: "Wesley Sousa de Oliveira | Suporte de TI" },
      { property: "og:description", content: "Help Desk, hardware, redes e desenvolvimento web. 8 anos de experiência no Exército Brasileiro." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preload", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap", as: "style" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Wesley Sousa de Oliveira",
          jobTitle: "Técnico de Suporte de TI & Infraestrutura",
          email: "wesleysousaoliveira200@gmail.com",
          url: "https://japerivoolivre.com.br",
          address: { "@type": "PostalAddress", addressLocality: "Japeri", addressRegion: "RJ", addressCountry: "BR" },
          sameAs: ["https://www.linkedin.com/in/wesley-sousa-564b0516a"],
          knowsAbout: ["Suporte Técnico", "Help Desk", "Infraestrutura de Redes", "Hardware", "Cisco Network Defense"],
        }),
      },
    ],
  }),
  component: () => (
    <AdminProvider>
      <Portfolio />
    </AdminProvider>
  ),
});

const NAV = [
  { id: "competencias", label: "Competências" },
  { id: "experiencia", label: "Experiência" },
  { id: "projetos", label: "Projetos" },
  { id: "certificacoes", label: "Formação" },
];

const SKILLS = [
  { icon: Cpu, n: "01", tag: "Suporte & Diagnóstico", title: "Help Desk, Hardware & Sistemas",
    desc: "Manutenção preventiva e corretiva de microcomputadores, diagnóstico ágil de falhas físicas ou lógicas e atendimento claro ao usuário presencial ou remoto.",
    chips: ["Suporte Técnico / Help Desk", "Manutenção de Hardware", "Windows & Linux", "AnyDesk / TeamViewer / RDP", "Pacote Office"] },
  { icon: Network, n: "02", tag: "Redes & Cibersegurança", title: "Infraestrutura de Redes & Defesa",
    desc: "Administração de endereçamento e conectividade, gestão de identidades e controle de acesso, além de defesa de perímetro certificada pela Cisco.",
    chips: ["Protocolos TCP/IP", "DNS & DHCP", "Active Directory", "Segurança da Informação", "Monitoramento IDS/IPS"] },
  { icon: Code2, n: "03", tag: "Engenharia Web & Dados", title: "Desenvolvimento Web, Cloud & IA",
    desc: "Construção e deploy contínuo de aplicações web modernas com banco de dados relacional em nuvem e produtividade acelerada com IA generativa.",
    chips: ["Desenvolvimento Web", "Vercel (CI/CD Deploy)", "Neon (PostgreSQL)", "VS Code & Claude Code", "Gestão de Estoque TI"] },
];

const COURSES = [
  ["Téc. em Desenvolvimento de Sistemas", "IFSUDESTEMG", "Cursando"],
  ["Téc. em Eletrotécnica", "FIRJAN-SENAI", "Cursando"],
  ["Suporte de TI (Google IT Support)", "Coursera / Google", "Cursando"],
  ["Análise de Dados (Google Cloud)", "Coursera / Google", "Cursando"],
  ["Inteligência Artificial", "EBAC", "Cursando"],
  ["Montagem e Manutenção de PCs", "Cursa.app", "2026"],
  ["Informática Básica", "Cursa.app", "2026"],
  ["Defesa de Redes", "Cisco Networking Academy", "2025"],
  ["Ensino Médio Completo", "MEC-RJ", "2024"],
];

const CERTIFICATES = [
  { name: "Defesa de Redes", issuer: "Cisco Networking Academy", year: "2025", file: certCisco },
  { name: "Suporte de TI", issuer: "Coursera / Google", year: "Cursando", file: certSuporte },
];

const EMAIL_PROVIDERS = [
  { name: "Gmail", url: "https://mail.google.com/mail/?view=cm&fs=1&to=wesleysousaoliveira200@gmail.com", icon: "G" },
  { name: "Outlook/Hotmail", url: "https://outlook.live.com/mail/0/compose?to=wesleysousaoliveira200@gmail.com", icon: "O" },
  { name: "Yahoo", url: "https://compose.mail.yahoo.com/?to=wesleysousaoliveira200@gmail.com", icon: "Y" },
];

function Portfolio() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroO = useTransform(scrollYProgress, [0, 0.25], [1, 0.3]);
  const [active, setActive] = useState("");
  const [emailMenuOpen, setEmailMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedCert, setSelectedCert] = useState<typeof CERTIFICATES[number] | null>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    NAV.forEach((n) => { const el = document.getElementById(n.id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("wesleysousaoliveira200@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="aurora-blob left-[-10%] top-[-10%] h-[50vw] w-[50vw] bg-[var(--glow-1)]" />
        <div className="aurora-blob right-[-15%] top-[20%] h-[40vw] w-[40vw] bg-[var(--glow-2)] [animation-delay:-80s] [animation-direction:alternate-reverse]" />
        <div className="aurora-blob bottom-[-20%] left-[20%] h-[45vw] w-[45vw] bg-[var(--glow-3)] [animation-delay:-160s]" />
        <div className="grid-bg absolute inset-0" />
      </div>

      <motion.div style={{ scaleX: progress }} className="bg-gradient-primary fixed inset-x-0 top-0 z-[60] h-0.5 origin-left" />

      {/* Nav */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease }}
        className="fixed inset-x-0 top-3 z-50 mx-auto flex w-[min(1100px,calc(100%-1.5rem))] items-center justify-between gap-3 rounded-full glass-strong px-3 py-2"
      >
        <a href="#top" className="flex items-center gap-2.5 pl-1">
          <span className="bg-gradient-primary grid h-8 w-8 place-items-center rounded-full font-display text-xs font-bold text-primary-foreground">WS</span>
          <span className="hidden font-display text-sm font-semibold sm:block">Wesley Oliveira</span>
        </a>
        <nav role="navigation" aria-label="Navegação principal" className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} aria-current={active === n.id ? "page" : undefined} className="relative rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
              {active === n.id && (
                <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-secondary" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
              )}
              <span className={active === n.id ? "text-foreground" : ""}>{n.label}</span>
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Suspense fallback={null}><AdminButton /></Suspense>
          <a href="https://wa.me/5521965253742" target="_blank" rel="noreferrer" className="bg-gradient-primary shadow-glow rounded-full px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]">
            Contato
          </a>
        </div>
      </motion.header>

      <main id="top" className="mx-auto max-w-6xl px-5 pb-24 pt-32 sm:pt-40">
        {/* Hero */}
        <motion.section style={{ y: heroY, opacity: heroO }} className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6, ease }}
              className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2"><span className="animate-pulse-dot absolute h-full w-full rounded-full bg-accent" /><span className="relative h-2 w-2 rounded-full bg-accent" /></span>
              Disponível · Suporte Técnico / Help Desk
            </motion.div>
            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.02] sm:text-7xl">
              {["Wesley Sousa", "de Oliveira"].map((line, i) => (
                <span key={line} className="block overflow-hidden pb-1">
                  <motion.span className={`block ${i === 1 ? "text-gradient" : ""}`} initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.3 + i * 0.12, duration: 0.9, ease }}>
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <Reveal delay={0.6}>
              <p className="mt-5 text-lg font-medium text-foreground/90">Técnico de Suporte de TI · Hardware, Redes & Atendimento ao Usuário</p>
              <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
                Experiência prática em manutenção de hardware, suporte a usuários e diagnóstico de sistemas Windows e Linux. Traduzo problemas técnicos em soluções simples, com fundamentos sólidos em TCP/IP, DNS, DHCP, Active Directory e segurança da informação.
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {[
                  { icon: Phone, t: "(21) 96525-3742", h: "https://wa.me/5521965253742" },
                  { icon: Linkedin, t: "LinkedIn", h: "https://www.linkedin.com/in/wesley-sousa-564b0516a" },
                ].map(({ icon: I, t, h }) => (
                  <a key={t} href={h} target="_blank" rel="noreferrer" className="glass group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors hover:text-primary">
                    <I className="h-4 w-4" /> {t}
                    <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                  </a>
                ))}
                {/* Email button with dropdown menu */}
                <div className="relative">
                  <button
                    onClick={() => setEmailMenuOpen(!emailMenuOpen)}
                    className="glass group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors hover:text-primary"
                  >
                    <Mail className="h-4 w-4" /> E-mail
                    <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                  </button>
                  <AnimatePresence>
                    {emailMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-2 z-50 min-w-[280px] rounded-2xl glass-strong p-3 shadow-xl"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-muted-foreground">Enviar para:</span>
                          <button onClick={() => setEmailMenuOpen(false)} className="rounded-full p-1 hover:bg-secondary/50">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="space-y-1.5">
                          {EMAIL_PROVIDERS.map((provider) => (
                            <a
                              key={provider.name}
                              href={provider.url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-2 rounded-xl bg-secondary/40 px-3 py-2 text-sm transition-colors hover:bg-secondary/70"
                            >
                              <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/20 text-xs font-bold">{provider.icon}</span>
                              {provider.name}
                              <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground" />
                            </a>
                          ))}
                          <button
                            onClick={handleCopyEmail}
                            className="flex w-full items-center gap-2 rounded-xl bg-secondary/40 px-3 py-2 text-sm transition-colors hover:bg-secondary/70"
                          >
                            {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                            {copied ? "Copiado!" : "Copiar endereço"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <span className="inline-flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" /> Japeri, RJ</span>
              </div>
            </Reveal>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.94, rotate: -1 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: 0.5, duration: 1, ease }}>
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Síntese</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] text-accent"><ShieldCheck className="h-3 w-3" /> VERIFICADO</span>
              </div>
              {/* Profile Photo */}
              <div className="mt-4 flex justify-center">
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-border shadow-lg">
                  <img src={fotoPerfil} alt="Wesley Sousa de Oliveira" className="h-full w-full object-cover" />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-secondary/60 p-4">
                  <div className="text-gradient font-display text-4xl font-extrabold">8</div>
                  <div className="mt-1 text-xs text-muted-foreground">anos de suporte técnico & logística (Exército)</div>
                </div>
                <div className="rounded-2xl bg-secondary/60 p-4">
                  <div className="text-gradient font-display text-4xl font-extrabold">Cisco</div>
                  <div className="mt-1 text-xs text-muted-foreground">Network Defense · IDS/IPS</div>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-border p-4 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Objetivo · </span>
                Vaga de Suporte Técnico / Help Desk em empresa que valorize disciplina, aprendizado contínuo e evolução técnica.
              </div>
              <button onClick={() => window.print()} aria-label="Imprimir ou salvar como PDF" className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary">
                <Printer className="h-3.5 w-3.5" /> Imprimir / salvar PDF
              </button>
            </GlassCard>
          </motion.div>
        </motion.section>

        {/* Skills */}
        <Section id="competencias" kicker="Stack técnica" title="Competências & Ferramentas" sub="Disponibilidade de sistemas, suporte ao usuário e infraestrutura.">
          <div className="grid gap-5 md:grid-cols-3">
            {SKILLS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1} className="h-full">
                <GlassCard className="flex h-full flex-col p-6">
                  <div className="flex items-center justify-between">
                    <span className="bg-gradient-primary grid h-11 w-11 place-items-center rounded-2xl text-primary-foreground"><s.icon className="h-5 w-5" /></span>
                    <span className="font-mono text-sm text-muted-foreground">{s.n}</span>
                  </div>
                  <div className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">{s.tag}</div>
                  <h3 className="mt-1 font-display text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
                    {s.chips.map((c) => <span key={c} className="rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px]">{c}</span>)}
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
          <CategoryUpdates category="competencias" />
        </Section>

        {/* Experience */}
        <Section id="experiencia" kicker="Trajetória" title="Experiência Profissional" sub="Histórico prático em infraestrutura crítica.">
          <Reveal>
            <GlassCard className="p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-4">
                  <span className="bg-gradient-primary grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-primary-foreground"><Briefcase className="h-5 w-5" /></span>
                  <div>
                    <h3 className="font-display text-xl font-bold">Suporte Técnico — Exército Brasileiro</h3>
                    <p className="text-sm text-muted-foreground">Presencial · Infraestrutura de TI, Almoxarifado Técnico & Segurança</p>
                  </div>
                </div>
                <span className="glass rounded-full px-3 py-1 font-mono text-xs">2018 – 2026 · 8 anos</span>
              </div>
              <Bullets items={[
                "Manutenção preventiva e corretiva de microcomputadores, com diagnóstico de hardware e software, reduzindo o tempo de inatividade dos equipamentos.",
                "Controle de estoque de materiais de TI e suprimentos por meio de gestão logística, garantindo rastreabilidade e organização do almoxarifado.",
                "Controle de acesso a sistemas e instalações críticas por meio de escalas de segurança, assegurando conformidade com protocolos rigorosos.",
              ]} />
              <Chips items={["Diagnóstico de Hardware", "Redução de Downtime", "Gestão Logística de TI", "Controle de Acesso"]} />
            </GlassCard>
          </Reveal>
          <CategoryUpdates category="experiencia" />
        </Section>

        {/* Projects */}
        <Section id="projetos" kicker="Em produção" title="Projetos" sub="Entregas reais, do código ao deploy.">
          <Reveal>
            <GlassCard className="p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-4">
                  <span className="bg-gradient-primary grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-primary-foreground"><Code2 className="h-5 w-5" /></span>
                  <div>
                    <h3 className="font-display text-xl font-bold">Desenvolvedor Web — japerivoolivre.com.br</h3>
                    <p className="text-sm text-muted-foreground">Projeto independente · Full-Stack & Cloud Deploy</p>
                  </div>
                </div>
                <a href="https://japerivoolivre.com.br" target="_blank" rel="noreferrer" className="bg-gradient-primary inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03]">
                  Acessar site <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
              <Bullets items={[
                "Desenvolvi um site funcional do zero com VS Code e IA generativa (Claude Code), entregando uma aplicação web completa em produção.",
                "Implementei hospedagem e deploy contínuo na Vercel, garantindo disponibilidade e atualização ágil.",
                "Estruturei a persistência de dados com Neon (PostgreSQL), viabilizando o funcionamento dinâmico do site.",
              ]} />
              <Chips items={["VS Code", "Claude Code (IA)", "Vercel CI/CD", "Neon PostgreSQL"]} />
            </GlassCard>
          </Reveal>
          <CategoryUpdates category="projetos" />
        </Section>

        {/* Certs */}
        <Section id="certificacoes" kicker="Credenciais" title="Certificações & Formação" sub="Credenciais verificadas e ensino técnico.">
          <div className="grid gap-5 lg:grid-cols-[1fr_1.6fr]">
            <Reveal>
              <GlassCard className="h-full p-6">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10px] text-accent"><Award className="h-3 w-3" /> CREDENCIAL VERIFICADA</span>
                <div className="mt-5 font-mono text-xs text-muted-foreground">Cisco · 2025</div>
                <h3 className="mt-1 font-display text-2xl font-bold">Network Defense</h3>
                <p className="text-sm text-primary">Cisco Networking Academy</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Fundamentos de cibersegurança, defesa de perímetro e monitoramento de tráfego (IDS/IPS).</p>
              </GlassCard>
            </Reveal>
            <Reveal delay={0.1}>
              <GlassCard className="p-6">
                <div className="mb-4 flex items-center gap-2 font-display font-semibold"><GraduationCap className="h-5 w-5 text-primary" /> Formação, cursos & qualificações</div>
                <ul className="divide-y divide-border">
                  {COURSES.map(([t, o, s], i) => (
                    <motion.li
                      key={t}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05, duration: 0.5, ease }}
                      className="flex cursor-pointer items-center justify-between gap-3 py-2.5 transition-colors hover:bg-secondary/30"
                      onClick={() => {
                        const cert = CERTIFICATES.find(c => c.name.includes(t.split("(")[0].trim()) || t.includes(c.name));
                        if (cert) setSelectedCert(cert);
                      }}
                    >
                      <div>
                        <div className="text-sm font-medium">{t}</div>
                        <div className="text-xs text-muted-foreground">{o}</div>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[11px] ${s === "Cursando" ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>{s}</span>
                    </motion.li>
                  ))}
                </ul>
              </GlassCard>
            </Reveal>
          </div>
          <CategoryUpdates category="certificacoes" />
        </Section>

        <Reveal>
          <footer className="glass mt-28 flex flex-col items-center gap-4 rounded-3xl p-10 text-center">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Vamos <span className="text-gradient">conversar?</span></h2>
            <p className="max-w-md text-muted-foreground">Pronto para contribuir com sua equipe de TI.</p>
            <a href="mailto:wesleysousaoliveira200@gmail.com" className="bg-gradient-primary shadow-glow inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-primary-foreground transition-transform hover:scale-[1.03]">
              <Mail className="h-4 w-4" /> wesleysousaoliveira200@gmail.com
            </a>
            <p className="mt-4 font-mono text-xs text-muted-foreground">© {new Date().getFullYear()} Wesley Sousa de Oliveira</p>
          </footer>
        </Reveal>
      </main>

      {/* Certificate Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="glass-strong relative max-h-[90vh] max-w-4xl overflow-auto rounded-3xl p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedCert(null)}
                className="absolute right-4 top-4 rounded-full bg-secondary/50 p-2 transition-colors hover:bg-secondary/80"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="mb-4">
                <h3 className="font-display text-2xl font-bold">{selectedCert.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedCert.issuer} · {selectedCert.year}</p>
              </div>
              <div className="rounded-2xl bg-secondary/30 p-4">
                <iframe
                  src={selectedCert.file}
                  className="aspect-video w-full rounded-xl bg-background/50"
                  title={selectedCert.name}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ id, kicker, title, sub, children }: { id: string; kicker: string; title: string; sub: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 pt-28">
      <Reveal className="mb-10">
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-primary">{kicker}</div>
        <h2 className="mt-2 font-display text-3xl font-bold sm:text-5xl">{title}</h2>
        <p className="mt-3 text-muted-foreground">{sub}</p>
      </Reveal>
      {children}
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((t) => (
        <li key={t} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
          <span className="bg-gradient-primary mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />{t}
        </li>
      ))}
    </ul>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <div className="mt-6 flex flex-wrap gap-1.5">
      {items.map((c) => <span key={c} className="rounded-full border border-border bg-secondary/50 px-2.5 py-1 text-[11px]">{c}</span>)}
    </div>
  );
}