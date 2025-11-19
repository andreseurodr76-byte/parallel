export enum Phase {
  Discovery = 0,
  Exploration = 1,
  Challenge = 2,
  Assessment = 3,
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  imageType?: 'lines' | 'shape' | 'real-world' | 'concept'; 
  imageData?: any; 
}

export interface Point {
  x: number;
  y: number;
}

export interface LineSegment {
  start: Point;
  end: Point;
  id: string;
}
