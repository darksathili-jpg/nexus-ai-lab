# M03.2 — audit novice et proposition de refonte

11 octobre 2026. Branche inspectée : `review/m03-tokenisation`, HEAD `ef806de`. Git propre avant audit. **Document de proposition : aucune implémentation autorisée à ce stade.**

## 1. Périmètre et preuves

Lecture du contenu réel de `curriculum/missions/tokenisation.json`, du référentiel, du HTML, du modèle comparatif, de l’adaptateur pédagogique, du runner Python, du stockage des brouillons, des tests navigateur et de la fiche enseignante. Inspection dans un contexte Chromium vierge à 390×844 : ouverture, lecture des quatre sections, compréhension sans réponses, comparaison et changement vers Terminale. Le journal est dans `artifacts/m03-2-audit.log` (artefact local non versionné). Aucun profil ni travail utilisateur inspecté.

Observations exécutées : le panneau contient les quatre sections simultanément ; quatre boutons sont désactivés à l’ouverture (`savePrediction`, `experiment`, `run`, `checkTransfer`). Python possède une raison et un lien, les trois autres n’ont pas d’explication locale équivalente. Une compréhension vide reçoit une seule consigne abstraite pour quatre réponses. La comparaison affiche en un bloc le dictionnaire, les unités, les IDs, le décodage et les inconnus des deux méthodes. Le premier indice Terminale concerne seulement la séparation sur les blancs.

C’est une inspection experte du parcours avec un regard novice, **pas une observation d’élèves**. Pas de nouvelle exécution de `npm test` ou de la suite navigateur pour ce plan ; les résultats de la livraison précédente ne sont pas revendiqués comme une validation de M03.2.

## 2. Inventaire du vocabulaire

« Présent » signifie qu’une explication existe aujourd’hui ; cela ne garantit pas qu’elle soit accessible ou placée avant la première occurrence.

| Termes rencontrés | Situation actuelle / premier emplacement | Introduction proposée |
|---|---|---|
| LLM, modèle de langage | LLM apparaît dans les questions/transfert ; aucune définition de départ | Accueil : programme entraîné sur des textes pour calculer des suites de texte ; LLM = grand modèle de langage. Aucun raisonnement humain présumé |
| Tokenisation, tokeniser | Nom de station et tâche ; avant exemple concret | Sous-titre d’accueil : découper un texte en éléments ; nom scientifique après manipulation |
| Mot, unité de langue, unité de découpage | Formulation abstraite dans l’explication | Écran 4 : « chats » est un mot ; une méthode peut le couper en plusieurs morceaux |
| Token, tokenizer | Token défini par un tokenizer qui n’est pas défini | Écran 4 : token = élément retenu par le découpage ; tokenizer = outil qui applique les règles de découpage et associe des IDs |
| Sous-mot | Terme utilisé avant une observation manipulée | Écran 4 : « chat » et « s » sont des morceaux du mot « chats » dans notre simulation |
| Vocabulaire, vocabulaire jouet | Liste technique, rôle expliqué indirectement | Écran 4 : répertoire des éléments reconnus ; ici une petite table choisie pour apprendre |
| Identifiant, ID, étiquette | Identifiant défini ; abréviation et « étiquette » peu concrètes | Écran 4 : numéro associé à un élément, comme un numéro de fiche ; 7 n’est pas une note d’importance |
| Encodage, décodage | Actions des questions/tableau, sans définition distincte | Écran 4 : remplacer les éléments par leurs numéros ; faire la correspondance inverse vers une liste d’éléments |
| Unité inconnue, absent, `<UNK>`, repli, 0 | Présentation simultanée, symbole anglais non développé | Écran 4 : élément absent de notre table ; 0 sert de numéro de secours ; `<UNK>` signifie « inconnu » dans cet exercice |
| Simulation, tokenizer industriel/réel | Avertissement présent ; différence dense | Écrans 2–4 : deux règles choisies à la main pour apprendre ; aucune prétention de prédire les découpages des LLM |
| BPE, WordPiece, fusions, apprentissage | Noms sans explication dans le texte obligatoire | Retirer du parcours obligatoire ; explications en approfondissement facultatif, introduites avant leurs acronymes |
| Octet, Unicode, normaliser, casse, accents | Détails de l’explication/tests avant besoin | Garder les accents concrets ; expliquer majuscules/minuscules et normalisation seulement si nécessaires ; octets/Unicode en approfondissement |
| Blancs, `split()`, `split(" ")` | « Blancs » suppose espaces/tabulations/retours ; méthode non démontrée avant prédiction | Écran 2 : règle « séparer aux espaces » pour cet exemple ; écran 6 : tous les blancs = espaces, tabulations et retours à la ligne, démonstration Python |
| Chaîne, liste, fonction, paramètre, `return`, `pass`, méthode | « liste des unités », code initial et indices supposent les acquis | Écran 6 : rappel court avec entrée/sortie ; `pass` laisse la fonction à compléter, `return` renvoie sa réponse |
| Dictionnaire, `get`, inverse, injectif | Terminale : « vocabulaire injectif », indice « inverse » | Terminale : table clé/valeur ; chaque élément reçoit un numéro différent ; recherche inverse illustrée avant le terme injectif |
| Tests publics, robustesse, contrat public, cas limites | Réussite/échec et tâche utilisent ces catégories | Écran 6 : un test appelle la fonction sur un exemple et compare au résultat attendu ; exemples inhabituels = vide, espaces répétés… |
| Type, syntaxe, indentation, noms de variables | Conseils d’erreur sans illustration | Écran 6 : rappel et exemple contextuel au premier échec, détail technique facultatif |
| Pyodide, Worker, sandbox | Phrase technique/sécurité avant utilisation effective | Écran 6 : Pyodide fait tourner Python dans le navigateur ; connexion pour le charger. Worker/sandbox dans les informations techniques, limite de sécurité clairement conservée |
| Stockage local, origine, chiffrement, synchronisation | Long avertissement avant l’action principale | Message court permanent « Sauvegardé dans ce navigateur seulement » ; détails accessibles et alerte immédiate si indisponible |
| Prérequis, référentiel, dossier, tentative | Métadonnées du moteur visibles comme objectifs | Employer « Ce qu’il faut connaître », « Ton travail », « Essais Python » ; détails du référentiel hors parcours |
| Transférer, protocole, autoévaluation, sémantique, certifier | Consigne finale et avertissement abstraits | Écran 7 : réutiliser l’idée dans un nouveau cas ; expliquer comment vérifier ; se relire avec quatre questions ; enseignant relit le raisonnement |

