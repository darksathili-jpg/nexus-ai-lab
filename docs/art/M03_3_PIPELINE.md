# M03.3 — Pipeline Blender → glTF/GLB → Babylon.js

Préproduction du 11 octobre 2026. Pipeline proposé, non exécuté : aucun fichier Blender, export, codec ni intégration créé. Les options exactes doivent être éprouvées avec les versions choisies, puis figées dans le registre de production.

## 1. Sources et versions

Proposition : Blender 4.5 LTS, patch exact à sélectionner ; exporteur glTF fourni avec Blender, pas de plugin inconnu. Le [README officiel de l'exporteur Khronos](https://raw.githubusercontent.com/KhronosGroup/glTF-Blender-IO/main/README.md) décrit son intégration et les versions prises en charge. Il a été consulté ; le manuel Blender distant n'a pas été accessible lors de cette inspection. Les réglages ci-dessous sont donc un contrat à tester, pas une recette d'export déclarée validée.

Figement futur de Babylon, loaders, exporteur et validateurs après essai de compatibilité. Aucun changement de dépendance maintenant. Sources `.blend`, textures non destructives et registre conservés séparément des exports runtime. Arborescence future proposée : `art-source/sector01/` pour les sources, `public/assets/sector01/` pour les seuls exports approuvés ; organisation à approuver avant création.

## 2. Contrat de modélisation

- Unités Blender métriques, 1 unité = 1 m. Dimensions vérifiées sur console et personnage avant export. Échelle appliquée, pas d'échelle négative ; pivots documentés : personnage entre les pieds, module au point d'assemblage, console au centre de son empreinte.
- Blender reste Z-up ; glTF est Y-up. Laisser l'exporteur convertir les axes, puis vérifier repères et orientations. Babylon convertit le glTF droitier dans sa scène par défaut gauchère : ne pas ajouter une deuxième symétrie manuelle. [Documentation du loader](https://doc.babylonjs.com/features/featuresDeepDive/importers/glTF/)
- Noms ASCII stables : `S01_ARCH_Wall_A_LOD0`, `S01_M03_Console_LOD0`, `S01_CHAR_Technician_LOD0`, matériaux `MAT_S01_MetalPaint`, clips `idle` et `walk`. Variantes A/B, niveaux LOD0/1/2 ; pas de noms d'objets automatiquement dupliqués comme identifiants d'interaction.
- Séparer rendu, volumes de collision et occlusion dans les sources (`COL_...`, `OCC_...`). Exporter les proxies dans un fichier distinct ou les omettre du rendu. Une convention de nommage seule n'active ni collision ni occlusion dans le moteur actuel.
- Normales cohérentes, géométrie non-manifold corrigée lorsqu'elle est involontaire, triangulation contrôlée et pas de faces doublées. Chanfreins réservés aux silhouettes ; détails fins en texture. Relever triangles, sommets après coutures et nombre de primitives exportées.
- Le banc central reste statique dans la première tranche ; aucune animation décorative indispensable. Regrouper par matériau et visibilité, sans fusionner toute la salle en un mesh empêchant le culling.

## 3. UV et PBR

UV0 pour textures de matériau, sans étirement visible ; overlays/îlots partagés intentionnels documentés. Densité indicative : 128 px/m pour enveloppe, 256 px/m près de M03, atlas personnage 1024². Mesurer la lisibilité sur caméra avant d'augmenter la résolution. Bordure indicative de 8 px à 1024², éprouvée avec mipmaps. UV1 distinct, non superposé, seulement si un éclairage précalculé est effectivement choisi et validé.

Deux trim sets partagés environnement + un set personnage : base color, normal et ORM. Base color/emissive en sRGB ; normal/occlusion/roughness/metallic en données linéaires. ORM : R occlusion, G roughness, B metallic ; vérifier le résultat dans un viewer et Babylon. Utiliser des graphes compatibles avec l'export, pas supposer que les procéduraux Blender seront reproduits. Cuire les effets nécessaires dans les cartes.

Éviter les matériaux uniques pour chaque vis ou luminaire. Alpha opaque par défaut ; découpes seulement si nécessaires, transparence très limitée. Pas de transmission ou extension avancée avant profilage et test de compatibilité. Normal maps vérifiées après export, pas de correction arbitraire de canal sans constater une inversion.

## 4. Personnage et animations

Rig proposé ≤70 joints, poids normalisés et ≤4 influences/sommet. Pas de root motion ; boucle walk sans saut au raccord ; idle naturel discret, pieds au sol. Une seule locomotion active à la fois. Le nouveau rig ne doit pas dépendre des noms `Skeleton_arm_joint` propres au CesiumMan courant.

Avant production des clips : décider vitesse de locomotion et cadence. Après export : vérifier idle 10 s, déplacement, relâchement, obstacle empêchant d'avancer, panneau, blur et onglet masqué. Mesurer les démarrages pour exclure une relance par frame. Repos et marche doivent être contrôlés par le déplacement réel, conformément au correctif actuel ; une adaptation explicite du mapping clips sera nécessaire lors de l'intégration future.

## 5. Export et compression

Première référence sans compression : GLB glTF 2.0 avec textures PNG/JPEG selon besoin, animations sélectionnées, pas de caméra/lumière Blender exportée par inadvertance. LODs séparés et manifeste proposés ; ne pas supposer que Babylon sélectionne automatiquement des LODs nommés. Export reproductible depuis les sources figées, hash de chaque livraison.

Compression seulement après comparaison : meshopt **ou** Draco pour la géométrie ; KTX2/Basis pour les textures. Le loader Babylon prend en charge ces familles mais leurs décodeurs peuvent ajouter des téléchargements ; leur hébergement et leurs versions doivent être explicites. Ne pas ajouter simultanément tous les codecs par défaut. Comparer octets réseau, temps de décodage, mémoire de pointe, qualité et compatibilité sur les PC du lycée. [Loader glTF Babylon](https://doc.babylonjs.com/features/featuresDeepDive/importers/glTF/)

Le GLB non compressé reste la référence de diagnostic, pas nécessairement le fichier final chargé. Aucune compression n'est présentée comme « gratuite » ou systématiquement plus rapide. Auto-hébergement et fonctionnement réseau dégradé sont des travaux futurs soumis à autorisation.

## 6. Validation d'une livraison future

1. Contrôle des sources : dimensions, naming, UV, budget, propriété et registre de licence.
2. Export et rapport JSON du [glTF-Validator Khronos](https://github.com/KhronosGroup/glTF-Validator) : zéro erreur ; chaque avertissement examiné et expliqué. Le parsing du GLB actuel ne remplace pas ce contrôle.
3. Viewer indépendant : axes, orientation, matériaux, boucles, absence de root motion et de fichiers manquants.
4. Babylon avec versions figées : importer dans une copie de test autorisée, vérifier primitives, matériaux, textures, éclairage et mémoire ; contrôler conversion d'axes et éviter double scaling.
5. Raccorder explicitement collision, occlusion et interaction ; tester les positions limites avant toute substitution du décor actuel.
6. Exécuter les gates pédagogiques et graphiques source/build. Comparer captures aux résolutions requises et à l'état avant intégration ; conserver échecs et anomalies.

Aucun PASS de ces six contrôles n'est revendiqué dans cette mission. Toute intégration attend l'accord humain prévu dans le [gate](M03_3_ACCEPTANCE_GATE.md).
