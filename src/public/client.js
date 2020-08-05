let store = Immutable.Map({
  user: Immutable.Map({ name: "Kyle" }),
  apod: "",
  roverData: "",
  link: "",
  rover: "",
  loading: true,
});

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
  store = store.merge(newState);
  render(root, store);
};

const render = async (root, state) => {
  root.innerHTML = App(state);
};

// Component Helpers

const createHeader = () => {
  return `
      <header>
      <ul class="li-container">
        <li>
          <button class="list-button" onclick="setLink('APOD')">
            Astronomy Picture of The Day
          </button>
        </li>
        <li>
          <button class="list-button" onclick="setLink('rover')">
            Mars Rover Photos
          </button>
        </li>
      </ul>
    </header>
  `;
};

function createRoverLinks() {
  return `<nav>
  <ul class="li-container">
    <li>
      <button class="list-button" onclick="setRover('curiosity')">
        Curiosity
      </button>
    </li>
    <li>
      <button class="list-button" onclick="setRover('opportunity')">
        Opportunity
      </button>
    </li>
    <li>
      <button class="list-button" onclick="setRover('spirit')">
        Spirit
      </button>
    </li>
  </ul>
</nav>`;
}

function createRoverContent(eachRover) {
  // if (store.get("roverData")) {
  return `
    <div class="rover-item">
      <img src="${eachRover.get("img_src")}" class="rover-image" />
      <ul class="rover-info-container">
        <li>Photo ID: ${eachRover.get("id")}</li>
        <li>Landing Date: ${eachRover.get("rover").get("landing_date")}</li>
        <li>Launch Date: ${eachRover.get("rover").get("launch_date")}</li>
        <li>Status: ${eachRover.get("rover").get("status")}</li>
      </ul>
    </div>`;
  // }
}

// create content
const App = (state) => {
  // const apod = state.get("apod");
  console.log("passing to App...");
  if (state.get("link") === "APOD") {
    return `
        ${createHeader()}
        <main>
          ${Greeting(state.get("user").get("name"))}
          <section>
            ${ImageOfTheDay(state.get("apod"))}
          </section>
        </main>
        <footer></footer>
    `;
  } else {
    return `
    ${createHeader()}
    ${createRoverLinks()}
    <h1 class="rover-header">${state.get("rover")}</h1>
    <div class="rover-container">
    ${
      state.get("roverData") &&
      state
        .get("roverData")
        .get("data")
        .get("photos")
        .toArray()
        .slice(0, 10)
        .map((eachRover) => createRoverContent(eachRover))
        .join("")
    }
    </div>`;
  }
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
  render(root, store);
});

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
  if (name) {
    return `
            <h1 class="greeting">Welcome, ${name}!</h1>
        `;
  }

  return `
        <h1 class="greeting">Hello!</h1>
    `;
};

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  // console.log(photodate.getDate(), today.getDate());

  // console.log(photodate.getDate() === today.getDate());
  if (!apod || apod.get("date") === today.getDate()) {
    getImageOfTheDay(store);
  }

  // check if the photo of the day is actually type video!
  if (apod.get("data").get("media_type") === "video") {
    console.log("media type is video");
    return `
            <p>See today's featured video</p> <iframe class="apod" src=${apod
              .get("data")
              .get(
                "url"
              )} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <p>${apod.get("data").get("title")}</p>
            <p>${apod.get("data").get("explanation")}</p>
        `;
  } else {
    console.log("media type is photo");
    return `
            <img class="apod" src="${apod.get("data").get("url")}" />
            <p>${apod.get("data").get("explanation")}</p>
        `;
  }
};

// functions for handling click events
function setLink(link) {
  store = store.set("link", link);
  getImageOfTheDay(store);
}

function setRover(rover) {
  store = store.set("rover", rover);
  getRover(store.get("rover"));
  console.log(`setRover is called`);
  render(root, store);
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
  fetch(`http://localhost:3000/apod`)
    .then((res) => res.json())
    .then((apod) => updateStore(store, { apod }));
};

const getRover = (roverSelected) => {
  fetch(`http://localhost:3000/rover/${roverSelected}`)
    .then((res) => res.json())
    .then((roverData) => {
      console.log(roverData);
      updateStore(store, { roverData });
    });
  // .then((data) => console.log(data));
  // console.log(store.roverData);
};
