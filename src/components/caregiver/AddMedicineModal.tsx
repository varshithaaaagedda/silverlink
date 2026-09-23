import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { Medication, TimeOfDay } from '../../types';
import { theme } from '../../theme/theme';

interface AddMedicineModalProps {
  visible: boolean;
  onClose: () => void;
  medicationToEdit?: Medication | null;
}

const COLOR_OPTIONS = [
  { label: 'Blue', color: '#2563EB' },
  { label: 'Emerald', color: '#059669' },
  { label: 'Amber', color: '#D97706' },
  { label: 'Purple', color: '#7C3AED' },
  { label: 'Red', color: '#DC2626' },
  { label: 'Teal', color: '#0D9488' },
];

const INSTRUCTION_PRESETS = [
  'Take with breakfast & 1 full glass of water.',
  'Take with lunch. Do not crush tablet.',
  'Take with evening dinner.',
  'Instill drops before sleeping.',
];

export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({
  visible,
  onClose,
  medicationToEdit,
}) => {
  const { addMedication, updateMedication } = useApp();

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [scheduledTime, setScheduledTime] = useState('08:00 AM');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('Morning');
  const [instructions, setInstructions] = useState('');
  const [pillColor, setPillColor] = useState('#2563EB');

  useEffect(() => {
    if (medicationToEdit) {
      setName(medicationToEdit.name);
      setDosage(medicationToEdit.dosage);
      setScheduledTime(medicationToEdit.scheduledTime);
      setTimeOfDay(medicationToEdit.timeOfDay);
      setInstructions(medicationToEdit.instructions || '');
      setPillColor(medicationToEdit.pillColor || '#2563EB');
    } else {
      setName('');
      setDosage('');
      setScheduledTime('08:00 AM');
      setTimeOfDay('Morning');
      setInstructions('');
      setPillColor('#2563EB');
    }
  }, [medicationToEdit, visible]);

  const handleSave = async () => {
    if (!name.trim() || !dosage.trim()) {
      if (Platform.OS === 'web') {
        window.alert('Please enter medication name and dosage.');
      } else {
        Alert.alert('Required Fields', 'Please enter medication name and dosage.');
      }
      return;
    }

    if (medicationToEdit) {
      await updateMedication({
        ...medicationToEdit,
        name: name.trim(),
        dosage: dosage.trim(),
        scheduledTime: scheduledTime.trim(),
        timeOfDay,
        instructions: instructions.trim() || 'Take as prescribed by doctor.',
        pillColor,
      });
    } else {
      await addMedication({
        name: name.trim(),
        dosage: dosage.trim(),
        scheduledTime: scheduledTime.trim(),
        timeOfDay,
        frequency: 'Daily',
        instructions: instructions.trim() || 'Take as prescribed by doctor.',
        pillColor,
      });
    }

    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={[styles.pillBadgePreview, { backgroundColor: pillColor }]}>
                <Ionicons name="medical" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.title}>
                {medicationToEdit ? 'Edit Medication' : 'Schedule Medication'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Medication Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Lisinopril, Eye Drops"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Dosage / Form *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 10mg - 1 Tablet, 1 Drop"
              placeholderTextColor="#94A3B8"
              value={dosage}
              onChangeText={setDosage}
            />

            <Text style={styles.label}>Pill Badge Color</Text>
            <View style={styles.colorRow}>
              {COLOR_OPTIONS.map(c => (
                <TouchableOpacity
                  key={c.color}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: c.color },
                    pillColor === c.color && styles.colorCircleSelected,
                  ]}
                  onPress={() => setPillColor(c.color)}
                >
                  {pillColor === c.color && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Time of Day</Text>
            <View style={styles.timeOfDayRow}>
              {(['Morning', 'Afternoon', 'Evening', 'Night'] as TimeOfDay[]).map(t => (
                <TouchableOpacity
                  key={t}
                  style={[styles.timeChip, timeOfDay === t && styles.timeChipActive]}
                  onPress={() => setTimeOfDay(t)}
                >
                  <Text style={[styles.timeChipText, timeOfDay === t && styles.timeChipTextActive]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Scheduled Time</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 08:00 AM"
              placeholderTextColor="#94A3B8"
              value={scheduledTime}
              onChangeText={setScheduledTime}
            />

            <Text style={styles.label}>Senior Intake Instructions</Text>
            <TextInput
              style={[styles.input, { minHeight: 70, textAlignVertical: 'top' }]}
              placeholder="e.g. Take after meal with 1 glass of water."
              placeholderTextColor="#94A3B8"
              value={instructions}
              onChangeText={setInstructions}
              multiline
            />

            <Text style={styles.labelQuick}>Quick Template Suggestions:</Text>
            <View style={styles.presetRow}>
              {INSTRUCTION_PRESETS.map((preset, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.presetChip}
                  onPress={() => setInstructions(preset)}
                >
                  <Text style={styles.presetText}>{preset}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footerRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={styles.saveBtnText}>
                {medicationToEdit ? 'Save Changes' : 'Schedule Dose'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pillBadgePreview: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  formScroll: {
    maxHeight: 420,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginTop: 10,
    marginBottom: 6,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  colorCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircleSelected: {
    borderWidth: 3,
    borderColor: '#0F172A',
  },
  labelQuick: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 10,
    marginBottom: 6,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetChip: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  presetText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: '#0F172A',
  },
  timeOfDayRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  timeChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  timeChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  timeChipTextActive: {
    color: '#FFFFFF',
  },
  footerRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 14,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: '#475569',
    fontWeight: '700',
    fontSize: 15,
  },
  saveBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
