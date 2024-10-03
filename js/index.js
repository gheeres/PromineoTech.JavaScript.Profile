const baseUrl = 'https://randomuser.me/api';
class UserService {
  constructor(url) {
    this.url = url || baseUrl;
  }  
}

const service = new UserService();

const profiles = document.querySelector("#profiles");
const addUserButton = document.querySelector('.control-add-user');

/**
 * Handler for fetching a new user / profile and adding to the profile list.
 */
addUserButton.addEventListener('click', (e) => {
});

/**
 * Generic event handler to handle clicks within the profile list.
 */
profiles.addEventListener('click', (e) => {
  // Follow
  if (e.target.classList.contains('js-profile-follow')) {
  }
  // Delete
  if (e.target.classList.contains('js-profile-delete')) {
  }
});

/**
 * Generates a random/psuedo random number from 0 up to the specified maximum value.
 * @param {Number} max The maximum value to generate. 
 * @returns {Number} The random number.
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}