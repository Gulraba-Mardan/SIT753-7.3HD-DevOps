require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const itemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["lost", "found"],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("Item", itemSchema);

const app = express();
const PORT = process.env.PORT || 3000;


// Parse JSON request bodies
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// Student identity endpoint required for SIT725 8.2HD
app.get("/api/student", (req, res) => {
  res.json({
    name: "Gulireba-Maierdan",
    studentId: "224414026",
  });
});


// GET all items
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });

    const formattedItems = items.map((item) => ({
      id: item._id.toString(),
      type: item.type,
      title: item.title,
      category: item.category,
      date: item.date,
      location: item.location,
      description: item.description,
      status: item.status,
    }));

    res.json(formattedItems);
    } catch {
    res.status(500).json({
      message: "Unable to load reports.",
    });
  }
});

// POST a new item
app.post("/api/items", async (req, res) => {
  try {
    const { type, title, category, date, location, description } = req.body;

    if (!type || !title || !category || !date || !location || !description) {
      return res.status(400).json({
        message: "All required fields must be provided.",
      });
    }

    const newItem = await Item.create({
      type,
      title,
      category,
      date,
      location,
      description,
    });

    res.status(201).json({
      message: "Report created successfully.",
      item: {
        id: newItem._id.toString(),
        type: newItem.type,
        title: newItem.title,
        category: newItem.category,
        date: newItem.date,
        location: newItem.location,
        description: newItem.description,
        status: newItem.status,
      },
    });
  } catch {
    res.status(500).json({
      message: "Unable to create report.",
    });
  }
});

// Export (used by tests via Supertest)

module.exports = { app };

// Start server
if (require.main === module) {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("MONGODB_URI is not defined.");
    process.exit(1);
  }

  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB");

      app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error.message);
      process.exit(1);
    });
}
