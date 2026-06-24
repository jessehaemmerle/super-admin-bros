# SUPER ADMIN BROS. — Game Design Document & Build-Spec

> **Zweck dieses Dokuments:** Vollständige, implementierbare Spezifikation für Claude Code, um ein 2D-Jump'n'Run im Stil von Super Mario zu bauen. Thema: der Büroalltag eines IT-Mitarbeiters in einem KMU. Das Dokument enthält Tech-Stack, konkrete Physik-Werte, Dateistruktur, Asset-Spezifikation, Level-Aufbau und einen schrittweisen Build-Plan. Am Ende steht ein fertiger Übergabe-Prompt.

---

## 1. Pitch (ein Satz)

Du spielst **Hank**, den letzten verbliebenen IT-Mitarbeiter eines 80-Mann-KMU, und kämpfst dich durch sechs Welten vom Großraumbüro bis in die Chefetage, um den Feierabend zu erreichen, bevor das ungepatchte Legacy-System die ganze Firma lahmlegt.

---

## 2. Zielplattform & Tech-Stack

**Empfehlung: Phaser 3 + Vite + TypeScript.**

Begründung: Phaser 3 bringt Arcade-Physics, Tilemap-Support, Sprite-Animationen und Audio mit — also genau die Bausteine eines Plattformers, ohne dass die Engine selbst geschrieben werden muss. Vite gibt schnelles HMR, TypeScript verhindert die typischen `undefined`-Fehler bei Game-State-Logik.

```
Engine:      Phaser 3 (3.80+)
Build-Tool:  Vite
Sprache:     TypeScript
Physik:      Arcade Physics (eingebaut)
Tilemaps:    Tiled (.tmj / JSON), via Phaser geladen
Audio:       Phaser Sound (WebAudio)
Deployment:  statisches Bundle (npm run build) -> beliebiger Webserver
```

Alternative, falls bewusst dependency-frei: reines HTML5 Canvas + Vanilla JS in einer einzigen Datei. Dann muss die Physik (Gravitation, AABB-Kollision, Tilemap-Auflösung) selbst geschrieben werden. Für einen sauberen, erweiterbaren Build ist Phaser der deutlich kürzere Weg — diese Spec geht von Phaser aus.

**Auflösung:** 480×270 interne Render-Auflösung (16:9), per `scale.mode = FIT` hochskaliert. Pixel-Art-Look via `pixelArt: true` und `roundPixels: true`.

---

## 3. Dateistruktur

```
super-admin-bros/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── public/
│   └── assets/
│       ├── sprites/        # Hank, Gegner, Power-Ups (PNG-Spritesheets)
│       ├── tiles/          # Tileset-PNGs pro Welt
│       ├── tilemaps/       # Tiled-Exports (.tmj)
│       ├── audio/          # SFX + Loops (ogg + mp3 Fallback)
│       └── ui/             # HUD-Grafiken, Font
└── src/
    ├── main.ts             # Phaser-Game-Config, Szenen-Registrierung
    ├── config.ts           # zentrale Konstanten (Physik, Tuning)
    ├── scenes/
    │   ├── BootScene.ts     # lädt minimale Assets, setzt Skalierung
    │   ├── PreloadScene.ts  # lädt alle Assets, zeigt Ladebalken
    │   ├── MenuScene.ts     # Titelbildschirm
    │   ├── GameScene.ts     # Haupt-Gameplay (lädt jeweils ein Level)
    │   ├── HudScene.ts      # parallele UI-Szene (Uhr, Leben, Score)
    │   └── GameOverScene.ts
    ├── entities/
    │   ├── Player.ts        # Hank: Bewegung, States, Power-Up-Logik
    │   ├── Enemy.ts         # Basisklasse
    │   ├── enemies/
    │   │   ├── Ticket.ts
    │   │   ├── Printer.ts
    │   │   ├── PhishingMail.ts
    │   │   └── ClumsyUser.ts
    │   └── PowerUp.ts
    ├── systems/
    │   ├── ClockSystem.ts   # Feierabend-Uhr (14:00 -> 17:00)
    │   ├── ScoreSystem.ts
    │   └── SaveSystem.ts    # localStorage: Highscore, freigeschaltete Welten
    └── levels/
        └── levelData.ts     # Metadaten pro Level (Tilemap-Key, Welt, Boss?)
```

---

## 4. Core-Mechanik & Physik-Werte

