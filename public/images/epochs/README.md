# Eigene Fotos für das Baujahr-Raten

Hier kannst du später Fotos ablegen, die statt der SVG-Zeichnung erscheinen sollen.

## Regeln

- **Nur Fotos verwenden, die du selbst gemacht hast oder die eine freie Lizenz haben**
  (z. B. auf https://commons.wikimedia.org: CC0, Public Domain, CC BY, CC BY-SA).
- Lizenz und Bedingungen **auf der Beschreibungsseite der Datei** nachlesen.
  Bei CC BY / CC BY-SA muss der Urheber genannt werden (die App zeigt ihn automatisch an).
- Kein Foto aus Immobilienportalen, Google-Bildersuche oder Social Media übernehmen.

## Ablauf

1. Datei hier speichern, z. B. `gruenderzeit.jpg` (am besten 1200 × 780 px, Verhältnis ca. 400:260).
2. In `src/data/epochs.json` bei der passenden Epoche `"photo"` eintragen:

```json
"photo": {
  "src": "/images/epochs/gruenderzeit.jpg",
  "alt": "Kurze Bildbeschreibung",
  "author": "Name des Urhebers",
  "license": "CC BY-SA 4.0",
  "sourceUrl": "https://commons.wikimedia.org/wiki/File:Beispiel.jpg"
}
```

3. Fertig. Urheber, Lizenz und Quellenlink erscheinen unter dem Bild.

So wird das Foto genutzt:

- Im **Quiz** erscheint das Foto (statt der Zeichnung) als Rätsel.
- In der **Erklärung** danach zeigt die App die Zeichnung mit den nummerierten Merkmalen (Marker passen nur zur Zeichnung).
- In der **Epochen-Übersicht** stehen Foto und Zeichnung untereinander.
