# M03.3 — Budgets provisoires et protocole lycée

11 octobre 2026. **Cibles proposées, non mesures de la future salle.** Aucun asset ou code de profilage ajouté. Les budgets doivent être recalés après inventaire des ordinateurs du lycée.

## 1. Ce que les preuves actuelles permettent de dire

Les [preuves M03.1](../M03_1_REPORT.md) et [preuves avatar](../AVATAR_ANIMATION_REPORT.md) concernent Chromium headless/SwiftShader, pas des GPU physiques. Le compteur historique de 734 meshes et les relevés de l'ordre de 6–7 FPS ne permettent ni de prévoir la vitesse sur PC du lycée ni de certifier un budget mobile. Le compteur comprend des objets désactivés. Aucun relevé réel de draw calls, mémoire GPU ou coût par effet n'est livré par cette préproduction.

La scène continue à être rendue avec le panneau pédagogique ouvert. Le coût 3D doit donc rester compatible avec lecture, saisie et Worker Python. Une éventuelle réduction du rendu derrière le panneau serait une expérimentation ultérieure, pas une optimisation déjà réalisée.

## 2. Budget proposé pour le profil de base

| Mesure | Cible initiale | Périmètre / réserve |
|---|---|---|
| Images / frame time | 30 FPS soutenus ; p95 des frames ≤33,3 ms | PC de référence intégré à désigner ; 1280 × 720 CSS, DPR 1, qualité et buffer réels enregistrés |
| Géométrie visible | ≤180k triangles après export | 145k alloués dans la spec +35k réserve ; copies incluses |
| Géométrie chargée LOD0 | ≤250k triangles | Ne pas additionner à tort tous les LODs comme visibles ; leur mémoire reste comptée |
| Draw calls | ≤100 sans ombres ; ≤120 tous passages si option d'ombres retenue | Comprend personnage, panneaux, effets et reprises de passe ; relevé runtime requis |
| Matériaux | ≤16 uniques sur la salle équipée | Partage/instances ; ne confondre matériau et draw call |
| Alpha | ≤2 appels transparents dans la vue de base | Pas de couches de verre superposées ; émissions opaques privilégiées |
| Textures résidentes | ≤96 MiB, mipmaps inclus | Environnement, personnage, panneaux dynamiques et éventuelle lightmap ; viser 64 MiB en profil réduit |
| Mémoire GPU estimée | ≤192 MiB attribuables à la scène | Textures + buffers + render targets ; estimation d'allocations, pas métrique WebGL universelle |
| Mémoire processus | ≤800 MiB stabilisés ; pointe ≤1 GiB | Rendu + Workers/Pyodide ; tâche navigateur identifiée, pas seulement heap JS |
| Ressources 3D transférées | ≤12 MiB nécessaires à l'entrée ; ≤20 MiB secteur complet | Babylon, Pyodide et leurs dépendances mesurés séparément, pas masqués dans le total |
| Chargement scène froide | p95 ≤8 s jusqu'à déplacement possible ; chaude ≤3 s | Réseau de référence 20 Mbit/s, RTT 40 ms ; à reproduire et à comparer au réseau réel |
| Réactivité pédagogique | p95 saisie/clic → feedback ≤100 ms | Pendant rendu et chargement Python ; pas de freeze dû au décor |
| Python | Cible première disponibilité ≤15 s ; tests simples ≤2 s hors chargement | Mesurer les deux niveaux ; délais actuels 60 s chargement /12 s calcul inchangés |

Option confort : 60 FPS sur poste dédié plus puissant, sans en faire un prérequis pour les élèves. Tester aussi 1920 × 1080 à qualité documentée et les interfaces 1440 × 900, 390 × 844, 844 × 390. Une capture mobile dans Chromium ne valide pas un GPU Android.

Une carte RGBA8 1024² avec chaîne complète de mipmaps représente environ 5,33 MiB non compressés ; 2048² environ 21,33 MiB. La taille du PNG téléchargé ne donne pas la mémoire GPU. Deux trim sets à trois cartes et un set personnage à trois cartes 1024² occupent environ 48 MiB avant panneaux et autres ressources. KTX2 éventuel doit être mesuré dans le format effectivement choisi par le GPU.

## 3. Protocole de mesure à exécuter après autorisation

1. Inventorier au moins trois postes représentatifs : plus ancien accepté, configuration médiane, configuration confortable. Noter CPU, RAM, GPU/driver, OS, Chrome, accélération matérielle, résolution/DPR, alimentation et qualité. Ne pas choisir uniquement le meilleur poste.
2. Fixer commit, hashes des assets et dépendances, URL de test locale/privée, conditions réseau et liste des processus parasites. Mesurer démarrage froid (cache effacé dans un profil dédié) puis chaud. Ne pas effacer les données d'élèves.
3. Après 30 s de stabilisation, effectuer trois parcours de 120 s : arrivée → noyau → M03, rotation complète/zoom limites, ouverture du panneau et saisie. Relever médiane, p95/p99 des durées de frame, nombre de frames >100 ms, appels de rendu, triangles actifs et octets réseau. Garder les séries, pas seulement une moyenne FPS.
4. Outils envisagés : instrumentation Babylon pour scène/rendu, Performance et Network Chrome, gestionnaire de tâches Chrome pour processus/Workers. Timers GPU uniquement si disponibles ; inscrire « non disponible » sinon. Séparer mémoire JS, Wasm, processus et allocations GPU estimées. Ne pas présenter le heap seul comme mémoire totale.
5. Exécuter Python valide, erreur de syntaxe, timeout et annulation ; recharger et restaurer les brouillons de chaque niveau. Répéter trois cycles puis observer 60 s de repos. Investiguer une croissance résiduelle >32 MiB entre cycles stabilisés, sans conclure à une fuite sur un unique pic.
6. Réseau : essais limités, interruption puis reprise, accès CDN indisponible. Enregistrer impact réel des ressources externes. Si la classe dispose de 30 postes, mesurer ensuite un démarrage simultané : le profil 20 Mbit/s par poste ne prédit pas le partage du réseau scolaire.
7. Conserver JSON/CSV, logs, captures, versions et anomalies dans un dossier de preuve par poste. Refaire les mêmes parcours après chaque changement substantiel, comparer à la référence ; décision humaine si budget dépassé.

## 4. Ordre de réduction en cas de dépassement

Mesurer d'abord la cause : CPU objets/appels, GPU pixels/lumières, mémoire ou réseau. Réduire primitives et matériaux, instancier les répétitions et choisir des LODs ; limiter transparence et lumières ; réduire textures peu visibles et render targets ; tester compression/décodage. Garder les repères de circulation, le personnage et M03 lisibles. Une hausse du hardware scaling ne remplace pas un diagnostic et doit préserver la lecture de l'interface DOM.

Aucun budget ne justifie suppression d'un test pédagogique, d'une sauvegarde ou d'un message d'erreur. Si le poste minimal ne satisfait pas l'usage, revoir le périmètre artistique avant d'ajouter des stations.
