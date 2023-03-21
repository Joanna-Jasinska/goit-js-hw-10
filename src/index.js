import './css/styles.css';
import { _ } from 'lodash';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

input.addEventListener(
  'input',
  _.debounce(
    e => {
      let txt = input.value.trim();
      if (txt) {
        fetchCountries(txt);
      } else {
        list.innerHTML = '';
        info.innerHTML = '';
      }
    },
    DEBOUNCE_DELAY,
    [
      (options = {
        leading: false,
        trailing: true,
      }),
    ]
  )
);

export const renderCountryInfo = country => {
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

export const renderCountryList = countryList => {
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
      if (txt) fetchCountries(txt);
    });
  }
};

// function createPromise(position, delay) {
//   return new Promise((resolve, reject) => {
//     const shouldResolve = Math.random() > 0.3;
//     setTimeout(
//       () => {
//         if (shouldResolve) {
//           // Fulfill
//           resolve({ position, delay });
//         } else {
//           // Reject
//           reject({ position, delay });
//         }
//       },
//       delay,
//       position
//     );
//   });

// createPromise(i + 1, delay)
//       .then(onSuccess)
//       .catch(onReject);
