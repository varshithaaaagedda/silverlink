import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medication, DailyCheckIn, CaregiverAlert, FamilyContact, UserProfile, SeniorStatus } from '../types';

const STORAGE_KEYS = {
  MEDICATIONS: '@silverlink_medications_v1',
  CHECK_INS: '@silverlink_checkins_v1',
  ALERTS: '@silverlink_alerts_v1',
  CONTACTS: '@silverlink_contacts_v1',
  USER_PROFILE: '@silverlink_user_profile_v1',
  STATUS: '@silverlink_status_v1',
  CAREGIVER_SETTINGS: '@silverlink_caregiver_settings_v1',
};

export interface CaregiverSettings {
  pushNotifs: boolean;
  sosCallout: boolean;
  missedDoseTimeout: string;
  emergencyPhone?: string;
  doctorPhone?: string;
}

export const INITIAL_CAREGIVER_SETTINGS: CaregiverSettings = {
  pushNotifs: true,
  sosCallout: true,
  missedDoseTimeout: '30 mins',
  emergencyPhone: '(555) 234-5678',
  doctorPhone: '(555) 987-6543',
};

// Initial Sample Data for Hackathon Demo
export const INITIAL_USER_SENIOR: UserProfile = {
  uid: 'senior_eleanor_1',
  name: 'Eleanor Vance',
  email: 'eleanor@silverlink.org',
  role: 'senior',
  phone: '(555) 123-4567',
  photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  caregiverPhone: '(555) 234-5678',
};

export const INITIAL_USER_CAREGIVER: UserProfile = {
  uid: 'caregiver_sarah_1',
  name: 'Sarah Vance',
  email: 'sarah@silverlink.org',
  role: 'caregiver',
  phone: '(555) 234-5678',
  photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  seniorUid: 'senior_eleanor_1',
};

export const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: 'med_1',
    seniorUid: 'senior_eleanor_1',
    name: 'Morning Medicine (Lisinopril)',
    dosage: '10mg - 1 Tablet',
    scheduledTime: '08:00 AM',
    timeOfDay: 'Morning',
    frequency: 'Daily',
    instructions: 'Take after breakfast with 1 full glass of water.',
    status: 'taken',
    lastTakenTime: '08:12 AM Today',
    pillColor: '#3B82F6',
    icon: 'pill',
  },
  {
    id: 'med_2',
    seniorUid: 'senior_eleanor_1',
    name: 'Afternoon Medicine (Metformin)',
    dosage: '500mg - 1 Tablet',
    scheduledTime: '01:00 PM',
    timeOfDay: 'Afternoon',
    frequency: 'Daily',
    instructions: 'Take with lunch. Do not crush or chew tablet.',
    status: 'due',
    pillColor: '#0284C7',
    icon: 'pill',
  },
  {
    id: 'med_3',
    seniorUid: 'senior_eleanor_1',
    name: 'Evening Medicine (Calcium + D3)',
    dosage: '600mg - 1 Tablet',
    scheduledTime: '08:00 PM',
    timeOfDay: 'Evening',
    frequency: 'Daily',
    instructions: 'Take with evening meal to support bone health.',
    status: 'upcoming',
    pillColor: '#F59E0B',
    icon: 'capsule',
  },
  {
    id: 'med_4',
    seniorUid: 'senior_eleanor_1',
    name: 'Nightly Eye Drops (Latanoprost)',
    dosage: '1 Drop per eye',
    scheduledTime: '09:30 PM',
    timeOfDay: 'Night',
    frequency: 'Nightly',
    instructions: 'Instill 1 drop in each eye before sleeping.',
    status: 'upcoming',
    pillColor: '#8B5CF6',
    icon: 'droplet',
  },
];

export const INITIAL_CHECK_INS: DailyCheckIn[] = [
  {
    id: 'checkin_today',
    seniorUid: 'senior_eleanor_1',
    timestamp: new Date().toISOString(),
    dateString: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    mood: 'good',
    note: 'Slept well! Had tea in the garden and feel energetic today.',
    symptoms: ['Feeling Great', 'Slept Well'],
  },
  {
    id: 'checkin_yesterday',
    seniorUid: 'senior_eleanor_1',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    dateString: 'Yesterday',
    mood: 'good',
    note: 'Good day overall. Walked 15 minutes.',
  },
  {
    id: 'checkin_2days',
    seniorUid: 'senior_eleanor_1',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    dateString: '2 Days Ago',
    mood: 'okay',
    note: 'Slight knee stiffness in afternoon.',
    symptoms: ['Knee Stiffness'],
  },
];

export const INITIAL_CONTACTS: FamilyContact[] = [
  {
    id: 'contact_1',
    name: 'Sarah Vance',
    relationship: 'Daughter (Primary)',
    phone: '(555) 234-5678',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    isPrimary: true,
    canVideoCall: true,
  },
  {
    id: 'contact_2',
    name: 'Dr. Robert Chen',
    relationship: 'Primary Physician',
    phone: '(555) 987-6543',
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    isPrimary: false,
  },
  {
    id: 'contact_3',
    name: 'Mark Vance',
    relationship: 'Son',
    phone: '(555) 345-6789',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    isPrimary: false,
    canVideoCall: true,
  },
  {
    id: 'contact_4',
    name: 'Emergency Dispatch',
    relationship: '911 Emergency Service',
    phone: '911',
    photoUrl: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=400&q=80',
    isPrimary: false,
  }
];

export const INITIAL_ALERTS: CaregiverAlert[] = [
  {
    id: 'alert_demo_1',
    seniorUid: 'senior_eleanor_1',
    type: 'missed_medicine',
    severity: 'medium',
    title: 'Unconfirmed Evening Medication',
    message: 'Calcium + Vitamin D3 was scheduled for 8:00 PM and remains pending.',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    acknowledged: false,
  }
];

