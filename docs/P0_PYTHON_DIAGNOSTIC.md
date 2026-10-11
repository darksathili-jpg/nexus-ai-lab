# Python — diagnostic du bouton inactif, 11 octobre 2026

Branche : `review/m03-tokenisation`. Référence examinée : `c24eb2e0a16d2dc7e8c4a4e76766c53b89f91eec`. Serveur : `http://127.0.0.1:8765/`. Aucun push, merge, déploiement ni changement de `main`.

## Symptôme et conclusion

L’utilisateur précise que le bouton est inactif avant exécution. Son compteur affiche « 1/5 activités réalisées · 0 tentatives Python · dossier local ». Après tentative de validation de l’expérience, il lit « Prédis, observe “chats !”, puis manipule un autre texte avant d’interpréter. »

Ce dernier message identifie une condition d’expérience non remplie : prédiction enregistrée, observation du texte initial et observation d’un deuxième texte distinct sont nécessaires. On ne sait pas laquelle manque sur le poste réel. Le clic de validation refusé ne lance pas Python. Une panne Pyodide n’est donc pas démontrée par ces observations. Le premier conseil de terminer l’expérience n’avait pas suffi ; le retour utilisateur a permis de préciser ce diagnostic.

Le test ciblé reproduit exactement un compteur 1/5 avec bouton désactivé, puis vérifie son activation à 2/5 après réalisation complète de l’expérience. Il ne reproduit pas de blocage persistant après validation réussie. Chrome utilisateur n’est pas contrôlé par ces tests ; le déblocage et l’exécution sur son poste restent à confirmer.

## Instrumentation et réseau

Instrumentation temporaire dans `artifacts/p0-preload.cjs`, sans modification du Worker livré : événements de clic, création/envoi/terminaison du Worker, messages de jalons et réponses HTTP. Aucun code, brouillon, stdout élève ou contenu de stockage n’est journalisé. Chromium Playwright 1.56.1, headless/SwiftShader ; ce n’est pas le profil Chrome utilisateur. Les contextes sont neufs ; le routage Playwright désactive le cache HTTP de la page. Cela ne prouve pas la disponibilité réseau sur le poste utilisateur.

| Étape du parcours automatisé complet | Observation |
|---|---|
| Clic et prérequis | OK : exécution seulement après expérience validée |
| Création et envoi au Worker | OK : événements enregistrés |
| Catalogue et tests | OK : HTTP 200, jalons reçus |
| Script jsDelivr `pyodide.js` | OK : HTTP 200 et import terminé |
| Ressources `pyodide.asm.js`, `pyodide.asm.wasm`, `python_stdlib.zip`, `pyodide-lock.json` | OK : HTTP 200 |
| Initialisation et `ready` | OK : messages reçus |
| Exécution, évaluation et résultat | OK : messages reçus et assertions des tests |
| Réactivation / nouvelle tentative | OK : assertions d’interface |
| Boucle infinie | TIMEOUT attendu à 12 s, récupération testée |
| Worker/contenu indisponibles | ÉCHEC simulé, récupération testée |
| Chrome utilisateur : Worker, CDN et exécution | NON OBSERVÉ : aucun lancement confirmé |

Traces des chargements arrivés à `ready` : 4 076 à 7 220 ms. Exécutions terminées et tests : 16 à 114 ms, hors boucle infinie et annulations. Ce sont des mesures de ce test, pas des garanties de délai. Les erreurs HTTP 503 du journal sont injectées par la suite, pas un incident CDN constaté. Aucun CORS/403/404 spontané observé pendant ces exécutions.

Les chemins sont relatifs à la page pour le runner et au Worker pour les deux JSON. Les suites passent à la racine et sous `/_playable/`. Assemblage conforme aux copies du workflow : 18 fichiers comparés octet par octet avant tests. Aucun script de build ou workflow modifié.

## Défaut distinct reproduit et correction minimale

