export function calculateAge(birthday: string): number { // birthday is a date
  const bday = new Date(birthday);
  const ageDifMs = Date.now() - bday.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}