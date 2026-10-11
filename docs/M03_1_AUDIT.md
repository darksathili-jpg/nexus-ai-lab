# M03.1 — audit et critères d’acceptation

Base : `c7ac8e0`, branche `review/m03-tokenisation`, arbre propre. Le 11 octobre 2026, `git fetch origin review/m03-tokenisation` puis comparaison : 0 commit de chaque côté. Les quatre commits de référence sont ancêtres de HEAD. `main` local : `21ca554` ; art-direction local : `c7ac8e0` ; distant art-direction : `31a1f85`.

Sources examinées : mission, manifest, moteur, UI, runner, Worker, scripts du jeu, tests, documents et cinq workflows. Sur cette branche aucun workflow ne répond au push ; aucune publication n’est autorisée pour M03.1. Le workflow Pages est réservé à art-direction ; le build assets peut écrire sur cette branche uniquement selon sa condition explicite. Aucun workflow n’est modifié par cette consolidation.

## Défauts reproduits avant correction

- `npm test` et `npm run test:browser` initiaux : PASS. Ces gates vérifient le comportement ancien, pas la nouvelle exigence pédagogique.
- `node artifacts/reproduce-learning.cjs` : réponse oui/non correcte + clic de comparaison rendent Python disponible sans prédiction/manipulation/interprétation. Un brouillon saisi disparaît au rechargement.
- `node artifacts/reproduce-runner.cjs` : `ready` tardif après annulation lève `TypeError: Cannot read properties of null (reading 'timeout')`. Une sortie tardive déclenche encore un callback après annulation.
- La suite initiale valide la mission entière avec un choix de QCM, sans justification libre. Vérifié par exécution du scénario historique.
- Inspection UTF-8 : le début de `PRODUCTION_AUDIT.md` contient réellement du mojibake (`trouvÃ©`, `PrÃ©sent`), contrairement aux autres documents. Ce n’est pas seulement un affichage du terminal.
- Chargement pédagogique : pas de timeout ni action de reprise dédiée. Les erreurs Python brutes constituent le feedback principal. Les scripts existants ne testent pas les messages tardifs ni l’envoi Worker qui échoue.
- Audit clavier complémentaire, `node artifacts/reproduce-keyboard.cjs` : P sur une liste de réponses recharge le jeu en qualité medium et ferme la mission. Reproduit avant ajout de la garde pendant la mission.

## Acceptation mesurable

1. Quatre questions distinguent mot/token/sous-mot/ID ; une erreur ou un simple clic ne valide pas.
2. L’expérience nécessite une prédiction avant résultat, deux textes distincts dont l’exemple témoin, et deux interprétations correctes. Comparaison visible split/simulation, IDs/décodage/<UNK>. La simulation n’est jamais appelée BPE industriel.
3. Huit tests Première et douze Terminale conservés, Python réel ; erreur de syntaxe, valeur incorrecte, absence de fonction, timeout et reprise testés. Un événement après annulation ou remplacement n’affecte pas le run courant.
4. Transfert : note libre et grille explicite ; longueur et cases sont des conditions de dossier, jamais une notation sémantique. Maîtrise à faire relire par enseignant.
5. Brouillons par niveau restaurés, y compris chaîne vide ; reset explicite confirmé, quota/refus/corruption traités sans effacer les autres données. Aucun code envoyé par l’application à un service.
6. Historique des tests et tentatives conservé ; les anciennes étapes sont archivées et les nouvelles preuves pédagogiques demandées sans refaire inutilement les tests Python.
7. Les trois résolutions, focus/clavier/Échap/tactile, défilement et messages sont testés et capturés ; les gates scène/GLB/collision restent bloquants.
8. Suites locales et build en sous-répertoire exécutés. Résultats et limites rapportés, commits locaux uniquement.

## Risques conservés

Pyodide/JS/réseau : Worker interruptible, pas sandbox pour code hostile. CDN et avatar externes, métadonnées réseau, chargement dépendant de la connexion. Stockage local non chiffré accessible aux scripts de la même origine, sans synchronisation ni garantie de conservation. Autoévaluation non anti-triche, pas certification pédagogique. SwiftShader ne mesure pas les FPS Android ; pas de certification artistique ou de performance matérielle. Les références scientifiques principales sont les documentations Python et Hugging Face liées dans la mission.