En bloquant jsDelivr dans un contexte neuf, `importScripts` produit `NetworkError ... failed to load`. Le bouton redevient utilisable, mais le conseil initial était « Consulte le détail et corrige une cause à la fois », sans indication réseau en français. Le nouveau test a échoué sur cette assertion ; le journal d’échec est conservé.

Une seule expression de classification du feedback reconnaît désormais ces erreurs de chargement et affiche « Vérifie la connexion et réessaie ; ton brouillon est conservé ». Le moteur, le Worker, les huit/douze cas, les prérequis et le stockage sont inchangés. L’assertion du test n’a pas été affaiblie. Le test ciblé est ajouté à `npm run test:browser`.

Cela améliore un défaut réseau simulé ; cela ne prétend pas corriger une panne Pyodide démontrée dans Chrome utilisateur. Aucun auto-hébergement ni mode hors ligne ajouté. Pyodide reste externe et le Worker n’est pas une sandbox de sécurité.

## Exécutions et preuves

- `npm test` : PASS avant et après le correctif, huit scripts.
- `npm run test:browser` : les quatre gates existants passent sur source puis build. Ces exécutions ont démarré avant le correctif de message ; elles ne sont pas présentées comme une relance intégrale finale des cinq gates.
- `node tests/learning-browser.cjs` avec instrumentation temporaire : PASS, source ; programme correct, résultat incorrect, syntaxe, fonctions manquantes via tests, timeout, annulation, fermeture/réouverture, changement de niveau, brouillons et reprise.
- `node tests/python-access-browser.cjs` après correction : PASS sur source et build. Même assertion que celle ayant échoué : verrouillage à 1/5, déblocage à 2/5, CDN indisponible, retour utilisable, code conservé et reprise réelle réussie.
- Chargement lent/incomplet : gates existants avec délais contrôlés du runner, contenu 15 s et reprise ; aucune mesure de réseau lent sur Chrome utilisateur.
- `git diff --check` : vérifié avant commit.

Journaux : [unitaire final](evidence/p0-python/unit-final.log), [source](evidence/p0-python/browser-source.log), [build](evidence/p0-python/browser-build.log), [traces](evidence/p0-python/worker-trace.log), [échec ciblé initial](evidence/p0-python/focused-failure.log), [ciblé source final](evidence/p0-python/focused-source.log), [ciblé build final](evidence/p0-python/focused-build.log).

## Vérification dans Chrome

1. Ouvrir `http://127.0.0.1:8765/`, puis « Station TOKENISATION · accès accessible » ; choisir Première.
2. Valider Comprendre. Dans l’expérience, enregistrer ses prédictions, comparer `chats !`, remplacer par `chat !` et comparer à nouveau. Répondre aux deux questions puis « Interpréter et terminer l’expérience ». Vérifier 2/5 et bouton actif.
3. Saisir exactement :

```python
def tokeniser(texte):
    return texte.split()
```

4. Cliquer « Exécuter les tests Python ». Attendre le chargement (maximum 60 s) puis le résultat. Attendu : huit coches et « Tests réussis ».
5. En cas d’échec, conserver le brouillon et copier le message affiché. Ne pas effacer le stockage. Après mise à jour du fichier d’interface, recharger normalement la page ; les brouillons restent locaux.
6. Si le compteur est 2/5 mais le bouton reste grisé, ou si l’exécution échoue : ouvrir F12, onglet Console, noter uniquement les erreurs et noms de fichiers, sans copier du code ni du stockage. Dans Réseau, observer le prochain essai et relever URL/statut des requêtes `python-worker`, `manifest`, `tokenisation`, `pyodide`. Si le bouton ne lance rien, l’absence de ces requêtes est une information utile. Ne pas exporter un HAR complet, des cookies ou des données privées. Ne pas coller de commande dans la console.

Pas de certification de résolution sur le poste réel tant que l’utilisateur n’a pas confirmé l’activation et l’exécution. La nécessité de deux comparaisons reste une difficulté ergonomique observée ; les exigences pédagogiques ont été conservées.
