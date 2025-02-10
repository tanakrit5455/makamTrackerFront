import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------
const baseURL = CONFIG.site.serverUrl;

// สร้าง Instance ของ Axios สำหรับใช้ในคำขอเฉพาะ Case
const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // กำหนด ngrok header
  },
});

// จัดการ Response และ Error
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error?.response?.data || 'Something went wrong!')
);

// Service สำหรับการจัดการ Case โดยเฉพาะ
export const caseService = {
  fetchCases: () => axiosInstance.get('/receive_case'), // ดึงข้อมูล Case ทั้งหมด
  fetchCaseById: (id) => axiosInstance.get(`/receive_case/${id}`), // ดึงข้อมูล Case โดยใช้ ID
  postCase: (data) => axiosInstance.post('/receive_case', data), // สร้าง Case ใหม่
  putCase: (id, data) => axiosInstance.put(`/receive_case/${id}`, data), // อัปเดต Case
  deleteCase: (id) => axiosInstance.delete(`/receive_case/${id}`), // ลบ Case
  fetchCaseWithDetails: () => axiosInstance.get('/receive_case'), // ดึงข้อมูล Case พร้อม Join รายละเอียด
};

export default caseService;
