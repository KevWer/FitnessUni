import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import UserRoutes from "./routes/User.js";
import fs from 'fs';
import http from 'http';
import https from 'https';
import path from 'path';

dotenv.config();

const app = express();

// HTTP- und HTTPS-Server-Optionen
const httpPort = 80;
const httpsPort = 443;

// Path to SSL certificate and key
const sslOptions = {
      key: fs.readFileSync('/var/www/certs/privkey.pem'),
      cert: fs.readFileSync('/var/www/certs/fullchain.pem')
};

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true })); // for form data

app.use("/api/user/", UserRoutes);
// error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

// Statische Dateien aus dem Frontend-Build-Ordner bedienen
app.use(express.static(path.join('../my-app/build')));

// Fallback für alle anderen Routen
app.get('*', (req, res) => {
  res.sendFile(path.join('../my-app/build', 'index.html'));
});


app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Hello developers from HS EmdenLeer",
  });
});

const connectDB = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to Mongo DB"))
    .catch((err) => {
      console.error("failed to connect with mongo");
      console.error(err);
    });
};

const startServer = async () => {
    try {
      connectDB();

      // HTTP-Server
      http.createServer(app).listen(httpPort, () => {
        console.log(`HTTP Server running on port ${httpPort}`);
      });
  
      // HTTPS-Server
      https.createServer(sslOptions, app).listen(httpsPort, () => {
        console.log(`HTTPS Server running on port ${httpsPort}`);
      });
  
    } catch (error) {
      console.log(error);
    }
  };
  
  startServer();