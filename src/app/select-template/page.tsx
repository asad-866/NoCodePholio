"use client";

import { useRouter } from "next/navigation";
import { FaPalette } from "react-icons/fa";

// Simple inline styles for the template cards
const templateCardStyle: React.CSSProperties = {
  border: "1px solid #3A415A",
  borderRadius: "12px",
  padding: "2rem",
  textAlign: "center",
  cursor: "pointer",
  backgroundColor: "rgba(32, 38, 56, 0.7)",
  transition: "all 0.2s ease",
  width: "100%",
  maxWidth: "300px",
};

const templateCardHoverStyle: React.CSSProperties = {
  borderColor: "#7A8AFF",
  boxShadow: "0 0 15px rgba(122, 138, 255, 0.2)",
  transform: "translateY(-5px)",
};

export default function SelectTemplate() {
  const router = useRouter();

  const handleSelectTemplate = (templateId: string) => {
    // We store the template choice in localStorage
    // A more advanced setup would use this to load different components
    localStorage.setItem("selectedTemplate", templateId);
    
    // Redirect to the new portfolio home page
    router.push("/portfolio");
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: "2rem",
      color: "#E0E0E0",
      textAlign: "center",
    }}>
      <FaPalette size={48} style={{ color: "#7A8AFF", marginBottom: "1rem" }} />
      <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "1rem" }}>
        Choose Your Template
      </h1>
      <p style={{ fontSize: "1.1rem", color: "#A0AEC0", maxWidth: "500px", marginBottom: "3rem" }}>
        Your `portfolio-config.json` is downloading. After it finishes, place it in your project's root directory. Now, select a template to view your portfolio.
      </p>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "2rem",
        justifyContent: "center",
        width: "100%",
      }}>
        {/* Template 1 (The default) */}
        <div
          style={templateCardStyle}
          onClick={() => handleSelectTemplate("1")}
          onMouseEnter={e => Object.assign(e.currentTarget.style, templateCardHoverStyle)}
          onMouseLeave={e => Object.assign(e.currentTarget.style, templateCardStyle)}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#fff" }}>Template 1</h2>
          <p style={{ color: "#A0AEC0", marginTop: "0.5rem" }}>Modern & Sleek (Default)</p>
        </div>

        {/* Template 2 (Placeholder) */}
        <div
          style={templateCardStyle}
          onClick={() => handleSelectTemplate("2")}
          onMouseEnter={e => Object.assign(e.currentTarget.style, templateCardHoverStyle)}
          onMouseLeave={e => Object.assign(e.currentTarget.style, templateCardStyle)}
        >
          <h2 style={{ fontSize: "1.sem", fontWeight: "600", color: "#fff" }}>Template 2</h2>
          <p style={{ color: "#A0AEC0", marginTop: "0.5rem" }}>Minimalist & Clean</p>
        </div>

        {/* Template 3 (Placeholder) */}
        <div
          style={templateCardStyle}
          onClick={() => handleSelectTemplate("3")}
          onMouseEnter={e => Object.assign(e.currentTarget.style, templateCardHoverStyle)}
          onMouseLeave={e => Object.assign(e.currentTarget.style, templateCardStyle)}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#fff" }}>Template 3</h2>
          <p style={{ color: "#A0AEC0", marginTop: "0.5rem" }}>Bold & Creative</p>
        </div>
      </div>
      
      <p style={{ color: "#6A7891", marginTop: "3rem", fontSize: "0.9rem" }}>
        Note: Template 2 & 3 are placeholders. Selecting any option will load the default portfolio structure for now.
      </p>
    </div>
  );
}