# M03.3 — Spécification des assets

Préproduction, 11 octobre 2026, HEAD `bf53395`. Toutes les dimensions futures sont des propositions en mètres ; tous les budgets sont des plafonds de travail à valider. Aucun nouveau modèle ou matériau n'est créé.

## 1. Inventaire technique observé

| Ressource / système | Inspection réelle | Réutilisation / risque |
|---|---|---|
| Scène `index.html` | Construction procédurale ; sol 90 × 85 m ; balcons vers X ±29, colonnes ±35, poutres vers Y 22 | Contrats de scène réutilisables ; géométrie palatiale à remplacer après accord |
| Sculpture GLB locale | 316 440 octets ; glTF 2 ; 225 meshes, 226 nodes, 27 072 triangles indexés ; aucun matériau, image ou animation dans le JSON GLB | Proxy local produit par `tools/build_reactor.py` avec trimesh/numpy ; couleurs de sommets. Comptage par parsing, **pas validation glTF-Validator** |
| Sculpture de secours | Sphères neuronales, lignes et anneaux procéduraux ; désactivés après import GLB réussi | Secours de chargement ; meshes désactivés encore dans le compteur de scène |
| Sol | DynamicTexture 512², grain/veines calculés localement ; PBR | Génération et secours réutilisables, aspect à renouveler |
| Signal M03 | Deux faces avec DynamicTexture 1024 × 512 ; cadre et matériaux | Conserver texte non inversé et lisibilité recto/verso |
| Décor détaillé | Pierre claire, laiton, graphite, plantes, luminaires ; fusion partielle des meshes statiques | Principe de fusion réutilisable ; esthétique à renouveler |
| Éclairage | PointLight central cyan et HemisphericLight ; point de signalétique désactivé ; matériaux limités à deux lumières simultanées | Ne pas extrapoler le coût à partir du seul nombre de luminaires visibles |
| Avatar | CesiumMan chargé depuis jsDelivr, dépôt Khronos sur `master`, échelle ×1,5 | Placeholder externe non figé ; remplacement original envisagé |
| Qualité | `src/performance.js` : hardware scaling 1,8 / 1,35 / 1 ; mobile en low | Réutiliser choix de qualité ; pas de budget matériel prouvé |

Les diagnostics historiques montrent 734 meshes dans la scène. Ils incluent du décor et des objets désactivés ; ce nombre n'est ni le nombre de draw calls ni celui des meshes visibles. Les ressources externes comprennent Babylon/loaders non figés et Pyodide 0.27.7 via CDN. Les polices déclarées ont un fallback système ; aucun fichier de police définitif n'est sélectionné ici.

## 2. Contrats à conserver

- Collision custom au sol dans `src/collision.js`, en XZ : limites X ±19,5 et Z ±33,5, rayon joueur 0,5 m, noyau de rayon 8,6 m, collision orientée de console à `(12, -10)` de demi-dimensions 1,55 × 0,78 m et angle −0,35 rad. Balcons et escaliers décoratifs ne sont pas parcourables.
- Caméra ArcRotate : rayon usuel 6–20 m, beta 0,8–1,5 rad, cible joueur +2,7 m ; contraction d'occlusion pouvant descendre à 2,8 m. Les occluders actuels sont sélectionnés par noms : un futur GLB n'est pas automatiquement couvert. Prévoir une table explicite de correspondance lors d'une intégration autorisée.
- Déplacement relatif à la caméra, vitesse 7 m/s ; collisions balayées et glissement. Importer un modèle ne crée pas un obstacle custom. Le mesh visible et le volume collision doivent être réconciliés.
- Console actuelle 3 × 2 × 1,4 m, rotation −0,35 ; E/AGIR à moins de 6 m. Maintenir également le bouton d'accès accessible sans déplacement.
- M03 reste HTML/DOM : clavier, tactile, focus, Échap, brouillons, Worker Python. Ne pas convertir les activités en textures 3D illisibles ou inaccessibles.

## 3. Marche sur place : diagnostic de la version inspectée

La cause historique établie est un démarrage de tous les clips en boucle à l'import, indépendant du déplacement. Le [rapport du correctif](../AVATAR_ANIMATION_REPORT.md) conserve la reproduction et ses preuves. Cette cause a été corrigée dans le HEAD `bf53395` : `src/avatar-animation.js` stoppe les groupes au chargement, reçoit le déplacement XZ réel après collision, démarre seulement à l'entrée en marche et revient au repos par interpolation sur 0,2 s de simulation. Blur, panneau et onglet masqué effacent les commandes. Aucun défaut de marche sur place n'est nouvellement reproduit par cette préproduction.

