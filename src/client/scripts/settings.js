import {
  initializeTheme,
  defaultSettings,
  navigateTo,
} from '../../common/index';

import setI18Value from './utils';

const select = document.querySelector.bind(document);
const selectAll = document.querySelectorAll.bind(document);
const delay = select('#delay');
const theme = select('#theme');
const autoSave = select('#autoSave');
const saveBtn = select('.saveButton');
const lang = select('#lang');
const hi = select('#hi');
const saveDiv = select('.saveDiv');
const warningDiv = select('.warningDiv');
const restoreDefault = select('.restoreDefault');
const bugReport = select('.bugReport');
const documentBody = select('body');
const elements = selectAll(
  '.bugReport, .restoreDefault, .backBtn, .options, .settings, .tag'
);
const footerWithHeader = selectAll('.footer, .header');

const translateMenu = selectAll(
  '.settings, .note, .noteText, .bugReport, .saveButton, .restoreDefault, .no1, .no2, .no3, .no4, .no5, .no6, .no7, .no8, .no9, .no0, .dark, .light, .yes, .no'
);

// language translations objects
const language = {
  english: {
    Language: 'welcome'
  },
  french: {
    Language: 'lingua'
  }
};

translateMenu.forEach(btn => {
  setI18Value(btn);
});

const initializeValues = values => {
  delay.value = values.delay;
  theme.value = values.theme;
  autoSave.value = values.autoSave;
};

// define language via window hash
lang.addEventListener('change', () => {
  if (window.location.hash) {
    if (window.location.hash === '#french') {
      console.log(language.french.Language);
      hi.textContent = language.french.Language;
      return hi.textContent;
    }
  }
});

chrome.storage.sync.get('settings', items => {
  const { theme } = items.settings;
  initializeValues(items.settings);
  initializeTheme(theme, documentBody, footerWithHeader, elements);
});

const getNewSettings = () => {
  const delayOptions = delay.options;
  const selectedDelay = delay.selectedIndex;
  const themeOptions = theme.options;
  const selectedTheme = theme.selectedIndex;
  const autoSaveOptions = autoSave.options;
  const newLanguage = hi.textContent;
  const selectedAutoSave = autoSave.selectedIndex;
  const newDelay = parseInt(delayOptions[selectedDelay].value, 10);
  const newSettings = {
    date: newDelay > 0 ? new Date().getUTCDay() : '',
    delay: newDelay,
    language: newLanguage,
    theme: themeOptions[selectedTheme].value,
    autoSave: autoSaveOptions[selectedAutoSave].value,
  };
  console.log(newSettings);
  return newSettings;
};

saveBtn.addEventListener('click', () => {
  chrome.storage.sync.set({ settings: getNewSettings() }, () => {
    chrome.storage.sync.get('settings', items => {
      const { theme } = items.settings;
      initializeTheme(theme, documentBody, footerWithHeader, elements);
    });
  });
  saveDiv.style.display = 'none';
  warningDiv.style.display = 'none';
});

selectAll('select').forEach(select => {
  select.addEventListener('change', () => {
    saveDiv.style.display = 'block';
  });
});

restoreDefault.addEventListener('click', () => {
  initializeValues(defaultSettings);
  saveDiv.style.display = 'block';
});

bugReport.addEventListener('click', () => {
  navigateTo('https://github.com/Oluwasegun-AA/MultiClip/issues');
});

autoSave.addEventListener('change', () => {
  if (autoSave.selectedIndex === 0) {
    warningDiv.style.display = 'block';
  } else {
    warningDiv.style.display = 'none';
  }
});
