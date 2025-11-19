import { Question } from './types';

export const APP_TITLE = "Parallel Pals";

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Which pair of lines is parallel?",
    options: ["Lines that cross like an X", "Lines that never touch like train tracks", "Lines that meet at a corner", "Curvy lines that touch"],
    correctIndex: 1,
    explanation: "Parallel lines go in the same direction and never touch!",
    imageType: 'lines'
  },
  {
    id: 2,
    text: "What happens if you make parallel lines longer and longer?",
    options: ["They will eventually touch", "They will move further apart", "They will never meet", "They will turn into a circle"],
    correctIndex: 2,
    explanation: "No matter how long they are, parallel lines never meet.",
    imageType: 'concept'
  },
  {
    id: 3,
    text: "Look at a rectangle. How many pairs of parallel sides does it have?",
    options: ["0", "1", "2", "4"],
    correctIndex: 2,
    explanation: "A rectangle has two pairs: top/bottom are parallel, and left/right are parallel.",
    imageType: 'shape'
  },
  {
    id: 4,
    text: "Why are train tracks parallel?",
    options: ["To look pretty", "So the train wheels stay on the tracks", "To save metal", "It was a mistake"],
    correctIndex: 1,
    explanation: "The wheels need to be the same distance apart to stay on the rails safely!",
    imageType: 'real-world'
  },
  {
    id: 5,
    text: "Parallel lines are always...",
    options: ["The same distance apart", "Getting closer", "Getting wider", "Touching"],
    correctIndex: 0,
    explanation: "The distance between parallel lines stays the same everywhere.",
    imageType: 'concept'
  },
  {
    id: 6,
    text: "Which letter consists of parallel lines?",
    options: ["A", "H", "V", "X"],
    correctIndex: 1,
    explanation: "The two vertical sides of the letter H are parallel!",
    imageType: 'concept'
  },
  {
    id: 7,
    text: "If two lines cross each other, they are...",
    options: ["Parallel", "Intersecting", "Invisible", "Broken"],
    correctIndex: 1,
    explanation: "Intersecting means crossing. Parallel lines never cross.",
    imageType: 'lines'
  },
  {
    id: 8,
    text: "Look at a ladder. The rungs (steps) are usually...",
    options: ["Parallel to each other", "Touching each other", "Crossing each other", "All different directions"],
    correctIndex: 0,
    explanation: "Ladder steps run in the same direction so you can climb up!",
    imageType: 'real-world'
  }
];

// Helper to calculate angle in degrees between two points
export const calculateAngle = (p1: {x: number, y: number}, p2: {x: number, y: number}): number => {
  const dy = p2.y - p1.y;
  const dx = p2.x - p1.x;
  let theta = Math.atan2(dy, dx); // range (-PI, PI]
  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
  return theta;
};

// Helper to check if two angles are parallel within tolerance
export const isParallel = (angle1: number, angle2: number, tolerance: number = 5): boolean => {
  // Normalize angles to 0-180 for line orientation check
  let a1 = angle1 % 180;
  let a2 = angle2 % 180;
  if (a1 < 0) a1 += 180;
  if (a2 < 0) a2 += 180;
  
  const diff = Math.abs(a1 - a2);
  // Check normal difference or wrap-around difference (near 0/180)
  return diff <= tolerance || Math.abs(diff - 180) <= tolerance;
};

export const getRandomColor = () => {
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
  return colors[Math.floor(Math.random() * colors.length)];
};