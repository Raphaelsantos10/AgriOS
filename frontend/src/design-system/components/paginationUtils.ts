export function paginationItems(page: number, totalPages: number): Array<number | "ellipsis"> {
  const total = Math.max(1, totalPages);
  const current = Math.min(Math.max(1, page), total);
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const values = new Set([1, total, current - 1, current, current + 1].filter((value) => value >= 1 && value <= total));
  const sorted = [...values].sort((a, b) => a - b);
  const result: Array<number | "ellipsis"> = [];
  sorted.forEach((value, index) => {
    if (index && value - sorted[index - 1] > 1) result.push("ellipsis");
    result.push(value);
  });
  return result;
}
