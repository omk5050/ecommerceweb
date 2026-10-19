import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary';
import Product, { IProduct } from '../models/Product';

interface ProductSeedItem {
  name: string;
  category: string;
  price: number;
  size: string;
  material: string;
  color: string;
  description: string;
  localImageFile: string;
}

const productsToSeed: ProductSeedItem[] = [
  // BOWLS (10)
  {
    name: '150ml Dona Classio Bio',
    category: 'Bowls',
    price: 149,
    size: '150ml',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '150ml Dona Classio Bio bowl made from sugarcane bagasse. Volume: 150ml. Designed for convenient everyday food serving.',
    localImageFile: '150ml-dona-classio-bio.png',
  },
  {
    name: '180ml Classio Bio Bowl',
    category: 'Bowls',
    price: 179,
    size: '180ml / 6oz',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '180ml Classio Bio bowl made from bagasse. Diameter: 93.5mm, Depth: 45mm, Volume: 180ml. Designed for convenient everyday food serving.',
    localImageFile: '180ml-classio-bio-bowl.png',
  },
  {
    name: '240ml Classio Bio Bowl',
    category: 'Bowls',
    price: 219,
    size: '240ml / 8oz',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '240ml Classio Bio bowl made from bagasse. Diameter: 115mm, Depth: 51.6mm, Volume: 240ml. Designed for convenient everyday food serving.',
    localImageFile: '240ml-classio-bio-bowl.png',
  },
  {
    name: '360ml Super Classio Bio Bowl',
    category: 'Bowls',
    price: 279,
    size: '360ml',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '360ml Super Classio Bio bowl made from bagasse. Diameter: 150mm, Depth: 37mm, Volume: 360ml. Designed for convenient everyday food serving.',
    localImageFile: '360ml-super-classio-bio-bowl.png',
  },
  {
    name: '480ml Bowl',
    category: 'Bowls',
    price: 329,
    size: '480ml',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '480ml bowl made from bagasse for generous portions. Diameter: 146mm, Depth: 56mm, Volume: 480ml. Designed for convenient everyday food serving.',
    localImageFile: '480ml-bowl.png',
  },
  {
    name: '120ml Bowl',
    category: 'Bowls',
    price: 129,
    size: '120ml',
    material: '100% Sugarcane Bagasse',
    color: 'Natural Brown',
    description: '120ml standard bowl made from bagasse. Dimensions: 88 x 88 x 33 mm. Designed for convenient everyday food serving.',
    localImageFile: '120ml-bowl.png',
  },
  {
    name: '180ml Bowl',
    category: 'Bowls',
    price: 169,
    size: '180ml',
    material: '100% Sugarcane Bagasse',
    color: 'Natural Brown',
    description: '180ml standard bowl made from bagasse. Dimensions: 105 x 105 x 35 mm. Designed for convenient everyday food serving.',
    localImageFile: '180ml-bowl.png',
  },
  {
    name: '250ml Bowl',
    category: 'Bowls',
    price: 229,
    size: '250ml',
    material: '100% Sugarcane Bagasse',
    color: 'Natural Brown',
    description: '250ml standard bowl made from bagasse. Dimensions: 130 x 105 x 35 mm. Designed for convenient everyday food serving.',
    localImageFile: '250ml-bowl.png',
  },
  {
    name: '180ml Round Bowl',
    category: 'Bowls',
    price: 179,
    size: '180ml',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '180ml round bowl made from bagasse. Top Diameter: 100mm, Base Diameter: 47.4mm, Depth: 45mm, Volume: 180ml. Designed for convenient everyday food serving.',
    localImageFile: '180ml-round-bowl.png',
  },
  {
    name: '240ml Round Bowl',
    category: 'Bowls',
    price: 219,
    size: '240ml',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '240ml round bowl made from bagasse. Top Diameter: 110mm, Base Diameter: 54.5mm, Depth: 45mm, Volume: 240ml. Designed for convenient everyday food serving.',
    localImageFile: '240ml-round-bowl.png',
  },

  // PLATES (10)
  {
    name: '6" Round Plate',
    category: 'Plates',
    price: 199,
    size: '6 inch',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '6 inch round plate made from bagasse. Diameter: 153mm, Depth: 15mm. Designed for convenient everyday food serving.',
    localImageFile: '6-round-plate.png',
  },
  {
    name: '7" Round Plate',
    category: 'Plates',
    price: 249,
    size: '7 inch',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '7 inch round plate made from bagasse. Diameter: 178mm, Depth: 17mm. Designed for convenient everyday food serving.',
    localImageFile: '7-round-plate.png',
  },
  {
    name: '9" Round Plate',
    category: 'Plates',
    price: 349,
    size: '9 inch',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '9 inch round plate made from bagasse. Diameter: 230mm, Depth: 20mm. Designed for convenient everyday food serving.',
    localImageFile: '9-round-plate.png',
  },
  {
    name: '10" Round Plate',
    category: 'Plates',
    price: 419,
    size: '10 inch',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '10 inch round plate made from bagasse. Diameter: 254mm, Depth: 20mm. Designed for convenient everyday food serving.',
    localImageFile: '10-round-plate.png',
  },
  {
    name: '11" Round Plate',
    category: 'Plates',
    price: 479,
    size: '11 inch',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '11 inch round plate made from bagasse. Diameter: 280mm, Depth: 24mm. Designed for convenient everyday food serving.',
    localImageFile: '11-round-plate.png',
  },
  {
    name: '6" Plate',
    category: 'Plates',
    price: 199,
    size: '6 inch',
    material: '100% Sugarcane Bagasse',
    color: 'Natural Brown',
    description: '6 inch plate made from bagasse. Dimensions: 152 x 152 x 20.6 mm. Designed for convenient everyday food serving.',
    localImageFile: '6-plate.png',
  },
  {
    name: '7" Plate',
    category: 'Plates',
    price: 249,
    size: '7 inch',
    material: '100% Sugarcane Bagasse',
    color: 'Natural Brown',
    description: '7 inch plate made from bagasse. Dimensions: 170 x 170 x 20.6 mm. Designed for convenient everyday food serving.',
    localImageFile: '7-plate.png',
  },
  {
    name: '9" Plate',
    category: 'Plates',
    price: 349,
    size: '9 inch',
    material: '100% Sugarcane Bagasse',
    color: 'Natural Brown',
    description: '9 inch plate made from bagasse. Dimensions: 229 x 229 x 20.6 mm. Designed for convenient everyday food serving.',
    localImageFile: '9-plate.png',
  },
  {
    name: '10" Plate',
    category: 'Plates',
    price: 419,
    size: '10 inch',
    material: '100% Sugarcane Bagasse',
    color: 'Natural Brown',
    description: '10 inch plate made from bagasse. Dimensions: 255 x 255 x 20.6 mm. Designed for convenient everyday food serving.',
    localImageFile: '10-plate.png',
  },
  {
    name: '12" Plate',
    category: 'Plates',
    price: 529,
    size: '12 inch',
    material: '100% Sugarcane Bagasse',
    color: 'Natural Brown',
    description: '12 inch plate made from bagasse. Dimensions: 305 x 305 x 20.6 mm. Designed for convenient everyday food serving.',
    localImageFile: '12-plate.png',
  },

  // TAKEAWAY BOXES (5)
  {
    name: '6" Clamshell Takeaway Box',
    category: 'Takeaway Boxes',
    price: 399,
    size: '6 inch',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '6 inch clamshell takeaway box made from bagasse. Dimensions: 155 x 155 x 49 mm, Depth: 87 mm. Designed for convenient everyday food serving.',
    localImageFile: '6-clamshell-takeaway-box.png',
  },
  {
    name: '8" Clamshell Takeaway Box',
    category: 'Takeaway Boxes',
    price: 549,
    size: '8 inch',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '8 inch clamshell takeaway box made from bagasse. Dimensions: 205 x 205 x 49 mm, Depth: 90 mm. Designed for convenient everyday food serving.',
    localImageFile: '8-clamshell-takeaway-box.png',
  },
  {
    name: '9" Clamshell Takeaway Box',
    category: 'Takeaway Boxes',
    price: 649,
    size: '9 inch',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '9 inch clamshell takeaway box made from bagasse. Dimensions: 229 x 229 x 53 mm, Depth: 91 mm. Designed for convenient everyday food serving.',
    localImageFile: '9-clamshell-takeaway-box.png',
  },
  {
    name: '8" 3CP Clamshell Takeaway Box',
    category: 'Takeaway Boxes',
    price: 599,
    size: '8 inch',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '8 inch 3-compartment clamshell takeaway box made from bagasse. Dimensions: 205 x 205 x 46 mm, Depth: 87 mm. Designed for convenient everyday food serving.',
    localImageFile: '8-3cp-clamshell-takeaway-box.png',
  },
  {
    name: '9" 3CP Clamshell Takeaway Box',
    category: 'Takeaway Boxes',
    price: 699,
    size: '9 inch',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '9 inch 3-compartment clamshell takeaway box made from bagasse. Dimensions: 229 x 229 x 51 mm, Depth: 89 mm. Designed for convenient everyday food serving.',
    localImageFile: '9-3cp-clamshell-takeaway-box.png',
  },

  // CUTLERY (2)
  {
    name: 'Spoon',
    category: 'Cutlery',
    price: 89,
    size: '158mm',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: 'Spoon made from bagasse. Dimensions: 158 x 35.5 x 7 mm. Designed for convenient everyday food serving.',
    localImageFile: 'spoon.png',
  },
  {
    name: 'Fork',
    category: 'Cutlery',
    price: 89,
    size: '158mm',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: 'Fork made from bagasse. Dimensions: 158 x 35 x 6 mm. Designed for convenient everyday food serving.',
    localImageFile: 'fork.png',
  },

  // CUPS (2)
  {
    name: '220ml Drink Cup',
    category: 'Cups',
    price: 189,
    size: '220ml',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '220ml drink cup made from bagasse. Top Diameter: 78mm, Base Diameter: 50.8mm, Height: 80mm. Designed for convenient everyday beverage serving.',
    localImageFile: '220ml-drink-cup.png',
  },
  {
    name: '250ml Drink Cup',
    category: 'Cups',
    price: 219,
    size: '250ml',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '250ml drink cup made from bagasse. Top Diameter: 89mm, Base Diameter: 54mm, Height: 80mm. Designed for convenient everyday beverage serving.',
    localImageFile: '250ml-drink-cup.png',
  },

  // CUP LIDS (2)
  {
    name: '80mm Drink Cup Lid',
    category: 'Cup Lids',
    price: 99,
    size: '80mm',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '80mm drink cup lid made from bagasse. Top Diameter: 83.8mm, Base Diameter: 76mm, Height: 22mm. Designed for a secure fit on compatible cups.',
    localImageFile: '80mm-drink-cup-lid.png',
  },
  {
    name: '90mm Drink Cup Lid',
    category: 'Cup Lids',
    price: 119,
    size: '90mm',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '90mm drink cup lid made from bagasse. Top Diameter: 94mm, Base Diameter: 87mm, Height: 22.2mm. Designed for a secure fit on compatible cups.',
    localImageFile: '90mm-drink-cup-lid.png',
  },

  // COMPARTMENT PLATES (7)
  {
    name: '9" 3CP Round Plate',
    category: 'Plates',
    price: 369,
    size: '9 inch',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '9 inch 3-compartment round plate made from bagasse. Diameter: 230mm, Depth: 20mm. Designed for convenient portioned everyday dining.',
    localImageFile: '9-3cp-round-plate.png',
  },
  {
    name: '10" 3CP Round Plate',
    category: 'Plates',
    price: 439,
    size: '10 inch',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '10 inch 3-compartment round plate made from bagasse. Diameter: 254mm, Depth: 22mm. Designed for convenient portioned everyday dining.',
    localImageFile: '10-3cp-round-plate.png',
  },
  {
    name: '11" 4CP Round Plate',
    category: 'Plates',
    price: 499,
    size: '11 inch',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '11 inch 4-compartment round plate made from bagasse. Diameter: 280mm, Depth: 24mm. Designed for generous multi-dish everyday dining.',
    localImageFile: '11-4cp-round-plate.png',
  },
  {
    name: '12" 4CP Round Plate',
    category: 'Plates',
    price: 549,
    size: '12 inch',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '12 inch 4-compartment round plate made from bagasse. Diameter: 305mm, Depth: 24mm. Designed for large buffet and catering portions.',
    localImageFile: '12-4cp-round-plate.png',
  },
  {
    name: '3 CP Square Meal Plate',
    category: 'Plates',
    price: 379,
    size: '221 × 221 × 23.5mm',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '3-compartment square meal plate made from bagasse. Dimensions: 221 x 221 x 23.5 mm. Designed for neat and sturdy food presentation.',
    localImageFile: '3-cp-square-meal-plate.png',
  },
  {
    name: '5 CP Rectangle Lunch Plate',
    category: 'Plates',
    price: 469,
    size: '270 × 218 × 26.5mm',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '5-compartment rectangle lunch plate made from bagasse. Dimensions: 270 x 218 x 26.5 mm. Designed for traditional thali and combo lunches.',
    localImageFile: '5-cp-rectangle-lunch-plate.png',
  },
  {
    name: '10" 3 Compartment Square Tray',
    category: 'Plates',
    price: 389,
    size: '220.5 × 220.5 × 20mm',
    material: '100% Sugarcane Bagasse',
    color: 'Natural Brown',
    description: '10 inch 3-compartment square tray made from unbleached bagasse. Dimensions: 220.5 x 220.5 x 20 mm. Sturdy and eco-friendly.',
    localImageFile: '10-3-compartment-square-tray.png',
  },

  // CONTAINERS (4)
  {
    name: '500ml Oval Container with Lid Classio Bio',
    category: 'Containers',
    price: 449,
    size: '500ml',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '500ml oval container with lid made from Classio Bio bagasse. Dimensions: 235 x 129 x 42.2 mm. Ideal for curries, pasta, and takeout.',
    localImageFile: '500ml-oval-container-with-lid-classio-bio.png',
  },
  {
    name: '500ml Oval Container Lid Classio Bio',
    category: 'Containers',
    price: 149,
    size: '235 × 129 × 10.6mm',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: 'Matching bagasse lid for 500ml oval container. Dimensions: 235 x 129 x 10.6 mm. Ensures secure, spill-resistant takeaway closure.',
    localImageFile: '500ml-oval-container-lid-classio-bio.png',
  },
  {
    name: '750ml Rectangle Container with Lid',
    category: 'Containers',
    price: 499,
    size: '750ml',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '750ml rectangle container made from bagasse. Dimensions: 175 x 155 x 54.2 mm. Deep and sturdy for meal deliveries and takeaways.',
    localImageFile: '750ml-rectangle-container-with-lid.png',
  },
  {
    name: '750ml Rectangle Container Lid',
    category: 'Containers',
    price: 169,
    size: '175 × 155 × 10.6mm',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: 'Matching bagasse lid for 750ml rectangle container. Dimensions: 175 x 155 x 10.6 mm. Snug-fitting closure for deliveries.',
    localImageFile: '750ml-rectangle-container-lid.png',
  },

  // MEAL TRAYS (13)
  {
    name: '3 Compartment Meal Tray with Lid B2B',
    category: 'Meal Trays',
    price: 499,
    size: '850ml',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '3-compartment B2B meal tray made from bagasse. Dimensions: 243 x 197 x 14.1 mm, Volume: 850ml. Tailored for cloud kitchens and corporate catering.',
    localImageFile: '3-compartment-meal-tray-with-lid-b2b.png',
  },
  {
    name: '3 Compartment Meal Tray with Lid B2B (Lid)',
    category: 'Meal Trays',
    price: 179,
    size: '243 × 197 × 15.3mm',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: 'Secure matching bagasse lid for 3-compartment B2B meal tray. Dimensions: 243 x 197 x 15.3 mm. Keeps meals hot and intact.',
    localImageFile: '3-compartment-meal-tray-with-lid-b2b-lid.png',
  },
  {
    name: '4 Compartment Meal Tray with Lid B2B',
    category: 'Meal Trays',
    price: 549,
    size: '1080ml',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '4-compartment B2B meal tray made from bagasse. Dimensions: 280 x 216 x 34 mm, Volume: 1080ml. Excellent for multi-dish executive lunch boxes.',
    localImageFile: '4-compartment-meal-tray-with-lid-b2b.png',
  },
  {
    name: '4 Compartment Meal Tray with Lid B2B (Lid)',
    category: 'Meal Trays',
    price: 189,
    size: '280 × 216 × 14.1mm',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: 'Precision-molded bagasse lid for 4-compartment B2B meal tray. Dimensions: 280 x 216 x 14.1 mm.',
    localImageFile: '4-compartment-meal-tray-with-lid-b2b-lid.png',
  },
  {
    name: '5 Compartment Meal Tray with Lid B2B',
    category: 'Meal Trays',
    price: 599,
    size: '1180ml',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '5-compartment B2B meal tray made from bagasse. Dimensions: 300 x 245 x 39 mm, Volume: 1180ml. Ideal for complete institutional and corporate meal packaging.',
    localImageFile: '5-compartment-meal-tray-with-lid-b2b.png',
  },
  {
    name: '5 Compartment Meal Tray with Lid B2B (Lid)',
    category: 'Meal Trays',
    price: 199,
    size: '300 × 245 × 14.6mm',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: 'Matching bagasse lid for 5-compartment B2B meal tray. Dimensions: 300 x 245 x 14.6 mm. Ensures zero-leak meal delivery.',
    localImageFile: '5-compartment-meal-tray-with-lid-b2b-lid.png',
  },
  {
    name: '8 Compartment Meal Tray with Lid B2B',
    category: 'Meal Trays',
    price: 629,
    size: '995ml',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '8-compartment B2B gourmet meal tray made from bagasse. Dimensions: 287 x 231 x 33.5 mm, Volume: 995ml. Multi-portion catering excellence.',
    localImageFile: '8-compartment-meal-tray-with-lid-b2b.png',
  },
  {
    name: '8 Compartment Meal Tray with Lid B2B (Lid)',
    category: 'Meal Trays',
    price: 199,
    size: '287 × 231 × 14.7mm',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: 'Matching bagasse lid for 8-compartment B2B meal tray. Dimensions: 287 x 231 x 14.7 mm.',
    localImageFile: '8-compartment-meal-tray-with-lid-b2b-lid.png',
  },
  {
    name: '4 CP Meal Tray',
    category: 'Meal Trays',
    price: 479,
    size: '247 × 304 × 32mm',
    material: '100% Sugarcane Bagasse',
    color: 'Natural Brown',
    description: '4-compartment meal tray made from natural unbleached bagasse. Dimensions: 247 x 304 x 32 mm. Sturdy and oil-resistant.',
    localImageFile: '4-cp-meal-tray.png',
  },
  {
    name: '5 Compartment Meal Tray',
    category: 'Meal Trays',
    price: 499,
    size: '247 × 304 × 32mm',
    material: '100% Sugarcane Bagasse',
    color: 'Natural Brown',
    description: '5-compartment meal tray made from natural unbleached bagasse. Dimensions: 247 x 304 x 32 mm. Designed for authentic canteen and dining service.',
    localImageFile: '5-compartment-meal-tray.png',
  },
  {
    name: '1D Tray',
    category: 'Meal Trays',
    price: 229,
    size: '250ml',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '1D compact serving tray made from bagasse. Dimensions: 136 x 136 x 22.5 mm, Volume: 250ml. Perfect for snacks, sides, and appetizers.',
    localImageFile: '1d-tray.png',
  },
  {
    name: '2D Tray',
    category: 'Meal Trays',
    price: 279,
    size: '410ml',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '2D rectangular tray made from bagasse. Dimensions: 210 x 135 x 22.4 mm, Volume: 410ml. Versatile for bakery items, combos, and fries.',
    localImageFile: '2d-tray.png',
  },
  {
    name: '4D Tray',
    category: 'Meal Trays',
    price: 349,
    size: '850ml',
    material: '100% Sugarcane Bagasse',
    color: 'Natural White',
    description: '4D spacious serving tray made from bagasse. Dimensions: 245 x 180 x 30 mm, Volume: 850ml. Durable for hearty platters and takeaways.',
    localImageFile: '4d-tray.png',
  },
];

