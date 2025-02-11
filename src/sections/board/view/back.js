// 'use client';

// import { m } from 'framer-motion';
// import { useRouter } from 'next/navigation'; // ✅ ใช้ next/navigation
// import React, { useState, useEffect } from 'react';

// import AddIcon from '@mui/icons-material/Add';
// import FlashOnIcon from '@mui/icons-material/FlashOn';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import {
//   Box,
//   Tab,
//   Grid,
//   Card,
//   Tabs,
//   Button,
//   Typography,
//   IconButton,
//   CardContent,
// } from '@mui/material';

// import { fetchTaskTrackers } from '../../../services/fetchData';

// const BoardView = () => {
//   const [isMounted, setIsMounted] = useState(false);
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [statusMap, setStatusMap] = useState({});
//   const [priorityMap, setPriorityMap] = useState({});
//   const [ownerMap, setOwnerMap] = useState({});
//   const [teamMap, setTeamMap] = useState({});
//   const [taskTrackersData, setTaskTrackersData] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [selectedField, setSelectedField] = useState('');
//   const [selectedValue, setSelectedValue] = useState('');
//   const [selectedRowId, setSelectedRowId] = useState(null);
//   const [openAddModal, setOpenAddModal] = useState(false);

//   const [activeTab, setActiveTab] = useState(4); // Default tab is "Board"
//   const router = useRouter(); // ✅ เปลี่ยนมาใช้ next/navigation

//   const [columns, setColumns] = useState({
//     backlog: { title: 'Backlog', color: '#E0E0E0', projects: [] },
//     planned: { title: 'Planned', color: '#BBDEFB', projects: [] },
//     inprogress: { title: 'In Progress', color: '#90CAF9', projects: [] },
//     completed: { title: 'Completed', color: '#C8E6C9', projects: [] },
//     cancelled: { title: 'Cancelled', color: '#FFCDD2', projects: [] },
//     onhold: { title: 'On Hold', color: '#FFE082', projects: [] },
//   });

//   const [draggingColumn, setDraggingColumn] = useState(null);

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//     const routes = [
//       '/status', // Tab 0: Status
//       '/dashboard/task-tracker', // Tab 1: All Projects
//       '/active-projects', // Tab 2: Active Projects
//       '/timeline', // Tab 3: Timeline
//       '/dashboard/board', // Tab 4: Board (Make sure this is set to 4)
//     ];
//     router.push(routes[newValue] || '/');
//   };

//   useEffect(() => {
//     const loadData = async () => {
//       const taskTrackers = await fetchTaskTrackers();
//       const newColumns = { ...columns };
//       Object.keys(newColumns).forEach((key) => {
//         newColumns[key].projects = [];
//       });

//       taskTrackers.forEach((tracker) => {
//         const status = tracker.status?.statusName || 'Unknown';
//         const columnKey = status.toLowerCase().replace(' ', '') || 'backlog';
//         if (newColumns[columnKey]) {
//           newColumns[columnKey].projects.push(tracker.projectName);
//         }
//       });
//       setColumns(newColumns);
//     };

//     loadData();
//   }, [columns]); // Runs once on component mount

//   const onDragStart = (start) => {
//     setDraggingColumn(start.source.droppableId);
//   };

//   const onDragEnd = (result) => {
//     setDraggingColumn(null);
//     if (!result.destination) return;

//     const sourceColumn = columns[result.source.droppableId];
//     const destColumn = columns[result.destination.droppableId];
//     const sourceProjects = [...sourceColumn.projects];
//     const destProjects = [...destColumn.projects];
//     const [movedProject] = sourceProjects.splice(result.source.index, 1);

//     destProjects.splice(result.destination.index, 0, movedProject);

//     setColumns({
//       ...columns,
//       [result.source.droppableId]: { ...sourceColumn, projects: sourceProjects },
//       [result.destination.droppableId]: { ...destColumn, projects: destProjects },
//     });
//   };

//   return (
//     <Box>
//       <Tabs
//         value={activeTab}
//         onChange={handleTabChange}
//         variant="scrollable"
//         scrollButtons="auto"
//         aria-label="scrollable tabs"
//       >
//         <Tab label="Status" />
//         <Tab label="All Projects" />
//         <Tab label="Active Projects" />
//         <Tab label="Timeline" />
//         <Tab label="Board" /> {/* "Board" tab should be selected by default */}
//         <Box sx={{ ml: 'auto', display: 'flex', gap: 1, paddingRight: 3 }}>
//           <IconButton color="primary" onClick={() => setOpen(true)}>
//             <FilterListIcon />
//           </IconButton>
//           <IconButton color="primary" onClick={() => setLoading(true)}>
//             <RefreshIcon />
//           </IconButton>
//           <IconButton color="primary">
//             <FlashOnIcon />
//           </IconButton>
//           <IconButton color="primary">
//             <MoreHorizIcon />
//           </IconButton>
//           <Button
//             variant="contained"
//             color="primary"
//             startIcon={<AddIcon />}
//             onClick={() => setOpenAddModal(true)}
//           >
//             Add Project
//           </Button>
//         </Box>
//       </Tabs>

//       {/* Main content */}
//       <Box sx={{ padding: 2 }}>
//         <Typography variant="h5" gutterBottom>
//           2025 Task-Tracker Program
//         </Typography>
//         <Typography variant="subtitle1" gutterBottom>
//           Streamline engineering projects.
//         </Typography>

//         <Grid
//           container
//           spacing={3}
//           sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}
//         >
//           {Object.entries(columns).map(([columnId, column]) => (
//             <Grid item key={columnId}>
//               <Card
//                 sx={{
//                   backgroundColor: draggingColumn === columnId ? '#F0F0F0' : column.color,
//                   color: 'black',
//                   transition: 'background-color 0.3s ease',
//                   boxShadow: 3,
//                   marginBottom: 2,
//                   width: 'auto',
//                 }}
//               >
//                 <CardContent>
//                   <Typography variant="h6" sx={{ fontSize: '1rem' }}>
//                     {column.title}
//                   </Typography>
//                   <Box sx={{ minHeight: 100, padding: 1 }}>
//                     {column.projects.map((project) => (
//                       <m.div
//                         key={project}
//                         whileHover={{ scale: 1.05 }}
//                         transition={{ duration: 0.2 }}
//                       >
//                         <Box
//                           sx={{
//                             marginBottom: 2,
//                             backgroundColor: 'white',
//                             color: 'black',
//                             padding: '8px 16px',
//                             borderRadius: '4px',
//                             cursor: 'pointer',
//                           }}
//                         >
//                           <Typography sx={{ fontSize: '0.875rem' }}>{project}</Typography>
//                         </Box>
//                       </m.div>
//                     ))}
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     </Box>
//   );
// };

// export default BoardView;
