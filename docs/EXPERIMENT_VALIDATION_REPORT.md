# M03.1 — validation de l’expérience, 11 octobre 2026

Branche de travail : `review/m03-tokenisation`, base `1aa79b3`. Aucun push, merge ou déploiement. Aucun changement du moteur Python, des tests pédagogiques, de la scène 3D ou de `main`.

## Diagnostic établi

Le signalement utilisateur est un blocage à 1/5 malgré les manipulations tentées. Il ne permet pas de conclure à une étape oubliée. Avant correction, un test Chromium avec dossier partiel réel (`prediction`, deux `observations`, étape `comprendre`) relève des réponses d’interprétation vides au chargement. Elles n’étaient jamais enregistrées dans le dossier. Les sélectionner correctement puis valider donne bien les étapes `comprendre`, `experimenter`, et active Python ; aucune erreur JavaScript n’est observée.

Deux défauts sont démontrés :

- Les réponses d’interprétation sont perdues au rechargement ou au changement de niveau, même si le reste du dossier est conservé.
- L’historique limité aux dix dernières comparaisons peut supprimer `chats !`, pourtant exigé pour valider. Onze comparaisons distinctes reproduisent cette perte et le retour au message générique, y compris après une validation antérieure.

Le message initial réunissait trois conditions sous une même consigne et ne permettait pas de voir laquelle échouait. C’est un défaut d’interface démontré. Aucun problème de réactualisation du moteur n’a été reproduit quand toutes les conditions sont réellement reconnues ; aucun problème de stockage n’a été observé dans ce scénario. Les gates couvrent séparément le stockage refusé, corrompu et plein.

L’état privé a été observé par instrumentation temporaire du fichier servi dans le navigateur de test, sans modification du fichier livré : `dossier.prediction`, `dossier.observations`, réponses DOM et `engine.record(...).steps`. Le journal utilise uniquement des données de fixture. Une reproduction complémentaire du code de référence a échoué avec `ECONNREFUSED` pendant l’interruption de session ; elle ne constitue pas une reproduction du défaut applicatif. Le serveur a ensuite été vérifié HTTP 200.

Le cas précis du navigateur utilisateur n’a pas été inspecté à distance. Après les changements, l’utilisateur indique **« tout fonctionne »**. Cela confirme le fonctionnement annoncé sur son poste, sans déterminer rétrospectivement laquelle des conditions était perdue dans son dossier initial.

## Correction

Quatre indicateurs près de la validation montrent en temps réel : prédiction enregistrée, texte initial comparé, deuxième texte distinct comparé et deux réponses correctes. Un clic refusé donne la liste exacte des conditions manquantes. Les diagnostics visibles indiquent seulement le niveau, le nombre de textes conservés, le nombre de réponses renseignées, le statut de l’expérience et la disponibilité du stockage ; aucun code ni texte personnel n’y est affiché.

Les réponses sont sauvegardées par niveau dans `evidence.interpretation`, puis restaurées si leurs valeurs correspondent aux choix du contenu. Le texte initial reste conservé dans l’historique borné à dix entrées ; les autres entrées sont distinctes. Des doublons dans un dossier ancien ne peuvent plus être comptés comme une deuxième observation.

Les quatre conditions et la compréhension restent obligatoires. La validation explicite marque `experimenter` et actualise Python. Sous le bouton Python, la raison du verrouillage est affichée avec un lien qui fait défiler et donne le focus à l’étape manquante. Pendant une exécution, le message décrit l’occupation ; après chargement échoué, il renvoie au rechargement du contenu.

Migration additive, sans changement de version ni invalidation des progrès ou brouillons. Les réponses jamais sauvegardées par l’ancienne version ne sont pas inventées. Si le texte initial était déjà évincé, une nouvelle comparaison est nécessaire et l’indicateur le signale. Le stockage refusé conserve le travail en mémoire et reste signalé.

## Vérifications

Environnement : Windows, Node 22.13.1, Playwright 1.56.1, Chromium headless avec SwiftShader, Pyodide réel via CDN, serveur local 8765.

- `npm test` : huit scripts exécutés, PASS ; [journal](evidence/experiment-validation/unit.log).
- `npm run test:browser` : PASS, six gates, résultat dans le [journal complet](evidence/experiment-validation/browser.log).
- Nouveau `tests/experiment-browser.cjs` : quatre scénarios (vierge/partiel × Première/Terminale), chacun exige 1/5 → 2/5, activation, conservation des réponses avant validation et des progrès après validation, plus de dix comparaisons sans perte du texte initial, puis succès Python réel et absence d’erreur JavaScript. Le dossier partiel comporte une réponse incorrecte pour vérifier que le stockage seul ne débloque rien. Le clic de comparaison répété sur le même texte ne remplit pas la condition de deuxième texte distinct.
- Même nouveau test sur `http://127.0.0.1:8765/_playable/` : PASS, quatre scénarios ; [journal](evidence/experiment-validation/build.log). Le fichier modifié d’interface est copié dans l’assemblage ; les 18 fichiers sont identiques octet par octet à la source. Pas de déploiement.
- Preuves initiales : [état interne avant correction](evidence/experiment-validation/before.log) et [reproduction complémentaire interrompue](evidence/experiment-validation/interrupted.log).
- `git diff --check` vérifié avant commit.

Captures : [quatre conditions validées desktop](evidence/experiment-validation/unlocked-desktop.png), [portrait](evidence/experiment-validation/unlocked-portrait.png), [paysage](evidence/experiment-validation/unlocked-landscape.png) et [Python prêt](evidence/experiment-validation/python-ready.png). Elles sont produites après un parcours réel, sans injection d’étapes validées. Desktop et portrait inspectés visuellement ; les trois résolutions ont une assertion d’absence de débordement horizontal.

## Essai utilisateur

Recharger `http://127.0.0.1:8765/` dans le même profil Chrome ; ouvrir TOKENISATION et choisir son niveau. Lire les quatre indicateurs, compléter les conditions signalées puis valider. À 2/5, Python doit être actif. Les réponses nouvelles et les brouillons se restaurent au rechargement.

Limites : le diagnostic rétrospectif du dossier utilisateur n’est pas disponible ; aucun test de matériel mobile réel supplémentaire effectué. Les validations locales et le retour utilisateur ne certifient pas l’absence de défaut sur tous les navigateurs ou matériels.
