import { saveToClips, navigateTo } from '../common/index';

const setTheme = (value) => {
  chrome.storage.sync.get('settings', items => {
    const settings = { ...items['settings'], theme: value };
    chrome.storage.sync.set({ settings });
  });
};

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
