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

import { fetchAllData, createTaskTracker } from '../../../actions/fetchData';

export default function AddProject({ open, onClose }) {
  const router = useRouter();
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
    if (
      !formData.projectName ||
      !formData.status ||
      !formData.priority ||
      !formData.teamIds.length ||
      !formData.ownerIds.length ||
      !formData.meetingone ||
      !formData.start_date
    ) {
      console.error('Please fill in all required fields.');
      return;
    }
    const ownerEntities = formData.ownerIds
      .map((ownerName) => {
        const owner = dropdownOptions.owners.find((o) => o.name === ownerName);
        return owner ? owner.id : null;
      })
      .filter(Boolean);

    if (!ownerEntities.length) {
      console.error('Owner(s) not found. Please select a valid owner.');
      return;
    }
    const teamEntities = formData.teamIds
      .map((teamName) => {
        const team = dropdownOptions.teams.find((t) => t.name === teamName);
        return team ? team.id : null;
      })
      .filter(Boolean);

    if (!teamEntities.length) {
      console.error('Team(s) not found. Please select a valid team.');
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
      // createDate: new Date().toISOString(),
      startDate: new Date().toISOString(),
      endDate: formData.end_date ? new Date(formData.end_date).toISOString() : null,

      work: '0%',
      meetingone: formData.meetingone,
    };
    console.log('Task data being sent:', JSON.stringify(taskData, null, 2));
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
                  <MenuItem key={option.id} value={option.name}>
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
                  <MenuItem key={option.id} value={option.name}>
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

            {/* Other form fields */}
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
