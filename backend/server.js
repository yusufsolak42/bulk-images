const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

const imagesDir = path.join(__dirname, "../images");

// Serve static files from the "frontend" directory
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/images", express.static(imagesDir));



// API endpoint to get photos with pagination
app.get("/api/photos", (req, res) => {
  const city = req.query.city; // Get the city from query parameters
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  const cityFolder = path.join(imagesDir, city); // Point to the city folder
  app.use("/images", express.static(cityFolder));


  if (!fs.existsSync(cityFolder)) {   // Check if the city folder exists
    return res.status(404).json({ error: "City not found" });
  }

  fs.readdir(cityFolder, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read images directory" });
    }

    // Filter image files
    const imageFiles = files.filter((file) =>
      [".jpg", ".jpeg", ".png"].includes(path.extname(file).toLowerCase())
    );

    // Generate metadata for images
    const photos = imageFiles.slice(startIndex, endIndex).map((file) => ({
      url: `/images/${file}`,
      description: path.basename(file, path.extname(file)), // Optional: Use filename as description
    }));

    const totalPages = Math.ceil(imageFiles.length / limit);

    res.json({ photos, totalPages });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
