// utils.js

export const convertToThaiDate = (dateString) => {
    const months = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
  
    // ตรวจสอบว่าค่า dateString เป็นวันที่ที่ถูกต้องหรือไม่
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return ''; // ถ้าวันที่ไม่ถูกต้องให้คืนค่าว่าง
    }
  
    // แปลงเป็นวันที่ไทย
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear() + 543; // เพิ่ม 543 ปีเพื่อให้เป็นปีไทย
  
    return `${day} ${month} ${year}`;
  };
  