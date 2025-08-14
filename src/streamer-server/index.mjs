import { fileURLToPath } from "url";
import path from "path";
import express from "express";
import { databaseRepository } from "./database-repository.mjs";

export const DIRNAME = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.static(path.join(DIRNAME, "public")));

app.get("/access-token", async (_, res) => {
  const { accessToken } = await databaseRepository.getData();

  res.send(accessToken);
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