Diese Werte sind Startwerte zum Tunen, kein Dogma. Einheit: Pixel und Pixel/Sekunde, intern bei 480×270.

| Parameter | Wert | Notiz |
|---|---|---|
| Gravitation | 1400 px/s² | gibt knackiges, „mario-iges" Fallen |
| Lauf-Geschwindigkeit (max) | 140 px/s | |
| Sprint-Geschwindigkeit (max) | 220 px/s | bei gehaltener Sprint-Taste |
| Beschleunigung (Boden) | 1200 px/s² | |
| Reibung (Boden) | 1000 px/s² | |
| Luft-Steuerung | 60 % der Bodenwerte | bewusste, aber spürbare Kontrolle |
| Sprungkraft | −430 px/s | initialer Impuls nach oben |
| Variabler Sprung | ja | Taste loslassen -> Aufstieg wird gekappt (×0,5) |
| Coyote-Time | 100 ms | Sprung noch kurz nach Verlassen der Kante |
| Jump-Buffer | 120 ms | Sprung-Eingabe kurz vor Landung wird gemerkt |
| Gegner-Stomp-Bounce | −250 px/s | Rückprall nach dem Plätten eines Gegners |

**Steuerung:** Pfeiltasten / WASD für Bewegung, Leertaste oder Pfeil-hoch für Sprung, Shift für Sprint, `Strg`/`X` zum „Feuern" (mit sudo-Blume). Optional Gamepad via Phaser-Gamepad-API.

**Spieler-States (State Machine):**
`idle → running → jumping → falling → hurt → dead`. Power-Up-Größe ist orthogonaler State: `small` / `big` / `sudo`.

---

## 5. Spielfigur: Hank

- **Klein-Hank** (`small`): Startzustand. Ein Treffer = Tod.
- **Groß-Hank** (`big`): nach Kaffee. Ein Treffer = zurück zu `small` mit kurzer Unverwundbarkeit (1,5 s Blinken).
- **sudo-Hank** (`sudo`): nach sudo-Blume. Kann `kill -9`-Projektile werfen (Feuerball-Äquivalent, prallt am Boden ab, killt einfache Gegner).

Treffer in `small` ohne Backup-Band = Tod. Mit Backup-Band: Respawn am letzten Checkpoint, Meldung „Restore successful".

---

## 6. Power-Ups

| Power-Up | Effekt | Visual |
|---|---|---|
| ☕ **Kaffee** | `small → big` | dampfender Becher |
| 🔥 **sudo-Blume** | `big → sudo`, schaltet `kill -9`-Projektil frei | Terminal-Prompt-Blume |
| ⭐ **Energy Drink** | ~8 s Unverwundbarkeit + erhöhtes Tempo, Gegner sterben bei Berührung | blinkende Dose |
| 💾 **Backup-Band** | +1 Leben (Extraleben) | Tape-Cartridge |

---

## 7. Gegner

| Gegner | Verhalten | Bekämpfbar durch |
|---|---|---|
| 🎫 **Ticket** (Gumba-Äquivalent) | läuft stur geradeaus, dreht an Wänden um | Stomp, `kill -9`, Stern |
| 🖨️ **Drucker** | stationär, schießt in Intervallen „Papierstau"-Projektile horizontal | `kill -9`, Stern (nicht stompbar) |
| ✉️ **Phishing-Mail** | fliegt in Sinuswellen auf den Spieler zu; bei Treffer 1,5 s „desorientiert" (invertierte Steuerung) statt Schaden | Stomp im Sprung, `kill -9` |
| 🧑‍💼 **Tollpatschiger User** | folgt langsam, lässt unter sich gelegentlich eine Plattform „verschwinden" | nicht direkt killbar — ausweichen / wegrennen |
| 🟦 **BSOD-Wand** (Stage-Hazard) | schiebt in Auto-Scroll-Leveln von links nach, sofortiger Tod bei Berührung | nur weglaufen |

**Gegner-Tuning:** Ticket-Speed 50 px/s, Phishing-Mail-Speed 80 px/s mit Amplitude 30 px, Drucker-Schussintervall 2,5 s.

---

## 8. Feierabend-Uhr (das Herzstück)

`ClockSystem` ersetzt den klassischen Countdown. Pro Level läuft eine In-Game-Uhr von **14:00 Richtung 17:00**.

