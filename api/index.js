import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const BASE_URL = "https://komikstation.org";

// 🔹 axios fetch dengan headers biar aman (hindari 403)
const fetchHtml = async (url) => {
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
      "Referer": BASE_URL,
    },
  });
  return data;
};

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
      "/api/list",
    ],
  });
});

// 🔹 1. New Manhwa
app.get("/api/manhwa-new", async (req, res) => {
  try {
    const data = await fetchHtml(BASE_URL);
    const $ = cheerio.load(data);
    const results = [];

    $(".utao .uta").each((i, el) => {
      results.push({
        title: $(el).find(".luf h3 a").text(),
        link: $(el).find(".luf h3 a").attr("href"),
        latest: $(el).find(".luf ul li:first a").text(),
        thumbnail: $(el).find(".imgu img").attr("src"),
      });
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 2. Popular Manhwa
app.get("/api/manhwa-popular", async (req, res) => {
  try {
    const data = await fetchHtml(`${BASE_URL}/popular`);
    const $ = cheerio.load(data);
    const results = [];

    $(".utao .uta").each((i, el) => {
      results.push({
        title: $(el).find(".luf h3 a").text(),
        link: $(el).find(".luf h3 a").attr("href"),
        thumbnail: $(el).find(".imgu img").attr("src"),
      });
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 3. Top Manhwa
app.get("/api/manhwa-top", async (req, res) => {
  try {
    const data = await fetchHtml(`${BASE_URL}/top`);
    const $ = cheerio.load(data);
    const results = [];

    $(".utao .uta").each((i, el) => {
      results.push({
        title: $(el).find(".luf h3 a").text(),
        link: $(el).find(".luf h3 a").attr("href"),
        thumbnail: $(el).find(".imgu img").attr("src"),
      });
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 4. Ongoing Manhwa
app.get("/api/manhwa-ongoing", async (req, res) => {
  try {
    const data = await fetchHtml(`${BASE_URL}/ongoing`);
    const $ = cheerio.load(data);
    const results = [];

    $(".utao .uta").each((i, el) => {
      results.push({
        title: $(el).find(".luf h3 a").text(),
        link: $(el).find(".luf h3 a").attr("href"),
        thumbnail: $(el).find(".imgu img").attr("src"),
      });
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 5. Recommendation Manhwa
app.get("/api/manhwa-recommendation", async (req, res) => {
  try {
    const data = await fetchHtml(`${BASE_URL}/recommendation`);
    const $ = cheerio.load(data);
    const results = [];

    $(".utao .uta").each((i, el) => {
      results.push({
        title: $(el).find(".luf h3 a").text(),
        link: $(el).find(".luf h3 a").attr("href"),
        thumbnail: $(el).find(".imgu img").attr("src"),
      });
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 6. Manhwa Detail
app.get("/api/manhwa-detail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchHtml(`${BASE_URL}/manga/${id}`);
    const $ = cheerio.load(data);

    const title = $(".entry-title").text();
    const thumbnail = $(".thumb img").attr("src");
    const desc = $(".entry-content").text().trim();

    res.json({ title, thumbnail, desc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 7. Chapter Detail
app.get("/api/chapter/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchHtml(`${BASE_URL}/${id}`);
    const $ = cheerio.load(data);

    const images = [];
    $(".reader-area img").each((i, el) => {
      images.push($(el).attr("src"));
    });

    res.json({ chapter: id, images });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 8. Genre List
app.get("/api/genres", async (req, res) => {
  try {
    const data = await fetchHtml(`${BASE_URL}/genres`);
    const $ = cheerio.load(data);

    const genres = [];
    $(".genres li a").each((i, el) => {
      genres.push({
        name: $(el).text(),
        link: $(el).attr("href"),
      });
    });

    res.json(genres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 9. Manhwa by Genre
app.get("/api/genre/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchHtml(`${BASE_URL}/genres/${id}`);
    const $ = cheerio.load(data);

    const results = [];
    $(".utao .uta").each((i, el) => {
      results.push({
        title: $(el).find(".luf h3 a").text(),
        link: $(el).find(".luf h3 a").attr("href"),
      });
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 10. Manhwa by Genre with Page
app.get("/api/genre/:id/page/:page", async (req, res) => {
  try {
    const { id, page } = req.params;
    const data = await fetchHtml(`${BASE_URL}/genres/${id}/page/${page}`);
    const $ = cheerio.load(data);

    const results = [];
    $(".utao .uta").each((i, el) => {
      results.push({
        title: $(el).find(".luf h3 a").text(),
        link: $(el).find(".luf h3 a").attr("href"),
      });
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 11. Search Manhwa
app.get("/api/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    const data = await fetchHtml(`${BASE_URL}/?s=${query}`);
    const $ = cheerio.load(data);

    const results = [];
    $(".utao .uta").each((i, el) => {
      results.push({
        title: $(el).find(".luf h3 a").text(),
        link: $(el).find(".luf h3 a").attr("href"),
      });
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 12. Search with Page
app.get("/api/search/:query/page/:page", async (req, res) => {
  try {
    const { query, page } = req.params;
    const data = await fetchHtml(`${BASE_URL}/page/${page}/?s=${query}`);
    const $ = cheerio.load(data);

    const results = [];
    $(".utao .uta").each((i, el) => {
      results.push({
        title: $(el).find(".luf h3 a").text(),
        link: $(el).find(".luf h3 a").attr("href"),
      });
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 13. A-Z List
app.get("/api/list", async (req, res) => {
  try {
    const data = await fetchHtml(`${BASE_URL}/list`);
    const $ = cheerio.load(data);

    const results = [];
    $(".serieslist li a").each((i, el) => {
      results.push({
        title: $(el).text(),
        link: $(el).attr("href"),
      });
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Vercel Export
app.listen(3000, () => console.log("Server running on port 3000"));
export default app;      chapters.push({
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
