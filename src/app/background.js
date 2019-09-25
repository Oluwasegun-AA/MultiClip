import { defaultSettings } from '../common/index';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('clips', item => {
    const memoryLength = Object.keys(item).length;
    if (memoryLength > 0 && item['clips']) {
      chrome.browserAction.setBadgeText({
        text: `${Object.keys(item['clips']).length}`,
      });
    } else {
      chrome.browserAction.setBadgeText({ text: '' });
    }
  });
  chrome.storage.sync.get('settings', item => {
    if (Object.keys(item).length === 0) chrome.storage.sync.set({ settings: defaultSettings });
  });
  chrome.browserAction.setBadgeBackgroundColor({ color: '#4688F1' });
});

// Create contextMenus
chrome.contextMenus.create({
  id: 'selection',
  title: 'Copy to MultiClip',
  contexts: ['selection', 'link', 'image'],
});
chrome.contextMenus.create({
  id: 'page',
  title: 'About MultiClip',
  contexts: ['page', 'browser_action'],
});

chrome.contextMenus.create({
  id: 'clearClippedItems',
  title: 'Clear Clipped Items',
  contexts: ['page', 'browser_action'],
});

const checkClipExist = (oldClips, newClip) => {
  const clips = Object.keys(oldClips);
  return clips.every(key => oldClips[key] !== newClip);
};

class MenuClickManager {
  static selection(info) {
    const { selectionText } = info;
    chrome.storage.sync.get('clips', items => {
      const allClips = items['clips'];
      const clipExist = typeof allClips === 'object';
      const itemToClip = selectionText.trim();
      const itemToClipIsValid = selectionText.trim() !== '';
      if (
        clipExist
        && itemToClipIsValid
        && checkClipExist(allClips, selectionText)
      ) {
        const maxId = Math.max(...Object.keys(allClips));
        const clips = {
          ...items['clips'],
          [maxId + 1]: itemToClip,
        };
        chrome.storage.sync.set({ clips });
      } else if (!clipExist && itemToClipIsValid) {
        chrome.storage.sync.set({ clips: { 1: selectionText } });
      }
    });
  }

  static page() {
    const URL = 'https://github.com/Oluwasegun-AA/MultiClip';
    chrome.tabs.create({ url: URL });
  }

  static lightTheme() {
    return chrome.storage.sync.get('settings', items => {
      const settings = { ...items['settings'], theme: 'light' };
      chrome.storage.sync.set({ settings });
    });
  }

  static darkTheme() {
    return chrome.storage.sync.get('settings', items => {
      const settings = { ...items['settings'], theme: 'dark' };
      chrome.storage.sync.set({ settings });
    });
  }

  static deleteItems() {}

  static clearClippedItems() {
    return chrome.storage.sync.remove('clips');
  }
}

// attach listeners
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const { menuItemId } = info;
  MenuClickManager[menuItemId](info, tab);
});
