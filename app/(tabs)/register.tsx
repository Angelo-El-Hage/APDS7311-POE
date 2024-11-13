import React, { useState } from 'react';
import axios from 'axios';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';  // Import the router hook

export default function RegisterScreen() {
  const [form, setForm] = useState({
    fullname: '',
    idNum: '',
    accountNum: '',
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleRegister = async () => {
    const { fullname, idNum, accountNum, username, email, password } = form;
    if (fullname && idNum && accountNum && username && email && password) {
      Alert.alert('Registration Successful!', `Welcome, ${username}!`);
      // Add further handling for registration, like API call

      const response = await axios.post('https://localhost:443/register', { fullname, idNum, accountNum, username, email,password });
      router.push('/(tabs)/login');

    } else {
      Alert.alert('Error', 'Please fill in all fields.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Register</Text>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={form.fullname}
        onChangeText={(value) => handleChange('fullname', value)}
      />
      <TextInput
        placeholder="ID Number"
        style={styles.input}
        keyboardType="numeric"
        value={form.idNum}
        onChangeText={(value) => handleChange('idNum', value)}
      />
      <TextInput
        placeholder="Account Number"
        style={styles.input}
        keyboardType="numeric"
        value={form.accountNum}
        onChangeText={(value) => handleChange('accountNum', value)}
      />
      <TextInput
        placeholder="Username"
        style={styles.input}
        value={form.username}
        onChangeText={(value) => handleChange('username', value)}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(value) => handleChange('email', value)}
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        secureTextEntry
        value={form.password}
        onChangeText={(value) => handleChange('password', value)}
      />

      <Button title="Register" onPress={handleRegister} color="#4CAF50" />

      <View style={styles.footer}>
        <Text>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/login')}>
          <Text style={styles.link}> Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'center',
  },
  link: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});
