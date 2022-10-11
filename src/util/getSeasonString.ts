/*
 * getSeasonString.ts
 * author: evan kirkiles
 * created on Tue Oct 11 2022
 * 2022 the nobot space,
 */

const SEASONS = ['Summer', 'Autumn', 'Winter', 'Spring'];

/**
 * Returns a string of the date in terms of the season
 * @param d
 * @returns
 */
export default function getSeasonString(d: Date) {
  return `${
    SEASONS[Math.floor((d.getMonth() / 12) * 4) % 4]
  } ${d.getFullYear()}`;
}
