export function calculatePaginationData(query = {}, total = 0) {
  const { page, skip, limit } = query;

  const parsedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const parsedPage = Number(page) > 0 ? Number(page) : 1;
  const parsedSkip = typeof skip !== 'undefined'
    ? Math.max(Number(skip) || 0, 0)
    : (parsedPage - 1) * parsedLimit;

  const pages = Math.max(Math.ceil(total / parsedLimit), 1);

  return {
    page: parsedPage,
    skip: parsedSkip,
    limit: parsedLimit,
    pages,
    total,
  };
}
