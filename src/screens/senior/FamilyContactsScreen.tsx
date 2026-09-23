import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';
import { SpeechService } from '../../services/speechService';
import { FamilyContact } from '../../types';
import { theme } from '../../theme/theme';

export const FamilyContactsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { contacts } = useApp();

  const handleCall = (contact: FamilyContact) => {
    SpeechService.speakText(`Calling ${contact.name}`);
    if (Platform.OS === 'web') {
      window.alert(`Simulating Phone Call: Dialing ${contact.name} (${contact.phone})...`);
    } else {
      Linking.openURL(`tel:${contact.phone.replace(/[^0-9]/g, '')}`).catch(() => {
        Alert.alert('Calling Contact', `Dialing ${contact.name} (${contact.phone})...`);
      });
    }
  };

  const handleVideoCall = (contact: FamilyContact) => {
    SpeechService.speakText(`Starting video call with ${contact.name}`);
    if (Platform.OS === 'web') {
      window.alert(`Simulating HD Video Call: Connecting with ${contact.name}...`);
    } else {
      Alert.alert('Video Call', `Connecting video call with ${contact.name}...`);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#0F766E" />
        <Text style={styles.backBtnText}>Back to Home</Text>
      </TouchableOpacity>

      <View style={styles.headerTitleRow}>
        <Text style={styles.headerTitle}>Family & Contacts</Text>
        <TouchableOpacity
          style={styles.speechBtn}
          onPress={() => SpeechService.speakText("Tap any card below to call your family members or doctor.")}
        >
          <Ionicons name="volume-high" size={26} color="#0F766E" />
        </TouchableOpacity>
      </View>

      {contacts.map(contact => (
        <View key={contact.id} style={styles.contactCard}>
          <View style={styles.topInfoRow}>
            <Image source={{ uri: contact.photoUrl }} style={styles.avatar} />
            <View style={styles.textCol}>
              <View style={styles.nameRow}>
                <Text style={styles.contactName}>{contact.name}</Text>
                {contact.isPrimary && (
                  <View style={styles.primaryTag}>
                    <Text style={styles.primaryTagText}>Primary Caregiver</Text>
                  </View>
                )}
              </View>
              <Text style={styles.relationText}>{contact.relationship}</Text>
              <Text style={styles.phoneText}>{contact.phone}</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.callBtn} onPress={() => handleCall(contact)}>
              <Ionicons name="call" size={24} color="#FFFFFF" />
              <Text style={styles.callBtnText}>Call Phone</Text>
            </TouchableOpacity>

            {contact.canVideoCall ? (
              <TouchableOpacity style={styles.videoBtn} onPress={() => handleVideoCall(contact)}>
                <Ionicons name="videocam" size={24} color="#FFFFFF" />
                <Text style={styles.videoBtnText}>Video Call</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ))}
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: theme.typography.seniorHeader.fontSize,
    fontWeight: theme.typography.seniorHeader.fontWeight,
    color: '#0F172A',
  },
  speechBtn: {
    padding: 10,
    backgroundColor: '#CCFBF1',
    borderRadius: 20,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.medium,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  topInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    marginRight: 16,
  },
  textCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  contactName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  primaryTag: {
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  primaryTagText: {
    color: '#0F766E',
    fontSize: 12,
    fontWeight: 'bold',
  },
  relationText: {
    fontSize: 18,
    color: '#475569',
    fontWeight: '600',
    marginTop: 2,
  },
  phoneText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  callBtn: {
    flex: 1,
    height: 56,
    borderRadius: theme.borderRadius.small,
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  callBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  videoBtn: {
    flex: 1,
    height: 56,
    borderRadius: theme.borderRadius.small,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  videoBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
