const select = document.querySelector.bind(document);

let changeColor = document.getElementById('changeColor');

//  changeColor.onclick = function(element) {
//     let color = element.target.value;
//     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//       chrome.tabs.executeScript(
//           tabs[0].id,
//           {code: 'document.body.style.backgroundColor = "' + color + '";'});
//     });
//   };

//   chrome.storage.sync.get('color', function(data) {
//     changeColor.style.backgroundColor = data.color;
//     changeColor.setAttribute('value', data.color);
//   });


  //check incognito
  // function saveTabData(tab) {
  //   if (tab.incognito) {
  //     return;
  //   } else {
  //     chrome.storage.local.set({data: tab.url});
  //   }
  // }


  //print
  // chrome.tabs.executeScript(
  //   tab.id,
  //   {code: 'window.print();'});


  //dark mode
  // function click(e) {
  //   chrome.tabs.executeScript(null,
  //       {code:"document.body.style.backgroundColor='" + e.target.id + "'"});
  //   window.close();
  // }
  // document.addEventListener('DOMContentLoaded', function () {
  //   var divs = document.querySelectorAll('div');
  //   for (var i = 0; i < divs.length; i++) {
  //     divs[i].addEventListener('click', click);
  //   }
  // });


  // on command recieved
  // chrome.commands.onCommand.addListener(function(command) {
  //   console.log('onCommand event received for message: ', command);
  // });
  

  // Dictionary
  // API = 	https://od-api.oxforddictionaries.com/api/v2
//   var Dictionary = require("oxford-dictionary-api");
// var app_id = "your oxford-account app id"; === 	fc5c14ed
// var app_key = "your oxford-account app key"; === e92ccc2953bcb956518a30193d94119f
// var dict = new Dictionary(app_id, app_key);
// dict.find("ace",function(error,data){if(error) return console.log(error); console.log(data); });


select('.prompt').addEventListener('click', ()=>{
  console.log('hello')
  const instruction = select('.copyPrompt');
  const editor = select('.clipText')
  instruction.style.display = 'none';
  editor.style.display = 'block';
  editor.focus();
})


select('.clipText').addEventListener('keypress', (e)=>{
  const {keyCode, shiftKey} = e;
  console.log(e)
  const editor = select('.clipText')
  if (keyCode === 13 && (shiftKey !== true)) {
    e.preventDefault();
   const content = editor.value;
   alert(content)
   editor.value = '';
  }
});