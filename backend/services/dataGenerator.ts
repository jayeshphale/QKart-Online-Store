/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";
import { Product } from "../types";

// Define main categories and their subcategories to reach ~500 categories/subcategories
const categoryMap: Record<string, string[]> = {
  "Mobiles & Accessories": [
    "Smartphones", "Basic Mobiles", "Rugged Phones", "Cases & Covers", "Screen Protectors", 
    "Chargers & Adapters", "Cables", "Power Banks", "Headsets", "Smartwatches", 
    "Smart Bands", "Holders & Stands", "Selfie Sticks", "Camera Lens Protectors", "SIM Card Cutters", 
    "Replacement Batteries", "Stylus", "OTG Adapters", "Signal Boosters", "Dust Plugs", 
    "Phone Charms", "Wireless Car Mounts", "Tripods", "Gimbals", "Power Cases", 
    "Armbands", "Waterproof Cases", "Gaming Triggers", "VR Headsets", "Cleaners", 
    "Repair Kits", "Smart Trackers", "FM Transmitters", "Bluetooth Receivers", "Replacement Screens"
  ],
  "Computers & Accessories": [
    "Laptops", "Desktops", "Monitors", "Printers", "Scanners", 
    "Keyboards", "Mice", "Webcams", "Graphics Tablets", "External Hard Drives", 
    "SSD", "USB Flash Drives", "SD Cards", "Routers", "Modems", 
    "Network Switches", "Wi-Fi Dongles", "Motherboards", "Processors", "Graphics Cards", 
    "RAM Modules", "Power Supplies", "PC Cabinets", "CPU Coolers", "Thermal Paste", 
    "Sound Cards", "Laptop Bags", "Mouse Pads", "Keyboard Covers", "Monitor Arms", 
    "USB Hubs", "Docking Stations", "HDMI Cables", "Ethernet Cables", "UPS Systems"
  ],
  "TV & Home Entertainment": [
    "LED TVs", "OLED TVs", "QLED TVs", "Smart TVs", "4K TVs", 
    "Home Theater Systems", "Soundbars", "Projectors", "Projector Screens", "Streaming Dongles", 
    "Set-Top Boxes", "DVD Players", "TV Mounts", "Remote Controls", "Universal Remotes", 
    "HDMI Switchers", "AV Receivers", "Satellite Dishes", "Antennas", "3D Glasses", 
    "TV Stand Cabinets", "Dust Covers", "Coaxial Cables", "Optical Audio Cables", "FM Radios", 
    "Boomboxes", "Karaoke Mic", "Cassette Players", "Record Players", "Vinyl Accessories", 
    "Smart Displays", "TV Backlights", "Screen Guards", "VGA Cables", "DisplayPort Cables"
  ],
  "Home & Kitchen Appliances": [
    "Water Purifiers", "Vacuum Cleaners", "Air Purifiers", "Microwaves", "Ovens", 
    "Toasters", "Electric Kettles", "Blenders & Grinders", "Food Processors", "Juicers", 
    "Induction Cooktops", "Gas Stoves", "Chimneys", "Refrigerators", "Washing Machines", 
    "Air Conditioners", "Ceiling Fans", "Table Fans", "Pedestal Fans", "Exhaust Fans", 
    "Geysers & Water Heaters", "Room Heaters", "Air Coolers", "Sewing Machines", "Dry Irons", 
    "Steam Irons", "Garment Steamers", "Dishwashers", "Rice Cookers", "Sandwich Makers", 
    "Air Fryers", "Bread Makers", "Coffee Makers", "Egg Boilers", "Popcorn Makers"
  ],
  "Men's Clothing & Shoes": [
    "T-Shirts", "Casual Shirts", "Formal Shirts", "Polo Shirts", "Jeans", 
    "Chinos & Trousers", "Casual Trousers", "Formal Trousers", "Shorts", "Cargoes", 
    "Track Pants", "Activewear Shirts", "Hoodies & Sweatshirts", "Jackets", "Sweaters", 
    "Suits & Blazers", "Kurtas", "Sherwanis", "Dhotis", "Sneakers", 
    "Running Shoes", "Walking Shoes", "Formal Shoes", "Loafers", "Boots", 
    "Sandals & Floaters", "Slippers & Flip-Flops", "Socks", "Belts", "Wallets", 
    "Caps & Hats", "Sunglasses", "Ties & Pocket Squares", "Mufflers & Scarves", "Gloves"
  ],
  "Women's Clothing & Shoes": [
    "Sarees", "Kurtas & Kurtis", "Salwar Suits", "Lehengas", "Ethnic Skirts", 
    "T-Shirts", "Tops & Tunics", "Shirts", "Dresses", "Jumpsuits", 
    "Jeans", "Trousers & Pants", "Leggings & Jeggings", "Shorts & Skirts", "Activewear Tops", 
    "Activewear Leggings", "Jackets & Coats", "Sweaters & Cardigans", "Heels", "Flats", 
    "Sneakers", "Running Shoes", "Boots", "Sandals", "Slippers & Flip-Flops", 
    "Handbags", "Sling Bags", "Tote Bags", "Clutches", "Backpacks", 
    "Jewelry Sets", "Earrings", "Necklaces", "Rings", "Bracelets"
  ],
  "Beauty & Grooming": [
    "Face Wash", "Moisturizers", "Sunscreens", "Face Serums", "Toners", 
    "Face Masks", "Lip Balms", "Shampoos", "Hair Conditioners", "Hair Oils", 
    "Hair Serums", "Hair Colors", "Body Wash", "Body Lotions", "Hand Creams", 
    "Foot Creams", "Deodorants", "Perfumes", "Body Mists", "Lipsticks", 
    "Eyeliners", "Mascaras", "Foundations", "Concealers", "Blushes", 
    "Nail Polishes", "Makeup Brushes", "Hair Dryers", "Hair Straighteners", "Hair Curlers", 
    "Epilators", "Men's Trimmers", "Shavers", "Beard Oils", "Beard Washes"
  ],
  "Health & Personal Care": [
    "Multivitamins", "Calcium Supplements", "Protein Powders", "Fish Oil Capsules", "Herbal Supplements", 
    "Digital Thermometers", "BP Monitors", "Glucometers", "Pulse Oximeters", "Weighing Scales", 
    "Pain Relief Sprays", "Bandages", "Antiseptics", "Face Masks (N95)", "Hand Sanitizers", 
    "Toothpastes", "Electric Toothbrushes", "Manual Toothbrushes", "Mouthwashes", "Dental Floss", 
    "Adult Diapers", "Sanitary Pads", "Tampons", "Menstrual Cups", "Intimate Washes", 
    "Contact Lens Solutions", "Reading Glasses", "Hearing Aid Batteries", "Massagers", "Hot Water Bags", 
    "Inhalers", "Nebulizers", "Contraceptives", "Pregnancy Kits", "ORS Drinks"
  ],
  "Sports & Fitness": [
    "Yoga Mats", "Dumbbells", "Kettlebells", "Resistance Bands", "Treadmills", 
    "Exercise Bikes", "Ab Rollers", "Push Up Bars", "Gym Gloves", "Cricket Bats", 
    "Cricket Balls", "Badminton Rackets", "Shuttlecocks", "Football", "Basketball", 
    "Tennis Rackets", "Table Tennis Bats", "Skateboards", "Roller Skates", "Bicycles", 
    "Cycling Helmets", "Swimming Goggles", "Swim Caps", "Active Hydration Bottles", "Gym Bags", 
    "Sports Sunglasses", "Running Armbands", "Knee Supports", "Wrist Bands", "Ankle Braces", 
    "Dartboards", "Chess Boards", "Carrom Boards", "Boxing Gloves", "Punching Bags"
  ],
  "Toys & Baby Products": [
    "Action Figures", "Remote Control Cars", "Dolls & Dollhouses", "Board Games", "Puzzles", 
    "Building Blocks", "Soft Toys", "Educational Toys", "Art & Craft Kits", "Musical Toys", 
    "Baby Rattles", "Play Gyms", "Baby Wipes", "Baby Diapers", "Baby Lotions", 
    "Baby Shampoos", "Baby Creams", "Baby Strollers", "Baby Prams", "Baby Car Seats", 
    "High Chairs", "Baby Carriers", "Feeding Bottles", "Pacifiers", "Teethers", 
    "Breast Pumps", "Baby Beds", "Mosquito Nets", "Baby Bath Tubs", "Kids Tricycles", 
    "Kick Scooters", "Play Tents", "Slime Kits", "Clay Toys", "Magic Kits"
  ],
  "Books & Stationery": [
    "Fiction Novels", "Non-Fiction Books", "Biographies", "Self-Help Books", "Business & Finance Books", 
    "Sci-Fi & Fantasy Novels", "Mystery Thrillers", "Children's Story Books", "School Textbooks", "Exam Prep Guides", 
    "Notebooks & Registers", "Diaries & Planners", "Ballpoint Pens", "Gel Pens", "Fountain Pens", 
    "Mechanical Pencils", "Highlighters", "Markers", "Sticky Notes", "Geometry Boxes", 
    "Calculators", "Crayons", "Watercolors", "Sketch Pens", "Canvases", 
    "Desk Organizers", "Files & Folders", "Paper Shredders", "Whiteboards", "Notice Boards", 
    "Staplers", "Paper Clips", "Scissors", "Adhesive Tapes", "Glue Sticks"
  ],
  "Grocery & Gourmet Foods": [
    "Basmati Rice", "Whole Wheat Atta", "Refined Sunflower Oil", "Mustard Oil", "Ghee", 
    "Toor Dal", "Moong Dal", "Sugar", "Iodized Salt", "Turmeric Powder", 
    "Red Chili Powder", "Coriander Powder", "Garam Masala", "Green Tea Bags", "Instant Coffee", 
    "Filter Coffee Powder", "Almonds", "Cashew Nuts", "Walnuts", "Raisins", 
    "Oats", "Corn Flakes", "Muesli", "Whole Wheat Bread", "Digestive Biscuits", 
    "Chocolate Chip Cookies", "Potato Chips", "Roasted Makhana", "Tomato Ketchup", "Mayonnaise", 
    "Soy Sauce", "Honey", "Maple Syrup", "Fruit Jams", "Dark Chocolates"
  ],
  "Automotive Accessories": [
    "Car Perfumes", "Car Mobile Holders", "Car Charger Adapters", "Car Seat Covers", "Car Steering Covers", 
    "Car Body Covers", "Car Floor Mats", "Car Microfiber Cloths", "Car Shampoos", "Car Waxes & Polishes", 
    "Car Scratch Removers", "Helmet Cleaners", "Bike Body Covers", "Bike Seat Covers", "Helmets", 
    "Riding Jackets", "Riding Gloves", "Tire Inflators", "Jumper Cables", "Car OBD Scanners", 
    "Dash Cameras", "GPS Trackers", "Car Organizers", "Neck Pillows", "Tire Pressure Gauges", 
    "Car Jack Stands", "Wiper Blades", "LED Headlights", "Chain Lubricants", "Engine Oils", 
    "Brake Fluids", "Coolants", "Car Windshield Washers", "Car Air Purifiers", "Key Covers"
  ],
  "Home Decor & Furniture": [
    "Bedsheets", "Pillow Covers", "Comforters", "Curtains", "Door Mats", 
    "Area Rugs", "Cushion Covers", "Wall Clocks", "Wall Paintings", "Photo Frames", 
    "Vases", "Artificial Flowers", "Scented Candles", "Essential Oil Diffusers", "LED Strip Lights", 
    "Study Tables", "Office Chairs", "Bean Bags", "Coffee Tables", "Sofas", 
    "TV Units", "Bookshelves", "Shoe Racks", "Wardrobes", "Bedside Tables", 
    "Dining Tables", "Bar Stools", "Plastic Chairs", "Folding Tables", "Wall Shelves", 
    "Key Holders", "Mirrors", "Coat Hangers", "Laundry Baskets", "Storage Organizers"
  ],
  "Industrial & Scientific": [
    "Digital Multimeters", "Soldering Irons", "Glue Guns", "Drill Machines", "Screwdriver Sets", 
    "Hand Tool Kits", "Measuring Tapes", "Safety Helmets", "Safety Goggles", "N95 Respirators", 
    "Work Gloves", "First Aid Kits", "Magnifying Glasses", "Vernier Calipers", "Laser Distance Meters", 
    "3D Printers", "3D Printer Filaments", "Microscopes", "PH Meters", "Weighing Scales (Precision)", 
    "Bubble Wraps", "Packing Tapes", "Cardboard Boxes", "Thermal Label Printers", "Barcode Scanners", 
    "Thermal Paper Rolls", "ESD Mats", "Smoke Detectors", "Fire Extinguishers", "Ladders", 
    "Solar Panels", "Solar Charge Controllers", "Inverters", "Batteries (Deep Cycle)", "Water Pumps"
  ]
};

