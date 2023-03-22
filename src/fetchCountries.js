//
import { fetchData } from './index';

export const fetchCountries = (name, succ, rej) => {
  const web = 'https://restcountries.com/v3.1/name/';
  const filters = '?fields=name,capital,population,languages,flags';
  return fetchData(`${web + name + filters}`, succ, rej);
};
