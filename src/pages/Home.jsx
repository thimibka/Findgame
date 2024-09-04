import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import android from "../assets/android.svg";
import apple from "../assets/apple.svg";
import linux from "../assets/linux.svg";
import macos from "../assets/macos.svg";
import mobile from "../assets/mobile.svg";
import nintendo from "../assets/nintendo.svg";
import ps from "../assets/ps.svg";
import ps3 from "../assets/ps3.svg";

import ps4 from "../assets/ps4.svg";
import ps5 from "../assets/ps5.svg";
import nswitch from "../assets/nswitch.svg";
import windows from "../assets/windows.svg";
import xbox_one from "../assets/xbox_one.svg";
import xbox_series_x from "../assets/xbox_series_x.svg";
import xbox from "../assets/xbox.svg";
import xbox_360 from "../assets/xbox_360.svg";

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
      let url = `https://api.rawg.io/api/games?key=b5f1e8e939bc4237bc9384c80f98ecb0&dates=2024-01-01,2030-12-31&page_size=50`;
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
      let url = `https://api.rawg.io/api/games?key=b5f1e8e939bc4237bc9384c80f98ecb0&search=${encodeURIComponent(
        term
      )}&page_size=100`;
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
      playstation: ps,
      playstation3: ps3,
      playstation4: ps4,
      playstation5: ps5,
      xbox: xbox,
      xbox360: xbox_360,
      "xbox-one": xbox_one,
      "xbox-series-x": xbox_series_x,
      "nintendo-switch": nswitch,
      pc: windows,
      ios: mobile,
      nintendo: nintendo,
      mac: apple,
      macos: macos,
      linux: linux,
      android: android,
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
          placeholder="                    Search ? "
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
              className="w-full h-auto object-cover"
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
