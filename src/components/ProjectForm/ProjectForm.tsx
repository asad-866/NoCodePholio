"use client";

// --- IMPORT useMemo ---
import React, { useState, ChangeEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import "./ProjectForm.css";
import {
  FaUser,
  FaEnvelope,
  FaLink,
  FaCode,
  FaArrowRight,
  FaArrowLeft,
  FaLightbulb,
  FaTasks,
  FaTools,
  FaImage,
  FaGraduationCap,
  FaBriefcase,
  FaPlus,
  FaTrash,
  FaUsers,
  FaCertificate,
  FaFileDownload,
  FaStar,
  FaBrain,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import { useTypewriter, Cursor } from "react-simple-typewriter";

// --- MODIFIED TypewriterLabel ---
const TypewriterLabel: React.FC<{ text: string }> = React.memo(({ text }) => {
  // Memoize the words array to prevent re-creation on every render
  const words = useMemo(() => [text], [text]);

  const [typedText] = useTypewriter({
    words: words, // Use the memoized array
    loop: 1,
    typeSpeed: 28,
  });
  return <h3>{typedText}<Cursor cursorStyle="_" /></h3>;
});
// --- End moved component ---

// --- Move Input/TextArea to module scope and use forwardRef + memo ---
// stable components prevent remounts that blur inputs
const Input = React.memo(React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ReactNode }>(
  ({ icon, ...props }, ref) => (
    <div className="input-group">
      {icon && <span className="input-icon">{icon}</span>}
      <input ref={ref} {...props} />
    </div>
  )
));
Input.displayName = "Input";

const TextArea = React.memo(React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  (props, ref) => <textarea ref={ref} {...props} />
));
TextArea.displayName = "TextArea";
// --- End Input/TextArea move ---


/* -------------------------
   Types & Interfaces
   ------------------------- */
interface Personal {
  name: string;
  title: string;
  email: string;
  bio: string;
  avatar: string;
}
interface Education {
  degree: string;
  institution: string;
  duration: string;
  cgpa: string;
}
interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
  technologies: string;
}
interface Project {
  title: string;
  category: string;
  description: string;
  techStack: string;
  githubUrl: string;
  liveUrl: string;
}
interface Certification {
  name: string;
  issuer: string;
  year: string;
}
interface Social {
  linkedin: string;
  github: string;
  twitter: string;
  leetcode: string;
}
interface Skills {
  programming: string;
  ml_ai: string;
  web_development: string;
  databases: string;
  devops_cloud: string;
}

interface PortfolioData {
  personal: Personal;
  education: Education[];
  experience: Experience[];
  skills: Skills;
  certifications: Certification[];
  projects: Project[];
  social: Social;
}

type Phase =
  | "personal"
  | "education"
  | "experience"
  | "skills"
  | "projects"
  | "certifications"
  | "social"
  | "finish";

const PHASES: Phase[] = [
  "personal",
  "education",
  "experience",
  "skills",
  "projects",
  "certifications",
  "social",
  "finish",
];

/* -------------------------
   Helper: Step metadata
   ------------------------- */
type QuestionType = "text" | "textarea" | "email" | "url";

interface Question {
  id: string;
  label: string;
  fieldPath: string; // path like "personal.name" or special values for list logic
  type?: QuestionType;
  icon?: React.ReactNode;
  optional?: boolean;
  forList?: boolean; // true if this is part of a list item (education/experience/etc.)
  listName?: keyof PortfolioData; // name of the list when forList true
}

/* -------------------------
   Component
   ------------------------- */
