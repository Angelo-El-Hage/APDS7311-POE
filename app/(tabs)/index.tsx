import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';

export default function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const scaleAnimation = new Animated.Value(1);

  const handleRoleSelection = (role: string) => {
    setSelectedRole(role);
    // Trigger a scale animation on selection
    Animated.spring(scaleAnimation, {
      toValue: 1.1,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(scaleAnimation, { toValue: 1, useNativeDriver: true }).start();
    });
  };

  const handleContinue = () => {
    if (selectedRole === 'Staff') {
      router.push('/(tabs)/login2');
    } else if (selectedRole === 'Customer') {
      router.push('/(tabs)/customer');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Role</Text>
      
      <View style={styles.cardContainer}>
        <Animated.View style={[styles.card, selectedRole === 'Staff' && styles.selectedCard, { transform: [{ scale: selectedRole === 'Staff' ? scaleAnimation : 1 }] }]}>
          <TouchableOpacity onPress={() => handleRoleSelection('Staff')}>
            <Text style={styles.cardText}>Staff</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.card, selectedRole === 'Customer' && styles.selectedCard, { transform: [{ scale: selectedRole === 'Customer' ? scaleAnimation : 1 }] }]}>
          <TouchableOpacity onPress={() => handleRoleSelection('Customer')}>
            <Text style={styles.cardText}>Customer</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <TouchableOpacity
        style={[styles.continueButton, !selectedRole && styles.disabledButton]}
        onPress={handleContinue}
        disabled={!selectedRole}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  cardContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  card: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 10,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectedCard: {
    backgroundColor: '#007bff',
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  continueButton: {
    width: '80%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 25,
  },
  disabledButton: {
    backgroundColor: '#a0a0a0',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
