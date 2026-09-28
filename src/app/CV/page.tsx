"use client";
import styles from "../page.module.css";
import { useMobile } from "@/contexts/mobileContext";
import { useSiteContent } from "@/contexts/siteContentContext";

export default function CV() {
  const { isMobile } = useMobile();
  const { assistantExperience, otherExperience, education, skills } = useSiteContent();

  return (
    <div className={styles.page} style={{ display: "flex", padding: 0 }}>
      <div
        style={{
          width: isMobile ? "40vw" : "20vw",
          height: "82vh",
          backgroundColor: "#696969",
          color: "#fff",
          padding: isMobile ? 20 : 30,
          fontSize: 14,
          display: "flex",
          flexDirection: "column",
          gap: 30,
          paddingTop: 50,
          maxHeight: "82vh",
          overflowY: "scroll",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 550 }}>Education</div>
          {education.map((item) => (
            <div key={item.id} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div style={{ fontWeight: 550 }}>{item.title}</div>
              <div style={{ fontStyle: "italic" }}>{item.year}</div>
              <div>{item.description}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginTop: 20,
          }}
        >
          <div style={{ fontSize: 20, fontWeight: 550 }}>Relevant Skills</div>

          {skills.map((item) => <div key={item.id}>-{item.text}</div>)}
        </div>
      </div>
      <div
        style={{
          height: "82vh",

          width: isMobile ? "60vw" : "80vw",
          color: "#000",
          padding: isMobile ? 30 : 50,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          paddingBottom: 30,
        }}
      >
        <div
          style={{
            fontSize: 16,
            width: isMobile ? "100%" : "50%",
            gap: 20,
            maxHeight: "82vh",
            minHeight: "30vh",
            overflowY: "scroll",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontWeight: 550,
              marginBottom: 10,
            }}
          >
            1st Assistant Director Experience
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              maxWidth: "70%",
              gap: 10,
              marginTop: 10,
            }}
          >
            {assistantExperience.map((item) => (
              <div key={item.id} style={{ display: "flex", gap: 5 }}>
                <div>{item.title}</div>
                <div>|</div>
                <div style={{ fontStyle: "italic" }}>{item.year}</div>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            fontSize: 16,
            width: isMobile ? "100%" : "50%",
            maxHeight: "82vh",
            overflowY: "scroll",
            marginTop: isMobile ? 40 : 0,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 550,
            }}
          >
            Other Relevant Experience
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              maxWidth: "70%",
              gap: 20,
              marginTop: 10,
            }}
          >
            {otherExperience.map((item) => (
              <div
                key={item.id}
                style={{ display: "flex", flexDirection: "column", gap: 5 }}
              >
                <div style={{ fontWeight: 550 }}>{item.role}</div>
                <div style={{ fontStyle: "italic", fontWeight: 12 }}>
                  {item.title} | {item.year}
                </div>
                <div>{item.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
