# M03.3 — Bible graphique du Secteur 01

Préproduction du 11 octobre 2026. Direction choisie : **science-fiction industrielle**. Référence inspectée : branche `review/m03-tokenisation`, HEAD `bf53395943f6a8785ede0860d22ee50565d2f22d`. Ce document propose une direction à valider ; il ne décrit pas des assets réalisés. Aucune intégration n'est autorisée par cette livraison.

## 1. État réel et intention

La scène actuelle est un atrium procédural Babylon.js : sol de 90 × 85 m, colonnes et balcons latéraux, passerelles, sculpture centrale, console M03 à droite du noyau. Les détails de `src/atrium-detail.js` ajoutent pierre claire, laiton, végétation et escaliers décoratifs. Ce langage palatial sera remplacé progressivement, après accord, par une salle de recherche et de maintenance crédible. La navigation et la pédagogie ne seront pas reconstruites.

| Élément inspecté | Présent aujourd'hui | Décision proposée |
|---|---|---|
| `index.html` | Scène, PBR, brouillard, éclairages, avatar, caméra et déplacement | Conserver les contrats de fonctionnement ; remplacer ultérieurement les constructions artistiques |
| `src/asset-loader.js`, `public/assets/nexus-core-sculpture.glb` | Sculpture locale ; fallback procédural désactivé après import réussi | Réutiliser comme proxy, pas comme référence artistique finale |
| `src/atrium-detail.js` | Décor procédural ; certains meshes statiques fusionnés par matériau | Réutiliser le principe de regroupement, remplacer pierre, plantes et ornements |
| `src/surface-detail.js` | Texture de sol générée dans le navigateur, 512² | Réutiliser comme secours ; remplacer l'aspect par un sol industriel |
| `src/wayfinding.js` | Panneau recto/verso avec textures dynamiques et cadre | Réutiliser lisibilité double face et identification M03 ; renouveler la composition |
| CesiumMan externe | Avatar de test, un groupe `animation0`, pas de clip idle dédié | Remplacer par un personnage original après validation de silhouette et rig |
| M03 / DOM | Activités, Python, brouillons et parcours accessible hors déplacement | Conserver intégralement ; console physique = point d'accès, pas remplacement du panneau |

Le rendu actuel emploie cyan, violet, transparence et émissions fortes. Aucun environnement HDR, générateur d'ombres ou post-traitement n'a été identifié dans les fichiers inspectés. Un matériau PBR n'est donc pas une preuve d'éclairage physiquement calibré. Le détail de l'inspection technique figure dans la [spécification](M03_3_ASSET_SPEC.md).

## 2. Salle : un lieu de travail, pas un temple de l'IA

Proposition : **hall de recherche de 40 × 68 × 18 m**, centré sur le repère actuel. Le volume est grand parce que la caméra orbitale et la zone de déplacement le sont déjà. Une version plus compacte exige une étude de caméra séparée, pas un redimensionnement silencieux.

Le Secteur 01 accueille un banc central de calcul et de refroidissement, des baies techniques latérales, un circuit de maintenance au sol et une console pédagogique M03. Le banc est une représentation d'équipement informatique ; il ne représente ni un cerveau réel ni une explication scientifique du fonctionnement d'un LLM.

Disposition proposée : entrée au sud près du spawn `(0, 0, -30)`, noyau au centre, M03 à `(12, 0, -10)`, accès techniques latéraux hors parcours. Aucun étage parcourable dans cette tranche. Les passerelles éventuelles sont clairement réservées à la maintenance ; pas de porte ou console donnant l'impression d'une activité inexistante.

Critères à vérifier sur plans puis vues de caméra :

- M03 visible depuis l'arrivée par un repère nommé, sans obligation de suivre une ligne lumineuse.
- Au moins 2 m de passage libre autour de l'accès à la console ; aucune nouvelle pièce dans les trajectoires testées sans révision explicite des collisions.
- Chaque grande surface comporte une logique constructive : joints, fixation, ouverture de maintenance ou séparation de matériau. Éviter les boîtes sans fonction ; éviter aussi de multiplier les microdétails invisibles à distance.
- Trois familles de formes : ossature porteuse verticale, enveloppes techniques à angles adoucis, panneaux remplaçables. Aucun motif identifiable emprunté à une franchise.
- Câbles et conduites suivent des supports et aboutissent à des équipements ; aucun tuyau gratuit traversant les circulations.
- La caméra doit rester dans l'enveloppe et voir le joueur aux angles limites. Le plafond à 18 m est une hypothèse de compatibilité, pas une validation de tous les rayons de caméra.

## 3. Palette et matériaux

