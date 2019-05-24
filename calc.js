document.addEventListener('DOMContentLoaded', main);

var classname = document.getElementsByClassName("button");
var chunks    = [{type: 'value', value: 0}];

function main() { // Adds a listener to all 'buttons'
  for (var i = 0; i < classname.length; i++) {
    classname[i].addEventListener('click', x => eventHandler(x), false);
  }
}

function eventHandler(element) { // Takes events and pushes their type and value to chunks[]
  const eventAction = element.target.dataset.action;
  const eventValue  = parseInt(element.target.dataset.value);
  if (!eventAction) { // Value event
    if(chunks[chunks.length-1].value === 0) chunks[0].value = String(eventValue); // If chunks 0, replace value
    else {
      if(chunks[chunks.length-1].type === 'action') { // If last was action, create new chunk
        chunks.push({type: 'value', value: String(eventValue)});
      }
      else {
        chunks[chunks.length-1].value += eventValue;
      }
    } 
  }
  else { // Action event
    if (chunks[chunks.length-1].type === 'action') {
      if (eventAction === "ans") {
        chunks.push({type:'value', value: document.getElementById("as").innerHTML})
      }
      else chunks.pop();
    }
    else {
      if (eventAction === 'equals') calculate();
      else if (eventAction === "ans") chunks[chunks.length-1].value += document.getElementById("as").innerHTML;
      else chunks.push({type:'action', value: eventAction}); // Otherwise new chunk
    }
  }
  if(eventAction != 'equals') document.getElementById("ws").innerHTML = translate(); // Display formatted chunks
}

function translate() { // Shows a nice string using innerHTML
  var workString = "";
  for(let i = 0; i < chunks.length; i++) { // Loop through all chunks
    if (chunks[i].type === 'value') workString += chunks[i].value; // If Chunk is value type, add value
    else { // If chunk is an action type, add operator
      switch(chunks[i].value) { // Switch case
        case 'divide': workString += '÷'; break;
        case 'mult':   workString += '×'; break;
        case 'add':    workString += '+'; break;
        case 'minus':  workString += '-'; break;
        case 'clear':
          chunks = [{type:'value', value: 0}];
          workString = 0;
          break;
      }
    }
  }
  return workString;
}

function calculate() {
  var concatArr = chunks.map(a => Object.assign({}, a)); // Deeper copy, pain in the asssss
  var currentIndex = 0, chunkValue = 0;
  while(concatArr.length > 2) { 
    console.log(concatArr);
    currentIndex = 0;
    chunkValue   = 0;
    for (let i = 0; i < concatArr.length; i++) { // loop through and find next action
      if(concatArr[i].type == 'action') {
        currentIndex = i;
        break;
      }
    }
    if(concatArr[currentIndex].value == "mult") chunkValue = String(concatArr[currentIndex-1].value * concatArr[currentIndex+1].value);
    if(concatArr[currentIndex].value == "add") chunkValue = String(concatArr[currentIndex-1].value + concatArr[currentIndex+1].value);
    if(concatArr[currentIndex].value == "minus") chunkValue = String(concatArr[currentIndex-1].value - concatArr[currentIndex+1].value);
    if(concatArr[currentIndex].value == "divide") chunkValue = String(concatArr[currentIndex-1].value / concatArr[currentIndex+1].value);
    concatArr[currentIndex-1].value = chunkValue;
    concatArr.splice(currentIndex, 2);
  }
  chunks = [{type:'value', value: 0}];
  document.getElementById("as").innerHTML = concatArr[0].value;
}

