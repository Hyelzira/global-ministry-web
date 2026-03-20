import type { Sermon, Leader, Ministry } from './types';

// 1. All images imported from src/assets folder
import mum from './assets/mum.jpg';
import choir from './assets/worship.jpg';
import dad from './assets/dad.jpg';
import dadandmum from './assets/dadandmum.jpg';
import encounter from './assets/encounter.jpg';
import mummy from './assets/mummy.jpg';
import preach from './assets/preach.jpg';

// Add these or map them to existing assets if you haven't renamed them yet
import youthImg from './assets/dance.jpeg'; // Placeholder
import childrenImg from './assets/dance.jpg'; // Placeholder
import protocolImg from './assets/dad.jpg'; // Placeholder

export const CHURCH_NAME = "Global Flame Ministries";

export const NAV_LINKS = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Sermons', path: '/sermons' },
  { name: 'Events', path: '/events' },
  { name: 'Ministries', path: '/ministries' },
  { name: 'Contact', path: '/contact' },
];

export const LATEST_SERMONS: Sermon[] = [
  {
    id: 's1',
    title: 'Sounds Of the Spirit (Day 4)',
    speaker: 'Apostle Danjuma Musa',
    date: 'Oct 22, 2023',
    series: 'Firm Foundation',
    imageUrl: preach, 
    videoUrl: 'https://www.youtube.com/embed/2Pju0LecOJ0?si=jADu39Z2_noSjE5p',
    description: 'Discover how to stand firm when everything around you seems uncertain. A message of hope and resilience.',
  },
  {
    id: 's2',
    title: 'KAINOS: To make all men see',
    speaker: 'Apostle Danjuma Musa',
    date: 'Oct 15, 2023',
    series: 'Kingdom Mandate',
    imageUrl: mum, 
    videoUrl: 'https://www.youtube.com/embed/2Pju0LecOJ0?si=jADu39Z2_noSjE5p',
    description: 'Understanding the biblical mandate to compel them to see.',
  },
  {
    id: 's3',
    title: 'The Divine Encounter',
    speaker: 'Apostle Danjuma Musa',
    date: 'Oct 08, 2023',
    series: 'Revival',
    imageUrl: encounter, 
    videoUrl: 'https://www.youtube.com/embed/mSr-PgheYvE?si=Oesxm8vuDJhVo4qk',
    description: 'Leave the past behind and step into the new season God has prepared for you.',
  },
];

export const UPCOMING_EVENTS = [
  {
    id: 1,
    title: "Night of Worship",
    category: "Worship Experience",
    date: "November 12, 2026",
    time: "7:00 PM",
    location: "Global Flame Auditorium",
    description: "An evening dedicated to profound praise and communal prayer. Join us as we seek a deeper encounter with the Holy Spirit.",
    imageUrl: preach 
  },
  {
    id: 2,
    title: "Community Outreach",
    category: "Global Impact",
    date: "November 18, 2026",
    time: "9:00 AM",
    location: "Metadodium Center",
    description: "Serving our city through grace and action. We are distributing resources and medical support to families in need.",
    imageUrl: encounter 
  },
  {
    id: 3,
    title: "Youth Fall Retreat",
    category: "Next Gen",
    date: "November 25 — 31, 2026",
    time: "All Weekend",
    location: "Camp Pines",
    description: "A transformative weekend for grades 6-12 focused on spiritual foundation and leadership development.",
    imageUrl: choir 
  }
];

export const LEADERS: Leader[] = [
  {
    id: 'l1',
    name: 'Apostle Danjuma & Faith Musa',
    role: 'Senior Pastors',
    imageUrl: dadandmum, 
    bio: 'Apostle Danjuma and Apostle Faith lead Global Flame Ministries with a heart for revival and transformation.',
  },
  {
    id: 'l2',
    name: 'Apostle Danjuma Musa',
    role: 'General Overseer',
    imageUrl: dad, 
    bio: 'Dedicated to spreading the flame of the gospel across nations.',
  },
];

export const MINISTRIES: Ministry[] = [
  {
    id: 'm1',
    name: 'Daughters of Honour',
    description: 'Empowering women to walk in their divine purpose, virtue, and spiritual strength.',
    imageUrl: mummy, 
    contactEmail: 'women@globalflame.org'
  },
  {
    id: 'm2',
    name: 'Global Flame Choir',
    description: 'Leading the congregation into the presence of God through spirit-filled worship and musical excellence.',
    imageUrl: choir, 
    contactEmail: 'globalflameministry@yahoo.com'
  },
  {
    id: 'm3',
    name: 'Home of Love',
    description: 'Our hospitality and welfare arm dedicated to sharing Christ\'s love through kindness and community support.',
    imageUrl: mum, 
    contactEmail: 'love@globalflame.org'
  },
  {
    id: 'm4',
    name: 'Youth Arm',
    description: 'Raising a generation of burning ones to lead with integrity and purpose in every sphere of life.',
    imageUrl: youthImg, 
    contactEmail: 'youth@globalflame.org'
  },
  {
    id: 'm5',
    name: 'Children Arm',
    description: 'Nurturing young hearts in the way of the Lord through love and a solid biblical foundation.',
    imageUrl: childrenImg, 
    contactEmail: 'kids@globalflame.org'
  },
  {
    id: 'm6',
    name: 'Medi-plex',
    description: 'Ensuring order and excellence in service while providing specialized care for leadership and guests.',
    imageUrl: protocolImg, 
    contactEmail: 'protocol@globalflame.org'
  },
  {
    id: 'm7',
    name: 'Sanctuary',
    description: 'Dedicated to the excellence and beauty of God\'s house, preparing the environment for the move of the Spirit.',
    imageUrl: preach, 
    contactEmail: 'sanctuary@globalflame.org'
  }
];