import { SORT_ORDER } from '../constants/index.js';

const orderToNumber = (ord) => (ord === SORT_ORDER.DESC ? -1 : 1);

export function parseSort(query = {}, allowedFields = []) {
  const { sort, sortBy, order } = query;
  const result = {};

  const isAllowed = (field) => {
    if (!allowedFields || allowedFields.length === 0) return true;
    return allowedFields.includes(field);
  };

  if (sort) {
    // allow comma separated fields, prefix with - for desc
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

  if (sortBy) {
    const ord = orderToNumber(String(order).toLowerCase());
    if (isAllowed(sortBy)) {
      result[sortBy] = ord;
    }
  }

  return result;
}