## 3. Matrice des obstacles

P1 : nécessaire pour le parcours novice ; P2 : amélioration complémentaire. Les corrections déjà livrées (persistance, quatre indicateurs, lien Python) sont conservées.

| Problème | Emplacement | Conséquence possible | Correction envisagée | Priorité |
|---|---|---|---|---|
| Question scientifique avant exemple vécu | Comprendre | Deviner les définitions pour accéder à l’expérience | Observer/prédire/manipuler avant nommer et vérifier | P1 |
| Jargon cumulatif de l’inventaire | Explication et consignes | Lecture interrompue dès un mot inconnu | Définition au premier usage + exemple + rappel consultable | P1 |
| Un long paragraphe couvre presque tout | Explication | Difficulté à repérer l’idée centrale | Une notion/illustration par vue ; approfondissements séparés | P1 |
| LLM non défini, titre déjà technique | Entrée de station | Objectif sans contexte | Question concrète et définition courte dès l’accueil | P1 |
| Sept actions réunies dans l’expérience | Prédiction/comparaison/interprétation | Clic final sans comprendre ce qui manque | Sous-écrans distincts et prochaine action affichée | P1 |
| Prédiction sur deux méthodes non démontrées | Champs numériques | Pari arbitraire plutôt qu’hypothèse raisonnée | Présenter les règles sur un autre exemple avant prédiction | P1 |
| « Un autre texte » sans exemple ni méthode | Champ `sample` | Répéter le même résultat ou ne pas déclencher la comparaison | Consigne « modifie puis compare », exemple suggéré non validant | P1 |
| Quatre indicateurs proches du bouton mais éloignés des actions | Fin d’expérience | Aller-retour dans un long panneau | Indicateur de l’action courante + résumé final des quatre conditions | P1 |
| Tableau JSON mélange découpage et numérotation | Résultat comparatif | Confondre token, mot, numéro et inconnu | Cartes de morceaux ; numéros introduits dans une vue ultérieure | P1 |
| Choix sur une ligne tronquée en portrait | Listes de réponses | Ne pas pouvoir lire toutes les propositions | Choix textuels sur plusieurs lignes, clavier et tactile | P1 |
| Mauvaise compréhension : feedback global | `understandingResult` | Ne pas savoir quelle idée revoir | Retour par question avec exemple, réponses conservées | P1 |
| Comparaison répétée ne constitue pas un second texte | Bouton Comparer | Croire l’activité terminée | « Même texte : aucun nouvel exemple ajouté », action suivante précise | P1 |
| Prédiction enregistrée devient non modifiable sans motif adjacent | Champs/bouton | Interpréter l’immobilité comme une panne | « Hypothèse initiale conservée pour la comparer au résultat » ; réflexion ensuite permise | P1 |
| Prédiction/comparaison désactivées sans raison locale | Début d’expérience | Chercher un bouton fonctionnel ailleurs | Raison et accès direct, ou activité pas encore affichée | P1 |
| Transfert désactivé sans raison locale | Fin de mission | Blocage incompréhensible | « Termine les tests Python pour enregistrer cette activité » + lien | P1 |
| Indices épuisés : bouton grisé sans explication | Atelier Python | Ne plus savoir où chercher de l’aide | « Tous les indices sont affichés », possibilité de les relire | P2 |
| Quatre grandes sections accessibles simultanément | Panneau/nav | Sauter vers un formulaire non contextualisé | Une vue courte active ; navigation vers vues découvertes | P1 |
| « 3 et 4 » et « 1/5 » mélangent position et validation | Titres/compteur | Ne pas comprendre ce qui avance | Position dans le parcours distincte des acquis validés | P1 |
| Entrée/sortie Python cachées dans une liste de tests | Avant éditeur | Ne pas savoir quel résultat produire | Exemple toujours visible avant et pendant l’écriture | P1 |
| `pass` et « Implémente » sans accompagnement | Code initial | Exécuter un squelette en croyant qu’il est fini | Tâche concrète, emplacement à compléter et rappel `return` | P1 |
| Même chaîne d’indices pour les deux niveaux | Hints | Indice Terminale sans lien avec fonction en cours | Indices par fonction et obstacle, sans correction instantanée | P1 |
| Chargement/exécution regroupés ; `ready` non expliqué | Résultat Python | Confondre attente réseau et calcul bloqué | États distincts via événements existants ; délais et annulation explicites | P1 |
| Erreurs brutes et conseil générique | Python | Être abandonné face à un traceback ou à un résultat faux | Résumé français/action de correction, détails repliables, tests lisibles | P1 |
| Avertissements techniques dominent l’atelier | Sous éditeur | Surcharge avant de lancer un test | Information essentielle courte ; détails techniques disponibles | P1 |
| Transfert demande quatre raisonnements dans une phrase | Consigne finale | Ne pas savoir commencer la note | Question centrale et trois amorces facultatives, grille expliquée | P1 |
| 80 caractères et quatre coches ne mesurent pas le raisonnement | Validation finale | Confondre dossier rempli et maîtrise | Afficher la complétude formelle, autoévaluation déclarée et rôle enseignant | P1 |
| Reprise rouvre par défaut Première et remet le texte initial | Niveau/rechargement | Croire le travail perdu ou changer involontairement de parcours | Reprendre niveau/vue, conserver brouillons et état pertinent | P1 |
| Diagnostics techniques toujours visibles | Expérience | Ajouter du bruit après résolution des incidents | Garder les conditions ; diagnostics non sensibles consultables | P2 |

