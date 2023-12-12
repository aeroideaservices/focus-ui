export interface TTransliterationOptions {
  onlyLower?: boolean;
}

export const transliteration = (str: string, opts?: TTransliterationOptions) => {
  const ru = new Map([
    ['а', 'a'],
    ['б', 'b'],
    ['в', 'v'],
    ['г', 'g'],
    ['д', 'd'],
    ['е', 'e'],
    ['є', 'e'],
    ['ё', 'e'],
    ['ж', 'j'],
    ['з', 'z'],
    ['и', 'i'],
    ['ї', 'yi'],
    ['й', 'i'],
    ['к', 'k'],
    ['л', 'l'],
    ['м', 'm'],
    ['н', 'n'],
    ['о', 'o'],
    ['п', 'p'],
    ['р', 'r'],
    ['с', 's'],
    ['т', 't'],
    ['у', 'u'],
    ['ф', 'f'],
    ['х', 'h'],
    ['ц', 'c'],
    ['ч', 'ch'],
    ['ш', 'sh'],
    ['щ', 'shch'],
    ['ы', 'y'],
    ['э', 'e'],
    ['ю', 'u'],
    ['я', 'ya'],
    [' ', '-'],
  ]);

  str = str.replace(/[^0-9a-zA-Zа-яА-я\-\s]+/g, '');
  str = str.replace(/[ъьЪЬ]+/g, '');

  str = Array.from(str).reduce((acc, letter) => {
    const lowLetter = letter.toLowerCase();
    const en = ru.get(lowLetter) ?? letter;
    const enNormalized =
      lowLetter === letter ? en : opts?.onlyLower ? en.toLowerCase() : en.toUpperCase();
    return acc + enNormalized;
  }, '');

  return str
    .replace(/[\-]+/gi, '-')
    .replace(/^[\-]+/, '')
    .replace(/[\-]+$/, '');
};
