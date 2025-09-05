import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const BASE_URL = "https://komikstation.org";

// 🔹 axios instance dengan headers biar lolos anti-scraping
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36",
    "Referer": BASE_URL,
    "Accept-Language": "en-US,en;q=0.9",
  },
});

// Helper buat parse manhwa list
function parseManhwaList($, selector) {
  const result = [];
  $(selector).each((i, el) => {
    const title = $(el).find(".tt h4").text().trim() || $(el).find(".tt").text().trim();
    const link = $(el).find("a").attr("href");
    const thumb = $(el).find("img").attr("src");
    result.push({ title, link, thumb });
  });
  return result;
}

// 1. New Manhwa
app.get("/api/manhwa-new", async (req, res) => {
  try {
    const { data } = await instance.get("/");
    const $ = cheerio.load(data);
    res.json(parseManhwaList($, ".animepost"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Popular Manhwa
app.get("/api/manhwa-popular", async (req, res) => {
  try {
    const { data } = await instance.get("/");
    const $ = cheerio.load(data);
    res.json(parseManhwaList($, ".wpopanime .series"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Top Manhwa (mapping ke bagian rekom/top)
app.get("/api/manhwa-top", async (req, res) => {
  try {
    const { data } = await instance.get("/");
    const $ = cheerio.load(data);
    res.json(parseManhwaList($, ".series .tt"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Ongoing Manhwa
app.get("/api/manhwa-ongoing", async (req, res) => {
  try {
    const { data } = await instance.get("/manga/?status=ongoing");
    const $ = cheerio.load(data);
    res.json(parseManhwaList($, ".animepost"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Recommendation
app.get("/api/manhwa-recommendation", async (req, res) => {
  try {
    const { data } = await instance.get("/");
    const $ = cheerio.load(data);
    res.json(parseManhwaList($, ".series .animposx"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Manhwa Detail
app.get("/api/manhwa-detail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await instance.get(`/manga/${id}/`);
    const $ = cheerio.load(data);

    const title = $(".entry-title").text().trim();
    const thumb = $(".thumb img").attr("src");
    const desc = $(".desc p").text().trim();
    const chapters = [];

    $(".lchx .lch").each((i, el) => {
      const ch_title = $(el).find("a").text().trim();
      const ch_link = $(el).find("a").attr("href");
      chapters.push({ ch_title, ch_link });
    });

    res.json({ title, thumb, desc, chapters });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Chapter Detail
app.get("/api/chapter/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await instance.get(`/chapter/${id}/`);
    const $ = cheerio.load(data);

    const images = [];
    $(".reading-content img").each((i, el) => {
      images.push($(el).attr("src"));
    });

    res.json({ chapter: id, images });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Genres
app.get("/api/genres", async (req, res) => {
  try {
    const { data } = await instance.get("/genres/");
    const $ = cheerio.load(data);
    const result = [];
    $(".genres li a").each((i, el) => {
      result.push({
        name: $(el).text().trim(),
        link: $(el).attr("href"),
      });
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9 & 10. Genre List + Pagination
app.get("/api/genre/:id/page/:page?", async (req, res) => {
  try {
    const { id, page } = req.params;
    const url = page
      ? `/genres/${id}/page/${page}/`
      : `/genres/${id}/`;
    const { data } = await instance.get(url);
    const $ = cheerio.load(data);
    res.json(parseManhwaList($, ".animepost"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11 & 12. Search + Pagination
app.get("/api/search/:query/page/:page?", async (req, res) => {
  try {
    const { query, page } = req.params;
    const url = page
      ? `/?s=${encodeURIComponent(query)}&page=${page}`
      : `/?s=${encodeURIComponent(query)}`;
    const { data } = await instance.get(url);
    const $ = cheerio.load(data);
    res.json(parseManhwaList($, ".animepost"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 13. A-Z List
app.get("/api/list", async (req, res) => {
  try {
    const { data } = await instance.get("/manga-list/");
    const $ = cheerio.load(data);
    res.json(parseManhwaList($, ".animepost"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(3000, () => {
  console.log("✅ API ready on port 3000");
});

export default app;