## 4. Parcours proposé, écran par écran

Sept étapes visibles. Certaines comportent deux ou trois vues courtes ; l’élève ne voit qu’une vue à la fois. « Étape 3 sur 7 » désigne sa position, pas une réussite. Les validations restent explicites.

Chaque vue conserve : **À faire maintenant**, **Pourquoi**, **Déjà réussi**, **Il reste**, une action principale et une aide contextuelle. Une prédiction fausse n’est pas une faute bloquante. Aucun clic « Suivant » n’accorde une compétence à lui seul.

### 1 — Observer : « Comment un texte devient-il des nombres ? »

Définir modèle de langage et LLM ; montrer `salut monde` dans une chaîne visuelle texte → morceaux → nombres, clairement étiquetée « exemple pédagogique ». Ne pas attribuer ce découpage à un modèle commercial.

Action principale : « Explorer deux façons de découper ». Aucun savoir déjà acquis déclaré. Présenter le niveau choisi et ce qui sera travaillé ; première visite par défaut Première. Une reprise propose « Reprendre mon travail » sans imposer une remise à zéro.

### 2 — Hypothèse : « Combien de morceaux pour chats ! ? »

Présenter deux règles en français : séparer aux espaces pour cet exemple ; utiliser les morceaux d’un petit répertoire manuel. Démontrer sur `salut monde`, pas sur le texte demandé. Introduire `split()` seulement comme nom de la première méthode Python, avec sa définition visible. Ne pas montrer le résultat de `chats !` avant l’enregistrement.

