export function parseSort(query = {}, allowedFields = []) {
  const { sort } = query;
  const result = {};

  if (!sort) return result;

  const isAllowed = (field) => {
    if (!allowedFields || allowedFields.length === 0) return true;
    return allowedFields.includes(field);
  };

  sort.split(',').forEach((f) => {
    const field = f.trim();
    if (!field) return;
    if (field.startsWith('-')) {
      const name = field.substring(1);
      if (isAllowed(name)) result[name] = -1;
    } else {
      if (isAllowed(field)) result[field] = 1;
    }
  });

  return result;
}
