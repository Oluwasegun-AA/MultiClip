chrome.runtime.onInstalled.addListener(()=>{
  chrome.storage.sync.set({ color: "#3aa757" }, ()=>{
    console.log("The color is green.");
  });

  // const chromeDeveloperRule = {
  //   conditions: [
  //     new chrome.declarativeContent.PageStateMatcher({
  //       pageUrl: { hostEquals: "developer.chrome.com" }
  //     })
  //   ],
  //   actions: [new chrome.declarativeContent.ShowPageAction()]
  // };

  // chrome.declarativeContent.onPageChanged.removeRules(undefined, ()=>{
  //   chrome.declarativeContent.onPageChanged.addRules([chromeDeveloperRule]);
  // });
  chrome.browserAction.setBadgeText({text: '1'});
  chrome.browserAction.setBadgeBackgroundColor({color: '#4688F1'});
});

/// context menu
const genericOnClick=(info, tab) =>{
  console.log(`item  ${info.menuItemId} was clicked`);
  console.log(`info: ${JSON.stringify(info)}`);
  console.log(`tab: ${JSON.stringify(tab)}`);
}

// Create one test item for each context type.
const contexts = [
  "page_action",
  "browser_action",
  "frame",
  "page",
  "selection",
  "link",
  "editable",
  "image",
  "video",
  "audio"
];
let a = 0;
for (let i in contexts) {
  a += 1;
  const context = contexts[i];
  const title = `Test ${context} menu item`;
  const id = chrome.contextMenus.create({
    id: `${a}`,
    title: title,
    contexts: [context]
  });
}



// Create a parent item and two children.
const parent = chrome.contextMenus.create({
  id: "b",
  title: "Test parent item"
});
chrome.contextMenus.create({ id: "c", title: "First Child", parentId: parent });
chrome.contextMenus.create({
  id: "d",
  title: "Second Child",
  parentId: parent
});



// Create some radio items.
const radioOnClick=(info, tab)=>{
  console.log(
    `radio item ${info.menuItemId} was clicked (previous checked state was ${info.wasChecked})`
  );
}
chrome.contextMenus.create({
  id: "e",
  title: "Radio 1",
  type: "radio"
});
chrome.contextMenus.create({
  id: "f",
  title: "Radio 2",
  type: "radio"
});



// Create some checkbox items.
const checkboxOnClick=(info, tab)=>{
  console.log(JSON.stringify(info));
  console.log(
    `checkbox item ${info.menuItemId} was clicked, state is now: " 
      ${info.checked} (previous state was ${info.wasChecked})`
  );
}
chrome.contextMenus.create({
  id: "g",
  title: "Checkbox1",
  type: "checkbox"
});
chrome.contextMenus.create({
  id: "h",
  title: "Checkbox2",
  type: "checkbox"
});


// attaching listeners
chrome.contextMenus.onClicked.addListener((info, tab)=>{
  if (
    info.menuItemId === "1" ||
    "2" ||
    "3" ||
    "4" ||
    "5" ||
    "6" ||
    "7" ||
    "a" ||
    "b" ||
    "c" ||
    "d"
  ) {
    genericOnClick(info, tab);
  } else if (info.menuItemId === "g" || "h") {
    checkboxOnClick(info, tab);
  } else {
    radioOnClick(info, tab);
  }
});