Demander deux nombres : « Je prévois … morceaux avec chaque règle ». Action : « Garder mon hypothèse ». Entrée absente/non entière : préciser le champ et un exemple de nombre, sans effacer la saisie. L’hypothèse reste conservée pour discussion, même si fausse.

### 3 — Manipuler : deux vues séparées

**3a. Premier exemple.** Action « Comparer chats ! ». Deux rangées de cartes : `[chats] [!]` et `[chat] [s] [!]`, compteurs 2 et 3. Cartes lisibles avec équivalent textuel ; aucune interaction ne dépend du glisser-déposer, de la couleur ou du survol. Explication limitée à la différence observée.

**3b. Deuxième exemple.** « Change le texte, puis compare pour voir si la différence reste la même ». Exemple suggéré `chat !`, qui remplit seulement le champ ; l’élève doit encore comparer. Action « Comparer mon nouvel exemple ». Même texte répété : résultat affiché et retour explicite, aucune nouvelle observation créditée. Une fois un second texte distinct enregistré, action principale « Comprendre ce que montrent les morceaux ».

Garder les deux observations nécessaires et l’hypothèse. Cette étape ne marque pas encore `experimenter` : les explications et l’interprétation restent à vérifier.

### 4 — Découvrir les mots scientifiques : trois vues

**4a. Mot, token, tokenizer, sous-mot.** Reprendre les cartes de l’élève et nommer ce qu’il a vu. « Un token est un élément choisi par le découpage ; ici “s” est un sous-mot utilisé comme token. » Rappeler la ponctuation et le fait qu’un mot ne garantit pas un token. Simulation manuelle, sans apprentissage : limite visible et courte.

**4b. Vocabulaire, ID, encodage.** Petite table `chat → 7`, `s → 2`, `! → 3`. Choisir une carte pour voir sa correspondance et la liste `[7, 2, 3]`. Définir chaque terme avant son utilisation. Montrer que 7 n’exprime aucune importance. Action principale pour examiner la correspondance ; pas de validation d’apprentissage par simple animation.

**4c. Inconnu et décodage.** Un exemple absent de la table est remplacé par 0 ; expliquer `<UNK>` avant affichage. Montrer le retour vers une liste d’éléments et demander d’observer l’information perdue. La liste décodée n’est pas le texte original : blancs perdus même sans inconnu. Ce repli est propre à l’exercice ; ne pas le présenter comme universel. Approfondissements BPE/WordPiece facultatifs.

### 5 — Vérifier : une question à la fois

Quatre distinctions actuelles maintenues (mot, sous-mot, ponctuation, ID), puis deux interprétations de l’expérience. Réponses lisibles entièrement, sans menu tronqué. Pour une erreur : dire l’idée à revoir, remontrer l’exemple pertinent et permettre une nouvelle tentative sans effacer les autres réponses.

Les quatre questions justes marquent `comprendre`. Les deux interprétations justes ne suffisent pas seules : résumé final des quatre conditions, puis action explicite « Valider mon expérience ». Toutes les conditions réunies marquent `experimenter` et débloquent Python. S’il en manque une, retour précis et lien vers la vue correspondante.

### 6 — Programmer et tester : préparation puis atelier

**6a. Comprendre le problème.** Première : « Écris une fonction qui sépare un texte aux blancs ». Entrée `"bonjour   monde"`, sortie `["bonjour", "monde"]`. Montrer aussi chaîne vide et ponctuation pour préciser le contrat. Expliquer que cette version utilise une règle simplifiée et ne programme pas un tokenizer LLM industriel.

Rappels consultables : chaîne, liste, fonction, paramètre, indentation, `return`, `pass`, méthode `split()` sans argument. Code initial conservant le nom testé, avec commentaire explicite « remplace pass par le traitement qui renvoie la liste ». Ne pas préremplir une solution évaluée comme travail de l’élève.

