"use client";

import React, { useState, ChangeEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import "./ProjectForm.css";
// --- NEW: Import the loading screen ---
import { LoadingScreen } from "./LoadingScreen";
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
  FaUpload,
  FaRocket, // Added for Generate button
} from "react-icons/fa";
import { useTypewriter, Cursor } from "react-simple-typewriter";

// --- (TypewriterLabel, Input, TextArea components remain the same) ---
const TypewriterLabel: React.FC<{ text: string }> = React.memo(({ text }) => {
  const words = useMemo(() => [text], [text]);
  const [typedText] = useTypewriter({
    words: words,
    loop: 1,
    typeSpeed: 28,
  });
  return <h3>{typedText}<Cursor cursorStyle="_" /></h3>;
});
TypewriterLabel.displayName = "TypewriterLabel";

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
// --- (End of stable components) ---


/* -------------------------
   Types & Interfaces (Same as before)
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
  | "social";
  // --- REMOVED "finish" phase ---

// --- UPDATED: Removed "finish" from PHASES array ---
const PHASES: Phase[] = [
  "personal",
  "education",
  "experience",
  "skills",
  "projects",
  "certifications",
  "social",
];

type QuestionType = "text" | "textarea" | "email" | "url" | "file";

interface Question {
  id: string;
  label: string;
  fieldPath: string;
  type?: QuestionType;
  icon?: React.ReactNode;
  optional?: boolean;
  forList?: boolean;
  listName?: keyof PortfolioData;
}

/* -------------------------
   Component
   ------------------------- */
