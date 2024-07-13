export const validIndexesFromSchema = (data: any) => {
  const meta = data?._meta;
  const comp = meta?._completedPaths;
  const keys = Object.keys(data).filter((k) => !k.startsWith("_"));

  let validIndexes = new Set();
  keys.forEach((k) => {
    const arr = data[k];
    if (!Array.isArray(arr)) return;
    if (!data[k] || !data[k][0]) return;
    const arrItemKeys = Object.keys(data[k][0]);

    const res = comp.filter((c) => c[0] === k);

    res.forEach(([_, index]) => {
      if (res.filter(([_, i]) => i === index).length === arrItemKeys.length) {
        console.log({
          resFilter: res.filter(([_, i]) => i === index).length,
          arrItemKeysLength: arrItemKeys.length,
        });
        validIndexes.add(index);
      }
    });
  });
  // console.log({ validIndexes });
  return validIndexes;
};
