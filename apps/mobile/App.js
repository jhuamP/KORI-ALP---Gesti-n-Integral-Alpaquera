import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Screens
import DashboardScreen from './src/screens/Dashboard/DashboardScreen';
import AlpacasScreen from './src/screens/Alpacas/AlpacasScreen';
import CostosScreen from './src/screens/Costos/CostosScreen';
import MercadoScreen from './src/screens/Mercado/MercadoScreen';
import FormalScreen from './src/screens/Formal/FormalScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#1A1916' },
          headerTintColor: '#E8B84B',
          tabBarStyle: { backgroundColor: '#1A1916', borderTopColor: '#2E2C28' },
          tabBarActiveTintColor: '#E8B84B',
          tabBarInactiveTintColor: '#8A857A',
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Inicio', tabBarLabel: 'Inicio', tabBarIcon: () => '📊' }}
        />
        <Tab.Screen
          name="Alpacas"
          component={AlpacasScreen}
          options={{ title: 'Mi Hato', tabBarLabel: 'Hato', tabBarIcon: () => '🦙' }}
        />
        <Tab.Screen
          name="Costos"
          component={CostosScreen}
          options={{ title: 'Costos', tabBarLabel: 'Costos', tabBarIcon: () => '💰' }}
        />
        <Tab.Screen
          name="Mercado"
          component={MercadoScreen}
          options={{ title: 'Mercado', tabBarLabel: 'Mercado', tabBarIcon: () => '🛒' }}
        />
        <Tab.Screen
          name="Formal"
          component={FormalScreen}
          options={{ title: 'Formalizar', tabBarLabel: 'Formal', tabBarIcon: () => '📄' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
