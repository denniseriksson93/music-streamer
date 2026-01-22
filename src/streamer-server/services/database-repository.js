import fs from "fs/promises";
import path from "path";
import { DIRNAME } from "../index.js";
import * as Types from "./types.js";

const getDatabasePath = () => path.join(DIRNAME, "database/database.json");

/** @type {Types.Database | undefined} */
let data = undefined;

const getData = async () => {
  if (data) {
    return data;
  }

  const rawData = await fs.readFile(getDatabasePath(), "utf-8");

  /** @type {Types.Database} */
  const parsedData = JSON.parse(rawData);

  data = parsedData;

  return data;
};

const setData = async (
  /** @type {Partial<Types.Database>} */ newPartialData,
) => {
  const oldData = await getData();

  /** @type {Types.Database} */
  const newData = { ...oldData, ...newPartialData };

  await fs.writeFile(getDatabasePath(), JSON.stringify(newData));

  data = newData;
};

export const databaseRepository = { getData, setData };
