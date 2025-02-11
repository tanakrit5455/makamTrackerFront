'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

import {
  Box,
  Grid,
  Button,
  Dialog,
  MenuItem,
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
    team: '',
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
      const data = await fetchAllData();
      if (data) {
        setDropdownOptions({
          statuses: Object.values(data.statuses),
          priorities: Object.values(data.priorities),
          owners: Object.values(data.owners),
          teams: Object.values(data.teams),
        });
      } else {
        console.error('Failed to load dropdown data');
      }
    };

    getData();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission to create TaskTracker
  const handleCreateTaskTracker = async (e) => {
    e.preventDefault();

    // Validate form data before sending
    if (
      !formData.projectName ||
      !formData.status ||
      !formData.priority ||
      !formData.team ||
      !formData.work ||
      !formData.start_date
    ) {
      console.error('All required fields must be filled out.');
      return;
    }

    const taskData = {
      projectName: formData.projectName,
      problem: formData.problem,
      statusId: formData.status,
      priorityId: formData.priority,
      teamId: formData.team,
      ownerId: formData.owner,
      comment: formData.comment,
      link: formData.link,
      startDate: formData.start_date,
      work: formData.work,
    };

    try {
      const result = await createTaskTracker(taskData);
      if (result) {
        console.log('TaskTracker created successfully');
        onClose();
        router.push('/dashboard');
      }
    } catch (error) {
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
                {dropdownOptions.statuses.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
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
                {dropdownOptions.owners.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
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
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Team"
                name="team"
                value={formData.team}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
              >
                {dropdownOptions.teams.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
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
