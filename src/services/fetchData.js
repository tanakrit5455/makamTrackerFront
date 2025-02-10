export const fetchAllData = async () => {
  try {
    const [statusesResponse, prioritiesResponse, ownersResponse, teamsResponse] = await Promise.all(
      [
        fetch('http://localhost:3000/statuses/all-statuses'),
        fetch('http://localhost:3000/priorities/getall-priorities'),
        fetch('http://localhost:3000/owners/getall-owners'),
        fetch('http://localhost:3000/teams/all-teams'),
      ]
    );

    const statusesData = await statusesResponse.json();
    const prioritiesData = await prioritiesResponse.json();
    const ownersData = await ownersResponse.json();
    const teamsData = await teamsResponse.json();

    return {
      statuses: statusesData.reduce((acc, item) => {
        acc[item.statusId] = item.statusName;
        return acc;
      }, {}),
      priorities: prioritiesData.reduce((acc, item) => {
        acc[item.priorityId] = item.priorityName;
        return acc;
      }, {}),
      owners: ownersData.reduce((acc, item) => {
        acc[item.ownerId] = item.ownerName;
        return acc;
      }, {}),
      teams: teamsData.reduce((acc, item) => {
        acc[item.teamId] = item.teamName;
        return acc;
      }, {}),
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

export const fetchTaskTrackers = async () => {
  try {
    const response = await fetch('http://localhost:3000/task-trackers/getall-trackers');
    return await response.json();
  } catch (error) {
    console.error('Error fetching task trackers:', error);
    return [];
  }
};

// export const updateProblem = async (id, newProblem) => {
//   try {
//     console.log(`Request to update problem for TaskTracker ${id}: New value = ${newProblem}`);

//     const response = await fetch(`http://localhost:3000/task-trackers/${id}`, {
//       method: 'PUT',
//       body: JSON.stringify({ problem: newProblem }),
//       headers: { 'Content-Type': 'application/json' },
//     });

//     const result = await response.json();
//     console.log(`Response from server: ${JSON.stringify(result)}`);

//     if (!response.ok) {
//       throw new Error(result.message || 'Error updating problem');
//     }

//     console.log(`Successfully updated problem for TaskTracker ${id}.`);
//     return result; // Make sure to return the result object
//   } catch (error) {
//     console.error(`Failed to update problem for TaskTracker ${id}. Error: ${error.message}`);
//     throw error;
//   }
// };

export const updateProblem = async (id, newProblem) => {
  try {
    console.log(`Request to update problem for TaskTracker ${id}: New value = ${newProblem}`);

    const response = await fetch(`http://localhost:3000/task-trackers/update-trackers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ problem: newProblem }),
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();
    console.log(`Response from server: ${JSON.stringify(result)}`);

    if (!response.ok) {
      throw new Error(result.message || 'Error updating problem');
    }

    console.log(`Successfully updated problem for TaskTracker ${id}.`);
    return result;
  } catch (error) {
    console.error(`Failed to update problem for TaskTracker ${id}. Error: ${error.message}`);
    throw error;
  }
};

export const updateWork = async (id, newWork) => {
  try {
    console.log(`Request to update work for TaskTracker ${id}: New value = ${newWork}`);

    const response = await fetch(`http://localhost:3000/task-trackers/update-trackers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ work: newWork }),
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();
    console.log(`Response from server: ${JSON.stringify(result)}`);

    if (!response.ok) {
      throw new Error(result.message || 'Error updating work');
    }

    console.log(`Successfully updated work for TaskTracker ${id}.`);
    return result;
  } catch (error) {
    console.error(`Failed to update work for TaskTracker ${id}. Error: ${error.message}`);
    throw error;
  }
};

export const updateComment = async (id, newComment) => {
  try {
    console.log(`Request to update comment for TaskTracker ${id}: New value = ${newComment}`);

    const response = await fetch(`http://localhost:3000/task-trackers/update-trackers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ comment: newComment }),
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();
    console.log(`Response from server: ${JSON.stringify(result)}`);

    if (!response.ok) {
      throw new Error(result.message || 'Error updating comment');
    }

    console.log(`Successfully updated comment for TaskTracker ${id}.`);
    return result;
  } catch (error) {
    console.error(`Failed to update comment for TaskTracker ${id}. Error: ${error.message}`);
    throw error;
  }
};
