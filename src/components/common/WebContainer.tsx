import React from 'react';
import { View, StyleSheet, Dimensions, Platform, Text, TouchableOpacity } from 'react-native';
import { useApp } from '../../context/AppContext';

interface WebContainerProps {
  children: React.ReactNode;
}

export const WebContainer: React.FC<WebContainerProps> = ({ children }) => {
  const { role, switchRole } = useApp();

  if (Platform.OS !== 'web') {
    return <View style={styles.nativeContainer}>{children}</View>;
  }

  return (
    <View style={styles.outerBackground}>
      <View style={styles.webHeaderBar}>
        <View style={styles.brandingGroup}>
          <Text style={styles.brandingTitle}>SilverLink</Text>
          <Text style={styles.brandingTagline}>Keeping Seniors Connected & Safe</Text>
        </View>
        <View style={styles.roleToggleGroup}>
          <Text style={styles.modeLabel}>Active Demo Mode:</Text>
          <TouchableOpacity
            style={[styles.roleChip, role === 'senior' && styles.roleChipActiveSenior]}
            onPress={() => switchRole('senior')}
          >
            <Text style={[styles.roleChipText, role === 'senior' && styles.roleChipTextActive]}>
              👵 Senior Mode
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleChip, role === 'caregiver' && styles.roleChipActiveCaregiver]}
            onPress={() => switchRole('caregiver')}
          >
            <Text style={[styles.roleChipText, role === 'caregiver' && styles.roleChipTextActive]}>
              📱 Caregiver Dashboard
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.phoneFrame}>
        <View style={styles.screenInner}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerBackground: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  webHeaderBar: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  brandingGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandingTitle: {
    color: '#38BDF8',
    fontSize: 22,
    fontWeight: 'bold',
  },
  brandingTagline: {
    color: '#94A3B8',
    fontSize: 14,
  },
  roleToggleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modeLabel: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
    marginRight: 4,
  },
  roleChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#334155',
  },
  roleChipActiveSenior: {
    backgroundColor: '#0F766E',
  },
  roleChipActiveCaregiver: {
    backgroundColor: '#2563EB',
  },
  roleChipText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  roleChipTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  phoneFrame: {
    flex: 1,
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#F8FAFC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    overflow: 'hidden',
  },
  screenInner: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  nativeContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
