export const processData = (buffer: { customer: string; start_hour: number; end_hour: number }[]) => {
  const begin = Math.min(...buffer.map(item => item.start_hour));
  const end = Math.max(...buffer.map(item => item.end_hour));

  const keys = Array(end - begin + 1)
    .fill(0)
    .map((_, idx) => begin + idx);

  const data = buffer.map(item => {
    const obj: { [key: string]: number | string } = { id: item.customer };

    for (let i = begin; i <= end; i++) {
      if (i >= item.start_hour && i <= item.end_hour) obj[i] = 1;
      else obj[i] = 0;
    }

    return obj;
  });

  return { data, keys };
};
