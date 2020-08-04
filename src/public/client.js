let store = {
  user: { name: "Kyle" },
  apod: "",
  roverData: "",
  link: "",
  rover: "",
  loading: true,
};

// add our markup to the page
const root = document.getElementById("root");

const updateStore = (store, newState) => {
  store = Object.assign(store, newState);
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
  // console.log("createRoverContent is called");
  // console.log("store.roverData is::", store.roverData);
  if (store.roverData) {
    return `
    <div class="rover-item">
      <img src="${eachRover.img_src}" class="rover-image" />
      <ul class="rover-info-container">
        <li>Photo ID: ${eachRover.id}</li>
        <li>Landing Date: ${eachRover.rover.landing_date}</li>
        <li>Launch Date: ${eachRover.rover.launch_date}</li>
        <li>Status: ${eachRover.rover.status}</li>
      </ul>
    </div>`;
  }
}

// create content
const App = (state) => {
  let { rovers, apod } = state;
  if (store.link === "APOD") {
    return `
        ${createHeader()}
        <main>
          ${Greeting(store.user.name)}
          <section>
            ${ImageOfTheDay(apod)}
          </section>
        </main>
        <footer></footer>
    `;
  } else {
    return `
    ${createHeader()}
    ${createRoverLinks()}
    <h1 class="rover-header">${store.rover}</h1>
    <div class="rover-container">
    ${
      store.roverData &&
      store.roverData.data.photos
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
            <h1>Welcome, ${name}!</h1>
        `;
  }

  return `
        <h1>Hello!</h1>
    `;
};

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {
  // If image does not already exist, or it is not from today -- request it again
  const today = new Date();
  const photodate = new Date(apod.date);
  // console.log(photodate.getDate(), today.getDate());

  // console.log(photodate.getDate() === today.getDate());
  if (!apod || apod.date === today.getDate()) {
    getImageOfTheDay(store);
  }

  // check if the photo of the day is actually type video!
  if (apod.data.media_type === "video") {
    console.log("media type is video");
    return `
            <p>See today's featured video</p> <iframe width="560" height="315" src=${apod.data.url} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            <p>${apod.data.title}</p>
            <p>${apod.data.explanation}</p>
        `;
  } else {
    console.log("media type is photo");
    return `
            <img src="${apod.data.url}" height="350px" width="100%" />
            <p>${apod.data.explanation}</p>
        `;
  }
};

// functions for handling click events
function setLink(link) {
  store.link = link;
  render(root, store);
}

function setRover(rover) {
  store.rover = rover;
  getRover(store.rover);
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
    .then((roverData) => updateStore(store, { roverData }));
  // .then((data) => console.log(data));
  // console.log(store.roverData);
};
