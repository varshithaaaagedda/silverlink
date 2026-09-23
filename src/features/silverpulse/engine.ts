import { seniorEventService } from '../../services/senior/eventService';
import { SeniorEvent, RoutineDeviationPayload, WellbeingCheckPayload } from '../../types/events';

export interface RoutineBaseline {
  morningCheckInStart: string; // e.g., "08:00"
  morningCheckInEnd: string;   // e.g., "09:30"
  morningMedicationTime: string; // e.g., "08:15"
  eveningMedicationTime: string; // e.g., "20:00"
}

export interface WellbeingCheckState {
  active: boolean;
  deviationId?: string;
  explanation?: string;
  expectedTime?: string;
  timestamp?: string;
}

export class SilverPulseEngine {
  private seniorId: string = 'senior-1';
  private baseline: RoutineBaseline = {
    morningCheckInStart: '08:00 AM',
    morningCheckInEnd: '09:30 AM',
    morningMedicationTime: '08:15 AM',
    eveningMedicationTime: '08:00 PM',
  };

  private currentWellbeingCheck: WellbeingCheckState = {
    active: false,
  };

  private wellbeingListeners: Set<(state: WellbeingCheckState) => void> = new Set();

  constructor(seniorId: string = 'senior-1') {
    this.seniorId = seniorId;
  }

  public getBaseline(): RoutineBaseline {
    return this.baseline;
  }

  public getWellbeingCheckState(): WellbeingCheckState {
    return this.currentWellbeingCheck;
  }

  public subscribeWellbeingState(listener: (state: WellbeingCheckState) => void): () => void {
    this.wellbeingListeners.add(listener);
    // Emit initial state
    listener(this.currentWellbeingCheck);
    return () => {
      this.wellbeingListeners.delete(listener);
    };
  }

  private notifyWellbeingStateChange() {
    this.wellbeingListeners.forEach((listener) => listener(this.currentWellbeingCheck));
  }

  /**
   * Evaluates routine activity and triggers a ROUTINE_DEVIATION + WELLBEING_CHECK_REQUIRED if delayed.
   */
  public triggerSimulatedDeviation(
    targetType: 'checkin' | 'medication' | 'activity' = 'checkin',
    explanation: string = "Morning check-in has not occurred within Eleanor's usual time window (8:00 AM - 9:30 AM)."
  ): { deviationEvent: SeniorEvent; wellbeingEvent: SeniorEvent } {
    const timestamp = new Date().toISOString();
    const deviationId = `dev-${Date.now()}`;

    // 1. Emit ROUTINE_DEVIATION event
    const deviationPayload: RoutineDeviationPayload = {
      deviationId,
      targetEventType: targetType,
      expectedTime: this.baseline.morningCheckInStart,
      observedTime: null,
      severity: 'MODERATE',
      reason: explanation,
    };

    const deviationEvent: SeniorEvent = {
      id: `evt-${Date.now()}-1`,
      seniorId: this.seniorId,
      eventType: 'ROUTINE_DEVIATION',
      timestamp,
      payload: deviationPayload,
    };

    seniorEventService.emit(deviationEvent);

    // 2. Transition state to WELLBEING_CHECK_REQUIRED (SilverPulse rule: prompt senior first)
    const wellbeingPayload: WellbeingCheckPayload = {
      deviationId,
      prompt: "We haven't heard from you this morning. Are you okay?",
      status: 'pending',
    };

    const wellbeingEvent: SeniorEvent = {
      id: `evt-${Date.now()}-2`,
      seniorId: this.seniorId,
      eventType: 'WELLBEING_CHECK_REQUIRED',
      timestamp,
      payload: wellbeingPayload,
    };

    seniorEventService.emit(wellbeingEvent);

    // Update state
    this.currentWellbeingCheck = {
      active: true,
      deviationId,
      explanation,
      expectedTime: this.baseline.morningCheckInStart,
      timestamp,
    };

    this.notifyWellbeingStateChange();

    return { deviationEvent, wellbeingEvent };
  }

  /**
   * Senior action: "I'm okay" -> Resolves wellbeing check without emergency escalation.
   */
  public resolveSeniorIsOkay(): void {
    if (!this.currentWellbeingCheck.active) return;

    this.currentWellbeingCheck = { active: false };
    this.notifyWellbeingStateChange();

    console.log('[SilverPulse] Senior marked "I\'m okay". Deviation resolved successfully.');
  }

  /**
   * Senior action: "I need help" -> Triggers SOS event for Person 2 escalation.
   */
  public resolveSeniorNeedsHelp(): SeniorEvent {
    const timestamp = new Date().toISOString();
    const sosId = `sos-${Date.now()}`;

    const sosEvent: SeniorEvent = {
      id: `evt-${Date.now()}-sos`,
      seniorId: this.seniorId,
      eventType: 'SOS_TRIGGERED',
      timestamp,
      payload: {
        sosId,
        customMessage: 'Senior responded "I need help" during routine wellbeing check.',
        source: 'wellbeing_check_escalation',
      },
    };

    seniorEventService.emit(sosEvent);

    this.currentWellbeingCheck = { active: false };
    this.notifyWellbeingStateChange();

    return sosEvent;
  }
}

export const silverPulseEngine = new SilverPulseEngine('eleanor-vance-1');
