import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { SeniorButton } from '../../components/common/SeniorButton';
import { SpeechService } from '../../services/speechService';
import { theme } from '../../theme/theme';

export const SeniorSettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { audioEnabled, setAudioEnabled, highContrast, setHighContrast, switchRole, currentUser } = useApp();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#0F766E" />
        <Text style={styles.backBtnText}>Back to Home</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Accessibility & Settings</Text>

      {/* User Profile Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Senior Profile</Text>
        <Text style={styles.profileName}>{currentUser.name}</Text>
        <Text style={styles.profileEmail}>{currentUser.email}</Text>
      </View>

      {/* Preferences Toggles */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Audio & Speech</Text>
        <View style={styles.toggleRow}>
          <View style={styles.toggleTextCol}>
            <Text style={styles.toggleLabel}>Voice Audio Assistance</Text>
            <Text style={styles.toggleSub}>Reads reminders and confirmations out loud</Text>
          </View>
          <Switch
            value={audioEnabled}
            onValueChange={val => {
              setAudioEnabled(val);
              if (val) SpeechService.speakText("Voice audio assistance enabled");
            }}
            trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
            thumbColor={audioEnabled ? '#0F766E' : '#94A3B8'}
          />
        </View>

        <View style={[styles.toggleRow, { borderBottomWidth: 0 }]}>
          <View style={styles.toggleTextCol}>
            <Text style={styles.toggleLabel}>Extra High Contrast</Text>
            <Text style={styles.toggleSub}>Increases border lines and text darkness</Text>
          </View>
          <Switch
            value={highContrast}
            onValueChange={setHighContrast}
            trackColor={{ false: '#CBD5E1', true: '#99F6E4' }}
            thumbColor={highContrast ? '#0F766E' : '#94A3B8'}
          />
        </View>
      </View>

      {/* Demo Role Switcher */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Hackathon Reviewer Switch</Text>
        <Text style={styles.toggleSub}>
          Switch directly into the Family Caregiver Dashboard to review caregiver monitoring features.
        </Text>
        <SeniorButton
          title="Switch to Caregiver App 📱"
          variant="secondary"
          onPress={() => switchRole('caregiver')}
          style={{ marginTop: 14 }}
        />

        <SeniorButton
          title="Sign Out / Switch Profile"
          variant="secondary"
          onPress={() => {
            navigation.navigate('Auth');
          }}
          style={{ marginTop: 12, backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  backBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F766E',
  },
  headerTitle: {
    fontSize: theme.typography.seniorHeader.fontSize,
    fontWeight: theme.typography.seniorHeader.fontWeight,
    color: '#0F172A',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F766E',
  },
  profileEmail: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 2,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  toggleTextCol: {
    flex: 1,
    marginRight: 10,
  },
  toggleLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  toggleSub: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
});
