import { Application, Container, Sprite } from 'pixi.js';

export enum Collisions {
  Vertical,
  Horizontal,
  None,
}

export interface SpriteWithVelocity extends Sprite {
  vx: number;
  vy: number;
  borderCollision: {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  };
}

export interface BallSprite extends SpriteWithVelocity {
  paddleCollision: Collisions;
}

export type PaddleSprite = SpriteWithVelocity;

export interface BrickSprite extends Sprite {
  ballCollision: {
    _warning: Collisions;
    type: Collisions;
    broken: boolean;
  };

  breakingAnimation: {
    stage: number;
  };

  break: () => void;
}

export interface BrickContainer extends Container {
  children: BrickSprite[];
}

// Input listeners for the game control keys
export interface KeyObject {
  value: string;
  [key: string]: any;
  press?: () => void;
  release?: () => void;
  downHandler?: (event: KeyboardEvent) => void;
  upHandler?: (event: KeyboardEvent) => void;
  unsubscribe?: () => void;
}

export interface Config {
  app: Application;
}

// Game State Object
export type GameState = {
  app: Application;
  score: number;
  renderList: {
    bricks: BrickContainer;
    paddle: PaddleSprite;
    ball: BallSprite;
  };
};

export type GameObject = PaddleSprite | BallSprite | BrickContainer;
