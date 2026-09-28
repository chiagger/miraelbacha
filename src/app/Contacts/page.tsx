"use client";
import styles from "../page.module.css";
import Image from "next/image";
import { useSiteContent } from "@/contexts/siteContentContext";

export default function Contacts() {
  const { contacts } = useSiteContent();
  return (
    <div className={styles.page} style={{ color: "#000" }}>
      {contacts.email && (
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
          <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
        </div>
      )}
      {contacts.phone && (
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
          <a href={`tel:${contacts.phone.replace(/[^+\d]/g, "")}`}>
            {contacts.phone}
          </a>
        </div>
      )}
      <div
        style={{
          display: "flex",
          gap: 20,
          marginTop: "7vh",
          width: "100%",
          justifyContent: "center",
        }}
      >
        {(
          [
            { key: "mandy", label: "Mandy", icon: "/img/mandy.svg" },
            { key: "instagram", label: "Instagram", icon: "/img/ig.png" },
            { key: "linkedin", label: "LinkedIn", icon: "/img/in.png" },
          ] as const
        ).map(
          ({ key, label, icon }) =>
            contacts[key] && (
              <a
                key={key}
                href={contacts[key]}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                  alignItems: "center",
                }}
              >
                <Image src={icon} alt="" width={40} height={40} />
                <div>{label}</div>
              </a>
            ),
        )}
      </div>
    </div>
  );
}
