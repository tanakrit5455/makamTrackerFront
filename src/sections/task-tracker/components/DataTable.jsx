'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import LinkIcon from '@mui/icons-material/Link';
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
  CircularProgress,
} from '@mui/material';

import { CONFIG } from 'src/config-global';

import AddProject from './add-project';
import { formatDateRange } from '../../../utils/formatDate';
import {
  updateWork,
  updateLink,
  updateOwner,
  updateStatus,
  updateProblem,
  updateComment,
  updateMeetingone,
  updateMeetingtwo,
  updateProjectName,
  fetchTaskTrackerWithTeamData,
} from '../../../actions/fetchData';

const baseURL = CONFIG.site.serverUrl;

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
  const [activeTab, setActiveTab] = useState(1);
  const router = useRouter();
  const [openAddProjectModal, setOpenAddProjectModal] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const response = await fetchTaskTrackerWithTeamData();
        const taskTrackers = response?.result;
        if (Array.isArray(taskTrackers)) {
          const formattedRows = taskTrackers.map((item) => {
            const teamNames = Array.isArray(item.teamData)
              ? item.teamData.map((team) => team.team.teamName)
              : [];
            const ownerNames = Array.isArray(item.ownerData)
              ? item.ownerData.map((owner) => owner.owner.ownerName)
              : [];

            return {
              id: item.trackerId,
              projectName: item.projectName,
              problem: item.problem,
              status: item.status?.statusName || 'N/A',
              owner: item.owner?.ownerName || 'N/A',
              priority: item.priority?.priorityName || 'N/A',
              team: item.team?.teamName || 'N/A',
              teamDataIds: Array.isArray(item.teamData)
                ? item.teamData.map((team) => team.teamDataId)
                : [],
              teamNames, // ✅ เพิ่ม teamNames
              ownerDataIds: Array.isArray(item.ownerData)
                ? item.ownerData.map((owner) => owner.ownerDataId)
                : [],
              ownerNames, // ✅ เพิ่ม ownerNames
              work: item.work,
              start_date: formatDateRange(item.startDate, item.endDate, item.createDate),
              link: item.link || 'N/A',
              comment: item.comment || '',
              meetingone: item.meetingone || '',
              meetingtwo: item.meetingtwo || '',
            };
          });

          // ตั้งค่าแถวข้อมูลและ teamMap
          setRows(formattedRows);
          setTeamMap(
            taskTrackers.map((item) => item.team?.teamName).filter(Boolean) // ลบค่า null หรือ undefined
          );
        } else {
          console.error('taskTrackers is not an array:', taskTrackers);
        }
      } catch (error) {
        console.error('Error fetching task trackers:', error);
      }

      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        const response = await fetch(`${baseURL}/statuses/all-statuses`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setStatusOptions(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching status data:', error);
        setLoading(false);
      }
    };
    fetchStatusData();
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
        router.push('/dashboard/board');
        break;
      default:
        break;
    }
  };

  const handleStatusClick = (params) => {
    setSelectedRowId(params.id);
    const selectedStatus = statusOptions.find((status) => status.statusName === params.value);
    setSelectedValue(selectedStatus ? selectedStatus.statusId : params.value);

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
        console.log('Attempting to save:', { selectedRowId, selectedValue, selectedField });

        let response;

        if (selectedField === 'status') {
          response = await updateStatus(selectedRowId, selectedValue);
        } else if (selectedField === 'comment') {
          response = await updateComment(selectedRowId, selectedValue);
        } else if (selectedField === 'work') {
          response = await updateWork(selectedRowId, selectedValue);
        } else if (selectedField === 'problem') {
          response = await updateProblem(selectedRowId, selectedValue);
        } else if (selectedField === 'meeting#1') {
          console.log('Updating meetingone');
          response = await updateMeetingone(selectedRowId, selectedValue);
        } else if (selectedField === 'meeting#2') {
          console.log('Updating meetingtwo');
          response = await updateMeetingtwo(selectedRowId, selectedValue);
        } else if (selectedField === 'link') {
          console.log('Updating Link');
          response = await updateLink(selectedRowId, selectedValue);
        } else if (selectedField === 'owner') {
          console.log('Updating Owner');
          response = await updateOwner(selectedRowId, selectedValue);
        } else if (selectedField === 'projectName') {
          console.log('Updating Owner');
          response = await updateProjectName(selectedRowId, selectedValue);
        }

        console.log('Response after save:', response);

        if (response) {
          setRows((prevRows) =>
            prevRows.map((row) =>
              row.id === selectedRowId
                ? { ...row, [selectedField]: selectedValue } // แก้ไขข้อมูลในแถวที่เลือก
                : row
            )
          );
          setOpen(false); // Close the dialog after saving
          console.log('Successfully saved');
        } else {
          console.error(`Failed to update ${selectedField}`);
        }
      } catch (error) {
        console.error(`Error updating ${selectedField}:`, error);
      }
    } else {
      console.error('Missing selectedRowId or selectedValue');
    }
  };

  if (!isMounted) {
    return null; // Or a loading state if necessary
  }

  const teamColorMap = {
    Programmer: 'primary',
    Electrical: 'secondary',
    Mechanical: 'error',
    PLC: 'warning',
    Oparation: 'success',
  };

  const ownerColorMap = {
    Jockey: 'primary',
    Oat: 'secondary',
    Poogun: 'success',
    Aon: 'error',
    Tent: 'warning',
    Pooh: 'info',
    Nack: 'primary',
    Boy: 'secondary',
    Kung: 'success',
    Pai: 'error',
    Jiw: 'warning',
    Title: 'info',
    Aof: 'primary',
    Fuse: 'secondary',
    makam: 'success',
  };

  const columns = [
    {
      field: 'projectName',
      headerName: 'Project Name',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography variant="body2" onClick={() => handleCellClick(params, 'projectName')}>
            {params.value}
          </Typography>
        </Box>
      ),
    },

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
      renderCell: (params) => {
        // ✅ หา statusName จาก statusOptions ทันที
        const selectedStatus = statusOptions.find((status) => status.statusId === params.value);
        const statusName = selectedStatus ? selectedStatus.statusName : params.value;

        return (
          <Chip
            label={statusName}
            color={
              statusName === 'In progress'
                ? 'primary'
                : statusName === 'On Hold'
                  ? 'warning'
                  : statusName === 'Completed'
                    ? 'success'
                    : statusName === 'Cancelled'
                      ? 'error'
                      : 'default'
            }
            onClick={() => handleStatusClick(params)}
            sx={{ cursor: 'pointer' }}
          />
        );
      },
    },

    {
      field: 'ownerNames',
      headerName: 'Owner',
      flex: 1,
      // renderCell: (params) => (
      //   <Box
      //     sx={{
      //       display: 'flex',
      //       alignItems: 'center',
      //       gap: 0.5, // ลดระยะห่างระหว่างไอเท็ม (ปรับค่า gap ตามต้องการ)
      //       height: '100%', // ทำให้ Box เต็มเซลล์
      //     }}
      //   >
      //     {params.value.map((ownerName, index) => (
      //       <Chip
      //         key={index}
      //         label={ownerName}
      //         sx={{
      //           border: 'none', // ไม่มีกรอบ
      //           background: 'none', // ไม่มีพื้นหลัง
      //           color: 'inherit', // ใช้สีของข้อความที่กำหนด
      //           fontWeight: 'normal', // ใช้ฟอนต์ปกติ
      //           margin: 0, // กำหนด margin ให้เป็น 0 เพื่อลดระยะห่าง
      //         }}
      //       />
      //     ))}
      //   </Box>
      // ),
    },
    // { field: 'owner', headerName: 'Owner', flex: 1 },
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

    {
      field: 'teamNames',
      headerName: 'Team',
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            height: '100%', // ทำให้ Box เต็มเซลล์
          }}
        >
          {params.value.map((teamName, index) => {
            const teamColor = teamColorMap[teamName] || 'default';
            return <Chip key={index} label={teamName} color={teamColor} />;
          })}
        </Box>
      ),
    },
    // {
    //   field: 'teamDataIds',
    //   headerName: 'Team IDs',
    //   flex: 1,
    //   renderCell: (params) => (
    //     <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
    //       <Typography variant="body2">
    //         {params.value.length > 0 ? params.value.join(', ') : 'No Team IDs'}
    //       </Typography>
    //     </Box>
    //   ),
    // },
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
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          {params.value && params.value !== 'N/A' ? (
            <>
              {/* ไอคอนลิงก์ */}
              <LinkIcon
                sx={{
                  cursor: 'pointer',
                  color: 'defult',
                  marginRight: '8px',
                }}
                onClick={() => window.open(params.value, '_blank')}
              />

              {/* ข้อความที่คลิกเพื่อเปิด dialog สำหรับแก้ไข */}
              <Typography
                variant="body2"
                onClick={() => handleCellClick(params, 'link')}
                sx={{
                  cursor: 'pointer',
                  color: 'defult',
                  textDecoration: 'underline',
                }}
              >
                {params.value}
              </Typography>
            </>
          ) : (
            'N/A'
          )}
        </Box>
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
    {
      field: 'meetingone',
      headerName: 'meeting#1',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography
            variant="body2"
            onClick={() => handleCellClick(params, 'meeting#1')}
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
      field: 'meetingtwo',
      headerName: 'meeting#2',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography
            variant="body2"
            onClick={() => handleCellClick(params, 'meeting#2')}
            sx={{
              cursor: 'pointer',
            }}
          >
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

      const response = await updateStatus(selectedRowId, selectedValue); // อัปเดต API

      if (response) {
        const selectedStatus = statusOptions.find((status) => status.statusId === selectedValue);
        const statusName = selectedStatus ? selectedStatus.statusName : selectedValue;

        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedRowId
              ? { ...row, status: statusName } // ✅ ใช้ statusName โดยตรง
              : row
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
          pageSize={100}
          pageSizeOptions={[10, 25, 50, 100]}
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
            {loading ? (
              <CircularProgress />
            ) : (
              <Select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
                {statusOptions.map((status) => (
                  <MenuItem key={status.statusId} value={status.statusId}>
                    {status.statusName}
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              console.log('Save new status:', selectedValue);
              handleSaveStatus();
            }}
          >
            Save
          </Button>
          <Button onClick={() => setOpenStatusDialog(false)}>Cancel</Button>
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
          <Button color="primary" onClick={handleSave}>
            Save
          </Button>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