const brandsMap: Record<string, string[]> = {
  "Mobiles & Accessories": ["Apple", "Samsung", "OnePlus", "Xiaomi", "Realme", "boAt", "Anker", "Spigen", "Portronics", "Ambrane", "Noise", "Amazfit"],
  "Computers & Accessories": ["HP", "Dell", "Lenovo", "ASUS", "Acer", "Apple", "Logitech", "SanDisk", "Western Digital", "Seagate", "TP-Link", "Netgear", "Corsair", "Razer", "Gigabyte", "Intel", "AMD", "NVIDIA"],
  "TV & Home Entertainment": ["Sony", "Samsung", "LG", "TCL", "Xiaomi", "OnePlus", "JBL", "boAt", "Anker", "Sennheiser", "Zebronics", "Epson", "BenQ", "Denon", "Philips"],
  "Home & Kitchen Appliances": ["Bajaj", "Prestige", "Pigeon", "Philips", "Dyson", "Milton", "Morphy Richards", "Eureka Forbes", "Havells", "LG", "Samsung", "Whirpool", "Panasonic", "Kent", "Blue Star", "Voltas"],
  "Men's Clothing & Shoes": ["Allen Solly", "Peter England", "Levi's", "Puma", "Nike", "Adidas", "U.S. Polo Assn.", "Jack & Jones", "Tommy Hilfiger", "Woodland", "Bata", "Red Tape", "Van Heusen", "Wrangler"],
  "Women's Clothing & Shoes": ["BIBA", "W for Woman", "Aurelia", "Zara", "H&M", "Only", "Vero Moda", "Levi's", "Nike", "Puma", "Bata", "Metro", "Caprese", "Lavie", "Lenskart", "Fabindia"],
  "Beauty & Grooming": ["L'Oreal", "Maybelline", "Nivea", "Mamaearth", "The Body Shop", "Biotique", "Neutrogena", "Lakme", "Forest Essentials", "Philips", "Braun", "Syska", "Beardo", "Ustraa", "Wow Skin Science"],
  "Health & Personal Care": ["Revital", "Himalaya", "Optimum Nutrition", "MuscleBlaze", "Dettol", "Colgate", "Oral-B", "Sensodyne", "Whisper", "Stayfree", "Pampers", "Huggies", "Omron", "Dr Trust", "Pharmeasy"],
  "Sports & Fitness": ["Decathlon", "Nivia", "Spalding", "Yonex", "Cosco", "Puma", "Nike", "Adidas", "Reebok", "Speedo", "Camelbak", "Wilson", "Butterfly", "SG", "SS", "Kettlebell Prime"],
  "Toys & Baby Products": ["LEGO", "Hot Wheels", "Barbie", "Fisher-Price", "Hasbro", "Funskool", "Pampers", "Huggies", "MamyPoko", "Chicco", "LuvLap", "Philips Avent", "Sebamed", "Mee Mee", "BabyGo"],
  "Books & Stationery": ["Penguin Random House", "HarperCollins", "Rupa Publications", "Scholastic", "Classmate", "Parker", "Pilot", "Uniball", "Cello", "Casio", "Faber-Castell", "Camel", "Luxor", "Kangaro"],
  "Grocery & Gourmet Foods": ["Tata", "Aashirvaad", "Fortune", "Dhara", "Amul", "Organic India", "Taj Mahal", "Nescafe", "Bru", "Lipton", "Cadbury", "Lay's", "Kurkure", "Haldiram's", "Kissan", "Hershey's"],
  "Automotive Accessories": ["Godrej AER", "Anker", "Spigen", "JBL", "Pioneer", "Steelbird", "Vega", "Studds", "Royal Enfield", "Motul", "Castrol", "Mobil 1", "Michelin", "Bosch", "3M", "Windek"],
  "Home Decor & Furniture": ["Urban Ladder", "Pepperfry", "Wakefit", "Sleepwell", "Wipro", "Philips", "Solimo", "Deco Window", "Kurl-on", "Nilkamal", "Supreme", "Green Soul", "Featherlite", "Miniso", "IKEA"],
  "Industrial & Scientific": ["Bosch", "Taparia", "Stanley", "Fluke", "3M", "Solderron", "Dremel", "Signet", "Yuri", "Knipex", "Proskit", "Honeywell", "Ansell", "Safeguard", "Luminous", "Microtek"]
};

