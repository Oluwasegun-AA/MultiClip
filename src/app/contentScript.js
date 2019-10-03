import { saveToClips } from '../common/index';

/**
 * @description reads the content of the clipboard
 * @param {Function} callback function to execute after clipboard is copied
 */
const readClipBoard = (callback) => {
  navigator.clipboard
    .readText()
    .then(text => {
      callback(text);
    })
    .catch(e => {
      console.warn(
        'You need to authorize the page to access your clipboard in order to copy to multiClip',
        e
      );
    });
};

/**
 * @description copied item users save to the clipboard if authorized to do so
 */
const copyClipboardItem = () => {
  chrome.storage.sync.get('settings', items => {
    if (items.settings.autoSave === 'yes') {
      return readClipBoard(saveToClips);
    }
  });
};

document.addEventListener('copy', () => {
  copyClipboardItem();
});
