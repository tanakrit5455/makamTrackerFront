// eslint-disable-next-line import/no-extraneous-dependencies
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Grid,
  Button,
  Dialog,
  MenuItem,
  Checkbox,
  TextField,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from '@mui/material';

import { fetchAllData, createTaskTracker } from '../../../actions/fetchData';

export default function AddProject({ open, onClose }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    problem: '',
    status: '',
    ownerIds: [],
    priority: '',
    teamIds: [],
    work: '',
    start_date: '',
    link: '',
    comment: '',
    end_date: '',
    meetingone: '',
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    statuses: [],
    priorities: [],
    owners: [],
    teams: [],
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchAllData();
        if (data) {
          setDropdownOptions({
            statuses: Object.keys(data.statuses).map((key) => ({
              id: key,
              name: data.statuses[key],
            })),
            priorities: Object.keys(data.priorities).map((key) => ({
              id: key,
              name: data.priorities[key],
            })),
            owners: Object.keys(data.owners).map((key) => ({
              id: key,
              name: data.owners[key],
            })),
            teams: Object.keys(data.teams).map((key) => ({
              id: key,
              name: data.teams[key],
            })),
          });
        } else {
          console.error('Failed to load dropdown data');
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    getData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'teamIds' || name === 'ownerIds') {
      setFormData((prev) => ({ ...prev, [name]: value || [] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateTaskTracker = async (e) => {
    e.preventDefault();

    // ตรวจสอบข้อมูลที่จำเป็น
    if (
      !formData.projectName ||
      !formData.status ||
      !formData.priority ||
      !formData.teamIds.length ||
      !formData.ownerIds.length ||
      !formData.meetingone
    ) {
      Swal.fire({
        target: document.body,
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    const ownerEntities = formData.ownerIds
      .map((ownerName) => {
        const owner = dropdownOptions.owners.find((o) => o.name === ownerName);
        return owner ? owner.id : null;
      })
      .filter(Boolean);

    if (!ownerEntities.length) {
      Swal.fire({
        target: document.body,
        icon: 'error',
        title: 'Invalid Owner',
        text: 'Owner(s) not found. Please select a valid owner.',
      });
      return;
    }

    const teamEntities = formData.teamIds
      .map((teamName) => {
        const team = dropdownOptions.teams.find((t) => t.name === teamName);
        return team ? team.id : null;
      })
      .filter(Boolean);

    if (!teamEntities.length) {
      Swal.fire({
        target: document.body,
        icon: 'error',
        title: 'Invalid Team',
        text: 'Team(s) not found. Please select a valid team.',
      });
      return;
    }

    const taskData = {
      projectName: formData.projectName,
      problem: formData.problem,
      statusId: parseInt(
        dropdownOptions.statuses.find((status) => status.name === formData.status)?.id,
        10
      ),
      priorityId: parseInt(
        dropdownOptions.priorities.find((priority) => priority.name === formData.priority)?.id,
        10
      ),
      ownerIds: ownerEntities,
      teamIds: teamEntities,
      comment: formData.comment,
      link: formData.link,
      startDate: formData.start_date ? new Date(formData.start_date).toISOString() : null,
      endDate: formData.end_date ? new Date(formData.end_date).toISOString() : null,
      work: '0%',
      meetingone: formData.meetingone,
    };

    console.log('Task data being sent:', JSON.stringify(taskData, null, 2));

    // ปิดฟอร์มกรอกข้อมูลทันที
    onClose();

    // แสดง SweetAlert แบบ loading spinner
    Swal.fire({
      title: '<strong>กำลังบันทึก...</strong>',
      html: '<i>โปรดรอสักครู่</i>',
      allowOutsideClick: false,
      target: document.body,
      didOpen: () => {
        Swal.showLoading();
      },
      background: '#f9f9f9',
      customClass: {
        popup: 'my-swal-popup',
        title: 'my-swal-title',
      },
    });

    try {
      const result = await createTaskTracker(taskData);
      if (result) {
        // รอให้ spinner แสดงสักครู่ จากนั้นแสดงผลลัพธ์
        setTimeout(() => {
          Swal.fire({
            target: document.body,
            icon: 'success',
            title: '<span style="font-size: 24px;">บันทึกสำเร็จ</span>',
            showConfirmButton: false,
            timer: 1500,
            background: '#f9f9f9',
            customClass: {
              popup: 'my-swal-popup',
              title: 'my-swal-title',
            },
          }).then(() => {
            // เปลี่ยนเส้นทางไปหน้า dashboard
            router.push('/dashboard');
            // รีเฟรชหน้า dashboard เพื่อให้ข้อมูลใหม่แสดงผล
            router.refresh();
          });
        }, 1000);
      }
    } catch (error) {
      Swal.fire({
        target: document.body,
        icon: 'error',
        title: 'Error',
        text: 'Failed to create project. Please try again.',
      });
      console.error('Error creating TaskTracker:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>Add New Project</DialogTitle>
      <DialogContent sx={{ padding: 2 }}>
        <form onSubmit={handleCreateTaskTracker}>
          <Grid container spacing={2}>
            {/* Form Fields */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Project Name"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Problem"
                name="problem"
                value={formData.problem}
                onChange={handleChange}
                fullWidth
                multiline
                // rows={2}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              >
                {dropdownOptions.statuses.map((option) => (
                  <MenuItem
                    key={option.id}
                    value={option.name}
                    style={{
                      color:
                        option.name === 'In progress'
                          ? 'blue' // primary color
                          : option.name === 'On Hold'
                            ? 'orange' // warning color
                            : option.name === 'Completed'
                              ? 'green' // success color
                              : option.name === 'Cancelled'
                                ? 'red' // error color
                                : 'black', // default color
                    }}
                  >
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Owner"
                name="ownerIds"
                value={formData.ownerIds}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                SelectProps={{ multiple: true }}
              >
                {dropdownOptions.owners.map((option) => (
                  <MenuItem key={option.id} value={option.name}>
                    <Checkbox checked={formData.ownerIds.includes(option.name)} />
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              >
                {dropdownOptions.priorities.map((option) => (
                  <MenuItem
                    key={option.id}
                    value={option.name}
                    style={{
                      color:
                        option.name === 'High'
                          ? '#f44336' // Red for High
                          : option.name === 'Medium'
                            ? '#ff9800' // Orange for Medium
                            : '#4caf50', // Green for others
                    }}
                  >
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Team"
                name="teamIds"
                value={formData.teamIds}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                SelectProps={{ multiple: true }}
              >
                {dropdownOptions.teams.map((option) => (
                  <MenuItem key={option.id} value={option.name}>
                    <Checkbox checked={formData.teamIds.includes(option.name)} />
                    {option.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Meeting#1"
                name="meetingone"
                value={formData.meetingone}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Start Date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="End Date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Save'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
}
