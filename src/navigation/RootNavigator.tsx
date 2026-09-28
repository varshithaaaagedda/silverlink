import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useApp } from '../context/AppContext';
import { SeniorTabNavigator } from './SeniorTabNavigator';
import { CaregiverTabNavigator } from './CaregiverTabNavigator';
import { MedicineDetailsScreen } from '../screens/senior/MedicineDetailsScreen';
import { VoiceAssistantScreen } from '../screens/senior/VoiceAssistantScreen';
import { EmergencyScreen } from '../screens/senior/EmergencyScreen';
import { DailyCheckInScreen } from '../screens/senior/DailyCheckInScreen';
import { MedicinesScreen } from '../screens/senior/MedicinesScreen';
import { SeniorPrivacyScreen } from '../screens/senior/SeniorPrivacyScreen';
import { SilverPulseDemoScreen } from '../screens/senior/SilverPulseDemoScreen';

import { FamilyContactsScreen } from '../screens/senior/FamilyContactsScreen';
import { AuthScreen } from '../screens/auth/AuthScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const { role } = useApp();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {role === 'senior' ? (
          <>
            <Stack.Screen name="SeniorMain" component={SeniorTabNavigator} />
            <Stack.Screen name="MedicineDetails" component={MedicineDetailsScreen} />
            <Stack.Screen name="VoiceAssistant" component={VoiceAssistantScreen} />
            <Stack.Screen name="Emergency" component={EmergencyScreen} />
            <Stack.Screen name="DailyCheckIn" component={DailyCheckInScreen} />
            <Stack.Screen name="Medicines" component={MedicinesScreen} />
            <Stack.Screen name="FamilyContacts" component={FamilyContactsScreen} />
            <Stack.Screen name="SeniorPrivacy" component={SeniorPrivacyScreen} />
            <Stack.Screen name="SilverPulseDemo" component={SilverPulseDemoScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="CaregiverMain" component={CaregiverTabNavigator} />
            <Stack.Screen name="MedicineDetails" component={MedicineDetailsScreen} />
            <Stack.Screen name="FamilyContacts" component={FamilyContactsScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
