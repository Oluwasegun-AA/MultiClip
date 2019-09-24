const select = document.querySelector.bind(document);
const selectAll = document.querySelectorAll.bind(document);
const delay = select('#delay');
const theme = select('#theme');
const autoSave = select('#autoSave');
const saveBtn = select('.saveButton');
const saveDiv = select('.saveDiv');
const warningDiv = select('.warningDiv');
const restoreDefault = select('.restoreDefault');
const bugReport = select('.bugReport');
const documentBody = select('body');
const footer = select('.footer');
const elements = selectAll(
  '.bugReport, .restoreDefault, .backBtn, .settings, .tag'
);
const footerWithHeader = selectAll('.footer, .header');

chrome.storage.sync.get('settings', items => {
  initializeValues(items['settings']);
  initializeTheme(items['settings'].theme);
});

saveBtn.addEventListener('click', e => {
  chrome.storage.sync.set({ settings: getNewSettings() }, item => {
    chrome.storage.sync.get('settings', items => {
      initializeTheme(items['settings'].theme);
    });
  });
  saveDiv.style.display = 'none';
});

const getNewSettings = () => {
  const delayOptions = delay.options;
  const selectedDelay = delay.selectedIndex;
  const themeOptions = theme.options;
  const selectedTheme = theme.selectedIndex;
  const autoSaveOptions = autoSave.options;
  const selectedAutoSave = autoSave.selectedIndex;
  const newDelay = parseInt(delayOptions[selectedDelay].value);
  const newSettings = {
    date: newDelay > 0 ? new Date().getUTCDay() : '',
    delay: newDelay,
    theme: themeOptions[selectedTheme].value,
    autoSave: autoSaveOptions[selectedAutoSave].value,
  };
  return newSettings;
};

const initializeTheme = theme => {
  if (theme === 'dark') {
    documentBody.style.backgroundColor = '#2f2d2d';
    documentBody.style.color = '#d6d3d3';
    footerWithHeader.forEach(item => {
      item.style.backgroundColor = '#2f2d2d';
    });
    elements.forEach(view => {
      view.style.backgroundColor = '#2f2d2d';
      view.style.border = 'none';
      view.style.color = '#d6d3d3';
    });
  } else {
    documentBody.style.backgroundColor = 'white';
    documentBody.style.color = 'black';
    footerWithHeader.forEach(item => {
      item.style.backgroundColor = 'white';
    });
    elements.forEach(view => {
      view.style.backgroundColor = 'white';
      view.style.color = 'black';
    });
  }
};

const initializeValues = values => {
  delay.value = values.delay;
  theme.value = values.theme;
  autoSave.value = values.autoSave;
};

selectAll('select').forEach(select => {
  select.addEventListener('change', () => {
    saveDiv.style.display = 'block';
  });
});

restoreDefault.addEventListener('click', () => {
  const defaultSettings = {
    delay: 7,
    theme: 'light',
    autoSave: 'no',
  };
  initializeValues(defaultSettings);
  saveDiv.style.display = 'block';
});

bugReport.addEventListener('click', () => {
  const URL = 'https://github.com/Oluwasegun-AA/MultiClip/issues';
  chrome.tabs.create({ url: URL });
});

autoSave.addEventListener('change', () => {
  warningDiv.style.display = 'block';
});
