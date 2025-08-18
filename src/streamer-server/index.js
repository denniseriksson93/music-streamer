import { fileURLToPath } from "url";
import path from "path";
import express from "express";
import https from "https";
import fs from "fs";
import { getAndRefreshToken } from "./services/get-and-refresh-token.js";
import { login } from "./services/login.js";
import { PORT } from "./services/constants.js";

export const DIRNAME = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use("/", express.static(path.join(DIRNAME, "public/streamer-remote")));
app.use(
  "/streamer-client",
  express.static(path.join(DIRNAME, "public/streamer-client"))
);

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

https
  .createServer(
    {
      key: fs.readFileSync(path.join(DIRNAME, "../../key.pem")),
      cert: fs.readFileSync(path.join(DIRNAME, "../../cert.pem")),
    },
    app
  )
  .listen(PORT, () => {
    console.log(`Listening on port https://192.168.68.56:${PORT}`);
  });
