import * as SQLite from 'expo-sqlite';

// Define the item structure
interface InventoryItem {
  id: string;
  name: string;
  category: string;
  location: string;
  purchase_date: string;
  warranty_expiration: string;
}

// Open the database synchronously
const db = SQLite.openDatabaseSync('home_inventory.db');

// Create the items table if it doesn't exist
export const setupDatabase = () => {
  try {
    db.execAsync(`
      CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT,
        location TEXT,
        purchase_date TEXT,
        warranty_expiration TEXT
      );
    `);
    console.log('✅ Database setup successfully: Items table created or exists.');
  } catch (error) {
    console.error('❌ Error creating table:', error);
  }
};

// Function to add an item to the inventory
export const addItemToInventoryDB = async (item: InventoryItem) => {
  try {
    await db.runAsync(
      `INSERT INTO items (id, name, category, location, purchase_date, warranty_expiration) 
       VALUES (?, ?, ?, ?, ?, ?) 
       ON CONFLICT(id) DO UPDATE SET 
       name = excluded.name, 
       category = excluded.category, 
       location = excluded.location, 
       purchase_date = excluded.purchase_date, 
       warranty_expiration = excluded.warranty_expiration;`,
      [item.id, item.name, item.category, item.location, item.purchase_date, item.warranty_expiration]
    );
    console.log(`✅ Item added to inventory: ${item.name}`);
  } catch (error) {
    console.error('❌ Error adding item to inventory:', error);
  }
};

// Function to fetch all inventory items
export const getInventoryItemsDB = async () => {
  try {
    const result: InventoryItem[] = await db.getAllAsync('SELECT * FROM items;');
    console.log('✅ Fetched inventory items:', result);
    return result;
  } catch (error) {
    console.error('❌ Error fetching inventory items:', error);
    return [];
  }
};

// Function to remove an item from the inventory
export const removeItemFromInventoryDB = async (id: string) => {
  try {
    await db.runAsync('DELETE FROM items WHERE id = ?;', [id]);
    console.log(`✅ Item removed from inventory: ${id}`);
  } catch (error) {
    console.error('❌ Error removing item from inventory:', error);
  }
};

export default db;