# Décisions — fondations pédagogiques

## Contenu et exécution

`curriculum/llm-nsi.json` reste le référentiel des douze modules conçus. `curriculum/missions/manifest.json` référence uniquement les missions implémentées. Une définition versionnée porte objectifs, explication, expérience, variantes de niveau, code initial, tests et transfert. Seule M03 a une définition ; les autres stations ne deviennent pas jouables du fait de leur présence dans le référentiel.

`src/mission-engine.js` ne dépend ni du DOM ni de Babylon. Il calcule `unimplemented`, `locked`, `available`, `in_progress`, `completed`. Les prérequis NSI restent des compétences affichées ; `moduleDependencies` déclare séparément les dépendances de missions et interdit les cycles. L'atelier M03 est autonome, sans prérequis artificiel vers une station non implémentée. Une future station requiert une définition et une expérience/UI adaptée ; elle réutilise progression et évaluateur sans copier une station entière.

`src/learning-ui.js` adapte M03 à un panneau du jeu. La scène fournit seulement ouverture/fermeture et actualisation du statut. L'expérience par blancs n'est pas une simulation de BPE : aucun découpage industriel ou estimation de contexte n'est prétendu. Le vocabulaire jouet expose les pertes liées à `<UNK>`. Première : tokeniser ; Terminale : tokeniser, encoder et decoder.

## Réussite et confidentialité

Les cinq étapes se valident dans l'ordre. La compréhension demande une réponse, l'expérience une manipulation, programmation/tests une exécution Python réussie, transfert un choix justifié par la situation. Ce QCM de transfert est une première évaluation limitée ; il ne remplace pas une justification libre évaluée par un enseignant. Les deux niveaux ont des progrès indépendants. Les tests sont publics, y compris les cas de robustesse ; pas de tests secrets prétendument inviolables dans un client navigateur.

Stockage `nexus.progress.v2` : version de mission, étapes réussies et nombre de tentatives par module/niveau. Pas de nom, réponse ni code enregistré. Les brouillons restent en mémoire et ne survivent pas au rechargement. Une modification de version de mission invalide sa réussite antérieure. L'ancien `nexus.mission01.v1` est conservé mais ignoré : trois tests historiques ne certifient pas les cinq étapes. Stockage refusé/corrompu : repli en mémoire et avertissement visible. LocalStorage n'est ni anti-triche ni synchronisation multi-appareil.

## Python et limites de sécurité

Worker neuf par tentative, namespace Python neuf, tests chargés depuis le catalogue local, comparaison des résultats par l'hôte JS. Une sortie `MISSION_VALIDEE` ne valide rien. Limites : code 32 Ko, sorties bornées, chargement 60 s puis calcul 12 s, terminaison sur annulation/changement de niveau/fermeture. Le Worker est une protection de réactivité, pas une sandbox pour code malveillant : Pyodide expose JS et réseau. Aucun secret dans cet environnement. CDN Pyodide 0.27.7 ; auto-hébergement à prévoir.

## Vérification et maintien du prototype

Tests moteur : ordre, niveaux, versions, reprise, stockage indisponible, dépendances/cycles. Tests navigateur : vraie scène et Python, erreurs, timeout, reprise, captures portrait/paysage/desktop. Aucun changement de style 3D. Les budgets GPU et FPS restent non validés sur appareil réel ; le nombre élevé de maillages impose une phase de profilage avant extension artistique.
