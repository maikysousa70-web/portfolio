import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export interface HeroContent {
  name: string;
  title: string;
  description: string;
  availability: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
  email: string;
  location: string;
  objective: string;
  yearsExperience: string;
  experienceLabel: string;
  certificationHighlight: string;
  certificationLabel: string;
}

export interface SkillItem {
  id: string;
  tag: string;
  title: string;
  desc: string;
  chips: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  bullets: string[];
  chips: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  bullets: string[];
  chips: string[];
}

export interface CourseItem {
  id: string;
  title: string;
  org: string;
  status: string;
  hasCertificate: boolean;
}

export interface PortfolioContent {
  hero: HeroContent;
  skills: SkillItem[];
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  courses: CourseItem[];
}

const DEFAULT_CONTENT: PortfolioContent = {
  hero: {
    name: "Wesley Sousa de Oliveira",
    title: "Técnico de Suporte de TI · Hardware, Redes & Atendimento ao Usuário",
    description: "Experiência prática em manutenção de hardware, suporte a usuários e diagnóstico de sistemas Windows e Linux. Traduzo problemas técnicos em soluções simples, com fundamentos sólidos em TCP/IP, DNS, DHCP, Active Directory e segurança da informação.",
    availability: "Disponível · Suporte Técnico / Help Desk",
    phone: "(21) 96525-3742",
    whatsapp: "https://wa.me/5521965253742",
    linkedin: "https://www.linkedin.com/in/wesley-sousa-564b0516a",
    email: "wesleysousaoliveira200@gmail.com",
    location: "Japeri, RJ",
    objective: "Vaga de Suporte Técnico / Help Desk em empresa que valorize disciplina, aprendizado contínuo e evolução técnica.",
    yearsExperience: "8",
    experienceLabel: "anos de suporte técnico & logística (Exército)",
    certificationHighlight: "Cisco",
    certificationLabel: "Network Defense · IDS/IPS",
  },
  skills: [
    {
      id: "skill-1",
      tag: "Suporte & Diagnóstico",
      title: "Help Desk, Hardware & Sistemas",
      desc: "Manutenção preventiva e corretiva de microcomputadores, diagnóstico ágil de falhas físicas ou lógicas e atendimento claro ao usuário presencial ou remoto.",
      chips: ["Suporte Técnico / Help Desk", "Manutenção de Hardware", "Windows & Linux", "AnyDesk / TeamViewer / RDP", "Pacote Office"],
    },
    {
      id: "skill-2",
      tag: "Redes & Cibersegurança",
      title: "Infraestrutura de Redes & Defesa",
      desc: "Administração de endereçamento e conectividade, gestão de identidades e controle de acesso, além de defesa de perímetro certificada pela Cisco.",
      chips: ["Protocolos TCP/IP", "DNS & DHCP", "Active Directory", "Segurança da Informação", "Monitoramento IDS/IPS"],
    },
    {
      id: "skill-3",
      tag: "Engenharia Web & Dados",
      title: "Desenvolvimento Web, Cloud & IA",
      desc: "Construção e deploy contínuo de aplicações web modernas com banco de dados relacional em nuvem e produtividade acelerada com IA generativa.",
      chips: ["Desenvolvimento Web", "Vercel (CI/CD Deploy)", "Neon (PostgreSQL)", "VS Code & Claude Code", "Gestão de Estoque TI"],
    },
  ],
  experiences: [
    {
      id: "exp-1",
      role: "Suporte Técnico",
      company: "Exército Brasileiro",
      period: "2018 – 2026 · 8 anos",
      location: "Presencial · Infraestrutura de TI, Almoxarifado Técnico & Segurança",
      bullets: [
        "Manutenção preventiva e corretiva de microcomputadores, com diagnóstico de hardware e software, reduzindo o tempo de inatividade dos equipamentos.",
        "Controle de estoque de materiais de TI e suprimentos por meio de gestão logística, garantindo rastreabilidade e organização do almoxarifado.",
        "Controle de acesso a sistemas e instalações críticas por meio de escalas de segurança, assegurando conformidade com protocolos rigorosos.",
      ],
      chips: ["Diagnóstico de Hardware", "Redução de Downtime", "Gestão Logística de TI", "Controle de Acesso"],
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "Desenvolvedor Web — japerivoolivre.com.br",
      subtitle: "Projeto independente · Full-Stack & Cloud Deploy",
      url: "https://japerivoolivre.com.br",
      bullets: [
        "Desenvolvi um site funcional do zero com VS Code e IA generativa (Claude Code), entregando uma aplicação web completa em produção.",
        "Implementei hospedagem e deploy contínuo na Vercel, garantindo disponibilidade e atualização ágil.",
        "Estruturei a persistência de dados com Neon (PostgreSQL), viabilizando o funcionamento dinâmico do site.",
      ],
      chips: ["VS Code", "Claude Code (IA)", "Vercel CI/CD", "Neon PostgreSQL"],
    },
  ],
  courses: [
    { id: "course-1", title: "Téc. em Desenvolvimento de Sistemas", org: "IFSUDESTEMG", status: "Cursando", hasCertificate: false },
    { id: "course-2", title: "Téc. em Eletrotécnica", org: "FIRJAN-SENAI", status: "Cursando", hasCertificate: false },
    { id: "course-3", title: "Suporte de TI (Google IT Support)", org: "Coursera / Google", status: "Cursando", hasCertificate: true },
    { id: "course-4", title: "Análise de Dados (Google Cloud)", org: "Coursera / Google", status: "Cursando", hasCertificate: false },
    { id: "course-5", title: "Inteligência Artificial", org: "EBAC", status: "Cursando", hasCertificate: false },
    { id: "course-6", title: "Montagem e Manutenção de PCs", org: "Cursa.app", status: "2026", hasCertificate: false },
    { id: "course-7", title: "Informática Básica", org: "Cursa.app", status: "2026", hasCertificate: false },
    { id: "course-8", title: "Defesa de Redes", org: "Cisco Networking Academy", status: "2025", hasCertificate: true },
    { id: "course-9", title: "Ensino Médio Completo", org: "MEC-RJ", status: "2024", hasCertificate: false },
  ],
};

