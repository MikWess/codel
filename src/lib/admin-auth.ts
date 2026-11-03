import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { authorizeAdmin } from "./admin-access";

export function requireAdmin(request: Request): Promise<Response | null> {
  return authorizeAdmin(request, {
    adminEmail: process.env.ADMIN_EMAIL,
    verifyToken: async (token) => {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      if (!projectId) throw new Error("FIREBASE_PROJECT_ID is required");
      const app = getApps().find(app => app.name === "codel-admin") ?? initializeApp({
        credential: applicationDefault(), projectId,
      }, "codel-admin");
      return getAuth(app).verifyIdToken(token, true);
    },
  });
}
