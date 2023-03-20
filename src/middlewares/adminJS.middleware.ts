import { initAdminJSConfig, seedAdmin } from "@/adminjs/config";
import { expressRouter } from "@/routes/adminjs.route";
import AdminJS from "adminjs";
import express from "express";

export async function attachAdminJS(app: express.Application) {
  const config = initAdminJSConfig;
  const adminJS = new AdminJS(config);

  const router = expressRouter(adminJS);

  app.use(adminJS.options.rootPath, router);
  app.get("/", (req, res) => res.redirect(adminJS.options.rootPath));

  await seedAdmin();
}
