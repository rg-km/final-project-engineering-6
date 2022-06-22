import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import PollIcon from '@mui/icons-material/Poll';
import EventIcon from '@mui/icons-material/Event';

export const MenuSidebar = [
  { title: 'Home', icon: <HomeIcon />, link: '/forum' },

  {
    title: 'Survey',
    icon: <PollIcon />,
    link: '/survey',
  },

  {
    title: 'Event',
    icon: <EventIcon />,
    link: '/event',
  },
];