- **Mapping:** reale 180 Sekunden Spielzeit = 3 In-Game-Stunden (1 reale Sekunde = 1 In-Game-Minute). Pro Level konfigurierbar.
- **Eskalation:** Ab „16:00" spawnen Tickets in kürzeren Intervallen und Gegner werden ~15 % schneller (Multiplikator auf alle Enemy-Speeds).
- **Erfolg:** Level vor „17:00" abgeschlossen -> **Überstunden-Bonus** auf den Score (je früher, desto mehr).
- **Misserfolg:** Uhr erreicht „17:00", bevor das Level geschafft ist -> Wechsel ins Bonus-/Strafe-Level **„Bereitschaftsdienst"** (dunkel, ein einziger langer Auto-Scroll-Korridor; Überleben gibt einen Teil des Scores zurück).

Die Uhr ist oben im HUD als digitale Anzeige plus dünner Fortschrittsbalken.

---

## 9. Level-Bausteine

- **VPN-Tunnel** statt Mario-Röhren: Spieler springt hinein (Pfeil-runter auf markiertem Tile), erscheint an verknüpftem Ausgang. Manche führen in Bonusräume (Teeküche, geheimes Backup-Lager).
- **Checkpoints:** „Commit-Punkte" — ein Git-Flaggen-Tile, das beim Berühren den Respawn setzt.
- **Levelende:** **Stechuhr** statt Fahnenstange. Je höher Hank beim Ausstempeln trifft, desto mehr Bonus-Punkte. Treffer ganz oben = „Ticket geschlossen ✅".
- **Sammelobjekte:** **Dokumentations-Seiten** (Münz-Äquivalent). 100 Stück = Extraleben. Vor dem Auditor-Boss nötig, um seine Paragraphen abzuwehren.

---

## 10. Die sechs Welten

| # | Welt | Gimmick | Boss |
|---|---|---|---|
| 1 | **Großraumbüro** | Tutorial; Kabelsalat als Hindernis, Stehpulte als Plattformen | – |
| 2 | **Serverraum** | „Boden ist Lava" = überhitzte CPUs; Sprünge über Racks | **Ransomware-Drache** |
| 3 | **Keller / Legacy-RZ** | düster, begrenzte Sicht; bröckelnde Hardware-Plattformen | – |
| 4 | **Die Cloud** ☁️ | Wolken-Plattformen verschwinden bei „zu hoher Rechnung" | **Der Auditor** |
| 5 | **Home Office** | Ablenkungen: Katze auf Tastatur, WLAN-Lag (kurze Steuerungs-Aussetzer) | – |
| 6 | **Chefetage** | finaler Aufstieg, vertikales Level | **Das ungepatchte Legacy-System** |

**Boss-Kurzbeschreibung:**