// Realistic name generator representing Amazon India catalog
function generateProductName(mainCat: string, subCat: string, brand: string, numId: number): string {
  switch (mainCat) {
    case "Mobiles & Accessories":
      if (subCat === "Smartphones") {
        const models = ["Galaxy S24", "iPhone 15", "Nord CE4", "12R Pro", "Redmi Note 13", "Edge 50 Ultra", "Pixel 8 Pro", "F25 Pro"];
        const model = models[numId % models.length];
        const colors = ["Titanium Black", "Emerald Green", "Celadon Marble", "Deep Purple", "Glacier Blue", "Sunset Orange"];
        const color = colors[numId % colors.length];
        const storages = ["128GB", "256GB", "512GB"];
        const storage = storages[numId % storages.length];
        return `${brand} ${model} (${storage}, ${color})`;
      } else if (subCat === "Smartwatches" || subCat === "Smart Bands") {
        return `${brand} Watch Pro ${numId + 10} Active with Full Touch AMOLED Screen`;
      } else if (subCat === "Power Banks") {
        const capacities = ["10000mAh", "20000mAh", "30000mAh"];
        const capacity = capacities[numId % capacities.length];
        return `${brand} SuperFast ${capacity} Power Bank with 22.5W Power Delivery`;
      } else {
        return `${brand} Premium ${subCat} for Smartphones (Pack of ${(numId % 3) + 1})`;
      }

    case "Computers & Accessories":
      if (subCat === "Laptops") {
        const models = ["Spectre x360", "Inspiron 15", "ThinkPad X1 Carbon", "ZenBook Duo", "Aspire 5", "MacBook Air M3", "Legion Pro 5"];
        const model = models[numId % models.length];
        const processors = ["Intel i7 13th Gen", "AMD Ryzen 7", "Apple M3 Chip", "Intel i5 12th Gen"];
        const proc = processors[numId % processors.length];
        const rams = ["8GB RAM", "16GB RAM", "32GB RAM"];
        const ram = rams[numId % rams.length];
        const ssds = ["512GB NVMe SSD", "1TB SSD"];
        const ssd = ssds[numId % ssds.length];
        return `${brand} ${model} Laptop (${proc}, ${ram}, ${ssd})`;
      } else if (subCat === "Keyboards" || subCat === "Mice") {
        return `${brand} Wireless Ergonomic Multi-Device ${subCat}`;
      } else if (subCat === "SSD" || subCat === "External Hard Drives") {
        const capacities = ["500GB", "1TB", "2TB", "4TB"];
        const capacity = capacities[numId % capacities.length];
        return `${brand} UltraSpeed Portable ${capacity} ${subCat}`;
      } else {
        return `${brand} High Performance ${subCat} (Model QK-${numId})`;
      }

    case "TV & Home Entertainment":
      if (subCat.includes("TVs")) {
        const sizes = ["43-inch", "50-inch", "55-inch", "65-inch", "75-inch"];
        const size = sizes[numId % sizes.length];
        return `${brand} ${size} Series 4K Ultra HD ${subCat} (Google TV)`;
      } else if (subCat === "Soundbars" || subCat === "Home Theater Systems") {
        return `${brand} Dolby Atmos 5.1 Channel Surround Sound ${subCat}`;
      } else {
        return `${brand} High-Fidelity ${subCat} (Model T-${numId})`;
      }

    case "Men's Clothing & Shoes":
    case "Women's Clothing & Shoes":
      const sizes = ["S", "M", "L", "XL", "XXL", "UK 7", "UK 8", "UK 9", "UK 10"];
      const sizeStr = subCat.includes("Shoes") || subCat.includes("Sneakers") || subCat.includes("Slippers") || subCat.includes("Boots") || subCat.includes("Sandals")
        ? `Size ${sizes[5 + (numId % 4)]}`
        : `Size ${sizes[numId % 5]}`;
      const patterns = ["Regular Fit", "Slim Fit", "Classic Printed", "Solid Color", "Checked Cotton", "Striped Linen", "Designer Wear"];
      const pattern = patterns[numId % patterns.length];
      const colors = ["Navy Blue", "Olive Green", "Charcoal Gray", "Classic White", "Mustard Yellow", "Crimson Red", "Jet Black", "Beige"];
      const color = colors[numId % colors.length];
      return `${brand} ${pattern} ${subCat} for Daily Wear (${color}, ${sizeStr})`;

    case "Beauty & Grooming":
      const sizesBG = ["50ml", "100ml", "200ml", "150g", "500ml"];
      const sizeBG = sizesBG[numId % sizesBG.length];
      const typesBG = ["Hydrating & Repairing", "Anti-Acne & Clarifying", "Deep Cleansing", "Nourishing", "Organic Natural", "Instant Glow"];
      const typeBG = typesBG[numId % typesBG.length];
      return `${brand} ${typeBG} ${subCat} (${sizeBG})`;

    case "Books & Stationery":
      if (subCat.includes("Novel") || subCat.includes("Book")) {
        const bookAdjectives = ["The Secret of", "Journey to", "Chronicles of", "The Art of", "Ultimate Guide to", "Shadows of", "Echoes from", "The Last"];
        const bookNouns = ["Silence", "Success", "Antigravity", "The Himalayas", "Tomorrow", "Mindfulness", "Lost City", "Financial Freedom"];
        const title = `"${bookAdjectives[numId % bookAdjectives.length]} ${bookNouns[numId % bookNouns.length]}"`;
        const writers = ["Aravind Adiga", "Amish Tripathi", "Chetan Bhagat", "Ruskin Bond", "Arundhati Roy", "James Clear", "Simon Sinek"];
        const writer = writers[numId % writers.length];
        return `${title} by ${writer} (${subCat.includes("Novel") ? "Paperback" : "Hardcover"})`;
      } else {
        return `${brand} Premium ${subCat} (Pack of ${(numId % 5) + 5})`;
      }

    case "Grocery & Gourmet Foods":
      const sizesG = ["1 kg", "5 kg", "500g", "250g", "1 Liter"];
      const sizeG = sizesG[numId % sizesG.length];
      return `${brand} Premium Organic ${subCat} (${sizeG})`;

    case "Home Decor & Furniture":
      const mats = ["Sheesham Wood", "Premium Memory Foam", "Cotton Blend", "Ergonomic Mesh Nylon", "Tempered Glass", "Powder-Coated Metal"];
      const mat = mats[numId % mats.length];
      const colorsH = ["Teak Brown", "Slate Gray", "Warm Beige", "Classic White", "Emerald Green", "Jet Black"];
      const colorH = colorsH[numId % colorsH.length];
      return `${brand} Modern ${mat} ${subCat} (${colorH})`;

    default:
      const adjectives = ["Premium", "Ultra", "Classic", "Deluxe", "Ergonomic", "Smart", "Eco-Friendly", "Professional", "Compact", "High-Performance"];
      const adj = adjectives[numId % adjectives.length];
      return `${brand} ${adj} ${subCat} (Model QK-${numId})`;
  }
}

