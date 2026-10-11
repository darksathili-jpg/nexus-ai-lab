# NEXUS / AI LAB — Architecture cible et critères de livraison

> Statut : **plan d'architecture et contrats de qualité**, pas une certification du jeu existant.
> Produit : académie interactive LLM en français, niveaux Première/Terminale NSI, jeu 3D navigateur (ordinateur et Android).

## 1. Principe non négociable
La qualité pédagogique et scientifique précède la réalisation graphique. Les douze modules de `curriculum/llm-nsi.json` définissent le périmètre ; seuls les éléments portant `implementation: prototype-partiel` peuvent être présentés comme existants. Le prototype actuel ne couvre qu'une première activité de tokenisation.

## 2. Architecture logique et interfaces futures

| Domaine | Responsabilité | Contrat / jalon |
|---|---|---|
| Curriculum | Progression, prérequis, niveaux, mises en garde scientifiques | `curriculum/llm-nsi.json` + `tests/curriculum-gate.cjs` (existant) |
| Mission Engine | États `locked/available/in_progress/completed`, dépendances, reprise | À créer ; aucune réussite par simple visite |
| Python Lab | Exécution Pyodide Worker, timeout, tests d'élève | Prototype existant ; isoler les évaluations par mission, tests de robustesse nécessaires |
| Learning Analytics | Réussites, erreurs, tentatives, transferts | À créer ; stockage local par défaut, export explicite, minimisation des données |
| Game Core | Mouvement, collisions, caméra, interaction, animation | Prototype existant ; contrats automatisés incomplets |
| World Streaming | Zones et assets glTF optimisés, LOD, chargement progressif | À créer ; budget GPU/mémoire défini par appareil |
| Art Pipeline | Blender → glTF/GLB, UV, textures PBR, animations, licences | À créer ; assets originaux et droits documentés |
| UX / Accessibilité | Touches, tactile, clavier, sous-titres, contraste, réduction de mouvement | À créer ; tests Android réel et desktop |
| Quality Gate | Tests unitaires, navigateur, visuels, pédagogiques, performances | CI partielle ; preuve sur matériel réel obligatoire |
| Release | Version stable séparée de la préproduction, rollback, notes | À créer ; ne pas confondre branche de travail et version validée |

## 3. Definition of Done d'une station
- Objectif et prérequis explicites, terminologie scientifiquement exacte.
- Une visualisation interactive manipulable **et** une explication accessible sans la 3D.
- Une tâche Python à compléter, sans solution fournie d'emblée.
- Tests publics compréhensibles + tests de robustesse, feedback exploitable.
- Un exercice de transfert qui ne révèle pas immédiatement la méthode.
- Progression persistante et reprise, sans collecte nominative par défaut.
- Contrôles tactiles et clavier, absence de débordement en portrait.
- Scénarios de non-régression automatisés et vérification humaine des contenus.

## 4. Budgets de performance cibles (à mesurer, non atteints par déclaration)
- Android milieu de gamme : **30 FPS soutenus** pendant 3 minutes de déplacement, qualité adaptative.
- Ordinateur lycée : **60 FPS ciblés**, repli automatique si nécessaire.
- Aucune erreur de shader/WebGL en test ; pas de perte de progression.
- La taille des GLB, textures et scripts doit être mesurée et budgétée après profilage sur appareils représentatifs.
- Ne pas inférer les FPS Android des captures Chromium/SwiftShader en CI.

## 5. Phases de production et gates
1. **Fondations** : curriculum versionné, CI obligatoire, états de mission, reproductibilité. Gate : aucun test bloquant en échec.
2. **Vertical slice** : tokenisation complète (compréhension, expérience, Python, tests, transfert), avatar lycéen, scène 3D cohérente. Gate : revue scientifique et test élève sans aide.
3. **Chaîne de production** : assets Blender/glTF, rigging, animations, son, éclairage, LOD, licences. Gate : comparaison visuelle + performance mobile.
4. **Académie complète** : douze modules, déblocages, traces locales, évaluations et parcours différenciés. Gate : audit NSI et exactitude scientifique module par module.
5. **Préproduction → bêta** : accessibilité, sécurité, confidentialité, régressions, stabilité, tests multi-appareils et retour enseignants/élèves. Gate : validation formelle avant publication stable.

## 6. Risques actuels à traiter
- `index.html` monolithique : séparer progressivement rendu, input, mission, état et UI sans réécriture simultanée.
- Assets Babylon/Pyodide/avatar chargés via CDN : versions figées, intégrité, puis auto-hébergement pour déploiement fiable.
- Les panneaux 3D peuvent être géométriquement corrects mais visuellement illisibles : captures front/back et validation visuelle nécessaires.
- Collision XZ simplifiée : ni escalier ni collision caméra complète.
- Tests CI : ne prouvent ni photoréalisme ni conformité pédagogique.
- Les exercices Python exécutés en navigateur ne constituent pas une isolation de sécurité certifiée.

## 7. Politique de publication
Ne jamais fusionner ou déployer automatiquement une version candidate défaillante. La branche `art-direction/atrium-preproduction` reste expérimentale ; `main` n'est pas modifiée par ces travaux. Toute publication stable nécessite les gates automatiques **et** une revue humaine mobile/desktop et pédagogique.
