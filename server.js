let lastId = 0;
let payload = { type: "text", text: "", image: "" };

app.post("/send", (req, res) => {
  if (req.headers["x-api-key"] !== API_KEY) {
    return res.status(401).json({ ok: false, error: "bad key" });
  }

  const type = String(req.body?.type ?? "text");
  const text = String(req.body?.text ?? "").slice(0, 120);
  const image = String(req.body?.image ?? "");

  if (type === "text" && !text.trim()) return res.status(400).json({ ok:false, error:"empty text" });
  if (type === "image" && !image.trim()) return res.status(400).json({ ok:false, error:"empty image" });

  lastId++;
  payload = { type, text, image };
  res.json({ ok: true, id: lastId });
});

app.get("/latest", (req, res) => {
  if (req.headers["x-api-key"] !== API_KEY) {
    return res.status(401).json({ ok: false, error: "bad key" });
  }
  res.json({ id: lastId, ...payload });
});
