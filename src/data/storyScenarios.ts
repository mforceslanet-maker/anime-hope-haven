import { StoryScenario } from '../types/story';

export const storyScenarios: StoryScenario[] = [
  {
    id: 'scenario-1',
    title: 'A Friend in Need',
    description: 'Nova looks sad today and is sitting alone in the corner.',
    characters: ['nova', 'junno', 'lex'],
    choices: [
      {
        id: 'choice-1a',
        text: 'Check on her',
        isCorrect: true,
        outcome: 'Nova smiles and feels supported. Your friendship grows stronger.',
        characterReaction: 'Nova: "Thank you for caring. I really needed someone to notice."',
      },
      {
        id: 'choice-1b',
        text: 'Ignore her',
        isCorrect: false,
        outcome: 'Nova feels more isolated and her sadness deepens.',
        characterReaction: 'Junno: "What if we had reached out? Sometimes a simple check-in can change everything."',
      },
    ],
  },
  {
    id: 'scenario-2',
    title: 'The Difficult Choice',
    description: 'Skye is facing pressure to skip an important commitment to hang out with friends.',
    characters: ['skye', 'alex', 'lex'],
    choices: [
      {
        id: 'choice-2a',
        text: 'Honor the commitment',
        isCorrect: true,
        outcome: 'Skye builds trust and self-respect. Real friends understand responsibility.',
        characterReaction: 'Alex: "You made the right choice. Integrity builds character and trust."',
      },
      {
        id: 'choice-2b',
        text: 'Skip the commitment',
        isCorrect: false,
        outcome: 'Trust is broken and Skye feels guilt and shame.',
        characterReaction: 'Skye: "I wish I had kept my word. What if I had chosen differently?"',
      },
    ],
  },
  {
    id: 'scenario-3',
    title: 'Standing Up',
    description: 'Someone is being unfairly treated, and you witness it happening.',
    characters: ['junno', 'nova', 'alex'],
    choices: [
      {
        id: 'choice-3a',
        text: 'Speak up respectfully',
        isCorrect: true,
        outcome: 'You create positive change and show courage. Others are inspired.',
        characterReaction: 'Junno: "Your courage made a difference. Standing up for others takes real strength."',
      },
      {
        id: 'choice-3b',
        text: 'Stay silent',
        isCorrect: false,
        outcome: 'The situation worsens and you feel regret for not acting.',
        characterReaction: 'Nova: "What if we had found the courage to speak? Sometimes silence enables harm."',
      },
    ],
  },
];