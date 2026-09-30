# 👵 SilverLink — Keeping Seniors Connected and Safe

<p align="center">
  <img src="./assets/thumbnail.png" alt="SilverLink Showcase" width="480" />
</p>

> **SilverLink** is a dual-interface mobile and web companion built with **React Native**, **Expo (SDK 51)**, **TypeScript**, and **Firebase**. It bridges senior independence with caregiver peace of mind, pairing an ultra-accessible interface with a real-time monitoring and medication dashboard.

---

## 🌟 Key Features

SilverLink provides two synchronized interface modes tailored to each user role:

### 👵 Senior App (Accessibility-First Design)
Designed for extreme simplicity, high contrast, and low cognitive load:
- **Large Touch Targets & Typography**: 20px–36px readable text and 64px+ oversized touch targets.
- **Voice Assistant**: Hands-free voice interactions powered by Web Speech API (`SpeechRecognition` & `SpeechSynthesis`). Supports natural voice prompts:
  - *"Remind me to take my medicine at 8 PM"*
  - *"Call my daughter"*
  - *"Show my medicines"*
  - *"I need help"*
- **Emergency SOS Center**: Prominent, red 1-tap SOS trigger with a 3-second safety countdown, acoustic alarm, direct dialers (911 / Caregiver), and live location status.
- **Daily Check-In**: "How are you feeling today?" with massive emoji options (😊 Good, 😐 Okay, 😟 Not feeling well) and symptom logging.
- **Medication Tracker**: Daily schedule grouped by time of day (Morning, Afternoon, Evening, Night) with visual status badges (Taken / Due / Upcoming / Skipped / Missed).
- **Family Contact Cards**: 1-tap phone dialer, video call simulator, and doctor quick-access.
- **SilverPulse Routine Intelligence**: Background routine anomaly detection that prompts the senior before non-emergency escalations.
- **Accessibility Engine**: Extra High Contrast mode, customizable voice assistance audio readouts, and live ticking clock.

### 📱 Family Caregiver Dashboard
Designed for real-time monitoring and peace of mind:
- **Senior Status Summary**: Live status card showing geofence location ("Home - Oakridge Residence"), battery level indicator, and real-time last active timestamp.
- **Quick Action Control Bar**: One-tap tools to ping the senior for a check-in, schedule new prescriptions, simulate emergency alerts, and call Eleanor directly.
- **Full Medication Regimen Management**: Schedule new prescriptions, edit existing doses and instructions, delete discontinued medicines, and view adherence stats.
- **Wellness & Mood Log**: Daily check-in log history with mood breakdowns and symptom trends.
- **Real-Time Alert Center**: Priority push & in-app alerts for Emergency SOS, missed medication reminders, or low wellness check-ins, with filter chips and resolution controls.
- **Caregiver Settings & Preferences**: Persisted notification preferences, missed dose timeout thresholds, and demo account controls.

---

## 🛠️ Tech Stack

- **Framework**: React Native with Expo (SDK 51)
- **Web Support**: React Native Web with Vercel deployment support
- **Language**: TypeScript
- **Navigation**: React Navigation v6 (Native Stack & Bottom Tabs)
- **Backend & Storage**: Firebase Auth & Firestore (with offline-resilient local AsyncStorage fallback)
- **Speech Engine**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)
- **Icons & Styling**: `@expo/vector-icons` (Ionicons) & Custom Senior Accessibility Theme Engine

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/varshithaaaagedda/silverlink.git
   cd silverlink
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Run locally with Expo**:
   ```bash
   # Start Expo dev server for Web preview
   npm run web
   
   # Or start standard Expo dev server for iOS/Android
   npm run start
   ```

---

## 💡 Hackathon Demo Instructions

SilverLink includes built-in **1-Tap Demo Roles** for instant reviewer evaluation:

1. **Senior Demo Mode**: Log in as **Eleanor Vance (Age 78)** to test the senior accessible layout, medication confirmations, daily check-in, voice commands, and SOS countdown.
2. **Caregiver Demo Mode**: Log in as **Sarah Vance (Daughter)** to view real-time adherence progress, check-in history logs, and acknowledge emergency alerts.
3. **Role Switcher**: Click the **Senior Mode / Caregiver Dashboard** chip in the top header or settings screen to toggle between roles at any time.

---

## 📂 Project Structure

```
silverlink/
├── assets/                  # App icons, splash screen, and hackathon presentation thumbnail
├── src/
│   ├── components/
│   │   ├── caregiver/       # AddMedicineModal, Caregiver widgets
│   │   ├── common/          # SeniorButton, SosModal, WebContainer
│   │   └── senior/          # Senior widgets and status cards
│   ├── config/              # Firebase & AsyncStorage configuration
│   ├── context/             # AppContext (Role, Meds, CheckIns, SOS State)
│   ├── navigation/          # RootNavigator, SeniorTabNavigator, CaregiverTabNavigator
│   ├── screens/
│   │   ├── auth/            # AuthScreen with 1-Tap Demo Logins
│   │   ├── caregiver/       # CaregiverHomeScreen, CaregiverMeds, CaregiverCheckIns, CaregiverAlerts, CaregiverSettings
│   │   └── senior/          # SeniorHomeScreen, MedicinesScreen, MedicineDetailsScreen, DailyCheckInScreen, VoiceAssistantScreen, EmergencyScreen, FamilyContactsScreen, SeniorSettingsScreen
│   ├── services/            # DataService (CRUD & Mock Fallback), SpeechService (Voice AI)
│   ├── theme/               # Colors, Typography, Accessibility Spacing tokens
│   └── types/               # TypeScript interface definitions
├── App.tsx                  # Root application entrypoint
├── index.js
├── package.json
└── README.md
```

---

## 🛡️ License

Built for Hackathon MVP Demonstration. All rights reserved.
