# Décisions — fondations pédagogiques

## Contenu et exécution

`curriculum/llm-nsi.json` reste le référentiel des douze modules conçus. `curriculum/missions/manifest.json` référence uniquement les missions implémentées. Une définition versionnée porte objectifs, explication, expérience, variantes de niveau, code initial, tests et transfert. Seule M03 a une définition ; les autres stations ne deviennent pas jouables du fait de leur présence dans le référentiel.

`src/mission-engine.js` ne dépend ni du DOM ni de Babylon. Il calcule `unimplemented`, `locked`, `available`, `in_progress`, `completed`. Les prérequis NSI restent des compétences affichées ; `moduleDependencies` déclare séparément les dépendances de missions et interdit les cycles. L'atelier M03 est autonome, sans prérequis artificiel vers une station non implémentée. Une future station requiert une définition et une expérience/UI adaptée ; elle réutilise progression et évaluateur sans copier une station entière.

`src/learning-ui.js` adapte M03 à un panneau du jeu. La scène fournit seulement ouverture/fermeture et actualisation du statut. `src/tokenisation-model.js` compare les blancs Python et une simulation manuelle : regroupement des lettres/chiffres, ponctuation séparée, pièce connue la plus longue, puis repli par point de code inconnu. Aucune fusion apprise, aucun BPE industriel, aucune estimation de contexte réel. La casse et les accents sont conservés, les blancs omis. Le vocabulaire jouet expose les pertes liées à `<UNK>` ; même sans inconnu, le décodage ne restitue pas la mise en forme. Première : tokeniser ; Terminale : tokeniser, encoder et decoder.

## Réussite et confidentialité

Les cinq étapes se réalisent dans l'ordre. Quatre réponses distinguent mot/token/sous-mot/ID. L'expérience exige une prédiction enregistrée avant observation, deux textes distincts dont le témoin et deux interprétations correctes. Une prédiction erronée est admise : l'enjeu est de la confronter aux résultats. Python passe les contrats publics. Le transfert conserve une note libre et quatre critères déclarés par l'élève. Une longueur de 80 caractères et des cases cochées vérifient la présence d'un dossier, pas sa qualité sémantique. Le statut interne `completed` signifie parcours réalisé par autoévaluation, sans certification de maîtrise ni validation enseignante automatique. Les deux niveaux ont des progrès indépendants. Rien dans le client n'est anti-triche.

Stockage `nexus.progress.v2` : version, étapes, tentatives et dossier (prédiction, textes observés, note et grille de transfert). Nouveau `nexus.m03.drafts.v1` : brouillons Python par niveau, y compris brouillon vide ; aucun nom demandé. `src/draft-store.js` ne fait aucune requête réseau. Modification : sauvegarde immédiate ; rechargement : restauration ; reset : confirmation native, uniquement ce niveau. Refus/quota : mémoire et avertissement. JSON corrompu : aucune réécriture automatique ; un reset confirmé autorise la réparation du fichier de brouillons, en conservant les autres brouillons encore présents en mémoire. Un JSON illisible ne permet pas de récupérer le texte qu'il contenait. Ces clés sont séparées : un reset de code n'efface pas la progression.

Migration M03.1 : version du contrat Python conservée à 1, `pedagogyRevision` passe à 2. Les anciennes étapes sont archivées dans `previousSteps`, les tentatives conservées et la réussite `programmer` + `tester` devient `pythonValidated`. Les nouvelles preuves de compréhension/expérience/transfert sont exigées. Après la nouvelle expérience, l'ancien succès Python est réutilisé, sans annoncer de nouvelle exécution. Les autres modules ne sont pas affectés. L'ancien `nexus.mission01.v1` reste conservé mais ignoré. Les anciennes versions n'enregistraient aucun brouillon : il n'y a donc aucun code à migrer de leur mémoire perdue.

LocalStorage n'est pas chiffré, reste accessible aux scripts de cette origine et peut être effacé par le navigateur. Pas de transmission applicative de code ou dossier, pas d'export automatique ni de synchronisation. L'exécution volontaire d'un code Python hostile peut accéder à JS/réseau : le logiciel n'est pas un pare-feu d'exfiltration.

## Python et limites de sécurité

Worker neuf par tentative, namespace Python neuf, tests chargés depuis le catalogue local, comparaison des résultats par l'hôte JS. Une sortie `MISSION_VALIDEE` ne valide rien. Limites : code 32 768 caractères, sorties bornées, chargement 60 s puis calcul 12 s, terminaison sur annulation/changement de niveau/fermeture. ID courant vérifié pour chaque message ; ready dupliqué ne prolonge pas le délai ; erreur d'envoi/création termine la tentative. L'UI utilise aussi un compteur de tentative pour rejeter les callbacks obsolètes, sans bloquer les commandes. Les erreurs proposent une piste (syntaxe/type/noms/boucles/connexion), puis le détail, pas une solution automatique. Le Worker est une protection de réactivité, pas une sandbox pour code malveillant. CDN Pyodide 0.27.7 ; auto-hébergement à prévoir.

Le chargement du curriculum/manifest/mission a un délai de 15 s, vérifie la structure attendue et offre une reprise explicite. Les actions pédagogiques et le code restent désactivés jusqu'au chargement complet. Les erreurs ne remplacent pas l'Atrium.

## Vérification et maintien du prototype

Tests moteur : ordre, niveaux, versions, reprise, stockage indisponible, dépendances/cycles. Tests navigateur : vraie scène et Python, erreurs, timeout, reprise, captures portrait/paysage/desktop. Aucun changement de style 3D. Les budgets GPU et FPS restent non validés sur appareil réel ; le nombre élevé de maillages impose une phase de profilage avant extension artistique.
