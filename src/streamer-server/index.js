import { fileURLToPath } from "url";
import path from "path";
import express from "express";
import { getAndRefreshToken } from "./src/get-and-refresh-token.js";
import { login } from "./src/login.js";
import { PORT } from "./src/constants.js";

export const DIRNAME = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.static(path.join(DIRNAME, "public")));

app.get("/login", async (req, res) => {
  const code = req.query.code;
  const redirectUri = req.query.redirectUri;

  if (typeof code === "string" && typeof redirectUri === "string") {
    const accessToken = await login(code, redirectUri);
    res.send(accessToken);
  } else {
    res.send(undefined);
  }
});

app.get("/access-token", async (_, res) => {
  const accessToken = await getAndRefreshToken();
  res.send(accessToken);
});

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});
