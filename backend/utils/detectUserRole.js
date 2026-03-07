export const detectUserRole = (regNo) => {
  if (!regNo) return "outsider";

  const studentPattern = /^[0-9]{2}[0-9]{2}[A-Z][0-9]{2}[0-9]{2}$/;
  const facultyPattern = /^[A-Z]{2,}[0-9]{2,}$/;

  if (studentPattern.test(regNo)) return "student";
  if (facultyPattern.test(regNo)) return "faculty";

  return "outsider";
};