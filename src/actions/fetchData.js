import { CONFIG } from 'src/config-global';

const baseURL = CONFIG.site.serverUrl;

export const fetchAllData = async () => {
  try {
    const [statusesResponse, prioritiesResponse, ownersResponse, teamsResponse] = await Promise.all(
      [
        fetch(`${baseURL}/statuses/all-statuses`),
        fetch(`${baseURL}/priorities/getall-priorities`),
        fetch(`${baseURL}/owners/getall-owners`),
        fetch(`${baseURL}/teams/all-teams`),
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
    return null;
  }
};

export const fetchTaskTrackers = async () => {
  try {
    const response = await fetch(`${baseURL}/task-trackers/getall-trackers`);
    return await response.json();
  } catch (error) {
    return [];
  }
};

export const fetchTaskTrackerWithTeamData = async () => {
  try {
    const response = await fetch(`${baseURL}/task-trackers/getall-trackerWithTeamData`);
    return await response.json();
  } catch (error) {
    return [];
  }
};

export const fetchOwners = async () => {
  try {
    const response = await fetch(`${baseURL}/owners/getall-owners`);
    console.log(response.result);
    return await response.json();
  } catch (error) {
    return [];
  }
};

export const updateProblem = async (id, newProblem) => {
  try {
    const response = await fetch(`${baseURL}/task-trackers/update-trackers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ problem: newProblem }),
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Error updating problem');
    }
    return result;
  } catch (error) {
    console.error(`Failed to update problem for TaskTracker ${id}. Error: ${error.message}`);
    throw error;
  }
};

export const updateWork = async (id, newWork) => {
  try {
    const response = await fetch(`${baseURL}/task-trackers/update-trackers/${id}`, {
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

    const response = await fetch(`${baseURL}/task-trackers/update-trackers/${id}`, {
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

export const updateMeetingone = async (id, newMeeetingone) => {
  try {
    console.log(
      `Request to update meetingone for TaskTracker ${id}: New value = ${newMeeetingone}`
    );

    const response = await fetch(`${baseURL}/task-trackers/update-trackers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ meetingone: newMeeetingone }),
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();
    console.log(`Response from server: ${JSON.stringify(result)}`);

    if (!response.ok) {
      throw new Error(result.message || 'Error updating meetingone');
    }

    console.log(`Successfully updated meetingone for TaskTracker ${id}.`);
    return result;
  } catch (error) {
    console.error(`Failed to update meetingone for TaskTracker ${id}. Error: ${error.message}`);
    throw error;
  }
};

export const updateMeetingtwo = async (id, newMeeetingtwo) => {
  try {
    console.log(
      `Request to update meetingtwo for TaskTracker ${id}: New value = ${newMeeetingtwo}`
    );

    const response = await fetch(`${baseURL}/task-trackers/update-trackers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ meetingtwo: newMeeetingtwo }),
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();
    console.log(`Response from server: ${JSON.stringify(result)}`);

    if (!response.ok) {
      throw new Error(result.message || 'Error updating meetingtwo');
    }

    console.log(`Successfully updated meetingtwo for TaskTracker ${id}.`);
    return result;
  } catch (error) {
    console.error(`Failed to update meetingtwo for TaskTracker ${id}. Error: ${error.message}`);
    throw error;
  }
};

export const updateLink = async (id, newLink) => {
  try {
    console.log(`Request to update link for TaskTracker ${id}: New value = ${newLink}`);

    const response = await fetch(`${baseURL}/task-trackers/update-trackers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ link: newLink }),
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();
    console.log(`Response from server: ${JSON.stringify(result)}`);

    if (!response.ok) {
      throw new Error(result.message || 'Error updating link');
    }

    console.log(`Successfully updated link for TaskTracker ${id}.`);
    return result;
  } catch (error) {
    console.error(`Failed to update link for TaskTracker ${id}. Error: ${error.message}`);
    throw error;
  }
};

