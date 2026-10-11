# M03.3 — Gate de préproduction et protections de M03

11 octobre 2026, référence `review/m03-tokenisation` / `bf53395943f6a8785ede0860d22ee50565d2f22d`.

**État : conception proposée, validation humaine en attente.** Aucun nouveau modèle, export, rendu comparatif ou benchmark physique exécuté. Cette livraison comprend uniquement les cinq documents de `docs/art/`. Le plan M03.2 préexistant reste distinct et non implémenté.

## 1. Référence pédagogique à préserver

L'utilisateur indique avoir terminé M03 à 5/5 et obtenu 8/8 tests Python en Première. Cette réussite est une observation utilisateur ; cette mission ne lit pas son stockage local et ne la présente pas comme une nouvelle exécution automatisée. Les preuves historiques sont dans [M03.1](../M03_1_REPORT.md) et le [rapport avatar](../AVATAR_ANIMATION_REPORT.md).

Une intégration artistique future ne change ni contrat Python, ni conditions pédagogiques, ni révisions des progrès ou brouillons. Conserver `nexus.progress.v2` et `nexus.m03.drafts.v1`, leurs migrations et séparation Première/Terminale. Aucun reset de données pour faciliter une démo. Pyodide reste un Worker d'exécution, pas une sandbox certifiée contre du code hostile.

## 2. Gates successifs proposés

| Gate | Preuve requise | Blocage / statut actuel |
|---|---|---|
| G0 — Préproduction | Lecture et accord sur bible, inventaire, pipeline et budgets | **En attente humaine** ; aucun travail 3D autorisé par ces documents |
| G1 — Concepts avant modélisation | Plan coté, trois vues salle, silhouettes puis face/profil/dos personnage, matériaux ; décisions écrites | À produire seulement après feu vert ; accord salle ET personnage avant Blender |
| G2 — Volume et contrôle | Graybox autorisée, parcours actuel, caméra aux limites, collision/occlusion de chaque obstacle | Non exécuté ; refus si passages coupés, sol fictif ou caméra hors salle |
| G3 — Assets | Licence/provenance complète, hashes, budgets exportés, rapport validator sans erreurs et avertissements expliqués | Non exécuté ; asset sans droits établis refusé |
| G4 — Locomotion et interactions | Idle stable au chargement ; marche seulement sur déplacement ; arrêt touches/panneau/blur/onglet ; aucun redémarrage par frame ; E/AGIR et accès accessible | Ancien correctif documenté ; nouveaux assets devront repasser ces contrôles |
| G5 — Pédagogie et accessibilité | Suites source ET build, données existantes et vierges, deux niveaux, brouillons, Python, erreurs/reprise ; captures trois résolutions | Non relancé dans cette mission documentaire ; aucune nouvelle certification |
| G6 — Performance lycée | Mesures sur postes réels, jeux de données du protocole, comparaison au budget | Non exécuté ; SwiftShader insuffisant |
| G7 — Livraison | Revue des preuves, anomalies résiduelles acceptées et autorisation de publication distincte | Aucun push/merge/déploiement autorisé ici |

Un gate vert exige ses preuves, pas une case cochée par l'auteur. Une anomalie bloquante stoppe l'intégration ; un défaut connu reste dans le rapport même si certains tests passent.

## 3. Vérifications fonctionnelles futures

Commandes existantes à conserver : `npm test` et `npm run test:browser`. Tester aussi le build assemblé avec `NEXUS_BASE_URL` pointant vers son sous-répertoire, selon le protocole existant du dépôt. Ces commandes sont listées pour la future intégration ; **elles n'ont pas été exécutées pour cette préproduction sans changement applicatif**.

- Première et Terminale : parcours complet, réponse incorrecte conservant le travail, progression explicite et bouton Python accessible après prérequis ; Python réel correct, incorrect, syntaxe, timeout, annulation et nouvelle tentative.
- Reprise : progression 5/5 déjà acquise inchangée, brouillons distincts et même chaîne vide restaurés après rechargement ; stockage refusé/corrompu et reset volontaire seulement. Aucun code élève envoyé par l'application à un nouveau service.
- Mouvement : clavier ZQSD/WASD/flèches et joystick ; collisions balayées, touche contre obstacle sans marche sur place ; relâchement, blur, changement d'onglet et panneau. Caméra rotation/zoom et vue sur console sans masquage gênant.
- Interface : 1440 × 900, 390 × 844, 844 × 390 ; clavier seul, focus visible et contenu du focus dans le panneau, Échap, navigation et scroll jusqu'aux feedbacks, aucun chevauchement masquant les actions. Contraste texte DOM ≥4,5:1 et commandes ≥44 px ; texte/symbole en plus des couleurs.
- Scène : signalétique lisible recto/verso, avatar reconnaissable, pas de clipping du sol/accessoires ; screenshot avant/après avec même position, caméra, qualité et viewport. Capturer chargement, approche, panneau Python et feedback d'erreur. Une capture ne prouve pas une animation ou la persistance.
- Pannes : GLB/texture/Worker/CDN indisponible, chargement incomplet puis reprise, absence de nouvelle erreur JavaScript ; conserver l'accès pédagogique lorsque les conditions techniques existantes le permettent, expliquer précisément les limites restantes.

Les validations automatiques ne prouvent pas l'efficacité d'apprentissage auprès d'élèves. Maintenir la revue enseignante et le pilote encadré proposés par M03.1 ; aucune station supplémentaire n'est couverte.

## 4. Contrôle documentaire de cette mission

Inspection des sources, matériaux, ressources, contrôles et preuves existantes ; parsing descriptif du GLB ; consultation de sources primaires pour pipeline et licences. Aucun code applicatif modifié, aucune création d'asset définitif, aucun test navigateur nouveau ou mesure GPU revendiqué. Les cinq documents sont des propositions, pas un commit de fonctionnalités.

Avant remise : vérifier HEAD/branche inchangés, `git diff --check`, liste des fichiers modifiés limitée à ces documents et présence intacte du plan M03.2 déjà non suivi. Aucun commit/push nécessaire à cette livraison de conception, aucune modification de `main`.

## 5. Décisions nécessitant validation humaine — arrêt ici

1. **Salle** : accepter 40 × 68 × 18 m et le parcours de plain-pied compatible avec les contrôles actuels, ou autoriser une étude séparée pour un volume plus compact.
2. **Langage visuel** : approuver graphite/acier/titane et accents limités ambre/cyan ; remplacer le vocabulaire palatial par une architecture de maintenance.
3. **Banc central** : accepter un équipement de calcul/refroidissement identifiable, sans représentation trompeuse de « cerveau LLM ».
4. **Personnage** : valider la piste technicien-explorateur et demander les concepts avant modélisation ; choisir la politique de vitesse/locomotion avant création des clips.
5. **M03** : confirmer console physique + panneau DOM existant + accès accessible ; conserver les acquis et ne pas mélanger cette mission avec la refonte M03.2 en attente.
6. **Technique et droits** : choisir versions figées et responsables de provenance ; approuver un pipeline d'abord sans compression, codecs seulement après comparaison.
7. **Performance** : désigner les PC du lycée et le profil minimal ; accepter ou ajuster les budgets provisoires avant production.

**Arrêt obligatoire après cette préproduction. Attendre le feu vert de l'utilisateur avant concept visuel supplémentaire, création, modélisation ou intégration 3D.** Aucun feu vert artistique ne vaut autorisation de push, merge ou déploiement public.
