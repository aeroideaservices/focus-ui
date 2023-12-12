/**
 * Helper method for elements creation
 *
 * @param {string} tagName - name of creating element
 * @param {string|string[]} [classNames] - list of CSS classes to add
 * @param {object} [attributes] - object with attributes to add
 * @returns {HTMLElement}
 */
export const make = (tagName, classNames = undefined, attributes = {}) => {
  const el = document.createElement(tagName);

  if (Array.isArray(classNames)) {
    el.classList.add(...classNames);
  } else if (classNames) {
    el.classList.add(classNames);
  }

  for (const attrName in attributes) {
    if (attrName === 'data') {
      for (const dataName in attributes[attrName]) {
        el.dataset[dataName] = attributes[attrName][dataName];
      }
    } else {
      el[attrName] = attributes[attrName];
    }
  }

  return el;
};
