import React from 'react';

import { Box, Typography } from '@mui/material';

import { ProjectGantt } from '../components/Timeline';
import TabNavigation from '../components/TabNavigation';

export default function TimelineView() {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Tracker View Page
      </Typography>

      <TabNavigation /> 

      <ProjectGantt />

    </Box>
  );
}
