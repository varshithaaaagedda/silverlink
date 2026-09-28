import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, Medication, DailyCheckIn, CaregiverAlert, FamilyContact, SeniorStatus } from '../types';
import {
  DataService,
  INITIAL_USER_SENIOR,
  INITIAL_USER_CAREGIVER,
  CaregiverSettings,
  INITIAL_CAREGIVER_SETTINGS,
} from '../services/dataService';
import { emitCheckInCompleted } from '../features/checkin/checkinEvents';
import { seniorEventService } from '../services/senior/eventService';
import { SeniorEvent } from '../types/events';

interface AppContextType {
  currentUser: UserProfile;
  role: UserRole;
  switchRole: (newRole: UserRole) => void;
  medications: Medication[];
  checkIns: DailyCheckIn[];
  alerts: CaregiverAlert[];
  contacts: FamilyContact[];
  seniorStatus: SeniorStatus;
  caregiverSettings: CaregiverSettings;
  updateCaregiverSettings: (settings: Partial<CaregiverSettings>) => Promise<void>;
  updateSeniorStatus: (status: Partial<SeniorStatus>) => Promise<void>;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  highContrast: boolean;
  setHighContrast: (contrast: boolean) => void;
  isSosActive: boolean;
  triggerSos: (message?: string) => void;
  cancelSos: () => void;
  markMedicationTaken: (id: string) => Promise<void>;
  markMedicationSkipped: (id: string, reason?: string) => Promise<void>;
  markMedicationMissed: (id: string) => Promise<void>;
  markMedicationPending: (id: string) => Promise<void>;
  markMedicationStatus: (id: string, status: any) => Promise<void>;
  addMedication: (med: Omit<Medication, 'id' | 'seniorUid' | 'status'>) => Promise<void>;
  updateMedication: (med: Medication) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  activeReminderMed: Medication | null;
  triggerReminderModal: (med: Medication) => void;
  closeReminderModal: () => void;
  submitCheckIn: (mood: 'good' | 'okay' | 'bad', note?: string, symptoms?: string[]) => Promise<void>;
  acknowledgeAlert: (id: string) => Promise<void>;
  clearAcknowledgedAlerts: () => Promise<void>;
  refreshData: () => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('senior');
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER_SENIOR);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);
  const [alerts, setAlerts] = useState<CaregiverAlert[]>([]);
  const [contacts, setContacts] = useState<FamilyContact[]>([]);
  const [seniorStatus, setSeniorStatus] = useState<SeniorStatus>({
    lastActiveTime: 'Just now',
    isSafeAtHome: true,
    batteryLevel: 88,
    locationName: 'Home - Oakridge Residence',
  });

  const [caregiverSettings, setCaregiverSettings] = useState<CaregiverSettings>(INITIAL_CAREGIVER_SETTINGS);

  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [isSosActive, setIsSosActive] = useState<boolean>(false);
  const [activeReminderMed, setActiveReminderMed] = useState<Medication | null>(null);

  const loadData = async () => {
    const medsData = await DataService.getMedications();
    const checkInsData = await DataService.getCheckIns();
    const alertsData = await DataService.getAlerts();
    const contactsData = await DataService.getContacts();
    const statusData = await DataService.getSeniorStatus();
    const settingsData = await DataService.getCaregiverSettings();

    setMedications(medsData);
    setCheckIns(checkInsData);
    setAlerts(alertsData);
    setContacts(contactsData);
    setSeniorStatus(statusData);
    setCaregiverSettings(settingsData);
  };

  useEffect(() => {
    loadData();

    // Subscribe to seniorEventService for real-time Caregiver & UI reactive synchronization
    const unsubscribe = seniorEventService.subscribe(async (event: SeniorEvent) => {
      setSeniorStatus(prev => ({ ...prev, lastActiveTime: 'Just now' }));
      DataService.saveSeniorStatus({ lastActiveTime: 'Just now' }).catch(() => {});

      switch (event.eventType) {
        case 'SOS_TRIGGERED': {
          setIsSosActive(true);
          const alertUpdated = await DataService.addAlert({
            type: 'sos',
            severity: 'critical',
            title: '🚨 EMERGENCY SOS TRIGGERED!',
            message:
              event.payload.customMessage ||
              'Senior pressed Emergency SOS! Immediate family caregiver attention required.',
          });
          setAlerts(alertUpdated);
          break;
        }
        case 'ROUTINE_DEVIATION': {
          const alertUpdated = await DataService.addAlert({
            type: 'missed_medicine',
            severity: event.payload.severity === 'HIGH' ? 'critical' : 'medium',
            title: 'Routine Deviation Detected',
            message:
              event.payload.reason ||
              "Activity delayed outside Eleanor's usual morning routine window.",
          });
          setAlerts(alertUpdated);
          break;
        }
        case 'WELLBEING_HELP_REQUESTED': {
          setIsSosActive(true);
          const alertUpdated = await DataService.addAlert({
            type: 'sos',
            severity: 'critical',
            title: '🚨 Senior Requested Immediate Help',
            message: 'Senior selected "I NEED HELP" during SilverPulse routine check.',
          });
          setAlerts(alertUpdated);
          break;
        }
        case 'MEDICINE_TAKEN': {
          setMedications(prev =>
            prev.map(m =>
              m.id === event.payload.medicineId
                ? {
                    ...m,
                    status: 'taken',
                    lastTakenTime:
                      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) +
                      ' Today',
                  }
                : m
            )
          );
          break;
        }
        case 'MEDICINE_SKIPPED': {
          setMedications(prev =>
            prev.map(m =>
              m.id === event.payload.medicineId ? { ...m, status: 'skipped' } : m
            )
          );
          const alertUpdated = await DataService.addAlert({
            type: 'missed_medicine',
            severity: 'medium',
            title: `Medication Skipped: ${event.payload.medicineName}`,
            message: `${event.payload.medicineName} was marked skipped (${event.payload.reason || 'Senior chose to skip'}).`,
          });
          setAlerts(alertUpdated);
          break;
        }
        case 'MEDICINE_MISSED': {
          setMedications(prev =>
            prev.map(m =>
              m.id === event.payload.medicineId ? { ...m, status: 'missed' } : m
            )
          );
          const alertUpdated = await DataService.addAlert({
            type: 'missed_medicine',
            severity: 'high',
            title: `Medication Missed: ${event.payload.medicineName}`,
            message: `${event.payload.medicineName} scheduled for ${event.payload.scheduledTime} was not taken.`,
          });
          setAlerts(alertUpdated);
          break;
        }
        case 'CHECKIN_COMPLETED': {
          const freshCheckIns = await DataService.getCheckIns();
          setCheckIns(freshCheckIns);
          break;
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'senior') {
      setCurrentUser(INITIAL_USER_SENIOR);
    } else {
      setCurrentUser(INITIAL_USER_CAREGIVER);
    }
  };

  const logout = () => {
    switchRole('senior');
  };

  const updateSeniorStatus = async (statusUpdate: Partial<SeniorStatus>) => {
    const updated = await DataService.saveSeniorStatus(statusUpdate);
    setSeniorStatus(updated);
  };

  const updateCaregiverSettings = async (settingsUpdate: Partial<CaregiverSettings>) => {
    const newSettings = { ...caregiverSettings, ...settingsUpdate };
    const saved = await DataService.saveCaregiverSettings(newSettings);
    setCaregiverSettings(saved);
  };

  const markMedicationTaken = async (id: string) => {
    const updated = await DataService.updateMedicationStatus(id, 'taken');
    setMedications(updated);
  };

  const markMedicationSkipped = async (id: string, reason?: string) => {
    const updated = await DataService.updateMedicationStatus(id, 'skipped');
    setMedications(updated);
  };

  const markMedicationMissed = async (id: string) => {
    const updated = await DataService.updateMedicationStatus(id, 'missed');
    setMedications(updated);
  };

  const markMedicationPending = async (id: string) => {
    const updated = await DataService.updateMedicationStatus(id, 'pending');
    setMedications(updated);
  };

  const markMedicationStatus = async (id: string, status: any) => {
    const updated = await DataService.updateMedicationStatus(id, status);
    setMedications(updated);
  };

  const triggerReminderModal = (med: Medication) => {
    setActiveReminderMed(med);
  };

  const closeReminderModal = () => {
    setActiveReminderMed(null);
  };

  const addMedication = async (newMed: Omit<Medication, 'id' | 'seniorUid' | 'status'>) => {
    const updated = await DataService.addMedication(newMed);
    setMedications(updated);
  };

  const updateMedication = async (med: Medication) => {
    const updated = await DataService.updateMedication(med);
    setMedications(updated);
  };

  const deleteMedication = async (id: string) => {
    const updated = await DataService.deleteMedication(id);
    setMedications(updated);
  };

  const submitCheckIn = async (mood: 'good' | 'okay' | 'bad', note?: string, symptoms?: string[]) => {
    const updated = await DataService.addCheckIn({ mood, note, symptoms });
    setCheckIns(updated);

    // Emit senior event CHECKIN_COMPLETED
    emitCheckInCompleted(currentUser.uid, mood, note, symptoms);

    // If mood is bad, generate auto-alert for Caregiver
    if (mood === 'bad') {
      const alertUpdated = await DataService.addAlert({
        type: 'poor_checkin',
        severity: 'high',
        title: 'Senior Reported Feeling Unwell',
        message: `${currentUser.name} logged feeling "Not feeling well"${note ? `: "${note}"` : '.'}`,
      });
      setAlerts(alertUpdated);
    }
  };

  const acknowledgeAlert = async (id: string) => {
    const updated = await DataService.acknowledgeAlert(id);
    setAlerts(updated);
  };

  const clearAcknowledgedAlerts = async () => {
    const updated = await DataService.clearAcknowledgedAlerts();
    setAlerts(updated);
  };

  const triggerSos = async (customMessage?: string) => {
    setIsSosActive(true);
    const alertUpdated = await DataService.addAlert({
      type: 'sos',
      severity: 'critical',
      title: '🚨 EMERGENCY SOS TRIGGERED!',
      message: customMessage || `${INITIAL_USER_SENIOR.name} pressed the Emergency SOS button at ${new Date().toLocaleTimeString()}! Immediate attention required.`,
    });
    setAlerts(alertUpdated);
  };

  const cancelSos = () => {
    setIsSosActive(false);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        role,
        switchRole,
        medications,
        checkIns,
        alerts,
        contacts,
        seniorStatus,
        updateSeniorStatus,
        caregiverSettings,
        updateCaregiverSettings,
        audioEnabled,
        setAudioEnabled,
        highContrast,
        setHighContrast,
        isSosActive,
        triggerSos,
        cancelSos,
        markMedicationTaken,
        markMedicationSkipped,
        markMedicationMissed,
        markMedicationPending,
        markMedicationStatus,
        addMedication,
        updateMedication,
        deleteMedication,
        activeReminderMed,
        triggerReminderModal,
        closeReminderModal,
        submitCheckIn,
        acknowledgeAlert,
        clearAcknowledgedAlerts,
        refreshData: loadData,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
