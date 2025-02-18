/* eslint-disable no-restricted-globals */
/* eslint-disable radix */

'use client';

import 'gantt-task-react/dist/index.css';
import { CONFIG } from 'src/config-global';
import { Gantt } from 'gantt-task-react';
import React, { useRef, useState, useEffect } from 'react';

import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Select, MenuItem, Typography, IconButton, FormControl } from '@mui/material';
const baseURL = CONFIG.site.serverUrl;
const months = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

export const ProjectGantt = () => {
  const ganttRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('September');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${baseURL}/task-trackers/getall-trackers`);
        const data = await response.json();

        const mappedTasks = data
          .map((task) => {
            const startDate = task.startDate ? new Date(task.startDate) : null;
            const endDate = task.endDate ? new Date(task.endDate) : null;

            if (!startDate || isNaN(startDate.getTime()) || !endDate || isNaN(endDate.getTime())) {
              console.warn('Invalid date for task:', task);
              return null;
            }

            // แปลชื่อโปรเจกต์เป็นภาษาไทย
            const projectName =
              task.projectName === 'Sample Project' ? 'โครงการตัวอย่าง' : task.projectName;

            return {
              id: task.trackerId.toString(),
              name: projectName,
              start: startDate,
              end: endDate,
              type: 'task',
              progress: parseInt(task.work) || 0,
            };
          })
          .filter(Boolean);

        setTasks(mappedTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const handleMouseDown = (e) => {
    if (!ganttRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - ganttRef.current.offsetLeft);
    setScrollLeft(ganttRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !ganttRef.current) return;
    e.preventDefault();
    const x = e.pageX - ganttRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    ganttRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  return (
    <Box
      sx={{
        maxWidth: '100%',
        marginTop: '40px',
        padding: '30px',
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ fontWeight: 600, color: '#374151', marginBottom: '30px' }}
      >
        2025 Operation Program
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <FormControl variant="outlined" sx={{ minWidth: 120 }}>
          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
            sx={{
              borderRadius: 3,
              backgroundColor: '#ffffff',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d1d5db' },
            }}
          >
            {months?.map((month) => (
              <MenuItem key={month} value={month}>
                {month}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: '15px' }}>
          <IconButton color="primary" onClick={() => window.location.reload()}>
            <RefreshIcon sx={{ color: '#6b7280' }} />
          </IconButton>
          <Button
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderRadius: 3,
              padding: '8px 20px',
              color: '#374151',
              borderColor: '#d1d5db',
            }}
          >
            Export Data
          </Button>
        </Box>
      </Box>

      <Box
        ref={ganttRef}
        role="region"
        aria-label="Gantt chart timeline"
        sx={{
          width: '100%',
          height: '100%',
          minHeight: '1800px',
          overflowX: 'auto',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          backgroundColor: '#ffffff',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {tasks.length > 0 ? (
          <Gantt tasks={tasks} />
        ) : (
          <Typography align="center" sx={{ padding: '20px', color: '#6b7280' }}>
            Loading tasks...
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ProjectGantt;
