# Changelog

Alle nennenswerten Änderungen am Arbeitszeit-Rechner sind hier dokumentiert.

Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
Versionierung nach [Semantic Versioning](https://semver.org/lang/de/).

---

## [1.22.0] — 2026-05-20

### Hinzugefügt
- **Onboarding-Tour ausgeweitet** von 3 auf 9 Slides:
  - Willkommen → Was ist eine AE? → 5 Schritte zum Tag → Bundesland & Feiertage → Aufträge & Splits → Status auf einen Blick → Speichern & Export → Privatsphäre.
  - Jeder Slide mit Icon, konkretem Beispiel und Praxis-Tipp.
- Neues **CHANGELOG.md** mit kompletter Versions-Historie.

### Geändert
- **README.md** komplett überarbeitet — aktueller Featurestand, Sicherheits-Sektion, MONAmC-/Fahrtenbuch-Import, Tag-Transfer, Reorder, LRE-Stufen.

---

## [1.21.0] — 2026-05-20

### Hinzugefügt
- **Aufträge umsortieren:** kleine `▲ ▼` Buttons auf jeder Auftrags-Karte. Bei mehreren Aufträgen lässt sich die Reihenfolge ändern, alle Uhrzeiten berechnen sich live neu durch. SAP-Nummern und Auftrags-Details bleiben synchron.
- **„Tour neu starten"-Link** im Über-Modal — startet das Onboarding erneut.

---

## [1.20.2] — 2026-05-20

### Hinzugefügt
- **Onboarding-Modal** für Erst-Nutzer (zunächst 3 Slides — später auf 9 erweitert, siehe 1.22.0).
- **Save-Indicator** im Footer — subtiler grüner Puls nach jedem Save (iCloud-Sync-Style).
- **Verlauf-Limit-Banner** — zeigt „X von 14 Plätzen belegt" beim Öffnen des Verlauf-Modals.

---

## [1.20.1] — 2026-05-20

### Stabilität
- **Tiefe Schema-Validierung** beim Laden externer Daten:
  - `sanitizeWorkEntry()`, `sanitizeAuftrag()`, `sanitizeSapEntry()` als Helper.
  - Eingangspunkte: `loadState`, `loadHistory`, `importData` (JSON-Backup), `applyImport` (Tag-Transfer).
  - Kaputte/maliziose JSON-Daten setzen die App nicht mehr in einen toten Zustand.
- **OCR-Race-Schutz:** wird das Modal mittendrin geschlossen, wird kein DOM mehr beschrieben.

---

## [1.20.0] — 2026-05-20

### Sicherheit
- **Content Security Policy** via `<meta http-equiv>`:
  `default-src 'self'`, restriktive script-/connect-/worker-Quellen, `form-action 'none'`, `frame-ancestors 'none'`.
- **Subresource Integrity (SRI)** für alle externen CDN-Skripte (Tesseract.js, lz-string, qrcode-generator). Tesseract auf konkrete Version `5.0.5` gepinnt.
- **innerHTML-Audit** — `escapeHtml` konsistent bei allen User-Input-Stellen.

---

## [1.19.1] — 2026-05-20

### Geändert
- **MONAmC-OCR:** Pre-Processing + Chunking für lange Screenshots — bessere Erkennung bei Listen mit vielen Aufträgen.

---

## [1.19.0] — 2026-05-20

### Hinzugefügt
- **LRE-Stufen** pro Auftrag (1, 2, 3) bei Bereitschaft.
- **Custom-Start** pro Auftrag — feste Anfangs-Uhrzeit überschreibt die automatische Verkettung.
- Pause-Logik vereinheitlicht.

---

## [1.18.0–1.18.4] — 2026-05-19

### Geändert
- **Druck-Layout** komplett überarbeitet: hochkant, schlicht, nur Protokoll. MONA-Schema wieder entfernt.
- **An-/Abfahrt-Abzug entfällt** an **jedem** Wochenende/Feiertag, nicht nur bei Bereitschaft.
- Pause-Logik korrigiert: Bereitschaft am Werktag = normaler Abzug.

### Entfernt
- AWIB/NWIB-Felder pro Auftrag (Experiment).
- MONAmC-Walking-Mode (Schritt-für-Schritt-Anleitung).

---

## [1.17.0–1.17.1] — 2026-05-19

### Hinzugefügt
- AWIB/NWIB pro Auftrag (später wieder entfernt).
- Zoom global deaktiviert (Pinch + Double-Tap + iOS-Auto-Zoom).

---

## [1.16.0] — 2026-05-19

### Hinzugefügt
- **MONAmC-Modus (Walking-Mode)** — interaktive Schritt-für-Schritt-Anleitung zum Eintragen in MONAmC (später wieder entfernt).

---

## [1.15.0] — 2026-05-19

### Hinzugefügt
- **Tag-Transfer per QR-Code & URL** — Aufträge eines Tages aufs zweite Gerät übertragen, ohne Server. LZ-String-Kompression, Schema-Version `v=1`.

---

## [1.14.0–1.14.9] — 2026-05-18

### Hinzugefügt
- **Fahrtenbuch-Import** — Screenshot aus Vimcar/Fahrtenbuch via OCR; Fahrten werden als Vorschlag erkannt und übernommen.
  - Konsistenz-Check, editierbare Datum/Zeiten pro Fahrt, hinzufügen/löschen, Mobile-Datumsformat, Bild-Pre-Processing.

### Geändert
- Pausen- und An-/Abfahrt-Logik bei Bereitschaft/WE/Feiertag konsolidiert.
- Tageswechsel als hochgestelltes Suffix (`+1`) bei Uhrzeit-Anzeigen.
- Locked-Switch bei Splits/Arbeit entfernt.
- Protokoll-Layout an MONAmC-Format angepasst.

---

## [1.13.0] — 2026-05-18

### Hinzugefügt
- **Vimcar-Fahrten-Import (BETA)** — Vorläufer des Fahrtenbuch-Imports.

---

## [1.12.0–1.12.2] — 2026-05-17

### Hinzugefügt
- **Screenshot-Import mit lokaler OCR** (Tesseract.js) — MONAmC-Screenshot hochladen, SAP-Nummern + Splits werden automatisch erkannt.
- **MONAmC-Validierung** — bei Fehl-Upload erscheint ein Schmunzler-Bild („SERIOUSLY?").
- **Star-Wars-Variante** des Schmunzlers am 4. Mai.

---

## [1.11.0–1.11.9] — 2026-05-17

### Geändert
- **Restore-Modal beim Start** ersetzt den vorherigen Banner — fragt aktiv „Weiterarbeiten oder archivieren?".
- README + 10 Screenshots komplett überarbeitet.

### Behoben
- Zwei UI-Bugs (Layout-Brüche).
- Mobile-Layout-Fixes für Step 3.
- Datum-/Zeit-Felder Overflow auf iPhone (`-webkit-appearance: none`, `minmax(0, 1fr)`).
- Werte in Step-3-Feldern jetzt zentriert.
- iOS-Auto-Zoom bei Input-Fokus verhindert (16px Mindest-Schriftgröße).
- Kopieren+Drucken jetzt zentriert zwischen Zurück und Neuer Tag.
- Soll-Vergleich ausgeblendet bei WE/Feiertag — egal ob Bereitschaft oder nicht (auftragsbasiert).

---

## [1.10.0–1.10.4] — 2026-05-17

### Hinzugefügt
- **Über-Modal** mit Author, Kontakt, Datenschutz-Statement, Disclaimer.
- App startet ab jetzt immer bei Step 1 (Bundesland-Auswahl bestätigen).

### Geändert
- **Stoppuhr-Icon** auf Anthrazit-Hintergrund ersetzt das alte „AZ"-Icon (visuell weniger DB-Imitation).
- `theme-color` durchgehend auf Anthrazit.
- „— Deutsche Bahn"-Attribution unter Sprüchen entfernt.

---

## [1.9.0–1.9.3] — 2026-05-17

### Hinzugefügt
- **Live-Schicht-Status** im Header während Step 5 — „Heute · 5h 30min · noch −2h 18min bis Soll", farbig je nach Soll-Status.

### Geändert
- Info-Boxen dezenter (kein roter Akzent mehr, slate-blauer Tint).
- Step-5-Button-Reihe neu: Reihenfolge, Beschriftung, Farben.

### Behoben
- Tooltips bei „Zeit"/„AE-Werte" nicht mehr halbtransparent.

---

## [1.8.0–1.8.1] — 2026-05-17

### Hinzugefügt
- **JSON-Backup/Restore** im Header (Disketten-Icon).
- **Service Worker** + Web App Manifest — Offline-fähige PWA.

### Behoben
- iOS-PWA „weiße Seite"-Bug: absolute Pfade in Manifest, robusterer SW (Network-First für Navigation).

---

## [1.7.0–1.7.2] — 2026-05-17

### Hinzugefügt
- **50 selbstironische Bahn-Sprüche** (Instagram-Stil).
- Repo umbenannt: `DB-Arbeitszeit` → `arbeitszeit` (gegen Google-Safe-Browsing-Heuristik).

### Geändert
- Spruch-Modal schicker (Quote-Glyph, Fade-Transition).
- Meta-Tags + sichtbarer Disclaimer im Footer („kein offizielles Tool").

---

## [1.6.0–1.6.1] — 2026-05-17

### Hinzugefügt
- **Retro/Cyberpunk-Easter-Egg** (5× rapid auf Theme-Toggle → Pink/Cyan-Mode für 10 s).

### Geändert
- Bahn-Sprüche weg vom Schicht-Fokus, allgemeiner.

---

## [1.5.0] — 2026-05-17

### Hinzugefügt
- **Bahn-Wisdom-Easter-Egg** (3× auf Versionsnummer → Modal mit zufälligem Spruch).

---

## [1.3.0–1.4.0] — 2026-05-17

### Hinzugefügt
- **May-the-4th-Easter-Egg**: am 4. Mai erscheint ein Star-Wars-Themen-Modal.

### Geändert
- Zwischendurch ASCII-Animation, schließlich auf Modal-Lösung umgestellt.

---

## [1.2.0] — 2026-05-17

### Hinzugefügt
- **10h-Modal mit Auto-Revert** — bei „Werte korrigieren" wird der letzte zu hoch eingegebene Wert automatisch zurückgesetzt.
- Footer-Link auf @marvdevlabs.

---

## [1.1.0–1.1.1] — 2026-05-17

### Hinzugefügt
- **Einzelne Verlaufs-Einträge löschbar** (×-Button pro Eintrag).

### Geändert
- GitHub-Username-Migration: `BlackPolo91` → `marvdevlabs`.

---

## [1.0.0] — 2026-05-17

### Erste stabile Version
- **5-Step-Eingabe-Assistent**: Bundesland → Bereitschaft → Datum/Zeit/Anzahl → SAP-Nummern → AE-Werte.
- **Alle 16 Bundesländer** mit länderspezifischen Feiertagen (Gauß'sche Osterformel).
- **Bereitschaft an WE/Feiertag**: kein An-/Abfahrt-Abzug, nur Pause.
- **Automatische Pause-Logik** (0/30/45 min nach Bruttozeit).
- **10h-Limit-Warnung** nach §3 ArbZG.
- **Live-Berechnung** mit Rich Summary (Brutto, Netto, AE-Total, Soll-Vergleich, 10h-Status).
- **Verlauf der letzten 14 Tage** mit Auto-Archivierung.
- **Klartext-Export** (Kopieren) und PDF-Druck (A4 quer).
- **Dark/Light-Theme** mit System-Erkennung.
- **iOS Home-Screen-fähig** (PWA-Meta-Tags, Safe-Area).
- **LocalStorage-Persistenz** mit Sanity-Check.

---

## Vor v1.0.0 — 2026-05-16 / 2026-05-17 (Beta)

### Erste Implementierung
- Initialer Wurf von `Arbeitszeit_DB.html`.
- Mobile-Fixes: Eingabefelder, Rich Summary, iOS-PWA-Support.
- Bundesland-Auswahl + Feiertage + Datumspicker.
- Modal zu Dropdown umgebaut.
- Step-Flow finalisiert.
- Reset-Modal, Info-Tooltips, Verlauf-Archiv.

---

## Format-Konventionen

- **Versionierung:** Semantic Versioning (`MAJOR.MINOR.PATCH`).
  - `MAJOR` bei Breaking Changes (bisher keine).
  - `MINOR` bei neuen Features (rückwärtskompatibel).
  - `PATCH` bei Bugfixes oder Detail-Polish.
- **Kategorien:** Hinzugefügt · Geändert · Behoben · Entfernt · Sicherheit.
- Neueste Version oben.
