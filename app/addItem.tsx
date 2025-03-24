import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { addItemToInventoryDB } from '../database/ItemDatabase'; // Import the function to add items
import { useRouter } from 'expo-router'; // Import useRouter

export default function AddItemScreen() {
  const router = useRouter(); // Use router for navigation
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [warrantyExpiration, setWarrantyExpiration] = useState('');

  // Function to handle form submission
  const handleAddItem = async () => {
    if (!name || !category || !location || !purchaseDate || !warrantyExpiration) {
      alert('Please fill in all fields');
      return;
    }

    const newItem = {
      id: Date.now().toString(), // Generate a unique ID (using timestamp)
      name,
      category,
      location,
      purchase_date: purchaseDate,
      warranty_expiration: warrantyExpiration,
    };

    try {
      await addItemToInventoryDB(newItem); // Add the item to the database
      alert('Item added successfully!');
      router.back(); // Navigate back to the previous screen (HomeScreen)
    } catch (error) {
      console.error('❌ Error adding item:', error);
      alert('Error adding item');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Add a New Item</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Item Name"
        placeholderTextColor="#cad5c2"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        placeholderTextColor="#cad5c2"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        placeholderTextColor="#cad5c2"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Purchase Date (YYYY-MM-DD)"
        placeholderTextColor="#cad5c2"
        value={purchaseDate}
        onChangeText={setPurchaseDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Warranty Expiration (YYYY-MM-DD)"
        placeholderTextColor="#cad5c2"
        value={warrantyExpiration}
        onChangeText={setWarrantyExpiration}
      />
      
      <Button title="Add Item" onPress={handleAddItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 20,
    justifyContent: 'center',
    backgroundColor: '#adc178',
    alignItems: 'center', // Centers the title horizontally
    marginBottom: 135,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#f0ead2',
    marginTop: 60,
    textAlign: 'center', // Centers the text
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
    marginHorizontal: 40,
    paddingHorizontal: 10,
  },
});