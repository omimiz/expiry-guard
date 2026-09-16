# 🛡️ ExpiryGuard — Loyalty & Rewards Loss Prevention PWA

> **Zero-integration, zero-credential loyalty tracking web app & Progressive Web App (PWA).**  
> Users never link logins or risk credentials. ExpiryGuard calculates real-time point expiration dates using deterministic program decay rules and fires proactive reminders showing exactly how to rescue points before they vanish.

---

## ✨ Key Features

* **🛡️ Zero Credentials & Zero Tracking:** No bank logins, passwords, or account numbers required. 100% private and local-first in your browser.
* **⚡ 60-Second Onboarding ("Deck Builder"):** Rapidly curate your card deck with 1-click presets (*Within 30 days*, *3–6 months*, *1 year ago*, or *Pick exact date*) and pre-configured starter packs.
* **📱 Apple Wallet Pass Aesthetics:** Sleek, mobile-first card deck interface with dynamic airline/hotel brand gradients, urgency badges, and tactile tactile visual cues.
* **🔄 "I Used This Card" 1-Tap Reset:** Logged a flight or bought groceries? Tap once to immediately reset your expiration clock to today and trigger celebration effects.
* **🛟 Actionable "Quick Rescue" Guides:** Specific, high-yield maneuvers tailored to each loyalty scheme (e.g. *Transfer 1,000 Amex points*, *Link Lyft with Hilton*, *Dine via Marriott Eat Around Town*, *Buy a $3 Sephora item*).
* **⏰ Autonomous Reminder Cadence:** Proactive notifications scheduled at **60 days**, **14 days**, and **48 hours** before point forfeiture.
* **📲 Installable PWA with Offline Support:** Works offline via custom Service Worker caching and installs seamlessly to iOS and Android home screens.
* **💾 Local-First Backup & Sync:** One-click JSON export and restore for effortless migration across your devices.

---

## 🏛️ Supported Loyalty Catalog

Pre-seeded with public expiration decay rules and rescue actions across major global programs:

| Program | Category | Decay Policy | Validity Window |
|---|---|---|---|
| **Emirates Skywards** | Airlines | Fixed Tenure | 36 Months |
| **Marriott Bonvoy** | Hotels | Rolling Inactivity | 24 Months |
| **Hilton Honors** | Hotels | Rolling Inactivity | 24 Months |
| **Starbucks Rewards** | Dining | Rolling Inactivity | 6 Months |
| **Carrefour SHARE** | Retail | Fixed Calendar | Dec 31 End of Year |
| **Air France / KLM Flying Blue** | Airlines | Rolling Inactivity | 24 Months |
| **Qatar Airways Privilege Club** | Airlines | Rolling Inactivity | 36 Months |
| **British Airways Executive Club** | Airlines | Rolling Inactivity | 36 Months |
| **World of Hyatt** | Hotels | Rolling Inactivity | 24 Months |
| **Singapore Airlines KrisFlyer** | Airlines | Fixed Tenure | 36 Months |
| **IHG One Rewards** | Hotels | Rolling Inactivity | 12 Months |
| **Sephora Beauty Insider** | Retail | Rolling Inactivity | 12 Months |
| **Delta SkyMiles** | Airlines | Immortal | Never Expires |
| **Amex Membership Rewards** | Credit Card | Active Account | Never Expires |

*Users can also create custom loyalty schemes with custom decay windows and policies.*

---

## 🛠️ Tech Stack

* **Framework:** [React 18](https://react.dev/) + [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with custom Apple Wallet pass gradients and glassmorphism
* **Icons:** [Lucide React](https://lucide.dev/)
* **Animations & Effects:** [canvas-confetti](https://github.com/catdad/canvas-confetti)
* **PWA & Offline:** Web App Manifest (`manifest.webmanifest`), Service Worker (`sw.js`) with cache-first static strategy and Web Push handlers
* **Persistence:** `localStorage` with JSON export/import

---

## 🚀 Quickstart

### 1. Clone & Install
```bash
git clone https://github.com/omimiz/expiry-guard.git
cd expiry-guard
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```

### 3. Run Calculation Engine Sanity Tests
```bash
npx tsx src/utils/calculator.test.ts
```

### 4. Build for Production
```bash
npm run build
```

---

## 📄 License

MIT License. Designed with privacy and user ownership at heart.
