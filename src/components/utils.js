export const formatDate = (utcDate) => {
  const day = new Date(utcDate).getDate();

  const month = new Date(utcDate).getMonth();

  const year = new Date(utcDate).getFullYear();
  return `${day}/${month}/${year}`;
};
