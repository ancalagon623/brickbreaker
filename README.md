## Setup

I used create-react-app to set this project up initially, but with the typescript option enabled.

There are two main sections of the app: the React components that give the page its structure and layout, and the game logic that is built on Pixi.js' display and rendering system.

### This part is still in progress.
The other section contains all of the Pixi.js game logic, and this is where the magic happens. Without this stuff the page would be the bare layout with a black canvas in the center.

You can find the typsecript types in src/game-logic, and the game classes which are built off of Pixi's base classes in src/game-logic/models. Since Pixi's rendering logic is about as object oriented as JavaScript gets, I needed to define new classes for each type of game object.

THe game is in progress. Contact me if you have any questions! Pixi is a great rendering engine by the way.
