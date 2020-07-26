'use strict';

const getHighlitedMatches = (queryString, string) => {
  let newString = ``;
  const rgxp = new RegExp(`(\\S*)?(` + queryString + `)(\\S*)?`, `ig`);

  if (queryString.trim().length > 0) {
    newString = string.replace(rgxp, (match, $1, $2, $3) => {
      return ($1 || ``) + `<b>` + $2 + `</b>` + ($3 || ``);
    });
  }
  return newString.length !== string.length ? newString : ``;
};

module.exports = {
  getHighlitedMatches,
};
