const express = require("express");
const axios = require("axios");
const path = require("path");
const querystring = require("querystring");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для статических файлов
app.use(express.static(path.join(__dirname, "public")));

// Middleware для CORS и iframe
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // В продакшене замените на https://vk.com
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("X-Frame-Options", "ALLOW-FROM https://vk.com");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Роут для получения данных с API
app.get("/api/products", async (req, res) => {
  try {
    const response = await axios.get("https://fakestoreapi.com/products");
    res.json(response.data);
  } catch (error) {
    console.error("Ошибка API:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Корневой роут с логированием VK параметров
app.get("/", (req, res) => {
  const vkParams = querystring.stringify(req.query);
  console.log("VK параметры в запросе:", req.query);
  res.sendFile(path.join(__dirname, "public", "index.html"), {
    headers: {
      "Content-Security-Policy": "frame-ancestors 'self' https://vk.com;",
    },
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
