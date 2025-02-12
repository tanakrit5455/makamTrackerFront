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
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions,
} from '@mui/material';

import AddProject from './add-project';
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
  const [openAddProjectModal, setOpenAddProjectModal] = useState(false);

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

      console.log('taskTrackers:', taskTrackers); // ดูข้อมูลที่ได้จาก taskTrackers

      if (taskTrackers) {
        const formattedRows = taskTrackers.map((item) => {
          console.log('teamData:', item.teamData); // ตรวจสอบข้อมูลของ teamData

          return {
            id: item.trackerId,
            projectName: item.projectName,
            problem: item.problem,
            status: item.status?.statusName || 'N/A',
            owner: item.owner?.ownerName || 'N/A',
            priority: item.priority?.priorityName || 'N/A',
            team: item.team?.teamName || 'N/A',
            teamDataIds: item.teamData?.map((team) => team.teamDataId) || [],
            teamIds: item.teamData?.map((team) => team.teamId) || [], // ตรวจสอบว่า teamId อยู่ในนี้หรือไม่
            work: item.work,
            start_date: item.startDate,
            link: item.link || 'N/A',
            comment: item.comment || '',
          };
        });

        setRows(formattedRows);

        const teamData = taskTrackers.map((item) => item.team?.teamName).filter(Boolean);
        setTeamMap(teamData);
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
    setSelectedRowId(params.id);
    setSelectedValue(params.row.status);
    setOpenStatusDialog(true);
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
      field: 'teamIds',
      headerName: 'Team IDs',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography variant="body2">
            {params.value.length > 0 ? params.value.join(', ') : 'No Team IDs'}
          </Typography>
        </Box>
      ),
    },
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

  // const handleOpenAddModal = () => {
  //   setOpenAddModal(true);
  // };

  // const handleCloseAddModal = () => {
  //   setOpenAddModal(false);
  // };

  const handleSaveNewProject = (newData) => {
    setRows((prevRows) => [...prevRows, { id: `temp-${prevRows.length}`, ...newData }]);
    handleCloseAddModal();
  };

  const handleSaveStatus = async () => {
    try {
      if (!selectedRowId || !selectedValue) {
        return;
      }
      const response = await updateStatus(selectedRowId, selectedValue);

      if (response) {
        setRows((prevRows) =>
          prevRows.map(
            (row) => (row.id === selectedRowId ? { ...row, status: statusMap[selectedValue] } : row) // ใช้ statusMap เพื่อแปลง statusId กลับเป็น status name
          )
        );
        setOpenStatusDialog(false);
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error saving status:', error);
    }
  };

  const handleOpenAddModal = () => {
    setOpenAddProjectModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddProjectModal(false);
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
            onClick={handleOpenAddModal} // ✅ เปิดโมดัลแทนการ redirect
          >
            Add Project
          </Button>
          <AddProject open={openAddProjectModal} onClose={handleCloseAddModal} />
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
            <Select
              value={selectedValue} // ให้ Select ใช้ selectedValue เพื่อแสดงสถานะปัจจุบันที่เลือก
              onChange={(e) => setSelectedValue(e.target.value)} // อัปเดต selectedValue เมื่อเลือกใหม่
            >
              {Object.entries(statusMap).map(([key, statusName]) => (
                <MenuItem key={key} value={key}>
                  {' '}
                  {/* ใช้ statusId เป็นค่า */}
                  {statusName} {/* แสดงชื่อสถานะ */}
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
