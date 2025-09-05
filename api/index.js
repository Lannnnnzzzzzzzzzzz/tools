import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const BASE_URL = "https://komikstation.org";

// ✅ Route utama
app.get("/", (req, res) => {
  res.json({
    message: "✅ API Manhwa Scraper is running!",
    endpoints: [
      "/api/manhwa-new",
      "/api/manhwa-popular",
      "/api/manhwa-top",
      "/api/manhwa-ongoing",
      "/api/manhwa-recommendation",
      "/api/manhwa-detail/:id",
      "/api/chapter/:id",
      "/api/genres",
      "/api/genre/:id",
      "/api/genre/:id/page/:page",
      "/api/search/:query",
      "/api/search/:query/page/:page",
      "/api/list"
    ],
  });
});

// Helper: scrap list manhwa
const scrapeList = async (url) => {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  let results = [];
  $(".utao .uta").each((i, el) => {
    results.push({
      title: $(el).find(".luf h3 a").text(),
      link: $(el).find(".luf h3 a").attr("href"),
      latest: $(el).find(".luf ul li:first a").text(),
      thumbnail: $(el).find(".imgu img").attr("src"),
    });
  });
  return results;
};

// 1. New Manhwa
app.get("/api/manhwa-new", async (req, res) => {
  try {
    const results = await scrapeList(`${BASE_URL}`);
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 2. Manhwa Populer
app.get("/api/manhwa-popular", async (req, res) => {
  try {
    const results = await scrapeList(`${BASE_URL}/project-popular/`);
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 3. Manhwa Top
app.get("/api/manhwa-top", async (req, res) => {
  try {
    const results = await scrapeList(`${BASE_URL}/project-teratas/`);
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 4. Manhwa Ongoing
app.get("/api/manhwa-ongoing", async (req, res) => {
  try {
    const results = await scrapeList(`${BASE_URL}/project-ongoing/`);
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 5. Manhwa Recommendation
app.get("/api/manhwa-recommendation", async (req, res) => {
  try {
    const results = await scrapeList(`${BASE_URL}/project-rekomendasi/`);
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 6. Manhwa Details
app.get("/api/manhwa-detail/:id", async (req, res) => {
  try {
    const url = `${BASE_URL}/manga/${req.params.id}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $(".entry-title").text();
    const thumbnail = $(".infomanga .thumb img").attr("src");
    const desc = $(".entry-content p").text();

    let chapters = [];
    $(".clstyle li").each((i, el) => {
      chapters.push({
        chapter: $(el).find("a").text().trim(),
        link: $(el).find("a").attr("href"),
      });
    });

    res.json({ title, thumbnail, desc, chapters });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 7. Chapter Details
app.get("/api/chapter/:id", async (req, res) => {
  try {
    const url = `${BASE_URL}/${req.params.id}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    let images = [];
    $(".reader-area img").each((i, el) => {
      images.push($(el).attr("src"));
    });

    res.json({ chapter: req.params.id, images });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 8. Genre List
app.get("/api/genres", async (req, res) => {
  try {
    const { data } = await axios.get(BASE_URL);
    const $ = cheerio.load(data);

    let genres = [];
    $(".genres li a").each((i, el) => {
      genres.push({
        name: $(el).text(),
        link: $(el).attr("href"),
      });
    });

    res.json(genres);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 9 & 10. Manhwa by Genre (+ page)
app.get("/api/genre/:id/page/:page?", async (req, res) => {
  try {
    const { id, page } = req.params;
    const url = `${BASE_URL}/genre/${id}/page/${page || 1}`;
    const results = await scrapeList(url);
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 11 & 12. Search (+ page)
app.get("/api/search/:query/page/:page?", async (req, res) => {
  try {
    const { query, page } = req.params;
    const url = `${BASE_URL}/page/${page || 1}?s=${query}`;
    const results = await scrapeList(url);
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// 13. A-Z List
app.get("/api/list", async (req, res) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/daftar-komik/`);
    const $ = cheerio.load(data);

    let results = [];
    $(".daftar .animepost").each((i, el) => {
      results.push({
        title: $(el).find(".tt h4").text(),
        link: $(el).find("a").attr("href"),
        thumbnail: $(el).find("img").attr("src"),
      });
    });

    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default app;
