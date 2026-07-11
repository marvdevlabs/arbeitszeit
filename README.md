# DB Toolbox

Single-File-Webapp mit drei Werkzeugen für DB-Techniker. Mobile-first, offline-fähig, **alles bleibt im Browser** — kein Server, kein Tracking, keine Datenübertragung.

**Live:** [marvdevlabs.github.io/arbeitszeit](https://marvdevlabs.github.io/arbeitszeit/) · [Vollständiges Changelog](CHANGELOG.md)

---

## Die drei Tools

### 🕐 Tool 1 — Tageserfassung

Tägliche Erfassung der Arbeitszeit in **AE (Arbeitseinheiten, 1 AE = 10 min)**.

- **5-Step-Wizard**: Bundesland → Bereitschaft → Datum/Startzeit → SAP-Nummern → AE-Werte
- **Live-Berechnung** von Sollzeit, Pause, Plus-Stunden, 10 h-Limit
- **Feiertage** für alle 16 Bundesländer (Gauß'sche Osterformel — funktioniert für jedes Jahr)
- **Wochenend-/Feiertags-Logik** — kein An-/Abfahrt-Abzug, eigene Pausen-Regeln
- **MONAmC-Screenshot-Import** via Tesseract.js — SAP-Nummern + Splits automatisch erkannt
- **Splits** (10, 11, 20, 29, 40, 50) + beliebige eigene Splits (1–999) pro Auftrag
- **LRE-Stufen** (1/2/3) + Custom-Start-Uhrzeit bei Bereitschaft
- **Verlauf** der letzten 14 Tage mit Restore-Modal beim Start
- **Export**: Kopieren · Drucken · JSON-Backup · QR-Code-Transfer (LZ-komprimiert)

### 💰 Tool 2 — Abrechnungs-Check

Bereitschafts-Abrechnung gegen die Bereitschafts-Liste prüfen — komplett clientseitig.

- **PDF-Parser** (pdf.js, SRI-geprüft) extrahiert LRE-Einsätze, Rufbereitschaftsstunden, Steuern + SV-Beiträge aus DB-Abrechnungsbescheinigungen
- **Bereitschafts-Liste** (DB eTime) wird automatisch ausgelesen
- **Layout-Check** beider PDFs (Pflicht), **Monat-Abgleich** + automatische Nachzahlungs-Block-Erkennung
- **Zweistufiger Wizard**: erst LRE-Vergleich (passt alles?), auf Klick die Geld-Prüfung (Brutto → Netto → tatsächlicher Auszahlungsbetrag)
- **Auszahlungsbetrag** wird direkt aus Lohnart 977 („Überweisung") gelesen, sonst geschätzt

### 🔮 Tool 3 — Nächste Abrechnung (neu in v2.0)

**Brutto- und Netto-Vorhersage** der kommenden Abrechnung — bevor sie kommt.

- **Zwei Modi** per iOS-Segmented-Control:
  - **Aus PDF laden** — Bereitschafts-Liste + eTime-Personalverwendungsnachweis hochladen
  - **Planspiel · Manuell** — LRE 1/2/3, Rufbereitschaft, Nacht, Sonntag, Samstag, Feiertag, Überzeit, EFZ, EFB per ± Stepper einstellen; jede Änderung rechnet live neu
- **Vier Presets** im Planspiel: „Typischer Monat", „1 Ruf-Woche", „Voll-Bereitschaftswoche", „Alles auf 0"
- **Vollständige Zulagen** aus dem PVN (auch Fortzahlungs-Zulagen an Feiertags-/Krankheitstagen)
- **Netto-Split** „Was bringt die Bereitschaft davon netto?" mit marginaler Netto-Quote
- **Cross-Check** zwischen PVN und Bereitschafts-Liste
- **Präzision**: Netto-Prognose auf **±1 %** gegen reale Abrechnung (verifiziert am Januar-2026-Ist-Fall)
- **Meine tariflichen Sätze** — 10 Faktoren überschreibbar, Defaults sind die 2026er DB-InfraGo-Werte für EG 107/2

---

## ⚡ Setup Automagic (neu in v2.0)

Persönliche Daten müssen nicht mehr getippt werden. Im Persönliche-Daten-Modal steht ganz oben ein Foto/PDF-Upload-Button — App liest **Grundgehalt, Steuerklasse, Kinderfreibeträge, Konfession, Bundesland, KV-Zusatz** automatisch aus einer Abrechnung. Ein Tap statt neun Felder ausfüllen.

Beim ersten Öffnen der App ist das der erste Slide im Onboarding — Setup in fünf Sekunden.

---

## Privacy & Sicherheit

- **Keine Server-Calls** für persönliche Daten. PDFs werden ausschließlich im Browser-RAM verarbeitet.
- **Keine Tracker, kein Analytics, kein Indexing** (`robots: noindex,nofollow`).
- **Content Security Policy** restriktiv — `default-src 'self'`, gezielte CDN-Allowlist nur für pdf.js / Tesseract.js / lz-string / qrcode-generator.
- **Subresource Integrity (SHA-384)** auf allen externen Skripten — manipulierte CDN-Inhalte verweigert der Browser.
- **pdf.js-Worker** wird zusätzlich nach Download via `crypto.subtle.digest` manuell gegen den erwarteten SHA-384 geprüft — die `worker-src`-CSP bleibt eng auf `'self' blob:`.
- **Tiefe Schema-Validierung** auf alle externen Datenquellen (LocalStorage, JSON-Import, URL-Hash, OCR-Output).
- **Open Source** unter MIT-Lizenz — der gesamte Code ist in diesem Repo einsehbar.

---

## Technik

- **Single-File-HTML** — ein einziges `index.html` mit inline CSS + JS (~8.500 Zeilen).
- **Externe Libs**: alle lazy-loaded mit SRI-Hashes:
  - [Tesseract.js 5.0.5](https://github.com/naptha/tesseract.js) — OCR für MONAmC-Screenshots
  - [pdf.js 3.11.174](https://github.com/mozilla/pdf.js) — PDF-Parsing für Abrechnungen
  - [lz-string 1.5.0](https://github.com/pieroxy/lz-string) — Komprimierung für QR-Transfer
  - [qrcode-generator 1.4.4](https://github.com/kazuhikoarase/qrcode-generator) — QR-Code-Rendering
- **PWA** mit Service Worker (network-first für HTML, stale-while-revalidate für Assets), Web App Manifest inkl. App-Shortcuts und Maskable-Icon-Variante.
- **iOS-Style UI** mit System-Grays, Backdrop-Blur-NavBar, flatten Buttons, Segmented Controls, tabellarischen Zahlen.
- **Light/Dark-Theme** mit System-Erkennung.
- **Mobile-first**, Notch-fest auf iPhone (Safe-Area-Insets).
- **Netto-Berechnung** nach PAP-2025 (BMF-Programmablaufplan): §32a EStG, Vorsorgepauschale nach §39b, Mindest-Vorsorgepauschale-Deckel, Kinderfreibetrag-Handling bei KiSt/Soli.

---

## Installation

### Als Web-App
Einfach [marvdevlabs.github.io/arbeitszeit](https://marvdevlabs.github.io/arbeitszeit/) im Browser öffnen.

### Als PWA (Smartphone)
- **iOS**: Safari → Teilen → „Zum Home-Bildschirm". App startet mit eigenem Icon, Splash-Screen und ohne Safari-Chrome.
- **Android**: Chrome zeigt automatisch einen Install-Banner an.
- **Home-Screen-Shortcuts**: Langes Drücken auf dem App-Icon zeigt Quick-Actions „Tageserfassung", „Nächste Abrechnung", „Abrechnung prüfen".

### Selbst hosten
```bash
git clone https://github.com/marvdevlabs/arbeitszeit.git
cd arbeitszeit
# Statischer Server reicht — z.B.:
python -m http.server 8000
# Browser: http://localhost:8000
```

Keine Build-Step, keine Dependencies, kein Node nötig.

---

## Open Source

Marvin Duhn · [@marvdevlabs](https://github.com/marvdevlabs) · MIT-Lizenz

**Kein offizielles Tool der Deutschen Bahn AG.** Privates Open-Source-Projekt eines DB-Mitarbeiters für DB-Mitarbeiter. Tarif-Tabellen sind **nicht** im Code hinterlegt — das monatliche Grundgehalt trägst du selbst ein (oder lässt es dir per Setup Automagic aus einer Abrechnung ziehen).

Bug-Reports und Feature-Wünsche: [GitHub Issues](https://github.com/marvdevlabs/arbeitszeit/issues)
