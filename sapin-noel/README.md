# Sapin de Noël animé

Ce petit projet de **code art** dessine un sapin de Noël animé dans le navigateur. Il ajoute des guirlandes lumineuses qui clignotent, une étoile qui réagit aux basses, de la neige et des paroles synchronisées avec une musique.

## Contenu du projet

- `index.html` : la page web. Elle charge p5.js depuis un CDN, définit le fond et charge le dessin.
- `sketch.js` : le code p5.js qui crée l'animation, lit la musique, analyse le son et affiche les paroles.
- `last-christmas.mp3` : le fichier audio attendu par le programme. Il n'est pas inclus dans le dépôt ; ajoutez votre propre fichier à cet emplacement et nommez-le exactement ainsi. Les fichiers MP3 sont ignorés par Git.

## Lancer le projet

1. Placez le fichier audio `last-christmas.mp3` dans le même dossier que `index.html` et `sketch.js`.
2. Ouvrez `index.html` dans un navigateur. Il est préférable de lancer la page avec une extension de serveur local, comme **Live Server** dans VS Code.
3. Cliquez dans la page pour démarrer la musique et l'animation réactive au son.

p5.js est chargé depuis un CDN : une connexion Internet est donc nécessaire pour charger la bibliothèque. Aucun outil de compilation ni installation de dépendances n'est requis.

## Commandes

- **Clic** : démarre la musique au premier clic ; les clics suivants mettent la lecture en pause ou la reprennent.
- **Touche `L`** : affiche dans la console du navigateur le temps courant de la musique, en secondes. Utilisez ces valeurs pour synchroniser les paroles.

Pour ouvrir la console dans la plupart des navigateurs, appuyez sur `F12`, puis choisissez l'onglet **Console**.

## Personnaliser les paroles

Dans `sketch.js`, modifiez le tableau `lyrics` au début du fichier :

```js
const lyrics = [
  { time: 10.0, text: "ta première ligne" },
  { time: 14.0, text: "ta deuxième ligne" },
  { time: 18.0, text: "ta troisième ligne" },
  // Ajoutez les autres lignes ici
];
```

Chaque entrée contient :

- `time` : le moment de début de la ligne, en secondes depuis le début de la musique ;
- `text` : le texte à afficher.

Le tableau ci-dessus reprend les valeurs d'exemple présentes dans le projet : les textes « ta première ligne », etc. sont des espaces réservés, pas les paroles de la chanson. Remplacez-les par les textes que vous souhaitez afficher et ajoutez une entrée par ligne, dans l'ordre chronologique. Chaque ligne reste affichée jusqu'à ce qu'une autre entrée commence. Avant la première entrée, aucune parole n'est affichée.

Pour les synchroniser, démarrez la musique, écoutez le morceau et appuyez sur `L` au début de chaque ligne. Relevez les temps dans la console, puis reportez-les dans le tableau.

## Personnaliser le dessin et le son

Les principales valeurs à ajuster se trouvent dans `sketch.js` :

- `createCanvas(800, 600)` définit la taille de la scène.
- `TREE_X` et `TREE_Y` règlent la position du sapin.
- Les boucles dans `setup()` déterminent le nombre et la répartition des flocons et des ampoules.
- `drawTree()` dessine le tronc et les quatre étages du sapin.
- `drawLights()` anime les ampoules et leur halo.
- `drawStar()` dessine l'étoile au sommet.
- `drawSnow()` met à jour la position des flocons.
- `updateAudioLevel()` analyse les basses fréquences ; ce niveau fait pulser l'étoile et les lumières.
- `drawLyrics()` affiche la ligne en cours avec une apparition progressive.

La musique doit être démarrée par une action de l'utilisateur, conformément aux restrictions de lecture automatique des navigateurs. Si vous changez le nom du fichier audio, modifiez également `AUDIO_FILE` en haut de `sketch.js`.

## Dépannage

- **La musique ne démarre pas** : vérifiez que le fichier existe, qu'il s'appelle `last-christmas.mp3` et qu'il est à côté de `index.html`. Cliquez à nouveau dans la page et vérifiez la console.
- **La page est vide ou sans animation** : vérifiez la connexion Internet (p5.js est chargé depuis un CDN) et les erreurs dans la console du navigateur.
- **Les paroles ne sont pas synchronisées** : vérifiez les temps en secondes et leur ordre dans `lyrics`. Les paroles ne sont pas extraites automatiquement de la chanson : elles doivent être saisies manuellement.
