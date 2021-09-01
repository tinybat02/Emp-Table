const generateColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);

export const processData = (
  buffer: { hash_id: string; polygon: string; hour: number }[],
  persistColor: { [key: string]: string }
) => {
  const hours = buffer.map(item => item.hour);
  const begin = Math.min(...hours);
  const end = Math.max(...hours);

  const keys = Array(end - begin + 1)
    .fill(0)
    .map((_, idx) => begin + idx);

  const template = keys.reduce((obj: { [key: string]: number | null | string }, value) => {
    obj[value] = null;
    obj[`${value}Color`] = '#fff';
    return obj;
  }, {});

  const all_hash: { [key: string]: { [key: string]: number | string } } = {};
  const polygonLabels: string[] = [];
  const hashColors: { [key: string]: string } = { ...persistColor };

  buffer.map(item => {
    if (!all_hash[item.hash_id]) all_hash[item.hash_id] = { ...template, id: item.hash_id };

    let assignedColor = hashColors[item.polygon] || '#fff';
    if (!polygonLabels.includes(item.polygon)) {
      polygonLabels.push(item.polygon);
      if (!hashColors[item.polygon]) {
        assignedColor = generateColor();
        hashColors[item.polygon] = assignedColor;
      }
    }

    const index = polygonLabels.findIndex(v => v == item.polygon);

    all_hash[item.hash_id][item.hour] = index;
    all_hash[item.hash_id][`${item.hour}Color`] = assignedColor;
  });

  const data = Object.values(all_hash);

  return { data, keys, persistColor: hashColors };
};
