# Grand Atrium — vertical slice technique V0.1

Ouvrir `index.html` via un serveur statique (GitHub Pages ou `python -m http.server 8000`), puis naviguer avec ZQSD/WASD/flèches. Tourner la caméra à la souris. Approcher la station à droite du réacteur et presser E.

## Ce qui est réellement présent
- Scène Babylon.js 3D avec éclairage, architecture sur plusieurs niveaux, hologramme animé, caméra et déplacements.
- Tentative de chargement d'un **vrai modèle glTF animé** CesiumMan depuis Khronos glTF Sample Models, hébergé via jsDelivr. En cas d'échec, un substitut géométrique est visible avec message d'alerte.
- Terminal interactif avec question sur la segmentation du texte. **Il ne s'agit pas encore d'un interpréteur Python** : la réponse est vérifiée en JavaScript.
- Écran de démarrage, HUD et adaptation élémentaire aux tailles d'écran.

## Ce qui n'est PAS validé
- **Direction artistique non validée.** Les volumes d'architecture sont des blocs de prototypage et non des modèles d'environnement haut de gamme.
- Pas de capture moteur comparée à l'image de référence, pas de tests navigateur réels effectués dans cette livraison.
- Pas de collisions physiques complètes, ni animation de marche pilotée par la vitesse.
- Pas de mode hors-ligne : Babylon.js et le personnage proviennent de CDN.
- Pas encore de textures PBR raster originales ni de décor final.
- Le contenu de la mission est volontairement introductif ; Pyodide et l'évaluation Python restent à développer.

## Provenance de l'avatar
CesiumMan, Khronos glTF Sample Models : https://github.com/KhronosGroup/glTF-Sample-Models/tree/main/2.0/CesiumMan — consulter la licence et les attributions associées au modèle avant toute redistribution locale.

## Prochaine gate
Produire un véritable kit d'environnement 3D (GLB et textures PBR sous licence), l'intégrer, puis capturer et comparer le résultat réel à l'image de référence. Ne pas déclarer le rendu conforme sans cette preuve.

## V0.2 — Risques de sécurité et tests encore nécessaires
- Le Worker protège l'interface contre une boucle infinie en permettant sa terminaison, mais **ne constitue pas un bac à sable de sécurité certifié** pour du code hostile.
- Les CDN doivent être auto-hébergés et figés avant déploiement scolaire robuste.
- Les tests navigateur, accessibilité et performance n'ont pas été exécutés ici.
- Le développement artistique et la création des assets GLB/PBR restent le blocage principal de conformité.

## V0.3 — Passe de détails architecturaux
- `src/atrium-detail.js` ajoute des objets **réellement modélisés en 3D** : colonnes cannelées, corniches, balustres, luminaires, jardinières, végétation volumétrique, marches et bandes lumineuses.
- Les matériaux PBR sont paramétrés, mais **les modèles artistiques GLB et textures raster haut de gamme restent absents**.
- Cette passe augmente fortement le nombre de maillages et peut dégrader les performances : mesurer les FPS et regrouper les maillages statiques avant publication.
- Aucun test navigateur ou comparatif visuel n'a encore été exécuté ; l'exigence de ressemblance avec le concept art n'est pas validée.

## V0.4 — Instrumentation et CI
- Ajout de trois préréglages de résolution interne : `?quality=low`, `?quality=medium`, `?quality=high` ; raccourci `P` pour basculer.
- FPS et nombre de maillages affichés à l'écran ; la scène suspend son rendu lorsque l'onglet est masqué.
- Workflow GitHub Actions de vérification syntaxique des modules JavaScript et des fichiers essentiels.
- **Les performances ne sont pas validées** tant qu'un relevé n'a pas été effectué sur des ordinateurs du lycée. Le nombre élevé de maillages reste un risque.
- **La fidélité artistique n'est pas validée** : cette version ne contient toujours pas de pack d'environnement GLB détaillé ni de textures photoréalistes.