| Rôle | Référence sRGB proposée | Usage |
|---|---|---|
| Graphite | `#20282E` | Ossature peinte, textiles, carters |
| Acier | `#66737B` | Panneaux galvanisés et rails |
| Titane | `#A4ABB0` | Arêtes usinées et renforts |
| Ambre | `#DFA24D` | Maintenance, attention, repères de circulation |
| Cyan | `#4BBCCA` | Disponibilité de la console et information active |
| Blanc cassé | `#DCE0DF` | Texte et repères neutres |

Cible de composition : environ 75 % de surfaces visibles neutres sombres, 20 % de neutres moyens/clairs et au plus 5 % d'accents saturés, appréciés sur les trois vues de validation. Les pixels fortement émissifs occupent au plus 3 % d'une vue de salle, hors interface pédagogique. Ces proportions sont des critères de revue, pas des statistiques du rendu actuel.

Métal nu : metallic proche de 1, roughness proposée 0,35–0,65 ; peinture et textile : metallic 0, roughness 0,55–0,9. Les valeurs seront évaluées dans l'éclairage cible. Salissures aux contacts et joints, usure limitée aux prises et passages ; pas de bruit uniforme. Pas de miroir de sol, pas de transparence systématique, pas de grandes surfaces chromées. Les normal maps remplacent les petits chanfreins lorsque leur silhouette n'est pas visible.

## 4. Éclairage et signalétique

Éclairage principal par luminaires de travail blanc neutre, intention proche de 4 000 K. L'ambiance reste sombre sans sacrifier les silhouettes, les obstacles et les repères. Ambre et cyan sont des accents fonctionnels ; aucune bande de néon sur chaque arête. Un luminaire visible peut être émissif sans créer une lumière dynamique supplémentaire. Ombres et éclairage précalculé seront des options comparées à coût mesuré, pas des exigences déjà implémentées.

Identité NEXUS : marquage `NEXUS / S01`, plaques de maintenance avec numéros et pictogrammes simples, séparation diagonale courte utilisée comme signe d'orientation. Typographie sobre, sans alphabet fictif. Utiliser les polices système pendant le prototype ; toute police externe attend une licence vérifiée. Cyan signifie « interaction disponible » avec icône et libellé ; ambre signifie « attention » avec symbole et texte. La couleur seule ne porte jamais une consigne.

Sur la console : inscription courte `M03 / TEXTE → UNITÉS`, bouton ou zone d'accès identifiable, écran encastré incliné et surface de travail plausible. Le contenu scientifique long reste dans l'interface HTML accessible. Aucun hologramme décoratif flottant, aucun faux bouton 3D. Lisibilité contrôlée en situation réelle, pas uniquement sur une texture agrandie.

## 5. Personnage technicien-explorateur

Silhouette humaine de 1,75 m environ : veste de maintenance graphite, renforts clairs aux avant-bras et genoux, sacoche technique asymétrique à la hanche, outil compact fixé et petite plaque ambre sur le torse. Un petit afficheur cyan peut signaler l'équipement ; pas de combinaison couverte de lumières. Visage lisible et non militarisé ; aucun casque iconique, armure de combat ou accessoire d'une franchise.

Reconnaissance recherchée à 9 m de caméra : épaules, sacoche et repère ambre distinguent le personnage du décor en silhouette et en niveaux de gris. Les mains restent libres pour le déplacement. Les accessoires ne pénètrent ni les cuisses pendant la marche ni la console à l'approche. Prévoir un idle dédié et une locomotion in-place, sans déplacement du root par le clip.

La vitesse actuelle est 7 m/s : une marche humaine lente produirait du glissement des pieds. Avant l'animation, choisir humainement entre une locomotion rapide cohérente avec cette vitesse ou une future modification autorisée du déplacement. Aucune vitesse n'est changée ici.

## 6. Validation visuelle avant modélisation

Livraison suivante proposée, seulement après feu vert : plan coté et trois esquisses de salle (arrivée, approche M03, vue latérale), trois silhouettes de personnage en gris, puis face/profil/dos de la silhouette retenue et une planche de six matériaux. Ce sont des concepts 2D à produire, pas des assets définitifs livrés aujourd'hui.

Revue humaine : identifier M03 en moins de 5 s sur chaque vue pertinente ; expliquer la fonction de chaque équipement majeur ; reconnaître le personnage sans couleur ; refuser tout élément évoquant directement une franchise ; valider la visibilité des circulations. Ce test de concept ne prouve pas l'utilisabilité du jeu. L'accord sur salle **et** personnage doit précéder toute modélisation.

Décisions attendues : volume conservant les contrôles actuels, banc central technique, silhouette proposée, équilibre neutres/accents, console physique ouvrant le panneau existant et politique de locomotion. Voir le [gate](M03_3_ACCEPTANCE_GATE.md).
