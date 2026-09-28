"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";
import { Button, Dialog } from "@mui/material";
import { useMobile } from "@/contexts/mobileContext";
import { useSiteContent } from "@/contexts/siteContentContext";

export default function Home() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const { isMobile } = useMobile();
  const { portfolio, biography } = useSiteContent();
  const activeProject = portfolio.find((item) => item.id === openItem);
  const activeImageIndex = activeProject ? Math.min(selectedImage, activeProject.images.length - 1) : 0;
  return (
    <div
      className={styles.page}
      style={{
        display: "flex",
        flexDirection: isMobile ? "column-reverse" : "row",
        alignItems: "flex-start",
        height: "82vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: isMobile ? "100%" : "70%",
          alignItems: "center",
          justifyContent: "center",
          maxHeight: isMobile ? "50vh" : "82vh",
          marginTop: isMobile ? 20 : 0,
        }}
      >
        <div
          style={{
            color: "#000",
            fontSize: "1.4em",
            fontWeight: 500,
            fontStyle: "italic",
          }}
        >
          Portfolio
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            maxHeight: "70vh",
            overflowY: "scroll",
            gap: 10,
            marginTop: 20,
            paddingBottom: 10,
          }}
        >
          {portfolio.map((item) => (
            <div
              key={item.id}
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                setOpenItem(item.id);
                setSelectedImage(0);
              }}
            >
              <Image
                src={item.images[0]}
                alt={item.title}
                unoptimized
                width={290}
                height={150}
                style={{
                  borderRadius: 16,
                  boxShadow: "8px 6px 15px -8px rgba(65,65,65,0.87",
                }}
              ></Image>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          maxWidth: isMobile ? "100%" : "30%",
          color: "#000",
          textAlign: isMobile ? "center" : "right",
          fontSize: 14,
          paddingLeft: isMobile ? 0 : 20,
          alignSelf: "center",
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginTop: isMobile ? 0 : 10,
          minHeight: "20vh",
          maxHeight: "70vh",
          overflowY: "scroll",
        }}
      >
        {biography.map((paragraph) => (
          <p key={paragraph.id} style={{ fontStyle: paragraph.italic ? "italic" : undefined }}>
            {paragraph.lead && <><b>{paragraph.lead}</b>{" "}</>}
            {paragraph.text}
          </p>
        ))}
      </div>
      <Dialog open={Boolean(activeProject)} onClose={() => setOpenItem(null)}>
        <div style={{}}>
          {activeProject && (
            <>
              <div>
                <Image
                  src={activeProject.images[activeImageIndex]}
                  alt={activeProject.title}
                  unoptimized
                  width={isMobile ? 367 : 600}
                  height={isMobile ? 240 : 350}
                  style={{
                    borderRadius: 4,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    boxShadow: "8px 6px 15px -8px rgba(65,65,65,0.87",
                  }}
                ></Image>
                <Button
                  style={{
                    alignItems: "center",
                    position: "absolute",
                    top: isMobile ? 110 : 180,
                    left: 0,
                    color: "#fff",
                    fontSize: 20,
                    opacity: 0.7,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSelectedImage(
                      (activeImageIndex - 1 + activeProject.images.length) %
                        activeProject.images.length
                    );
                  }}
                >
                  {"<"}
                </Button>
                <Button
                  style={{
                    alignItems: "center",
                    position: "absolute",
                    top: isMobile ? 110 : 180,
                    right: 0,
                    color: "#fff",
                    fontSize: 20,
                    opacity: 0.7,

                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSelectedImage(
                      (activeImageIndex + 1) % activeProject.images.length
                    );
                  }}
                >
                  {">"}
                </Button>
              </div>
              <div style={{ padding: 20, paddingLeft: 30, paddingRight: 30 }}>
                <div
                  style={{ fontSize: 20, fontWeight: 500, textAlign: "center" }}
                >
                  {activeProject.title}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontStyle: "italic",
                    textAlign: "center",
                  }}
                >
                  {activeProject.directedBy && `directed by ${activeProject.directedBy}`}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    paddingLeft: isMobile ? 0 : 20,
                    paddingRight: isMobile ? 0 : 20,
                    paddingBottom: 10,
                    textAlign: "center",
                    marginTop: 15,
                  }}
                >
                  {activeProject.description}
                </div>
              </div>
            </>
          )}
        </div>
      </Dialog>
    </div>
  );
}
