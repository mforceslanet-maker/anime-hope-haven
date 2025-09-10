import { StoryCharacter } from '../types/story';

export const storyCharacters: StoryCharacter[] = [
  {
    id: 'junno',
    name: 'Junno',
    description: 'A wise and thoughtful companion who helps with decision-making',
    personality: 'Analytical, supportive, calm',
    ageGroup: 'adult',
    image: '/api/placeholder/200/200',
    color: 'hsl(210, 60%, 60%)',
  },
  {
    id: 'lex',
    name: 'Lex',
    description: 'An energetic friend who brings positivity to every situation',
    personality: 'Upbeat, encouraging, motivational',
    ageGroup: 'young-adult',
    image: '/api/placeholder/200/200',
    color: 'hsl(280, 50%, 65%)',
  },
  {
    id: 'nova',
    name: 'Nova',
    description: 'A compassionate soul who understands diverse perspectives',
    personality: 'Empathetic, inclusive, gentle',
    ageGroup: 'young-adult',
    image: '/api/placeholder/200/200',
    color: 'hsl(340, 45%, 60%)',
    isMuslim: true,
  },
  {
    id: 'skye',
    name: 'Skye',
    description: 'A creative spirit who sees beauty in every challenge',
    personality: 'Artistic, intuitive, inspiring',
    ageGroup: 'teen',
    image: '/api/placeholder/200/200',
    color: 'hsl(200, 65%, 70%)',
  },
  {
    id: 'alex',
    name: 'Alex',
    description: 'A practical guide who helps navigate real-world situations',
    personality: 'Realistic, helpful, grounded',
    ageGroup: 'middle-aged',
    image: '/api/placeholder/200/200',
    color: 'hsl(120, 45%, 55%)',
  },
];

export const getCharactersByAge = (age: number): StoryCharacter[] => {
  if (age <= 17) {
    return storyCharacters.filter(char => 
      char.ageGroup === 'teen' || char.ageGroup === 'young-adult'
    );
  } else if (age <= 25) {
    return storyCharacters.filter(char => 
      char.ageGroup === 'young-adult' || char.ageGroup === 'adult'
    );
  } else if (age <= 45) {
    return storyCharacters.filter(char => 
      char.ageGroup === 'adult' || char.ageGroup === 'middle-aged'
    );
  } else {
    return storyCharacters.filter(char => 
      char.ageGroup === 'middle-aged' || char.ageGroup === 'adult'
    );
  }
};