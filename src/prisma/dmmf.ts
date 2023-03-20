import { DMMFClass } from "@prisma/client/runtime";
import { database } from "./database";

export const dmmf = (database as any)._dmmf as DMMFClass;
export const client = database;
