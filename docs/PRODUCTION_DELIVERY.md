# Livraison — fondations de production, 11 octobre 2026

> Rapport historique de la livraison M03 initiale. La consolidation M03.1 est décrite dans [son audit](M03_1_AUDIT.md) et l’architecture actualisée ; les limites ci-dessous décrivent l’état initial, pas les nouveaux brouillons et activités.

Branche de travail : `art-direction/atrium-preproduction`. Base : `31a1f85`. Aucun push, déploiement ou merge vers `main` effectué. Cette livraison améliore le prototype ; elle ne certifie pas une version commerciale.

## Étapes et commits locaux

| Étape | Modifications et preuves | Commit | Prochaine action |
|---|---|---|---|
| 0 — Audit | [Rapport initial](PRODUCTION_AUDIT.md), historique, curriculum, blueprint, scène/caméra/collisions/tactile/Python, workflows et dépendances examinés. Trois tests initiaux passent ; deux tests navigateur échouent faute de Playwright. | `e9602e3` (audit et stabilisation) | Conserver cet état initial comme référence, suivre les risques signalés. |
| 1 — Stabilisation | Playwright figé + lockfile, commandes reproductibles, regex FPS corrigée, carte/curriculum inclus dans les builds. Après installation, `quality-gate` et `atrium-browser` passent : GLB, texture de sol et scène réels, aucune erreur collectée. | `e9602e3` | Auto-héberger/figer les dépendances runtime après profilage et revue des licences. |
| 2 — Architecture | Catalogue de missions, moteur indépendant du rendu, étapes ordonnées, prérequis entre missions, cycles rejetés, progrès versionnés par niveau. Tests moteur PASS : reprise, stockage défaillant/corrompu, invalidation de version, verrouillage et déblocage. | `b3a7ccc` | Faire relire les contrats et définir les dépendances des futures missions avant leur implémentation. |
| 3 — Tranche TOKENISATION | Explication scientifique, expérience mots/IDs, vrai Python, tests publics et robustesse, transfert. Première : 8 cas ; Terminale : 12 cas avec encodage/décodage. Focus clavier, Échap, joystick et AGIR conservés/testés. CI bloquante avant preview. | `fe915a2` | Revue scientifique par enseignant, observation d'élèves et mesures sur Android réel avant extension aux autres modules. |

Le commit de la tranche ajoute aussi la normalisation des sauvegardes incohérentes et les tests associés au moteur. Les décisions sont documentées dans [LEARNING_ARCHITECTURE.md](LEARNING_ARCHITECTURE.md).

## Exécutions finales réelles

Environnement : Windows, Node 22.13.1, Playwright 1.56.1, Chromium 1194 en headless/SwiftShader, serveur Python sur `127.0.0.1:8765`, accès réseau aux CDN.

- `npm test` : PASS — syntaxe de toutes les sources et scripts inline, collisions historiques, balayages anticollision (dont 200 trajectoires), curriculum et moteur pédagogique.
- `npm run test:browser` : PASS — panneaux recto/verso au niveau géométrique, scène Babylon, sculpture GLB, texture du sol, interface mobile, expérience et Python Pyodide réels.
- Même suite sur le build assemblé à `http://127.0.0.1:8765/_playable/` via `NEXUS_BASE_URL` : PASS. Les JSON de missions et la carte sont inclus dans l'assemblage. Vérification des chemins en sous-répertoire.
- `node tests/learning-browser.cjs`, après le dernier correctif : PASS — cinq activités via l'interface dans chacun des deux niveaux, rechargement/persistance, séparation des progrès, mauvaise solution, fausse sortie `MISSION_VALIDEE`, erreur de syntaxe, boucle infinie arrêtée après 12 s, reprise et annulation. Le test couvre aussi le piège de focus et un catalogue HTTP 503 avec action Python désactivée.
- `node tests/quality-gate.cjs` enrichi : PASS — déplacement tactile effectif, interaction AGIR et fermeture avec Échap, dimensions du panneau et récompense sur mobile.
- Parsing des cinq workflows avec `yaml.safe_load` : PASS. `git diff --check` : PASS. Les workflows GitHub Actions eux-mêmes n'ont pas été exécutés dans cette session.

## Captures examinées

Captures Chromium finales, générées automatiquement puis inspectées. Le panneau est défilant ; les captures d'ouverture et de transfert montrent des positions de défilement différentes. Elles ne constituent pas un test d'utilisabilité sur téléphone physique.

- [Grand Atrium conservé — 1440×900](evidence/atrium-desktop.png).
- [Séquence pédagogique — desktop 1440×900](evidence/tokenisation-desktop.png).
- [Séquence pédagogique — portrait 390×844](evidence/tokenisation-portrait.png).
- [Transfert — paysage 844×390](evidence/tokenisation-landscape-transfer.png).
- [Diagnostics de rendu et empreinte de la capture](evidence/diagnostics.json).

Les captures initiales de l'audit ont été générées mais remplacées lors des relances ; les fichiers versionnés ci-dessus montrent la livraison finale. Un défaut d'accents introduit lors de l'édition via PowerShell a été détecté visuellement, corrigé puis les tests Python et captures ont été renouvelés.

## Limites et anomalies restantes

- **Une seule station implémentée.** M03 reste `prototype-partiel`. Les onze autres modules sont conçus, non jouables. Le moteur sait gérer leurs futures dépendances ; cela ne les implémente pas.
- Le transfert est un QCM contextualisé, pas une justification libre corrigée. Compréhension/expérience et pertinence pédagogique nécessitent encore observation d'élèves et revue enseignant.
- Les progrès survivent au rechargement, les brouillons de code restent seulement en mémoire. Aucun export/synchronisation des progrès livré. L'ancienne réussite ne valide pas automatiquement la nouvelle séquence.
- Runtime externe : Babylon/loaders non figés, avatar sur `master`, Pyodide figé mais sur CDN. Offline et intégrité/auto-hébergement non livrés. Un chargement initial dépassant 60 s demande une nouvelle tentative.
- Pyodide dispose des API JS/réseau. Le Worker garantit l'interruption du calcul, pas une isolation de sécurité certifiée pour code hostile ni une évaluation anti-triche.
- **Performance non validée sur matériel réel.** Relevé final : 734 maillages, environ 7 FPS dans SwiftShader en qualité basse ; aucune extrapolation Android. Le rendu reste un prototype artistique.
- Collisions au sol limitées en XZ ; décor latéral et étages non parcourables, escaliers non simulés, collider du socle plus petit que son volume décoratif. Caméra et signalétique 3D à vérifier sous tous les angles sur appareil réel ; les assertions de panneaux ne certifient pas leur lisibilité.
- Gates locaux verts ; exécution CI Linux et comportement du déploiement modifié restent à confirmer sur GitHub. Aucun gate n'a été désactivé pour obtenir ces résultats.

Priorité recommandée : revue pédagogique de M03 et campagne Android/clavier/tactile avec profilage GPU, puis résolution des dépendances CDN et des collisions/angles de caméra avant production artistique ou ajout de stations.
