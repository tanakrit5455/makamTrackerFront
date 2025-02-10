// 'use client';

// import { m } from 'framer-motion';
// import React, { useState } from 'react';
// // eslint-disable-next-line import/no-extraneous-dependencies
// import { Droppable, Draggable, DragDropContext } from 'react-beautiful-dnd';

// import { Box, Grid, Card, Button, Typography, CardContent } from '@mui/material'; // ✅ ใช้ `m` แทน `motion`

// const initialColumns = {
//   backlog: { title: 'Backlog', color: '#E0E0E0', projects: ['Testing New Agilis ASRS (React)'] },
//   planned: {
//     title: 'Planned',
//     color: '#BBDEFB',
//     projects: ['WCS & Setup Sandbox', 'Project Merge Services'],
//   },
//   inProgress: {
//     title: 'In Progress',
//     color: '#90CAF9',
//     projects: ['New Agilis ASRS (React)', 'PLC Mitsu'],
//   },
//   completed: { title: 'Completed', color: '#C8E6C9', projects: ['Planogram Simulation X'] },
//   cancelled: {
//     title: 'Cancelled',
//     color: '#FFCDD2',
//     projects: ['ASRS Stock Counting', 'PLC SANDBOX'],
//   },
//   onHold: {
//     title: 'On Hold',
//     color: '#FFE082',
//     projects: ['New HMI Nanjing', 'PLC Mitsu Test'],
//   },
// };

// export default function BoardView() {
//   const [columns, setColumns] = useState(initialColumns);
//   const [draggingColumn, setDraggingColumn] = useState(null);

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
//     <Box sx={{ padding: 2 }}>
//       <Typography variant="h5" gutterBottom>
//         2025 Task-Tracker Program
//       </Typography>
//       <Typography variant="subtitle1" gutterBottom>
//         Streamline engineering projects.
//       </Typography>
//       <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
//         <Grid container spacing={2}>
//           {Object.entries(columns).map(([columnId, column]) => (
//             <Grid item xs={12} sm={6} md={4} key={columnId}>
//               <Card
//                 sx={{
//                   backgroundColor: draggingColumn === columnId ? '#F0F0F0' : column.color,
//                   color: 'black',
//                   transition: 'background-color 0.3s ease',
//                 }}
//               >
//                 <CardContent>
//                   <Typography variant="h6">{column.title}</Typography>
//                   <Droppable droppableId={columnId}>
//                     {(dropProvided, dropSnapshot) => (
//                       <Box
//                         ref={dropProvided.innerRef}
//                         {...dropProvided.droppableProps}
//                         sx={{
//                           minHeight: 100,
//                           backgroundColor: dropSnapshot.isDraggingOver ? '#D3D3D3' : 'transparent',
//                           transition: 'background-color 0.3s ease',
//                           padding: 1,
//                         }}
//                       >
//                         {column.projects.map((project, index) => (
//                           <Draggable key={project} draggableId={project} index={index}>
//                             {(dragProvided, snapshot) => (
//                               <m.div
//                                 ref={dragProvided.innerRef}
//                                 {...dragProvided.draggableProps}
//                                 {...dragProvided.dragHandleProps}
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 1.1 }}
//                                 transition={{ duration: 0.2 }}
//                                 style={{
//                                   marginBottom: 8,
//                                   backgroundColor: snapshot.isDragging ? '#B3E5FC' : 'white',
//                                   color: 'black',
//                                   padding: '8px 16px',
//                                   borderRadius: '4px',
//                                   boxShadow: snapshot.isDragging
//                                     ? '0px 5px 10px rgba(0,0,0,0.2)'
//                                     : 'none',
//                                   cursor: 'grab',
//                                 }}
//                               >
//                                 {project}
//                               </m.div>
//                             )}
//                           </Draggable>
//                         ))}
//                         {dropProvided.placeholder}
//                       </Box>
//                     )}
//                   </Droppable>
//                   {/* <Button
//                     fullWidth
//                     variant="outlined"
//                     sx={{ marginTop: 1, borderColor: 'black', color: 'black' }}
//                   >
//                     + New Project
//                   </Button> */}
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </DragDropContext>
//     </Box>
//   );
// }