import { connectDB } from '../config/database';

async function seed() {
  console.log('[Seed] Connecting to MongoDB Atlas...');
  await connectDB();
  console.log('[Seed] Connected successfully.');

  // 1. Remove test/demo products
  const testProductNames = [
    'Cloudinary Test Bagasse Bowl 500ml',
    'ProdReady Eco Plate 9576',
    'Eco Hardening Plate 6700',
    'Hardening Bagasse Plate 10in',
    'Eco Dinner Plate 10 Inch (Updated Edition)',
    'Eco Dinner Plate',
    'Eco Bowl 500ml',
  ];

  console.log('[Seed] Removing temporary test products from database...');
  const deleteResult = await Product.deleteMany({
    $or: [
      { name: { $in: testProductNames } },
      // Any remaining temporary test names containing "Test" or "Hardening" or "ProdReady"
      { name: { $regex: /test|hardening|prodready/i } }
    ]
  });
  console.log(`[Seed] Removed ${deleteResult.deletedCount} test products.`);

  // 2. Upload images to Cloudinary and insert products
  const projectRoot = path.resolve(__dirname, '../../../');
  const publicProductsDir = path.resolve(projectRoot, 'public/products');

  console.log(`[Seed] Processing ${productsToSeed.length} catalogue products...`);

  const results: any[] = [];

  for (const item of productsToSeed) {
    const localImgPath = path.join(publicProductsDir, item.localImageFile);
    let imageUrl = `/products/${item.localImageFile}`;
    let imagePublicId = '';

    // Check if existing product already exists in MongoDB
    const existing = await Product.findOne({ name: item.name });

    if (existing && existing.image && existing.image.startsWith('http')) {
      // Preserve already uploaded Cloudinary image
      imageUrl = existing.image;
      imagePublicId = existing.imagePublicId || '';
      console.log(`[Cloudinary] Preserving existing image for ${item.name}: ${imageUrl}`);
    } else {
      try {
        console.log(`[Cloudinary] Uploading ${item.name} (${item.localImageFile})...`);
        const uploadRes = await cloudinary.uploader.upload(localImgPath, {
          folder: 'earthform/products',
          public_id: path.parse(item.localImageFile).name,
          overwrite: true,
          resource_type: 'image',
        });
        imageUrl = uploadRes.secure_url;
        imagePublicId = uploadRes.public_id;
        console.log(`[Cloudinary] Uploaded successfully: ${imageUrl}`);
      } catch (err: any) {
        console.warn(`[Cloudinary] Upload failed for ${item.name}, using local static image:`, err.message);
      }
    }

    // Upsert product in MongoDB by exact name
    let savedDoc: any;
    if (existing) {
      existing.category = item.category;
      existing.price = item.price;
      existing.size = item.size;
      existing.material = item.material;
      existing.color = item.color;
      existing.description = item.description;
      existing.image = imageUrl;
      existing.imagePublicId = imagePublicId;
      existing.isActive = true;
      existing.stockQuantity = 100;
      savedDoc = await existing.save();
      console.log(`[MongoDB] Updated existing product: ${item.name} (${savedDoc._id})`);
    } else {
      savedDoc = await Product.create({
        name: item.name,
        category: item.category,
        price: item.price,
        size: item.size,
        material: item.material,
        color: item.color,
        description: item.description,
        image: imageUrl,
        imagePublicId,
        isActive: true,
        stockQuantity: 100,
      });
      console.log(`[MongoDB] Created new product: ${item.name} (${savedDoc._id})`);
    }

    results.push({
      id: savedDoc._id,
      name: savedDoc.name,
      category: savedDoc.category,
      price: savedDoc.price,
      image: savedDoc.image,
      publicId: savedDoc.imagePublicId,
    });
  }

  // 3. Final Verification
  const totalCount = await Product.countDocuments();
  const activeCount = await Product.countDocuments({ isActive: true });
  console.log(`\n==========================================`);
  console.log(`[Seed Complete] Total Products: ${totalCount}, Active: ${activeCount}`);
  
  const categoryCounts = await Product.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  console.log('[Seed Complete] Breakdown by Category:');
  for (const c of categoryCounts) {
    console.log(`  - ${c._id}: ${c.count} products`);
  }
  console.log(`==========================================\n`);

  await mongoose.disconnect();
  console.log('[Seed] Disconnected from MongoDB.');
}

seed().catch((err) => {
  console.error('[Seed Error]:', err);
  process.exit(1);
});
