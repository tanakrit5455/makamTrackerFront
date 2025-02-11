'use client';

import { useRouter } from 'next/navigation'; // ✅ ใช้ next/navigation
import React, { useState, useEffect } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Box,
  Tab,
  Chip,
  Tabs,
  Button,
  Dialog,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Typography,
  InputLabel,
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions,
} from '@mui/material';

import AddProject from './AddProject';
import {
  updateWork,
  fetchAllData,
  updateStatus,
  updateProblem,
  updateComment,
  fetchTaskTrackers,
} from '../../../services/fetchData';

export default function DataTable() {
  const [isMounted, setIsMounted] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMap, setStatusMap] = useState({});
  const [priorityMap, setPriorityMap] = useState({});
  const [ownerMap, setOwnerMap] = useState({});
  const [teamMap, setTeamMap] = useState({});
  const [taskTrackersData, setTaskTrackersData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedField, setSelectedField] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(1); // Default tab is "All Projects"
  const router = useRouter(); // ✅ เปลี่ยนมาใช้ next/navigation

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchAllData();
      if (data) {
        setStatusMap(data.statuses);
      }
      const taskTrackers = await fetchTaskTrackers();
      if (taskTrackers) {
        const formattedRows = taskTrackers.map((item) => ({
          id: item.trackerId,
          projectName: item.projectName,
          problem: item.problem,
          status: item.status?.statusName || 'N/A',
          owner: item.owner?.ownerName || 'N/A',
          priority: item.priority?.priorityName || 'N/A',
          team: item.team?.teamName || 'N/A',
          work: item.work,
          start_date: item.startDate,
          link: item.link || 'N/A',
          comment: item.comment || '',
        }));
        setRows(formattedRows);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    switch (newValue) {
      case 0:
        router.push('/status');
        break;
      case 1:
        router.push('/all-projects');
        break;
      case 2:
        router.push('/active-projects');
        break;
      case 3:
        router.push('/timeline');
        break;
      case 4:
        router.push('/dashboard/board'); // ✅ อัปเดตเส้นทางให้ไปที่ /dashboard/board
        break;
      default:
        break;
    }
  };

  const handleStatusClick = (params) => {
    setSelectedRowId(params.id); // ตั้งค่า selectedRowId
    setSelectedValue(params.value); // ตั้งค่า selectedValue (สถานะปัจจุบัน)
    setOpenStatusDialog(true); // เปิด Dialog
  };

  const handleCellClick = (params, field) => {
    setSelectedField(field);
    setSelectedValue(params.value);
    setSelectedRowId(params.id);
    setOpen(true); // Open the dialog
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedField('');
    setSelectedValue('');
    setSelectedRowId(null);
  };

  const handleSave = async () => {
    if (selectedRowId && selectedValue) {
      try {
        let response;

        if (selectedField === 'status') {
          response = await updateStatus(selectedRowId, selectedValue);
        } else if (selectedField === 'comment') {
          response = await updateComment(selectedRowId, selectedValue);
        } else if (selectedField === 'work') {
          response = await updateWork(selectedRowId, selectedValue);
        } else if (selectedField === 'problem') {
          response = await updateProblem(selectedRowId, selectedValue);
        }

        if (response) {
          setRows((prevRows) =>
            prevRows.map((row) =>
              row.id === selectedRowId ? { ...row, [selectedField]: selectedValue } : row
            )
          );
          setOpen(false); // Close the dialog after saving
        } else {
          console.error(`Failed to update ${selectedField}`);
        }
      } catch (error) {
        console.error(`Error updating ${selectedField}:`, error);
      }
    }
  };

  if (!isMounted) {
    return null; // Or a loading state if necessary
  }
  const columns = [
    { field: 'projectName', headerName: 'Project Name', flex: 1 },
    {
      field: 'problem',
      headerName: 'Problem',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography
            variant="body2"
            onClick={() => handleCellClick(params, 'problem')}
            sx={{
              cursor: 'pointer',
            }}
          >
            {params.value.length > 20 ? `${params.value.substring(0, 20)}...` : params.value}
          </Typography>
        </Box>
      ),
    },
    // {
    //   field: 'status',
    //   headerName: 'Status',
    //   flex: 1,
    //   renderCell: (params) => (
    //     <Chip
    //       label={params.value}
    //       color={
    //         params.value === 'In progress'
    //           ? 'primary'
    //           : params.value === 'On Hold'
    //             ? 'warning'
    //             : params.value === 'Completed'
    //               ? 'success'
    //               : params.value === 'Cancelled'
    //                 ? 'error'
    //                 : 'default'
    //       }
    //       onClick={() => handleCellClick(params, 'status')} // Make it clickable
    //     />
    //   ),
    // },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'In progress'
              ? 'primary'
              : params.value === 'On Hold'
                ? 'warning'
                : params.value === 'Completed'
                  ? 'success'
                  : params.value === 'Cancelled'
                    ? 'error'
                    : 'default'
          }
          onClick={() => handleStatusClick(params)} // เปิด Dialog สำหรับสถานะ
          sx={{ cursor: 'pointer' }}
        />
      ),
    },
    { field: 'owner', headerName: 'Owner', flex: 1 },
    {
      field: 'priority',
      headerName: 'Priority',
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'High' ? 'error' : params.value === 'Medium' ? 'warning' : 'primary'
          }
        />
      ),
    },
    { field: 'team', headerName: 'Team', flex: 1 },
    {
      field: 'work',
      headerName: '% Work',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography
            variant="body2"
            onClick={() => handleCellClick(params, 'work')}
            sx={{
              cursor: 'pointer',
            }}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'start_date',
      headerName: 'Date',
      flex: 1,
      renderCell: (params) => (params.value ? params.value : 'N/A'),
    },
    {
      field: 'link',
      headerName: 'Link',
      flex: 0.5,
      renderCell: (params) =>
        params.value && params.value !== 'N/A' ? (
          <a href={params.value} target="_blank" rel="noopener noreferrer">
            {params.value}
          </a>
        ) : (
          'N/A'
        ),
    },
    {
      field: 'comment',
      headerName: 'Comment',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography variant="body2" onClick={() => handleCellClick(params, 'comment')}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
  ];

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const handleSaveNewProject = (newData) => {
    setRows((prevRows) => [...prevRows, { id: `temp-${prevRows.length}`, ...newData }]);
    handleCloseAddModal();
  };
  console.log('statusMap:', statusMap);

  const handleSaveStatus = async () => {
    try {
      // ตรวจสอบก่อนว่ามี selectedRowId และ selectedValue
      if (!selectedRowId || !selectedValue) {
        console.error('Selected Row or Status is missing');
        return;
      }

      // Log ค่า selectedRowId และ selectedValue ที่จะถูกบันทึก
      console.log(`Saving status for rowId: ${selectedRowId}, with status: ${selectedValue}`);

      // เรียกฟังก์ชัน updateStatus เพื่ออัปเดตสถานะ
      const response = await updateStatus(selectedRowId, selectedValue);

      // ตรวจสอบผลการอัปเดต
      if (response) {
        console.log('Status updated successfully:', response);

        // อัปเดตสถานะในแถวที่เลือก
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedRowId ? { ...row, status: selectedValue } : row
          )
        );
        console.log('Updated rows:', rows); // Log ตารางที่ถูกอัปเดต

        setOpenStatusDialog(false); // ปิด Dialog หลังบันทึก
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error saving status:', error);
    }
  };

  return (
    <Box>
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

        {/* ใช้ Box เพื่อดันปุ่มไปทางขวา */}
        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <IconButton color="default">
            <FilterListIcon />
          </IconButton>
          <IconButton color="default" onClick={() => window.location.reload()}>
            <RefreshIcon />
          </IconButton>
          <IconButton color="default">
            <FlashOnIcon />
          </IconButton>
          <IconButton color="default">
            <MoreHorizIcon />
          </IconButton>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddModal(true)}
          >
            Add Project
          </Button>
        </Box>
      </Tabs>
      <Box sx={{ height: 800, width: '100%', marginTop: 2 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          pagination
          loading={loading}
        />
      </Box>
      {/* Add Project Modal */}
      <Dialog open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <DialogTitle>Add New Project</DialogTitle>
        <DialogContent>
          <AddProject />
        </DialogContent>
      </Dialog>
      {/* แก้สถานะ Modal */}
      <Dialog
        open={openStatusDialog}
        onClose={() => setOpenStatusDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Status</DialogTitle>
        <DialogContent sx={{ padding: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
              {Object.entries(statusMap).map(([key, statusName]) => (
                <MenuItem key={key} value={statusName}>
                  {statusName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatusDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveStatus}>Save</Button>
        </DialogActions>
      </Dialog>
      ;{/* Edit Modal */}
      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Edit {selectedField}</DialogTitle>
        <DialogContent sx={{ padding: 2 }}>
          <TextField
            value={selectedValue}
            onChange={(e) => setSelectedValue(e.target.value)}
            fullWidth
            multiline
            rows={4}
            sx={{
              '& .MuiInputLabel-root': {
                whiteSpace: 'nowrap',
              },
              '& .MuiInputBase-root': {
                paddingTop: '0.75rem',
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
