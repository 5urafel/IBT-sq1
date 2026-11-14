import { CampusEvent } from './events.types.js';

export const seedEvents: CampusEvent[] = [
  {
    id: 1,
    title: 'Technology Innovation Day',
    description: 'Explore new technologies and student innovations.',
    location: 'Main Campus Hall',
    date: '2026-12-10',
    organizer: 'Computer Science Department',
    sessions: [
      {
        id: 1,
        title: 'Introduction to Artificial Intelligence',
        description: 'Understanding AI and its applications.',
        speaker: 'Dr. Abebe',
        startTime: '09:00',
        endTime: '10:00',
      },
      {
        id: 2,
        title: 'Building Modern Web Applications',
        description: 'Introduction to modern web development.',
        speaker: 'Mr. Dawit',
        startTime: '10:30',
        endTime: '12:00',
      },
    ],
  },
  {
    id: 2,
    title: 'Career Development Workshop',
    description: 'Prepare students for professional careers.',
    location: 'Conference Room A',
    date: '2026-12-15',
    organizer: 'Student Affairs Office',
    sessions: [
      {
        id: 1,
        title: 'Writing a Professional CV',
        description: 'Learn how to create an effective CV.',
        speaker: 'Ms. Hana',
        startTime: '09:00',
        endTime: '10:00',
      },
      {
        id: 2,
        title: 'Interview Preparation',
        description: 'Tips for succeeding in job interviews.',
        speaker: 'Mr. Samuel',
        startTime: '10:30',
        endTime: '11:30',
      },
    ],
  },
];
