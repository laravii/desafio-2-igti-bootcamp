let inputSearch = document.querySelector('#names');
let checkbox = document.getElementsByName('language');
let radios = document.getElementsByName('and-or-all');

let totalDevs = 0;

let allDev = [];
let allDevsSelected = [];

let searchNameState = '';
let checkboxLangsState = ['Java', 'JavaScript', 'Python'];
let radiosState = 'or';

window.addEventListener(
  'load',
  (start = () => {
    fetching();
  })
);

async function fetching() {
  const res = await fetch('http://localhost:3001/devs');
  const json = await res.json();
  allDev = json.map((dev) => {
    const { name, picture, programmingLanguages } = dev;

    return {
      name: name,
      img: picture,
      lang: programmingLanguages,
    };
  });
  allDevsSelected = allDev;
  render();
}

const render = () => {
  searchBarListener();
  radioListener();
  checkboxListener();
  initialStates();
  devCount();
  frontDevs();
};

const searchBarListener = () => {
  inputSearch.addEventListener(
    'input',
    (searchingPerNames = (e) => {
      let types = e.target.value.trim().toLowerCase();
      searchNameState = types;
      applyFilter(searchNameState, checkboxLangsState, radiosState);
      frontDevs();
      devCount();
    })
  );
};

const checkboxListener = () => {
  checkbox.forEach((element) => {
    element.addEventListener('change', (e) => {
      if (e.target.checked === true) {
        const filted = checkboxLangsState.filter(
          (str) => str == e.target.value
        );

        const hasThisLanguage = filted.length == 0;
        if (hasThisLanguage) {
          checkboxLangsState.push(e.target.value);
        }
      } else {
        checkboxLangsState = checkboxLangsState.filter(
          (checkedItem) => checkedItem !== e.target.value
        );
      }
      applyFilter(searchNameState, checkboxLangsState, radiosState);
      frontDevs();
      devCount();
    });
  });
};

const radioListener = () => {
  radios.forEach((element) => {
    element.addEventListener('change', (e) => {
      if (e.target.checked) {
        radiosState = e.target.value;
        applyFilter(searchNameState, checkboxLangsState, radiosState);
        frontDevs();
        devCount();
      }
    });
  });
};

const applyFilter = (seachName, checkedList, radio) => {
  allDevsSelected = allDev.filter((dev) => {
    const hasName = dev.name.toLowerCase().includes(seachName);

    const hasOr =
      dev.lang.filter((l) => checkedList.includes(l.language)).length > 0;

    const hasDev = dev.lang
      .map((l) => l.language)
      .sort()
      .toString();
    const hasChecked = checkedList.sort().toString();
    const hasAnd = hasDev == hasChecked;

    if (radio == 'or') {
      return hasName && hasOr;
    } else {
      return hasName && hasAnd;
    }
  });
};

const initialStates = () => {
  inputSearch.value = '';
  for (var i = 0; i < checkbox.length; i++) {
    checkbox[i].checked = true;
  }
  radios[0].checked = true;
};

const devCount = () => {
  const count = document.querySelector('#devs-total');
  count.innerHTML = `${allDevsSelected.length}`;
};

const frontDevs = () => {
  const frontComeResultHere = document.querySelector('#result-container');
  const devsCard = allDevsSelected.map((dev) => {
    const { name, img, lang } = dev;
    const devCard = `
    <div class="grid-dev">
      <img class-"profile-image" src="${img}" alt="foto de ${name}"/>
      <div class="infos-dev">
        <p>${name}</p>
        <div class="lang-dev">
          ${lang
            .map((l) => {
              const { language } = l;
              const devLanguage = `<img src="./img/${language}.png"/>`;
              return devLanguage;
            })
            .join('')}
        </div>
      </div>
    </div>
    `;
    return devCard;
  });
  const devCardContainer = `<div class='container-dev-flex'>
  <div id="container-devs">${devsCard.join('')}</div>
  </div>
  `;
  frontComeResultHere.innerHTML = devCardContainer;
};
