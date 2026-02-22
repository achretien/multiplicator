import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from './src/context/GameContext';
import { getStrings } from './src/constants/strings';
import MenuScreen from './src/screens/MenuScreen';
import HandoverScreen from './src/screens/HandoverScreen';
import GameScreen from './src/screens/GameScreen';
import ResultScreen from './src/screens/ResultScreen';
import DuelResultScreen from './src/screens/DuelResultScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import GameDetailScreen from './src/screens/GameDetailScreen';
import { HistoryEntry } from './src/utils/storage';

export type RootStackParamList = {
  Menu: undefined;
  Handover: undefined;
  Game: undefined;
  Result: undefined;
  DuelResult: undefined;
  History: undefined;
  GameDetail: { entry: HistoryEntry };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GameProvider>
      <NavigationContainer
        documentTitle={{
          formatter: () => getStrings().appName,
        }}
      >
        <Stack.Navigator
          initialRouteName="Menu"
          screenOptions={{ headerShown: false, animation: 'fade' }}
        >
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="Handover" component={HandoverScreen} />
          <Stack.Screen name="Game" component={GameScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
          <Stack.Screen name="DuelResult" component={DuelResultScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="GameDetail" component={GameDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </GameProvider>
  );
}
