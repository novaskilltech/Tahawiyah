# RESCUE MEMORY

## 2026-09-15 — Cartes de révision exportées

- **Défaut :** le texte des cartes PNG/JPEG dépassait du panneau central ; la police de l’export ne correspondait pas au site.
- **Cause racine :** l’ancien SVG utilisait des coordonnées et quatre lignes fixes, sans mesurer les glyphes ni réserver la hauteur nécessaire aux passages longs et aux harakāt.
- **Correction :** composition Canvas 1200 × 1500, mesure des lignes, taille ajustée par zone, polices adaptées aux éditions arabe et française, panneaux à marges définies.
- **Validation :** syntaxe JavaScript, cohérence des 20 unités ; inspection visuelle des exports `knowledge-limits` en français, `dead-signs` en arabe et en français, `throne-angels` en français ; contrôle du contenu des 20 cartes sur mobile.
- **Leçon / watchlist :** tout nouveau format de carte doit être vérifié avec le titre le plus long, le passage le plus long, trois repères et des harakāt avant publication.
