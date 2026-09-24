// App.js — Root of the QuickBite app
// Wraps everything in CartProvider (global state) and NavigationContainer

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './navigation/AppNavigator';
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
    // SafeAreaProvider handles notches / status bar on all devices
    <SafeAreaProvider>
      {/* CartProvider gives every screen access to the cart state */}
      <CartProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="light" />
        </NavigationContainer>
      </CartProvider>
    </SafeAreaProvider>
  );
}
