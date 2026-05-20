const savedUser = JSON.parse(localStorage.getItem("sonderUser") || "null");
const welcomeUser = document.querySelector("#welcomeUser");
const logoutBtn = document.querySelector("#logoutBtn");

if (savedUser && welcomeUser) {
  welcomeUser.textContent = `Hi, ${savedUser.name}`;
}

logoutBtn?.addEventListener("click", () => {
  if (confirm("Do you want to logout?")) {
    localStorage.removeItem("sonderUser");
    window.location.href = "./login.html";
  }
});


// Dark / Light mode
const themeToggle = document.querySelector("#themeToggle");
const savedTheme = localStorage.getItem("sonderTheme") || "light";

if (savedTheme === "dark") {
  document.body.classList.add("dark-theme");
  if (themeToggle) themeToggle.textContent = "Light Mode";
}

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  const isDark = document.body.classList.contains("dark-theme");
  localStorage.setItem("sonderTheme", isDark ? "dark" : "light");
  themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
});

const playlists = [
  { id: 1, title: "Deep Focus Flow", artist: "Sonder Radio", cover: "assets/album1.jpg", category: "study", mood: "calm", minutes: 45, rating: 4.9, tags: ["instrumental", "lofi", "calm"], description: "Instrumental focus music for coding, notes and long study blocks." },
  { id: 2, title: "Exam Sprint Beats", artist: "Sonder Beats", cover: "assets/album2.jpg", category: "study", mood: "energetic", minutes: 30, rating: 4.7, tags: ["beats", "fast", "revision"], description: "Faster beats for quick revision sessions and deadline energy." },
  { id: 3, title: "Gym Hype Mode", artist: "Pulse Club", cover: "assets/album3.jpg", category: "workout", mood: "high", minutes: 50, rating: 4.8, tags: ["pop", "power", "cardio"], description: "High energy tracks for workouts, walks and confidence boosts." },
  { id: 4, title: "Soft Reset", artist: "Luna Grey", cover: "assets/album4.jpg", category: "relax", mood: "peaceful", minutes: 38, rating: 4.6, tags: ["soft", "acoustic", "night"], description: "Calmer music for relaxing after classes or before sleep." },
  { id: 5, title: "Metro Window Seat", artist: "Nova Lane", cover: "assets/album5.jpg", category: "travel", mood: "dreamy", minutes: 42, rating: 4.5, tags: ["indie", "travel", "dreamy"], description: "Indie travel vibes for bus rides and main-character walks." },
  { id: 6, title: "Clean Room Reset", artist: "Mira Sol", cover: "assets/album6.jpg", category: "relax", mood: "fresh", minutes: 28, rating: 4.4, tags: ["fresh", "pop", "chill"], description: "Light music for cleaning your room and resetting your mood." }
];

const tips = [
  "Match your playlist with your mood before you start listening.",
  "Use calm music for reading and stronger beats for breaks.",
  "Create a go-to playlist so you do not waste time scrolling.",
  "Try instrumental tracks when you need deep focus.",
  "Switch playlists when your energy changes."
];

const statsArea = document.querySelector("#statsArea");
const playlistGrid = document.querySelector("#playlistGrid");
const filterBar = document.querySelector("#filterBar");
const searchBox = document.querySelector("#searchBox");
const sortSelect = document.querySelector("#sortSelect");
const template = document.querySelector("#playlistTemplate");
const openHelp = document.querySelector("#openHelp");
const moodForm = document.querySelector("#moodForm");
const activity = document.querySelector("#activity");
const energy = document.querySelector("#energy");
const energyValue = document.querySelector("#energyValue");
const keyword = document.querySelector("#keyword");
const formError = document.querySelector("#formError");
const recommendation = document.querySelector("#recommendation");
const browserInfo = document.querySelector("#browserInfo");
const pageInfo = document.querySelector("#pageInfo");
const dailyTip = document.querySelector("#dailyTip");
const newTip = document.querySelector("#newTip");
const libraryTotal = document.querySelector("#libraryTotal");

function createCounter(start = 0) {
  let count = start;
  return function increase() {
    count += 1;
    return count;
  };
}

const recommendationCounter = createCounter();

function getCoverGradient(category) {
  const gradients = {
    study: "linear-gradient(135deg, #1f8ec3, #10131c)",
    workout: "linear-gradient(135deg, #d36a14, #111111)",
    relax: "linear-gradient(135deg, #efe1db, #6b8f71)",
    travel: "linear-gradient(135deg, #7f0f12, #f0a126)"
  };
  return gradients[category] || gradients.study;
}

function renderStats() {
  const totalMinutes = playlists.reduce((sum, item) => sum + item.minutes, 0);
  const topRated = playlists.reduce((best, item) => item.rating > best.rating ? item : best, playlists[0]);

  const stats = [
    ["6", "playlists"],
    [String(totalMinutes), "music minutes"],
    [topRated.rating.toFixed(1), "top rating"]
  ];

  statsArea.innerHTML = stats.map(([number, label]) => `
    <div class="stat">
      <strong>${number}</strong>
      <span>${label}</span>
    </div>
  `).join("");
}

