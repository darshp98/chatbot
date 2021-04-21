/* 
sketch- client side, needs to take input and classify it and output smthng
server- backend comms
classify- takes tweets of queries, puts keywords in json file
 */
var chatInput;
var chatButton;
var machineText;
var newInput = 150;
var newInput2 = 190;

function setup() {
  createCanvas(windowWidth, 1000);
  textFont('Courier New');

  chatInput = createInput();
  chatInput.size(500);
  chatInput.position((windowWidth / 2) - (300), 175);

  chatButton = createButton("Enter");
  chatButton.mousePressed(enteredChat);
  chatButton.position(930, 175);

  //set up socket- defined in server but need to also define in index to use here
  socket = io.connect('http://localhost:3000');
  socket.on('guess', makeAGuess); //setup route
}

var chatText;
function enteredChat() {
  chatText = chatInput.value();

  //need to send data to server (?) - emit has two params: route name (anything u want), data
  socket.emit('guess', chatText);
  newInput += 75;
  newInput2 += 75;
}

function makeAGuess(data) {
  machineText = str(data);
}

function draw() {
  fill(138, 155, 104);
  textSize(20)  
  textAlign(CENTER);
  text("Let's Chat! \nI love to talk about films, music, animals, social media, and food :)", windowWidth / 2, 100);
  textSize(16);
  textAlign(RIGHT);
  text(machineText, 700, newInput2, 350, 200);
  fill(147, 123, 99);
  textAlign(LEFT);
  text(chatText, 400, newInput, 350,200);
}
