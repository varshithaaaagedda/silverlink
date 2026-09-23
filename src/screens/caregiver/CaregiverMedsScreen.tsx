import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { AddMedicineModal } from '../../components/caregiver/AddMedicineModal';
import { Medication } from '../../types';
import { theme } from '../../theme/theme';

export const CaregiverMedsScreen: React.FC = () => {
  const { medications, markMedicationTaken, markMedicationPending, deleteMedication } = useApp();
  const [filter, setFilter] = useState<'all' | 'pending' | 'taken' | 'missed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [medicationToEdit, setMedicationToEdit] = useState<Medication | null>(null);

  const takenCount = medications.filter(m => m.status === 'taken').length;
  const missedCount = medications.filter(m => m.status === 'missed').length;
  const pendingCount = medications.filter(m => m.status !== 'taken' && m.status !== 'missed').length;

  const filteredMeds = medications.filter(m => {
    if (filter === 'all') return true;
    if (filter === 'pending') return m.status !== 'taken' && m.status !== 'missed';
    return m.status === filter;
  });

  const handleOpenAdd = () => {
    setMedicationToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (med: Medication) => {
    setMedicationToEdit(med);
    setIsModalOpen(true);
  };

  const handleDelete = (med: Medication) => {
    const confirmDelete = () => {
      deleteMedication(med.id);
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Are you sure you want to remove ${med.name} from Eleanor's schedule?`)) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        'Remove Medication',
        `Are you sure you want to remove ${med.name} from Eleanor's schedule?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: confirmDelete },
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Senior Medications</Text>
          <Text style={styles.sub}>Eleanor Vance's prescribed regimen</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={handleOpenAdd}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Schedule New</Text>
        </TouchableOpacity>
      </View>

      {/* Regimen Stats Overview */}
      <View style={styles.statsGrid}>
        <View style={[styles.statBox, { backgroundColor: '#EFF6FF' }]}>
          <Text style={[styles.statNumber, { color: '#1D4ED8' }]}>{medications.length}</Text>
          <Text style={styles.statLabel}>Total Prescribed</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#ECFDF5' }]}>
          <Text style={[styles.statNumber, { color: '#047857' }]}>{takenCount}</Text>
          <Text style={styles.statLabel}>Doses Taken</Text>
        </View>
        <View style={[styles.statBox, { backgroundColor: '#FFFBEB' }]}>
          <Text style={[styles.statNumber, { color: '#B45309' }]}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {(['all', 'pending', 'taken', 'missed'] as const).map(f => {
          const count =
            f === 'all'
              ? medications.length
              : f === 'pending'
              ? pendingCount
              : f === 'taken'
              ? takenCount
              : missedCount;

          return (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>
                {f.toUpperCase()} ({count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Medication Cards */}
      {filteredMeds.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="medical-outline" size={40} color="#94A3B8" />
          <Text style={styles.emptyTitle}>No medications found</Text>
          <Text style={styles.emptySub}>No scheduled doses match the selected "{filter}" filter.</Text>
        </View>
      ) : (
        filteredMeds.map(med => (
          <View key={med.id} style={styles.medCard}>
            <View style={styles.cardTopRow}>
              <View style={[styles.pillCircle, { backgroundColor: med.pillColor || '#2563EB' }]}>
                <Ionicons name="medical" size={22} color="#FFFFFF" />
              </View>
              <View style={styles.medInfoCol}>
                <Text style={styles.medName}>{med.name}</Text>
                <Text style={styles.medDosage}>
                  {med.dosage} • {med.scheduledTime} ({med.timeOfDay})
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      med.status === 'taken'
                        ? '#D1FAE5'
                        : med.status === 'missed'
                        ? '#FEE2E2'
                        : '#FEF3C7',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    {
                      color:
                        med.status === 'taken'
                          ? '#065F46'
                          : med.status === 'missed'
                          ? '#991B1B'
                          : '#92400E',
                    },
                  ]}
                >
                  {med.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.instructionsBox}>
              <Ionicons name="information-circle-outline" size={18} color="#475569" />
              <Text style={styles.instructionsText}>{med.instructions}</Text>
            </View>

            <View style={styles.cardActionRow}>
              <Text style={styles.lastTakenText}>
                {med.lastTakenTime ? `Confirmed: ${med.lastTakenTime}` : 'Not yet confirmed today'}
              </Text>

              <View style={styles.actionButtonsCol}>
                <TouchableOpacity
                  style={styles.actionIconBtn}
                  onPress={() => handleOpenEdit(med)}
                  accessibilityLabel="Edit Medication"
                >
                  <Ionicons name="pencil" size={16} color="#2563EB" />
                  <Text style={styles.actionBtnText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionIconBtn}
                  onPress={() => handleDelete(med)}
                  accessibilityLabel="Delete Medication"
                >
                  <Ionicons name="trash-outline" size={16} color="#DC2626" />
                  <Text style={[styles.actionBtnText, { color: '#DC2626' }]}>Remove</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.overrideBtn}
                  onPress={() => {
                    if (med.status === 'taken') markMedicationPending(med.id);
                    else markMedicationTaken(med.id);
                  }}
                >
                  <Text style={styles.overrideBtnText}>
                    {med.status === 'taken' ? 'Set Pending' : 'Force Taken'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}

      <AddMedicineModal
        visible={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setMedicationToEdit(null);
        }}
        medicationToEdit={medicationToEdit}
      />
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
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
  },
  addBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  medCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  medInfoCol: {
    flex: 1,
  },
  medName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  medDosage: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  instructionsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
    gap: 8,
  },
  instructionsText: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  lastTakenText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  overrideBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  overrideBtnText: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 12,
  },
  emptySub: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
  },
  actionButtonsCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
});
