# NEXUS / AI LAB

Académie LLM en français pour Première et Terminale NSI. Le Grand Atrium est un jeu Babylon.js existant ; TOKENISATION est la seule station pédagogique implémentée. Les onze autres modules sont des projets décrits dans le référentiel. La tranche actuelle reste un prototype partiel en attente de revue pédagogique et de tests sur appareil réel.

Pour lancer depuis la racine :

```sh
npm ci
npx playwright install chromium
python -m http.server 8765 --bind 127.0.0.1
```

Ouvrir `http://127.0.0.1:8765/`. ZQSD/WASD/flèches : déplacement ; souris ou geste sur le canvas : caméra ; E près de la console ou AGIR sur mobile : interaction. Le bouton « accès accessible » ouvre le même atelier sans déplacement 3D. Échap ferme l'atelier. La carte des modules est disponible sur `academy.html`.

Dans un autre terminal, serveur actif pour les tests navigateur :

```sh
npm test
npm run test:browser
```

Le second groupe exécute Chromium, Babylon et Python Pyodide réels, puis écrit les captures dans `artifacts/`. Il nécessite l'accès aux CDN. `NEXUS_BASE_URL` permet de tester un build dans un sous-répertoire (URL terminée par `/`). Les mesures SwiftShader ne certifient pas les FPS sur Android.

Progrès enregistrés localement par niveau ; aucun nom ni code élève sauvegardé. Les CDN reçoivent les métadonnées réseau habituelles. Le Worker Python est interruptible mais ne constitue pas une sandbox pour code hostile. Connexion nécessaire ; mode hors ligne non livré.

Décisions et limites : [audit initial](docs/PRODUCTION_AUDIT.md), [architecture pédagogique](docs/LEARNING_ARCHITECTURE.md), [plan de production](docs/ACADEMY_PRODUCTION_BLUEPRINT.md).
