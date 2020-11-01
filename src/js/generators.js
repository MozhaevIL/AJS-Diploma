/**
 * Generates random characters
 *
 * @param allowedTypes iterable of classes
 * @param maxLevel max character level
 * @returns Character type children (ex. Magician, Bowman, etc)
 */

export function characterGenerator(allowedTypes, maxLevel) {
  const level = Math.floor(Math.random() * maxLevel) + 1;
  const CharacterClass = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
  const newCharacter = new CharacterClass(level);
  return newCharacter;
}

export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const generatedTeam = [];
  for (let i = 0; i < characterCount; i += 1) {
    generatedTeam.push(characterGenerator(allowedTypes, maxLevel));
  }
  return generatedTeam;
}