- **Ransomware-Drache** — verschlüsselt nach und nach Plattformen (sie werden zu „encrypted"-Tiles, nicht mehr betretbar). Drei Treffer auf seinen exponierten Kern, bevor das letzte Backup hochgegangen ist.
- **Der Auditor** — schießt NIS2-/GDPR-Paragraphen. Nur abwehrbar, wenn vorher genug Dokumentations-Seiten gesammelt wurden (jede geblockte Salve verbraucht Doku).
- **Das ungepatchte Legacy-System** (Endboss) — riesige fauchende Software-Bestie, „läuft ja, fass es nicht an". Drei Phasen; in der letzten ruft der Geschäftsführer per Voice-Over: *„Geht das auch bis Montag?"*

---

## 11. HUD

Parallele `HudScene` über der `GameScene`:

```
[☕x2]   DOKU: 037   SCORE: 14250        🕑 15:42  [████████░░]
```

Leben (Backup-Bänder) links, Doku-Zähler, Score, rechts die Feierabend-Uhr mit Fortschrittsbalken.

---

## 12. Audio (Platzhalter-Ansatz)

Damit der Build ohne Lizenz-Assets läuft: SFX prozedural via WebAudio oder freie CC0-Sounds (z. B. von freesound/kenney). Slots: Sprung, Stomp, Power-Up, Schaden, Münze/Doku, Boss-Treffer, Level-Clear, „17:00-Alarm". Musik: ein loopbarer Chiptune pro Welt-Set (kann zunächst Platzhalter sein).

---

## 13. Build-Plan (für Claude Code, in dieser Reihenfolge)

Inkrementell bauen und nach jeder Phase lauffähig halten:

1. **Gerüst:** Vite + Phaser + TS aufsetzen, Boot/Preload/Menu/Game-Szenen, leeres Level rendert, Kamera folgt einem Platzhalter-Rechteck.
2. **Player-Movement:** Hank mit Arcade-Physics, Lauf/Sprint/Sprung inkl. Coyote-Time, Jump-Buffer, variablem Sprung. Erst mit Platzhalter-Sprite.
3. **Tilemap-Pipeline:** ein Tiled-Test-Level laden, Kollisionslayer, Checkpoints, Levelende (Stechuhr).
4. **Gegner + Stomp:** Ticket-Basisgegner, Stomp-Mechanik, Schaden am Spieler, `hurt`/`dead`-States.
5. **Power-Ups + Größen-States:** Kaffee/sudo-Blume/Stern/Backup-Band, `kill -9`-Projektil.
6. **ClockSystem + HUD:** Feierabend-Uhr, Eskalation, Überstunden-Bonus, „Bereitschaftsdienst"-Fallback.
7. **Restliche Gegner + Stage-Hazards:** Drucker, Phishing-Mail, Tollpatschiger User, BSOD-Auto-Scroll.
8. **VPN-Tunnel + Bonusräume.**
9. **Welt 1 vollständig bauen** (echtes Level-Design statt Test-Level).
10. **Bosse:** Boss-State-Machine, zunächst Ransomware-Drache als Vorlage.
11. **SaveSystem + Welten-Progression + Menü-Politur.**
12. **Audio, Partikel, Juice** (Screenshake bei Stomp, Squash-&-Stretch beim Sprung).

**Definition of Done für den ersten spielbaren Stand:** Phasen 1–6 + 9 — ein komplettes, gewinnbares Welt-1-Level mit laufender Feierabend-Uhr.

---

## 14. Asset-Spezifikation (Platzhalter zuerst)

Solange keine finalen Pixel-Art-Assets existieren: einfarbige Rechtecke/Phaser-Graphics als Platzhalter, damit Gameplay vor Grafik steht.

- **Hank:** 16×24 px Sprite, Frames für idle (1), run (4), jump (1), fall (1), hurt (1). Spritesheet 16×24 pro Frame.
- **Tiles:** 16×16 px Grid. Ein Tileset-PNG pro Welt-Theme.
- **Gegner:** 16×16 (Ticket, Phishing-Mail), 16×24 (User), 24×24 (Drucker).
- **Power-Ups:** 16×16.
- **Font:** Pixel-Bitmap-Font fürs HUD (z. B. eine freie wie „Press Start 2P" als Web-Font oder Phaser-Bitmap-Font).

---

## 15. Tuning-/Erweiterungs-Ideen (nice-to-have, nicht MVP)

- Zwei-Spieler-Couch-Koop (Hank + ein zweiter Admin).
- Speedrun-Timer + Bestzeiten pro Level im localStorage.
- „On-Call"-Hard-Mode: Uhr läuft schneller.
- Easter Eggs aus dem echten Admin-Alltag (ein NAS, das noch Windows Server 2008 fährt; ein Drucker mit „PC LOAD LETTER").

---

## 16. Übergabe-Prompt für Claude Code

> Baue ein 2D-Jump'n'Run namens **„Super Admin Bros."** nach der beigefügten Spec (`SUPER_ADMIN_BROS_GDD.md`). Tech-Stack: **Phaser 3 + Vite + TypeScript**, Pixel-Art-Look, interne Auflösung 480×270 mit FIT-Skalierung.
>
> Halte dich an die Dateistruktur aus Abschnitt 3 und die Physik-Werte aus Abschnitt 4. Arbeite den Build-Plan aus Abschnitt 13 **inkrementell** ab und halte das Spiel nach jeder Phase lauffähig (`npm run dev` muss laufen). Nutze zunächst farbige Platzhalter-Grafiken (Phaser Graphics / Rechtecke), damit Gameplay vor Assets steht — finale Sprites kommen später.
>
> **Erstes Ziel (Definition of Done):** Phasen 1–6 plus ein vollständig spielbares, gewinnbares Level der Welt „Großraumbüro" mit funktionierender Feierabend-Uhr (14:00→17:00), Kaffee-Power-Up, Ticket-Gegnern mit Stomp-Mechanik und einer Stechuhr als Levelende.
>
> Schreibe sauberes, typisiertes, kommentiertes TypeScript. Zentralisiere alle Tuning-Werte in `src/config.ts`. Committe nach jeder abgeschlossenen Phase. Erkläre mir am Ende kurz, wie ich das Projekt starte und wie ich ein neues Level in Tiled anlege.

---

*Ende des Dokuments.*
