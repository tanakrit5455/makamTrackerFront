// utils.js
export function formatDateRange(startDate, endDate, createDate) {
  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString('th-TH', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : 'N/A';

  if (startDate && endDate) {
    return `${formatDate(startDate)} → ${formatDate(endDate)}`;
  }
  return formatDate(createDate);
}
