export enum Direction {
  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
}

// Define profile type for TypeScript
export interface Photo {
  id: number;
  name: string;
  description: string;
  image: string;
  swipeDirection?: Direction;
}
