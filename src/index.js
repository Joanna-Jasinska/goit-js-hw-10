import './css/styles.css';
import { _ } from 'lodash';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

console.log('updated 11:07 22.03.2023');

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');
let lastNotification = 'noNotification';
let loadingTimer = 0;

export const fetchData = (url, resolve, reject) => {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        if (response.status == 404) {
          return { empty: 1 };
        } else {
          // reject({ error: response.status });
          throw new Error(response.status);
        }
      }
      return response.json();
    })
    .then(data => {
      resolve({ data: data });
    })
    .catch(error => {
      reject({ error: error });
      // throw new Error(error);
    });
};

const logError = ({ error }) => {
  clearTimeout(loadingTimer);
  lastNotification = 'serverError';
  console.log(error);
  Notify.failure('We are sorry. \nRequest has been denied by the server.', {
    timeout: 3000,
    showOnlyTheLastOne: true,
  });
  // throw new Error(error);
};

const displayData = ({ data }) => {
  console.log('checking acquired data');
  console.log(data);
  if (data.empty) {
    clearTimeout(loadingTimer);
    if (lastNotification != 'notFound') {
      lastNotification = 'notFound';
      list.innerHTML = '';
      info.innerHTML = '';
      Notify.failure('Oops, there is no country with that name', {
        timeout: 3000,
        showOnlyTheLastOne: true,
      });
    }
    return;
  }

  // Data handling
  if (data.length > 10) {
    clearTimeout(loadingTimer);
    if (lastNotification == 'tooMany') return;
    lastNotification = 'tooMany';
    list.innerHTML = '';
    info.innerHTML = '';
    Notify.info('Too many matches found. Please enter a more specific name.', {
      timeout: 3000,
      showOnlyTheLastOne: true,
    });
    return;
  }
  if (data.length == 1) {
    lastNotification = 'loaded';
    clearTimeout(loadingTimer);
    Notify.info('Loaded country information.', {
      timeout: 3000,
      showOnlyTheLastOne: true,
    });
    renderCountryInfo(data[0]);
    return;
  }
  lastNotification = 'loaded';
  clearTimeout(loadingTimer);
  Notify.info('Loaded list of countries', {
    timeout: 3000,
    showOnlyTheLastOne: true,
  });
  renderCountryList([...data]);
};

const refreshDataRequest = () => {
  return _.debounce(
    e => {
      let txt = input.value.trim();
      if (txt) {
        console.log('will fetch: ' + txt);
        clearTimeout(loadingTimer);
        if (lastNotification != 'loading') {
          loadingTimer = setTimeout(() => {
            lastNotification = 'loading';
            Notify.info('Loading data..', {
              timeout: 999000,
              showOnlyTheLastOne: true,
            });
          }, 1000);
        }
        fetchCountries(txt, displayData, logError);
      } else {
        list.innerHTML = '';
        info.innerHTML = '';
      }
    },
    DEBOUNCE_DELAY,
    [
      {
        leading: false,
        trailing: true,
      },
    ]
  );
};

const renderCountryInfo = country => {
  list.innerHTML = '';
  let lang = Array.isArray(Object.values(country.languages))
    ? [...Object.values(country.languages)].join(', ')
    : country.languages;
  const markup = `
          <h1><div class='flag' style='background-image: url(${country.flags.svg})'></div>
          <span class='officialName'>${country.name.official}</span></h1>
          <p class='capital'><b>Capital: </b>${country.capital}</p>
          <p class='population'><b>Population: </b>${country.population}</p>
          <p class='languages'><b>Languages: </b>${lang}</p>
       `;
  info.innerHTML = markup;
};

const renderCountryList = countryList => {
  info.innerHTML = '';
  const markup = countryList
    .map(country => {
      return `<li>
          <div class='flag' style='background-image: url(${country.flags.svg})'></div>
          <div class='name'>${country.name.official}</div>
        </li>`;
    })
    .join('');
  list.innerHTML = markup;
  const countryDivs = document.querySelectorAll('.country-list .name');
  for (const div of countryDivs) {
    div.addEventListener('click', e => {
      e.preventDefault();
      input.value = div.innerHTML;
      let txt = input.value.trim();
      if (txt) {
        console.log('will fetch: ' + txt);
        clearTimeout(loadingTimer);
        if (lastNotification != 'loading') {
          loadingTimer = setTimeout(() => {
            lastNotification = 'loading';
            Notify.info('Loading data..', {
              timeout: 999000,
              showOnlyTheLastOne: true,
            });
          }, 1000);
        }
        fetchCountries(txt, displayData, logError);
      }
    });
  }
};

input.addEventListener('input', refreshDataRequest());
