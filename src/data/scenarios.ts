import { StoryScenario } from '../types/game';

export const storyScenarios: StoryScenario[] = [
  // Level 1 Scenarios - Teen Age Group
  {
    id: 'bullying-situation',
    title: 'Standing Up for Others',
    description: 'A story about courage and doing the right thing',
    characters: ['nova', 'skye', 'lex'],
    situation: "Nova notices a classmate being bullied during lunch break. The bullies are making fun of the student's appearance and taking their lunch money.",
    options: [
      {
        id: 'speak-up',
        text: "Tell Nova to speak up and get help from a teacher",
        isCorrect: true,
        consequence: "Nova bravely reports the bullying to a teacher. The bullies are stopped, and the victim feels supported. Nova feels proud for doing the right thing.",
        characterReactions: {
          nova: {
            expression: 'proud',
            dialogue: "I'm so glad I found the courage to help! Sometimes doing the right thing is scary, but it's always worth it."
          },
          skye: {
            expression: 'happy',
            dialogue: "You're amazing, Nova! You showed real strength by standing up for someone who needed help!"
          },
          lex: {
            expression: 'proud',
            dialogue: "That took real courage. You made a difference in someone's life today."
          }
        }
      },
      {
        id: 'ignore',
        text: "Tell Nova to ignore it and walk away",
        isCorrect: false,
        consequence: "Nova walks away, but feels terrible all day. The bullying continues, and Nova regrets not helping. The victim feels alone and scared.",
        characterReactions: {
          nova: {
            expression: 'sad',
            dialogue: "I feel awful... I should have helped. That person needed someone to stand up for them."
          },
          skye: {
            expression: 'concerned',
            dialogue: "What if we had chosen differently? What if Nova had been brave enough to help?"
          },
          lex: {
            expression: 'sad',
            dialogue: "Sometimes when we do nothing, we miss the chance to make someone's day better. What would have happened if Nova had spoken up?"
          }
        }
      }
    ],
    level: 1,
    ageGroup: 'teen'
  },
  {
    id: 'peer-pressure',
    title: 'Staying True to Yourself',
    description: 'A story about resisting peer pressure',
    characters: ['nova', 'junno', 'skye'],
    situation: "Nova is at a party where friends are pressuring them to try something they're not comfortable with. Everyone is saying 'come on, just this once!'",
    options: [
      {
        id: 'say-no',
        text: "Help Nova say no confidently and suggest an alternative",
        isCorrect: true,
        consequence: "Nova politely declines and suggests playing a game instead. True friends respect the decision, and Nova feels proud for staying true to their values.",
        characterReactions: {
          nova: {
            expression: 'proud',
            dialogue: "I'm so glad I stayed true to myself! Real friends respect your boundaries."
          },
          junno: {
            expression: 'proud',
            dialogue: "That took wisdom and strength. You showed that you can have fun while staying true to your values."
          },
          skye: {
            expression: 'happy',
            dialogue: "You were amazing! Standing up for yourself shows real courage!"
          }
        }
      },
      {
        id: 'give-in',
        text: "Tell Nova to give in to avoid conflict",
        isCorrect: false,
        consequence: "Nova gives in but immediately regrets it. They feel uncomfortable and realize these aren't true friends if they don't respect boundaries.",
        characterReactions: {
          nova: {
            expression: 'sad',
            dialogue: "I wish I had been stronger... I don't feel good about this decision."
          },
          junno: {
            expression: 'concerned',
            dialogue: "What if Nova had trusted their instincts? What if they had said no confidently?"
          },
          skye: {
            expression: 'sad',
            dialogue: "Real friends would have respected Nova's choice. What could have happened if Nova had stood firm?"
          }
        }
      }
    ],
    level: 1,
    ageGroup: 'teen'
  },
  // Level 1 Scenarios - Adult Age Group
  {
    id: 'work-stress',
    title: 'Managing Work Pressure',
    description: 'A story about handling workplace stress',
    characters: ['junno', 'lex', 'nova'],
    situation: "Junno has been working overtime for weeks and feels overwhelmed. Their boss keeps adding more tasks, and Junno hasn't had time for family or self-care.",
    options: [
      {
        id: 'set-boundaries',
        text: "Help Junno have an honest conversation with their boss about workload",
        isCorrect: true,
        consequence: "Junno schedules a meeting and professionally discusses the workload. The boss appreciates the honesty and helps prioritize tasks. Junno feels relieved and respected.",
        characterReactions: {
          junno: {
            expression: 'proud',
            dialogue: "I'm so glad I spoke up! Communication really does make a difference in the workplace."
          },
          lex: {
            expression: 'happy',
            dialogue: "You showed great wisdom in addressing this professionally. Taking care of yourself benefits everyone."
          },
          nova: {
            expression: 'proud',
            dialogue: "That took courage, but look at the positive outcome! You advocated for yourself respectfully."
          }
        }
      },
      {
        id: 'keep-silent',
        text: "Tell Junno to keep working harder without saying anything",
        isCorrect: false,
        consequence: "Junno continues to struggle in silence, leading to burnout and affecting their family relationships. Work quality begins to suffer from exhaustion.",
        characterReactions: {
          junno: {
            expression: 'sad',
            dialogue: "I'm so exhausted... I should have spoken up about this workload."
          },
          lex: {
            expression: 'concerned',
            dialogue: "What if Junno had been brave enough to communicate their needs? What if they had set healthy boundaries?"
          },
          nova: {
            expression: 'sad',
            dialogue: "Sometimes staying silent hurts more than speaking up. What could have changed if Junno had asked for help?"
          }
        }
      }
    ],
    level: 1,
    ageGroup: 'adult'
  },
  // Level 2 Scenarios
  {
    id: 'level2-celebration',
    title: 'Welcome to Level 2!',
    description: 'Celebrating your growth and new beginnings',
    characters: ['junno', 'lex', 'nova', 'skye'],
    situation: "🎉 Congratulations! You've made it to Level 2! All the characters are here to celebrate your emotional growth and welcome you to a new phase of your journey.",
    options: [
      {
        id: 'celebrate',
        text: "Join the celebration and share what you've learned",
        isCorrect: true,
        consequence: "Everyone celebrates together! The characters dance, sing, and share stories. You feel proud of your progress and excited for what's ahead.",
        characterReactions: {
          skye: {
            expression: 'happy',
            dialogue: "🎊 Welcome to Level 2! We're so proud of how far you've come! Let's dance!"
          },
          nova: {
            expression: 'proud',
            dialogue: "Your journey has been inspiring to watch. Level 2 is where we explore daily joys and challenges together!"
          },
          lex: {
            expression: 'happy',
            dialogue: "🌟 Like a flower that has bloomed, you've grown so much! Level 2 is about celebrating everyday moments."
          },
          junno: {
            expression: 'proud',
            dialogue: "You've shown real wisdom in your choices. Level 2 is where we share life's ups and downs as friends."
          }
        }
      },
      {
        id: 'hesitate',
        text: "Feel unsure about celebrating",
        isCorrect: false,
        consequence: "The characters gently encourage you, showing that it's okay to feel uncertain about new phases in life.",
        characterReactions: {
          junno: {
            expression: 'concerned',
            dialogue: "It's okay to feel uncertain! Change can be overwhelming, even when it's positive."
          },
          nova: {
            expression: 'concerned',
            dialogue: "What if we celebrated together? What if this new level brought joy and friendship?"
          },
          skye: {
            expression: 'happy',
            dialogue: "Let's show them what Level 2 is all about! Sometimes we need to see the joy to feel it!"
          }
        }
      }
    ],
    level: 2,
    ageGroup: 'teen'
  }
];

export const getScenariosByAge = (age: number): StoryScenario[] => {
  const ageGroup = age < 18 ? 'teen' : age < 50 ? 'adult' : 'senior';
  return storyScenarios.filter(scenario => scenario.ageGroup === ageGroup);
};

export const getLevel1Scenarios = (age: number): StoryScenario[] => {
  return getScenariosByAge(age).filter(scenario => scenario.level === 1);
};

export const getLevel2Scenarios = (age: number): StoryScenario[] => {
  return getScenariosByAge(age).filter(scenario => scenario.level === 2);
};