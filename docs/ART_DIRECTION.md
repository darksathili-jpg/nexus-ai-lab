# NEXUS / AI LAB — Direction artistique et validation

## Référence artistique
L'illustration du Grand Atrium fournie par le commanditaire est la cible de composition et d'ambiance. **Elle est un concept art, pas une capture du moteur.** L'image source sera ajoutée au dépôt seulement après vérification de sa provenance et des droits de redistribution.

## Contrat visuel
- Véritable jeu 3D à la troisième personne, avatar texturé et animé, caméra derrière le personnage.
- Atrium monumental à deux niveaux visibles, passerelles, escaliers, végétation, verre, métal et sols polis.
- Cerveau holographique animé dans un anneau central, éclairage cyan, violet et ambre.
- Salles identifiables : Données, Tokenisation, Embeddings, Transformers, Entraînement et Génération.
- Géométrie 3D réelle pour les éléments explorables, modèles glTF/GLB et matériaux PBR.
- Images raster WebP/AVIF pour panoramas et habillages ; **aucun SVG comme substitut à un décor ou personnage 3D**.
- UI discrète en exploration ; éditeur Python lisible uniquement lors des interactions.

## Chaîne de production
1. Relever la composition, les proportions et l'éclairage de la référence.
2. Produire ou sélectionner les modèles 3D et textures avec licences vérifiées.
3. Assembler la scène sous Babylon.js/TypeScript ; éclairage, animations et effets.
4. Capturer le **rendu réel du navigateur** à un cadrage comparable.
5. Comparer avec la référence ; corriger les écarts avant de multiplier les salles.
6. Intégrer le terminal Python Pyodide isolé en Web Worker et les missions NSI.

## Gates obligatoires
- **G0 — Droits** : chaque ressource externe a une source, un auteur, une licence vérifiée et ses obligations d'attribution.
- **G1 — Composition** : capture moteur comparée à la référence, même perspective approximative.
- **G2 — Assets** : aucun placeholder géométrique visible dans la capture artistique finale ; avatar riggé, texturé et animé.
- **G3 — Éclairage** : matériaux et lumières contrôlés, sans surexposition.
- **G4 — Jeu** : ZQSD/flèches, caméra, collisions, interaction et sauvegarde testées en navigateur.
- **G5 — Python** : tests déterministes, isolation Worker, arrêt d'exécution et erreurs compréhensibles.
- **G6 — Performance** : mesures réelles sur PC sans GPU dédié, réglages qualité et stratégie de repli.

**Aucune étape n'est validée par une compilation seule.** Une image promotionnelle ne peut pas servir de preuve de rendu.

## Première mission pédagogique
Au terminal « Tokenisation », écrire `tokeniser(texte)` pour découper une chaîne sur les espaces et ignorer les segments vides. Afficher explicitement qu'il s'agit d'une simplification pédagogique, différente des tokenizers sous-mots utilisés par les LLM modernes. L'ouverture du sas dépend de tests Python reproductibles.

## Architecture cible
Vite + TypeScript + Babylon.js ; modèles glTF/GLB sous `public/assets/` ; interfaces HTML accessibles ; Pyodide en Worker ; sauvegarde locale versionnée ; tests unitaires, tests navigateur et CI.
