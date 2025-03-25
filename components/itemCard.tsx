import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { removeItemFromInventoryDB, addItemToInventoryDB } from '../database/ItemDatabase';

interface ItemCardProps {
  id: string;
  name: string;
  category: string;
  location: string;
  purchase_date: string;
  warranty_expiration: string;
  onItemUpdated: () => void; // Callback to refresh the item list
}

const ItemCard: React.FC<ItemCardProps> = ({
  id,
  name,
  category,
  location,
  purchase_date,
  warranty_expiration,
  onItemUpdated,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedCategory, setEditedCategory] = useState(category);
  const [editedLocation, setEditedLocation] = useState(location);
  const [editedPurchaseDate, setEditedPurchaseDate] = useState(purchase_date);
  const [editedWarrantyExpiration, setEditedWarrantyExpiration] = useState(warranty_expiration);

  const handleDelete = async () => {
    try {
      await removeItemFromInventoryDB(id); // Delete the item from the database
      onItemUpdated(); // Refresh the item list
    } catch (error) {
      console.error('❌ Error deleting item:', error);
    }
  };

  const handleSave = async () => {
    const updatedItem = {
      id,
      name: editedName,
      category: editedCategory,
      location: editedLocation,
      purchase_date: editedPurchaseDate,
      warranty_expiration: editedWarrantyExpiration,
    };

    try {
      await addItemToInventoryDB(updatedItem); // Update the item in the database
      setEditMode(false); // Exit edit mode
      onItemUpdated(); // Refresh the item list
    } catch (error) {
      console.error('❌ Error updating item:', error);
    }
  };

  return (
    <View style={styles.card}>
      {/* Item Details */}
      {!editMode ? (
        <>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.category}>{category}</Text>
          <Text style={styles.detail}>📍 {location}</Text>
          <Text style={styles.detail}>🛒 Purchased: {purchase_date}</Text>
          <Text
            style={[
              styles.detail,
              new Date(warranty_expiration) < new Date() ? styles.expired : styles.valid,
            ]}
          >
            ⏳ Warranty: {warranty_expiration}
          </Text>
        </>
      ) : (
        <>
          {/* Editable Fields */}
          <TextInput style={styles.input} value={editedName} onChangeText={setEditedName} />
          <TextInput style={styles.input} value={editedCategory} onChangeText={setEditedCategory} />
          <TextInput style={styles.input} value={editedLocation} onChangeText={setEditedLocation} />
          <TextInput
            style={styles.input}
            value={editedPurchaseDate}
            onChangeText={setEditedPurchaseDate}
          />
          <TextInput
            style={styles.input}
            value={editedWarrantyExpiration}
            onChangeText={setEditedWarrantyExpiration}
          />
          <Button title="Save" onPress={handleSave} />
        </>
      )}

      {/* Options Button */}
      <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)} style={styles.optionsButton}>
        <Ionicons name="ellipsis-vertical" size={20} color="#666" />
      </TouchableOpacity>

      {/* Options Menu */}
      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity
            onPress={() => {
              setEditMode(true);
              setMenuVisible(false);
            }}
          >
            <Text style={styles.menuItem}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleDelete();
              setMenuVisible(false);
            }}
          >
            <Text style={styles.menuItem}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FEFFFB',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    marginVertical: 6,
    marginHorizontal: 18,
    position: 'relative',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4D5D1E',
  },
  category: {
    fontSize: 14,
    color: '#9ba781',
  },
  detail: {
    fontSize: 14,
    marginTop: 4,
    color: '#4D5D1E',
  },
  expired: {
    color: '#AF2729',
  },
  valid: {
    color: '#399A00',
  },
  optionsButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  menu: {
    position: 'absolute',
    top: 30,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    padding: 5,
  },
  menuItem: {
    padding: 10,
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    marginBottom: 5,
  },
});

export default ItemCard;