La pose de repos de secours est spécifique aux noms de bras CesiumMan. Elle ne constitue pas un contrat générique pour le futur rig. Celui-ci doit fournir `idle` et `walk` dédiés ; validation de mélange, vitesse et interruption obligatoire. Ne pas réintroduire `start(true)` sur tous les groupes après import.

## 4. Inventaire à produire après validation

Tri = triangles après triangulation/export, LOD0 maximum par exemplaire. Complexité : faible (forme modulaire simple), moyenne (UV/assemblage), forte (rig/animation ou composition). Les colliders sont des intentions à relier ultérieurement au moteur custom, pas des objets physiques déjà actifs.

| Asset / quantité indicative | Dimensions / fonction | Géométrie et LOD | Matériaux | Animations | Collision / réemploi | Complexité |
|---|---|---|---|---|---|---|
| Kit structure, 12–20 pièces types | Travées 4–6 m ; salle assemblée 40 × 68 × 18 m | Ensemble placé ≤45k tri ; LOD1 ≈50 %, LOD2 ≈25 % | Trim métal/peinture partagé | Aucune | Enveloppe simple ; modules réutilisables dans le seul secteur livré | Moyenne |
| Sol modulaire | Dalles 2 × 2 m, épaisseur visuelle 0,1 m | Inclus dans structure ; relief fin en normal | Graphite rugueux, marquage partagé | Aucune | Sol plat actuel conservé ; pas de seuil bloquant | Faible |
| Banc central | Enveloppe diamètre ≤17,2 m, hauteur proposée 7 m | ≤24k tri ; ≤8 primitives ; LOD1 12k / LOD2 6k | Métal, peinture, petites émissions | Aucune exigence ; maintenance animée hors scope | Silhouette contenue dans exclusion circulaire actuelle ; ancien GLB comme proxy | Forte |
| Console M03 / 1 | 3 × 2 × 1,4 m ; écran env. 2,7 × 1,3 m | ≤12k tri ; LOD1 6k / LOD2 3k | Métal, polymère, écran opaque | Aucune requise | Collider orienté actuel à respecter ; écran ouvre DOM | Moyenne |
| Baies et conduites / 8–12 | Baies 1,2 × 2,4 × 0,8 m ; réseau hors passage | Ensemble ≤20k tri ; LOD1 50 %, LOD2 25 % | Trim partagé, pas de matériau par baie | Aucune | Hors parcours ou proxy déclaré ; instanciation des variantes identiques | Moyenne |
| Signes et luminaires / 15–25 | Plaques 0,3–1,2 m ; appareils 0,6–2 m | Avec petits props, ensemble ≤24k tri | Atlas signalétique et métal partagé | Aucune ; pas de clignotement requis | Non bloquants ; instances, textures partagées | Faible à moyenne |
| Technicien / 1 | Hauteur 1,75 m ; pieds au sol à l'origine | ≤20k tri ; LOD1 10k / LOD2 4k ; ≤70 joints, ≤4 influences/sommet proposés | Un set corps/accessoires, ≤3 primitives | `idle`, `walk` in-place ; transitions ; pas de root motion | Transform player et rayon existants ; pas de collision par os | Forte |

Somme indicative LOD0 : 145k tri, réserve jusqu'au plafond visible de 180k. Les copies, accessoires et surfaces cachées doivent entrer dans ce compte. Les valeurs ne sont pas des performances mesurées. Décors de nouvelles stations exclus.

## 5. Provenance et droits

| Ressource | Provenance / état des droits | Action avant livraison future |
|---|---|---|
| CesiumMan | [README Khronos/Cesium](https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMan/README.md) : CC BY 4.0, avec indication de conditions de marque Cesium | Conserver attribution et examiner les conditions de marque si réutilisé ; préférer remplacement original. Vérifier version/hash, pas `master` |
| Babylon.js | [Licence Apache 2.0](https://raw.githubusercontent.com/BabylonJS/Babylon.js/master/license.md) | Conserver licence et notices applicables lors d'un futur auto-hébergement |
| Sculpture/procédures du dépôt | Sources locales inspectées ; auteur/droits globaux du dépôt non établis par une licence racine repérée | Faire confirmer titularité et licence de distribution ; « local » ne signifie pas droits vérifiés |
| Futurs modèles, textures et animations | Création originale proposée, aucun fournisseur ni pack choisi | Accord auteur/commande écrit, droits de modification et distribution, sources et crédits |
| Fonts / textures tierces éventuelles | Aucune sélection définitive | Vérifier licence sur la page de l'asset exact, jamais sur la seule réputation d'une bibliothèque |

Registre futur par ressource : auteur, URL exacte, date, version, hash SHA-256, licence et copie du texte, attribution requise, modifications, autorisation de redistribution, fichier source et responsable. Tant que ces champs restent incomplets, asset non admissible au gate de livraison. Cette préproduction ne certifie pas juridiquement les droits existants.
