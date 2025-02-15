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

export const createTaskTracker = async (taskData) => {
  try {
    // แสดงข้อมูลที่จะส่งไปใน log
    console.log('Sending data to create task tracker:', taskData);

    const response = await fetch(`${baseURL}/task-trackers/create-trackers`, {
      method: 'POST',
      body: JSON.stringify(taskData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      // ถ้าการส่งข้อมูลล้มเหลว ให้แสดง error message ใน log
      console.error('Failed to create task tracker:', result.message || 'Unknown error');
      throw new Error(result.message || 'Failed to create task tracker');
    }

    // แสดงข้อมูลที่ได้รับจาก API
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

// export const fetchTeams = async () => {
//   try {
//     const response = await fetch(`${baseURL}/teams//all-teams`); // Replace with actual URL
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching teams:', error);
//     return []; // Return empty array in case of an error
//   }
// };
