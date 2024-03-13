import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [apiData, setApiData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  function changePageDescription(gameId) {
    navigate(`/PageDetail/${gameId}`);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      let url = `https://api.rawg.io/api/games?key=${
        import.meta.env.VITE_API_KEY
      }&dates=2024-01-01,2024-12-31&page_size=15`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      setApiData(data.results);
    } catch (error) {
      console.error("Error fetching API data:", error);
    }
  }
  async function fetchSearchData(term) {
    try {
      let url = `https://api.rawg.io/api/games?key=${
        import.meta.env.VITE_API_KEY
      }&search=${encodeURIComponent(term)}&page_size=1`;
      const response = await fetch(url);
      const data = await response.json();
      setApiData(data.results);
    } catch (error) {
      console.error("Error fetching API search data:", error);
    }
  }

  function handleSearchChange(event) {
    const term = event.target.value;
    setSearchTerm(term);
    if (term.trim() === "") {
      fetchData();
    } else {
      fetchSearchData(term);
    }
  }

  function GetGamePlatform(platforms) {
    if (!platforms || platforms.length === 0) {
      return null;
    }

    const platformLogos = {
      playstation: "src/logo/ps.svg",
      playstation4: "src/logo/ps4.svg",
      playstation5: "src/logo/ps5.svg",
      xbox: "src/logo/xbox.svg",
      "xbox-one": "src/logo/xbox_one.svg",
      "xbox-series-x": "src/logo/xbox_series_x_logo.svg",
      "nintendo-switch": "src/logo/switch.svg",
      pc: "src/logo/windows.svg",
      ios: "src/logo/mobile.svg",
      nintendo: "src/logo/nintendo.svg",
      mac: "src/logo/apple.svg",
      macos: "src/logo/macos.svg",
      linux: "src/logo/linux.svg",
      android: "src/logo/android.svg",
    };

    const existingPlatforms = new Set();
    platforms.forEach((platform) => {
      existingPlatforms.add(platform.platform.slug);
      if (platform.parent_platforms) {
        platform.parent_platforms.forEach((parent) => {
          existingPlatforms.add(parent.platform.slug);
        });
      }
    });

    const platformElements = Array.from(existingPlatforms).map(
      (platform, index) => (
        <img
          key={index}
          className="icon h-10 "
          src={platformLogos[platform]}
          alt={platform}
        />
      )
    );

    return platformElements;
  }

  function filteredGames() {
    if (!apiData) return [];
    if (!searchTerm.trim()) return apiData;

    return apiData.filter((game) =>
      game.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  function changeSizeAndColor(descriptionButton) {
    descriptionButton.classList.add("text-xl", "text-red-500");
    descriptionButton.addEventListener("mouseleave", function () {
      descriptionButton.classList.remove("text-xl", "text-red-500");
    });
  }

  return (
    <>
      <div className="input flex justify-center bg-slate-600 mt-4 mb-6">
        <input
          className="placeholder-black bg-gray-400 flex justify-center"
          type="text"
          placeholder="               entrer nom de jeu"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[0.25rem] mt-6">
        {filteredGames().map((game) => (
          <div
            key={game.id}
            className="flex flex-col bg-gray-800 text-white rounded overflow-hidden"
          >
            <h3 className="text-xl font-bold mb-2 p-4">{game.name}</h3>
            <img
              src={game.background_image}
              alt={game.name}
              className="w-full h-96 object-cover"
            />
            <button
              className="description"
              onClick={() => changePageDescription(game.id)}
              onMouseOver={(event) => changeSizeAndColor(event.target)}
              onMouseOut={(event) => changeSizeAndColor(event.target)}
            >
              Description
            </button>

            <div className="genres flex flex-row">
              {game.genres.map((genre, index) => (
                <div key={index} className="text-gray-300 p-4">
                  {genre.name}
                </div>
              ))}
            </div>

            <div className="icon flex flex-row space-x-4">
              {GetGamePlatform(game.platforms)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}