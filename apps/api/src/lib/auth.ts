import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "../db";
import { seedDefaultCategoriesForUser } from "./seed-utils";

export const getAuth = () => {
  const db = getDb();
  const isProduction = process.env.ENVIRONMENT === "production";
  
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    emailAndPassword: {
      enabled: true,
    },
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            await seedDefaultCategoriesForUser(db, user.id);
          },
        },
      },
    },
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8787",
    basePath: "/api/v1/auth",
    trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:3000"],
    advanced: {
      useSecureCookies: isProduction,
    },
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 60 * 5,
      },
    },
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
    socialProviders: {},
  });
};
