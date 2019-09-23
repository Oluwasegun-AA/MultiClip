const select = document.querySelector.bind(document);
const selectAll = document.querySelectorAll.bind(document);
const delay = select('#delay');
const theme = select('#theme');
const autoSave = select('#autoSave');
const saveBtn = select('.saveButton');
const saveDiv = select('.saveDiv');
const restoreDefault = select('.restoreDefault');
const bugReport = select('.bugReport');

chrome.storage.sync.get('settings', items => {
  initializeValues(items['settings']);
});

saveBtn.addEventListener('click', e => {
  chrome.storage.sync.set({ settings: getNewSettings() });
  saveDiv.style.display = 'none';
});

const getNewSettings = () => {
  const delayOptions = delay.options;
  const selectedDelay = delay.selectedIndex;
  const themeOptions = theme.options;
  const selectedTheme = theme.selectedIndex;
  const autoSaveOptions = autoSave.options;
  const selectedAutoSave = autoSave.selectedIndex;
  const newDelay = parseInt(delayOptions[selectedDelay].value)
  const newSettings = {
    date: newDelay > 0 ? new Date().getUTCDay() : '',
    delay: newDelay,
    theme: themeOptions[selectedTheme].value,
    autoSave: autoSaveOptions[selectedAutoSave].value,
  };
  return newSettings;
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
