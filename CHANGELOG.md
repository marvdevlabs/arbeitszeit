# Changelog

Alle nennenswerten Änderungen am Arbeitszeit-Rechner sind hier dokumentiert.

Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
Versionierung nach [Semantic Versioning](https://semver.org/lang/de/).

---

## [1.26.0] — 2026-05-22

### Geändert
- **Abrechnungs-Check verlässt Beta-Status** — „Beta"-Badge auf dem Tool-Card entfernt.
- **Startseite jetzt zwingend**: beim Öffnen der App landet man immer auf der Toolbox-Startseite (nicht mehr automatisch im zuletzt genutzten Tool). Ausnahme: URL-Hash `#import=…` oder `#abrechnung` überschreibt.
- **Restore-Modal** für laufende Tageserfassung kommt jetzt erst beim aktiven Wechsel ins Tageserfassungs-Tool — nicht mehr störend auf der Startseite.
- **Debug-Sections weg**: „Erkannte Lohnarten pro Block" und „Extrahierter Roh-Text" werden nicht mehr angezeigt (Code für künftiges Debug entfernt — bei Bedarf via DevTools-Console).

### Hinzugefügt
- **Persönliche Daten** für Netto-Berechnung — neue ausklappbare Card im Abrechnungs-Tool:
  - Steuerklasse (I – VI), Kinderfreibeträge, Konfession (keine / ev / rk), Bundesland, KV-Zusatzbeitrag (%), kinderlos > 23 Jahre.
  - Wird **nur lokal** im `localStorage` gespeichert (Key `abr_personal_v1`), kein Versand.
  - Wird im Compare-Output als Cross-Check-Referenz angezeigt.
- **Steuern + Sozialversicherung** werden aus der Abrechnung extrahiert (Lohnarten 710/720/740/750/770/785/799/800) — über das `-`-Suffix als zuverlässigen AN-Abzugs-Marker.
- **Neue Section „5. Brutto → Netto"**: vollständige Monats-Aufstellung aus der Abrechnung mit allen Abzügen.
- **Neue Section „6. Bereitschafts-Netto (geschätzt)"**: applies die Netto-Quote aus der Abrechnung auf das Bereitschafts-Brutto — du siehst direkt, was vom Bereitschafts-Einsatz netto auf dem Konto landet.

### Geplant
- Vollständige eigenständige Netto-Berechnung (Lohnsteuer-PAP) für Szenarien ohne Abrechnungs-PDF — in einem späteren Release.

---

## [1.25.5] — 2026-05-22

### Behoben (Abrechnungs-Check)
- **Rufbereitschafts- und Nachtzulage-Faktor wurden nicht durch 100 geteilt** (zeigte „285,00 €/h" statt „2,85 €/h"). Ursache: meine `norm100()`-Funktion teilt nur Werte ≥ 1000. Stunden-Lohnarten haben Faktoren wie 285 (raw) = 2,85 €/h — die fallen durchs Raster. **Fix**: bei Rufbereitschaft/Nachtzulage IMMER durch 100 teilen (alle drei Werte sind hier in 1/100-Format).

### Geändert (Brutto-Schätzung komplett umgebaut)
- Statt „Gesamt-Brutto inkl. Grundgehalt" zeigt das Tool jetzt **nur das „Bereitschafts-Brutto"** — also was tatsächlich on top vom Grundgehalt durch Bereitschaftseinsätze und Zulagen dazu kommt:
  - **Detail-Tabelle** mit jeder Position (LRE1/2/3, Rufbereitschaft, Nachtzulage) und Rechnung `Anzahl × Faktor = Betrag`.
  - **Summenzeile** hervorgehoben.
  - **Vergleich** „Aus Liste erwartet" vs. „Tatsächlich gezahlt", mit Nachtzulage als separater Zeile (steht ja nicht in der Liste, kommt nur aus der Abrechnung).
  - **Ampel-Hinweis**: ✓ Passt / ⚠ Zu wenig / Etwas mehr.

### Hinzugefügt
- Pro Block-Sum jetzt auch die Beträge je Lohnart (`lre1Betrag` … `nachtBetrag`) gespeichert, dazu ein berechnetes Feld `bereitschaftsBrutto = Σ aller Bereitschafts-Lohnarten`.

---

## [1.25.4] — 2026-05-22

### Behoben (Abrechnungs-Check)
- **LRE2 wurde fälschlich als „2x" erkannt** statt 1x: die generische Heuristik (Multiplikations-Invariante) hat unter Umständen die falsche Permutation gewählt, und der `effectiveLine`-Fallback konnte Nachbarzeilen mit reinziehen. **Fix**: deterministische **exakte Regex** für die Standard-DB-Lohnart-Zeilen — keine Heuristik mehr, wenn der Standard-Form passt:
  - LRE: `\bLRE\s*([123])\s+243\s+(\d+)\s+(\d+)\s+(\d+)\b`
  - Rufbereitschaft: `Rufbereit\w*\s+314\s+(\d+)\s+ST\s+(\d+)\s+(\d+)\b`
  - Nachtzulage: `Nachtzulage\s+216\s+(\d+)\s+ST\s+(\d+)\s+(\d+)\b`
- Die generische `pickAnzahlFaktorBetrag()`-Heuristik bleibt als **Fallback** für Sonder-Layouts erhalten, springt aber nur ein, wenn die Exakt-Regex nichts gefunden hat (`block.X.cnt === 0`).

### Hinzugefügt
- **Debug-Section „Erkannte Lohnarten pro Block"** (ausklappbar) — zeigt für jeden gefundenen Abrechnungs-Block die rohen Werte (Anzahl, Faktor, Betrag, Brutto) pro Lohnart. Sehr nützlich zur Diagnose, wenn die Vergleichstabelle nicht stimmt.

---

## [1.25.3] — 2026-05-22

### Behoben (Abrechnungs-Check)
- **Stunden-Lohnarten (Rufbereitschaft 314, Nachtzulage 216) komplett falsch**: das Layout der Zeilen ist  `Bezeichnung Lohnart Anzahl ST Faktor Betrag Flags` — und die DB skaliert dort **alle drei** Zahlen mit /100 (z.B. `5300 ST 285 15105` → 53,00 Std × 2,85 €/h = 151,05 €). Vorher: 15105 wurde als Stunden interpretiert und 150 (aus dem Flag „N150") als Faktor.
- **Neues `pickAnzahlFaktorBetrag()`** testet jetzt **zwei Skalierungs-Hypothesen** (alle gleich vs. alle in 1/100) gegen die Invariante  Anzahl × Faktor = Betrag — Spaltenreihenfolge und Cent-Skalierung werden automatisch erkannt.
- **Sliding-Window 3er-Triples** statt nur `slice(-3)` — überspringt führende Lohnart-Codes und trailing-Flags (`N150 15105`).
- **Block-Marker doppelt gezählt**: `01.26/2` erscheint auf jeder Seite eines Abrechnungs-PDFs (Seitenkopf-Wiederholung) — meine Segmentierung hat das als zwei separate Blöcke behandelt und Brutto doppelt aufsummiert (4024,81 + 598,37 = 4623,18 statt 4024,81). **Fix**: Dedupe nach `(monat, jahr, n)`-Schlüssel, nur erstes Vorkommen behalten.
- **Brutto = YTD statt Monatsbrutto**: Zeile `Summe Bruttobetrag 699 61329 * 402481` hat ZWEI Werte — 61329 (Monat in Cent = 613,29 €) und 402481 (Jahr-bis-dato = 4024,81 €). Vorher: Max → YTD. **Fix**: erste Zahl direkt nach Lohnart-Code 699 nehmen.
- **Brutto-Regex zu großzügig**: `\bBrutto\b` matched auch „KV-Brutto", „Bruttoverz." etc. **Fix**: nur noch `\b699\b` als Trigger.

### Hinzugefügt
- **Bereitschafts-Liste**: hochwertiger Summen-Block direkt geparst — `Gesamtsumme LRE1 (Anzahl): 2`, `Zulagenberechtigende Rufbereitschaftszeit: 52.53` etc. Keine Schätzerei mehr.
- **hh.mm-Format-Parser** (`parseHourMinFormat`): „52.53" = 52h 53m → 52,883 Dezimalstunden (vorher als 52,53 dezimal interpretiert).
- **Zulageberechtigte Rufbereitschaftszeit** ist jetzt das **Vergleichs-Kriterium** statt der Gesamt-Rufbereitschaft — das ist die Zeit, die der DB tatsächlich vergütet (Gesamt − Arbeitseinsätze). Ein zusätzlicher Hinweis erklärt unter der Tabelle, welcher Wert verwendet wird.

---

## [1.25.2] — 2026-05-22

### Behoben
- **Abrechnungs-Werte falsch zugeordnet**: LRE-Zeilen wurden mit dem Faktor als Anzahl interpretiert (z.B. „7826 × LRE1" statt „2 × LRE1, Faktor 78,26 €"). Ursache: feste Annahme über Spaltenreihenfolge `[Anzahl, Faktor, Betrag]` — real ist's offenbar `[Faktor, Anzahl, Betrag]`. Außerdem extrahierte pdf.js Geldwerte teilweise als ganzzahlige Cents („7826" statt „78,26").
- **Neuer `pickAnzahlFaktorBetrag()`-Helper** nutzt die Invariante  Anzahl × Faktor = Betrag — Spaltenreihenfolge wird damit egal. Cents-Skalierung (Faktor + Betrag ≥ 1000, integer) wird automatisch erkannt und durch /100 normalisiert.
- **Rufbereitschaft & Nachtzulage** wurden teilweise nicht erkannt, weil Label und Zahlen visuell auf verschiedenen Zeilen lagen. Neuer **Multi-Line-Fallback** scannt bis zu 2 Folgezeilen, wenn die Label-Zeile selbst keine Zahlen enthält. Regex breiter: `Ruf[\s.\-]*bereit`, `Nacht[\s.\-]*zulage`.
- **Tarif-Sätze**: nur noch plausible Faktoren (0,50 € .. 999 €) übernommen, damit verirrte große Zahlen die Default-Sätze nicht überschreiben.
- **Brutto-Erkennung** ebenfalls mit Cents-Normalisierung.

---

## [1.25.1] — 2026-05-22

### Behoben
- **Monat-Erkennung** in Bereitschafts-Liste lieferte fälschlich „Mai 2002" zurück — eine Template-Versionierung am Seitenrand wurde fälschlich als Abrechnungs-Monat interpretiert.
- **`parseMonthFromText()`** komplett überarbeitet mit Prioritäts-Kette:
  1. `Summe Monat MM.YY` (stärkster Marker in Bereitschafts-Listen) — wird zuerst gesucht
  2. `Monat MM.YY` / `Monat: MM.2026` (allgemeiner Kontext-Marker)
  3. `Abrechnungs-/Bereitschafts-/Zeitraum-/Periode-…` mit MM.YYYY
  4. Freistehende MM.YYYY-Patterns
  5. Monatsname + Jahr (z.B. „Januar 2026")
  6. Fallback freistehendes MM.YY
- **Jahres-Plausibilitäts-Filter**: alle Treffer ausserhalb (aktuelles Jahr -5 bis +2) werden verworfen — schließt Template-Wasserzeichen, Footer-Copyright-Daten u.ä. zuverlässig aus.

---

## [1.25.0] — 2026-05-22

### Hinzugefügt
- **Abrechnungs-Check (Phase 2 + 3)** — vollständige clientseitige PDF-Auswertung:
  - **pdf.js v3.11.174** lazy-loaded von `cdn.jsdelivr.net`, mit SRI-Hash (sha384) für Library und Worker. Worker wird als Blob nachgeladen, gegen erwarteten SHA-384 verifiziert und nur dann via `blob:`-URL aktiviert — bleibt unter `worker-src 'self' blob:`.
  - **Text-Extraktion** mit Y-Bucketing (2-Pixel-Drift), damit Spaltenlayouts erhalten bleiben.
  - **Layout-Detektoren** (`looksLikeAbrechnung`, `looksLikeBereitschaft`) als erste Pflicht-Hürde.
  - **`parseAbrechnung()`** — block-aware: erkennt mehrere `MM.YY/N`-Blöcke (Hauptmonat + Nachzahlungen), aggregiert pro Monat, extrahiert Lohnarten 243 (LRE1/2/3), 314 (Rufbereitschaft), 216 (Nachtzulage), 699 (Brutto).
  - **Tarif-Sätze** werden direkt aus den Faktor-Spalten der Abrechnung gelesen — keine statische Tabelle nötig.
  - **`parseBereitschaft()`** — Monat-Erkennung, LRE1/2/3-Zählung (Tagesebene + Summen-Block), Gesamtstunden.
  - **`compareAbrBer()`** — Monat-Match, Diff-Tabelle, Brutto-Schätzung.
- **Vergleichs-UI** mit 4 Sections (Layout / Monat / Vergleichstabelle / Brutto-Schätzung) und Status-Badges (✓ ok / ⚠ warn / ✗ err).
- **Roh-Text-Sections** (collapsible `<details>`) für Transparenz und Debugging — User sieht genau, was der Parser ausgelesen hat.

### Sicherheit
- Worker-SRI manuell via `crypto.subtle.digest('SHA-384')` geprüft (Browser-SRI für `new Worker()` greift sonst nicht).
- `referrerPolicy: 'no-referrer'` und `credentials: 'omit'` für alle pdf.js-Fetches.

---

## [1.24.0] — 2026-05-22

### Hinzugefügt
- **Toolbox-Konzept** — neue Startseite mit Tool-Auswahl. App ist nicht mehr ein einzelner Workflow, sondern Plattform für mehrere Werkzeuge.
- **Tool 2 (Beta): „Abrechnung prüfen"** — Skeleton mit zwei Pflicht-Upload-Slots (Abrechnung + Bereitschafts-Liste), Privacy-Banner und Status-Feedback. PDFs werden ausschließlich im Browser-RAM gehalten, **nichts** geht ins Netzwerk oder in `localStorage`.
- **Tool-Switcher im Header** (`← Tools`) — überall außerhalb der Startseite sichtbar.
- Persistente Tool-Auswahl per `localStorage` (Key `arbeitszeit_tool_v1`) — App startet im zuletzt genutzten Werkzeug.

### Geändert
- Bestehende Tageserfassung (Steps 1–5) als „Tool 1" gekapselt — funktional unverändert.
- Step-Indicator und Bundesland-Pille im Header nur noch in Tageserfassung sichtbar.
- Init-Logik priorisiert in dieser Reihenfolge: URL-Hash (`#import=…`, `#abrechnung`) → laufende Tageserfassung → letztes Tool → Toolbox-Startseite.

### Geplant (Phase 2/3)
- pdf.js (lazy-loaded mit SRI) für clientseitiges PDF-Parsing.
- Layout- und Monatsabgleich der zwei PDFs.
- LRE1/2/3-Vergleich + Brutto-Schätzung mit automatischer Nachzahlungs-Block-Erkennung.

---

## [1.23.1] — 2026-05-20

### Geändert
- **Eigene Splits jetzt bis 999** statt 99 — `isValidSplit()` akzeptiert 1–999.
- Eingabefeld-Placeholder, Max-Attribut und Fehler-Toast entsprechend angepasst.

---

## [1.23.0] — 2026-05-20

### Hinzugefügt
- **Eigene Splits** pro Auftrag — zusätzlich zu den 6 Standard-Splits (10, 11, 20, 29, 40, 50) können beliebige Werte zwischen 1 und 99 eingegeben werden.
- Eingabefeld + „+ Hinzufügen"-Button pro Auftrags-Karte in Schritt 4.
- Custom-Splits erscheinen als **lila Pills mit ×** (zum Entfernen), damit sie von Standard-Splits visuell unterscheidbar sind.
- Validation: Werte außerhalb 1–99 oder Duplikate werden mit Toast abgelehnt.
- OCR-Parser und Sanitizer akzeptieren ebenfalls Werte 1–99 (vorher nur Standard-Liste).

### Geändert
- `SPLIT_OPTIONS` aufgeteilt in `STANDARD_SPLITS` + `isValidSplit(v)` (1–99).
- `isCustomSplit(v)` als Helper für Rendering.

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
