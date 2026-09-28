"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import { MobileProvider } from "@/contexts/mobileContext";
import {
  SiteContentProvider,
  useSiteContent,
} from "@/contexts/siteContentContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ width: "100vw", height: "100vh" }}>
        <SiteContentProvider>
          <MobileProvider>
            <SiteLayout>{children}</SiteLayout>
          </MobileProvider>
        </SiteContentProvider>
      </body>
    </html>
  );
}

function SiteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile } = useSiteContent();
  return (
    <>
      <div
        style={{
          width: "100%",
          padding: "3vh",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingRight: "3vw",
          paddingLeft: "3vw",
          height: "18vh",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 5,
          }}
        >
          <div style={{ fontSize: 26, fontWeight: 600 }}>{profile.name}</div>
          <div style={{ fontSize: 14, fontStyle: "italic" }}>
            {profile.role}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 20,
              marginTop: 15,
              fontSize: 14,
              fontStyle: "italic",
            }}
          >
            <div
              style={{
                cursor: "pointer",
                fontWeight: pathname === "/" ? 600 : 400,
              }}
              onClick={() => {
                if (pathname !== "/") {
                  window.location.href = "/";
                }
              }}
            >
              Home
            </div>
            <div>○</div>
            <div
              style={{
                cursor: "pointer",
                fontWeight: pathname === "/CV" ? 600 : 400,
              }}
              onClick={() => {
                if (pathname !== "/CV") {
                  window.location.href = "/CV";
                }
              }}
            >
              CV
            </div>
            <div>○</div>
            <div
              style={{
                cursor: "pointer",
                fontWeight: pathname === "/Contacts" ? 600 : 400,
              }}
              onClick={() => {
                if (pathname !== "/Contacts") {
                  window.location.href = "/Contacts";
                }
              }}
            >
              Contacts
            </div>
          </div>
        </div>
      </div>
      <div
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{ backgroundColor: "#fff", height: "82vh" }}
      >
        {children}
      </div>
    </>
  );
}
