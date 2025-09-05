import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();
const BASE_URL = "https://komikstation.org";

// 🏠 Root
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "KomikStation Scraper API aktif 🚀" });
});

// 1. New Manhwa
app.get("/api/manhwa-new", async (req, res) => {
  try {
    const { data } = await axios.get(BASE_URL);
    const $ = cheerio.load(data);
    const result = [];

    $(".animepost").each((i, el) => {
      result.push({
        title: $(el).find(".tt h4").text().trim(),
        link: $(el).find("a").attr("href"),
        thumb: $(el).find("img").attr("src")
      });
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Manhwa Populer
app.get("/api/manhwa-popular", async (req, res) => {
  try {
    const { data } = await axios.get(BASE_URL);
    const $ = cheerio.load(data);
    const result = [];

    $(".wpopanime .series").each((i, el) => {
      result.push({
        title: $(el).find(".tt").text().trim(),
        link: $(el).find("a").attr("href"),
        thumb: $(el).find("img").attr("src")
      });
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Manhwa Top
app.get("/api/manhwa-top", async (req, res) => {
  try {
    const { data } = await axios.get(BASE_URL);
    const $ = cheerio.load(data);
    const result = [];

    $(".wpopanime .series").slice(0, 10).each((i, el) => {
      result.push({
        title: $(el).find(".tt").text().trim(),
        link: $(el).find("a").attr("href"),
        thumb: $(el).find("img").attr("src")
      });
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Manhwa Ongoing
app.get("/api/manhwa-ongoing", async (req, res) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/manga/?status=ongoing`);
    const $ = cheerio.load(data);
    const result = [];

    $(".animepost").each((i, el) => {
      result.push({
        title: $(el).find(".tt h4").text().trim(),
        link: $(el).find("a").attr("href"),
        thumb: $(el).find("img").attr("src")
      });
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Manhwa Recommendation
app.get("/api/manhwa-recommendation", async (req, res) => {
  try {
    const { data } = await axios.get(BASE_URL);
    const $ = cheerio.load(data);
    const result = [];

    $(".rekomx .series").each((i, el) => {
      result.push({
        title: $(el).find(".tt").text().trim(),
        link: $(el).find("a").attr("href"),
        thumb: $(el).find("img").attr("src")
      });
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Manhwa Details
app.get("/api/manhwa-detail/:id", async (req, res) => {
  try {
    const manhwaId = req.params.id;
    const url = `${BASE_URL}/manga/${manhwaId}/`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $(".entry-title").text().trim();
    const thumb = $(".thumb img").attr("src");
    const desc = $(".desc p").text().trim();
    const chapters = [];

    $(".lchx .lch").each((i, el) => {
      chapters.push({
        ch_title: $(el).find("a").text().trim(),
        ch_link: $(el).find("a").attr("href")
      });
    });

    res.json({ title, thumb, desc, chapters });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Chapter Details
app.get("/api/chapter/:id", async (req, res) => {
  try {
    const chapterId = req.params.id;
    const url = `${BASE_URL}/${chapterId}/`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const images = [];

    $(".reading-content img").each((i, el) => {
      images.push($(el).attr("src"));
    });

    res.json({ chapterId, images });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Genre List
app.get("/api/genres", async (req, res) => {
  try {
    const { data } = await axios.get(BASE_URL);
    const $ = cheerio.load(data);
    const result = [];

    $(".genrex a").each((i, el) => {
      result.push({
        genre: $(el).text().trim(),
        link: $(el).attr("href")
      });
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Manhwa by Genre
app.get("/api/genre/:id", async (req, res) => {
  try {
    const genreId = req.params.id;
    const { data } = await axios.get(`${BASE_URL}/genre/${genreId}/`);
    const $ = cheerio.load(data);
    const result = [];

    $(".animepost").each((i, el) => {
      result.push({
        title: $(el).find(".tt h4").text().trim(),
        link: $(el).find("a").attr("href"),
        thumb: $(el).find("img").attr("src")
      });
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Manhwa by Genre with Page
app.get("/api/genre/:id/page/:page", async (req, res) => {
  try {
    const { id, page } = req.params;
    const { data } = await axios.get(`${BASE_URL}/genre/${id}/page/${page}/`);
    const $ = cheerio.load(data);
    const result = [];

    $(".animepost").each((i, el) => {
      result.push({
        title: $(el).find(".tt h4").text().trim(),
        link: $(el).find("a").attr("href"),
        thumb: $(el).find("img").attr("src")
      });
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Manhwa Search
app.get("/api/search/:query", async (req, res) => {
  try {
    const { query } = req.params;
    const { data } = await axios.get(`${BASE_URL}/?s=${encodeURIComponent(query)}`);
    const $ = cheerio.load(data);
    const result = [];

    $(".animepost").each((i, el) => {
      result.push({
        title: $(el).find(".tt h4").text().trim(),
        link: $(el).find("a").attr("href"),
        thumb: $(el).find("img").attr("src")
      });
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 12. Manhwa Search with Page
app.get("/api/search/:query/page/:page", async (req, res) => {
  try {
    const { query, page } = req.params;
    const { data } = await axios.get(`${BASE_URL}/page/${page}/?s=${encodeURIComponent(query)}`);
    const $ = cheerio.load(data);
    const result = [];

    $(".animepost").each((i, el) => {
      result.push({
        title: $(el).find(".tt h4").text().trim(),
        link: $(el).find("a").attr("href"),
        thumb: $(el).find("img").attr("src")
      });
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 13. A-Z List Manhwa
app.get("/api/list", async (req, res) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/daftar-komik/`);
    const $ = cheerio.load(data);
    const result = [];

    $(".serieslist ul li").each((i, el) => {
      result.push({
        title: $(el).find("a").text().trim(),
        link: $(el).find("a").attr("href")
      });
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));

export default app;