Terminale : même préparation, puis exemples pour `encoder` et `decoder`. Expliquer dictionnaire, correspondance unique et recherche inverse avant vocabulaire injectif. Les douze tests finaux restent exigés, même si les fonctions sont présentées successivement.

**6b. Atelier.** Éditeur, exemple compact visible, aide adaptée au niveau/fonction, action principale « Tester mon code ». Expliquer un test avant le premier clic. Pyodide défini simplement comme Python exécuté dans le navigateur ; connexion nécessaire au chargement, aucune promesse de sandbox ou de mode hors ligne.

États : « Préparation de Python » → « Python exécute ton code » → « Résultats des tests ». Exploiter `ready` existant ; ajouter seulement des jalons si nécessaires et testés. Aucun pourcentage fictif. Délais existants conservés : 60 s chargement, 12 s calcul.

Résultats : nombre de tests réussis et liste lisible ; pour chaque échec, nom, entrée/attendu lorsqu’ils appartiennent au contrat public, piste utile. Détail technique repliable. Une erreur de syntaxe explique par exemple les deux-points/indentation ; une fonction manquante renvoie au nom attendu ; un timeout conseille de revoir la condition de boucle ; une panne réseau propose « Réessayer ». Travail intact, nouvelle tentative disponible après arrêt. Succès accordé seulement par les huit/douze résultats réels.

Message court permanent : « Ton brouillon est enregistré dans ce navigateur, séparément pour chaque niveau ». Si stockage refusé/corrompu : alerte visible, consigne de copie, aucune suppression automatique. Réinitialisation volontaire confirmée. Changement de niveau ou fermeture annule l’exécution en cours et l’explique.

### 7 — Réinvestir : « Deux modèles liront-ils les mêmes morceaux ? »

Nouveau cas `microchats, 🚀`. Demander une justification libre ; trois amorces facultatives : « Ce que le comptage de mots ne permet pas de garantir… », « Ce que je comparerais… », « Ce qu’on perd dans notre table quand un élément est inconnu… ». Aucun découpage réel inventé.

Conserver les quatre critères d’autoévaluation, chacun expliqué et relié à la justification. Action principale « Enregistrer ma justification et mon autoévaluation ». Signaler les éléments formels manquants au bon endroit ; ne pas faire passer une longueur minimale pour une analyse du sens. Résultat : « Parcours réalisé ; raisonnement à relire avec l’enseignant ». Aucun faux correcteur sémantique ni rôle enseignant simulé.

## 5. Navigation, fiabilité et accessibilité

- Un seul écran actif ; position, niveau, sauvegarde et retour Atrium toujours repérables. Retour libre vers les vues découvertes, sans perte de saisie. Une destination future présente l’étape nécessaire et un lien, jamais une impasse muette.
- « Visité », « à compléter » et « validé » sont distincts. L’observation libre n’attribue aucun succès automatique.
- Une action principale par vue. L’action de validation reste disponible pour expliquer précisément un refus. Pendant un traitement réel, désactivation justifiée à côté du bouton ; éviter de masquer les étapes accessibles derrière des boutons gris.
- Navigation clavier complète, focus visible et placé au titre lors d’un changement d’écran ; fermeture Échap restaurée vers l’ouverture. Les changements d’état sont annoncés sans relire tout le panneau. Les vues masquées sortent de l’ordre de tabulation. Défilement à l’intérieur d’une vue possible, jamais besoin de parcourir toute la mission pour trouver l’action suivante.
- Cibles tactiles d’au moins 44 px, texte des choix en plusieurs lignes, zoom 200 %, 1440×900, 390×844 et 844×390. Aucune information uniquement en couleur ; aucun contenu indispensable réservé au survol. Atrium, scène, clavier/tactile et direction artistique conservés.
- Rappel contextuel des termes déjà introduits, via bouton accessible et retour au même champ. Ne pas faire reposer la compréhension sur un glossaire éloigné.

## 6. Décisions d’architecture proposées

Garder les cinq validations internes `comprendre → experimenter → programmer → tester → transferer`. Les sept étapes d’interface décrivent le parcours d’exposition, pas sept nouvelles compétences.

