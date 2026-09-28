import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { SpeechService } from '../../services/speechService';
import { theme } from '../../theme/theme';

export const SosModal: React.FC = () => {
  const { isSosActive, cancelSos, currentUser } = useApp();
  const [countdown, setCountdown] = useState<number>(3);
  const [isAlertSent, setIsAlertSent] = useState<boolean>(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSosActive && !isAlertSent) {
      if (countdown > 0) {
        timer = setTimeout(() => {
          setCountdown(prev => prev - 1);
        }, 1000);
      } else {
        setIsAlertSent(true);
        SpeechService.speakText("Emergency SOS sent to your family caregiver Sarah. Preparing to connect assistance.");
      }
    }
    return () => clearTimeout(timer);
  }, [isSosActive, countdown, isAlertSent]);

  useEffect(() => {
    if (isSosActive) {
      setCountdown(3);
      setIsAlertSent(false);

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isSosActive]);

  if (!isSosActive) return null;

  return (
    <Modal visible={isSosActive} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {!isAlertSent ? (
            <>
              <View style={styles.warningHeader}>
                <Ionicons name="warning-sharp" size={48} color="#DC2626" />
                <Text style={styles.warningTitle}>EMERGENCY ALERT</Text>
              </View>

              <Animated.View style={[styles.countdownCircle, { transform: [{ scale: pulseAnim }] }]}>
                <Text style={styles.countdownText}>{countdown}</Text>
              </Animated.View>

              <Text style={styles.instructionText}>
                Sending Emergency SOS to Sarah Vance in {countdown} seconds...
              </Text>

              <TouchableOpacity style={styles.cancelButton} onPress={cancelSos}>
                <Ionicons name="close-circle" size={32} color="#FFFFFF" />
                <Text style={styles.cancelButtonText}>CANCEL ALERT</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.sentHeader}>
                <Ionicons name="checkmark-circle" size={64} color="#10B981" />
                <Text style={styles.sentTitle}>SOS ALERT DISPATCHED!</Text>
                <Text style={styles.sentSub}>
                  Your family caregiver Sarah Vance has been notified with your current live status.
                </Text>
              </View>

              <View style={styles.quickCallGroup}>
                <TouchableOpacity
                  style={[styles.callBtn, { backgroundColor: '#2563EB' }]}
                  onPress={() => {
                    SpeechService.speakText("Dialing Sarah Vance.");
                    alert("Simulated Phone Call: Dialing Sarah Vance ((555) 234-5678)...");
                  }}
                >
                  <Ionicons name="call" size={28} color="#FFFFFF" />
                  <Text style={styles.callBtnText}>Call Caregiver (Sarah)</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.callBtn, { backgroundColor: '#DC2626' }]}
                  onPress={() => {
                    SpeechService.speakText("Dialing 911 Emergency.");
                    alert("Simulated Emergency Call: Dialing 911...");
                  }}
                >
                  <Ionicons name="alert-circle" size={28} color="#FFFFFF" />
                  <Text style={styles.callBtnText}>Call 911 Emergency</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.closeBtn} onPress={cancelSos}>
                <Text style={styles.closeBtnText}>I am safe now (Close)</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.large,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  warningHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#DC2626',
    marginTop: 8,
  },
  countdownCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FEE2E2',
    borderWidth: 6,
    borderColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  countdownText: {
    fontSize: 54,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  instructionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    textAlign: 'center',
    marginVertical: 12,
  },
  cancelButton: {
    width: '100%',
    height: 64,
    backgroundColor: '#334155',
    borderRadius: theme.borderRadius.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
  },
  cancelButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sentHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  sentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F766E',
    marginTop: 10,
    textAlign: 'center',
  },
  sentSub: {
    fontSize: 17,
    color: '#475569',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 24,
  },
  quickCallGroup: {
    width: '100%',
    gap: 12,
    marginVertical: 16,
  },
  callBtn: {
    width: '100%',
    height: 60,
    borderRadius: theme.borderRadius.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  callBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeBtn: {
    marginTop: 8,
    paddingVertical: 12,
  },
  closeBtnText: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
