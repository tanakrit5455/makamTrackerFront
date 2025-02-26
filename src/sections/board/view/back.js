// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-return-assign */
// /* eslint-disable import/no-extraneous-dependencies */

// 'use client';

// import { useState, useEffect } from 'react';
// // eslint-disable-next-line import/no-unresolved
// import { HTML5Backend } from 'react-dnd-html5-backend';
// // eslint-disable-next-line import/no-unresolved
// import { useDrag, useDrop, DndProvider } from 'react-dnd';

// import AddIcon from '@mui/icons-material/Add';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import {
//   Box,
//   Tab,
//   Card,
//   Grid,
//   Chip,
//   Tabs,
//   Button,
//   Typography,
//   IconButton,
//   CardContent,
// } from '@mui/material';

// import { fetchTaskTrackers, updateStatuschangeColumn } from '../../../actions/fetchData';

// const ITEM_TYPE = 'CARD';

// const Column = ({ column, moveCard, children }) => {
//   const [, drop] = useDrop({
//     accept: ITEM_TYPE,
//     drop: (item) => {
//       if (!column.id) {
//         console.error('Error: Column ID is undefined', column);
//         return;
//       }
//       moveCard(item, column.id);
//     },
//   });

//   return (
//     <Grid item xs={12} sm={6} md={2} ref={drop}>
//       <Card variant="outlined" sx={{ minHeight: '300px', background: '#f5f5f5' }}>
//         <CardContent>
//           <Chip label={column.title} color={column.color} sx={{ mb: 1 }} />
//           {children}
//         </CardContent>
//       </Card>
//     </Grid>
//   );
// };

// const TaskCard = ({ project }) => {
//   const [{ isDragging }, drag] = useDrag({
//     type: ITEM_TYPE,
//     item: project,
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   return (
//     <Card ref={drag} sx={{ mb: 1, p: 1, background: isDragging ? '#ddd' : '#fff', cursor: 'grab' }}>
//       <CardContent>
//         <Typography variant="body2">{project.name}</Typography>
//       </CardContent>
//     </Card>
//   );
// };

// const BoardView = () => {
//   const [activeTab, setActiveTab] = useState(4);
//   const [columns, setColumns] = useState({
//     backlog: { id: 'backlog', title: 'Backlog', color: 'default', projects: [] },
//     planned: { id: 'planned', title: 'Planned', color: 'info', projects: [] },
//     inprogress: { id: 'inprogress', title: 'In Progress', color: 'primary', projects: [] },
//     completed: { id: 'completed', title: 'Completed', color: 'success', projects: [] },
//     cancelled: { id: 'cancelled', title: 'Cancelled', color: 'error', projects: [] },
//     onhold: { id: 'onhold', title: 'On Hold', color: 'warning', projects: [] },
//   });
//   useEffect(() => {
//     const loadData = async () => {
//       const taskTrackers = await fetchTaskTrackers();
//       const newColumns = { ...columns };
//       Object.keys(newColumns).forEach((key) => (newColumns[key].projects = []));

//       taskTrackers.forEach((tracker) => {
//         const status = tracker.status?.statusName?.toLowerCase().replace(/\s+/g, '') || 'backlog';
//         if (newColumns[status]) {
//           newColumns[status].projects.push({ id: tracker.trackerId, name: tracker.projectName });
//         }
//       });

//       setColumns(newColumns);
//     };
//     loadData();
//   }, []);

//   const moveCard = async (project, targetColumn) => {
//     console.log(`🔄 Moving project:, project`);
//     console.log(`📌 Target column:, targetColumn`);

//     if (!targetColumn) {
//       console.error('❌ Error: targetColumn is undefined. Cannot move project:', project);
//       return;
//     }

//     if (!project?.id) {
//       console.error(`'❌ Error: Task ID is undefined', project`);
//       return;
//     }

//     if (!columns[targetColumn]) {
//       console.error(`❌ Error: targetColumn '${targetColumn}' does not exist in columns, columns`);
//       return;
//     }

//     // ค้นหา column ต้นทาง
//     const sourceColumn = Object.keys(columns).find((key) =>
//       columns[key].projects.some((p) => p.id === project.id)
//     );

//     if (!sourceColumn || sourceColumn === targetColumn) return;

//     // อัปเดต state
//     const updatedColumns = { ...columns };
//     updatedColumns[sourceColumn].projects = updatedColumns[sourceColumn].projects.filter(
//       (p) => p.id !== project.id
//     );
//     updatedColumns[targetColumn].projects.push(project);
//     setColumns(updatedColumns);

//     try {
//       console.log(`📝 Sending API request:, { id: project.id, status: targetColumn }`);
//       const response = await updateStatuschangeColumn(project.id, targetColumn);
//       console.log(`✅ Updated status for ${project.name} to ${targetColumn}`, response);
//     } catch (error) {
//       console.error('❌ Failed to update status:', error);
//     }
//   };

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <Box sx={{ p: 3 }}>
//         <Tabs
//           value={activeTab}
//           onChange={(e, newValue) => setActiveTab(newValue)}
//           variant="scrollable"
//           scrollButtons="auto"
//           sx={{ flexGrow: 1 }} // This allows Tabs to take available space
//         >
//           <Tab label="Status" />
//           <Tab label="All Projects" />
//           <Tab label="Active Projects" />
//           <Tab label="Timeline" />
//           <Tab label="Board" />
//           <Box sx={{ ml: 'auto', display: 'flex', gap: 1, paddingRight: 3 }}>
//             <IconButton color="primary">
//               <FilterListIcon />
//             </IconButton>
//             <IconButton color="primary">
//               <RefreshIcon />
//             </IconButton>
//             <Button variant="contained" color="primary" startIcon={<AddIcon />}>
//               Add Project
//             </Button>
//           </Box>
//         </Tabs>

//         <Typography variant="h4" gutterBottom>
//           🚀 2025 Task-Tracker Program
//         </Typography>
//         <Typography variant="subtitle1" gutterBottom>
//           Streamline engineering projects.
//         </Typography>

//         <Grid container spacing={2}>
//           {Object.entries(columns).map(([columnId, column]) => (
//             <Column key={columnId} column={column} moveCard={moveCard}>
//               {column.projects.length > 0 ? (
//                 column.projects.map((project) => <TaskCard key={project.id} project={project} />)
//               ) : (
//                 <Typography variant="body2" color="textSecondary">
//                   + New project
//                 </Typography>
//               )}
//             </Column>
//           ))}
//         </Grid>
//       </Box>
//     </DndProvider>
//   );
// };

// export default BoardView;
