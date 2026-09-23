import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { SeniorButton } from '../../components/common/SeniorButton';
import { SpeechService } from '../../services/speechService';
import { silverPulseService, SilverPulseState } from '../../features/silverpulse/silverPulseService';
import { emitMedicineTaken } from '../../features/medication/medicationEvents';
import { theme } from '../../theme/theme';

export const SeniorHomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { currentUser, medications, checkIns, markMedicationTaken, contacts, highContrast } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [pulseState, setPulseState] = useState<SilverPulseState>(silverPulseService.getCurrentState());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unsubscribe = silverPulseService.subscribe((state) => {
      setPulseState(state);
    });
    return () => unsubscribe();
  }, []);

  const todayCheckIn = checkIns[0];
  const pendingMeds = medications.filter((m) => m.status === 'pending' || m.status === 'due' || m.status === 'upcoming');
  const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0];

  const handleSpeechGreeting = () => {
    SpeechService.speakText(
      `Good day ${currentUser.name}. Today is ${currentDate}. You have ${pendingMeds.length} pending medication reminders.`
    );
  };

  const handleTakeMedicine = (id: string, name: string, dosage: string, scheduledTime: string) => {
    markMedicationTaken(id);
    emitMedicineTaken(currentUser.uid, id, name, dosage, scheduledTime);
  };

  const handleWellbeingImOkay = () => {
    silverPulseService.resolveSeniorIsOkay();
    SpeechService.speakText("Glad to hear you are okay Eleanor! We have cleared the routine check.");
  };

  const handleWellbeingNeedHelp = () => {
    silverPulseService.resolveSeniorNeedsHelp();
    navigation.navigate('Emergency');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Date & Greeting Card */}
      <View style={styles.greetingCard}>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{currentTime}</Text>
          <TouchableOpacity onPress={handleSpeechGreeting} style={styles.audioIconBtn} accessibilityLabel="Listen to greeting">
            <Ionicons name="volume-high" size={28} color="#0F766E" />
          </TouchableOpacity>
        </View>
        <Text style={styles.dateText}>{currentDate}</Text>
        <Text style={styles.greetingText}>Welcome back, {currentUser.name} 👋</Text>
      </View>

      {/* Non-Alarming SilverPulse Status Banner */}
      <View
        style={[
          styles.pulseStatusCard,
          pulseState.routineStatus === 'NORMAL' ? styles.pulseCardNormal : styles.pulseCardDeviation,
        ]}
      >
        <View style={styles.pulseHeaderRow}>
          <Ionicons
            name={pulseState.routineStatus === 'NORMAL' ? 'checkmark-circle' : 'time'}
            size={26}
            color={pulseState.routineStatus === 'NORMAL' ? '#065F46' : '#92400E'}
          />
          <Text
            style={[
              styles.pulseStatusTitle,
              { color: pulseState.routineStatus === 'NORMAL' ? '#065F46' : '#92400E' },
            ]}
          >
            {pulseState.routineStatus === 'NORMAL' ? '🟢 Routine looks normal' : '🟡 Routine check needed'}
          </Text>
        </View>
        <Text
          style={[
            styles.pulseStatusSub,
            { color: pulseState.routineStatus === 'NORMAL' ? '#047857' : '#B45309' },
          ]}
        >
          {pulseState.routineStatus === 'NORMAL'
            ? 'SilverPulse intelligence is monitoring your daily patterns in background.'
            : pulseState.reason || 'Activity delayed outside usual window.'}
        </Text>
      </View>

      {/* Active SilverPulse Wellbeing Prompt Card (When Deviation Active) */}
      {pulseState.wellbeingCheckActive && (
        <View style={styles.wellbeingCard}>
          <View style={styles.wellbeingHeaderRow}>
            <Ionicons name="pulse" size={32} color="#D97706" />
            <Text style={styles.wellbeingTitle}>SilverPulse Wellbeing Check</Text>
          </View>
          <Text style={styles.wellbeingPrompt}>
            We haven't heard from you as usual. Are you okay?
          </Text>

          <View style={styles.wellbeingActionRow}>
            <TouchableOpacity style={styles.imOkayBtn} onPress={handleWellbeingImOkay}>
              <Ionicons name="checkmark-circle" size={26} color="#FFFFFF" />
              <Text style={styles.imOkayText}>I'M OKAY</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.needHelpBtn} onPress={handleWellbeingNeedHelp}>
              <Ionicons name="alert-circle" size={26} color="#FFFFFF" />
              <Text style={styles.needHelpText}>I NEED HELP</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Emergency SOS Entry Button */}
      <SeniorButton
        title="EMERGENCY / SOS"
        subtitle="Press for immediate help confirmation"
        icon="alert-circle"
        variant="sos"
        onPress={() => navigation.navigate('Emergency')}
        style={styles.sosButton}
      />

      {/* Voice Assistant Launcher Tile */}
      <TouchableOpacity
        style={styles.voiceAssistantCard}
        onPress={() => navigation.navigate('VoiceAssistant')}
        activeOpacity={0.85}
      >
        <View style={styles.micCircle}>
          <Ionicons name="mic-sharp" size={36} color="#FFFFFF" />
        </View>
        <View style={styles.voiceTextContainer}>
          <Text style={styles.voiceTitle}>Voice Assistant</Text>
          <Text style={styles.voiceSub}>Tap to speak: "Show my medicines" or "I need help"</Text>
        </View>
        <Ionicons name="chevron-forward" size={28} color="#0F766E" />
      </TouchableOpacity>

      {/* Today's Medications Overview Card */}
      <View style={styles.widgetCard}>
        <View style={styles.widgetHeader}>
          <Ionicons name="medical-sharp" size={30} color="#0F766E" />
          <Text style={styles.widgetTitle}>Today's Medicines</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Medicines')} style={styles.viewAllBtn}>
            <Text style={styles.viewAllText}>View All ({medications.length})</Text>
          </TouchableOpacity>
        </View>

        {pendingMeds.length > 0 ? (
          <View style={styles.nextMedRow}>
            <View style={styles.pillBadge}>
              <Ionicons name="time-outline" size={24} color="#D97706" />
            </View>
            <View style={styles.nextMedDetails}>
              <Text style={styles.nextMedName}>{pendingMeds[0].name}</Text>
              <Text style={styles.nextMedTime}>{pendingMeds[0].dosage} • {pendingMeds[0].scheduledTime}</Text>
            </View>
            <TouchableOpacity
              style={styles.takeNowBtn}
              onPress={() =>
                handleTakeMedicine(
                  pendingMeds[0].id,
                  pendingMeds[0].name,
                  pendingMeds[0].dosage,
                  pendingMeds[0].scheduledTime
                )
              }
            >
              <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
              <Text style={styles.takeNowText}>TAKEN</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.allTakenRow}>
            <Ionicons name="checkmark-circle-sharp" size={36} color="#10B981" />
            <Text style={styles.allTakenText}>All scheduled medicines taken for today!</Text>
          </View>
        )}
      </View>

      {/* Daily Check-In Status Card */}
      <View style={styles.widgetCard}>
        <View style={styles.widgetHeader}>
          <Ionicons name="happy-outline" size={30} color="#0F766E" />
          <Text style={styles.widgetTitle}>Daily Check-In</Text>
        </View>

        {todayCheckIn ? (
          <View style={styles.checkInStatusRow}>
            <Text style={styles.moodEmoji}>
              {todayCheckIn.mood === 'good' ? '😊' : todayCheckIn.mood === 'okay' ? '😐' : '😟'}
            </Text>
            <View style={styles.checkInTextCol}>
              <Text style={styles.checkInStatusText}>
                {todayCheckIn.mood === 'good' ? 'Feeling Good ✓' : todayCheckIn.mood === 'okay' ? 'Feeling Okay ✓' : 'Not Feeling Well ⚠'}
              </Text>
              <Text style={styles.checkInTimeText}>Logged at {new Date(todayCheckIn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </View>
            <TouchableOpacity style={styles.recheckBtn} onPress={() => navigation.navigate('DailyCheckIn')}>
              <Text style={styles.recheckBtnText}>Update</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.pendingCheckInGroup}>
            <Text style={styles.pendingCheckInPrompt}>Today's check-in pending 🟡</Text>
            <SeniorButton
              title="Record Check-In"
              icon="heart"
              variant="primary"
              onPress={() => navigation.navigate('DailyCheckIn')}
            />
          </View>
        )}
      </View>

      {/* Caregiver Contact Shortcut Card */}
      {primaryContact && (
        <View style={styles.widgetCard}>
          <View style={styles.widgetHeader}>
            <Ionicons name="people-sharp" size={30} color="#0F766E" />
            <Text style={styles.widgetTitle}>Primary Caregiver</Text>
          </View>
          <View style={styles.contactRow}>
            <Image source={{ uri: primaryContact.photoUrl }} style={styles.contactAvatar} />
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{primaryContact.name}</Text>
              <Text style={styles.contactRelation}>{primaryContact.relationship}</Text>
            </View>
            <TouchableOpacity
              style={styles.callCircleBtn}
              onPress={() => {
                SpeechService.speakText(`Calling ${primaryContact.name}`);
                navigation.navigate('FamilyContacts');
              }}
              accessibilityLabel={`Call ${primaryContact.name}`}
            >
              <Ionicons name="call" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.allContactsShortcutBtn}
            onPress={() => navigation.navigate('FamilyContacts')}
          >
            <Ionicons name="people-outline" size={20} color="#0F766E" />
            <Text style={styles.allContactsShortcutText}>
              View All Family & Doctors ({contacts.length}) →
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* SilverPulse Dev/Demo Bench Launcher */}
      <TouchableOpacity
        style={styles.silverPulseDevCard}
        onPress={() => navigation.navigate('SilverPulseDemo')}
      >
        <Ionicons name="construct" size={24} color="#D97706" style={{ marginRight: 8 }} />
        <Text style={styles.silverPulseDevText}>🛠️ Open SilverPulse Test Bench (Demo)</Text>
      </TouchableOpacity>
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
  greetingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.large,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 6,
    borderLeftColor: theme.colors.seniorPrimary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  audioIconBtn: {
    padding: 8,
    backgroundColor: '#CCFBF1',
    borderRadius: 20,
  },
  dateText: {
    fontSize: 18,
    color: '#475569',
    fontWeight: '600',
    marginTop: 4,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F766E',
    marginTop: 12,
  },
  pulseStatusCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1.5,
  },
  pulseCardNormal: {
    backgroundColor: '#D1FAE5',
    borderColor: '#10B981',
  },
  pulseCardDeviation: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  pulseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pulseStatusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pulseStatusSub: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
  wellbeingCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  wellbeingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  wellbeingTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#92400E',
    marginLeft: 8,
  },
  wellbeingPrompt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#78350F',
    marginVertical: 4,
  },
  wellbeingActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  imOkayBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  imOkayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  needHelpBtn: {
    flex: 1,
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  needHelpText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sosButton: {
    marginVertical: 8,
  },
  voiceAssistantCard: {
    backgroundColor: '#CCFBF1',
    borderRadius: theme.borderRadius.medium,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 2,
    borderColor: '#0F766E',
  },
  micCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  voiceTextContainer: {
    flex: 1,
  },
  voiceTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F766E',
  },
  voiceSub: {
    fontSize: 14,
    color: '#115E59',
    marginTop: 2,
    fontWeight: '500',
  },
  widgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 18,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  widgetTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginLeft: 10,
    flex: 1,
  },
  viewAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllText: {
    color: '#0F766E',
    fontWeight: '700',
    fontSize: 16,
  },
  nextMedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    padding: 12,
  },
  pillBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  nextMedDetails: {
    flex: 1,
  },
  nextMedName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#78350F',
  },
  nextMedTime: {
    fontSize: 15,
    color: '#92400E',
    marginTop: 2,
    fontWeight: '600',
  },
  takeNowBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  takeNowText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  allTakenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  allTakenText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#065F46',
    flex: 1,
  },
  checkInStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
  },
  moodEmoji: {
    fontSize: 40,
    marginRight: 12,
  },
  checkInTextCol: {
    flex: 1,
  },
  checkInStatusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  checkInTimeText: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  recheckBtn: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  recheckBtnText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 14,
  },
  pendingCheckInGroup: {
    marginTop: 4,
  },
  pendingCheckInPrompt: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 14,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  contactRelation: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 2,
  },
  callCircleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  allContactsShortcutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#CCFBF1',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  allContactsShortcutText: {
    color: '#0F766E',
    fontWeight: 'bold',
    fontSize: 16,
  },
  silverPulseDevCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 14,
    borderRadius: 14,
    marginVertical: 14,
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  silverPulseDevText: {
    color: '#92400E',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
