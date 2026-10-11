# M03.1 — grille de revue enseignante et proposition de pilote

Cette fiche décrit une revue à réaliser. Elle ne rapporte ni validation scientifique indépendante déjà obtenue ni test sur élèves déjà effectué.

## Avant la séance

Relire l’explication, les quatre questions, le vocabulaire jouet et les huit/douze tests publics. Vérifier sur le poste réel l’ouverture de la station, les commandes, le défilement, Python et la restauration d’un brouillon. Ne pas utiliser de données personnelles, de secrets ou de code hostile. Expliquer la dépendance réseau et le caractère local des données, puis prévoir une copie volontaire du travail.

## Observation d’un petit groupe encadré

Proposer un pilote de 30 à 45 minutes (durée indicative, non mesurée). Observer sans donner les solutions : distinction mot/token/ID, prédiction pour « chats ! », choix d’un second exemple, lecture des inconnus, programmation selon le niveau, correction d’une erreur et rédaction du transfert. Noter les moments où l’élève attend, se perd dans le panneau ou prend la simulation pour un tokenizer réel.

Pour la revue humaine du transfert, utiliser cette grille ; aucun score n’est calculé par le jeu :

| Critère | 0 — À reprendre | 1 — Partiel | 2 — Argumenté |
|---|---|---|---|
| Mot et token | Confusion des unités | Distinction affirmée sans exemple | Exemple de sous-mot/ponctuation et conclusion justifiée |
| Vérification de deux modèles | Comptage split annoncé comme garantie | Mention d’un tokenizer sans protocole | Même texte traité avec tokenizer et vocabulaire exacts de chaque modèle, sans résultat inventé |
| Inconnus | Texte initial supposé récupérable | <UNK> mentionné sans perte expliquée | Perte d’information expliquée et repli jouet distingué des autres familles de tokenizers |
| Identifiants | Ordre numérique assimilé au sens | Étiquette évoquée mais ambiguë | IDs distingués des unités ; aucune importance sémantique déduite de leur valeur |

Une case d’autoévaluation cochée n’est pas une preuve de qualité. Demander à l’élève de montrer la phrase qui justifie chaque critère, puis corriger les confusions. Le statut « parcours réalisé » ne remplace pas cette revue. La conservation de la note dans ce navigateur aide à la relire ; aucun tableau de bord enseignant, contrôle de rôle ou partage automatique n’est implémenté.

## Après la séance

Recueillir seulement les observations nécessaires, sans exporter automatiquement le code ou les réponses. Identifier les obstacles conceptuels et ergonomiques avant d’étendre M03. Tester séparément un Android réel avec clavier virtuel, tactile, changement d’orientation et profilage GPU : les captures desktop en émulation ne prouvent pas cette utilisabilité. Aucun autre module ne doit être annoncé terminé sur la base de ce pilote.
