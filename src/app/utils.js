import { saveToClips, navigateTo } from '../common/index';

/**
 * @description sets the theme of the app
 * @param {String} value theme value to be set
 */
const setTheme = (value) => {
  chrome.storage.sync.get('settings', items => {
    const settings = { ...items['settings'], theme: value };
    chrome.storage.sync.set({ settings });
  });
};

/**
 * @description Manages click events on contextMenu items
 */
class ContextMenuManager {
  static selection(info) {
    const { selectionText } = info;
    saveToClips(selectionText);
  }

  static page() {
    navigateTo('https://github.com/Oluwasegun-AA/MultiClip');
  }

  static lightTheme() {
    return setTheme('light');
  }

  static darkTheme() {
    return setTheme('dark');
  }

  static deleteItems() {}

  static clearClippedItems() {
    return chrome.storage.sync.remove('clips');
  }
}

export default ContextMenuManager;
