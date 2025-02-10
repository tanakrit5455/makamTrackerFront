import React from 'react';

// Component ที่รองรับการใช้งาน React Beautiful DnD
const DroppableComponent = ({ droppableId = 'defaultId', children }) => (
  <div id={droppableId}>{children}</div>
);

export default DroppableComponent;
