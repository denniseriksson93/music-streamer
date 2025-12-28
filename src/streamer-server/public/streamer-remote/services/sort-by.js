/**
 * @template T
 * @param {T[]} items
 * @param {(item: T) => number | string} getSortBy
 * @param {"ascending" | "descending"} direction
 * @return {T[]}
 */
export const sortBy = (items, getSortBy, direction = "ascending") => {
  if (!items.length) {
    return [];
  }

  const firstItem = items[0];

  if (direction === "ascending") {
    if (firstItem && typeof getSortBy(firstItem) === "number") {
      // @ts-ignore
      return items.sort((a, b) => getSortBy(a) - getSortBy(b));
    }

    return items.sort((a, b) => {
      if (getSortBy(a) < getSortBy(b)) {
        return -1;
      }
      if (getSortBy(a) > getSortBy(b)) {
        return 1;
      }
      return 0;
    });
  }

  if (firstItem && typeof getSortBy(firstItem) === "number") {
    // @ts-ignore
    return items.sort((a, b) => getSortBy(b) - getSortBy(a));
  }

  return items.sort((a, b) => {
    if (getSortBy(b) < getSortBy(a)) {
      return -1;
    }
    if (getSortBy(b) > getSortBy(a)) {
      return 1;
    }
    return 0;
  });
};
