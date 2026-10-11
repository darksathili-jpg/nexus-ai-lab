# Audit initial — 11 octobre 2026

Branche : `art-direction/atrium-preproduction`, base `31a1f85`. Arbre initial propre. Aucun AGENTS.md trouvé dans le dépôt ou ses parents examinés. Inspection du référentiel, blueprint, sources, tests, workflows, documentation artistique, générateur GLB et historique récent.

## Présent et prévu

Présent : scène Babylon procédurale, sculpture GLB locale (316 440 octets), avatar externe avec repli, caméra orbitale avec rayon contre certains obstacles, collisions XZ balayées, joystick tactile, déplacement clavier, une station accessible par proximité, Python Pyodide dans un Worker arrêté après 12 secondes, trois assertions Python, indices et drapeau local de réussite. Carte des douze modules alimentée par JSON.

Prévu : douze séquences complètes, moteur de missions/prérequis, progression par activité, différenciation des exercices, transfert, streaming/LOD, avatar lycéen, pipeline artistique complet, validation pédagogique et performance sur Android réel. Le curriculum décrit des prérequis NSI, pas des dépendances entre modules.

## Preuves initiales

- `node tests/collision.cjs` : PASS.
- `node tests/collision-gate.cjs` : PASS, dont 200 balayages radiaux.
- `node tests/curriculum-gate.cjs` : PASS, douze modules conçus, un prototype partiel.
- `node tests/quality-gate.cjs` et `node tests/atrium-browser.cjs` : ÉCHEC avant lancement, `Cannot find module 'playwright'`. Aucune capture initiale produite à ce stade.

## Défauts et risques

- Aucun package/lockfile : tests navigateur non reproductibles localement. Regex FPS suréchappée dans le collecteur de captures.
- Assemblages preview/playable : omission de `academy.html` et `curriculum/`, malgré le contrat statique.
- Validation Python spécifique à tokenisation dans le Worker ; réussite attribuée sans compréhension, expérience ou transfert. Test public très limité ; aucun contrat d'encodage/décodage.
- Timeout de 12 secondes inclut le téléchargement initial de Pyodide ; risque de faux échec sur connexion scolaire lente. Worker navigateur = interruption utile, pas sandbox de sécurité : Python peut accéder aux API JS/réseau. Ne pas y traiter des secrets ni évaluer du code hostile en confiance.
- Babylon et loaders non figés ; avatar sur `master`, Pyodide 0.27.7 figé. Requêtes CDN externes (métadonnées réseau), disponibilité et chaîne de dépendances ; absence d'auto-hébergement/CSP/intégrité.
- Monolithe HTML mélange rendu, input, contenu et réussite. Clavier actif sur éléments autres que textarea ; pas de piège de focus ni Échap, touches/joystick pouvant rester actifs après perte de focus.
- Collisions XZ : zone limitée à ±19,5 alors que baies à ±30 ; architecture de décor non entièrement parcourable. Plateforme visuelle plus large que son collider ; pas de marche/escalier. Caméra : liste d'occlusion partielle, contraction du rayon à vérifier visuellement.
- Beaucoup de maillages et matériaux, parcours de tous les meshes par frame, raycast caméra avec recherche dans une liste, preserveDrawingBuffer ; qualité choisie au chargement, pas adaptation mesurée. Aucun budget Android démontré.
- Workflows preview déploient au push sans dépendre des gates ; génération GLB peut committer automatiquement. Aucun push/merge requis pour cette mission locale.

## Décision

Préserver scène, assets et commandes ; extraire progressivement mission/contenu/évaluation. Garder M03 `prototype-partiel` jusqu'à revue scientifique et test élève. Bloquer publication sur gates et documenter toute preuve navigateur indisponible. Les tests automatiques ne certifient ni l'art, ni la sécurité du code Python, ni la performance mobile réelle.

## Reprise navigateur après installation

Playwright 1.56.1 et Chromium 1194 installés ; serveur Python local sur 8765. `quality-gate` et `atrium-browser` passent : 734 maillages, GLB et texture du sol présents, aucune erreur collectée, captures desktop 1440×900 et mobile 390×844 dans artifacts/. Mesure logicielle SwiftShader : 3 FPS au relevé, pas une mesure Android. Regex FPS corrigée.
