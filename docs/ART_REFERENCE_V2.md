# NEXUS — Atrium / planche de direction artistique V2

Une nouvelle illustration raster WebP 1672 × 941 a été produite le 11 octobre 2026 dans le cadre de la direction artistique. **Cette illustration est un concept art, et non une capture de Babylon.js.** Elle n'est pas encore copiée dans ce dépôt : elle a été remise séparément au commanditaire.

## Décisions de production
- Composition : personnage vu de dos, point de fuite sur un noyau neuronal suspendu, deux niveaux de passerelles, profondeur de champ architecturale.
- Architecture : éléments de verre et métal avec matériaux PBR, éclairages chauds et froids, végétation et stations de travail, plutôt que cubes colorés.
- Signalétique des six zones d'apprentissage : Données, Tokenisation, Embeddings, Transformers, Entraînement, Génération.
- Interface : HUD léger pendant la marche ; terminal Python affiché en surimpression uniquement à proximité d'une station.
- Personnage : modèle glTF riggé avec marche, arrêt, rotation et caméra à la troisième personne.
- Priorité à la lisibilité : contraste élevé et panneaux lisibles sur vidéoprojecteur, sans surcharger l'image.

## Critères de comparaison obligatoires
1. Réaliser une capture **réelle du navigateur** depuis le point d'apparition de l'avatar.
2. Évaluer la présence des éléments architecturaux, l'échelle du personnage, le cadrage, les matériaux, la qualité de l'éclairage et la lisibilité.
3. Faire une revue de performance sur ordinateur scolaire avant tout ajout d'effets coûteux.
4. Refuser le gate artistique si le décor est encore constitué de blocs de prototypage.
5. Ne jamais afficher l'illustration conceptuelle en fond pour laisser croire qu'il s'agit d'une scène 3D jouable.

## Prochaine réalisation attendue
Créer et intégrer des **assets binaires** : modèles GLB, textures albedo/normal/roughness/metallic WebP ou KTX2, et animations. Les ajouter dans `public/assets/` avec leur provenance dans `docs/ASSET_CREDITS.md`. Le dépôt actuel ne contient pas encore ces ressources.
