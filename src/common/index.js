/**
 * @description checks if the item to be saved already exists in the oldClips
 * @param {Object} oldClips  an object containing all initially saved clips
 * @param {String} newClip   the trimmed string to be added to MultiClip
 */
const checkClipExist = (oldClips, newClip) => {
  const clips = Object.keys(oldClips);
  return clips.every(key => oldClips[key] !== newClip);
};

const defaultSettings = {
  date: new Date().getUTCDay(),
  delay: 7,
  theme: 'light',
  language: 'en',
  autoSave: 'no',
};

/**
 * @description saves string to MultiClip storage
 * @param {String} text string to be saved
 */
const saveToClips = text => {
  chrome.storage.sync.get('clips', items => {
    const allClips = items.clips;
    const clipExist = typeof allClips === 'object';
    const itemToClip = text.trim();
    const itemToClipIsValid = itemToClip !== '';
    if (clipExist && itemToClipIsValid && checkClipExist(items.clips, text)) {
      const maxId = Math.max(...Object.keys(allClips));
      const clips = {
        ...items.clips,
        [maxId + 1]: itemToClip,
      };
      chrome.storage.sync.set({ clips });
    } else if (!clipExist && itemToClipIsValid) {
      const clips = { 1: text };
      chrome.storage.sync.set({ clips });
    }
  });
};

/**
 * @description sets the badge on the extension icon
 * @param {Number} number the integer value to be displayed on the badge
 */
const showBadge = number => {
  chrome.browserAction.setBadgeText({ text: `${number}` });
};


/**
 * @description navigates to specified URL on a new tab
 * @param {String} URL the link(url) to be navigated to
 */
const navigateTo = URL => {
  chrome.tabs.create({ url: URL });
};

export {
  checkClipExist,
  defaultSettings,
  saveToClips,
  showBadge,
  navigateTo
};
