# M03.1 — consolidation et preuves d’exécution

Livraison locale du 11 octobre 2026, branche `review/m03-tokenisation`. Base `c7ac8e0`. Les quatre commits M03 initiaux sont conservés sans réécriture. Aucun push, merge, déploiement ou release effectué. `main` reste à `21ca554`, art-direction local à `c7ac8e0`. Les cinq workflows n’ont pas été modifiés ; aucun n’est déclenché au push sur cette branche selon leurs filtres actuels.

## 1. Défauts reproduits

L’[audit initial et ses critères](M03_1_AUDIT.md) distingue les reproductions des risques issus de l’inspection.

- La suite initiale passe, mais un oui/non correct et un clic de comparaison débloquent Python sans prédiction ni interprétation. Reproduit dans Chromium.
- Le brouillon disparaît au rechargement. Reproduit après saisie d’un marqueur distinct.
- Le QCM suffit au transfert dans le scénario initial exécuté ; aucune justification n’est demandée.
- Un `ready` tardif après annulation provoque une TypeError ; une sortie tardive atteint encore l’ancien callback. Reproduit avec un Worker contrôlé, puis couvert par les tests du runner.
- P sur une liste du panneau recharge le jeu en qualité medium et ferme la mission. Reproduit dans Chromium avant correction.
- Le début de `PRODUCTION_AUDIT.md` contient du texte réellement mal encodé. Corrigé en UTF-8 ; les citations du défaut dans le nouvel audit sont intentionnelles.

## 2. Corrections et raisons pédagogiques

Quatre questions remplacent le oui/non : mot comme unité de langue, sous-mot pouvant servir de token, ponctuation comme token, ID comme étiquette sans classement du sens. Les mauvaises réponses ne débloquent pas l’expérience.

L’expérience demande une prédiction avant affichage, l’observation de « chats ! », un deuxième texte distinct et deux interprétations correctes. Comparer seul ne valide rien. Le tableau expose unités, nombres, IDs, inconnus et listes décodées. Une prédiction erronée peut conduire à une bonne interprétation : elle n’est pas sanctionnée comme un échec définitif.

Exemple testé : split produit `["chats", "!"]`, soit deux unités ; la simulation produit `["chat", "s", "!"]`, soit trois. Avec le vocabulaire manuel, « chats » devient 0/<UNK> dans la première liste, tandis que les trois pièces simulées sont connues. Le décodage des IDs ne restitue ni une unité inconnue ni les blancs originaux.

