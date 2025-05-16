export enum Direction {
  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
  BOTTOM = "bottom",
  DOUBLE_TAP = "double_tap",
}

// Define profile type for TypeScript
export interface Photo {
  id: number;
  name: string;
  description: string;
  image: string | string[];
  swipeDirection?: Direction;
}

export interface DisplayPhoto extends Photo {
  originalId: number;
  image: string;
}
