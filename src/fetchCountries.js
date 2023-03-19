//
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { renderCountryList } from './index.js';
import { renderCountryInfo } from './index.js';
const web = 'https://restcountries.com/v3.1/name/';
const filters = '?fields=name,capital,population,languages,flags';

const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');
let lastNotification = 'noNotification';
let loadingTimer = 0;

const StopLoadingNotification = () => {
  clearTimeout(loadingTimer);

  //
};

const NotifyAboutLoading = () => {
  if (lastNotification != 'loading') {
    lastNotification = 'loading';
    Notify.info('Loading data..', {
      timeout: 999000,
      showOnlyTheLastOne: true,
    });
  }
  clearTimeout(loadingTimer);
};

export const fetchCountries = name => {
  loadingTimer = setTimeout(NotifyAboutLoading, 1000);

  // Loading.dots('Fetching list of countries');
  // const dummy = {
  //   flags: [
  //     'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Flag_of_Belize.svg/180px-Flag_of_Belize.svg.png',
  //   ],
  //   name: 'dummy',
  // };
  // renderCountryList([dummy]);
  return fetch(`${web + name + filters}`)
    .then(response => {
      // Response handling
      if (!response.ok) {
        if (response.status == 404) {
          if (lastNotification != 'notFound') {
            StopLoadingNotification();
            lastNotification = 'notFound';
            list.innerHTML = '';
            info.innerHTML = '';
            Notify.failure('Oops, there is no country with that name', {
              timeout: 3000,
              showOnlyTheLastOne: true,
            });
            return;
          } else {
            throw new Error(response.status);
          }
        }
      }
      return response.json();
    })
    .then(data => {
      // Data handling
      if (data.length > 10) {
        if (lastNotification == 'tooMany') return;
        if (1) clearTimeout(loadingTimer);
        lastNotification = 'tooMany';
        list.innerHTML = '';
        info.innerHTML = '';
        Notify.info(
          'Too many matches found. Please enter a more specific name.',
          {
            timeout: 3000,
            showOnlyTheLastOne: true,
          }
        );
        return;
      }
      // lastNotification = 'noNotification';
      if (data.length == 1) {
        // Loading.remove();
        lastNotification = 'loaded';
        if (1) clearTimeout(loadingTimer);
        Notify.info('Loaded country information.', {
          timeout: 3000,
          showOnlyTheLastOne: true,
        });
        renderCountryInfo(data[0]);
        return;
      }
      // Loading.remove();
      lastNotification = 'loaded';
      if (1) clearTimeout(loadingTimer);
      Notify.info('Loaded list of countries', {
        timeout: 3000,
        showOnlyTheLastOne: true,
      });
      renderCountryList([...data]);
    })
    .catch(error => {
      // Error handling
      throw new Error(error);
    });
};
