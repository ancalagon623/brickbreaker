## Setup

### npm start

I used create-react-app to set this project up initially, but with the typescript option enabled.

There are two main sections of the app: the React components that give the page its structure and layout, and the actual game logic built on Pixi.js' display and rendering system.

The second section is where the magic happens. Without this stuff the page would be the bare layout with a black canvas in the center.

You can find the typsecript types in src/game-logic, and the game classes which are built off of Pixi's base classes in src/game-logic/models. Since Pixi's display objects are about as object oriented as JavaScript gets, I needed to define new classes for the paddle, ball, etc.

The game is in progress. Contact me if you have any questions!
