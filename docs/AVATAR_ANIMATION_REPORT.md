# Avatar — arrêt de la marche au repos

11 octobre 2026, branche `review/m03-tokenisation`, base `ef806de`. Correctif local uniquement. Aucun push, merge, déploiement ou changement des activités pédagogiques. Le plan M03.2 précédemment préparé reste inchangé, non implémenté et hors de ce commit.

## Cause reproduite

Le déplacement est dans le callback `scene.onBeforeRenderObservable` de `index.html`. L’import CesiumMan lance séparément tous les groupes avec `ag.start(true)`, sans arrêt ni lien avec ce callback. Chromium réel relève une position identique `[0, 0, -30]` à deux instants espacés de 1,2 s, mais un groupe `animation0` actif dont la frame passe de 46,674 à 119,196. Le modèle courant possède un seul groupe, pas de clip `idle` distinct. [Capture avant correction](evidence/avatar-animation/before.png).

Les touches étaient déjà effacées au blur et à l’ouverture/fermeture du panneau ; cela n’arrêtait pas le clip. Aucun gestionnaire de visibilité n’effaçait explicitement les commandes au changement d’onglet.

## Correction minimale

- Nouveau contrôleur `src/avatar-animation.js`, indépendant du contenu M03, recevant les seuls groupes de l’avatar importé.
- Au chargement, aucune boucle de marche. Une pose stable utilise les jambes droites de la pose de référence et les rotations de bras du clip existant ; les bras écartés de la pose de chargement ne sont pas retenus comme repos final. Aucun asset, matériau ou décor modifié.
- Marche déclenchée seulement si la position XZ change réellement après collision (seuil de déplacement `1e-5`). Une intention bloquée par un obstacle ne fait pas marcher le personnage sur place.
- Démarrage seulement au changement d’état ; mélange Babylon à l’entrée de la marche. À l’arrêt, le clip est stoppé et les articulations reviennent à la pose de repos par interpolation lissée sur 0,2 s de temps de simulation. Le temps de simulation conserve la limitation de delta existante ; le rendu logiciel lent peut allonger la transition en temps réel.
- Relâchement clavier, touches opposées et arrêt du joystick arrêtent la marche au prochain calcul de déplacement. Ouverture du panneau, blur et visibilité masquée effacent les entrées et arrêtent immédiatement le clip. Perte de capture du joystick également traitée. Au retour, aucun mouvement ne reprend sans nouvelle commande.
- Caméra, collisions et interaction E/AGIR conservées. Aucun changement de station ou de logique Python.

## Exécutions réelles

Windows, Node 22.13.1, Playwright 1.56.1, Chromium headless/SwiftShader, serveur `http://127.0.0.1:8765/`, accès réseau aux CDN.

| Vérification | Résultat et preuve |
|---|---|
| `npm test` | PASS, neuf scripts dont contrôleur d’animation ; [journal](evidence/avatar-animation/unit.log) |
| `node tests/avatar-browser.cjs` source | PASS : pose/position initiales stables, avancée de la pose pendant le mouvement, un seul démarrage sur plusieurs frames, arrêt, touches opposées, blur, visibilité, panneau/Échap, collision, joystick et zoom caméra ; zéro erreur JS ; [journal](evidence/avatar-animation/browser.log) |
| Même test sur `/_playable/` | PASS ; 19 fichiers assemblés identiques à la source, nouveau module inclus ; [journal](evidence/avatar-animation/build.log) |
| `node tests/quality-gate.cjs` | PASS : signalétique, déplacement/interactions tactiles, Échap, panneau et récompense mobile ; [journal](evidence/avatar-animation/quality.log) |
| `node tests/atrium-browser.cjs` | PASS : scène, GLB, texture de sol, 734 maillages et zéro erreur collectée ; [journal](evidence/avatar-animation/atrium.log) |
| `git diff --check` | PASS avant commit |

Les deux nouveaux tests sont intégrés à `npm test` et `npm run test:browser`. La suite navigateur complète n’a pas été relancée pour ce correctif ciblé ; les validations ci-dessus sont les commandes réellement exécutées. Les tests de blur et visibilité utilisent des événements contrôlés (visibilité simulée), pas un essai d’alt-tab sur le Chrome utilisateur. Le clavier, le joystick, le panneau et la caméra sont manipulés dans le navigateur réel de test.

Un [échec intermédiaire](evidence/avatar-animation/initial-failure.log) est conservé : le test attendait que des pas de collision discrétisés atteignent exactement une position proche de la limite. Ce n’est pas garanti par le contrôleur. Le scénario corrigé place explicitement le joueur sur la frontière réelle `z=-33.5` puis exige une position et une pose stables malgré la commande vers l’extérieur. Les assertions d’immobilité et d’arrêt de l’animation sont conservées.

## Vérification visuelle et limites

Captures source inspectées : [repos au chargement](evidence/avatar-animation/idle.png), [marche](evidence/avatar-animation/walk.png), [repos après relâchement](evidence/avatar-animation/rest.png). Les tests comparent aussi les transformations des articulations sur plusieurs instants, car une capture seule ne prouve pas l’immobilité ni une animation. Le retour interpolé est vérifié par test de contrôleur et les poses finales ont été inspectées ; aucune mesure de fluidité sur GPU physique réalisée.

La pose est adaptée au rig CesiumMan actuellement chargé. L’URL externe sur `master` reste une dépendance non figée préexistante : si le rig change, la pose doit être revue. Sans clip, le contrôleur ne provoque pas d’erreur ; le fallback de chargement existant est conservé. Aucun nouveau pack d’animations ou service ajouté.

Pour confirmer dans Chrome : recharger le serveur local, regarder le personnage sans commande, maintenir une touche de déplacement puis relâcher, ouvrir/fermer TOKENISATION pendant un mouvement, changer d’onglet ou d’application puis revenir sans commande. Il doit être immobile au retour. Cette vérification utilisateur n’est pas annoncée comme déjà effectuée.
