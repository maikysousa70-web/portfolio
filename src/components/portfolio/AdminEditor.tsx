import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Settings, Plus, Trash2, Save, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/lib/admin";
import { usePortfolioContent, type HeroContent, type SkillItem, type ExperienceItem, type ProjectItem, type CourseItem } from "@/lib/portfolio-content";
import { ease } from "./Motion";

export function AdminEditorButton() {
  const { isAdmin } = useAdmin();
  const [open, setOpen] = useState(false);

  if (!isAdmin) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="glass inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:text-foreground"
      >
        <Settings className="h-3.5 w-3.5" />
        Editar Conteúdo
      </button>
      <AdminEditorDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

function AdminEditorDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [activeTab, setActiveTab] = useState<"hero" | "skills" | "experience" | "projects" | "courses">("hero");

  const tabs = [
    { id: "hero" as const, label: "Perfil" },
    { id: "skills" as const, label: "Competências" },
    { id: "experience" as const, label: "Experiência" },
    { id: "projects" as const, label: "Projetos" },
    { id: "courses" as const, label: "Formação" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-h-[90vh] overflow-hidden rounded-3xl sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display">Editar Portfólio</DialogTitle>
          <DialogDescription>Altere qualquer informação do seu portfólio. As mudanças são salvas localmente.</DialogDescription>
        </DialogHeader>

        <div className="flex gap-1 overflow-x-auto border-b border-border pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-gradient-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto py-4">
          {activeTab === "hero" && <HeroEditor />}
          {activeTab === "skills" && <SkillsEditor />}
          {activeTab === "experience" && <ExperienceEditor />}
          {activeTab === "projects" && <ProjectsEditor />}
          {activeTab === "courses" && <CoursesEditor />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function HeroEditor() {
  const { content, updateHero, resetToDefaults } = usePortfolioContent();
  const [form, setForm] = useState<HeroContent>(content.hero);
  const [dirty, setDirty] = useState(false);

  const handleChange = (field: keyof HeroContent, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setDirty(true);
  };

  const handleSave = () => {
    updateHero(form);
    setDirty(false);
    toast.success("Perfil atualizado!");
  };

  const handleReset = () => {
    if (confirm("Restaurar todas as informações para os padrões originais?")) {
      resetToDefaults();
      setDirty(false);
      toast("Conteúdo restaurado para padrões originais");
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Nome completo</span>
          <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Status disponibilidade</span>
          <Input value={form.availability} onChange={(e) => handleChange("availability", e.target.value)} />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-muted-foreground">Título profissional</span>
        <Input value={form.title} onChange={(e) => handleChange("title", e.target.value)} />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-muted-foreground">Descrição resumida</span>
        <Textarea rows={3} value={form.description} onChange={(e) => handleChange("description", e.target.value)} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Telefone</span>
          <Input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">WhatsApp (URL)</span>
          <Input value={form.whatsapp} onChange={(e) => handleChange("whatsapp", e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">LinkedIn (URL)</span>
          <Input value={form.linkedin} onChange={(e) => handleChange("linkedin", e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">E-mail</span>
          <Input value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Localização</span>
          <Input value={form.location} onChange={(e) => handleChange("location", e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted-foreground">Anos de experiência</span>
          <Input value={form.yearsExperience} onChange={(e) => handleChange("yearsExperience", e.target.value)} />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-muted-foreground">Objetivo profissional</span>
        <Textarea rows={2} value={form.objective} onChange={(e) => handleChange("objective", e.target.value)} />
      </label>

      <div className="flex gap-2 pt-4">
        <Button onClick={handleSave} disabled={!dirty} className="bg-gradient-primary text-primary-foreground shadow-glow">
          <Save className="mr-2 h-4 w-4" /> Salvar Alterações
        </Button>
        <Button variant="outline" onClick={handleReset} className="glass">
          <RotateCcw className="mr-2 h-4 w-4" /> Restaurar Padrões
        </Button>
      </div>
    </div>
  );
}

function SkillsEditor() {
  const { content, updateSkill, addSkill, removeSkill } = usePortfolioContent();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState<SkillItem | null>(null);

  const startEdit = (skill: SkillItem) => {
    setEditingForm({ ...skill });
    setExpandedId(skill.id);
  };

  const cancelEdit = () => {
    setEditingForm(null);
    setExpandedId(null);
  };

  const saveEdit = () => {
    if (editingForm) {
      updateSkill(editingForm.id, editingForm);
      setEditingForm(null);
      setExpandedId(null);
      toast.success("Competência atualizada!");
    }
  };

  const handleAdd = () => {
    addSkill({
      tag: "Nova Categoria",
      title: "Nova Competência",
      desc: "Descrição da competência",
      chips: ["Chip 1", "Chip 2"],
    });
    toast.success("Competência adicionada!");
  };

  return (
    <div className="space-y-3">
      {content.skills.map((skill) => (
        <div key={skill.id} className="glass overflow-hidden rounded-2xl">
          <div
            className="flex cursor-pointer items-center justify-between p-4 hover:bg-secondary/30"
            onClick={() => expandedId === skill.id ? cancelEdit() : startEdit(skill)}
          >
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-primary">{skill.tag}</div>
              <div className="font-display font-semibold">{skill.title}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); removeSkill(skill.id); toast("Competência removida"); }}
                className="rounded-full p-2 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              {expandedId === skill.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>

          <AnimatePresence>
            {expandedId === skill.id && editingForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease }}
                className="overflow-hidden border-t border-border bg-secondary/20 p-4"
              >
                <div className="space-y-3">
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-muted-foreground">Categoria</span>
                    <Input value={editingForm.tag} onChange={(e) => setEditingForm({ ...editingForm, tag: e.target.value })} />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-muted-foreground">Título</span>
                    <Input value={editingForm.title} onChange={(e) => setEditingForm({ ...editingForm, title: e.target.value })} />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-muted-foreground">Descrição</span>
                    <Textarea rows={3} value={editingForm.desc} onChange={(e) => setEditingForm({ ...editingForm, desc: e.target.value })} />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-muted-foreground">Chips (separados por vírgula)</span>
                    <Input
                      value={editingForm.chips.join(", ")}
                      onChange={(e) => setEditingForm({ ...editingForm, chips: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                    />
                  </label>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" onClick={saveEdit} className="bg-gradient-primary text-primary-foreground">Salvar</Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit} className="glass">Cancelar</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      <Button onClick={handleAdd} variant="outline" className="w-full glass">
        <Plus className="mr-2 h-4 w-4" /> Adicionar Competência
      </Button>
    </div>
  );
}

function ExperienceEditor() {
  const { content, updateExperience, addExperience, removeExperience } = usePortfolioContent();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState<ExperienceItem | null>(null);

  const startEdit = (exp: ExperienceItem) => {
    setEditingForm({ ...exp });
    setExpandedId(exp.id);
  };

  const cancelEdit = () => {
    setEditingForm(null);
    setExpandedId(null);
  };

  const saveEdit = () => {
    if (editingForm) {
      updateExperience(editingForm.id, editingForm);
      setEditingForm(null);
      setExpandedId(null);
      toast.success("Experiência atualizada!");
    }
  };

  const handleAdd = () => {
    addExperience({
      role: "Novo Cargo",
      company: "Empresa",
      period: "2024 – Presente",
      location: "Presencial / Remoto",
      bullets: ["Responsabilidade 1", "Responsabilidade 2"],
      chips: ["Skill 1", "Skill 2"],
    });
    toast.success("Experiência adicionada!");
  };

  return (
    <div className="space-y-3">
      {content.experiences.map((exp) => (
        <div key={exp.id} className="glass overflow-hidden rounded-2xl">
          <div
            className="flex cursor-pointer items-center justify-between p-4 hover:bg-secondary/30"
            onClick={() => expandedId === exp.id ? cancelEdit() : startEdit(exp)}
          >
            <div>
              <div className="font-display font-semibold">{exp.role}</div>
              <div className="text-sm text-muted-foreground">{exp.company} · {exp.period}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); toast("Experiência removida"); }}
                className="rounded-full p-2 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              {expandedId === exp.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>

          <AnimatePresence>
            {expandedId === exp.id && editingForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease }}
                className="overflow-hidden border-t border-border bg-secondary/20 p-4"
              >
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-muted-foreground">Cargo</span>
                      <Input value={editingForm.role} onChange={(e) => setEditingForm({ ...editingForm, role: e.target.value })} />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-muted-foreground">Empresa</span>
                      <Input value={editingForm.company} onChange={(e) => setEditingForm({ ...editingForm, company: e.target.value })} />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-muted-foreground">Período</span>
                      <Input value={editingForm.period} onChange={(e) => setEditingForm({ ...editingForm, period: e.target.value })} />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-muted-foreground">Local/Tipo</span>
                      <Input value={editingForm.location} onChange={(e) => setEditingForm({ ...editingForm, location: e.target.value })} />
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-muted-foreground">Atividades (uma por linha)</span>
                    <Textarea
                      rows={4}
                      value={editingForm.bullets.join("\n")}
                      onChange={(e) => setEditingForm({ ...editingForm, bullets: e.target.value.split("\n").filter(Boolean) })}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-muted-foreground">Skills (separadas por vírgula)</span>
                    <Input
                      value={editingForm.chips.join(", ")}
                      onChange={(e) => setEditingForm({ ...editingForm, chips: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                    />
                  </label>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" onClick={saveEdit} className="bg-gradient-primary text-primary-foreground">Salvar</Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit} className="glass">Cancelar</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      <Button onClick={handleAdd} variant="outline" className="w-full glass">
        <Plus className="mr-2 h-4 w-4" /> Adicionar Experiência
      </Button>
    </div>
  );
}

function ProjectsEditor() {
  const { content, updateProject, addProject, removeProject } = usePortfolioContent();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState<ProjectItem | null>(null);

  const startEdit = (proj: ProjectItem) => {
    setEditingForm({ ...proj });
    setExpandedId(proj.id);
  };

  const cancelEdit = () => {
    setEditingForm(null);
    setExpandedId(null);
  };

  const saveEdit = () => {
    if (editingForm) {
      updateProject(editingForm.id, editingForm);
      setEditingForm(null);
      setExpandedId(null);
      toast.success("Projeto atualizado!");
    }
  };

  const handleAdd = () => {
    addProject({
      title: "Novo Projeto",
      subtitle: "Descrição curta",
      url: "https://",
      bullets: ["Feature 1", "Feature 2"],
      chips: ["Tech 1", "Tech 2"],
    });
    toast.success("Projeto adicionado!");
  };

  return (
    <div className="space-y-3">
      {content.projects.map((proj) => (
        <div key={proj.id} className="glass overflow-hidden rounded-2xl">
          <div
            className="flex cursor-pointer items-center justify-between p-4 hover:bg-secondary/30"
            onClick={() => expandedId === proj.id ? cancelEdit() : startEdit(proj)}
          >
            <div>
              <div className="font-display font-semibold">{proj.title}</div>
              <div className="text-sm text-muted-foreground">{proj.subtitle}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); removeProject(proj.id); toast("Projeto removido"); }}
                className="rounded-full p-2 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              {expandedId === proj.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>

          <AnimatePresence>
            {expandedId === proj.id && editingForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease }}
                className="overflow-hidden border-t border-border bg-secondary/20 p-4"
              >
                <div className="space-y-3">
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-muted-foreground">Título</span>
                    <Input value={editingForm.title} onChange={(e) => setEditingForm({ ...editingForm, title: e.target.value })} />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-muted-foreground">Subtítulo</span>
                    <Input value={editingForm.subtitle} onChange={(e) => setEditingForm({ ...editingForm, subtitle: e.target.value })} />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-muted-foreground">URL do projeto</span>
                    <Input value={editingForm.url} onChange={(e) => setEditingForm({ ...editingForm, url: e.target.value })} />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-muted-foreground">Destaques (um por linha)</span>
                    <Textarea
                      rows={3}
                      value={editingForm.bullets.join("\n")}
                      onChange={(e) => setEditingForm({ ...editingForm, bullets: e.target.value.split("\n").filter(Boolean) })}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-muted-foreground">Tecnologias (separadas por vírgula)</span>
                    <Input
                      value={editingForm.chips.join(", ")}
                      onChange={(e) => setEditingForm({ ...editingForm, chips: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                    />
                  </label>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" onClick={saveEdit} className="bg-gradient-primary text-primary-foreground">Salvar</Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit} className="glass">Cancelar</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      <Button onClick={handleAdd} variant="outline" className="w-full glass">
        <Plus className="mr-2 h-4 w-4" /> Adicionar Projeto
      </Button>
    </div>
  );
}

function CoursesEditor() {
  const { content, updateCourse, addCourse, removeCourse } = usePortfolioContent();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingForm, setEditingForm] = useState<CourseItem | null>(null);

  const startEdit = (course: CourseItem) => {
    setEditingForm({ ...course });
    setExpandedId(course.id);
  };

  const cancelEdit = () => {
    setEditingForm(null);
    setExpandedId(null);
  };

  const saveEdit = () => {
    if (editingForm) {
      updateCourse(editingForm.id, editingForm);
      setEditingForm(null);
      setExpandedId(null);
      toast.success("Curso atualizado!");
    }
  };

  const handleAdd = () => {
    addCourse({
      title: "Novo Curso",
      org: "Instituição",
      status: "Cursando",
      hasCertificate: false,
    });
    toast.success("Curso adicionado!");
  };

  return (
    <div className="space-y-3">
      {content.courses.map((course) => (
        <div key={course.id} className="glass overflow-hidden rounded-2xl">
          <div
            className="flex cursor-pointer items-center justify-between p-4 hover:bg-secondary/30"
            onClick={() => expandedId === course.id ? cancelEdit() : startEdit(course)}
          >
            <div>
              <div className="font-display font-semibold">{course.title}</div>
              <div className="text-sm text-muted-foreground">{course.org} · {course.status}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); removeCourse(course.id); toast("Curso removido"); }}
                className="rounded-full p-2 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              {expandedId === course.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>

          <AnimatePresence>
            {expandedId === course.id && editingForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease }}
                className="overflow-hidden border-t border-border bg-secondary/20 p-4"
              >
                <div className="space-y-3">
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-muted-foreground">Nome do curso</span>
                    <Input value={editingForm.title} onChange={(e) => setEditingForm({ ...editingForm, title: e.target.value })} />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-muted-foreground">Instituição</span>
                    <Input value={editingForm.org} onChange={(e) => setEditingForm({ ...editingForm, org: e.target.value })} />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-muted-foreground">Status/Ano</span>
                      <Input value={editingForm.status} onChange={(e) => setEditingForm({ ...editingForm, status: e.target.value })} />
                    </label>
                    <label className="flex items-center gap-3 pt-6">
                      <input
                        type="checkbox"
                        checked={editingForm.hasCertificate}
                        onChange={(e) => setEditingForm({ ...editingForm, hasCertificate: e.target.checked })}
                        className="h-4 w-4 rounded border-border"
                      />
                      <span className="text-sm text-muted-foreground">Possui certificado PDF</span>
                    </label>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" onClick={saveEdit} className="bg-gradient-primary text-primary-foreground">Salvar</Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit} className="glass">Cancelar</Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      <Button onClick={handleAdd} variant="outline" className="w-full glass">
        <Plus className="mr-2 h-4 w-4" /> Adicionar Curso
      </Button>
    </div>
  );
}