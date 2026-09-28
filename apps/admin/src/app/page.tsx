import { AdminApp } from "@/components/admin-app";

export const dynamic = "force-dynamic";

export default function Page() {
  const configured = Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY &&
      process.env.ADMIN_UIDS,
  );
  return <AdminApp configured={configured} />;
}
