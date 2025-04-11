import { cv1stAdExp, cvOtherExperience } from "@/data/cv";
import styles from "../page.module.css";

export default function CV() {
  return (
    <div className={styles.page} style={{ display: "flex", padding: 0 }}>
      <div
        style={{
          width: "20vw",
          height: "82vh",
          backgroundColor: "#696969",
          color: "#fff",
          padding: 30,
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
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ fontWeight: 550 }}>
              UAL; University of the Arts London
            </div>
            <div style={{ fontStyle: "italic" }}>
              BA Film Practice | 2020 - 2023
            </div>
            <div>
              Roles: Directing, Casting directing, 1AD, Cinematography and
              Screenwriting.
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ fontWeight: 550 }}>
              Liceo Artistico Arcangeli, Bologna
            </div>
            <div style={{ fontStyle: "italic" }}>2015 - 2020</div>
            <div>Specialized in audiovisual and multimedia.</div>
          </div>
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

          <div>
            -Languages: English (C2), Italian (C2) and Levantine Arabic (B2)
          </div>
          <div>-Excellent team work and team building skills</div>
          <div>-Fast learner</div>
          <div>-Organised</div>
          <div>-Time management</div>
        </div>
      </div>
      <div
        style={{
          height: "82vh",

          width: "80vw",
          color: "#000",
          padding: 50,
          display: "flex",
          paddingBottom: 30,
        }}
      >
        <div
          style={{
            fontSize: 16,
            width: "50%",
            gap: 20,
            maxHeight: "82vh",
            overflowY: "scroll",
          }}
        >
          <div style={{ display: "flex", fontSize: 20, fontWeight: 550 }}>
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
            {cv1stAdExp.map((item, index) => (
              <div key={index} style={{ display: "flex", gap: 5 }}>
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
            width: "50%",
            maxHeight: "82vh",
            overflowY: "scroll",
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
            {cvOtherExperience.map((item, index) => (
              <div
                key={index}
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
