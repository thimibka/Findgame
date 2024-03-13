import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function PageDetail() {
  const { gameId } = useParams();
  const [gameDetail, setGameDetail] = useState(null);
  const [movieDataMovie, setMovieDataMovies] = useState(null);
  const [screenDataMovie, setScreenDataMovie] = useState(null);
  const [releasedDate, setReleasedDate] = useState(null);
  const [studioName, setStudioName] = useState(null);
  const [tagsName, setTagsName] = useState(null);
  const [genreGame, setGenreGame] = useState(null);
  const [nameEditor, setNameEditor] = useState(null);
  const [webSite, setWebSite] = useState(null);
  const [moviesGame, setMovieGame] = useState(null);
  const [ratingGame, setRatingGame] = useState(null);
  const [numberRatings, setNumberRatings] = useState(null);
  const [countScreen, setCountScreen] = useState(null);

  useEffect(() => {
    const fetchGameDetail = async () => {
      try {
        const gameDetailResponse = await getDetailGamesData(gameId);
        setGameDetail(gameDetailResponse);

        const movieData = await getDetailGamesMovie(gameId);
        setMovieDataMovies(movieData);

        const screenData = await getDetailGamesScreenshots(gameId);
        setScreenDataMovie(screenData);

        setReleasedDate(gameDetailResponse.released);
        setStudioName(nameInfo(gameDetailResponse.developers));
        setTagsName(nameInfo(gameDetailResponse.tags));
        setGenreGame(nameInfo(gameDetailResponse.genres));
        setNameEditor(nameInfo(gameDetailResponse.publishers));
        setWebSite(gameDetailResponse.website);
        setRatingGame(gameDetailResponse.rating);
        setNumberRatings(gameDetailResponse.ratings.length);
        setMovieGame(getMovieGame(movieData.results));
        setCountScreen(getScreenCount(screenData.results));
      } catch (error) {
        console.error("Error fetching game detail:", error);
      }
    };

    fetchGameDetail();
  }, [gameId]);

  async function getDetailGamesData(idGame) {
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games/${idGame}?key=${
          import.meta.env.VITE_API_KEY
        }`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  async function getDetailGamesMovie(idGame) {
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games/${idGame}/movies?key=${
          import.meta.env.VITE_API_KEY
        }`
      );

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  async function getDetailGamesScreenshots(idGame) {
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games/${idGame}/screenshots?key=${
          import.meta.env.VITE_API_KEY
        }`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  function nameInfo(data) {
    return data.map((element) => element.name).join(", ");
  }

  function getMovieGame(movies) {
    if (movies.length > 0) {
      console.log(movies);
      return (
        <video width="1000" height="500" controls>
          <source src={movies[0].data.max} type="video/mp4" />
        </video>
      );
    } else {
      return "Video unavailable";
    }
  }

  function getScreenCount(screens) {
    return screens
      .slice(0, 4)
      .map((screen, index) => (
        <img
          key={index}
          width="400"
          height="200"
          src={screen.image}
          alt={`Screenshot ${index + 1}`}
        />
      ));
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-center lg:justify-between">
          <div className="lg:w-2/3 lg:mr-4">
            <div className="nameDetail">
              {gameDetail && (
                <h3 className="text-white text-center lg:text-left">
                  {gameDetail.name}
                </h3>
              )}
            </div>
            <div className="text-white ">
              {releasedDate && (
                <div className="releasedDetail">
                  <h3>Release Date</h3>
                  <div>{releasedDate}</div>
                </div>
              )}
              <br />

              {gameDetail && (
                <>
                  <div className="desciptionDetailGame">
                    <h3>Description:</h3>
                  </div>
                  <div className="descriptionDetail">
                    <p>{gameDetail.description}</p>
                  </div>
                </>
              )}

              {studioName && (
                <div className="editorDetail">
                  <h3>Developer</h3>
                  <div>{studioName}</div>
                </div>
              )}
              <br />
              {tagsName && (
                <div className="tagsDetail">
                  <h3>Tags</h3>
                  <div>{tagsName}</div>
                </div>
              )}
              <br />
              {genreGame && (
                <div className="genreDetail">
                  <h3>Genres</h3>
                  <div>{genreGame}</div>
                </div>
              )}
              <br />
              {nameEditor && (
                <div className="editorDetail">
                  <h3>Publisher</h3>
                  <div>{nameEditor}</div>
                </div>
              )}
              <br />
              {webSite && (
                <div className="websiteDetail">
                  <h3>Website</h3>
                  <div>
                    <a href={webSite} target="_blank" rel="noopener noreferrer">
                      {webSite}
                    </a>
                  </div>
                </div>
              )}
              <br />
              {ratingGame && (
                <div className="ratingDetail">
                  <h3>Rating</h3>
                  <div>{ratingGame}</div>
                </div>
              )}
              <br />
              {numberRatings && (
                <div className="ratingsCountDetail">
                  <h3>Number of Ratings</h3>
                  <div>{numberRatings}</div>
                </div>
              )}
            </div>
            <br />
            <div className="lg:w-1/3 mt-6 lg:mt-0">
              <div className="imgandpict">
                <div className="pictureDetail">
                  {gameDetail && (
                    <>
                      <img
                        className="imgDetail w-full"
                        src={gameDetail.background_image}
                        alt={gameDetail.name}
                      />
                    </>
                  )}
                </div>
                <div className="movies">
                  {moviesGame && (
                    <div className="moviesDetail  bg-zinc-950 flex justify-center">
                      <div>{moviesGame}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <br />
            <br />
            <div className="countscreen">
              {countScreen && (
                <div className="screenshotsDetail flex flex-col lg:flex-row space-y-4 lg:space-x-4">
                  {countScreen}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
