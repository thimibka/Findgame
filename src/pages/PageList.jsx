export const PageList = (argument = "") => {
  // console.log("pageliste",argument);
};
function getAPIDescriptionHome(idGame) {
  return `https://api.rawg.io/api/games/${idGame}?key=${process.env.VITE_API_KEY}`;
}