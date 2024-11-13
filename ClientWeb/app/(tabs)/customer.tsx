import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';  // Import the router hook

export default function WelcomeScreen() {
  const router = useRouter();  // Initialize the router hook here

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Our App!</Text>
      <Text style={styles.subtitle}>Please choose an option below to get started:</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.registerButton]} 
          onPress={() => router.push('/(tabs)/register')}  // Navigate to Register screen
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.loginButton]} 
          onPress={() => router.push('/(tabs)/login')}  // Navigate to Login screen
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0', // Light background color
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', // Dark text for contrast
  },
  subtitle: {
    fontSize: 16,
    color: '#666', // Lighter text for subtitle
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#4CAF50', // Green for register
  },
  loginButton: {
    backgroundColor: '#2196F3', // Blue for login
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});