export const ProjectForm: React.FC = () => {
  const router = useRouter();

  const [currentPhase, setCurrentPhase] = useState<Phase>("personal");
  const [phaseQuestionIndex, setPhaseQuestionIndex] = useState<number>(0);

  const [formData, setFormData] = useState<PortfolioData>({
    personal: { name: "", title: "", email: "", bio: "", avatar: "" },
    education: [],
    experience: [],
    skills: { programming: "", ml_ai: "", web_development: "", databases: "", devops_cloud: "" },
    certifications: [],
    projects: [],
    social: { linkedin: "", github: "", twitter: "", leetcode: "" },
  });

  // Temporary item for list entries (education, experience, project, cert)
  const [tempEdu, setTempEdu] = useState<Education>({ degree: "", institution: "", duration: "", cgpa: "" });
  const [tempExp, setTempExp] = useState<Experience>({ company: "", position: "", duration: "", description: "", technologies: "" });
  const [tempProj, setTempProj] = useState<Project>({ title: "", category: "", description: "", techStack: "", githubUrl: "", liveUrl: "" });
  const [tempCert, setTempCert] = useState<Certification>({ name: "", issuer: "", year: "" });

  // Controls whether we're currently adding items to a list (for repeated add flow)
  const [isAddingListItem, setIsAddingListItem] = useState<boolean>(false);

  // For education/experience/projects/certs, keep a local step index for that single item
  const [listItemQuestionIndex, setListItemQuestionIndex] = useState<number>(0);

  /* -------------------------
     Questions per phase
     ------------------------- */

  const personalQuestions: Question[] = [
    { id: "name", label: "What's your full name?", fieldPath: "personal.name", type: "text", icon: <FaUser />, optional: false },
    { id: "title", label: "What's your title? (e.g., Full-stack Developer)", fieldPath: "personal.title", type: "text", icon: <FaLightbulb />, optional: false },
    { id: "email", label: "Email address", fieldPath: "personal.email", type: "email", icon: <FaEnvelope />, optional: false },
    { id: "avatar", label: "Avatar URL (optional)", fieldPath: "personal.avatar", type: "url", icon: <FaImage />, optional: true },
    { id: "bio", label: "Short bio (optional)", fieldPath: "personal.bio", type: "textarea", icon: <FaUser />, optional: true },
  ];

  // When adding a list item, we will ask these sequentially
  const educationQuestionsForItem: Question[] = [
    { id: "degree", label: "Degree (e.g., B.Tech)", fieldPath: "degree", type: "text", icon: <FaGraduationCap /> },
    { id: "institution", label: "Institution (e.g., SATI)", fieldPath: "institution", type: "text" },
    { id: "duration", label: "Duration (e.g., 2022-2026)", fieldPath: "duration", type: "text" },
    { id: "cgpa", label: "CGPA (optional)", fieldPath: "cgpa", type: "text", optional: true },
  ];

  const experienceQuestionsForItem: Question[] = [
    { id: "company", label: "Company name (e.g., Amazon)", fieldPath: "company", type: "text", icon: <FaBriefcase /> },
    { id: "position", label: "Position (e.g., Intern)", fieldPath: "position", type: "text" },
    { id: "duration", label: "Duration (e.g., Aug 2024)", fieldPath: "duration", type: "text" },
    { id: "description", label: "Brief description of role (optional)", fieldPath: "description", type: "textarea", optional: true },
    { id: "technologies", label: "Technologies used (comma-separated)", fieldPath: "technologies", type: "text", icon: <FaTools /> },
  ];

  const projectQuestionsForItem: Question[] = [
    { id: "title", label: "Project title", fieldPath: "title", type: "text", icon: <FaStar /> },
    { id: "category", label: "Category (AI / Web / Mobile)", fieldPath: "category", type: "text" },
    { id: "description", label: "Short description (optional)", fieldPath: "description", type: "textarea", optional: true },
    { id: "techStack", label: "Tech stack (comma-separated)", fieldPath: "techStack", type: "text", icon: <FaTools /> },
    { id: "githubUrl", label: "GitHub URL (optional)", fieldPath: "githubUrl", type: "url", optional: true, icon: <FaGithub /> },
    { id: "liveUrl", label: "Live site URL (optional)", fieldPath: "liveUrl", type: "url", optional: true, icon: <FaLink /> },
  ];

  const certQuestionsForItem: Question[] = [
    { id: "name", label: "Certificate name", fieldPath: "name", type: "text", icon: <FaCertificate /> },
    { id: "issuer", label: "Issuer (e.g., Coursera)", fieldPath: "issuer", type: "text" },
    { id: "year", label: "Year (e.g., 2024)", fieldPath: "year", type: "text", optional: true },
  ];

  const skillsQuestions: Question[] = [
    { id: "programming", label: "Programming languages / tools (comma-separated)", fieldPath: "skills.programming", type: "text", icon: <FaCode /> },
    { id: "ml_ai", label: "ML / AI skills (comma-separated) (optional)", fieldPath: "skills.ml_ai", type: "text", optional: true, icon: <FaBrain /> },
    { id: "web_development", label: "Web development skills (comma-separated)", fieldPath: "skills.web_development", type: "text", icon: <FaLink /> },
    { id: "databases", label: "Databases (comma-separated) (optional)", fieldPath: "skills.databases", type: "text", optional: true },
    { id: "devops_cloud", label: "DevOps / Cloud tools (optional)", fieldPath: "skills.devops_cloud", type: "text", optional: true, icon: <FaTasks /> },
  ];

  const socialQuestions: Question[] = [
    { id: "linkedin", label: "LinkedIn URL (optional)", fieldPath: "social.linkedin", type: "url", optional: true, icon: <FaLinkedin /> },
    { id: "github", label: "GitHub URL (optional)", fieldPath: "social.github", type: "url", optional: true, icon: <FaGithub /> },
    { id: "twitter", label: "Twitter URL (optional)", fieldPath: "social.twitter", type: "url", optional: true, icon: <FaUsers /> },
    { id: "leetcode", label: "LeetCode URL (optional)", fieldPath: "social.leetcode", type: "url", optional: true, icon: <FaCode /> },
  ];

  /* Helper: get questions for current phase (not including list-add prompts) */
  const questionsForPhase = (phase: Phase): Question[] => {
    switch (phase) {
      case "personal": return personalQuestions;
      case "skills": return skillsQuestions;
      case "social": return socialQuestions;
      default: return []; // For list phases we handle separately
    }
  };

  /* -------------------------
     Helpers to update nested state
     ------------------------- */
  const setNestedValue = (path: string, value: string) => {
    // path examples: "personal.name", "skills.programming"
    const parts = path.split(".");
    setFormData(prev => {
      const copy = JSON.parse(JSON.stringify(prev)) as PortfolioData;
      let cur: any = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        cur = cur[parts[i]];
      }
      cur[parts[parts.length - 1]] = value;
      return copy;
    });
  };

  const getNestedValue = (path: string) => {
    const parts = path.split(".");
    let cur: any = formData as any;
    for (let p of parts) {
      if (cur == null) return "";
      cur = cur[p];
    }
    return cur ?? "";
  };

  /* -------------------------
     List helpers (add / reset)
     ------------------------- */
  const resetTempForList = (listName: keyof PortfolioData) => {
    if (listName === "education") setTempEdu({ degree: "", institution: "", duration: "", cgpa: "" });
    if (listName === "experience") setTempExp({ company: "", position: "", duration: "", description: "", technologies: "" });
    if (listName === "projects") setTempProj({ title: "", category: "", description: "", techStack: "", githubUrl: "", liveUrl: "" });
    if (listName === "certifications") setTempCert({ name: "", issuer: "", year: "" });
  };

  const addTempToList = (listName: keyof PortfolioData) => {
    setFormData(prev => {
      const copy = { ...prev } as any;
      copy[listName] = [...(copy[listName] || []), listName === "education" ? tempEdu : listName === "experience" ? tempExp : listName === "projects" ? tempProj : tempCert];
      return copy as PortfolioData;
    });
  };

  /* -------------------------
     Navigation handlers
     ------------------------- */
  const goToNextPhase = () => {
    const i = PHASES.indexOf(currentPhase);
    if (i < PHASES.length - 1) {
      setCurrentPhase(PHASES[i + 1]);
      setPhaseQuestionIndex(0);
      setIsAddingListItem(false);
      setListItemQuestionIndex(0);
    }
  };

  const goToPrevPhase = () => {
    const i = PHASES.indexOf(currentPhase);
    if (i > 0) {
      setCurrentPhase(PHASES[i - 1]);
      setPhaseQuestionIndex(0);
      setIsAddingListItem(false);
      setListItemQuestionIndex(0);
    }
  };

  /* -------------------------
     Handling answers for non-list phases
     ------------------------- */
  const handleAnswerForPhase = (phase: Phase, qIndex: number, value: string) => {
    const questions = questionsForPhase(phase);
    const q = questions[qIndex];
    if (!q) return;
    setNestedValue(q.fieldPath, value);
    // go to next question in the phase
    if (qIndex < questions.length - 1) {
      setPhaseQuestionIndex(qIndex + 1);
    } else {
      // finished phase
      goToNextPhase();
    }
  };

  /* -------------------------
     Handling list phases (education, experience, projects, certifications)
     ------------------------- */

  // Start adding a new item (prompts one-by-one)
  const startAddingListItem = (listName: keyof PortfolioData) => {
    resetTempForList(listName);
    setIsAddingListItem(true);
    setListItemQuestionIndex(0);
  };

  // Cancel adding current temp item
  const cancelAddingListItem = () => {
    setIsAddingListItem(false);
    setListItemQuestionIndex(0);
    resetTempForList("education"); // safe reset (we'll reset all to be safe)
    resetTempForList("experience");
    resetTempForList("projects");
    resetTempForList("certifications");
  };

  // When answering within a list item
  const handleListItemAnswer = (listName: keyof PortfolioData, questions: Question[], index: number, value: string) => {
    // Update corresponding temp object
    if (listName === "education") setTempEdu(prev => ({ ...prev, [(questions[index].fieldPath)]: value }));
    if (listName === "experience") setTempExp(prev => ({ ...prev, [(questions[index].fieldPath)]: value }));
    if (listName === "projects") setTempProj(prev => ({ ...prev, [(questions[index].fieldPath)]: value }));
    if (listName === "certifications") setTempCert(prev => ({ ...prev, [(questions[index].fieldPath)]: value }));

    // Move to next list item question or finish item
    if (index < questions.length - 1) {
      setListItemQuestionIndex(index + 1);
    } else {
      // finished this item - add to list and ask user if they want to add another
      addTempToList(listName);
      setListItemQuestionIndex(0);
      // keep isAddingListItem true, but we'll show "Added! Add another?" UI
      // We'll change a small flag by reusing listItemQuestionIndex == 0 and a justAdded marker visually
      setIsAddingListItem(false); // we toggle off so UI shows controls: Add another / Continue
    }
  };

  /* -------------------------
     Remove item from list
     ------------------------- */
  const removeFromList = (listName: keyof PortfolioData, idx: number) => {
    setFormData(prev => {
      const copy = JSON.parse(JSON.stringify(prev)) as PortfolioData;
      (copy as any)[listName] = (copy as any)[listName].filter((_: any, i: number) => i !== idx);
      return copy;
    });
  };

  /* -------------------------
     JSON Generation
     ------------------------- */
  const handleGenerateJson = () => {
    const finalData = {
      personal: {
        ...formData.personal,
        age: 22,
        location: "Vidisha, Madhya Pradesh, India",
        phone: "+91 8305117236",
        handle: "@anujjainbatu",
        fallbackAvatar: "https://images.unsplash.com/photo-1610216705422-caa3fcb6d158?q=80&w=3560&auto=format&fit=crop&ixlib-rb-4.0.3"
      },
      education: {
        current: formData.education[0] || {},
        previous: formData.education[1] || {},
        achievements: [],
      },
      experience: formData.experience.map(exp => ({ ...exp, type: "Internship", technologies: exp.technologies?.split?.(',')?.map((t: string) => t.trim()) || [] })),
      skills: {
        programming: formData.skills.programming.split(",").map(t => t.trim()),
        ml_ai: formData.skills.ml_ai.split(",").map(t => t.trim()),
        web_development: formData.skills.web_development.split(",").map(t => t.trim()),
        databases: formData.skills.databases.split(",").map(t => t.trim()),
        devops_cloud: formData.skills.devops_cloud.split(",").map(t => t.trim()),
        iot_hardware: [],
        soft_skills: []
      },
      certifications: formData.certifications,
      projects: formData.projects.map(proj => ({ ...proj, techStack: proj.techStack.split(",").map(t => t.trim()), links: [{ name: "GitHub", url: proj.githubUrl }, { name: "Live Site", url: proj.liveUrl }], images: [], status: "Completed", featured: true })),
      social: formData.social,
      internship: {
        seeking: true,
        duration: "6 months",
        startDate: "Immediately",
        preferredLocation: "Remote or On-site",
        focusAreas: ["AI Development", "Full-stack Development", "Machine Learning"],
        availability: "Available for immediate start",
        workStyle: "Fast learner, team player, problem solver",
        goals: "To contribute to meaningful projects and grow my skills."
      },
      personality: {
        traits: ["passionate", "curious", "determined"],
        interests: ["AI/ML", "IoT", "Web Development"],
        funFacts: ["SIH 2025 finalist", "Active freelancer"],
        workingStyle: "I move fast, learn faster.",
        motivation: "Building impactful technology."
      },
      resume: {
        title: "My Resume",
        description: "My professional resume.",
        fileType: "PDF",
        lastUpdated: new Date().toISOString().split("T")[0],
        fileSize: "1MB",
        downloadUrl: ""
      },
      chatbot: {
        name: "MyBot",
        personality: "friendly",
        tone: "professional",
        language: "english",
        responseStyle: "short",
        useEmojis: true,
        topics: ["projects", "skills", "experience"]
      },
      presetQuestions: {
        me: ["Who are you?"],
        professional: ["What are your skills?", "Can I see your resume?"],
        projects: ["What projects are you most proud of?"],
        achievements: ["What are your major achievements?"],
        contact: ["How can I reach you?"],
        fun: ["What are your hobbies?"]
      },
      meta: { 
        configVersion: "2.0",
        lastUpdated: new Date().toISOString().split("T")[0],
        generatedBy: "NoCodePholio",
        description: "Portfolio configuration generated by NoCodePholio form."
      }
    };

    const blob = new Blob([JSON.stringify(finalData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-config.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Redirect to the template selection page
    router.push('/select-template');
  };

  /* -------------------------
     UI helpers - current question + value
     ------------------------- */
  const getProgressPercent = () => {
    // roughly map phase & question index into a linear progress
    const phaseIndex = PHASES.indexOf(currentPhase);
    const perPhase = 100 / (PHASES.length);
    const questionProgress = phaseQuestionIndex / Math.max(1, questionsForPhase(currentPhase).length);
    return Math.min(100, Math.round((phaseIndex + questionProgress) * perPhase));
  };

  /* -------------------------
     Renderers
     ------------------------- */

  /* -------------------------
     Phase-specific UIs
     ------------------------- */

  // Non-list phases: personal, skills, social
  const renderSimplePhase = (phase: Phase) => {
    const qs = questionsForPhase(phase);
    const q = qs[phaseQuestionIndex];
    if (!q) {
      // no questions (e.g., if phase unexpectedly empty) — just show continue
      return (
        <div className="conversational-step">
          <TypewriterLabel key={`${capitalize(phase)}-empty`} text={`${capitalize(phase)} — nothing to ask.`} />
          <div className="navigation-buttons">
            <button className="prev-button" onClick={goToPrevPhase}><FaArrowLeft /> Back</button>
            <button className="next-button" onClick={goToNextPhase}>Next <FaArrowRight /></button>
          </div>
        </div>
      );
    }

    const currentValue = getNestedValue(q.fieldPath);

    return (
      <div className="conversational-step">
        <TypewriterLabel key={q.label} text={q.label} />
        <div style={{ width: "100%" }}>
          {q.type === "textarea" ? (
            <TextArea
              placeholder={q.label}
              value={currentValue}
              onChange={(e) => setNestedValue(q.fieldPath, e.target.value)}
              rows={6}
            />
          ) : (
            <Input
              icon={q.icon}
              placeholder={q.label}
              type={q.type || "text"}
              value={currentValue}
              onChange={(e) => setNestedValue(q.fieldPath, e.target.value)}
            />
          )}

          <div className="navigation-buttons" style={{ marginTop: "1rem" }}>
            <button className="prev-button" onClick={goToPrevPhase} disabled={PHASES.indexOf(currentPhase) === 0}><FaArrowLeft /> Back</button>

            <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
              {q.optional && <button className="prev-button" onClick={() => {
                // Skip optional
                if (phaseQuestionIndex < qs.length - 1) setPhaseQuestionIndex(phaseQuestionIndex + 1);
                else goToNextPhase();
              }}>Skip</button>}

              <button className="next-button" onClick={() => {
                // If value is empty and not optional, do not proceed
                const val = getNestedValue(q.fieldPath) as string;
                if (!val && !q.optional) {
                  // simple visual nudge: focus on the input via DOM (best-effort)
                  const el = document.querySelector(".conversational-step input, .conversational-step textarea") as HTMLElement | null;
                  el?.focus();
                  return;
                }
                // move forward
                if (phaseQuestionIndex < qs.length - 1) setPhaseQuestionIndex(phaseQuestionIndex + 1);
                else goToNextPhase();
              }}>Next <FaArrowRight /></button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // List phases (education/experience/projects/certifications)
  const renderListPhase = (phase: Phase) => {
    const listName = phase as keyof PortfolioData;
    const list = (formData as any)[listName] as any[];

    // If currently adding an item -> show item question-by-question
    if (isAddingListItem) {
      let questionsForItem: Question[] = [];
      if (phase === "education") questionsForItem = educationQuestionsForItem;
      if (phase === "experience") questionsForItem = experienceQuestionsForItem;
      if (phase === "projects") questionsForItem = projectQuestionsForItem;
      if (phase === "certifications") questionsForItem = certQuestionsForItem;

      const q = questionsForItem[listItemQuestionIndex];

      // get current temp value for this field
      const tempVal = (() => {
        if (phase === "education") return (tempEdu as any)[q.fieldPath] ?? "";
        if (phase === "experience") return (tempExp as any)[q.fieldPath] ?? "";
        if (phase === "projects") return (tempProj as any)[q.fieldPath] ?? "";
        if (phase === "certifications") return (tempCert as any)[q.fieldPath] ?? "";
        return "";
      })();

      return (
        <div className="conversational-step">
          <TypewriterLabel key={q.label} text={q.label} />
          <div style={{ width: "100%" }}>
            {q.type === "textarea" ? (
              <TextArea value={tempVal} onChange={(e) => {
                if (phase === "education") setTempEdu(prev => ({ ...prev, [q.fieldPath]: e.target.value }));
                if (phase === "experience") setTempExp(prev => ({ ...prev, [q.fieldPath]: e.target.value }));
                if (phase === "projects") setTempProj(prev => ({ ...prev, [q.fieldPath]: e.target.value }));
                if (phase === "certifications") setTempCert(prev => ({ ...prev, [q.fieldPath]: e.target.value }));
              }} rows={5} />
            ) : (
              <Input
                icon={q.icon}
                placeholder={q.label}
                value={tempVal}
                onChange={(e) => {
                  if (phase === "education") setTempEdu(prev => ({ ...prev, [q.fieldPath]: e.target.value }));
                  if (phase === "experience") setTempExp(prev => ({ ...prev, [q.fieldPath]: e.target.value }));
                  if (phase === "projects") setTempProj(prev => ({ ...prev, [q.fieldPath]: e.target.value }));
                  if (phase === "certifications") setTempCert(prev => ({ ...prev, [q.fieldPath]: e.target.value }));
                }}
              />
            )}

            <div className="navigation-buttons" style={{ marginTop: "1rem" }}>
              <button className="prev-button" onClick={() => {
                // cancel adding this item and return to list overview
                cancelAddingListItem();
              }}><FaArrowLeft /> Cancel</button>

              <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
                {q.optional && <button className="prev-button" onClick={() => {
                  // skip field
                  if (listItemQuestionIndex < questionsForItem.length - 1) setListItemQuestionIndex(listItemQuestionIndex + 1);
                  else {
                    // finish item by adding whatever we have
                    addTempToList(listName);
                    setIsAddingListItem(false);
                  }
                }}>Skip</button>}

                <button className="next-button" onClick={() => {
                  // require value if not optional
                  if (!tempVal && !q.optional) {
                    const el = document.querySelector(".conversational-step input, .conversational-step textarea") as HTMLElement | null;
                    el?.focus();
                    return;
                  }
                  // store and move to next question/complete item
                  handleListItemAnswer(listName, questionsForItem, listItemQuestionIndex, tempVal ?? "");
                }}>Next <FaArrowRight /></button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Not currently adding: show list overview + controls to add more or continue
    return (
      <div className="conversational-step">
        <TypewriterLabel key={`list-${phase}`} text={`Your ${capitalize(phase)} entries`} />
        {list.length === 0 ? (
          <p style={{ color: "#A0AEC0" }}>No entries added yet.</p>
        ) : (
          <div className="item-list">
            {list.map((it, idx) => (
              <div key={idx} className="item-card">
                <div>
                  <strong style={{ color: "#fff" }}>{(it as any).degree || (it as any).title || (it as any).company || (it as any).name}</strong>
                  <div style={{ color: "#A0AEC0", fontSize: ".9rem" }}>{(it as any).institution || (it as any).category || (it as any).position || (it as any).issuer}</div>
                </div>
                <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
                  <button className="delete-button" onClick={() => removeFromList(listName, idx)}><FaTrash /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: "1.5rem", display: "flex", gap: ".5rem", width: "100%" }}>
          <button className="add-project-button" onClick={() => startAddingListItem(listName)}><FaPlus /> Add {capitalizeSingular(phase)}</button>
          <div style={{ marginLeft: "auto", display: "flex", gap: ".5rem" }}>
            <button className="prev-button" onClick={goToPrevPhase}><FaArrowLeft /> Back</button>
            <button className="next-button" onClick={goToNextPhase}>Continue <FaArrowRight /></button>
          </div>
        </div>
      </div>
    );
  };

  /* -------------------------
     Master render
     ------------------------- */
  const renderCurrent = () => {
    if (currentPhase === "personal" || currentPhase === "skills" || currentPhase === "social") {
      return renderSimplePhase(currentPhase);
    }

    if (currentPhase === "education" || currentPhase === "experience" || currentPhase === "projects" || currentPhase === "certifications") {
      return renderListPhase(currentPhase);
    }

    if (currentPhase === "finish") {
      return (
        <div className="conversational-step" style={{ alignItems: "center" }}>
          <TypewriterLabel key="finish" text="All Done! Generate your portfolio-config.json" />
          <p style={{ color: "#A0AEC0", textAlign: "center", maxWidth: 560 }}>
            Click the button to download your configuration file.
            After downloading, you will be taken to the template selection page.
          </p>
          <div style={{ width: "100%", display: "flex", gap: ".5rem", marginTop: "1.2rem" }}>
            <button className="prev-button" onClick={goToPrevPhase}><FaArrowLeft /> Back</button>
            <button className="generate-button" onClick={handleGenerateJson} style={{ marginLeft: "auto" }}><FaFileDownload /> Download & Continue</button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="project-form-container">
      <header className="project-form-header">
        <h1>NoCodePholio</h1>
        <p>Phase: <span style={{ color: "#fff", fontWeight: 600 }}>{capitalize(currentPhase)}</span></p>
      </header>

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${getProgressPercent()}%` }}></div>
      </div>

      <div className="project-form">
        {renderCurrent()}
      </div>
    </div>
  );
};

/* -------------------------
   Small utils
   ------------------------- */
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function capitalizeSingular(phase: string) {
  if (phase === "education") return "education";
  if (phase ==="experience") return "experience";
  if (phase === "projects") return "project";
  if (phase === "certifications") return "certification";
  return capitalize(phase);
}

export default ProjectForm;

// --- REMOVED DUPLICATE HELPER DEFINITIONS ---