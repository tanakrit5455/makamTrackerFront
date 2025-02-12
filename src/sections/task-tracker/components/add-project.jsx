'use client';

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
} from '@mui/material';

import { fetchAllData, createTaskTracker } from '../../../services/fetchData'; // For dropdown data

export default function AddProject({ open, onClose }) {
  const router = useRouter();

  // State for form data and dropdown options
  const [formData, setFormData] = useState({
    projectName: '',
    problem: '',
    status: '',
    owner: '',
    priority: '',
    team: [],
    work: '',
    start_date: '',
    link: '',
    comment: '',
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
        console.log('Fetched dropdown data:', data); // Log the fetched data to verify
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'team') {
      // สำหรับ multi-select ให้แน่ใจว่า value เป็น array
      setFormData((prev) => ({ ...prev, [name]: value || [] })); // Ensure it's an array
    } else {
      // สำหรับฟิลด์ที่ไม่ใช่ multi-select
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission to create TaskTracker
  const handleCreateTaskTracker = async (e) => {
    e.preventDefault();

    // ตรวจสอบข้อมูลในฟอร์มก่อนส่ง
    if (
      !formData.projectName ||
      !formData.status ||
      !formData.priority ||
      !formData.team.length ||
      !formData.work ||
      !formData.start_date
    ) {
      console.error('กรุณากรอกข้อมูลที่จำเป็นทั้งหมด');
      return;
    }

    // เตรียมข้อมูลสำหรับการส่งไปยัง API
    const taskData = {
      projectName: formData.projectName,
      problem: formData.problem,
      statusId: dropdownOptions.statuses.find((status) => status.name === formData.status)?.id,
      priorityId: dropdownOptions.priorities.find((priority) => priority.name === formData.priority)
        ?.id,
      teamIds: formData.team
        .map((teamName) => dropdownOptions.teams.find((team) => team.name === teamName)?.id)
        .filter((id) => id), // Ensure teamIds is an array
      ownerId: dropdownOptions.owners.find((owner) => owner.name === formData.owner)?.id,
      comment: formData.comment,
      link: formData.link,
      createDate: new Date(), // Assuming you want to set the createDate to current time
      startDate: formData.start_date,
      endDate: formData.end_date, // If you have an end date
    };

    // Check taskData before sending
    console.log('Sending data to create task tracker:', taskData);

    try {
      const result = await createTaskTracker(taskData);
      if (result) {
        console.log('สร้าง TaskTracker สำเร็จ');
        onClose();
        router.push('/dashboard'); // ไปที่หน้า dashboard
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการสร้าง TaskTracker:', error);
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
                rows={2}
                margin="normal"
              />
            </Grid>

            {/* Dropdown Fields for Status, Owner, Priority, Team */}
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
                {dropdownOptions.statuses.length > 0 ? (
                  dropdownOptions.statuses.map((option) => (
                    <MenuItem key={option.id} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No statuses available</MenuItem>
                )}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Owner"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              >
                {dropdownOptions.owners.length > 0 ? (
                  dropdownOptions.owners.map((option) => (
                    <MenuItem key={option.id} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No owners available</MenuItem>
                )}
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
                {dropdownOptions.priorities.length > 0 ? (
                  dropdownOptions.priorities.map((option) => (
                    <MenuItem key={option.id} value={option.name}>
                      {option.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No priorities available</MenuItem>
                )}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Team"
                name="team"
                value={formData.team || []} // Ensure it's an array
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                SelectProps={{
                  multiple: true, // Allow multiple selection
                }}
              >
                {dropdownOptions.teams.length > 0 ? (
                  dropdownOptions.teams.map((option) => (
                    <MenuItem key={option.id} value={option.name}>
                      <Checkbox checked={formData.team.includes(option.name)} />
                      {option.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No teams available</MenuItem>
                )}
              </TextField>
            </Grid>

            {/* Other form fields like % Work, Start Date, Link, Comment */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="% Work"
                name="work"
                value={formData.work}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                type="number"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button variant="outlined" color="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  );
}
