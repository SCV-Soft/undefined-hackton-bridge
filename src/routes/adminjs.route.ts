import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import { Router } from "express";

export const expressRouter = (adminJs: AdminJS, router: Router | null = null) => {
  return AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      async authenticate(email, password) {
        console.log(email, password);
        return true;
      },
      cookieName: "accessToken",
      cookiePassword: process.env.SECRET_KEY || "password",
    },
    router,
  );
};