export const INITIAL_SENIOR_STATUS: SeniorStatus = {
  lastActiveTime: 'Just now',
  isSafeAtHome: true,
  batteryLevel: 88,
  locationName: 'Home - Oakridge Residence',
};

// Storage Service Wrapper
export class DataService {
  static async getMedications(): Promise<Medication[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.MEDICATIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    await AsyncStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(INITIAL_MEDICATIONS));
    return INITIAL_MEDICATIONS;
  }

  static async saveMedications(meds: Medication[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(meds));
  }

  static async updateMedicationStatus(
    id: string,
    status: 'taken' | 'skipped' | 'missed' | 'due' | 'upcoming' | 'pending'
  ): Promise<Medication[]> {
    const meds = await this.getMedications();
    const updated = meds.map((m) => {
      if (m.id === id) {
        return {
          ...m,
          status,
          lastTakenTime:
            status === 'taken'
              ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today'
              : m.lastTakenTime,
        };
      }
      return m;
    });
    await this.saveMedications(updated);
    return updated;
  }

  static async addMedication(newMed: Omit<Medication, 'id' | 'seniorUid' | 'status'>): Promise<Medication[]> {
    const meds = await this.getMedications();
    const created: Medication = {
      ...newMed,
      id: 'med_' + Date.now(),
      seniorUid: 'senior_eleanor_1',
      status: 'pending',
    };
    const updated = [created, ...meds];
    await this.saveMedications(updated);
    return updated;
  }

  static async getCheckIns(): Promise<DailyCheckIn[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CHECK_INS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    await AsyncStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(INITIAL_CHECK_INS));
    return INITIAL_CHECK_INS;
  }

  static async addCheckIn(checkIn: Omit<DailyCheckIn, 'id' | 'seniorUid' | 'timestamp' | 'dateString'>): Promise<DailyCheckIn[]> {
    const checkIns = await this.getCheckIns();
    const now = new Date();
    const created: DailyCheckIn = {
      ...checkIn,
      id: 'checkin_' + Date.now(),
      seniorUid: 'senior_eleanor_1',
      timestamp: now.toISOString(),
      dateString: now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
    };
    // Replace today's checkin if exists or add top
    const filtered = checkIns.filter(c => c.dateString !== created.dateString);
    const updated = [created, ...filtered];
    await AsyncStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(updated));
    return updated;
  }

  static async getAlerts(): Promise<CaregiverAlert[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ALERTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    await AsyncStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(INITIAL_ALERTS));
    return INITIAL_ALERTS;
  }

  static async addAlert(alert: Omit<CaregiverAlert, 'id' | 'seniorUid' | 'timestamp' | 'acknowledged'>): Promise<CaregiverAlert[]> {
    const alerts = await this.getAlerts();
    const created: CaregiverAlert = {
      ...alert,
      id: 'alert_' + Date.now(),
      seniorUid: 'senior_eleanor_1',
      timestamp: new Date().toISOString(),
      acknowledged: false,
    };
    const updated = [created, ...alerts];
    await AsyncStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(updated));
    return updated;
  }

  static async acknowledgeAlert(id: string): Promise<CaregiverAlert[]> {
    const alerts = await this.getAlerts();
    const updated = alerts.map(a => {
      if (a.id === id) {
        return { ...a, acknowledged: true, acknowledgedAt: new Date().toISOString() };
      }
      return a;
    });
    await AsyncStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(updated));
    return updated;
  }

  static async getContacts(): Promise<FamilyContact[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CONTACTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    await AsyncStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(INITIAL_CONTACTS));
    return INITIAL_CONTACTS;
  }

  static async getSeniorStatus(): Promise<SeniorStatus> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.STATUS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read error:', e);
    }
    await AsyncStorage.setItem(STORAGE_KEYS.STATUS, JSON.stringify(INITIAL_SENIOR_STATUS));
    return INITIAL_SENIOR_STATUS;
  }

  static async updateMedication(med: Medication): Promise<Medication[]> {
    const meds = await this.getMedications();
    const updated = meds.map(m => (m.id === med.id ? { ...m, ...med } : m));
    await this.saveMedications(updated);
    return updated;
  }

  static async deleteMedication(id: string): Promise<Medication[]> {
    const meds = await this.getMedications();
    const updated = meds.filter(m => m.id !== id);
    await this.saveMedications(updated);
    return updated;
  }

  static async clearAcknowledgedAlerts(): Promise<CaregiverAlert[]> {
    const alerts = await this.getAlerts();
    const updated = alerts.filter(a => !a.acknowledged);
    await AsyncStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(updated));
    return updated;
  }

  static async saveSeniorStatus(statusUpdate: Partial<SeniorStatus>): Promise<SeniorStatus> {
    const current = await this.getSeniorStatus();
    const updated: SeniorStatus = { ...current, ...statusUpdate };
    await AsyncStorage.setItem(STORAGE_KEYS.STATUS, JSON.stringify(updated));
    return updated;
  }

  static async getCaregiverSettings(): Promise<CaregiverSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CAREGIVER_SETTINGS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Storage read error for settings:', e);
    }
    await AsyncStorage.setItem(STORAGE_KEYS.CAREGIVER_SETTINGS, JSON.stringify(INITIAL_CAREGIVER_SETTINGS));
    return INITIAL_CAREGIVER_SETTINGS;
  }

  static async saveCaregiverSettings(settings: CaregiverSettings): Promise<CaregiverSettings> {
    await AsyncStorage.setItem(STORAGE_KEYS.CAREGIVER_SETTINGS, JSON.stringify(settings));
    return settings;
  }
}
