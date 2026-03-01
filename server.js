const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// CHANGE THIS to something hard to guess
const API_KEY = process.env.API_KEY;
if (!API_KEY) throw new Error("Missing API_KEY env var");

// store latest message
let lastMessage = "";
let lastId = 0;

// Website sends message here
app.post("/send", (req, res) => {
  if (req.headers["x-api-key"] !== API_KEY) {
    return res.status(401).json({ ok: false, error: "bad key" });
  }

  const msg = String(req.body?.message ?? "").slice(0, 120).trim();
  if (!msg) return res.status(400).json({ ok: false, error: "empty message" });

  lastId++;
  lastMessage = msg;

  res.json({ ok: true, id: lastId });
});

// Roblox reads message here
app.get("/latest", (req, res) => {
  if (req.headers["x-api-key"] !== API_KEY) {
    return res.status(401).json({ ok: false, error: "bad key" });
  }

  res.json({ id: lastId, message: lastMessage });
});

// IMPORTANT: Render gives you a PORT env var
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("API running on port", PORT));
