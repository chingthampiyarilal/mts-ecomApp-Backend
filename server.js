import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/MTSEcomCustomerRoutes.js';
import connectDB from './config/db.js';
import path from 'path';
import fs from 'fs';
import Category from './model/MTSEcomCategory.js';
import Product from './model/MTSEcomProduct.js';
import orderRoutes from './routes/MTSEcoOrderRoutes.js';
import { fileURLToPath } from 'url';
import paymentRoutes from './routes/MTSEcomConfirmRoutes.js'
import Classification from './model/MTSEcomClassification.js'
import ClassificationAttribute from './model/MTSEcomClassificationAttributes.js'

// Workaround for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// Routes
app.use('/api/auth', authRoutes);

// Route to serve image files
app.get('/api/images', (req, res) => {
  const imagesDirectory = path.join(__dirname, 'assets', 'images');
  fs.readdir(imagesDirectory, (err, files) => {
    if (err) {
      return res.status(500).send('Error reading image files');
    }
    console.log(files);
    const imagePaths = files.filter(file => file.endsWith('.png') || file.endsWith('.jpg'))
      .map(file => `/assets/images/${file}`);

    res.json(imagePaths);
  });
});

// Static file serving for assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Route for categories
app.get('/api/categories', (req, res) => {
  Category.find()
    .then((categories) => {
      res.json(categories);
    })
    .catch((error) => {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Error fetching categories' });
    });
});

// Route for products by category
app.get('/api/product', async (req, res) => {
  const { category } = req.query;

  try {
    let query = {};
    if (category) {
      query['catID'] = category;
    }

    const products = await Product.find(query);

    const enrichedProducts = await Promise.all(
      products.map(async (product) => {
        const classification = await Classification.findOne({ classificationID: product.classificationID });
        console.log("Looking for classification with ID:", product.classificationID);
        const attributes = await ClassificationAttribute.find({
          classificationID: product.classificationID,
        });

        return {
          ...product.toObject(),
          classificationName: classification?.classificationName || null,
          classificationAttributes: attributes.map(attr => attr.toObject()),
        };
      })
    );

    res.json(enrichedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});


// Route to fetch a product by productId
app.get('/api/product/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findOne({ productId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const classification = await Classification.findOne({ classificationID: product.classificationID });

    const attributes = await ClassificationAttribute.find({
      classificationID: product.classificationID,
    });

    res.json({
      ...product.toObject(),
      classification: classification ? classification.toObject() : null,
      classificationAttributes: attributes.map(attr => attr.toObject()),
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});


// Order routes
app.use('/api', orderRoutes);
app.use('/api', paymentRoutes)

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
