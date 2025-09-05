import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = "https://komikstation.org";

// 🔹 helper fetch html
async function fetchHtml(url) {
  const { data } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/116 Safari/537.36",
    },
  });
  return data;
}

// 🔹 1. Home (manhwa terbaru)
app.get("/api/home", async (req, res) => {
  try {
    const data = await fetchHtml(BASE_URL);
    const $ = cheerio.load(data);
    const results = [];

    $(".listupd .utao").each((i, el) => {
      const title = $(el).find(".uta .luf h3 a").text().trim();
      const link = $(el).find(".uta .luf h3 a").attr("href");
      const thumbnail = $(el).find(".imgu img").attr("src");
      const latest_chapter = $(el).find(".uta .luf ul li a").first().text();

      results.push({ title, link, thumbnail, latest_chapter });
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 2. Daftar semua manhwa
app.get("/api/list", async (req, res) => {
  try {
    const data = await fetchHtml(`${BASE_URL}/daftar-komik/`);
    const $ = cheerio.load(data);
    const results = [];

    $(".listupd .utao").each((i, el) => {
      const title = $(el).find(".uta .luf h3 a").text().trim();
      const link = $(el).find(".uta .luf h3 a").attr("href");
      const thumbnail = $(el).find(".imgu img").attr("src");

      results.push({ title, link, thumbnail });
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 3. Detail manhwa
app.get("/api/detail", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "url param required" });

    const data = await fetchHtml(url);
    const $ = cheerio.load(data);

    const title = $(".entry-title").text().trim();
    const thumbnail = $(".thumb img").attr("src");
    const synopsis = $(".entry-content p").first().text().trim();
    const genres = [];
    $(".genres a").each((i, el) => {
      genres.push($(el).text().trim());
    });

    const chapters = [];
    $(".eplister ul li").each((i, el) => {
      chapters.push({
        chapter: $(el).find(".eph-num a").text().trim(),
        link: $(el).find(".eph-num a").attr("href"),
        date: $(el).find(".eph-date").text().trim(),
      });
    });

    res.json({ title, thumbnail, synopsis, genres, chapters });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 4. Baca chapter
app.get("/api/chapter", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "url param required" });

    const data = await fetchHtml(url);
    const $ = cheerio.load(data);

    const images = [];
    $(".reading-content img").each((i, el) => {
      const img = $(el).attr("src");
      if (img) images.push(img);
    });

    res.json({ images });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 5. Pencarian
app.get("/api/search", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "q param required" });

    const data = await fetchHtml(`${BASE_URL}/?s=${q}`);
    const $ = cheerio.load(data);
    const results = [];

    $(".listupd .utao").each((i, el) => {
      const title = $(el).find(".uta .luf h3 a").text().trim();
      const link = $(el).find(".uta .luf h3 a").attr("href");
      const thumbnail = $(el).find(".imgu img").attr("src");

      results.push({ title, link, thumbnail });
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 6. Genre list
app.get("/api/genres", async (req, res) => {
  try {
    const data = await fetchHtml(`${BASE_URL}/daftar-genre/`);
    const $ = cheerio.load(data);

    const genres = [];
    $(".genre-list a").each((i, el) => {
      genres.push({
        name: $(el).text().trim(),
        link: $(el).attr("href"),
      });
    });

    res.json(genres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 default route
app.get("/", (req, res) => {
  res.send("✅ Komikstation API Scraper aktif!");
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});

export default app;    res.status(500).json({ error: err.message });
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
