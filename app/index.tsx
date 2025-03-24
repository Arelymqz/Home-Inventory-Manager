import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the menu icon
import { getInventoryItemsDB, removeItemFromInventoryDB, setupDatabase } from '../database/ItemDatabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../components/SearchBar'; // Import SearchBar component

export default function HomeScreen() {
  const [items, setItems] = useState<Array<{
    id: string;
    name: string;
    category: string;
    location: string;
    purchase_date: string;
    warranty_expiration: string;
  }>>([]);

  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [filteredItems, setFilteredItems] = useState(items); // State for filtered items

  // Fetch items from database when screen loads
  useEffect(() => {
    setupDatabase(); // Ensure DB is set up
    fetchItems(); // Load items into state
  }, []);

  useEffect(() => {
    // Filter items based on search query
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchQuery, items]);

  const fetchItems = async () => {
    try {
      const data = await getInventoryItemsDB(); // Await the promise returned by getInventoryItemsDB
      setItems(data); // Update state with fetched items
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ Error fetching items:', errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeItemFromInventoryDB(id); // Await the promise returned by removeItemFromInventoryDB
      fetchItems(); // Refresh the list after deletion
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ Error deleting item:', errorMessage);
    }
  };

  const handleMenuPress = () => {
    console.log("Menu button pressed. Display options like 'Profile'.");
  };

  return (
    <View style={styles.container}>
      {/* Header Container */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTextSmall}>Hello,</Text>
          <Text style={styles.headerTextLarge}>Arely!</Text>
        </View>
        <TouchableOpacity onPress={handleMenuPress}>
          <Ionicons name="menu" size={35} color="#f0ead2" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>HOME INVENTORY ITEMS</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search items..." // Placeholder text
        placeholderTextColor="#cad5c2" // Optional: Set placeholder text color
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Display Items */}
      <FlatList
        data={filteredItems} // Use filtered items
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemDetails}>
              <Text style={styles.itemText}>{item.name} - {item.category}</Text>
              <Text style={styles.itemSubText}>Location: {item.location}</Text>
              <Text style={styles.itemSubText}>Purchased: {item.purchase_date}</Text>
              <Text style={styles.itemSubText}>Warranty Exp: {item.warranty_expiration}</Text>
            </View>
            <Button title="Delete" onPress={() => handleDelete(item.id)} />
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No items found.</Text>}
      />

      {/* Add Item Button - Navigate to AddItemScreen */}
      <Button title="Add Item" onPress={() => console.log("Navigate to Add Item Screen")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 0 },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#adc178', // Updated background color
    marginBottom: 15,
    borderBottomLeftRadius: 18, // Rounded bottom-left corner
    borderBottomRightRadius: 18, // Rounded bottom-right corner
  },
  headerTextContainer: {
    flexDirection: 'column',
  },
  headerTextSmall: {
    fontSize: 35, // Smaller font size for "Hello,"
    fontStyle: 'italic',
    color: '#f0ead2',
    marginTop: 34,
    marginLeft: 5,
  },
  headerTextLarge: {
    fontSize: 45, // Larger font size for "Arely!"
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#f0ead2',
    marginLeft: 5,
  },
  title: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#858877',
    marginBottom: 10,
    textAlign: 'center',
  },
  searchBar: {
    height: 35,
    borderColor: '#adc178',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  itemContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1 },
  itemDetails: { flex: 1 },
  itemText: { fontSize: 18, fontWeight: 'bold' },
  itemSubText: { fontSize: 14, color: 'gray' },
  emptyText: { fontSize: 16, color: 'gray', textAlign: 'center', marginTop: 20 },
});