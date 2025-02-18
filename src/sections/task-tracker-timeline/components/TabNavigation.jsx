'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { Tab, Box, Tabs, IconButton } from '@mui/material';
import {
  Refresh as RefreshIcon,
  FlashOn as FlashOnIcon,
  MoreHoriz as MoreHorizIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';

const TabNavigation = ({ activeTab = 3, setActiveTab, setOpenAddModal }) => {
  const router = useRouter();

  const handleTabChange = (event, newValue) => {
    if (setActiveTab) {
      setActiveTab(newValue);
    }

    switch (newValue) {
      // case 0:
      //   router.push('/status');
      //   break;
      case 1:
        router.push('/dashboard/task-tracker');
        break;
      // case 2:
      //   router.push('/active-projects');
      //   break;
      case 3:
        router.push('/dashboard/task-tracker-timeline/');
        break;
      case 4:
        router.push('/dashboard/board');
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tabs
          value={activeTab} // Make sure this value reflects the "Timeline" tab (activeTab should be 3 for Timeline)
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable tabs"
          indicatorColor="primary"
          sx={{ flexGrow: 1 }} // Ensure tabs stretch to fill the container
        >
          <Tab label="Status" />
          <Tab label="All Projects" />
          <Tab label="Active Projects" />
          <Tab label="Timeline" />
          <Tab label="Board" />
        </Tabs>

        {/* Icon Buttons placed after Tabs */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="default" sx={{ padding: 1 }}>
            <FilterListIcon />
          </IconButton>
          <IconButton color="default" sx={{ padding: 1 }} onClick={() => window.location.reload()}>
            <RefreshIcon />
          </IconButton>
          <IconButton color="default" sx={{ padding: 1 }}>
            <FlashOnIcon />
          </IconButton>
          <IconButton color="default" sx={{ padding: 1 }}>
            <MoreHorizIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Show "Add Project" button only when Timeline tab is selected */}
      {activeTab === 3 && (
        <Box sx={{ paddingTop: 2 }}>
          {/* <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddModal && setOpenAddModal(true)}
            sx={{ marginTop: 2 }}
          >
            Add Project
          </Button> */}
        </Box>
      )}
    </Box>
  );
};

export default TabNavigation;
