const ALLOWED_SORT = ["name", "category", "createdAt", "location"];

function parseSearchParams(query) {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit) || 10, 1), 50);

  const sortBy = ALLOWED_SORT.includes(query.sortBy)
    ? query.sortBy
    : "createdAt";
  const order = query.order === "asc" ? 1 : -1;

  const toArray = (v) =>
    v
      ? String(v)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  return {
    q: (query.q || "").trim(),
    categories: toArray(query.category),
    statuses: toArray(query.status),
    locations: toArray(query.location),
    availableFrom: query.availableFrom ? new Date(query.availableFrom) : null,
    availableTo: query.availableTo ? new Date(query.availableTo) : null,
    page,
    limit,
    sortBy,
    order,
  };
}

module.exports = { parseSearchParams };