function getFilteredPlaylists() {
  const activeChip = document.querySelector(".chip.active");
  const activeFilter = activeChip?.dataset.filter || "all";
  const searchTerm = searchBox.value.trim().toLowerCase();

  let result = [...playlists];

  if (activeFilter !== "all") {
    result = result.filter((playlist) => playlist.category === activeFilter);
  }

  if (searchTerm) {
    result = result.filter((playlist) => {
      return playlist.title.toLowerCase().includes(searchTerm) ||
        playlist.mood.toLowerCase().includes(searchTerm) ||
        playlist.tags.join(" ").toLowerCase().includes(searchTerm);
    });
  }

  if (sortSelect.value === "rating") {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sortSelect.value === "minutes") {
    result.sort((a, b) => a.minutes - b.minutes);
  } else {
    result.sort((a, b) => a.title.localeCompare(b.title));
  }

  return result;
}

function renderPlaylists() {
  playlistGrid.innerHTML = "";
  const filtered = getFilteredPlaylists();

  filtered.forEach((playlist) => {
    const clone = template.content.cloneNode(true);
    const card = clone.querySelector(".playlist-card");
    const title = clone.querySelector(".card-title");
    const desc = clone.querySelector(".card-desc");
    const rating = clone.querySelector(".rating");
    const tags = clone.querySelector(".tags");
    const button = clone.querySelector(".play-btn");
    const cover = clone.querySelector(".cover-art");

    card.dataset.id = playlist.id;
    title.textContent = playlist.title;
    desc.textContent = playlist.description;
    rating.textContent = `★ ${playlist.rating}`;
    if (playlist.cover) {
      cover.innerHTML = `<img class="cover-img" src="${playlist.cover}" alt="${playlist.title} cover">`;
    } else {
      cover.style.background = getCoverGradient(playlist.category);
    }

    playlist.tags.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = tag;
      tags.appendChild(span);
    });

    button.textContent = `Open playlist • ${playlist.minutes} min • ${playlist.mood}`;
    playlistGrid.appendChild(clone);
  });

  libraryTotal.textContent = `${filtered.length} playlist(s) shown`;
}

filterBar.addEventListener("click", (event) => {
  const chip = event.target.closest(".chip");
  if (!chip) return;

  document.querySelectorAll(".chip").forEach((item) => item.classList.remove("active"));
  chip.classList.add("active");
  renderPlaylists();
});

playlistGrid.addEventListener("click", (event) => {
  const card = event.target.closest(".playlist-card");
  if (!card) return;

  const id = Number(card.dataset.id);
  window.open(`playlist.html?id=${id}`, "_blank");
});

searchBox.addEventListener("input", renderPlaylists);
sortSelect.addEventListener("change", renderPlaylists);

openHelp.addEventListener("click", () => {
  alert("Login, find your vibe, open playlist dashboards, and explore music by mood.");
});

moodForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formError.textContent = "";

  if (!activity.value) {
    formError.textContent = "Please select an activity first.";
    return;
  }

  const chosen = recommendPlaylist(activity.value, Number(energy.value), keyword.value);
  const count = recommendationCounter();

  recommendation.innerHTML = `
    <h3>${chosen.title}</h3>
    <p>${chosen.description}</p>
    <p class="muted">Category: ${chosen.category} • Mood: ${chosen.mood} • Duration: ${chosen.minutes} minutes</p>
    <p class="muted">Recommendations generated in this visit: ${count}</p>
    <button class="btn btn--primary" onclick="window.open('playlist.html?id=${chosen.id}', '_blank')">Open this playlist</button>
  `;
});

energy.addEventListener("input", () => {
  energyValue.textContent = energy.value;
});

function recommendPlaylist(selectedActivity, selectedEnergy, word) {
  let matches = playlists.filter((playlist) => playlist.category === selectedActivity);

  if (word.trim()) {
    const term = word.trim().toLowerCase();
    const keywordMatches = matches.filter((playlist) => playlist.tags.includes(term) || playlist.mood.includes(term));
    if (keywordMatches.length > 0) matches = keywordMatches;
  }

  if (selectedEnergy >= 7) {
    return matches.sort((a, b) => b.rating - a.rating)[0];
  }

  return matches.sort((a, b) => a.minutes - b.minutes)[0];
}

function loadBrowserInfo() {
  browserInfo.textContent = `Listening on: ${navigator.platform}. Language: ${navigator.language}.`;
  pageInfo.textContent = `Current music page: ${location.href}`;
}

function fakeDelay(callback) {
  setTimeout(callback, 450);
}

function getTipWithPromise() {
  return new Promise((resolve) => {
    fakeDelay(() => {
      const randomIndex = Math.floor(Math.random() * tips.length);
      resolve(tips[randomIndex]);
    });
  });
}

async function showTip() {
  dailyTip.textContent = "Loading tip...";
  try {
    const tip = await getTipWithPromise();
    dailyTip.textContent = tip;
  } catch (error) {
    dailyTip.textContent = "Could not load tip.";
  }
}

newTip.addEventListener("click", showTip);


renderStats();
renderPlaylists();
loadBrowserInfo();
showTip();

console.table(playlists);
