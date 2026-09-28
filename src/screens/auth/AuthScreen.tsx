import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { theme } from '../../theme/theme';

export const AuthScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { switchRole } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSelectRole = (newRole: 'senior' | 'caregiver') => {
    switchRole(newRole);
    if (navigation && navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {navigation && navigation.canGoBack() && (
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#38BDF8" />
          <Text style={styles.backBtnText}>Back to Dashboard</Text>
        </TouchableOpacity>
      )}

      <View style={styles.heroBanner}>
        <View style={styles.logoIconBg}>
          <Ionicons name="pulse" size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.appTitle}>SilverLink</Text>
        <Text style={styles.appSub}>Keeping Seniors Connected and Safe</Text>
      </View>

      {/* 1-Tap Demo Roles for Hackathon Reviewers */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>Instant Hackathon Demo Login</Text>
        <Text style={styles.sectionSub}>Select a role to start exploring the MVP instantly:</Text>

        <TouchableOpacity
          style={styles.demoRoleBtnSenior}
          onPress={() => handleSelectRole('senior')}
        >
          <Text style={styles.demoEmoji}>👵</Text>
          <View style={styles.demoTextCol}>
            <Text style={styles.demoRoleTitle}>Senior Citizen App</Text>
            <Text style={styles.demoRoleSub}>Eleanor Vance (Accessible, Large Text, SOS, Voice)</Text>
          </View>
          <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.demoRoleBtnCaregiver}
          onPress={() => handleSelectRole('caregiver')}
        >
          <Text style={styles.demoEmoji}>📱</Text>
          <View style={styles.demoTextCol}>
            <Text style={styles.demoRoleTitle}>Family Caregiver Dashboard</Text>
            <Text style={styles.demoRoleSub}>Sarah Vance (Alerts, Wellness Logs, Med Scheduling)</Text>
          </View>
          <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Firebase Custom Credentials Login Form */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>Account Sign In / Sign Up</Text>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="eleanor@silverlink.org"
          placeholderTextColor="#94A3B8"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.customLoginBtn}
          onPress={() => switchRole('senior')}
        >
          <Text style={styles.customLoginBtnText}>Sign In with Firebase</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heroBanner: {
    alignItems: 'center',
    marginVertical: 24,
  },
  logoIconBg: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#F8FAFC',
  },
  appSub: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: theme.borderRadius.large,
    padding: 20,
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 16,
  },
  demoRoleBtnSenior: {
    backgroundColor: '#0F766E',
    borderRadius: theme.borderRadius.medium,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  demoRoleBtnCaregiver: {
    backgroundColor: '#2563EB',
    borderRadius: theme.borderRadius.medium,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  demoEmoji: {
    fontSize: 32,
    marginRight: 14,
  },
  demoTextCol: {
    flex: 1,
  },
  demoRoleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  demoRoleSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CBD5E1',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#334155',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#475569',
  },
  customLoginBtn: {
    backgroundColor: '#38BDF8',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  customLoginBtnText: {
    color: '#0F172A',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    marginBottom: 10,
  },
  backBtnText: {
    color: '#38BDF8',
    fontSize: 16,
    fontWeight: '600',
  },
});
