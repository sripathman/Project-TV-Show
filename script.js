//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();

  prepareContainerForEpisodes();
  renderAllEpisodes(allEpisodes);
}

function prepareContainerForEpisodes() {
  let allEpisodes = document.createElement("div");
  allEpisodes.classList = "allEpisodes";

  let root = document.getElementById("root");
  root.appendChild(allEpisodes);
}

function renderOneEpisode(oneEpisode) {
  let episodeCard = document.createElement("div");
  episodeCard.classList = "episodeCard";
  let allEpisodes = document.getElementsByClassName("allEpisodes")[0];

  allEpisodes.appendChild(episodeCard);

  let episodeName = oneEpisode.name;

  let episodeNum = oneEpisode.number;

  let seasonNum = oneEpisode.season;

  let title = document.createElement("h3");

  if (seasonNum < 9) {
    seasonNum = `S0${seasonNum}`;
  } else {
    seasonNum = `S${seasonNum}`;
  }

  if (episodeNum < 10) {
    episodeNum = `E0${episodeNum}`;
  } else {
    episodeNum = `E${episodeNum}`;
  }
  title.textContent = `${episodeName} - ${seasonNum}${episodeNum}`;

  title.classList = "title";

  let episodeImage = oneEpisode.image.medium;
  const image = document.createElement("img");
  image.src = episodeImage;
  image.alt = "cover image of episode";

  let episodeSum = oneEpisode.summary;
  const shortSum = document.createElement("div");
  shortSum.innerHTML = episodeSum;

  episodeCard.appendChild(title);
  episodeCard.appendChild(image);
  episodeCard.appendChild(shortSum);
}

function renderAllEpisodes(episodeList) {
  for (let i = 0; i < episodeList.length; i++) {
    let episode = episodeList[i];
    renderOneEpisode(episode);
  }
  const license = document.createElement("span");
  license.id = "license";
  license.textContent = `All informations taken from the website (https://tvmaze.com/)`;
  root.appendChild(license);
}

window.onload = setup;