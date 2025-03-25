import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the menu icon
import { getInventoryItemsDB, removeItemFromInventoryDB, setupDatabase } from '../database/ItemDatabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../components/SearchBar'; // Import SearchBar component
import { useRouter } from 'expo-router'; // Import useRouter
import { useFocusEffect } from '@react-navigation/native';
import ItemCard from '../components/itemCard'; // Import ItemCard component

export default function HomeScreen() {
  const router = useRouter(); // Use router for navigation

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
  // Fetch items from database when screen loads or when navigating back
  useFocusEffect(
    React.useCallback(() => {
      fetchItems(); // Refresh items on focus
      return () => {};
    }, [])
  );

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

  const handleSortPress = () => {
    console.log("Sort button pressed. Implement sorting logic here.");
  };

  const handleAddPress = () => {
    router.push('/addItem'); // Navigate to the addItem screen
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
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Sort and Add Buttons Container */}
      <View style={styles.actionContainer}>
        <TouchableOpacity onPress={handleSortPress} style={styles.iconButton}>
          <Ionicons name="funnel" size={24} color="#adc178" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAddPress} style={styles.iconButton}>
          <Ionicons name="add-circle" size={24} color="#adc178" />
        </TouchableOpacity>
      </View>

      {/* Display Items */}
      <FlatList
        data={filteredItems} // Use filtered items
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemCard
            id={item.id}
            name={item.name}
            category={item.category}
            location={item.location}
            purchase_date={item.purchase_date}
            warranty_expiration={item.warranty_expiration}
            onItemUpdated={fetchItems} // Pass the refresh callback
          />
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No items found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 0,
    backgroundColor: '#ffffff', 
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#adc178', // Updated background color
    marginBottom: 20,
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
    fontWeight: '700', 
    color: '#858877',
    marginBottom: 15,
    textAlign: 'center',
  },
  itemContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1 },
  itemDetails: { flex: 1 },
  itemText: { fontSize: 18, fontWeight: 'bold' },
  itemSubText: { fontSize: 14, color: 'gray' },
  emptyText: { fontSize: 16, color: 'gray', textAlign: 'center', marginTop: 20 },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 18,
    marginBottom: 10,
  },
  iconButton: {
    padding: 10,
  },
});