import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for icons
import { getInventoryItemsDB, removeItemFromInventoryDB, setupDatabase } from '../database/ItemDatabase';
import { useRouter } from 'expo-router'; // Import useRouter
import { useFocusEffect } from '@react-navigation/native';
import ItemCard from '../components/itemCard'; // Import ItemCard component
import SearchBar from '../components/SearchBar'; // Import SearchBar component

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
  const [sortMenuVisible, setSortMenuVisible] = useState(false); // State for sort menu visibility

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

  const handleSort = (criterion: keyof typeof items[0]) => {
    const sortedItems = [...items].sort((a, b) => {
      if (a[criterion] < b[criterion]) return -1;
      if (a[criterion] > b[criterion]) return 1;
      return 0;
    });
    setItems(sortedItems); // Update the items state with sorted items
    setSortMenuVisible(false); // Hide the sort menu
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
        <TouchableOpacity onPress={() => console.log("Menu button pressed.")}>
          <Ionicons name="menu" size={35} color="#f0ead2" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>HOME INVENTORY ITEMS</Text>

      {/* Search Bar */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Sort and Add Buttons Container */}
      <View style={styles.actionContainer}>
        <TouchableOpacity onPress={() => setSortMenuVisible(!sortMenuVisible)} style={styles.iconButton}>
          <Ionicons name="funnel" size={24} color="#adc178" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAddPress} style={styles.iconButton}>
          <Ionicons name="add-circle" size={24} color="#adc178" />
        </TouchableOpacity>
      </View>

      {/* Sort Menu */}
      {sortMenuVisible && (
        <View style={styles.sortMenu}>
          <TouchableOpacity onPress={() => handleSort('name')}>
            <Text style={styles.sortMenuItem}>Name</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSort('category')}>
            <Text style={styles.sortMenuItem}>Category</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSort('location')}>
            <Text style={styles.sortMenuItem}>Location</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSort('purchase_date')}>
            <Text style={styles.sortMenuItem}>Purchase Date</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSort('warranty_expiration')}>
            <Text style={styles.sortMenuItem}>Warranty Expiration</Text>
          </TouchableOpacity>
        </View>
      )}

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
  sortMenu: {
    position: 'absolute',
    top: 120,
    left: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    padding: 10,
    zIndex: 10,
  },
  sortMenuItem: {
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  emptyText: { 
    fontSize: 16, 
    color: 'gray', 
    textAlign: 'center', 
    marginTop: 20 
  },
});