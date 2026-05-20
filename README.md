# Arbeitszeit-Rechner

Single-File-Webapp zum täglichen Erfassen der Arbeitszeit in **AE (Arbeitseinheiten, 1 AE = 10 min)**. Mobile-first, offline-fähig, keine Server-Komponente — alle Daten bleiben im Browser.

**Version:** 1.22.0 · **Live:** [marvdevlabs.github.io/arbeitszeit](https://marvdevlabs.github.io/arbeitszeit/) · [Vollständiges Changelog](CHANGELOG.md)

<p align="center">
  <img src="docs/screenshots/06-step5-full.png" alt="Arbeitszeit-Rechner – Übersicht in Step 5" width="380">
</p>

---

## Funktionen

### Eingabe

- **5-Step-Assistent** mit Punkte-Indikator: Bundesland → Bereitschaft → Datum/Zeit/Anzahl → SAP-Nummern → AE-Werte
- **Alle 16 Bundesländer** wählbar (Pflichtfeld, bleibt persistent)
- **Bereitschaft** Ja/Nein legt Standard-Startzeit fest (09:00 / 06:30)
- **Datum frei wählbar** — auch nachträgliches Erfassen vergessener Tage
- **Splits** pro Auftrag (10, 11, 20, 29, 40, 50)
- **Aufträge umsortieren** mit ▲ ▼ Pfeilen — z.B. wenn die MONAmC-SAP-Sortierung nicht zum tatsächlichen Tagesablauf passt
- **LRE-Stufen** (1, 2, 3) und **Custom-Start-Uhrzeit** pro Auftrag bei Bereitschaft
- **9-Slide-Onboarding** für Erst-Nutzer, jederzeit über das Über-Modal erneut abrufbar

### Berechnung

- **Live-Berechnung** bei jeder Eingabe
- **Sollarbeitszeit 7:48h netto** (ohne Anfahrt/Abfahrt/Pause)
- **Fester Abzug** 30 min Anfahrt + 30 min Abfahrt
- **An jedem Wochenende & Feiertag entfällt der An-/Abfahrt-Abzug** — nur Pause (auftragsbasiert, kein Soll-Vergleich)
- **Automatische Pause** je nach Bruttozeit: 0 min / 30 min / 45 min
- **10h-Limit** nach §3 ArbZG mit Warn-Modal und Auto-Revert beim Korrigieren

### Feiertage je Bundesland

- **Bundeseinheitliche Feiertage** automatisch (Neujahr, Karfreitag, Ostermontag, 1. Mai, Christi Himmelfahrt, Pfingstmontag, Tag der Deutschen Einheit, 25./26.12.)
- **Länderspezifische Feiertage** korrekt zugeordnet
- **Bewegliche Feiertage** über Gauß'sche Osterformel — funktioniert für jedes Jahr

### Import & Datenerfassung

- **MONAmC-Screenshot-Import** via lokaler OCR (Tesseract.js) — SAP-Nummern + Splits werden automatisch erkannt, gruppiert und übernommen
- **Pre-Processing & Chunking** für lange Screenshots mit vielen Aufträgen
- **Fahrtenbuch-Import** für Reise-/Rückzeiten aus Vimcar-Screenshots
- **MONAmC-Validierung** — bei Fehl-Upload erscheint ein Schmunzler-Bild („SERIOUSLY?")
- **JSON-Restore** für komplette Backups
- **Tag-Empfang per URL** — `#import=`-Hash wird beim Öffnen automatisch erkannt

### Verlauf

- **Letzte 14 Tage** werden automatisch beim „Neuer Tag starten" archiviert
- **Restore-Modal beim Start** — fragt aktiv „Weiterarbeiten oder archivieren?" wenn Daten vom Vortag vorliegen
- **Verlaufs-Banner** zeigt „X von 14 Plätzen belegt" — vor dem Limit gewarnt
- **Pro Eintrag:** Wochentag, Datum, Bereitschafts-/Feiertags-Badge, Anzahl Aufträge, Gesamt-AE
- **Erneut abrufbar:** vollständiges Protokoll mit Kopier-Funktion
- **Einzelne Einträge oder kompletten Verlauf löschbar**

### Export & Backup

- **Kopieren** — Klartext-Protokoll in die Zwischenablage (für Mail, Slack, etc.)
- **Drucken** — hochkant, schlicht, nur Protokoll (System-Druck-Dialog, PDF möglich)
- **JSON-Backup** — komplette App-Daten herunterladen (Tag + Verlauf + Bundesland + Theme)
- **Tag-Transfer per QR-Code & URL** — Aufträge eines Tages aufs zweite Gerät übertragen, ohne Server (LZ-String-komprimiert)

### Komfort & Polish

- **Live-Schicht-Status** im Header (Step 5) — „Heute · 7h 30min · noch −18 min bis Soll" — farbig nach Status
- **Save-Indicator** im Footer — subtiler grüner Puls nach jeder Speicherung (iCloud-Sync-Style)
- **Info-Tooltips** bei Fachbegriffen (Zeit / AE-Werte / Soll / 10h)
- **Dark / Light Mode** mit System-Erkennung
- **10h-Modal mit Auto-Revert** — bei „Werte korrigieren" wird der letzte zu hoch eingegebene Wert automatisch zurückgesetzt
- **Über-Modal** mit Author, Kontakt-Link, Datenschutz-Statement und „Tour neu starten"-Link

### Sicherheit

- **Content Security Policy** — restriktive `default-src 'self'`, gezielte Allowlist für nötige CDN-Quellen
- **Subresource Integrity (SRI)** auf alle externen Skripte (Tesseract.js, lz-string, qrcode-generator) — manipulierte CDN-Inhalte werden vom Browser verweigert
- **Tiefe Schema-Validierung** auf alle externen Datenquellen (LocalStorage, JSON-Backup, Tag-Transfer, URL-Hash) — kaputte/maliziose Daten bringen die App nicht in einen toten Zustand
- **Privacy-Architektur:** alle Daten ausschließlich lokal, keine Server-Calls, kein Tracking, kein robots-Indexing

### PWA & Offline

- **Service Worker** — App funktioniert auch ohne Internet (im Tunnel, Funkloch)
- **Web App Manifest** — Android-Install-Banner
- **Apple-Touch-Icon** — iOS „Zum Home-Bildschirm" mit eigenem App-Icon
- **Safe-Area-Insets** — Notch-fest auf iPhone
- **Eigenes Stoppuhr-Icon** auf Anthrazit-Hintergrund

---

## Anleitung

Beim ersten Start erscheint ein **9-Slide-Onboarding** (Willkommen → AE-Konzept → 5-Step-Workflow → Bundesland → Aufträge & Splits → Live-Status → Export → Privatsphäre). Wer's überspringt: jederzeit über **Über-Modal → „App-Tour" → „Einführung erneut anzeigen →"** abrufbar.

### Schritt 1 — Bundesland wählen

<img src="docs/screenshots/01-step1-bundesland.png" alt="Step 1: Bundesland" width="360" align="right">

Die App startet **immer** bei der Bundesland-Auswahl. Pflichtfeld — ohne Auswahl geht es nicht weiter. Die letzte Wahl bleibt vorausgewählt, du klickst beim nächsten Mal einfach durch.

Im Header oben rechts erscheint nach der Auswahl ein kleines Pill mit dem Kürzel (z.B. **NW**) — Klick darauf bringt dich jederzeit zurück zu Schritt 1.

<br clear="all">

### Schritt 2 — Bereitschaft?

<img src="docs/screenshots/02-step2-bereitschaft.png" alt="Step 2: Bereitschaft" width="360" align="right">

**Nein** → Tag startet um **06:30**
**Ja** → Tag startet um **09:00**

Die Startzeit kannst du im nächsten Schritt frei anpassen.

<br clear="all">

### Schritt 3 — Datum, Startzeit, Anzahl & MONAmC-Import

<img src="docs/screenshots/03-step3-datum-wochenende.png" alt="Step 3: Datum" width="360" align="right">

**Datum** ist automatisch heute, aber frei wählbar. Direkt darunter siehst du:

- **Wochentag** ausgeschrieben
- bei Wochenende oder Feiertag einen **Hinweis-Tag**
- bei WE/Feiertag den grünen Hinweis **„ohne An-/Abfahrt-Abzug"**

**Aufträge heute** legt die Anzahl fest — oder klick auf **„Aus Screenshot importieren"** und lade einen MONAmC-Screenshot hoch. Tesseract.js liest SAP-Nummern und Splits automatisch.

<br clear="all">

### Schritt 4 — SAP-Nummern und Splits

<img src="docs/screenshots/04-step4-sap-splits.png" alt="Step 4: SAP" width="360" align="right">

Pro Auftrag eine **SAP-Nummer** eintragen. Falls Splits relevant sind, eines oder mehrere aus **10, 11, 20, 29, 40, 50** auswählen. Jeder gewählte Split bekommt im nächsten Schritt eine eigene Zeile zur AE-Eingabe.

<br clear="all">

### Schritt 5 — AE-Werte erfassen

<img src="docs/screenshots/05-step5-auftraege.png" alt="Step 5: Auftrag-Karten" width="360" align="right">

Pro Auftrags-Karte:

- **▲ ▼ Pfeile** — Reihenfolge ändern (synchron mit SAP)
- **Auftrags-Titel** (klickbar zum Umbenennen)
- **Reisezeit** (Schalter aktiviert die Eingabe)
- **Arbeitszeit** — pro Split eine eigene Zeile, alles in AE
- **Rückzeit** zum nächsten Auftrag oder als Heimfahrt
- **LRE-Stufe & AB-Uhrzeit** bei Bereitschaft (1/2/3 + Custom-Start)

Berechnete Uhrzeiten links neben den Eingabefeldern aktualisieren sich live — ebenso die Übersicht ganz unten und der **Live-Status oben im Header**.

<br clear="all">

### Übersicht am Tagesende

<p align="center">
  <img src="docs/screenshots/07-summary.png" alt="Summary" width="380">
</p>

- **Zeit:** Brutto, Pause (automatisch), Netto-Arbeitszeit
- **AE-Werte:** Reise / Arbeit / Rück / Gesamt
- **Soll-Vergleich:** grün wenn 7:48h erreicht, gelb mit „+x" bei Plus, sonst „−x bis Soll" (ausgeblendet bei WE/Feiertagen — dort gilt auftragsbasiert)
- **10h-Status:** Warnstufe bei Überschreitung der gesetzlichen Höchstarbeitszeit
- Kleine **i-Icons** neben den Abschnitten erklären die Fachbegriffe per Tap

### Aktionen am Ende

- **Kopieren** — vollständiges Klartext-Protokoll in die Zwischenablage
- **Drucken** — System-Druck-Dialog (PDF-Speichern dort möglich, A4 hochkant)
- **Neuer Tag** — öffnet das Reset-Bestätigungs-Modal

---

## Neuer Tag starten

<img src="docs/screenshots/08-modal-reset.png" alt="Reset-Modal" width="360" align="right">

Klick auf **Neuer Tag** öffnet das Bestätigungs-Modal. Bei Bestätigung wird der aktuelle Tag **automatisch in den Verlauf archiviert** (sofern AE-Werte vorhanden), dann startet ein neuer Tag bei Step 1. Bundesland, Theme und Verlauf bleiben erhalten.

<br clear="all">

## Verlauf

<img src="docs/screenshots/09-modal-verlauf.png" alt="Verlauf-Modal" width="360" align="right">

Das **Uhren-Icon** im Header öffnet den Verlauf. Listet die letzten 14 archivierten Tage mit Datum, Wochentag, ggf. Bereitschaft- und Feiertags-Badge, Anzahl Aufträge und Gesamt-AE.

- **Banner oben:** zeigt „X von 14 Plätzen belegt", warnt bei vollem Verlauf
- **Klick auf Eintrag** → komplettes Klartext-Protokoll, direkt erneut kopierbar
- **× rechts oben** → einzelnen Eintrag löschen (mit Bestätigung)
- **„Verlauf löschen"** → kompletten Verlauf entfernen (mit Bestätigung)

<br clear="all">

## Daten-Sicherung & Geräte-Transfer

<img src="docs/screenshots/10-modal-backup.png" alt="Backup-Modal" width="360" align="right">

Das **Disketten-Icon** im Header öffnet die Daten-Sicherung. Drei Wege:

- **JSON-Backup herunterladen** — komplette App-Daten als JSON-Datei (`arbeitszeit-backup-YYYY-MM-DD.json`)
- **JSON-Backup hochladen** — alle Daten werden überschrieben
- **Tag-Transfer per QR/URL** — den aktuellen Tag als komprimierte URL teilen, das zweite Gerät kann sie scannen oder öffnen → Bestätigungs-Modal → Tag wird übernommen, der aktuelle automatisch archiviert

Sichere Geräte-Wechsel-Strategie: vorher auf altem Gerät runterladen, AirDrop/Mail an neues Gerät, dort hochladen.

<br clear="all">

## Tipps & Tricks

- **Bundesland-Pill im Header** ist klickbar → springt jederzeit zurück zu Step 1 (z.B. bei Dienstreise)
- **Aufträge umsortieren** mit den ▲ ▼ Pfeilen — synchron mit SAP-Reihenfolge
- **Auftrags-Namen** in Step 5 direkt im Titel-Feld umbenennen — Standard ist die SAP-Nummer
- **Reise-/Rückzeit** über Toggle aktivieren — wenn aus, zählen sie nicht zur Rechnung
- **Datum nachträglich erfassen:** in Step 3 das Datum auf den vergangenen Tag stellen
- **MONAmC-Screenshot importieren** in Step 3 — schneller als manuelle Eingabe
- **PWA-Installation iOS:** Safari → Teilen → „Zum Home-Bildschirm" — App läuft im Vollbild, auch offline
- **Theme-Toggle** im Header — reagiert beim ersten Start auf System-Einstellung, danach manuell
- **Es gibt ein paar kleine Geheimnisse im Footer und im Header** — wer's findet darf darüber lachen 😉

---

## Tech-Stack

- **Single-File HTML** — eine `index.html` enthält alles (HTML, CSS, JS)
- **Vanilla JavaScript** — keine Build-Tools, keine npm-Dependencies
- **Externe Bibliotheken (lazy-loaded, SRI-pinned):**
  - **Tesseract.js 5.0.5** — lokale OCR für Screenshot-Import
  - **lz-string 1.5.0** — Kompression für QR-Tag-Transfer
  - **qrcode-generator 1.4.4** — QR-Code-Erzeugung
- **CSS Custom Properties** für Light/Dark-Theme
- **LocalStorage** für Persistenz (Tag + Verlauf + Bundesland + Theme + Onboarding-Status)
- **Service Worker** (`sw.js`) — Offline-Cache via stale-while-revalidate
- **Web App Manifest** (`manifest.json`) — PWA-Install-Banner
- **Content Security Policy** + **Subresource Integrity** — Sicherheits-Schicht
- **Hosting:** GitHub Pages

### Lokal entwickeln

```bash
git clone https://github.com/marvdevlabs/arbeitszeit.git
cd arbeitszeit
python3 -m http.server 8000
# Browser: http://localhost:8000
```

Bearbeite `index.html` und neu laden — kein Build-Schritt, kein npm install.

### Deployment

Live-Version läuft über **GitHub Pages** vom `main`-Branch. Push reicht.

---

## Logik im Kurzüberblick

| Wert | Erklärung |
|---|---|
| 1 AE | 10 Minuten |
| Sollarbeitszeit | 7 h 48 min netto (ohne An-/Abfahrt und Pause) |
| Fester Abzug | 30 min Anfahrt + 30 min Abfahrt |
| An WE/Feiertag | **kein** An-/Abfahrt-Abzug — auftragsbasiert, kein Soll-Vergleich |
| Pause automatisch | 0 min bei < 6h Arbeit · 30 min bei 6–9h · 45 min bei > 9h |
| Höchstarbeitszeit | 10 h inkl. An-/Abfahrt (§3 ArbZG) |
| Plus-Zeit | wird ab Überschreitung von 7:48h netto ausgewiesen |
| Splits | 10, 11, 20, 29, 40, 50 |
| Verlaufs-Maximum | 14 archivierte Tage |
| LRE-Stufen (Bereitschaft) | 1, 2, 3 |

### Feiertage je Bundesland

**Bundesweit:** Neujahr · Karfreitag · Ostermontag · 1. Mai · Christi Himmelfahrt · Pfingstmontag · Tag der Deutschen Einheit · 25. & 26. Dezember.

**Länderspezifisch (Auszug):**

- **BW, BY, ST:** Heilige Drei Könige
- **BW, BY, HE, NW, RP, SL:** Fronleichnam
- **BW, BY, NW, RP, SL:** Allerheiligen
- **BY, SL:** Mariä Himmelfahrt
- **BE, MV:** Internationaler Frauentag
- **BB:** Ostersonntag · Pfingstsonntag
- **SN:** Buß- und Bettag
- **TH:** Weltkindertag
- **BB, HB, HH, MV, NI, SN, ST, SH, TH:** Reformationstag

Bewegliche Feiertage werden über die Gauß'sche Osterformel berechnet — funktioniert für jedes Jahr.

---

## Lizenz & Disclaimer

<img src="docs/screenshots/11-modal-about.png" alt="Über-Modal" width="360" align="right">

**Privates Open-Source-Projekt** von Marvin Duhn ([@marvdevlabs](https://github.com/marvdevlabs)).

**Kein offizielles Tool der Deutschen Bahn AG.** Die App speichert alle Daten ausschließlich lokal im Browser (LocalStorage). Keine Daten verlassen das Gerät, keine externen Aufrufe (außer initiales Lazy-Load der drei SRI-gepinnten Bibliotheken vom CDN), keine Cookies, kein Tracking.

Nutzung auf eigene Verantwortung — keine Gewähr für die Korrektheit der Berechnungen.

Bug-Reports und Feature-Wünsche bitte über [GitHub Issues](https://github.com/marvdevlabs/arbeitszeit/issues).

Versions-Historie: siehe [CHANGELOG.md](CHANGELOG.md).

<br clear="all">
