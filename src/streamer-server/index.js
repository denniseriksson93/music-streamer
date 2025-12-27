import { fileURLToPath } from "url";
import path from "path";
import express from "express";
import https from "https";
import fs from "fs";
import { getAndRefreshToken } from "./services/get-and-refresh-token.js";
import { login } from "./services/login.js";
import { databaseRepository } from "./services/database-repository.js";
import { devicesService } from "./services/devices-service.js";

export const DIRNAME = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const getStaticPath = (/** @type {string} */ staticPath) =>
  express.static(path.join(DIRNAME, staticPath));

app.use("/", getStaticPath("public/streamer-remote"));
app.use("/streamer-client", getStaticPath("public/streamer-client"));

app.get("/login", async (req, res) => {
  const code = req.query.code;
  const redirectUri = req.query.redirectUri;

  if (typeof code === "string" && typeof redirectUri === "string") {
    await login(code, redirectUri);
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

app.get("/access-token", async (_, res) => {
  const accessToken = await getAndRefreshToken();
  res.send(accessToken);
});

app.get("/profile", async (_, res) => {
  const { profile } = await databaseRepository.getData();

  if (profile) {
    res.send(profile);
  } else {
    res.sendStatus(204);
  }
});

app.delete("/sign-out", async (_, res) => {
  await databaseRepository.setData({ token: undefined, profile: undefined });
  res.sendStatus(200);
});

app.get("/devices", async (_, res) => {
  const devices = await devicesService.getDevices();
  res.send(devices);
});

const PORT = 3000;

https
  .createServer(
    {
      key: fs.readFileSync(path.join(DIRNAME, "../../key.pem")),
      cert: fs.readFileSync(path.join(DIRNAME, "../../cert.pem")),
    },
    app
  )
  .listen(PORT, () => {
    console.log(`Listening on port https://192.168.68.52:${PORT}`);
  });
