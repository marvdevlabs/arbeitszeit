# Arbeitszeit-Rechner

Single-File-Webapp zum Erfassen und Berechnen der täglichen Arbeitszeit (1 AE = 10 min, Sollarbeitszeit 7:48h). Mobile-first, offline-fähig, keine Server-Komponente.

**Version:** 1.10.4 · **Live:** [marvdevlabs.github.io/arbeitszeit](https://marvdevlabs.github.io/arbeitszeit/)

<p align="center">
  <img src="docs/screenshots/06-step5-full.png" alt="Arbeitszeit-Rechner – Übersicht" width="380">
</p>

---

## Funktionen

- **5-Schritt-Eingabe-Assistent** mit Punkte-Indikator
- **Alle 16 Bundesländer** mit kompletter Berücksichtigung gesetzlicher Feiertage (bundes- und länderspezifisch)
- **Bereitschaft an Wochenenden / Feiertagen:** kein An-/Abfahrt-Abzug (60 min entfallen, nur Pause)
- **Automatische Pause** nach Bruttozeit (0 / 30 / 45 min)
- **Splits pro Auftrag** (10, 11, 20, 29, 40, 50)
- **Rich Summary** mit Brutto/Netto, AE-Total, Soll-Vergleich, 10h-Status (ArbZG)
- **Protokoll-Export** als Klartext (Kopieren) oder PDF (Print, A4 quer)
- **Verlauf der letzten 14 Tage** mit erneutem Protokoll-Export
- **Light / Dark Mode** mit automatischer Erkennung
- **iOS Home-Screen-fähig** (PWA-Meta-Tags, Safe-Area, eigenes Icon)
- **Speicher im Browser** (LocalStorage), Bundesland persistent über alle Tage

---

## Anleitung

### Schritt 1 — Bundesland wählen

<img src="docs/screenshots/01-step1-bundesland.png" alt="Step 1: Bundesland" width="360" align="right">

Beim ersten Öffnen ist die Auswahl Pflicht — ohne Bundesland geht es nicht weiter (für die korrekte Feiertagsberechnung). Die Wahl bleibt für alle künftigen Tage gespeichert.

Im Header oben rechts taucht nach der Auswahl ein kleines Pill mit dem Kürzel (z.B. **NW**) auf — Klick darauf bringt dich später jederzeit zurück zu Schritt 1, um zu ändern.

<br clear="all">

### Schritt 2 — Bereitschaft?

<img src="docs/screenshots/02-step2-bereitschaft.png" alt="Step 2: Bereitschaft" width="360" align="right">

**Nein** → Tag startet um **06:30**
**Ja** → Tag startet um **09:00**

Die Startzeit kannst du im nächsten Schritt noch frei anpassen.

<br clear="all">

### Schritt 3 — Datum, Startzeit, Anzahl Aufträge

<img src="docs/screenshots/03-step3-datum-wochenende.png" alt="Step 3: Datum" width="360" align="right">

**Datum** ist automatisch *heute*, lässt sich aber frei wählen — wichtig fürs Erfassen vergessener Tage. Direkt darunter siehst du:

- den **Wochentag**
- bei Wochenende oder Feiertag einen **Hinweis-Tag**
- bei Bereitschaft + Sa/So/Feiertag den grünen Hinweis **„ohne An-/Abfahrt-Abzug"**

**Aufträge heute** legt fest, wie viele Auftrags-Karten in Schritt 4/5 erzeugt werden.

<br clear="all">

### Schritt 4 — SAP-Nummern und Splits

<img src="docs/screenshots/04-step4-sap-splits.png" alt="Step 4: SAP" width="360" align="right">

Pro Auftrag eine **SAP-Nummer** eintragen. Falls Splits relevant sind (Kostenstellen / Tätigkeitsschlüssel), eines oder mehrere aus **10, 11, 20, 29, 40, 50** auswählen. Jeder gewählte Split bekommt im nächsten Schritt eine eigene Zeile zur AE-Eingabe.

<br clear="all">

### Schritt 5 — AE-Werte erfassen und Protokoll erzeugen

<img src="docs/screenshots/05-step5-auftraege.png" alt="Step 5: Auftrag-Karten" width="360" align="right">

Pro Auftrags-Karte:

- **Auftrags-Titel** (klickbar zum Umbenennen — SAP-Nummer ist Default)
- **Reisezeit** (Schalter aktiviert die Eingabe, Standard 0,5 AE)
- **Arbeitszeit** — pro Split eine eigene Zeile, alle Zeiten in **AE** (1 AE = 10 min)
- **Rückzeit** zum nächsten Auftrag oder als Heimfahrt

Die berechneten Uhrzeiten links neben dem Eingabefeld aktualisieren sich live, ebenso die Übersicht ganz unten.

<br clear="all">

### Übersicht am Tagesende

<p align="center">
  <img src="docs/screenshots/07-summary.png" alt="Summary" width="380">
</p>

- **Zeit** — Brutto, Pause (automatisch), Netto-Arbeitszeit
- **AE-Werte** — Reise / Arbeit / Rück / Gesamt
- **Soll-Vergleich** — grün wenn 7:48h erreicht, gelb mit „+x" bei Plusstunden, sonst „−x bis Soll"
- **10h-Status** — Warnstufe bei Überschreitung der gesetzlichen Höchstarbeitszeit nach §3 ArbZG

Kleine **i-Icons** neben den Abschnitten geben Erklärungen zu den Fachbegriffen. Tap außerhalb schließt sie wieder.

### Aktionen am Ende

- **Kopieren** — vollständiges Klartext-Protokoll in die Zwischenablage (z.B. für Slack oder Mail)
- **Neuer Tag** — öffnet das Bestätigungs-Modal (siehe unten)
- **Als PDF** — druckt im A4-Querformat, optimiert für 1-seitige Ausgabe

---

## Neuer Tag starten

<img src="docs/screenshots/08-modal-reset.png" alt="Reset-Modal" width="360" align="right">

Klick auf **Neuer Tag** (oder das Banner „Daten vom letzten Mal wiederhergestellt" → „Neuer Tag starten →") öffnet das Bestätigungs-Modal.

Bei Bestätigung wird der aktuelle Tag **automatisch in den Verlauf archiviert**, sofern er bereits AE-Werte enthält. Bundesland, Theme und Verlauf bleiben erhalten.

<br clear="all">

## Verlauf

<img src="docs/screenshots/10-modal-verlauf.png" alt="Verlauf-Modal" width="360" align="right">

Das **Uhren-Icon** oben im Header öffnet den Verlauf. Listet die letzten 14 archivierten Tage mit Datum, Wochentag, ggf. Bereitschafts- und Feiertags-Badge, Anzahl Aufträge und Gesamt-AE.

Klick auf einen Eintrag zeigt das vollständige Klartext-Protokoll des Tages — direkt erneut kopierbar.

Ältere Einträge werden automatisch verworfen.

<br clear="all">

---

## Tech-Stack

- **Single-File HTML** — keine Build-Tools, keine Dependencies, keine externen Aufrufe
- **Vanilla JavaScript** (~1.300 Zeilen) — Vollständig im Inline-`<script>`
- **CSS Custom Properties** für Light/Dark-Theme
- **LocalStorage** für Persistenz (Tag, Verlauf, Bundesland, Theme)
- **PWA-Meta-Tags** für „Zum Home-Bildschirm" auf iOS / Android

### Lokal entwickeln

```bash
git clone https://github.com/marvdevlabs/arbeitszeit.git
cd arbeitszeit
python3 -m http.server 8000
# Browser: http://localhost:8000
```

Bearbeite einfach `index.html` und neu laden — kein Build-Schritt.

### Deployment

Live-Version läuft über **GitHub Pages** vom `main`-Branch. Push reicht.

---

## Logik im Kurzüberblick

| | |
|---|---|
| 1 AE | 10 Minuten |
| Sollarbeitszeit | 7h 48min (netto, ohne An-/Abfahrt und Pause) |
| Fester Abzug | 30 min Anfahrt + 30 min Abfahrt (entfällt bei Bereitschaft an WE/Feiertag) |
| Pause (auto) | 0 min bei < 6h Arbeit / 30 min bei 6–9h / 45 min bei > 9h |
| Höchstarbeitszeit | 10 h inkl. An-/Abfahrt (§3 ArbZG) |
| Splits | 10, 11, 20, 29, 40, 50 |

### Feiertage je Bundesland

Bundesweit: Neujahr · Karfreitag · Ostermontag · 1. Mai · Christi Himmelfahrt · Pfingstmontag · Tag der Deutschen Einheit · 25. & 26. Dezember.

Länderspezifisch (Auszug):

- **BW, BY, ST:** Heilige Drei Könige
- **BW, BY, HE, NW, RP, SL:** Fronleichnam
- **BW, BY, NW, RP, SL:** Allerheiligen
- **BY, SL:** Mariä Himmelfahrt
- **BE, MV:** Internationaler Frauentag
- **BB:** Ostersonntag · Pfingstsonntag
- **SN:** Buß- und Bettag
- **TH:** Weltkindertag
- **BB, HB, HH, MV, NI, SN, ST, SH, TH:** Reformationstag

Berechnung der beweglichen Feiertage via Gauß'scher Osterformel — funktioniert für jedes Jahr ohne Tabellen.

---

## Lizenz

Privates Projekt — kein offizielles Bahn-Tool. Nutzung auf eigenes Risiko, ohne Gewähr für die Korrektheit der Berechnungen.
