import React from 'react';

import { Box, Typography } from '@mui/material';

import DataTable from '../components/DataTable';

export default function TrackerView() {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Tracker View Page
      </Typography>

      <DataTable />
    </Box>
  );
}
