const stringToSearchableValues = (value: string): string[] => {
  return typeof value === 'string' ? value.split(',') : value;
};

export default stringToSearchableValues;
