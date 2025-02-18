'use client';

import { m } from 'framer-motion';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Box,
  Tab,
  Grid,
  Card,
  Tabs,
  Chip,
  Button,
  Typography,
  IconButton,
  CardContent,
} from '@mui/material';

import { fetchTaskTrackers } from '../../../actions/fetchData';

const BoardView = () => {
  const [activeTab, setActiveTab] = useState(4);
  const [columns, setColumns] = useState({
    backlog: { title: 'Backlog', color: 'default', projects: [] },
    planned: { title: 'Planned', color: 'info', projects: [] },
    inprogress: { title: 'In Progress', color: 'primary', projects: [] },
    completed: { title: 'Completed', color: 'success', projects: [] },
    cancelled: { title: 'Cancelled', color: 'error', projects: [] },
    onhold: { title: 'On Hold', color: 'warning', projects: [] },
  });

  const router = useRouter();

  // โหลดข้อมูลจาก API
  useEffect(() => {
    const loadData = async () => {
      const taskTrackers = await fetchTaskTrackers();
      const newColumns = { ...columns };

      // รีเซ็ต projects
      Object.keys(newColumns).forEach((key) => {
        newColumns[key].projects = [];
      });

      // จัดกลุ่ม project ตามสถานะ
      taskTrackers.forEach((tracker) => {
        const status = tracker.status?.statusName?.toLowerCase().replace(' ', '') || 'backlog';
        if (newColumns[status]) {
          newColumns[status].projects.push(tracker.projectName);
        }
      });

      setColumns(newColumns);
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // โหลดครั้งเดียวตอน mount

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    switch (newValue) {
      // case 0:
      //   router.push('/status');
      //   break;

      case 1:
        router.push('/dashboard/task-tracker');
        break;
      case 3:
        router.push('/dashboard/timeline');
        break;
      case 4:
        router.push('/dashboard/board');
        break;
      default:
        break;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable tabs"
      >
        <Tab label="Status" />
        <Tab label="All Projects" />
        <Tab label="Active Projects" />
        <Tab label="Timeline" />
        <Tab label="Board" />
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1, paddingRight: 3 }}>
          <IconButton color="primary">
            <FilterListIcon />
          </IconButton>
          <IconButton color="primary">
            <RefreshIcon />
          </IconButton>
          <Button variant="contained" color="primary" startIcon={<AddIcon />}>
            Add Project
          </Button>
        </Box>
      </Tabs>

      <Typography variant="h4" gutterBottom>
        🚀 2025 Task-Tracker Program
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Streamline engineering projects.
      </Typography>

      <Grid container spacing={2}>
        {Object.entries(columns).map(([columnId, column]) => (
          <Grid item xs={12} sm={6} md={2} key={columnId}>
            <Card variant="outlined">
              <CardContent>
                <Chip label={column.title} color={column.color} sx={{ mb: 1 }} />
                {column.projects.length > 0 ? (
                  column.projects.map((project) => (
                    <m.div
                      key={project}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card sx={{ mb: 1, p: 1, background: '#f5f5f5' }}>
                        <Typography variant="body2">{project}</Typography>
                      </Card>
                    </m.div>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    + New project
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BoardView;