La simulation prend des pièces fixées à la main, sans entraînement ni fusions apprises. Elle ne prétend reproduire BPE, WordPiece ou un tokenizer industriel. La diversité des tokenizers, le lien unités/IDs et les stratégies d’inconnus s’appuient sur les documentations primaires [Hugging Face](https://huggingface.co/docs/transformers/tokenizer_summary) et [Python str.split](https://docs.python.org/3/library/stdtypes.html#str.split). Ces sources justifient les distinctions scientifiques ; elles ne valident pas l’efficacité de cette séquence auprès d’élèves.

Python réel est conservé : huit cas Première, douze Terminale, avec Unicode, blancs, ponctuation, vide, encodage/décodage et inconnus. Les retours fournissent une piste (syntaxe, types, noms, boucles, connexion) puis le détail. La sortie `MISSION_VALIDEE` ne prouve toujours rien.

Le transfert demande une note sur « microchats, 🚀 » et deux modèles, puis une grille de quatre critères. La condition de 80 caractères et les cases cochées vérifient seulement qu’un dossier est constitué. Un texte dépourvu de sens peut satisfaire cette condition formelle : un test le vérifie et exige l’affichage « le logiciel ne certifie pas la qualité sémantique ». Le statut interne `completed` et les déblocages futurs signifient parcours réalisé, pas maîtrise certifiée. Il n’existe pas de validation enseignante authentifiée dans le logiciel.

## 3. Continuité, migration et robustesse

- Brouillons Python persistés séparément par niveau, y compris chaîne vide ; reset natif confirmé, sans effacer la progression ni le brouillon valide de l’autre niveau.
- Refus/quota : maintien en mémoire et message clair. JSON de brouillons corrompu : aucune réécriture automatique ; seul un reset confirmé autorise la réparation. Lecture d’une progression corrompue : aucune écriture automatique non sollicitée.
- `pedagogyRevision: 2` : anciennes étapes archivées, tentatives conservées, ancien succès Python conservé puisque le contrat reste version 1. Les nouvelles activités pédagogiques sont exigées. L’ancien succès est annoncé comme antérieur, jamais comme une exécution nouvelle.
- Prédiction, textes observés, note et grille enregistrés dans le dossier local, séparément du code. Pas de nom demandé, de synchronisation ni de requête applicative transmettant le code. Un marqueur de brouillon et de code exécuté est surveillé dans les requêtes du test navigateur : aucune occurrence.
- Tous les messages Worker vérifient l’exécution courante. Ready dupliqué ne repousse pas le délai ; création/envoi/chargement en erreur rendent une nouvelle tentative possible. Fermeture/changement de niveau annulent sans callback obsolète ; la fermeture indique explicitement « Exécution annulée ».
- Chargement pédagogique borné à 15 s, actions désactivées jusqu’au contenu complet, reprise après HTTP 503, JSON incomplet et timeout. Python garde 60 s de chargement puis 12 s de calcul. Limite de code : 32 768 unités UTF-16 JavaScript, présentées dans l’interface comme caractères.

Décisions et migrations détaillées dans [LEARNING_ARCHITECTURE.md](LEARNING_ARCHITECTURE.md).

## 4. Tests réellement exécutés

Windows, Node 22.13.1, Playwright 1.56.1, Chromium 1194 avec SwiftShader, Pyodide 0.27.7 réel via CDN, serveur Python sur 8765.

| Exécution | Résultat observé | Preuve |
|---|---|---|
| `npm test` final | PASS : huit scripts, syntaxe, collisions, curriculum, moteur/migration, courses Worker, brouillons et modèle comparatif | [Journal](evidence/m03-1/m03-1-unit-tests.log) |
| `npm run test:browser` sur la source | PASS : quatre gates ; scène, tactile, focus/Échap, pédagogie, vrai Python, brouillons, pannes et reprise | [Journal](evidence/m03-1/m03-1-source-tests.log) |
| Même suite avec `NEXUS_BASE_URL=http://127.0.0.1:8765/_playable/` | PASS : catalogue, définitions, Worker et 3D depuis le build en sous-répertoire | [Journal](evidence/m03-1/m03-1-build-tests.log) |
| Relance ciblée build après les derniers correctifs | ÉCHEC intermédiaire : attente Playwright arrêtée à 30 s | [Échec conservé](evidence/m03-1/m03-1-build-failure.log) |
| `node tests/learning-browser.cjs` build après correction des appels Playwright | PASS : assertions conservées, clavier P, annulation/retour/nouvelle tentative, cas Python et captures | [Relance](evidence/m03-1/m03-1-final-learning-build.log) |
| Comparaison de l’assemblage final à la source | PASS : 18 fichiers identiques octet par octet | Commande Python exécutée sur HTML, src, curriculum et GLB |
| `git diff --check` | PASS | Exécution après les modifications |

**Échec intermédiaire expliqué :** les options de `waitForFunction` étaient fournies dans son deuxième argument, réservé à la valeur transmise à la fonction. Les déclarations installées Playwright confirment la signature `(fonction, argument, options)`. Le délai explicite était ignoré, laissant 30 s, inférieur au maximum autorisé de chargement + calcul. Correction : `null` comme argument et délai dans les options. Aucun timeout du runner ni assertion du résultat « 12 s » n’a été retiré ou relâché. La relance ciblée passe. La suite source et la première suite complète du build avaient déjà passé ; la relance cible les changements ultérieurs et ce défaut du harnais.

Les tests couvrent réponses incorrectes, étapes non validables par clic, deux niveaux et leurs brouillons, code vide, reset annulé/confirmé, syntaxe, mauvaise solution, fausse sortie de succès, taille de code, vraie boucle infinie, annulation/fermeture/changement de niveau, Worker 503, contenu 503/incomplet, timeout de chargement, stockage refusé/quota/corrompu et migration. Les tests de courses utilisent des événements contrôlés ; les tests d’exécution utilisent Pyodide réel. Les prérequis d’une capture d’erreur sont une fixture explicitement injectée, pas une preuve de progression d’élève.

## 5. Captures et inspection

Toutes les résolutions 1440×900, 390×844 et 844×390 ont été testées et capturées. Le panneau défile ; plusieurs prises sont nécessaires. Captures finales inspectées : titres, comparaison, code, transfert et messages. Le décalage des ancres sous la barre fixe en portrait a été corrigé.

- [Compréhension desktop](evidence/m03-1/m03-1-desktop-understand.png).
- [Comparaison desktop](evidence/m03-1/m03-1-desktop-comparison.png) et [portrait](evidence/m03-1/m03-1-portrait-comparison.png).
- [Python et brouillon desktop](evidence/m03-1/m03-1-desktop-python.png).
- Erreur de syntaxe Python réelle : [desktop](evidence/m03-1/m03-1-desktop-error.png), [portrait](evidence/m03-1/m03-1-portrait-error.png), [paysage](evidence/m03-1/m03-1-landscape-error.png). Capture exécutée avec les deux premières étapes injectées comme fixture ; feedback de syntaxe et absence de débordement du texte vérifiés sur les trois résolutions. La capture portrait a été inspectée visuellement.
- [Expérience portrait](evidence/m03-1/m03-1-portrait-experiment.png).
- [Situation de transfert paysage](evidence/m03-1/m03-1-landscape-transfer.png) et [autoévaluation déclarée](evidence/m03-1/m03-1-landscape-review.png).
- [Atrium conservé](evidence/m03-1/atrium-desktop.png) et [diagnostics](evidence/m03-1/diagnostics.json).

La scène conserve 734 maillages, le GLB et la texture du sol. Les sources des assets, du rendu architectural et des collisions sont inchangées. La seule modification du module performance concerne la garde clavier pendant la mission. Aucun budget FPS matériel n’est certifié à partir de ces relevés logiciels.

## 6. Commits locaux

- `9322714` — courses/erreurs du runner et audit initial avec reproductions.
- `6b80e73` — stockage autonome des brouillons et tests de reset/corruption.
- `58dd1b0` — consolidation pédagogique, dossier, migration, ergonomie et tests.
- Un commit documentaire final rassemble ce rapport, les journaux, captures, correction d’encodage et fiche de revue. Aucun de ces commits M03.1 n’est poussé par cette mission.

## 7. Limites et recommandation

**M03.1 est candidate pour un petit pilote encadré sur ordinateur après relecture indépendante du contenu par un enseignant ; elle n’est pas prête pour un usage autonome généralisé ou une certification de référence.** Les préconditions techniques sont étayées par les gates ; l’efficacité pédagogique ne l’est pas encore. La [fiche de revue](M03_TEACHER_REVIEW.md) fournit une grille humaine et un protocole d’observation, pas une validation déjà obtenue.

Limites restantes : aucun élève ni enseignant indépendant observé dans cette session ; pas de lecteur d’écran ou clavier virtuel Android réel testé ; performances GPU mobiles non mesurées ; dépendances Babylon/loaders non figées, avatar externe et Pyodide sur CDN ; stockage local accessible aux scripts de la même origine, non chiffré, effaçable, sans export/synchronisation ; Worker non sandbox de sécurité pour code hostile ; autoévaluation non anti-triche ; étage/décor latéral/collisions XZ et angles de caméra hérités. Une navigation longue reste à mesurer avec des élèves et un téléphone physique.

Aucune nouvelle station n’a été développée. M03 reste `prototype-partiel`, les onze autres modules restent prévus. Les gates ne montrent aucune régression dans leur périmètre ; ils ne garantissent pas l’absence de défaut sur tous les matériels. Ne pas accélérer la production de modules ou d’assets avant retour de la revue et du pilote.
