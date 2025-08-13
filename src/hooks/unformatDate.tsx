const unformatDate = (dateString: string): Date => {
  // Check if the date string is in the format YYYY-MM-DD
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(dateString)) {
    throw new Error("Invalid date format. Expected format: YYYY-MM-DD");
  }

  return new Date(dateString);
};

export default unformatDate;
