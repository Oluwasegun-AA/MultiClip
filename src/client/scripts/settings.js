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
const elements = selectAll(
  '.bugReport, .restoreDefault, .backBtn, .options, .settings, .tag'
);
const footerWithHeader = selectAll('.footer, .header');

const translateMenu = selectAll(
  '.settings, .note, .noteText, .bugReport, .saveButton, .restoreDefault, .no1, .no2, .no3, .no4, .no5, .no6, .no7, .no8, .no9, .no0, .dark, .light, .yes, .no'
);

const getI18nValue = field => chrome.i18n.getMessage(field);

translateMenu.forEach(btn => {
  const { className } = btn;
  btn.innerHTML = getI18nValue(className);
});

const initializeValues = values => {
  delay.value = values.delay;
  theme.value = values.theme;
  autoSave.value = values.autoSave;
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

chrome.storage.sync.get('settings', items => {
  initializeValues(items.settings);
  initializeTheme(items.settings.theme);
});

const getNewSettings = () => {
  const delayOptions = delay.options;
  const selectedDelay = delay.selectedIndex;
  const themeOptions = theme.options;
  const selectedTheme = theme.selectedIndex;
  const autoSaveOptions = autoSave.options;
  const selectedAutoSave = autoSave.selectedIndex;
  const newDelay = parseInt(delayOptions[selectedDelay].value, 10);
  const newSettings = {
    date: newDelay > 0 ? new Date().getUTCDay() : '',
    delay: newDelay,
    theme: themeOptions[selectedTheme].value,
    autoSave: autoSaveOptions[selectedAutoSave].value,
  };
  return newSettings;
};

saveBtn.addEventListener('click', () => {
  chrome.storage.sync.set({ settings: getNewSettings() }, () => {
    chrome.storage.sync.get('settings', items => {
      initializeTheme(items.settings.theme);
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
  if (autoSave.selectedIndex === 0) {
    warningDiv.style.display = 'block';
  } else {
    warningDiv.style.display = 'none';
  }
});