export const updateOwner = async (id, newOwner) => {
  try {
    console.log(`Request to update owner for TaskTracker ${id}: New value = ${newOwner}`);

    const response = await fetch(`${baseURL}/task-trackers/update-trackers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ owner: newOwner }),
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();
    console.log(`Response from server: ${JSON.stringify(result)}`);

    if (!response.ok) {
      throw new Error(result.message || 'Error updating owner');
    }

    console.log(`Successfully updated owner for TaskTracker ${id}.`);
    return result;
  } catch (error) {
    console.error(`Failed to update owner for TaskTracker ${id}. Error: ${error.message}`);
    throw error;
  }
};

export const updateProjectName = async (id, newProjectName) => {
  try {
    console.log(
      `Request to update projectName for TaskTracker ${id}: New value = ${newProjectName}`
    );

    const response = await fetch(`${baseURL}/task-trackers/update-trackers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ projectName: newProjectName }),
      headers: { 'Content-Type': 'application/json' },
    });

    console.log(`HTTP Status: ${response.status}`);

    if (!response.ok) {
      const errorResult = await response.text(); // Read response as text
      console.error(`Server Error: ${errorResult}`);
      throw new Error(`Error updating projectName: ${errorResult}`);
    }

    const result = await response.json();
    console.log(`Response from server: ${JSON.stringify(result)}`);

    return result;
  } catch (error) {
    console.error(`Failed to update projectName for TaskTracker ${id}. Error: ${error.message}`);
    return null;
  }
};

export const createTaskTracker = async (taskData) => {
  try {
    console.log('Sending data to create task tracker:', JSON.stringify(taskData, null, 2));

    const response = await fetch(`${baseURL}/task-trackers/create-trackers`, {
      method: 'POST',
      body: JSON.stringify(taskData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Failed to create task tracker:', result.message || 'Unknown error');
      throw new Error(result.message || 'Failed to create task tracker');
    }

    console.log('Task tracker created successfully:', result);

    return result;
  } catch (error) {
    console.error('Error creating task tracker:', error);
    throw error;
  }
};

export const updateStatus = async (id, newStatus) => {
  try {
    // Log ค่า id และ newStatus ก่อนที่จะส่งคำขอ
    console.log(`Sending request to update status for ID: ${id}, with status: ${newStatus}`);

    // ส่งคำขอ HTTP ไปยัง API ที่ backend
    const response = await fetch(`${baseURL}/task-trackers/update-trackers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ statusId: newStatus }), // เปลี่ยนจาก status เป็น statusId
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();

    // Log ผลลัพธ์ของคำขอ
    if (response.ok) {
      console.log('Response from backend:', result);
      return result; // ส่งผลลัพธ์กลับหลังจากอัปเดตสำเร็จ
    }
    console.error('Failed to update status:', result.message);
    throw new Error(result.message || 'Error updating status');
  } catch (error) {
    console.error('Error updating status:', error);
    throw error; // แสดงข้อผิดพลาด
  }
};

export const updatePriority = async (id, newPriority) => {
  try {
    // Log ค่า id และ newStatus ก่อนที่จะส่งคำขอ
    console.log(`Sending request to update priority for ID: ${id}, with status: ${newPriority}`);

    // ส่งคำขอ HTTP ไปยัง API ที่ backend
    const response = await fetch(`${baseURL}/task-trackers/update-trackers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ priorityId: newPriority }), // เปลี่ยนจาก status เป็น statusId
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.json();

    // Log ผลลัพธ์ของคำขอ
    if (response.ok) {
      console.log('Response from backend:', result);
      return result; // ส่งผลลัพธ์กลับหลังจากอัปเดตสำเร็จ
    }
    console.error('Failed to update priority:', result.message);
    throw new Error(result.message || 'Error updating priority');
  } catch (error) {
    console.error('Error updating priority:', error);
    throw error; // แสดงข้อผิดพลาด
  }
};

// export const fetchTeams = async () => {
//   try {
//     const response = await fetch(`${baseURL}/teams//all-teams`); // Replace with actual URL
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching teams:', error);
//     return []; // Return empty array in case of an error
//   }
// };
