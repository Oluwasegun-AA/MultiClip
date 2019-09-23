const defaultSettings = {
  delay: 7,
  theme: 'light',
  autoSave: 'no'
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('clips', item => {
    const memoryLength = Object.keys(item).length;
    const badge =
      memoryLength > 0 && item['clips']
        ? chrome.browserAction.setBadgeText({
            text: `${Object.keys(item['clips']).length}`,
          })
        : chrome.browserAction.setBadgeText({ text: '' });
  });
  chrome.storage.sync.get('settings', item => {
    if (Object.keys(item).length === 0)
      chrome.storage.sync.set({ settings: defaultSettings });
  });
  chrome.browserAction.setBadgeBackgroundColor({ color: '#4688F1' });
  chrome.storage.onChanged.addListener(() => {
    // chrome.runtime.reload();
  });
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

// attach listeners
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const { menuItemId } = info;
  MenuClickManager[menuItemId](info, tab);
});

class MenuClickManager {
  static selection = info => {
    const { selectionText } = info;
    chrome.storage.sync.get('clips', items => {
      console.log('here', items['clips']);
      if (typeof items['clips'] === 'object') {
        const clips = {
          ...items['clips'],
          [Object.keys(items['clips']).length + 1]: selectionText,
        };
        chrome.storage.sync.set({ clips: clips });
      } else {
        chrome.storage.sync.set({ clips: { 1: selectionText } });
      }
    });
  };
  static page = () => {
    console.log('heloooooo');
  };
  static lightTheme = () => {
    return chrome.storage.sync.get('settings', item => {
      let settings = { ...items['settings'], theme: 'light' };
      chrome.storage.sync.set({ settings: settings });
    });
  };
  static darkTheme = () => {
    return chrome.storage.sync.get('settings', item => {
      let settings = { ...items['settings'], theme: 'dark' };
      chrome.storage.sync.set({ settings: settings });
    });
  };
  static deleteItems = () => {};
  static clearClippedItems = () => {
    return chrome.storage.sync.remove('clips');
  };
}

function updateClipboard(newClip) {
  // window.focus();
  console.log(document.hasFocus());
  navigator.clipboard
    .writeText(newClip)
    .then(() => {
      console.log('Text copied.');
    })
    .catch(e => {
      console.log('Failed to copy text.', e);
    });
}

//document.execCommand("paste")
// navigator.clipboard.readText().then(text => outputElem.innerText = text);  - readtext from clipboard
//chrome.clipboard.onClipboardDataChanged.addListener(function callback)
