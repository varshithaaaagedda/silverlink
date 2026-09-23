import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { theme } from '../../theme/theme';

export const CaregiverSettingsScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { switchRole, currentUser, caregiverSettings, updateCaregiverSettings, logout } = useApp();

  const timeouts = ['15 mins', '30 mins', '45 mins', '60 mins'];

  const handleLogout = () => {
    logout();
    if (navigation) {
      navigation.navigate('Auth');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Caregiver Settings</Text>
      <Text style={styles.sub}>Alert configurations & account controls</Text>

      {/* Account Info */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>Caregiver Profile</Text>
        <Text style={styles.profileName}>{currentUser.name}</Text>
        <Text style={styles.profileRole}>Primary Caregiver (Daughter)</Text>
        <Text style={styles.profileEmail}>{currentUser.email}</Text>
      </View>

      {/* Notification Rules */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>Alert & Notification Rules</Text>

        <View style={styles.row}>
          <View style={styles.rowTextCol}>
            <Text style={styles.rowLabel}>Emergency SOS Push Alerts</Text>
            <Text style={styles.rowSub}>Instant high-priority notification when SOS is pressed</Text>
          </View>
          <Switch
            value={caregiverSettings.sosCallout}
            onValueChange={val => updateCaregiverSettings({ sosCallout: val })}
            trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
            thumbColor={caregiverSettings.sosCallout ? '#2563EB' : '#94A3B8'}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.rowTextCol}>
            <Text style={styles.rowLabel}>Missed Medication Warning</Text>
            <Text style={styles.rowSub}>Alert if dose remains unconfirmed after scheduled time</Text>
          </View>
          <Switch
            value={caregiverSettings.pushNotifs}
            onValueChange={val => updateCaregiverSettings({ pushNotifs: val })}
            trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
            thumbColor={caregiverSettings.pushNotifs ? '#2563EB' : '#94A3B8'}
          />
        </View>

        <View style={[styles.row, { borderBottomWidth: 0 }]}>
          <View style={styles.rowTextCol}>
            <Text style={styles.rowLabel}>Missed Dose Timeout Threshold</Text>
            <Text style={styles.rowSub}>Time before marking pending dose as missed</Text>
          </View>
          <View style={styles.timeoutRow}>
            {timeouts.map(t => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.timeoutChip,
                  caregiverSettings.missedDoseTimeout === t && styles.timeoutChipActive,
                ]}
                onPress={() => updateCaregiverSettings({ missedDoseTimeout: t })}
              >
                <Text
                  style={[
                    styles.timeoutText,
                    caregiverSettings.missedDoseTimeout === t && styles.timeoutTextActive,
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Switch to Senior Mode */}
      <View style={styles.card}>
        <Text style={styles.sectionHeading}>Hackathon Demo Controls</Text>
        <Text style={styles.rowSub}>
          Switch to the Senior Accessibility App interface to test Senior buttons, voice assistant, check-in, and SOS.
        </Text>
        <TouchableOpacity style={styles.switchBtn} onPress={() => switchRole('senior')}>
          <Ionicons name="swap-horizontal" size={20} color="#FFFFFF" />
          <Text style={styles.switchBtnText}>Switch to Senior Interface 👵</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text style={styles.logoutBtnText}>Switch Profile / Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  sub: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  profileRole: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
    marginTop: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rowTextCol: {
    flex: 1,
    marginRight: 10,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  rowSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  timeoutRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    maxWidth: 220,
    justifyContent: 'flex-end',
  },
  timeoutChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  timeoutChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  timeoutText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 12,
  },
  timeoutTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  switchBtn: {
    backgroundColor: '#0F766E',
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
  },
  switchBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  logoutBtnText: {
    color: '#DC2626',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