const STORAGE_KEY = "portfolio_content";

interface PortfolioContentState {
  content: PortfolioContent;
  updateHero: (hero: Partial<HeroContent>) => void;
  updateSkill: (id: string, skill: Partial<SkillItem>) => void;
  addSkill: (skill: Omit<SkillItem, "id">) => void;
  removeSkill: (id: string) => void;
  updateExperience: (id: string, exp: Partial<ExperienceItem>) => void;
  addExperience: (exp: Omit<ExperienceItem, "id">) => void;
  removeExperience: (id: string) => void;
  updateProject: (id: string, proj: Partial<ProjectItem>) => void;
  addProject: (proj: Omit<ProjectItem, "id">) => void;
  removeProject: (id: string) => void;
  updateCourse: (id: string, course: Partial<CourseItem>) => void;
  addCourse: (course: Omit<CourseItem, "id">) => void;
  removeCourse: (id: string) => void;
  resetToDefaults: () => void;
}

const Ctx = createContext<PortfolioContentState | null>(null);

function loadContent(): PortfolioContent {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as PortfolioContent;
      // Merge with defaults to handle new fields
      return {
        hero: { ...DEFAULT_CONTENT.hero, ...parsed.hero },
        skills: parsed.skills?.length ? parsed.skills : DEFAULT_CONTENT.skills,
        experiences: parsed.experiences?.length ? parsed.experiences : DEFAULT_CONTENT.experiences,
        projects: parsed.projects?.length ? parsed.projects : DEFAULT_CONTENT.projects,
        courses: parsed.courses?.length ? parsed.courses : DEFAULT_CONTENT.courses,
      };
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_CONTENT;
}

function saveContent(content: PortfolioContent) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  } catch {
    // Ignore storage errors
  }
}

export function PortfolioContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<PortfolioContent>(loadContent);

  useEffect(() => {
    saveContent(content);
  }, [content]);

  const updateHero = useCallback((updates: Partial<HeroContent>) => {
    setContent((prev) => ({ ...prev, hero: { ...prev.hero, ...updates } }));
  }, []);

  const updateSkill = useCallback((id: string, updates: Partial<SkillItem>) => {
    setContent((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  }, []);

  const addSkill = useCallback((skill: Omit<SkillItem, "id">) => {
    setContent((prev) => ({
      ...prev,
      skills: [...prev.skills, { ...skill, id: `skill-${Date.now()}` }],
    }));
  }, []);

  const removeSkill = useCallback((id: string) => {
    setContent((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.id !== id),
    }));
  }, []);

  const updateExperience = useCallback((id: string, updates: Partial<ExperienceItem>) => {
    setContent((prev) => ({
      ...prev,
      experiences: prev.experiences.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  }, []);

  const addExperience = useCallback((exp: Omit<ExperienceItem, "id">) => {
    setContent((prev) => ({
      ...prev,
      experiences: [...prev.experiences, { ...exp, id: `exp-${Date.now()}` }],
    }));
  }, []);

  const removeExperience = useCallback((id: string) => {
    setContent((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((e) => e.id !== id),
    }));
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<ProjectItem>) => {
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  }, []);

  const addProject = useCallback((proj: Omit<ProjectItem, "id">) => {
    setContent((prev) => ({
      ...prev,
      projects: [...prev.projects, { ...proj, id: `proj-${Date.now()}` }],
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setContent((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
  }, []);

  const updateCourse = useCallback((id: string, updates: Partial<CourseItem>) => {
    setContent((prev) => ({
      ...prev,
      courses: prev.courses.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  }, []);

  const addCourse = useCallback((course: Omit<CourseItem, "id">) => {
    setContent((prev) => ({
      ...prev,
      courses: [...prev.courses, { ...course, id: `course-${Date.now()}` }],
    }));
  }, []);

  const removeCourse = useCallback((id: string) => {
    setContent((prev) => ({
      ...prev,
      courses: prev.courses.filter((c) => c.id !== id),
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setContent(DEFAULT_CONTENT);
  }, []);

  return (
    <Ctx.Provider
      value={{
        content,
        updateHero,
        updateSkill,
        addSkill,
        removeSkill,
        updateExperience,
        addExperience,
        removeExperience,
        updateProject,
        addProject,
        removeProject,
        updateCourse,
        addCourse,
        removeCourse,
        resetToDefaults,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function usePortfolioContent() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePortfolioContent must be used within PortfolioContentProvider");
  return ctx;
}

export { DEFAULT_CONTENT };