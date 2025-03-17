export const getDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};
