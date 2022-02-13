import { defaultSettings, showBadge } from '../common/index';
import ContextMenuManager from './utils';

// attach listeners
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const { menuItemId } = info;
  ContextMenuManager[menuItemId](info, tab);
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('clips', item => {
    const memoryLength = Object.keys(item).length;
    if (memoryLength > 0 && item['clips']) {
      showBadge(`${Object.keys(item['clips']).length}`);
    } else {
      showBadge('');
    }
  });
  chrome.storage.sync.get('settings', item => {
    if (Object.keys(item).length === 0) chrome.storage.sync.set({ settings: defaultSettings });
  });
  chrome.action.setBadgeBackgroundColor({ color: '#4688F1' });
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

