const baseUrl = 'https://randomuser.me/api'
class UserService {
  constructor(url) {
    this.url = url || baseUrl;
  }  

  /**
   * Converts a JSON response into a user object.
   * @param {String} json The JSON response.
   * @returns {{id: String, lastName: String, firstName: String, email: String, photo: String, title: String, socialMedia: Array, followers: Array}} The user information.
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
   * @returns {String} A random title.
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
   * @returns {Array.<{type: String, value: String}>} An array of social media data.
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
   * @returns {{id: String, lastName: String, firstName: String, email: String, photo: String, title: String, socialMedia: Array, followers: Array}} The user information.
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

const service = new UserService();

const profiles = document.querySelector("#profiles");
const addUserButton = document.querySelector('.control-add-user');
addUserButton.addEventListener('click', async (e) => {
  const user = await service.get();
  if (user) {
    const profile = Profile(user);
    profiles.append(profile);
  }
});

/**
 * Generic event handler to handle clicks within the profile list.
 */
profiles.addEventListener('click', (e) => {
  const element = e.target.closest('.profile');
  // Follow
  if (e.target.classList.contains('js-profile-follow')) {
    profiles.dispatchEvent(new CustomEvent('follow', { 
      detail: {
        originalEvent: e,
        user: JSON.parse(element?.dataset?.user || '{}'),
        element: element,
      }
    }));
  }
  // Delete
  if (e.target.classList.contains('js-profile-delete')) {
    profiles.dispatchEvent(new CustomEvent('delete', { 
      detail: {
        originalEvent: e,
        user: JSON.parse(element?.dataset?.user || '{}'),
        element: element,
      }
    }));
  }
});

/**
 * Custom event handler when a profile/user is followed.
 */
profiles.addEventListener('follow', (e) => {
  const existingUser = e.detail?.user;
  if (existingUser) {
    const updatedUser = { ...existingUser, followers: [ ...existingUser.followers || [], 'another' ] };
    const updatedProfile = Profile(updatedUser);
    if (updatedProfile) {
      const element = e.detail?.element;
      element?.replaceWith(updatedProfile);
    }
  }
});

/**
 * Custom event handler when a profile/user is deleted.
 */
profiles.addEventListener('delete', (e) => {
  const element = e.detail?.element;
  if (element) {
    element?.remove();
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

/**
 * 
 * @param {Object} user The user information
 * @param {String} user.id The unique id of the user.  
 * @param {String} user.lastName The last name of the user.  
 * @param {String} user.firstName The first name of the user.  
 * @param {String} user.email The email address of the user 
 * @param {String} user.photo The url of the photo for the user.
 * @param {String} user.title The title of the user.  
 * @param {Object} user.socialMedia The social media identifiers.
 * @param {Array.<String>} user.followers The count of the number of followers.  
 * @returns {HTMLElement} The HTML element to be rendered.
 */
function Profile(user) {
  const template = document.createElement('template');
  template.innerHTML = `
    <div data-id="${ user.id }" class="profile card">
      <div class="profile-action">
        <i class="bi bi-x text-muted js-profile-delete"></i>
      </div>
      <div class="card-body text-center">
        <div class="mt-3 mb-4">
          <img src="${ user.photo }"
               class="rounded-circle img-fluid" style="width: 100px;" />
        </div>
        <h4 class="mb-2">${ user.lastName || '' }, ${ user.firstName || '' }</h4>
        <p class="text-muted mb-4">
          @${ user.title || '' } <span class="mx-2">|</span> <a href="#!">${ user.email || '' }</a>
        </p>
        <div class="mb-4 pb-2">
          ${
            (user.socialMedia || []).map((socialMedia) => {
              return `<button data-${ socialMedia.type }="${ socialMedia?.value }" type="button" class="btn btn-outline-primary btn-floating">
                        <i class="bi bi-${ socialMedia.type }"></i>
                     </button>`
            }).join('')
          }
        </div>
        <button type="button" class="btn btn-primary position-relative btn-rounded btn-lg js-profile-follow">
          Follow Me 
          <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            ${ user?.followers?.length || 0 } <span class="visually-hidden">followers</span>
          </span>
        </button>
      </div>
    </div>
  `;
  const el = template.content.firstElementChild;
  el.dataset.user = JSON.stringify(user);
  return el;
}