const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/translate", async (req, res) => {
  try {
    const { text, source = "ca", target = "en" } = req.body;

    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`
    );

    const data = await response.json();

    res.json({
      translatedText: data.responseData.translatedText
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Translation failed" });
  }
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});