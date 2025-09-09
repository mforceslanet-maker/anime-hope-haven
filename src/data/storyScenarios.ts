import { StoryScenario } from '../types/story';

export const storyScenarios: StoryScenario[] = [
  // Teen Military Students
  {
    id: 'teen-stress-1',
    title: 'Exam Pressure',
    description: 'Dealing with academic stress in military academy',
    situation: 'You have three major exams tomorrow and feel overwhelmed. Your friends are going out tonight.',
    choices: [
      {
        id: 'study',
        text: 'Stay in and study, ask friends for understanding',
        isCorrect: true,
        consequence: 'You feel prepared and confident. Your friends respect your dedication, and you ace your exams the next day!'
      },
      {
        id: 'party',
        text: 'Go out with friends to blow off steam',
        isCorrect: false,
        consequence: 'You have fun but feel unprepared for exams. Your stress increases, and you struggle during the tests. Your grades suffer, affecting your military academy standing.'
      }
    ],
    ageGroup: 'teen',
    category: 'military-student'
  },
  {
    id: 'teen-peer-pressure',
    title: 'Standing Up',
    description: 'Handling peer pressure in military training',
    situation: 'Some cadets are bullying a fellow student. They want you to join in or stay silent.',
    choices: [
      {
        id: 'stand-up',
        text: 'Stand up for the student being bullied',
        isCorrect: true,
        consequence: 'You show true leadership and courage. The bullying stops, you gain respect from instructors, and make a loyal friend.'
      },
      {
        id: 'ignore',
        text: 'Stay silent to avoid trouble',
        isCorrect: false,
        consequence: 'The bullying continues and escalates. You feel guilty, and later realize you missed a chance to show real military values of protecting others.'
      }
    ],
    ageGroup: 'teen',
    category: 'military-student'
  },

  // Adult Military Personnel
  {
    id: 'adult-deployment-1',
    title: 'Family vs Duty',
    description: 'Balancing family needs with military obligations',
    situation: 'You\'re scheduled for deployment, but your spouse is struggling with depression and needs support.',
    choices: [
      {
        id: 'communicate',
        text: 'Talk openly with your spouse and commanding officer about support options',
        isCorrect: true,
        consequence: 'You find family support services and counseling resources. Your honest communication strengthens your marriage and shows your CO you\'re responsible.'
      },
      {
        id: 'ignore',
        text: 'Don\'t mention it and hope things work out',
        isCorrect: false,
        consequence: 'Your spouse\'s condition worsens while you\'re deployed. The lack of support leads to serious marital problems and affects your focus on missions.'
      }
    ],
    ageGroup: 'adult',
    category: 'military-personnel'
  },
  {
    id: 'adult-ptsd',
    title: 'Seeking Help',
    description: 'Dealing with post-traumatic stress symptoms',
    situation: 'You\'ve been having nightmares and flashbacks after your last deployment. You\'re considering seeking help.',
    choices: [
      {
        id: 'seek-help',
        text: 'Reach out to military mental health services',
        isCorrect: true,
        consequence: 'You begin therapy and learn coping strategies. Your symptoms improve, and you become an advocate for mental health in your unit.'
      },
      {
        id: 'tough-it-out',
        text: 'Try to handle it alone to appear strong',
        isCorrect: false,
        consequence: 'Your symptoms worsen, affecting your work performance and relationships. You eventually need emergency intervention, which could have been prevented.'
      }
    ],
    ageGroup: 'adult',
    category: 'military-personnel'
  },

  // Senior Military Personnel
  {
    id: 'senior-leadership',
    title: 'Mentoring Decision',
    description: 'Using experience to guide younger personnel',
    situation: 'A young soldier in your unit is struggling with confidence. Other leaders suggest transferring them out.',
    choices: [
      {
        id: 'mentor',
        text: 'Take time to mentor and support the young soldier',
        isCorrect: true,
        consequence: 'Your mentorship transforms the soldier into a confident leader. They become one of the unit\'s best performers and credit you with their success.'
      },
      {
        id: 'transfer',
        text: 'Agree with the transfer to avoid problems',
        isCorrect: false,
        consequence: 'The soldier\'s potential is wasted. They struggle in their new unit, and you later learn they could have excelled with proper guidance.'
      }
    ],
    ageGroup: 'senior',
    category: 'military-personnel'
  }
];