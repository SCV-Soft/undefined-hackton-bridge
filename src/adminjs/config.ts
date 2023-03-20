import theme from "./theme";
import { Database, Resource } from "@adminjs/prisma";
import AdminJS, { AdminJSOptions } from "adminjs";
import { database } from "@/prisma/database";
import { resources } from "./resources";

AdminJS.registerAdapter({
  Database,
  Resource,
});

export const initAdminJSConfig: AdminJSOptions = {
  assets: {
    styles: [
      "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.5/dist/web/static/pretendard-dynamic-subset.css",
      "/style/global.css",
    ],
  },
  rootPath: "/",
  branding: {
    companyName: "TEST_APP",
    theme,
  },
  version: {
    admin: true,
    app: "1.0.0-template",
  },
  resources,
  pages: {},
  dashboard: {
    component: AdminJS.bundle("../pages/dashboard"),
  },
};

export const ADMIN = {
  email: "root@root.com",
  password: process.env.ADMIN_PASSWORD || "password",
};

export const seedAdmin = () =>
  database.admin.upsert({
    where: {
      email: ADMIN.email,
    },
    update: {},
    create: {
      email: ADMIN.email,
      password: ADMIN.password,
    },
  });
