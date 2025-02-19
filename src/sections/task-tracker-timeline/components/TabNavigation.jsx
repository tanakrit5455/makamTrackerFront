'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { Tab, Box, Tabs, IconButton } from '@mui/material';
import {
  Refresh as RefreshIcon,
  FlashOn as FlashOnIcon,
  MoreHoriz as MoreHorizIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';

const TabNavigation = ({ setOpenAddModal }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(1);

  // ตั้งค่า activeTab ให้ตรงกับ URL ปัจจุบัน
  useEffect(() => {
    if (pathname === '/dashboard/task-tracker') setActiveTab(0);
    else if (pathname === '/dashboard/timeline') setActiveTab(1);
    else if (pathname === '/dashboard/board') setActiveTab(2);
  }, [pathname]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    switch (newValue) {
      case 0:
        router.push('/dashboard/task-tracker'); // All Projects
        break;
      case 1:
        router.push('/dashboard/timeline'); // Timeline
        break;
      case 2:
        router.push('/dashboard/board'); // Board
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable tabs"
        >
          <Tab label="All Projects" />
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
      {activeTab === 1 && (
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
