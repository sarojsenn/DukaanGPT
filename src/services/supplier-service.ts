/**
 * @fileoverview A dummy service for fetching supplier data.
 * In a real application, this would connect to a database like Firestore.
 */

// A hardcoded list of suppliers to simulate a database.
const DUMMY_SUPPLIERS = [
  {
    id: 'supplier-1',
    supplierName: 'Krishna Vegetables',
    contactNumber: '+919876543210',
    inventory: [
      { itemName: 'Tomatoes', price: 30, quantity: 150 },
      { itemName: 'Onions', price: 25, quantity: 200 },
      { itemName: 'Potatoes', price: 20, quantity: 300 },
    ],
    rating: 4.5,
    location: 'Koramangala, Bangalore',
    languageSupport: ['Kannada', 'English'],
    trustScore: 92,
    deliveryOptions: 'delivery, pick-up',
    materials: ['tomatoes', 'onions', 'potatoes', 'vegetables'],
  },
  {
    id: 'supplier-2',
    supplierName: 'Gupta & Sons Grains',
    contactNumber: '+919123456789',
    inventory: [
      { itemName: 'AP Flour (Maida)', price: 40, quantity: 500 },
      { itemName: 'Basmati Rice', price: 80, quantity: 1000 },
      { itemName: 'Chickpea Flour (Besan)', price: 60, quantity: 300 },
    ],
    rating: 4.8,
    location: 'Jayanagar, Bangalore',
    languageSupport: ['Hindi', 'English'],
    trustScore: 98,
    deliveryOptions: 'delivery',
    materials: ['flour', 'maida', 'rice', 'besan', 'grains'],
  },
  {
    id: 'supplier-3',
    supplierName: 'Fresh Farms Co-op',
    contactNumber: '+919988776655',
    inventory: [
      { itemName: 'Tomatoes', price: 28, quantity: 50 },
      { itemName: 'Onions', price: 22, quantity: 80 },
      { itemName: 'Green Chillies', price: 55, quantity: 20 },
    ],
    rating: 4.2,
    location: 'Indiranagar, Bangalore',
    languageSupport: ['English', 'Tamil'],
    trustScore: 85,
    deliveryOptions: 'pick-up',
    materials: ['tomatoes', 'onions', 'green chillies', 'vegetables'],
  },
   {
    id: 'supplier-4',
    supplierName: 'Mumbai Masala Store',
    contactNumber: '+918877665544',
    inventory: [
      { itemName: 'Potatoes', price: 25, quantity: 500 },
      { itemName: 'Pav Bhaji Masala', price: 150, quantity: 50 },
      { itemName: 'Onions', price: 30, quantity: 400 },
    ],
    rating: 4.9,
    location: 'Dadar, Mumbai',
    languageSupport: ['Marathi', 'Hindi', 'English'],
    trustScore: 95,
    deliveryOptions: 'delivery, pick-up',
    materials: ['potatoes', 'masala', 'onions', 'spices'],
  },
  {
    id: 'supplier-5',
    supplierName: 'Delhi Dairy Delights',
    contactNumber: '+917766554433',
    inventory: [
      { itemName: 'Paneer', price: 350, quantity: 50 },
      { itemName: 'Curd (Dahi)', price: 60, quantity: 100 },
      { itemName: 'Butter', price: 500, quantity: 40 },
    ],
    rating: 4.7,
    location: 'Chandni Chowk, Delhi',
    languageSupport: ['Hindi', 'Punjabi', 'English'],
    trustScore: 93,
    deliveryOptions: 'delivery',
    materials: ['paneer', 'dairy', 'curd', 'butter', 'dahi'],
  },
  {
    id: 'supplier-6',
    supplierName: 'Kolkata Oils & Co.',
    contactNumber: '+916655443322',
    inventory: [
      { itemName: 'Mustard Oil', price: 180, quantity: 200 },
      { itemName: 'Sunflower Oil', price: 160, quantity: 300 },
    ],
    rating: 4.4,
    location: 'Howrah, Kolkata',
    languageSupport: ['Bengali', 'Hindi'],
    trustScore: 88,
    deliveryOptions: 'pick-up',
    materials: ['oil', 'cooking oil'],
  },
  {
    id: 'supplier-7',
    supplierName: 'Chennai Spice Bazaar',
    contactNumber: '+915544332211',
    inventory: [
      { itemName: 'Turmeric Powder', price: 200, quantity: 100 },
      { itemName: 'Red Chilli Powder', price: 250, quantity: 120 },
      { itemName: 'Coriander Seeds', price: 180, quantity: 80 },
    ],
    rating: 4.9,
    location: 'T. Nagar, Chennai',
    languageSupport: ['Tamil', 'English'],
    trustScore: 97,
    deliveryOptions: 'delivery, pick-up',
    materials: ['spices', 'masala', 'turmeric', 'chilli'],
  },
  {
    id: 'supplier-8',
    supplierName: 'Pune Packaging Hub',
    contactNumber: '+914433221100',
    inventory: [
      { itemName: 'Paper Plates', price: 1, quantity: 10000 },
      { itemName: 'Plastic Spoons', price: 0.5, quantity: 20000 },
      { itemName: 'Paper Bags', price: 2, quantity: 5000 },
    ],
    rating: 4.3,
    location: 'Kothrud, Pune',
    languageSupport: ['Marathi', 'English'],
    trustScore: 89,
    deliveryOptions: 'delivery',
    materials: ['packaging', 'disposables', 'plates', 'spoons', 'bags'],
  },
];


/**
 * Finds suppliers who provide a specific raw material.
 * @param rawMaterial The raw material to search for (e.g., 'tomatoes').
 * @returns A promise that resolves to an array of matching suppliers.
 */
export async function findSuppliers(rawMaterial: string) {
  console.log(`Searching for suppliers with: ${rawMaterial}`);
  
  const lowerCaseMaterial = rawMaterial.toLowerCase();
  
  const matchingSuppliers = DUMMY_SUPPLIERS.filter(supplier => 
    supplier.materials.some(material => material.includes(lowerCaseMaterial))
  );

  console.log(`Found ${matchingSuppliers.length} matching suppliers.`);
  
  // Omit the 'materials' and 'id' fields from the returned objects as they are for internal use.
  return matchingSuppliers.map(({ materials, id, ...rest }) => rest);
}
