'use client';

import { m } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// eslint-disable-next-line import/no-extraneous-dependencies
import { HTML5Backend } from 'react-dnd-html5-backend';
// React DND
// eslint-disable-next-line import/no-extraneous-dependencies
import { useDrag, useDrop, DndProvider } from 'react-dnd';

// Material UI
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Box,
  Tab,
  Card,
  Grid,
  Chip,
  Tabs,
  Button,
  Typography,
  IconButton,
  CardContent,
} from '@mui/material';

// API Calls
import { fetchTaskTrackers, updateStatuschangeColumn } from '../../../actions/fetchData';

const ITEM_TYPE = 'CARD';

// 🟢 Column Component (Drop Zone)
const Column = ({ column, moveCard, children }) => {
  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (item) => moveCard(item, column.id),
  });

  return (
    <Grid item xs={12} sm={6} md={2} ref={drop}>
      <Card variant="outlined" sx={{ minHeight: '300px', background: '#f5f5f5' }}>
        <CardContent>
          <Chip label={column.title} color={column.color} sx={{ mb: 1 }} />
          {children}
        </CardContent>
      </Card>
    </Grid>
  );
};

// 🟢 Task Card Component (Draggable)
const TaskCard = ({ project }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: project,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <m.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
      <Card
        ref={drag}
        sx={{ mb: 1, p: 1, background: isDragging ? '#ddd' : '#fff', cursor: 'grab' }}
      >
        <CardContent>
          <Typography variant="body2">{project.name}</Typography>
        </CardContent>
      </Card>
    </m.div>
  );
};

// 🟢 BoardView Component (Main)
const BoardView = () => {
  const [activeTab, setActiveTab] = useState(2);
  const [columns, setColumns] = useState({
    backlog: { id: 'backlog', title: 'Backlog', color: 'default', projects: [] },
    planned: { id: 'planned', title: 'Planned', color: 'info', projects: [] },
    inprogress: { id: 'inprogress', title: 'In Progress', color: 'primary', projects: [] },
    completed: { id: 'completed', title: 'Completed', color: 'success', projects: [] },
    cancelled: { id: 'cancelled', title: 'Cancelled', color: 'error', projects: [] },
    onhold: { id: 'onhold', title: 'On Hold', color: 'warning', projects: [] },
  });

  const router = useRouter();

  // 🔄 Fetch Data on Mount
  useEffect(() => {
    const loadData = async () => {
      const taskTrackers = await fetchTaskTrackers();
      const newColumns = { ...columns };
      // eslint-disable-next-line no-return-assign
      Object.keys(newColumns).forEach((key) => (newColumns[key].projects = []));

      taskTrackers.forEach((tracker) => {
        const status = tracker.status?.statusName?.toLowerCase().replace(/\s+/g, '') || 'backlog';
        if (newColumns[status]) {
          newColumns[status].projects.push({ id: tracker.trackerId, name: tracker.projectName });
        }
      });

      setColumns(newColumns);
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔄 Handle Moving Tasks
  const moveCard = async (project, targetColumn) => {
    if (!targetColumn || !project?.id || !columns[targetColumn]) return;

    const sourceColumn = Object.keys(columns).find((key) =>
      columns[key].projects.some((p) => p.id === project.id)
    );

    if (!sourceColumn || sourceColumn === targetColumn) return;

    const updatedColumns = { ...columns };
    updatedColumns[sourceColumn].projects = updatedColumns[sourceColumn].projects.filter(
      (p) => p.id !== project.id
    );
    updatedColumns[targetColumn].projects.push(project);
    setColumns(updatedColumns);

    try {
      await updateStatuschangeColumn(project.id, targetColumn);
    } catch (error) {
      console.error('❌ Failed to update status:', error);
    }
  };

  // 🏷️ Handle Tab Changes
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    switch (newValue) {
      case 0:
        router.push('/dashboard/task-tracker');
        break;
      case 1:
        router.push('/dashboard/timeline');
        break;
      case 2:
        router.push('/dashboard/board');
        break;
      default:
        break;
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ p: 3 }}>
        {/* 🔹 Tabs Menu */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Projects" />
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

        {/* 🔹 Header */}
        <Typography variant="h4" gutterBottom>
          🚀 2025 Task-Tracker Program
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Streamline engineering projects.
        </Typography>

        {/* 🔹 Kanban Board */}
        <Grid container spacing={2}>
          {Object.entries(columns).map(([columnId, column]) => (
            <Column key={columnId} column={column} moveCard={moveCard}>
              {column.projects.length > 0 ? (
                column.projects.map((project) => <TaskCard key={project.id} project={project} />)
              ) : (
                <Typography variant="body2" color="textSecondary">
                  + New project
                </Typography>
              )}
            </Column>
          ))}
        </Grid>
      </Box>
    </DndProvider>
  );
};

export default BoardView;
