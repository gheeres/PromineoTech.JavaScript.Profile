import Profile from './Profile.js';
import UserService from './UserService.js';

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