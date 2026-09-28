import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { SpeechService } from '../../services/speechService';
import { VoiceCommandService, ProcessedVoiceCommand } from '../../features/voice/voiceCommands';
import { theme } from '../../theme/theme';

export type VoiceState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SUCCESS' | 'ERROR';

export const VoiceAssistantScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { triggerSos, triggerReminderModal, medications, currentUser } = useApp();

  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [assistantReply, setAssistantReply] = useState<string>('How can I help you today, Eleanor?');
  const [lastProcessed, setLastProcessed] = useState<ProcessedVoiceCommand | null>(null);

  const [typedInput, setTypedInput] = useState<string>('');
  const [isWebSpeechAvailable, setIsWebSpeechAvailable] = useState<boolean>(false);

  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    setIsWebSpeechAvailable(SpeechService.isSpeechSupported());
  }, []);

  useEffect(() => {
    if (voiceState === 'LISTENING') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 550, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 550, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [voiceState]);

  const processTextCommand = (rawText: string) => {
    setVoiceState('PROCESSING');
    setTranscribedText(`"${rawText}"`);

    setTimeout(() => {
      const result = VoiceCommandService.process(rawText, currentUser.uid);
      setLastProcessed(result);
      setAssistantReply(result.assistantReply);

      // Speech synthesis output
      SpeechService.speakText(result.assistantReply);

      if (result.intent === 'UNKNOWN') {
        setVoiceState('ERROR');
      } else {
        setVoiceState('SUCCESS');
      }

      // Handle navigation actions safely
      if (result.navigationTarget === 'Medicines') {
        if (result.intent === 'MEDICINE_REMINDER') {
          const med = medications[0];
          if (med) triggerReminderModal(med);
        }
        setTimeout(() => navigation.navigate('Medicines'), 2000);
      } else if (result.navigationTarget === 'Emergency') {
        setTimeout(() => navigation.navigate('Emergency'), 1800);
      } else if (result.navigationTarget === 'SeniorHome') {
        setTimeout(() => navigation.navigate('SeniorHome'), 2000);
      } else if (result.navigationTarget === 'DailyCheckIn') {
        setTimeout(() => navigation.navigate('DailyCheckIn'), 2000);
      } else if (result.navigationTarget === 'FamilyContacts') {
        setTimeout(() => navigation.navigate('FamilyContacts'), 2000);
      } else if (result.contactToCall) {
        setTimeout(() => {
          SpeechService.speakText(`Calling ${result.contactToCall?.name}`);
          navigation.navigate('FamilyContacts');
        }, 1500);
      }
    }, 600);
  };

  const handleStartListening = () => {
    setVoiceState('LISTENING');
    setTranscribedText('I\'m listening... Speak into your microphone');

    // Web Speech API check
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      try {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const spoken = event.results[0][0].transcript;
          processTextCommand(spoken);
        };

        recognition.onerror = () => {
          setVoiceState('ERROR');
          setAssistantReply("Speech recognition encountered an issue. Try tapping a suggested command below or typing.");
          SpeechService.speakText("I didn't catch that. Please try again.");
        };

        recognition.onend = () => {
          if (voiceState === 'LISTENING') setVoiceState('IDLE');
        };

        recognition.start();
        return;
      } catch (e) {
        console.warn('Speech recognition error:', e);
      }
    }

    // Fallback simulation when Web Speech API is absent
    setTimeout(() => {
      processTextCommand("Show my medicines");
    }, 2200);
  };

  const handleTypedSubmit = () => {
    if (!typedInput.trim()) return;
    const input = typedInput.trim();
    setTypedInput('');
    processTextCommand(input);
  };

  const getStatusText = () => {
    switch (voiceState) {
      case 'LISTENING':
        return '🎙️ I\'m listening...';
      case 'PROCESSING':
        return '⏳ Let me check...';
      case 'SUCCESS':
        return '✅ Action recognized!';
      case 'ERROR':
        return '⚠️ I didn\'t understand. Please try again.';
      case 'IDLE':
      default:
        return 'Tap the microphone to speak';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#0F766E" />
        <Text style={styles.backBtnText}>Back to Home</Text>
      </TouchableOpacity>

      {/* Main Microphone Card */}
      <View style={styles.micCard}>
        <Text style={styles.mainTitle}>How can I help you?</Text>
        <Text style={styles.subTitle}>
          {isWebSpeechAvailable
            ? 'Web Speech API active — speak naturally'
            : 'Speech Fallback Active — tap mic or pick a command'}
        </Text>

        {/* Large Central Microphone Button */}
        <View style={styles.micCircleContainer}>
          <Animated.View
            style={[
              styles.pulseRing,
              { transform: [{ scale: pulseAnim }] },
              voiceState === 'LISTENING' && styles.pulseRingActive,
            ]}
          />
          <TouchableOpacity
            style={[
              styles.mainMicBtn,
              voiceState === 'LISTENING' && styles.mainMicBtnListening,
              voiceState === 'SUCCESS' && styles.mainMicBtnSuccess,
            ]}
            onPress={handleStartListening}
            activeOpacity={0.8}
            accessibilityLabel="Tap to speak into microphone"
          >
            <Ionicons
              name={voiceState === 'LISTENING' ? 'mic' : voiceState === 'SUCCESS' ? 'checkmark' : 'mic-outline'}
              size={56}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.statusLabel}>{getStatusText()}</Text>
      </View>

      {/* Speech Transcript & Assistant Reply Box */}
      <View style={styles.responseBox}>
        {transcribedText ? (
          <View style={styles.userSpeechRow}>
            <Ionicons name="person-circle" size={32} color="#0F766E" />
            <View style={styles.userBubble}>
              <Text style={styles.userText}>{transcribedText}</Text>
            </View>
          </View>
        ) : null}

        <View style={styles.assistantSpeechRow}>
          <View style={styles.sparkleBadge}>
            <Ionicons name="sparkles" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.assistantBubble}>
            <Text style={styles.assistantText}>{assistantReply}</Text>
            {lastProcessed && lastProcessed.actionSummary ? (
              <View style={styles.actionChip}>
                <Ionicons name="checkmark-done" size={16} color="#065F46" />
                <Text style={styles.actionChipText}>{lastProcessed.actionSummary}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      {/* Suggested Example Commands */}
      <View style={styles.examplesSection}>
        <Text style={styles.examplesHeading}>Try saying...</Text>

        <TouchableOpacity
          style={styles.exampleCard}
          onPress={() => processTextCommand('Show my medicines')}
          activeOpacity={0.8}
        >
          <Ionicons name="medical" size={26} color="#0F766E" />
          <Text style={styles.exampleText}>"Show my medicines"</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.exampleCard}
          onPress={() => processTextCommand('What do I need to do today?')}
          activeOpacity={0.8}
        >
          <Ionicons name="calendar" size={26} color="#0F766E" />
          <Text style={styles.exampleText}>"What do I need to do today?"</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.exampleCard}
          onPress={() => processTextCommand('Remind me to take my medicine at 8 PM')}
          activeOpacity={0.8}
        >
          <Ionicons name="alarm" size={26} color="#0F766E" />
          <Text style={styles.exampleText}>"Remind me to take my medicine at 8 PM"</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.exampleCard}
          onPress={() => processTextCommand('Call my daughter')}
          activeOpacity={0.8}
        >
          <Ionicons name="call" size={26} color="#0F766E" />
          <Text style={styles.exampleText}>"Call my daughter"</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.exampleCard, styles.exampleCardSos]}
          onPress={() => processTextCommand('I need help')}
          activeOpacity={0.8}
        >
          <Ionicons name="alert-circle" size={26} color="#DC2626" />
          <Text style={[styles.exampleText, { color: '#991B1B' }]}>"I need help"</Text>
        </TouchableOpacity>
      </View>

      {/* Text Input Fallback Mode */}
      <View style={styles.fallbackCard}>
        <Text style={styles.fallbackHeading}>Text Fallback (Type a Command):</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder='Type e.g., "Show my medicines"'
            placeholderTextColor="#94A3B8"
            value={typedInput}
            onChangeText={setTypedInput}
            onSubmitEditing={handleTypedSubmit}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={handleTypedSubmit}>
            <Ionicons name="send" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
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
  micCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.large,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  subTitle: {
    fontSize: 15,
    color: '#475569',
    marginTop: 4,
    textAlign: 'center',
  },
  micCircleContainer: {
    marginVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#CCFBF1',
  },
  pulseRingActive: {
    backgroundColor: '#FCA5A5',
  },
  mainMicBtn: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  mainMicBtnListening: {
    backgroundColor: '#DC2626',
  },
  mainMicBtnSuccess: {
    backgroundColor: '#10B981',
  },
  statusLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F766E',
  },
  responseBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 18,
    gap: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  userSpeechRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  userBubble: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 14,
  },
  userText: {
    fontSize: 18,
    color: '#1E293B',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  assistantSpeechRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  sparkleBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  assistantBubble: {
    flex: 1,
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  assistantText: {
    fontSize: 19,
    color: '#0F766E',
    fontWeight: 'bold',
    lineHeight: 26,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 10,
    gap: 6,
  },
  actionChipText: {
    color: '#065F46',
    fontWeight: 'bold',
    fontSize: 15,
  },
  examplesSection: {
    gap: 10,
    marginBottom: 16,
  },
  examplesHeading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  exampleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  exampleCardSos: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  exampleText: {
    fontSize: 19,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },
  fallbackCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  fallbackHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
    color: '#0F172A',
  },
  sendBtn: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
