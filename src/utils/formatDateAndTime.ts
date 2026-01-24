export function formatISODate(isoString : string) {
  if (!isoString) return ""; // Handle empty or null input
  const date = new Date(isoString);
  const month = date.getMonth() + 1; // getMonth() is 0-based
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}