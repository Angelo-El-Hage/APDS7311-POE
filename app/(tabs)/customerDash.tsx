import axios from 'axios';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet, Button, Alert } from 'react-native';

export default function CustomerDashScreen() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [destinationAccount, setDestinationAccount] = useState('');
  const [swiftCode, setSwiftCode] = useState('');

  const handlePayment = async () => {
    if (!amount || !currency || !destinationAccount || !swiftCode) {
      Alert.alert('Error', 'All fields are required.');

      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');

        if (!token) {
          Alert.alert('Error', 'User is not authenticated.');
          return;
        }

        const response = await axios.post(
          'http://localhost:443/create',
          { amount, currency, destinationAccount, swiftCode, },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Use the token from localStorage
            },
          }
        );

        if (response.status === 201) {
          Alert.alert('Payment Success', response.data.msg);
            
          // Clear the form fields on success
          setAmount('');
          setCurrency('');
          setDestinationAccount('');
          setSwiftCode('');
        } else {
          Alert.alert('Error', response.data.error || 'Failed to create payment');
        }
      } catch (error) {
        Alert.alert('Error', 'Server error. Please try again later.');
      }
    };
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Make a Payment</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Currency (e.g., USD)"
          value={currency}
          onChangeText={setCurrency}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Destination Account"
          value={destinationAccount}
          onChangeText={setDestinationAccount}
        />
        
        <TextInput
          style={styles.input}
          placeholder="SWIFT Code"
          value={swiftCode}
          onChangeText={setSwiftCode}
        />

        <Button title="Submit Payment" onPress={handlePayment} color="#4CAF50" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
  },
});