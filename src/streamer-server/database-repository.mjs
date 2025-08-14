import fs from "fs/promises";
import path from "path";
import { DIRNAME } from "./index.mjs";

const getData = async () => {
  const rawData = await fs.readFile(
    path.join(DIRNAME, "database/database.json"),
    "utf-8"
  );

  return JSON.parse(rawData);
};

export const databaseRepository = { getData };
