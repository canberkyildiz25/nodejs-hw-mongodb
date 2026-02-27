export const parseFilterParams = (query) => {
  const filter = {};

  if (typeof query.isFavourite !== 'undefined') {
    filter.isFavourite = String(query.isFavourite) === 'true';
  }

  if (query.contactType) {
    filter.contactType = query.contactType;
  }

  if (query.name) {
    // case-insensitive partial match
    filter.name = { $regex: query.name, $options: 'i' };
  }

  return filter;
};
