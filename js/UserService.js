import { getRandomInt } from './utilities.js';

const baseUrl = 'https://randomuser.me/api'
export default class UserService {
  constructor(url) {
    this.url = url || baseUrl;
  }  

  /**
   * Converts a JSON response into a user object.
   * @param {String} json The JSON response.
   * @returns {Object} The user object.
   */
  #toUser(json) {
    return {
      id: json.id.value,
      lastName : json.name?.last,
      firstName : json.name?.first,
      email: json.email,
      photo: json.picture.medium,
      title: this.#getRandomTitle(json),
      socialMedia: this.#getRandomSocialMedia(json),
      followers: [ ],
    };
  }

  /**
   * Randomly generate or retrieve a job title for a user.
   * @param {String} json The JSON response.
   */
  #getRandomTitle(json) {
    const titles = [ 
      'Marketing Coordinator',
      'Medical Assistant',
      'Web Designer',
      'Dog Trainer',
      'President of Sales',
      'Nursing Assistant',
      'Project Manager',
      'Librarian',
      'Project Manager',
      'Account Executive',
    ];
    return titles[getRandomInt(titles.length)];
  }

  /**
   * Randomly generated social media links.
   * @param {String} json The JSON response.
   */
  #getRandomSocialMedia(json) {
    return [ 
      getRandomInt(2) === 1 ? { type: 'facebook', value: `${ json.username }` } : null,
      getRandomInt(2) === 1 ? { type: 'twitter', value: `#${ json.username }` } : null,
      getRandomInt(2) === 1 ? { type: 'skype', value: `${ json.phone }` } : null,
    ].filter(f => f != null);
  }

  /**
   * Retrieves a random user from the external endpoint.
   * @returns {Object} The user information.
   */
  async get() {
    const url = `${ baseUrl }`;
    console.debug(`Requesting data from url: ${ url }`);
    const response = await fetch(url);
    if (response.status === 200) {
      const json = await response.json();
      return this.#toUser(json.results[0]);  
    }

    console.error(`Failed to retrieve data from url: ${ url }. Status(${ response.status }): ${ response.text }`);
    return null;
  }
}