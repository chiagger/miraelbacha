import styles from "../page.module.css";
import Image from "next/image";

export default function Contacts() {
  return (
    <div className={styles.page} style={{ color: "#000" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 5,
          alignItems: "center",
          marginTop: "5vh",
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 500 }}>Work Email</div>
        <div>miraelbacha.eb@gmail.com</div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 5,
          marginTop: "5vh",
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 500 }}>Phone</div>
        <div>+44 7884 177270</div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 20,
          marginTop: "7vh",
          width: "100%",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => {
            window.location.href = "https://www.mandy.com/uk/c/mira-el-bacha";
          }}
        >
          <Image src="/img/mandy.svg" alt="" width={40} height={40}></Image>{" "}
          <div>Mandy</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => {
            window.location.href =
              "https://www.instagram.com/mira.elbacha/?utm_source=ig_web_button_share_sheet&igshid=OGQ5ZDc2ODk2ZA==";
          }}
        >
          <Image src="/img/ig.png" alt="" width={40} height={40}></Image>{" "}
          <div>Instagram</div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => {
            window.location.href =
              "https://www.linkedin.com/in/mira-el-bacha-00a5ab2a9";
          }}
        >
          <Image src="/img/in.png" alt="" width={40} height={40}></Image>{" "}
          <div>LinkedIn</div>
        </div>
      </div>
    </div>
  );
}
