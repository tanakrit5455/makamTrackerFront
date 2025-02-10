'use client';

import { m } from 'framer-motion';
import React, { useState, useEffect } from 'react';

import { Box, Grid, Card, Typography, CardContent } from '@mui/material'; // Import motion from framer-motion
import { fetchTaskTrackers } from '../../../services/fetchData';

const BoardView = () => {
  const [columns, setColumns] = useState({
    backlog: { title: 'Backlog', color: '#E0E0E0', projects: [] },
    planned: { title: 'Planned', color: '#BBDEFB', projects: [] },
    inprogress: { title: 'In Progress', color: '#90CAF9', projects: [] },
    completed: { title: 'Completed', color: '#C8E6C9', projects: [] },
    cancelled: { title: 'Cancelled', color: '#FFCDD2', projects: [] },
    onhold: { title: 'On Hold', color: '#FFE082', projects: [] },
  });

  const [draggingColumn, setDraggingColumn] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const taskTrackers = await fetchTaskTrackers();
      const newColumns = { ...columns };
      Object.keys(newColumns).forEach((key) => {
        newColumns[key].projects = [];
      });

      taskTrackers.forEach((tracker) => {
        const status = tracker.status?.statusName || 'Unknown';
        const columnKey = status.toLowerCase().replace(' ', '') || 'backlog';
        if (newColumns[columnKey]) {
          newColumns[columnKey].projects.push(tracker.projectName);
        }
      });
      setColumns(newColumns);
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDragStart = (start) => {
    setDraggingColumn(start.source.droppableId);
  };

  const onDragEnd = (result) => {
    setDraggingColumn(null);
    if (!result.destination) return;

    const sourceColumn = columns[result.source.droppableId];
    const destColumn = columns[result.destination.droppableId];
    const sourceProjects = [...sourceColumn.projects];
    const destProjects = [...destColumn.projects];
    const [movedProject] = sourceProjects.splice(result.source.index, 1);

    destProjects.splice(result.destination.index, 0, movedProject);

    setColumns({
      ...columns,
      [result.source.droppableId]: { ...sourceColumn, projects: sourceProjects },
      [result.destination.droppableId]: { ...destColumn, projects: destProjects },
    });
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        2025 Task-Tracker Program
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Streamline engineering projects.
      </Typography>
      <Grid
        container
        spacing={3}
        sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}
      >
        {Object.entries(columns).map(([columnId, column]) => (
          <Grid item key={columnId}>
            <Card
              sx={{
                backgroundColor: draggingColumn === columnId ? '#F0F0F0' : column.color,
                color: 'black',
                transition: 'background-color 0.3s ease',
                boxShadow: 3, // เพิ่มเงาเพื่อให้การ์ดดูเด่นขึ้น
                marginBottom: 2, // เพิ่มระยะห่างระหว่างการ์ด
                width: 'auto', // ปรับขนาดการ์ดให้เหมาะสม
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                  {column.title}
                </Typography>
                <Box
                  sx={{
                    minHeight: 100,
                    padding: 1,
                  }}
                >
                  {column.projects.map((project, index) => (
                    <m.div
                      key={project}
                      whileHover={{ scale: 1.05 }} // เพิ่มอนิเมชั่นขยายเมื่อเมาส์ชี้
                      transition={{ duration: 0.2 }}
                    >
                      <Box
                        sx={{
                          marginBottom: 2,
                          backgroundColor: 'white',
                          color: 'black',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          boxShadow: 'none',
                          cursor: 'pointer', // เปลี่ยนเคอร์เซอร์ให้เหมือนสามารถคลิกได้
                        }}
                      >
                        <Typography sx={{ fontSize: '0.875rem' }}>{project}</Typography>{' '}
                        {/* ลดขนาดตัวหนังสือ */}
                      </Box>
                    </m.div>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BoardView;
