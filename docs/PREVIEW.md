# Prévisualisation NEXUS / AI LAB

La prévisualisation GitHub Pages est construite depuis la branche `art-direction/atrium-preproduction`, sans fusion dans `main`.

## Activation GitHub

1. Dans **Settings → Pages → Build and deployment**, sélectionner **GitHub Actions** comme source.
2. Ouvrir **Actions → NEXUS preview (development branch)** et vérifier que le workflow peut être exécuté.
3. Si GitHub ne propose pas ce workflow, c'est possiblement parce que son fichier n'existe pas sur la branche par défaut. Ne pas fusionner la Pull Request uniquement pour contourner cette restriction : il faut alors choisir une stratégie de publication approuvée séparément.
4. Attendre le succès de `deploy-pages` ; récupérer **l'URL réellement indiquée par GitHub** dans l'environnement `github-pages`. Ne pas considérer une URL supposée comme une preuve de déploiement.

## Limites et sécurité

- GitHub Pages publie un seul site par dépôt à la fois. Ce workflow **peut remplacer le site Pages existant** du dépôt : vérifier ce point avant toute exécution.
- Les ressources externes Babylon.js, Pyodide et avatar nécessitent encore Internet.
- Le prototype est expérimental et ne doit pas être utilisé comme plateforme d'évaluation des élèves sans vérification fonctionnelle et sécurité.
- Les captures automatiques de Chromium sont disponibles dans l'artifact `nexus-real-browser-captures` du workflow `Atrium browser evidence`.

## Solution de secours : archive jouable

Le workflow `NEXUS preview (development branch)` crée désormais un artifact `nexus-playable-preview` **avant** le déploiement Pages. Si le déploiement échoue après la construction, l'archive reste téléchargeable dans l'exécution GitHub Actions pendant 14 jours.

1. Ouvrir l'exécution du workflow et télécharger `nexus-playable-preview` dans **Artifacts**.
2. Décompresser l'archive dans un dossier, par exemple `nexus-preview`.
3. Dans PowerShell, ouvrir ce dossier et lancer `py -m http.server 8765`.
4. Ouvrir `http://localhost:8765` dans le navigateur.

Ne pas ouvrir directement `index.html` en `file://` : les chargements JavaScript et GLB nécessitent un serveur HTTP. L'archive n'est pas entièrement hors ligne, car certaines bibliothèques et ressources sont chargées sur Internet.