// Generate realistic technical/material specifications
function generateSpecifications(mainCat: string, subCat: string, brand: string, numId: number): Record<string, string> {
  switch (mainCat) {
    case "Mobiles & Accessories":
      return {
        "Brand": brand,
        "Compatible Devices": "All iOS & Android Devices",
        "Material": "Premium Grade Polycarbonate, Copper Wiring",
        "Warranty": "1 Year Manufacturer Warranty",
        "Box Contents": `${subCat}, Quick Start Guide, Warranty Booklet`
      };
    case "Computers & Accessories":
      return {
        "Brand": brand,
        "Operating System": "Windows 11 Home Pre-Installed",
        "Hardware Interface": "USB 3.2 Gen 1, HDMI, Type-C, Audio Jack",
        "Processor Speed": "3.2 GHz Quad-Core",
        "Warranty": "2 Year Limited Brand Warranty"
      };
    case "TV & Home Entertainment":
      return {
        "Brand": brand,
        "Audio Output Mode": "Surround Sound Dolby Atmos 5.1",
        "Resolution": "4K Ultra HD (3840 x 2160)",
        "Refresh Rate": "60 Hz Native",
        "Connectivity": "Wi-Fi, Bluetooth, HDMI ARC, Optical Audio, USB"
      };
    case "Men's Clothing & Shoes":
    case "Women's Clothing & Shoes":
      return {
        "Brand": brand,
        "Material": "100% Breathable Fine Combed Cotton",
        "Fit Type": "Regular Comfort Fit",
        "Style": "Casual Modern",
        "Care Instructions": "Gentle Machine Wash, Iron on Medium Heat"
      };
    case "Beauty & Grooming":
      return {
        "Brand": brand,
        "Item Volume": "150 Milliliters",
        "Skin Type": "Suitable for Sensitive & Normal Skin",
        "Active Ingredients": "Natural Herbal Extracts, Vitamin E, Glycerin",
        "Safety Guidelines": "Dermatologically Tested, Paraben Free, Sulfate Free"
      };
    case "Books & Stationery":
      return {
        "Publisher": brand,
        "Language": "English",
        "Binding Type": "Paperback / Soft Cover",
        "Page Count": `${(numId % 10) * 40 + 120} Pages`,
        "Print Country": "India"
      };
    case "Grocery & Gourmet Foods":
      return {
        "Brand": brand,
        "Dietary Preference": "100% Vegetarian, Organic Certified",
        "FSSAI License": `1001902200${numId + 1000}45`,
        "Shelf Life": "12 Months from Packaging Date",
        "Allergen Information": "Gluten-Free, Packaged in safe environment"
      };
    default:
      return {
        "Brand": brand,
        "Model Number": `QK-${numId + 1000}`,
        "Warranty Period": "1 Year Brand Warranty",
        "Country of Origin": "India"
      };
  }
}

