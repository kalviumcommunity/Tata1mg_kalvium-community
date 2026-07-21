import { ListQueryInput } from './validationSchemas';

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

type FilterableRecord = Record<string, unknown>;

export function applyFiltersAndSearch<T extends FilterableRecord>(
  items: T[],
  query?: ListQueryInput
): T[] {
  let filtered = items;

  // Filter by status
  if (query?.status) {
    filtered = filtered.filter((item) => (item.status as string) === query.status);
  }

  // Search by name or email
  if (query?.search) {
    const searchLower = query.search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        (item.name as string | undefined)?.toLowerCase().includes(searchLower) ||
        (item.email as string | undefined)?.toLowerCase().includes(searchLower) ||
        (item.message as string | undefined)?.toLowerCase().includes(searchLower)
    );
  }

  // Sort
  if (query?.sortBy) {
    const sortOrder = query.sortOrder === 'desc' ? -1 : 1;
    filtered.sort((a, b) => {
      const aVal = a[query.sortBy!];
      const bVal = b[query.sortBy!];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * sortOrder;
      }
      return ((aVal as number) > (bVal as number) ? 1 : -1) * sortOrder;
    });
  }

  return filtered;
}

export function paginate<T>(items: T[], page: number = 1, limit: number = 10): PaginationResult<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    data: items.slice(start, end),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
}

export function filterAndPaginate<T extends FilterableRecord>(
  items: T[],
  query?: ListQueryInput
): PaginationResult<T> {
  const filtered = applyFiltersAndSearch(items, query);
  const page = query?.page || 1;
  const limit = query?.limit || 10;
  return paginate(filtered, page, limit);
}
