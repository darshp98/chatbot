/* 
sketch- client side, needs to take input and classify it and output smthng
server- backend comms
classify- takes tweets of queries, puts keywords in json file
 */
var chatInput;
var chatButton;
var machineText;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER);

  chatInput = createInput('What do you love to do?');
  chatInput.size(500);
  chatInput.position((windowWidth/2) - (250), 200);

  chatButton = createButton("Enter");
  chatButton.mousePressed(enteredChat);
  chatButton.position(950,200)

  machineText = createP(); //paragraph tag
  machineText.position(500, 300)

  //set up socket- defined in server but need to also define in index to use here
  socket = io.connect('http://localhost:3000');
  socket.on('guess', makeAGuess); //setup route
  
}

//needs to take 
function enteredChat() {
  var chatText = chatInput.value();

  //need to send data to server (?) - emit has two params: route name (anything u want), data
  socket.emit('guess', chatText);
}

function makeAGuess(data) {
  machineText.html(data);
}

function draw() {
  background(220);
}
