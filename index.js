// express  js starting point
const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const port = process.env.PORT || 3002n;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// connecting to data base
mongoose.connect(process.env.MONGOOSE);
// connecting to localhost
app.listen(port, () => console.log(`app is running on port ${port}`));

app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// multer storage foe storing pictures in database
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    const filename = path.join(
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// creating schemas
const Product = mongoose.model("product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  subcategory: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: String,
    default: true,
  },
});

// adding product
app.post("/addproduct", async (req, res) => {
  let allProduct = await Product.find({});
  let id = 1;
  if (allProduct.length > 0) {
    let last_product_array = allProduct.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const products = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    price: req.body.price,
    category: req.body.category,
    subcategory: req.body.subcategory,
  });
  console.log(products);
  await products.save();
  console.log("save");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// deleting product
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({
    id: req.body.id,
  });
  console.log("remove");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// fetching all product
app.get("/allproduct", async (req, res) => {
  let products = await Product.find({});
  console.log("all product fetch");
  res.send(products);
});
