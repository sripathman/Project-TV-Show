function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  setupSearch(allEpisodes);
  setupEpisodeSelect(allEpisodes);
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

  displayEpisodeCount(episodeList.length, getAllEpisodes().length);
}

function padNumber(number) {
  return number.toString().padStart(2, "0");
}

function displayEpisodeCount(displayed, total) {
  const displayCount = document.getElementById("displayCount");
  displayCount.textContent = `Displaying ${displayed} / ${total} episodes`;
}

function setupSearch(allEpisodes) {
  const searchInput = document.querySelector("[data-search]");
  searchInput.addEventListener("input", (e) => {
    const selectElement = document.getElementById("episodeSelector");
    selectElement.value = "default";

    const value = e.target.value.toLowerCase();

    let episodesToDisplay = allEpisodes.filter((episode) => {
      const isVisible =
        episode.name.toLowerCase().includes(value) ||
        episode.summary.toLowerCase().includes(value);
      return isVisible;
    });

    makePageForEpisodes(episodesToDisplay);
  });
}

function setupEpisodeSelect(allEpisodes) {
  const selectElement = document.createElement("select");
  selectElement.id = "episodeSelector";

  const selectElementLabel = document.createElement("label");
  selectElementLabel.setAttribute("for", "episodeSelector");
  selectElementLabel.textContent = "Please select an episode";

  const episodeSelectorWrapper =
    document.getElementsByClassName("episode-selector")[0];
  episodeSelectorWrapper.appendChild(selectElementLabel);
  episodeSelectorWrapper.appendChild(selectElement);

  selectElement.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "default";
  defaultOption.textContent = "All episodes";
  selectElement.appendChild(defaultOption);

  allEpisodes.forEach((episode) => {
    let seasonNum = episode.season < 10 ? `0${episode.season}` : season.number;
    let episodeNum =
      episode.number < 10 ? `0${episode.number}` : episode.number;
    let episodeName = episode.name;

    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `S${seasonNum} E${episodeNum} - ${episodeName}`;
    selectElement.appendChild(option);
  });

  selectElement.addEventListener("change", (e) => {
    const searchInput = document.querySelector("[data-search]");
    searchInput.value = "";
    const selectedEpisodeId = e.target.value;
    let episodesToDisplay;
    if (selectedEpisodeId === "default") {
      episodesToDisplay = allEpisodes;
    } else {
      episodesToDisplay = allEpisodes.filter(
        (ep) => ep.id == selectedEpisodeId
      );
    }
    makePageForEpisodes(episodesToDisplay);
  });
}

window.onload = setup;
