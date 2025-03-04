import { CONFIG } from 'src/config-global';

const baseURL = CONFIG.site.serverUrl;

export const fetchAllData = async () => {
  try {
    const [statusesResponse, prioritiesResponse, ownersResponse, teamsResponse] = await Promise.all(
      [
        fetch(`${baseURL}/statuses/all-statuses`, {
          headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        }),
        fetch(`${baseURL}/priorities/getall-priorities`, {
          headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        }),
        fetch(`${baseURL}/owners/getall-owners`, {
          headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        }),
        fetch(`${baseURL}/teams/all-teams`, {
          headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        }),
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
    const response = await fetch(`${baseURL}/task-trackers/getall-trackers`, {
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
    });
    return await response.json();
  } catch (error) {
    return [];
  }
};

export const fetchTaskTrackerWithTeamData = async () => {
  try {
    const response = await fetch(`${baseURL}/task-trackers/getall-trackerWithTeamData`, {
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
    });
    return await response.json();
  } catch (error) {
    return [];
  }
};

export const fetchOwners = async () => {
  try {
    const response = await fetch(`${baseURL}/owners/getall-owners`, {
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
    });
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
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
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
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
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
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
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
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
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
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
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
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
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

export const updateProjectName = async (id, newProjectName) => {
  try {
    console.log(
      `Request to update projectName for TaskTracker ${id}: New value = ${newProjectName}`
    );

    const response = await fetch(`${baseURL}/task-trackers/update-trackers/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ projectName: newProjectName }),
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
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
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
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

export const updateStatuschangeColumn = async (id, status) => {
  try {
    const response = await fetch(`http://localhost:3000/task-trackers/update-trackers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }), // 🔥 ต้องตรวจสอบให้แน่ใจว่า API รองรับฟอร์แมตนี้
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Error updating status: ${error.message}`);
    throw error;
  }
};

export const updateOwner = async (id, newOwnerIds) => {
  try {
    console.log(`Sending request to update owners for ID: ${id}, with owners:`, newOwnerIds);

    const response = await fetch(`${baseURL}/task-trackers/update-trackers/ownerdata/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ownerIds: newOwnerIds }),
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Response from backend:', result);
      return result;
    }
    console.error('Failed to update owners:', result.message || 'Unknown error');
    throw new Error(result.message || 'Error updating owners');
  } catch (error) {
    console.error('Error updating owners:', error);
    if (error.response) {
      console.error('Response error:', error.response.data);
    }
    throw error;
  }
};

// updateTeam function for frontend to update teams for task tracker
export const updateTeam = async (id, newTeamIds) => {
  try {
    console.log(`Sending request to update teams for ID: ${id}, with teams:`, newTeamIds);

    const response = await fetch(`${baseURL}/task-trackers/update-trackers/teamdata/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ teamIds: newTeamIds }), // Use teamIds as an array
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Response from backend:', result);
      return result;
    }

    console.error('Failed to update teams:', result.message);
    throw new Error(result.message || 'Error updating teams');
  } catch (error) {
    console.error('Error updating teams:', error);
    throw error;
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
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
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
export const updateTaskTrackerDate = async (id, startDate, endDate) => {
  try {
    // Log the values of startDate and endDate
    console.log(`startDate: ${startDate}, endDate: ${endDate}`);

    // ตรวจสอบว่า startDate และ endDate มีค่าหรือไม่
    if (!startDate || !endDate) {
      console.error('Start Date or End Date is missing');
      return { success: false, message: 'Start Date or End Date is missing' }; // คืนค่าผลลัพธ์เมื่อไม่ครบข้อมูล
    }

    // Log ค่า id, startDate และ endDate ก่อนที่จะส่งคำขอ
    console.log(`Updating dates for ID: ${id}, Start Date: ${startDate}, End Date: ${endDate}`);

    // ส่งคำขอ HTTP ไปยัง API ที่ backend
    const response = await fetch(`${baseURL}/task-trackers/update-trackers/dates/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ startDate, endDate }),
      headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
    });

    const result = await response.json();

    // Log ผลลัพธ์ของคำขอ
    if (response.ok) {
      console.log('Response from backend:', result);
      return { success: true, data: result }; // คืนค่าผลลัพธ์เมื่อสำเร็จ
    }

    console.error('Failed to update dates:', result.message);
    return { success: false, message: result.message || 'Error updating dates' }; // คืนค่าผลลัพธ์เมื่อเกิดข้อผิดพลาด
  } catch (error) {
    console.error('Error updating dates:', error);
    return { success: false, message: 'Error updating dates' }; // คืนค่าผลลัพธ์เมื่อเกิดข้อผิดพลาด
  }
};

// export const updateDates = async (id, newStartDate, newEndDate) => {
//   try {
//     // ส่งคำขอ HTTP ไปยัง API ที่ backend
//     const response = await fetch(`${baseURL}/task-trackers/update-dates/${id}`, {
//       method: 'PUT', // ใช้ PUT สำหรับอัปเดต
//       body: JSON.stringify({
//         startDate: newStartDate.format('YYYY-MM-DD'), // จัดรูปแบบวันที่ให้เป็น 'YYYY-MM-DD'
//         endDate: newEndDate.format('YYYY-MM-DD'), // จัดรูปแบบวันที่ให้เป็น 'YYYY-MM-DD'
//       }),
//       headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
//     });

//     const result = await response.json();

//     // ถ้าคำขอสำเร็จ
//     if (response.ok) {
//       console.log('Response from backend:', result);
//       return result;
//     }
//     throw new Error(result.message || 'Error updating dates');
//   } catch (error) {
//     console.error('Error updating dates:', error);
//     throw error; // แสดงข้อผิดพลาด
//   }
// };

// export const fetchTeams = async () => {
//   try {
//     const response = await fetch(`${baseURL}/teams//all-teams`); // Replace with actual URL
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching teams:', error);
//     return []; // Return empty array in case of an error
//   }
// };

// export const updateTaskDates = async (id, startDate, endDate) => {
//   const startDateFormatted = formatDate(startDate);
//   const endDateFormatted = formatDate(endDate);

//   console.log(
//     `🔹 Updating Task ${id}: Start Date = ${startDateFormatted}, End Date = ${endDateFormatted}`
//   );

//   try {
//     const response = await fetch(`${baseURL}/task-trackers/update-trackers/${id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
//       body: JSON.stringify({
//         start_date: startDateFormatted,
//         end_date: endDateFormatted,
//       }),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(`❌ Server Error: ${errorText}`);
//     }

//     const result = await response.json();
//     console.log('✅ Task updated successfully:', result);
//     return result;
//   } catch (error) {
//     console.error('❌ Error updating task dates:', error);
//     throw error;
//   }
// };

// export const updateTaskDates = async (id, startDate, endDate) => {
//   try {
//     const response = await fetch(`${baseURL}/task-trackers/update-trackers/${id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         start_date: startDate,
//         end_date: endDate,
//       }),
//     });
//     if (!response.ok) {
//       throw new Error('Failed to update task dates');
//     }
//     const data = await response.json();
//     return data; // จัดการกับข้อมูลที่ได้รับจากการอัปเดต
//   } catch (error) {
//     console.error('Error in updating task:', error);
//     throw error; // ข้อผิดพลาดจะถูกโยนไปยัง frontend เพื่อจัดการ
//   }
// };
