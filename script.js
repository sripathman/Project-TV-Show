let allEpisodes = null; // Store fetched episodes here
let onEpisodeChangeHandler;

function setup() {
  const episodeContainer = document.getElementById("episodeContainer");
  episodeContainer.innerHTML = "<p>Loading episodes, please wait...</p>"; // Initial loading message

  fetch("https://api.tvmaze.com/shows")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((allShows) => {
      allShows.sort((a, b) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
      setupShowSelect(allShows);
    });

  fetch("https://api.tvmaze.com/shows/82/episodes")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      allEpisodes = data;
      makePageForEpisodes(allEpisodes);
      setupSearch(allEpisodes);
      setupEpisodeSelect(allEpisodes);
    })
    .catch((error) => {
      console.error("Error fetching episodes:", error);
      episodeContainer.innerHTML =
        "<p class='error'>Error loading episodes. Please try again later.</p>";
    });
}

function makePageForEpisodes(episodeList) {
  const episodeContainer = document.getElementById("episodeContainer");
  episodeContainer.innerHTML = "";

  episodeList.forEach((episode) => {
    const article = document.createElement("article");
    article.classList.add("article");

    const title = document.createElement("h2");
    title.textContent = `${episode.name} - S${padNumber(
      episode.season
    )}E${padNumber(episode.number)}`;
    article.appendChild(title);

    if (episode.image && episode.image.medium) {
      const image = document.createElement("img");
      image.src = episode.image.medium;
      image.alt = episode.name;
      article.appendChild(image);
    }

    const summary = document.createElement("p");
    summary.innerHTML = episode.summary || "No summary available.";
    article.appendChild(summary);

    const episodeLink = document.createElement("a");
    episodeLink.href = episode.url;
    episodeLink.textContent = "View on TVMaze";
    episodeLink.target = "_blank";
    article.appendChild(episodeLink);

    episodeContainer.appendChild(article);
  });

  displayEpisodeCount(episodeList.length, allEpisodes ? allEpisodes.length : 0);
}

function padNumber(number) {
  return number.toString().padStart(2, "0");
}

function setupSearch(episodes) {
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredEpisodes = episodes.filter((episode) => {
      return (
        episode.name.toLowerCase().includes(searchTerm) ||
        (episode.summary && episode.summary.toLowerCase().includes(searchTerm))
      );
    });
    makePageForEpisodes(filteredEpisodes);
  });
}

function handleEpisodeChange(event, episodes) {
  const selectedId = parseInt(event.target.value);

  if (selectedId) {
    const selectedEpisode = episodes.find(
      (episode) => episode.id === selectedId
    );
    makePageForEpisodes([selectedEpisode]);
  } else {
    makePageForEpisodes(episodes);
  }
}

function setupEpisodeSelect(episodes) {
  const episodeSelect = document.getElementById("episodeSelect");
  episodeSelect.innerHTML = "";
  const allEpisodesOption = document.createElement("option");
  allEpisodesOption.value = "default";
  allEpisodesOption.textContent = "All Episodes";
  episodeSelect.appendChild(allEpisodesOption);

  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `S${padNumber(episode.season)}E${padNumber(
      episode.number
    )} - ${episode.name}`;
    episodeSelect.appendChild(option);
  });

  if (onEpisodeChangeHandler) {
    episodeSelect.removeEventListener("change", onEpisodeChangeHandler);
  }

  onEpisodeChangeHandler = function (event) {
    handleEpisodeChange(event, episodes);
  };

  episodeSelect.addEventListener("change", onEpisodeChangeHandler);
}

function setupShowSelect(shows) {
  const showSelect = document.getElementById("showSelect");

  shows.forEach((show) => {
    let showName = show.name;
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = showName;
    showSelect.appendChild(option);
  });

  let showId;

  showSelect.addEventListener("change", (e) => {
    const selectedShowId = e.target.value;
    currentShow = shows.filter((ep) => ep.id == selectedShowId);
    showId = currentShow[0].id;

    fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        allEpisodes = data;
        makePageForEpisodes(allEpisodes);
        setupSearch(allEpisodes);
        setupEpisodeSelect(allEpisodes);
      })
      .catch((error) => {
        console.error("Error fetching episodes:", error);
        episodeContainer.innerHTML =
          "<p class='error'>Error loading episodes. Please try again later.</p>";
      });
  });
}

function displayEpisodeCount(displayed, total) {
  const displayCount = document.getElementById("displayCount");
  displayCount.textContent = `Displaying ${displayed} / ${total} episodes`;
}

window.onload = setup; //DO NOT EDIT THIS FILE
