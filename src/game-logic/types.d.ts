import { Sprite } from '@pixi/sprite';

export interface SpriteWithVelocity extends Sprite {
  vx?: number;
  vy?: number;
  borders?: {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
  };
}

export interface BallSprite extends SpriteWithVelocity {
  paddleCollision?: string;
}

export type PaddleSprite = SpriteWithVelocity;

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

// Game State Object
export interface GameState {
  brickGrid?: Array<Sprite[]>;
  paddle?: PaddleSprite;
  ball?: BallSprite;
}
