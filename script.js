let allShows = null; // Store fetched shows
let currentShowId = null; // Store the ID of the currently selected show
let cachedEpisodes = {}; // Store fetched episodes for each show
let currentEpisodes = null; // Store currently displayed episodes

const showsContainer = document.getElementById("showsContainer");
const episodesContainer = document.getElementById("episodesContainer");
const episodeListContainer = document.getElementById("episodeList");
const showListButton = document.getElementById("showListButton");
const showSearchInput = document.getElementById("showSearchInput");
const episodeSearchInput = document.getElementById("episodeSearchInput");
const episodeSelect = document.getElementById("episodeSelect");
const displayCount = document.getElementById("displayCount");

function setup() {
    showsContainer.innerHTML = "<p>Loading shows, please wait...</p>";
    fetch('https://api.tvmaze.com/shows')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            allShows = data.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            displayShows(allShows);
            setupShowSearch();
        })
        .catch(error => {
            console.error("Error fetching shows:", error);
            showsContainer.innerHTML = "<p class='error'>Error loading shows. Please try again later.</p>";
        });

    showListButton.addEventListener("click", showShowList);
}

function displayShows(shows) {
    showsContainer.innerHTML = "";
    shows.forEach(show => {
        const showCard = document.createElement("div");
        showCard.classList.add("show-card");
        showCard.addEventListener("click", () => handleShowClick(show.id));

        if (show.image && show.image.medium) {
            const img = document.createElement("img");
            img.src = show.image.medium;
            img.alt = show.name;
            showCard.appendChild(img);
        }

        const title = document.createElement("h2");
        title.textContent = show.name;
        showCard.appendChild(title);

        const summary = document.createElement("p");
        summary.innerHTML = show.summary ? show.summary.substring(0, 100) + "..." : "No summary available.";
        showCard.appendChild(summary);

        const genres = document.createElement("p");
        genres.classList.add("genres");
        genres.textContent = `Genres: ${show.genres.join(", ") || "N/A"}`;
        showCard.appendChild(genres);

        const status = document.createElement("p");
        status.textContent = `Status: ${show.status || "N/A"}`;
        showCard.appendChild(status);

        const rating = document.createElement("p");
        rating.classList.add("rating");
        rating.textContent = `Rating: ${show.rating && show.rating.average ? show.rating.average : "N/A"}`;
        showCard.appendChild(rating);

        const runtime = document.createElement("p");
        runtime.textContent = `Runtime: ${show.runtime ? show.runtime + " minutes" : "N/A"}`;
        showCard.appendChild(runtime);

        showsContainer.appendChild(showCard);
    });
}

function handleShowClick(showId) {
    currentShowId = showId;
    showsContainer.style.display = "none";
    episodesContainer.style.display = "block";
    showListButton.style.display = "inline-block";
    episodeListContainer.innerHTML = "<p>Loading episodes, please wait...</p>";
    episodeSelect.innerHTML = '<option value="">All Episodes</option>';
    episodeSearchInput.value = "";

    if (cachedEpisodes[showId]) {
        currentEpisodes = cachedEpisodes[showId];
        makePageForEpisodes(currentEpisodes);
        setupEpisodeSearch(currentEpisodes);
        setupEpisodeSelect(currentEpisodes);
    } else {
        fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                cachedEpisodes[showId] = data;
                currentEpisodes = data;
                makePageForEpisodes(currentEpisodes);
                setupEpisodeSearch(currentEpisodes);
                setupEpisodeSelect(currentEpisodes);
            })
            .catch(error => {
                console.error("Error fetching episodes:", error);
                episodeListContainer.innerHTML = "<p class='error'>Error loading episodes for this show.</p>";
            });
    }
}

function showShowList() {
    showsContainer.style.display = "grid";
    episodesContainer.style.display = "none";
    showListButton.style.display = "none";
    currentShowId = null;
    currentEpisodes = null;
    episodeSearchInput.value = "";
    episodeSelect.value = "";
    displayCount.textContent = "";
}

function makePageForEpisodes(episodeList) {
    episodeListContainer.innerHTML = "";
    episodeList.forEach(episode => {
        const article = document.createElement("article");
        article.classList.add("episode-article");

        const title = document.createElement("h2");
        title.textContent = `${episode.name} - S${padNumber(episode.season)}E${padNumber(episode.number)}`;
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

        episodeListContainer.appendChild(article);
    });
    displayEpisodeCount(episodeList.length, currentEpisodes ? currentEpisodes.length : 0);
}

function padNumber(number) {
    return number.toString().padStart(2, '0');
}

function setupShowSearch() {
    showSearchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredShows = allShows.filter(show => {
            return show.name.toLowerCase().includes(searchTerm) ||
                   show.genres.some(genre => genre.toLowerCase().includes(searchTerm)) ||
                   (show.summary && show.summary.toLowerCase().includes(searchTerm));
        });
        displayShows(filteredShows);
    });
}

function setupEpisodeSearch(episodes) {
    episodeSearchInput.addEventListener("input", (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredEpisodes = episodes.filter(episode => {
            return episode.name.toLowerCase().includes(searchTerm) ||
                   (episode.summary && episode.summary.toLowerCase().includes(searchTerm));
        });
        makePageForEpisodes(filteredEpisodes);
    });
}

function setupEpisodeSelect(episodes) {
    episodeSelect.innerHTML = '<option value="">All Episodes</option>';
    episodes.forEach(episode => {
        const option = document.createElement("option");
        option.value = episode.id;
        option.textContent = `S${padNumber(episode.season)}E${padNumber(episode.number)} - ${episode.name}`;
        episodeSelect.appendChild(option);
    });

    episodeSelect.addEventListener("change", (event) => {
        const selectedId = parseInt(event.target.value);
        if (selectedId) {
            const selectedEpisode = episodes.find(episode => episode.id === selectedId);
            makePageForEpisodes([selectedEpisode]);
        } else {
            makePageForEpisodes(episodes);
        }
    });
}

function displayEpisodeCount(displayed, total){
    displayCount.textContent = `Displaying ${displayed} / ${total} episodes`;
}

window.onload = setup;