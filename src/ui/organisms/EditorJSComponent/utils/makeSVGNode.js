export const makeSVGNode = (name, options) => {
  const element = document.createElementNS('http://www.w3.org/2000/svg', name);

  for (let key in options) {
    element.setAttributeNS(null, key, options[key]);
  }

  return element;
};
