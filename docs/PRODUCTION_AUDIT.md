# Audit initial â€” 11 octobre 2026

Branche : `art-direction/atrium-preproduction`, base `31a1f85`. Arbre initial propre. Aucun AGENTS.md trouvÃ© dans le dÃ©pÃ´t ou ses parents examinÃ©s. Inspection du rÃ©fÃ©rentiel, blueprint, sources, tests, workflows, documentation artistique, gÃ©nÃ©rateur GLB et historique rÃ©cent.

## PrÃ©sent et prÃ©vu

PrÃ©sent : scÃ¨ne Babylon procÃ©durale, sculpture GLB locale (316 440 octets), avatar externe avec repli, camÃ©ra orbitale avec rayon contre certains obstacles, collisions XZ balayÃ©es, joystick tactile, dÃ©placement clavier, une station accessible par proximitÃ©, Python Pyodide dans un Worker arrÃªtÃ© aprÃ¨s 12 secondes, trois assertions Python, indices et drapeau local de rÃ©ussite. Carte des douze modules alimentÃ©e par JSON.

PrÃ©vu : douze sÃ©quences complÃ¨tes, moteur de missions/prÃ©requis, progression par activitÃ©, diffÃ©renciation des exercices, transfert, streaming/LOD, avatar lycÃ©en, pipeline artistique complet, validation pÃ©dagogique et performance sur Android rÃ©el. Le curriculum dÃ©crit des prÃ©requis NSI, pas des dÃ©pendances entre modules.

## Preuves initiales

- `node tests/collision.cjs` : PASS.
- `node tests/collision-gate.cjs` : PASS, dont 200 balayages radiaux.
- `node tests/curriculum-gate.cjs` : PASS, douze modules conÃ§us, un prototype partiel.
- `node tests/quality-gate.cjs` et `node tests/atrium-browser.cjs` : Ã‰CHEC avant lancement, `Cannot find module 'playwright'`. Aucune capture initiale produite Ã  ce stade.

## DÃ©fauts et risques

- Aucun package/lockfile : tests navigateur non reproductibles localement. Regex FPS surÃ©chappÃ©e dans le collecteur de captures.
- Assemblages preview/playable : omission de `academy.html` et `curriculum/`, malgrÃ© le contrat statique.
- Validation Python spÃ©cifique Ã  tokenisation dans le Worker ; rÃ©ussite attribuÃ©e sans comprÃ©hension, expÃ©rience ou transfert. Test public trÃ¨s limitÃ© ; aucun contrat d'encodage/dÃ©codage.
- Timeout de 12 secondes inclut le tÃ©lÃ©chargement initial de Pyodide ; risque de faux Ã©chec sur connexion scolaire lente. Worker navigateur = interruption utile, pas sandbox de sÃ©curitÃ© : Python peut accÃ©der aux API JS/rÃ©seau. Ne pas y traiter des secrets ni Ã©valuer du code hostile en confiance.
- Babylon et loaders non figÃ©s ; avatar sur `master`, Pyodide 0.27.7 figÃ©. RequÃªtes CDN externes (mÃ©tadonnÃ©es rÃ©seau), disponibilitÃ© et chaÃ®ne de dÃ©pendances ; absence d'auto-hÃ©bergement/CSP/intÃ©gritÃ©.
- Monolithe HTML mÃ©lange rendu, input, contenu et rÃ©ussite. Clavier actif sur Ã©lÃ©ments autres que textarea ; pas de piÃ¨ge de focus ni Ã‰chap, touches/joystick pouvant rester actifs aprÃ¨s perte de focus.
- Collisions XZ : zone limitÃ©e Ã  Â±19,5 alors que baies Ã  Â±30 ; architecture de dÃ©cor non entiÃ¨rement parcourable. Plateforme visuelle plus large que son collider ; pas de marche/escalier. CamÃ©ra : liste d'occlusion partielle, contraction du rayon Ã  vÃ©rifier visuellement.
- Beaucoup de maillages et matÃ©riaux, parcours de tous les meshes par frame, raycast camÃ©ra avec recherche dans une liste, preserveDrawingBuffer ; qualitÃ© choisie au chargement, pas adaptation mesurÃ©e. Aucun budget Android dÃ©montrÃ©.
- Workflows preview dÃ©ploient au push sans dÃ©pendre des gates ; gÃ©nÃ©ration GLB peut committer automatiquement. Aucun push/merge requis pour cette mission locale.

## DÃ©cision

PrÃ©server scÃ¨ne, assets et commandes ; extraire progressivement mission/contenu/Ã©valuation. Garder M03 `prototype-partiel` jusqu'Ã  revue scientifique et test Ã©lÃ¨ve. Bloquer publication sur gates et documenter toute preuve navigateur indisponible. Les tests automatiques ne certifient ni l'art, ni la sÃ©curitÃ© du code Python, ni la performance mobile rÃ©elle.

## Reprise navigateur après installation

Playwright 1.56.1 et Chromium 1194 installés ; serveur Python local sur 8765. `quality-gate` et `atrium-browser` passent : 734 maillages, GLB et texture du sol présents, aucune erreur collectée, captures desktop 1440×900 et mobile 390×844 dans artifacts/. Mesure logicielle SwiftShader : 3 FPS au relevé, pas une mesure Android. Regex FPS corrigée.