Changement nécessaire et explicite : autoriser la prédiction et les manipulations **avant** la validation de compréhension, pour respecter le nouveau parcours. Aujourd’hui l’adaptateur les interdit. Cela change leur accès, sans relâcher les conditions de validation : Python attend toujours compréhension + expérience complète. Le moteur indépendant du rendu conserve ses validations ordonnées.

Les textes, définitions, exemples, consignes et aides sont portés par le contenu M03. L’adaptateur gère les vues et déduit les prochaines actions depuis le dossier ; pas de nouvelle logique par station dans Babylon. Le runner, le Worker, les huit/douze cas et le stockage des brouillons restent conservés. Aucun nouveau composant ou service externe prévu.

Ajouter au dossier une position de reprise et les vues découvertes, par niveau, avec lecture tolérante des anciennes sauvegardes. Ne jamais transformer « vue découverte » en « étape validée ». Conserver les progrès `ef806de` et les brouillons ; ne pas revalider silencieusement de nouvelles exigences. Si un contrat pédagogique devait changer, documenter une migration séparée avant de l’appliquer. L’écran d’accueil explique tout ancien succès Python conservé comme tel.

Les tests liés au DOM devront être adaptés aux vues actives ; conserver leurs assertions pédagogiques, les échecs, les délais du runner et l’exécution réelle. Le dernier correctif des observations/réponses et ses cas partiels restent des exigences de non-régression.

## 7. Critères d’acceptation et futurs tests

| Scénario | Preuve attendue après implémentation |
|---|---|
| Novice, deux niveaux | Parcours complet depuis stockage vierge, tous les termes obligatoires définis dans la vue de première occurrence ; un exemple avant chaque tâche |
| Mauvaise réponse/hypothèse | Retour par question et lien vers exemple ; hypothèse erronée compatible avec bonne interprétation ; aucune saisie effacée |
| Activité interrompue | Retour même niveau/vue ; hypothèse, observations, réponses et code restaurés |
| Navigation dans le désordre | Aucune validation par visite ; raison locale et accès à l’étape attendue ; retour libre aux vues découvertes |
| Clic répété | Pas de double validation/tentative ; même texte identifié ; un seul Worker actif |
| Rechargement/dossier partiel | Progrès existants et quatre conditions restaurés ; historique >10 sans perte du texte initial ; reprise indépendante par niveau |
| Python correct/incorrect | Huit/douze cas réels ; syntaxe, fonction manquante, résultat incorrect, timeout, annulation et reprise ; code intact |
| Panne réseau/contenu | Chargement signalé ; CDN/Worker/catalogue indisponibles donnent une action utile ; aucune fausse réussite ni bouton définitivement bloqué |
| Boutons désactivés | Pour chaque bouton désactivé visible, raison textuelle associée et aide ou action de récupération quand applicable |
| Clavier/tactile/écran étroit | Parcours clavier seul, focus/Échap, choix lisibles, zoom, trois résolutions ; captures comparées et inspectées |
| Identité du jeu | Gates scène/GLB/texture/collisions/tactile conservés, aucune station ajoutée |
| Transfert | Réponse libre conservée, grille explicite, absence de prétention de validation sémantique automatique |

Exécutions prévues après implémentation : `npm test`, `npm run test:browser`, parcours et pannes sur le build en sous-répertoire, captures et journaux. Aucun PASS M03.2 annoncé avant leur exécution.

Une relecture enseignante puis un petit pilote novice restent nécessaires. À observer, sans fournir les solutions : l’élève trouve-t-il l’action suivante, explique-t-il mot/token/ID avec un exemple, distingue-t-il simulation et modèle réel, corrige-t-il une erreur et reprend-il son travail ? Noter chaque intervention d’aide et chaque consigne incomprise. Ces observations décideront des ajustements ; les tests automatiques démontrent le comportement du logiciel, pas l’efficacité pédagogique.

## 8. Ordre de réalisation après validation

1. Relecture du parcours et des formulations ; figer le contrat des sept étapes et les acquis conservés.
2. Contenu progressif et navigation des vues, avec reprise et diagnostic de chaque blocage.
3. Manipulations visuelles et vérification question par question, sans affaiblir les validations.
4. Préparation Python, aides différenciées et retours lisibles ; moteur existant conservé.
5. Transfert guidé, tests complets, captures, rapport et commits locaux atomiques.

**Arrêt au présent plan. L’implémentation attend la validation explicite de l’utilisateur.** Aucun push, merge, déploiement ou nouvelle station prévu.
