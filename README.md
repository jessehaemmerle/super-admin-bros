# Super Admin Bros.

Hanks Mission, um den Feierabend zu retten! Ein 2D-Jump'n'Run im Retro-Stil:
IT-Admin Hank kämpft sich zwischen 14:00 und 17:00 Uhr durch Büro, Serverraum,
Netzwerk-Etage, Cloud und Rechenzentrum, stompt Tickets, weicht Druckern und
Phishing-Mails aus und stellt sich am Ende dem CEO — bevor die Uhr 17:00
schlägt und der Bereitschaftsdienst ruft.

Alle Grafiken und die komplette Chiptune-Musik werden zur Laufzeit prozedural
erzeugt (Pixel-Art per Phaser-Graphics, Sound per Web Audio API) — das Spiel
kommt ohne einzige Asset-Datei aus.

## Features

- 5 Level (Büro, Serverraum, Netzwerk-Etage, Cloud, Rechenzentrum) mit
  Parallax-Hintergründen
- Echtzeit-Uhr: 3 Minuten pro Level, Eskalation ab 16:00, Game Over um 17:00
- Power-Ups: Kaffee (groß), Sudo-Flower (kill -9-Projektile), Energy-Drink,
  Backup-Tape (+1 Leben), Hotfix (dreht die Uhr 20 Minuten zurück)
- Viren, die sich beim Stompen in zwei Mini-Viren aufteilen
- Server-Lüfter mit Aufwind und fahrende Plattformen (Lastenaufzüge)
- Combo-System beim Stompen, Doku-Seiten sammeln, Top-5-Highscores (localStorage)
- Shop zwischen den Leveln (Extra-Leben, Turbo-Schuhe, Feuerrate, Startschild)
- CEO-Bosskampf mit 3 Phasen
- 2-Spieler-Koop am selben Keyboard, Touch-Steuerung auf Mobilgeräten
- Geheimraum, VPN-Abkürzungen, Checkpoints

## Steuerung

| Aktion | Spieler 1 | Spieler 2 |
| --- | --- | --- |
| Bewegen | ← → oder A D | J L |
| Springen | ↑ / W / Leertaste | I |
| Sprint | Shift | – |
| Sudo-Feuer | Strg / X | Z |
| VPN nutzen | ↓ / S | K |

## Entwicklung

```bash
npm install
npm run dev       # Dev-Server auf http://localhost:5173
npm run build     # Typecheck + Produktions-Build nach dist/
npm run preview   # Produktions-Build lokal testen
```

Zum Testen einzelner Level: `?level=N` an die URL anhängen (z. B.
`http://localhost:5173/?level=4`), dann im Menü normal starten.

Docker:

```bash
docker compose up --build   # Nginx serviert den Build
```

## Tech-Stack

- [Phaser 3](https://phaser.io/) (Arcade Physics)
- TypeScript + Vite
- Web Audio API für Musik und Soundeffekte