export const ProjectForm: React.FC = () => {
  const router = useRouter();

  // --- UPDATED: Combined loading states ---
  const [isLoading, setIsLoading] = useState(false);
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

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

  const [tempEdu, setTempEdu] = useState<Education>({ degree: "", institution: "", duration: "", cgpa: "" });
  const [tempExp, setTempExp] = useState<Experience>({ company: "", position: "", duration: "", description: "", technologies: "" });
  const [tempProj, setTempProj] = useState<Project>({ title: "", category: "", description: "", techStack: "", githubUrl: "", liveUrl: "" });
  const [tempCert, setTempCert] = useState<Certification>({ name: "", issuer: "", year: "" });

  const [isAddingListItem, setIsAddingListItem] = useState<boolean>(false);
  const [listItemQuestionIndex, setListItemQuestionIndex] = useState<number>(0);

  /* -------------------------
     Questions per phase (Same as before)
     ------------------------- */
  const personalQuestions: Question[] = [
    { id: "name", label: "What's your full name?", fieldPath: "personal.name", type: "text", icon: <FaUser />, optional: false },
    { id: "title", label: "What's your title? (e.g., Full-stack Developer)", fieldPath: "personal.title", type: "text", icon: <FaLightbulb />, optional: false },
    { id: "email", label: "Email address", fieldPath: "personal.email", type: "email", icon: <FaEnvelope />, optional: false },
    { id: "avatar", label: "Upload your Avatar (optional)", fieldPath: "personal.avatar", type: "file", icon: <FaImage />, optional: true },
    { id: "bio", label: "Short bio (optional)", fieldPath: "personal.bio", type: "textarea", icon: <FaUser />, optional: true },
  ];

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


  const questionsForPhase = (phase: Phase): Question[] => {
    switch (phase) {
      case "personal": return personalQuestions;
      case "skills": return skillsQuestions;
      case "social": return socialQuestions;
      default: return [];
    }
  };

  /* -------------------------
     State Helpers (Same as before)
     ------------------------- */
  const setNestedValue = (path: string, value: string) => {
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
    } else {
      // This is the last phase, trigger the final save
      handleGenerateAndRedirect();
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

  const handleListItemAnswer = (listName: keyof PortfolioData, questions: Question[], index: number, value: string) => {
    if (listName === "education") setTempEdu(prev => ({ ...prev, [(questions[index].fieldPath)]: value }));
    if (listName === "experience") setTempExp(prev => ({ ...prev, [(questions[index].fieldPath)]: value }));
    if (listName === "projects") setTempProj(prev => ({ ...prev, [(questions[index].fieldPath)]: value }));
    if (listName === "certifications") setTempCert(prev => ({ ...prev, [(questions[index].fieldPath)]: value }));

    if (index < questions.length - 1) {
      setListItemQuestionIndex(index + 1);
    } else {
      addTempToList(listName);
      setListItemQuestionIndex(0);
      setIsAddingListItem(false);
    }
  };

  const removeFromList = (listName: keyof PortfolioData, idx: number) => {
    setFormData(prev => {
      const copy = JSON.parse(JSON.stringify(prev)) as PortfolioData;
      (copy as any)[listName] = (copy as any)[listName].filter((_: any, i: number) => i !== idx);
      return copy;
    });
  };

  const startAddingListItem = (listName: keyof PortfolioData) => {
    resetTempForList(listName);
    setIsAddingListItem(true);
    setListItemQuestionIndex(0);
  };

  const cancelAddingListItem = () => {
    setIsAddingListItem(false);
    setListItemQuestionIndex(0);
    resetTempForList("education");
    resetTempForList("experience");
    resetTempForList("projects");
    resetTempForList("certifications");
  };

  /* -------------------------
     NEW: File Upload Handler (Returns path or throws error)
     ------------------------- */
  const handleAvatarUpload = async (): Promise<string> => {
    if (!avatarFile) {
      return formData.personal.avatar || ""; // Return existing path if no new file
    }

    const uploadFormData = new FormData();
    uploadFormData.append('avatar', avatarFile);

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Failed to upload image');
      }

      const { path } = await response.json();
      return path; // Return the new path
    } catch (error) {
      console.error(error);
      alert(`Error uploading image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error; // Re-throw to stop the save process
    }
  };

  /* -------------------------
     NEW: Config Save Handler (Returns boolean)
     ------------------------- */
  const handleSaveConfig = async (configData: any): Promise<boolean> => {
    try {
      const response = await fetch('/api/save-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(configData),
      });

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.error || 'Failed to save configuration');
      }
      return true;
    } catch (error) {
      console.error(error);
      alert(`Error saving configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    }
  };

  /* -------------------------
     NEW: Main function to orchestrate save and redirect
     ------------------------- */
  const handleGenerateAndRedirect = async () => {
    setIsLoading(true);
    let avatarPath = formData.personal.avatar;

    try {
      // Step 1: Upload Avatar if it exists
      if (avatarFile) {
        avatarPath = await handleAvatarUpload();
      }

      // Step 2: Build the final JSON object
      const finalData = {
        personal: {
          ...formData.personal,
          avatar: avatarPath, // Use the new or existing path
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

      // Step 3: Save the config file
      const saveSuccess = await handleSaveConfig(finalData);

      // Step 4: Redirect
      if (saveSuccess) {
        router.push('/select-template');
      } else {
        throw new Error("Failed to save configuration file.");
      }

    } catch (error) {
      // If anything fails, stop loading and stay on the form
      setIsLoading(false);
      // Alert is already handled in the sub-functions
    }
    // Don't set isLoading(false) here, as we are redirecting on success
  };


  /* -------------------------
     UI helpers - current question + value
     ------------------------- */
  const getProgressPercent = () => {
    const phaseIndex = PHASES.indexOf(currentPhase);
    const perPhase = 100 / (PHASES.length);
    const questionProgress = phaseQuestionIndex / Math.max(1, questionsForPhase(currentPhase).length);
    return Math.min(100, Math.round((phaseIndex + questionProgress) * perPhase));
  };

  /* -------------------------
     Renderers
     ------------------------- */

  const renderSimplePhase = (phase: Phase) => {
    const qs = questionsForPhase(phase);
    const q = qs[phaseQuestionIndex];
    if (!q) {
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
    const isLastPhase = PHASES.indexOf(currentPhase) === PHASES.length - 1;
    const isLastQuestion = phaseQuestionIndex === qs.length - 1;
    const nextButtonText = isLastPhase && isLastQuestion ? "Generate" : "Next";
    const nextButtonIcon = isLastPhase && isLastQuestion ? <FaRocket /> : <FaArrowRight />;

    const renderInputForQuestion = () => {
      if (q.type === "file") {
        return (
          <div className="input-group" style={{ gap: '0.75rem' }}>
            <label className="file-input-label" htmlFor="avatar-upload">
              {q.icon}
              {avatarFile ? avatarFile.name : 'Choose a profile picture'}
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => setAvatarFile(e.target.files ? e.target.files[0] : null)}
              style={{ display: 'none' }}
            />
            {/* Show the saved path if it exists from a previous session (but new file takes precedence) */}
            {!avatarFile && currentValue && (
              <p style={{ color: '#A0AEC0', fontSize: '0.9rem', textAlign: 'center' }}>
                Current image: {currentValue}
              </p>
            )}
          </div>
        );
      }
      
      if (q.type === "textarea") {
        return (
          <TextArea
            placeholder={q.label}
            value={currentValue}
            onChange={(e) => setNestedValue(q.fieldPath, e.target.value)}
            rows={6}
          />
        );
      }
      
      return (
        <Input
          icon={q.icon}
          placeholder={q.label}
          type={q.type || "text"}
          value={currentValue}
          onChange={(e) => setNestedValue(q.fieldPath, e.target.value)}
        />
      );
    };

    return (
      <div className="conversational-step">
        <TypewriterLabel key={q.label} text={q.label} />
        <div style={{ width: "100%" }}>
          {renderInputForQuestion()}

          <div className="navigation-buttons" style={{ marginTop: "1rem" }}>
            <button className="prev-button" onClick={goToPrevPhase} disabled={PHASES.indexOf(currentPhase) === 0}><FaArrowLeft /> Back</button>

            <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
              {q.optional && (
                <button className="prev-button" onClick={() => {
                  if (phaseQuestionIndex < qs.length - 1) setPhaseQuestionIndex(phaseQuestionIndex + 1);
                  else goToNextPhase();
                }}>Skip</button>
              )}

              <button 
                className={isLastPhase && isLastQuestion ? "generate-button" : "next-button"}
                onClick={() => {
                  const val = getNestedValue(q.fieldPath) as string;
                  // Skip validation for file input, as file is optional
                  if (!val && !q.optional && q.type !== 'file') {
                    const el = document.querySelector(".conversational-step input, .conversational-step textarea") as HTMLElement | null;
                    el?.focus();
                    return;
                  }
                  
                  if (phaseQuestionIndex < qs.length - 1) setPhaseQuestionIndex(phaseQuestionIndex + 1);
                  else goToNextPhase(); // This will trigger handleGenerateAndRedirect on the last step
              }}>
                {nextButtonText} {nextButtonIcon}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderListPhase = (phase: Phase) => {
    const listName = phase as keyof PortfolioData;
    const list = (formData as any)[listName] as any[];
    const isLastPhase = PHASES.indexOf(currentPhase) === PHASES.length - 1;

    if (isAddingListItem) {
      let questionsForItem: Question[] = [];
      if (phase === "education") questionsForItem = educationQuestionsForItem;
      if (phase === "experience") questionsForItem = experienceQuestionsForItem;
      if (phase === "projects") questionsForItem = projectQuestionsForItem;
      if (phase === "certifications") questionsForItem = certQuestionsForItem;

      const q = questionsForItem[listItemQuestionIndex];

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
              <button className="prev-button" onClick={cancelAddingListItem}><FaArrowLeft /> Cancel</button>

              <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem" }}>
                {q.optional && <button className="prev-button" onClick={() => {
                  if (listItemQuestionIndex < questionsForItem.length - 1) setListItemQuestionIndex(listItemQuestionIndex + 1);
                  else {
                    addTempToList(listName);
                    setIsAddingListItem(false);
                  }
                }}>Skip</button>}

                <button className="next-button" onClick={() => {
                  if (!tempVal && !q.optional) {
                    const el = document.querySelector(".conversational-step input, .conversational-step textarea") as HTMLElement | null;
                    el?.focus();
                    return;
                  }
                  handleListItemAnswer(listName, questionsForItem, listItemQuestionIndex, tempVal ?? "");
                }}>Next <FaArrowRight /></button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // List overview
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
            {isLastPhase ? (
              <button className="generate-button" onClick={handleGenerateAndRedirect}>
                Generate <FaRocket />
              </button>
            ) : (
              <button className="next-button" onClick={goToNextPhase}>
                Continue <FaArrowRight />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* -------------------------
     Master render
     ------------------------- */
  
  // --- NEW: Show loading screen if isLoading ---
  if (isLoading) {
    return <LoadingScreen />;
  }

  const renderCurrent = () => {
    if (currentPhase === "personal" || currentPhase === "skills" || currentPhase === "social") {
      return renderSimplePhase(currentPhase);
    }
    if (currentPhase === "education" || currentPhase === "experience" || currentPhase === "projects" || currentPhase === "certifications") {
      return renderListPhase(currentPhase);
    }
    return null; // "finish" phase is now handled by the "Generate" button
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