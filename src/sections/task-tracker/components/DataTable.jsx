'use client';

import Swal from 'sweetalert2';
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
  Checkbox,
  TextField,
  FormGroup,
  IconButton,
  Typography,
  DialogTitle,
  FormControl,
  DialogContent,
  DialogActions,
  CircularProgress,
  FormControlLabel,
} from '@mui/material';

import { CONFIG } from 'src/config-global';

import AddProject from './add-project';
import { formatDateRange } from '../../../utils/formatDate';
import {
  updateWork,
  updateLink,
  updateTeam,
  updateOwner,
  updateStatus,
  updateProblem,
  updateComment,
  updatePriority,
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
  const [openPriorityDialog, setOpenPriorityDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();
  const [openAddProjectModal, setOpenAddProjectModal] = useState(false);
  const [statusOptions, setStatusOptions] = useState([]);
  const [priorityOptions, setPriorityOptions] = useState([]);
  const [ownerOptions, setOwnerOptions] = useState([]);
  const [openOwnerDialog, setOpenOwnerDialog] = useState(false);
  const [selectedOwnerIds, setSelectedOwnerIds] = useState([]);
  const [teamOptions, setTeamOptions] = useState([]);
  const [openTeamDialog, setOpenTeamDialog] = useState(false);
  const [selectedTeamIds, setSelectedTeamIds] = useState([]);

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
          const formattedRows = taskTrackers
            .map((item) => {
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
                teamNames,
                ownerDataIds: Array.isArray(item.ownerData)
                  ? item.ownerData.map((owner) => owner.ownerDataId)
                  : [],
                ownerNames,
                work: item.work,
                start_date: formatDateRange(item.startDate, item.endDate, item.createDate),
                link: item.link || 'N/A',
                comment: item.comment || '',
                meetingone: item.meetingone || '',
                meetingtwo: item.meetingtwo || '',
              };
            })
            .sort((a, b) => b.id - a.id); // ✅ เรียงตาม id (มาก -> น้อย)

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
        const response = await fetch(`${baseURL}/statuses/all-statuses`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });

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

  useEffect(() => {
    const fetchPriorityData = async () => {
      try {
        const response = await fetch(`${baseURL}/priorities/getall-priorities`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setPriorityOptions(data);
      } catch (error) {
        console.error('Error fetching priority data:', error);
      }
    };

    fetchPriorityData();
  }, []);

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const response = await fetch(`${baseURL}/owners/getall-owners`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setOwnerOptions(data);
      } catch (error) {
        console.error('Error fetching owner data:', error);
      }
    };

    fetchOwnerData();
  }, []);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch(`${baseURL}/teams/all-teams`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setTeamOptions(data);
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    };

    fetchTeamData();
  }, []);

  useEffect(() => {
    if (router.pathname === '/dashboard/task-tracker') setActiveTab(0);
    else if (router.pathname === '/dashboard/timeline') setActiveTab(1);
    else if (router.pathname === '/dashboard/board') setActiveTab(2);
  }, [router.pathname]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    switch (newValue) {
      case 0:
        router.push('/dashboard/task-tracker'); // All Projects
        break;
      case 1:
        router.push('/dashboard/timeline'); // Timeline
        break;
      case 2:
        router.push('/dashboard/board'); // Board
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

  const handlePriorityClick = (params) => {
    setSelectedRowId(params.id);

    console.log('Clicked Priority:', params.value);

    const selectedPriority = priorityOptions.find(
      (priority) => priority.priorityName === params.value
    );

    console.log('Matched Priority:', selectedPriority);

    setSelectedValue(selectedPriority ? selectedPriority.priorityId : '');

    setOpenPriorityDialog(true);
  };

  const handleCellClick = (params, field) => {
    setSelectedField(field);
    setSelectedValue(params.value);
    setSelectedRowId(params.id);
    setOpen(true);
  };

  const handleOwnerClick = (params) => {
    setSelectedRowId(params.id);
    setSelectedValue(params.value || []); // เก็บ ownerNames เป็น Array
    setOpenOwnerDialog(true);
  };

  const handleTeamClick = (params) => {
    setSelectedRowId(params.id);
    setSelectedValue(params.value || []); // เก็บ ownerNames เป็น Array
    setOpenTeamDialog(true);
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
          console.log('Updating Project Name');
          response = await updateProjectName(selectedRowId, selectedValue);
        }

        console.log('Response after save:', response);

        if (response) {
          setRows((prevRows) =>
            prevRows.map((row) =>
              row.id === selectedRowId ? { ...row, [selectedField]: selectedValue } : row
            )
          );
          setOpen(false);

          // แสดง SweetAlert2 เมื่อบันทึกสำเร็จ
          Swal.fire({
            title: 'บันทึกสำเร็จ!',
            text: `ข้อมูล ${selectedField} ถูกอัปเดตแล้ว`,
            icon: 'success',
            confirmButtonText: 'ตกลง',
          });

          console.log('Successfully saved');
        } else {
          // แสดง SweetAlert2 เมื่อบันทึกไม่สำเร็จ
          Swal.fire({
            title: 'เกิดข้อผิดพลาด!',
            text: `ไม่สามารถอัปเดต ${selectedField} ได้`,
            icon: 'error',
            confirmButtonText: 'ลองอีกครั้ง',
          });

          console.error(`Failed to update ${selectedField}`);
        }
      } catch (error) {
        // แสดง SweetAlert2 เมื่อเกิดข้อผิดพลาด
        Swal.fire({
          title: 'ข้อผิดพลาด!',
          text: `เกิดข้อผิดพลาดขณะอัปเดต ${selectedField}: ${error.message}`,
          icon: 'error',
          confirmButtonText: 'ตกลง',
        });

        console.error(`Error updating ${selectedField}:`, error);
      }
    } else {
      // แสดง SweetAlert2 เมื่อข้อมูลไม่ครบ
      Swal.fire({
        title: 'ข้อมูลไม่ครบ!',
        text: 'กรุณาเลือกข้อมูลที่ต้องการบันทึก',
        icon: 'warning',
        confirmButtonText: 'ตกลง',
      });

      console.error('Missing selectedRowId or selectedValue');
    }
  };

  if (!isMounted) {
    return null;
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
    // {
    //   field: 'id',
    //   headerName: 'No.',
    //   flex: 1,
    // },
    {
      field: 'projectName',
      headerName: 'Project Name',
      flex: 1,

      minWidth: 300,
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
      minWidth: 270,
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
      minWidth: 120,
      renderCell: (params) => {
        const selectedStatus = statusOptions.find((status) => status.statusId === params.value);
        const statusName = selectedStatus ? selectedStatus.statusName : params.value;

        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 'auto',
              minHeight: '60px',
            }}
          >
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
              sx={{ cursor: 'pointer', lineHeight: '100%' }}
            />
          </Box>
        );
      },
    },
    // {
    //   field: 'ownerNames',
    //   headerName: 'Owner',
    //   flex: 1,
    //   minWidth: 150,
    //   renderCell: (params) => (
    //     <Box
    //       sx={{
    //         display: 'flex',
    //         alignItems: 'center',
    //         gap: 0.5,
    //         height: '100%',
    //       }}
    //     >
    //       {params.value.map((ownerName, index) => (
    //         <Chip
    //           key={index}
    //           label={ownerName}
    //           sx={{
    //             border: 'none',
    //             background: 'none',
    //             color: 'inherit',
    //             fontWeight: 'normal',
    //             margin: 0,
    //           }}
    //         />
    //       ))}
    //     </Box>
    //   ),
    // },
    {
      field: 'ownerNames',
      headerName: 'Owner',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            height: '100%',
            cursor: 'pointer',
          }}
          onClick={() => handleOwnerClick(params)}
        >
          {params.value.map((ownerName, index) => (
            <Chip key={index} label={ownerName} />
          ))}
        </Box>
      ),
    },

    // { field: 'owner', headerName: 'Owner', flex: 1 },
    {
      field: 'priority',
      headerName: 'Priority',
      flex: 1,
      minWidth: 110,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <Chip
            label={params.value}
            color={
              params.value === 'High' ? 'error' : params.value === 'Medium' ? 'warning' : 'primary'
            }
            onClick={() => handlePriorityClick(params)}
            sx={{ cursor: 'pointer' }}
          />
        </Box>
      ),
    },

    {
      field: 'teamNames',
      headerName: 'Team',
      flex: 1,
      minWidth: 450,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            height: '100%',
            cursor: 'pointer',
          }}
          onClick={() => handleTeamClick(params)} // เมื่อคลิกจะเปิด dialog เพื่อเลือกทีม
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
      minWidth: 100,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography
            variant="body2"
            onClick={() => handleCellClick(params, 'work')}
            sx={{
              cursor: 'pointer',
              justifyContent: 'center',
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
      minWidth: 230,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center', // Center the content vertically
            height: '100%',
          }}
        >
          {params.value ? params.value : 'N/A'}
        </Box>
      ),
    },
    {
      field: 'link',
      headerName: 'Link',
      flex: 0.5,
      minWidth: 230,
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
                  whiteSpace: 'pre-line', // Allow line breaks
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
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
      minWidth: 300,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography
            variant="body2"
            onClick={() => handleCellClick(params, 'comment')}
            sx={{
              whiteSpace: 'pre-line', // Allow line breaks
              overflow: 'hidden',
              textOverflow: 'ellipsis', // Truncate text with ellipsis
              cursor: 'pointer',
            }}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'meetingone',
      headerName: 'Meeting#1',
      flex: 1,
      minWidth: 430,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography
            variant="body2"
            onClick={() => handleCellClick(params, 'meeting#1')}
            sx={{
              whiteSpace: 'pre-line', // Allow line breaks
              overflow: 'hidden',
              textOverflow: 'ellipsis', // Truncate text with ellipsis
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
      headerName: 'Meeting#2',
      flex: 1,
      minWidth: 430,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography
            variant="body2"
            onClick={() => handleCellClick(params, 'meeting#2')}
            sx={{
              whiteSpace: 'pre-line', // Allow line breaks
              overflow: 'hidden',
              textOverflow: 'ellipsis', // Truncate text with ellipsis
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
        Swal.fire({
          title: 'ข้อมูลไม่ครบ!',
          text: 'กรุณาเลือกสถานะก่อนบันทึก',
          icon: 'warning',
          confirmButtonText: 'ตกลง',
        });
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

        Swal.fire({
          title: 'บันทึกสำเร็จ!',
          text: 'สถานะถูกอัปเดตเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง',
        });
      } else {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถอัปเดตสถานะได้',
          icon: 'error',
          confirmButtonText: 'ลองอีกครั้ง',
        });
        console.error('Failed to update status');
      }
    } catch (error) {
      Swal.fire({
        title: 'ข้อผิดพลาด!',
        text: `เกิดข้อผิดพลาดขณะอัปเดตสถานะ: ${error.message}`,
        icon: 'error',
        confirmButtonText: 'ตกลง',
      });
      console.error('Error saving status:', error);
    }
  };

  const handleSavePriority = async () => {
    try {
      if (!selectedRowId || !selectedValue) {
        Swal.fire({
          title: 'ข้อมูลไม่ครบ!',
          text: 'กรุณาเลือกลำดับความสำคัญก่อนบันทึก',
          icon: 'warning',
          confirmButtonText: 'ตกลง',
        });
        return;
      }

      // เรียก API เพื่ออัปเดต Priority
      const response = await updatePriority(selectedRowId, selectedValue);

      if (response) {
        // หา priorityName ที่ตรงกับ selectedValue
        const selectedPriority = priorityOptions.find(
          (priority) => priority.priorityId === selectedValue
        );
        const priorityName = selectedPriority ? selectedPriority.priorityName : selectedValue;

        // อัปเดต state ของ rows
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === selectedRowId ? { ...row, priority: priorityName } : row
          )
        );

        setOpenPriorityDialog(false);

        Swal.fire({
          title: 'บันทึกสำเร็จ!',
          text: 'ลำดับความสำคัญถูกอัปเดตเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง',
        });
      } else {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถอัปเดตลำดับความสำคัญได้',
          icon: 'error',
          confirmButtonText: 'ลองอีกครั้ง',
        });
        console.error('Failed to update priority');
      }
    } catch (error) {
      Swal.fire({
        title: 'ข้อผิดพลาด!',
        text: `เกิดข้อผิดพลาดขณะอัปเดตลำดับความสำคัญ: ${error.message}`,
        icon: 'error',
        confirmButtonText: 'ตกลง',
      });
      console.error('Error saving priority:', error);
    }
  };

  const handleSaveOwner = async () => {
    try {
      if (!selectedRowId || !selectedOwnerIds.length) {
        Swal.fire({
          title: 'ข้อมูลไม่ครบ!',
          text: 'กรุณาเลือกเจ้าของก่อนบันทึก',
          icon: 'warning',
          confirmButtonText: 'ตกลง',
        });
        return;
      }

      const response = await updateOwner(selectedRowId, selectedOwnerIds);

      if (response) {
        const ownerNames = selectedOwnerIds.map(
          (id) => ownerOptions.find((owner) => owner.ownerId === id)?.ownerName
        );

        setRows((prevRows) =>
          prevRows.map((row) => (row.id === selectedRowId ? { ...row, ownerNames } : row))
        );

        setOpenOwnerDialog(false);

        Swal.fire({
          title: 'บันทึกสำเร็จ!',
          text: 'Owner ถูกอัพเดตเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง',
        });
      } else {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถอัพเดต Owner ได้',
          icon: 'error',
          confirmButtonText: 'ลองอีกครั้ง',
        });
        console.error('Failed to update Owner');
      }
    } catch (error) {
      Swal.fire({
        title: 'ข้อผิดพลาด!',
        text: `เกิดข้อผิดพลาดขณะอัพเดต Owner: ${error.message}`,
        icon: 'error',
        confirmButtonText: 'ตกลง',
      });
      console.error('Error saving owner:', error);
    }
  };

  const handleOwnerChange = (event, ownerId) => {
    // ตรวจสอบว่า selectedOwnerIds เป็นอาร์เรย์
    setSelectedOwnerIds((prevSelectedIds) => {
      const updatedIds = event.target.checked
        ? [...prevSelectedIds, ownerId] // ถ้าเลือกเพิ่มเข้าไป
        : prevSelectedIds.filter((id) => id !== ownerId); // ถ้าไม่เลือกให้ลบ
      return updatedIds;
    });
  };

  const handleSaveTeam = async () => {
    try {
      if (!selectedRowId || !selectedTeamIds.length) {
        Swal.fire({
          title: 'ข้อมูลไม่ครบ!',
          text: 'กรุณาเลือกทีมก่อนบันทึก',
          icon: 'warning',
          confirmButtonText: 'ตกลง',
        });
        return;
      }

      const teamsArray = Array.isArray(selectedTeamIds) ? selectedTeamIds : [selectedTeamIds];

      const response = await updateTeam(selectedRowId, teamsArray);

      if (response) {
        const teamNames = teamsArray.map(
          (id) => teamOptions.find((team) => team.teamId === id)?.teamName
        );

        setRows((prevRows) =>
          prevRows.map((row) => (row.id === selectedRowId ? { ...row, teamNames } : row))
        );

        setOpenTeamDialog(false);

        Swal.fire({
          title: 'บันทึกสำเร็จ!',
          text: 'ทีมถูกอัพเดตเรียบร้อยแล้ว',
          icon: 'success',
          confirmButtonText: 'ตกลง',
        });
      } else {
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถอัพเดตทีมได้',
          icon: 'error',
          confirmButtonText: 'ลองอีกครั้ง',
        });
        console.error('Failed to update team');
      }
    } catch (error) {
      Swal.fire({
        title: 'ข้อผิดพลาด!',
        text: `เกิดข้อผิดพลาดขณะอัพเดตทีม: ${error.message}`,
        icon: 'error',
        confirmButtonText: 'ตกลง',
      });
      console.error('Error saving team:', error);
    }
  };

  const handleTeamChange = (event, teamId) => {
    // ตรวจสอบว่า selectedTeamIds เป็นอาร์เรย์
    setSelectedTeamIds((prevSelectedIds) => {
      const updatedIds = event.target.checked
        ? [...prevSelectedIds, teamId] // ถ้าเลือกเพิ่มเข้าไป
        : prevSelectedIds.filter((id) => id !== teamId); // ถ้าไม่เลือกให้ลบ
      return updatedIds;
    });
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
        <Tab label="All Projects" />
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
          pageSize={1000}
          pageSizeOptions={[10, 25, 50, 100]}
          pagination
          loading={loading}
          getRowHeight={(params) => 'auto'}
          sx={{
            '& .MuiDataGrid-columnSeparator': {
              display: 'inline-flex', // Ensure that column separators are visible
              backgroundColor: 'rgba(0, 0, 0, 0.12)', // Set the color of the column separators (light gray)
              width: '1px', // Set the thickness of the vertical line
            },
            '& .MuiDataGrid-cell': {
              whiteSpace: 'pre-line', // Allow line breaks
              overflow: 'hidden',
              textOverflow: 'ellipsis', // Truncate text
              borderRight: '1px solid rgba(0, 0, 0, 0.12)', // Add vertical line to the right of each cell
              borderBottom: '1px solid rgba(0, 0, 0, 0.12)', // Add horizontal line at the bottom of each cell
            },
            '& .MuiDataGrid-columnHeaders': {
              borderBottom: '2px solid rgba(0, 0, 0, 0.12)', // Optional: Adds a bottom border to the header for separation
            },
            '& .MuiDataGrid-row': {
              borderBottom: '1px solid rgba(0, 0, 0, 0.12)', // Add horizontal line at the bottom of each row
            },
          }}
        />
      </Box>
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
      {/* แก้ความเร่งด่วน Priority */}
      <Dialog
        open={openPriorityDialog}
        onClose={() => setOpenPriorityDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Priority</DialogTitle>
        <DialogContent sx={{ padding: 2 }}>
          <FormControl fullWidth>
            {loading ? (
              <CircularProgress />
            ) : (
              <Select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
                {statusOptions.map((priority) => (
                  <MenuItem key={priority.priorityId} value={priority.priorityId}>
                    {priority.priorityName}
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
          <Button onClick={() => setOpenPriorityDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
      {/* แก้เจ้าของ Owners */}
      {/* <Dialog
        open={openOwnerDialog}
        onClose={() => setOpenOwnerDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Owner</DialogTitle>
        <DialogContent sx={{ padding: 2 }}>
          <FormControl fullWidth>
            {loading ? (
              <CircularProgress />
            ) : (
              <Select
                multiple
                value={selectedOwnerIds}
                onChange={(e) => setSelectedOwnerIds(e.target.value)}
                renderValue={(selected) =>
                  selected
                    .map((id) => ownerOptions.find((o) => o.ownerId === id)?.ownerName)
                    .join(', ')
                }
              >
                {ownerOptions.map((owner) => (
                  <MenuItem key={owner.ownerId} value={owner.ownerId}>
                    {owner.ownerName}
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
              console.log('Save new owner:', selectedOwnerIds);
              handleSaveOwner();
            }}
          >
            Save
          </Button>
          <Button onClick={() => setOpenOwnerDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog> */}
      <Dialog
        open={openOwnerDialog}
        onClose={() => setOpenOwnerDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Owner</DialogTitle>
        <DialogContent sx={{ padding: 2 }}>
          <FormControl fullWidth>
            {loading ? (
              <CircularProgress />
            ) : (
              <FormGroup>
                {ownerOptions.map((owner) => (
                  <FormControlLabel
                    key={owner.ownerId}
                    control={
                      <Checkbox
                        checked={selectedOwnerIds.includes(owner.ownerId)}
                        onChange={(e) => handleOwnerChange(e, owner.ownerId)}
                      />
                    }
                    label={owner.ownerName}
                  />
                ))}
              </FormGroup>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              console.log('Save new owner:', selectedOwnerIds);
              handleSaveOwner();
            }}
          >
            Save
          </Button>
          <Button onClick={() => setOpenOwnerDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
      {/* ------------------------------- */}
      <Dialog
        open={openTeamDialog}
        onClose={() => setOpenTeamDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Teams</DialogTitle>
        <DialogContent sx={{ padding: 2 }}>
          <FormControl fullWidth>
            {loading ? (
              <CircularProgress />
            ) : (
              <FormGroup>
                {teamOptions.map((team) => (
                  <FormControlLabel
                    key={team.teamId}
                    control={
                      <Checkbox
                        checked={selectedTeamIds.includes(team.teamId)}
                        onChange={(e) => handleTeamChange(e, team.teamId)}
                      />
                    }
                    label={team.teamName}
                  />
                ))}
              </FormGroup>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              console.log('Save new teams:', selectedTeamIds);
              handleSaveTeam(); // ฟังก์ชันสำหรับบันทึกการเลือกทีม
            }}
          >
            Save
          </Button>
          <Button onClick={() => setOpenTeamDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
      {/* ------------------------------- */}
      <Dialog
        open={openPriorityDialog}
        onClose={() => setOpenPriorityDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Priority</DialogTitle>
        <DialogContent sx={{ padding: 2 }}>
          <FormControl fullWidth>
            {priorityOptions.length === 0 ? (
              <CircularProgress />
            ) : (
              <Select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
                {priorityOptions.map((priority) => (
                  <MenuItem key={priority.priorityId} value={priority.priorityId}>
                    {priority.priorityName}
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
              console.log('Save new priority:', selectedValue);
              handleSavePriority();
            }}
          >
            Save
          </Button>
          <Button onClick={() => setOpenPriorityDialog(false)}>Cancel</Button>
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