// Main generation function
export function generateMockDatabase(dbPath: string) {
  console.log("Generating realistic database containing ~5,000 Products resembling Amazon India...");

  const mainCategories = Object.keys(categoryMap);

  // 1. Generate Categories list (approx. 500)
  const categories: any[] = [];
  let categoryIdCounter = 1;
  const flatCategoriesList: { id: string; name: string; mainCategory: string; fullName: string }[] = [];

  mainCategories.forEach((mainCat) => {
    const subCategories = categoryMap[mainCat];
    subCategories.forEach((subCat) => {
      const slug = subCat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const fullName = `${mainCat} > ${subCat}`;
      const catObj = {
        id: `cat-${categoryIdCounter++}`,
        name: subCat,
        mainCategory: mainCat,
        fullName: fullName,
        slug: slug,
        description: `Explore the finest selection of ${subCat} in ${mainCat} on QKart India. Featuring leading brands and great deals.`
      };
      categories.push(catObj);
      flatCategoriesList.push(catObj);
    });
  });

  // Total categories is exactly flatCategoriesList.length (which is 15 * 35 = 525 subcategories)
  console.log(`Generated ${categories.length} Categories/Subcategories successfully.`);

  // 2. Generate Products (approx. 5,000)
  // We have 525 categories. To get ~5,000 products, let's generate exactly 10 products per category.
  // 525 categories * 10 products = 5,250 products. This matches perfectly!
  const products: Product[] = [];
  let productIdCounter = 1;

  flatCategoriesList.forEach((category) => {
    const mainCat = category.mainCategory;
    const subCat = category.name;
    const brands = brandsMap[mainCat] || ["AmazonBasics"];

    for (let i = 0; i < 10; i++) {
      const pId = `prod-${productIdCounter}`;
      const brand = brands[(productIdCounter + i) % brands.length];
      const name = generateProductName(mainCat, subCat, brand, productIdCounter);
      
      // Determine a realistic price range in USD
      let minPrice = 5;
      let maxPrice = 150;
      if (mainCat === "Mobiles & Accessories") { maxPrice = 1200; minPrice = 8; }
      else if (mainCat === "Computers & Accessories") { maxPrice = 2500; minPrice = 15; }
      else if (mainCat === "TV & Home Entertainment") { maxPrice = 3000; minPrice = 80; }
      else if (mainCat === "Home Decor & Furniture") { maxPrice = 1000; minPrice = 15; }
      else if (mainCat === "Home & Kitchen Appliances") { maxPrice = 800; minPrice = 12; }
      else if (mainCat === "Industrial & Scientific") { maxPrice = 500; minPrice = 10; }
      else if (mainCat === "Sports & Fitness") { maxPrice = 400; minPrice = 8; }

      const price = parseFloat(faker.number.float({ min: minPrice, max: maxPrice, fractionDigits: 2 }).toFixed(2));
      const discount = faker.number.int({ min: 5, max: 45 });
      const originalPrice = parseFloat((price / (1 - discount / 100)).toFixed(2));
      const rating = parseFloat(faker.number.float({ min: 3.5, max: 4.9, fractionDigits: 1 }).toFixed(1));
      const reviewsCount = faker.number.int({ min: 12, max: 8500 });
      const stock = faker.number.int({ min: 5, max: 150 });
      
      // Seed images using reproducible Picsum photos
      const imageId = productIdCounter % 1000; // Keep random range under 1000 for good quality images
      const mainImage = `https://picsum.photos/seed/qkart_prod_${imageId}/600/600`;
      const additionalImages = [
        mainImage,
        `https://picsum.photos/seed/qkart_prod_${imageId + 1000}/600/600`,
        `https://picsum.photos/seed/qkart_prod_${imageId + 2000}/600/600`
      ];

      const specifications = generateSpecifications(mainCat, subCat, brand, productIdCounter);
      const deliveryDays = faker.number.int({ min: 1, max: 4 });
      const deliveryInfo = deliveryDays === 1 
        ? "FREE Delivery by Tomorrow. Order within 4 hrs." 
        : `FREE Delivery in ${deliveryDays} days. Eligible for Prime.`;

      products.push({
        id: pId,
        name: name,
        category: category.fullName,
        price: price,
        rating: rating,
        image: mainImage,
        description: `Get this premium ${name} designed with the highest standards. Experience ultimate reliability, luxury comfort, and top-tier durability. Brand: ${brand}.`,
        stock: stock,
        brand: brand,
        originalPrice: originalPrice,
        discount: discount,
        reviewsCount: reviewsCount,
        images: additionalImages,
        specifications: specifications,
        deliveryInfo: deliveryInfo
      });

      productIdCounter++;
    }
  });

  console.log(`Generated ${products.length} Products successfully.`);

  // 3. Generate Users (approx. 1,000)
  const users: any[] = [];
  const indianCities = [
    { city: "Mumbai", state: "Maharashtra", pinPrefix: "400" },
    { city: "Delhi", state: "Delhi", pinPrefix: "110" },
    { city: "Bangalore", state: "Karnataka", pinPrefix: "560" },
    { city: "Hyderabad", state: "Telangana", pinPrefix: "500" },
    { city: "Chennai", state: "Tamil Nadu", pinPrefix: "600" },
    { city: "Kolkata", state: "West Bengal", pinPrefix: "700" },
    { city: "Pune", state: "Maharashtra", pinPrefix: "411" },
    { city: "Ahmedabad", state: "Gujarat", pinPrefix: "380" },
    { city: "Jaipur", state: "Rajasthan", pinPrefix: "302" },
    { city: "Lucknow", state: "Uttar Pradesh", pinPrefix: "226" }
  ];

  // Let's ensure there is a standard testing user
  const passwordHash = Buffer.from("password123").toString("base64");
  
  users.push({
    id: "testuser",
    username: "testuser",
    passwordHash: passwordHash,
    walletBalance: 5000.00,
    addresses: [
      "Flat No. 402, Royal Residency, Sector 15, Vashi, Mumbai, Maharashtra - 400703",
      "Plot No. 12, Tech Innovation Park, Whitefield, Bangalore, Karnataka - 560066"
    ]
  });

  for (let i = 2; i <= 1000; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${faker.number.int({ min: 10, max: 99 })}`;
    const walletBalance = parseFloat(faker.number.float({ min: 200, max: 12000, fractionDigits: 2 }).toFixed(2));
    
    // Generate 1 to 3 realistic Indian addresses
    const numAddresses = faker.number.int({ min: 1, max: 3 });
    const userAddresses: string[] = [];
    
    for (let j = 0; j < numAddresses; j++) {
      const cityData = indianCities[faker.number.int({ min: 0, max: indianCities.length - 1 })];
      const flatNo = `Flat ${faker.number.int({ min: 101, max: 1208 })}, Wing ${faker.string.alpha({ length: 1, casing: "upper" })}`;
      const society = faker.helpers.arrayElement(["Shanti Enclave", "Green Meadows", "Skyline Heights", "Ganga Orchard", "Maple Woods", "Orchid Greens", "Prestige Towers"]);
      const area = faker.helpers.arrayElement(["Andheri West", "Indiranagar", "Madhapur", "Salt Lake", "Dwarka Sector 11", "Koregaon Park", "Adyar", "Gomti Nagar"]);
      const pincode = `${cityData.pinPrefix}${faker.number.int({ min: 100, max: 999 })}`;
      userAddresses.push(`${flatNo}, ${society}, ${area}, ${cityData.city}, ${cityData.state} - ${pincode}`);
    }

    users.push({
      id: username,
      username: username,
      passwordHash: passwordHash, // All seeded users have "password123" for quick logging
      walletBalance: walletBalance,
      addresses: userAddresses
    });
  }

  console.log(`Generated ${users.length} Users successfully.`);

  // 4. Generate Reviews (approx. 5,000)
  const reviews: any[] = [];
  const reviewTitlesPositive = ["Extremely pleased", "Highly recommended", "Superb performance", "Worth every rupee", "Fantastic build quality", "Simply amazing", "Outstanding purchase!"];
  const reviewTitlesNeutral = ["Decent product", "Average experience", "Good, but could be better", "OK for the price", "Satisfied enough"];
  const reviewTitlesNegative = ["Terrible experience", "Waste of money", "Defective product", "Not recommended", "Extremely disappointed", "Bad quality"];

  for (let i = 1; i <= 5000; i++) {
    const randProdId = `prod-${faker.number.int({ min: 1, max: products.length })}`;
    const randUserIndex = faker.number.int({ min: 0, max: users.length - 1 });
    const randomUser = users[randUserIndex];
    
    const rating = faker.helpers.arrayElement([5, 5, 4, 4, 4, 3, 2, 1]); // Silted towards positive
    let title = "";
    let comment = "";

    if (rating >= 4) {
      title = faker.helpers.arrayElement(reviewTitlesPositive);
      comment = faker.helpers.arrayElement([
        "Absolutely love this! The design is extremely sleek and works perfectly. Best thing I've bought in a while.",
        "Excellent build quality and superb performance. Completely satisfied with this purchase. Definite value for money.",
        "Fits my requirements beautifully. Arrived early and in pristine packaging. Highly recommended to anyone looking for this!",
        "Stellar product from a reliable brand. The quality exceeded my expectations. Will definitely buy again!"
      ]);
    } else if (rating === 3) {
      title = faker.helpers.arrayElement(reviewTitlesNeutral);
      comment = faker.helpers.arrayElement([
        "It's decent and gets the job done. Not extraordinary but worth the price. Delivery was slightly delayed.",
        "Average quality. It has a few minor issues but works fine overall. Good enough for casual daily usage.",
        "Decent product but the packaging was damaged when it arrived. The product itself was fine though."
      ]);
    } else {
      title = faker.helpers.arrayElement(reviewTitlesNegative);
      comment = faker.helpers.arrayElement([
        "Extremely disappointed. Within a few days of usage, it stopped working properly. Quality is subpar.",
        "Complete waste of money. Do not recommend this to anyone. It's built of cheap materials.",
        "Worst experience ever. The description is misleading. Returning this as soon as possible!"
      ]);
    }

    reviews.push({
      id: `rev-${i}`,
      productId: randProdId,
      userId: randomUser.username,
      username: randomUser.username,
      rating: rating,
      title: title,
      comment: comment,
      date: (() => {
        const d = new Date();
        d.setDate(d.getDate() - faker.number.int({ min: 1, max: 365 }));
        return d.toISOString();
      })(),
      verifiedPurchase: faker.datatype.boolean(0.85),
      helpfulCount: faker.number.int({ min: 0, max: 140 })
    });
  }

  console.log(`Generated ${reviews.length} Reviews successfully.`);

  // 5. Generate Orders (approx. 2,000)
  const orders: any[] = [];
  for (let i = 1; i <= 2000; i++) {
    const randUserIndex = faker.number.int({ min: 0, max: users.length - 1 });
    const randomUser = users[randUserIndex];
    
    // Choose 1 to 3 random products
    const numItems = faker.number.int({ min: 1, max: 3 });
    const cartItems: any[] = [];
    let totalPrice = 0;

    for (let j = 0; j < numItems; j++) {
      const randProdIndex = faker.number.int({ min: 0, max: products.length - 1 });
      const randomProduct = products[randProdIndex];
      const qty = faker.number.int({ min: 1, max: 2 });
      cartItems.push({
        product: randomProduct,
        quantity: qty
      });
      totalPrice += randomProduct.price * qty;
    }

    totalPrice = parseFloat(totalPrice.toFixed(2));
    const randomAddress = randomUser.addresses[faker.number.int({ min: 0, max: randomUser.addresses.length - 1 })];
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - faker.number.int({ min: 1, max: 365 }));
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + faker.number.int({ min: 2, max: 5 }));

    orders.push({
      id: `order-${i}`,
      username: randomUser.username,
      items: cartItems,
      totalPrice: totalPrice,
      address: randomAddress,
      date: orderDate.toISOString(),
      deliveryDate: deliveryDate.toISOString(),
      walletBalanceRemaining: parseFloat(Math.max(0, randomUser.walletBalance - totalPrice).toFixed(2))
    });
  }

  console.log(`Generated ${orders.length} Orders successfully.`);

  // 6. Generate Coupons (approx. 500)
  const coupons: any[] = [];
  const couponAdjectives = ["FESTIVE", "WELCOME", "SAVE", "INSTANT", "MEGA", "INDLA", "DIWALI", "CASHBACK"];
  
  for (let i = 1; i <= 500; i++) {
    const adj = couponAdjectives[i % couponAdjectives.length];
    const percentage = faker.helpers.arrayElement([10, 15, 20, 25, 30, 40, 50]);
    const minVal = faker.helpers.arrayElement([250, 500, 1000, 2000]);
    const maxDiscount = percentage === 50 ? 250 : minVal / 2;
    const code = `${adj}${percentage}_${i + 100}`;
    
    coupons.push({
      id: `coupon-${i}`,
      code: code,
      discountPercentage: percentage,
      maxDiscount: maxDiscount,
      minCartValue: minVal,
      expiryDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() + faker.number.int({ min: 10, max: 180 }));
        return d.toISOString();
      })(),
      isActive: faker.datatype.boolean(0.92),
      description: `Save up to $${maxDiscount} on minimum order of $${minVal} with this coupon.`
    });
  }

  console.log(`Generated ${coupons.length} Coupons successfully.`);

  // 7. Generate Sellers (approx. 300)
  const sellers: any[] = [];
  const sellerList = [
    "Appario Retail Pvt Ltd", "Cloudtail India", "Cocoblu Retail", "Darshita Electronics", 
    "Kay Kay Deals", "SuperCom Net", "RetailNet", "Flavors of India", "Samsara Retail", "Aura Creations"
  ];

  for (let i = 1; i <= 300; i++) {
    const baseName = sellerList[(i - 1) % sellerList.length];
    const randCity = indianCities[faker.number.int({ min: 0, max: indianCities.length - 1 })];
    const name = i <= 10 ? baseName : `${faker.company.name()} Retailers`;
    const rating = parseFloat(faker.number.float({ min: 3.4, max: 4.9, fractionDigits: 1 }).toFixed(1));
    const productsCount = faker.number.int({ min: 25, max: 1400 });

    sellers.push({
      id: `seller-${i}`,
      name: name,
      rating: rating,
      joinedDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() - faker.number.int({ min: 1, max: 1000 }));
        return d.toISOString().split("T")[0];
      })(),
      city: randCity.city,
      gstin: `29AAACD${faker.number.int({ min: 1000, max: 9999 })}F1Z${faker.number.int({ min: 1, max: 9 })}`,
      contactEmail: `support@${name.toLowerCase().replace(/[^a-z0-9]+/g, "")}.com`,
      productsCount: productsCount
    });
  }

  console.log(`Generated ${sellers.length} Sellers successfully.`);

  // 8. Generate Addresses (approx. 500)
  const addresses: any[] = [];
  for (let i = 1; i <= 500; i++) {
    const randUserIndex = faker.number.int({ min: 0, max: users.length - 1 });
    const randomUser = users[randUserIndex];
    const randCity = indianCities[faker.number.int({ min: 0, max: indianCities.length - 1 })];
    
    const street = `Flat ${faker.number.int({ min: 101, max: 1500 })}, Building ${faker.helpers.arrayElement(["B", "C", "H", "A", "G"])}, Green Valley Road`;
    const pincode = `${randCity.pinPrefix}${faker.number.int({ min: 100, max: 999 })}`;

    addresses.push({
      id: `addr-${i}`,
      userId: randomUser.username,
      name: `${faker.person.firstName()} ${faker.person.lastName()}`,
      street: street,
      city: randCity.city,
      state: randCity.state,
      pincode: pincode,
      phone: faker.helpers.arrayElement(["9", "8", "7"]) + faker.string.numeric({ length: 9 }),
      isDefault: i % 3 === 0
    });
  }

  console.log(`Generated ${addresses.length} Addresses successfully.`);

  // 9. Generate Notifications (approx. 300)
  const notifications: any[] = [];
  const notifTemplates = [
    { title: "Order Dispatched", message: "Your order is packed and dispatched from QKart Warehouse. It is on its way!", type: "order" },
    { title: "Price Drop Alert", message: "An item in your wishlist has a direct price drop! Check it out now before stocks end.", type: "promotion" },
    { title: "Wallet Credited", message: "Cashback offer successfully processed. $50 has been credited to your QKart wallet.", type: "wallet" },
    { title: "Account Security Update", message: "Your password was changed successfully. If you did not make this change, contact support.", type: "alert" }
  ];

  for (let i = 1; i <= 300; i++) {
    const randUserIndex = faker.number.int({ min: 0, max: users.length - 1 });
    const randomUser = users[randUserIndex];
    const template = notifTemplates[i % notifTemplates.length];

    notifications.push({
      id: `notif-${i}`,
      userId: randomUser.username,
      title: template.title,
      message: template.message,
      type: template.type,
      read: faker.datatype.boolean(0.55),
      date: (() => {
        const d = new Date();
        d.setDate(d.getDate() - faker.number.int({ min: 1, max: 30 }));
        return d.toISOString();
      })()
    });
  }

  console.log(`Generated ${notifications.length} Notifications successfully.`);

  // 10. Generate Bank Offers (approx. 100)
  const bankOffers: any[] = [];
  const banks = [
    "State Bank of India", "HDFC Bank", "ICICI Bank", "Axis Bank", 
    "Kotak Mahindra Bank", "Federal Bank", "Citi Bank", "HSBC"
  ];

  for (let i = 1; i <= 100; i++) {
    const bank = banks[i % banks.length];
    const cardType = faker.helpers.arrayElement(["credit", "debit", "any"]);
    const discount = faker.helpers.arrayElement([10, 15]);
    const minTxn = faker.helpers.arrayElement([2000, 5000, 10000]);
    const maxDisc = discount === 10 ? 1500 : 2000;
    const bankShort = bank.split(" ").map(w => w[0]).join("").toUpperCase();

    bankOffers.push({
      id: `offer-${i}`,
      bankName: bank,
      cardType: cardType,
      discountPercentage: discount,
      maxDiscount: maxDisc,
      minTxnAmount: minTxn,
      termsAndConditions: `Get ${discount}% instant discount on ${bank} card transactions. Minimum transaction value of $${minTxn}.`,
      code: `${bankShort}${cardType.substring(0,3).toUpperCase()}${discount}`
    });
  }

  console.log(`Generated ${bankOffers.length} Bank Offers successfully.`);

  // 11. Generate empty initial carts (approx. 1,000 to match users)
  const carts: any[] = [];
  users.forEach((u) => {
    carts.push({
      id: `cart-${u.username.trim().toLowerCase()}`,
      username: u.username,
      items: []
    });
  });

  // Assemble full file-db
  const fileDb = {
    products: products,
    categories: categories,
    users: users,
    reviews: reviews,
    orders: orders,
    coupons: coupons,
    sellers: sellers,
    addresses: addresses,
    notifications: notifications,
    bankOffers: bankOffers,
    carts: carts
  };

  // Ensure output directory exists
  const outputDir = path.dirname(dbPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Save database file
  fs.writeFileSync(dbPath, JSON.stringify(fileDb, null, 2), "utf8");
  console.log(`Database generated successfully and saved into: ${dbPath}`);
}
