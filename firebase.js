const firebaseConfig = {
  apiKey: "AIzaSyAg8jkiitQa6Y8sgbbYeZsL02C4eSbhHXo",
  authDomain: "hpforcefield.firebaseapp.com",
  databaseURL: "https://hpforcefield.firebaseio.com",
  projectId: "hpforcefield",
  storageBucket: "hpforcefield.appspot.com",
  messagingSenderId: "1048363384532",
  appId: "1:1048363384532:web:c53bafdcf3cacf8f24c541"
};

firebase.initializeApp(firebaseConfig);

var body = document.getElementsByTagName("body")[0];
let bottomCannon = document.createElement("p");
let leftCannon = document.createElement("p");
let rightCannon = document.createElement("p");
let topCannon = document.createElement("p");

body.appendChild(bottomCannon);
body.appendChild(leftCannon);
body.appendChild(rightCannon);
body.appendChild(topCannon);

var isShooting = {
  bc: false,
  lc: false,
  rc: false,
  tc: false
}

//var aCannonShooting = true;

var generateField = true;

var db = firebase.firestore();

db.collection("canons").doc("bottomCanon")
    .onSnapshot(function(doc) {
        setBottomCannon(doc.data());
});

db.collection("canons").doc("leftCanon")
    .onSnapshot(function(doc) {
        setLeftCannon(doc.data());
});

db.collection("canons").doc("rightCanon")
    .onSnapshot(function(doc) {
        setRightCannon(doc.data());
});

db.collection("canons").doc("topCanon")
    .onSnapshot(function(doc) {
        setTopCannon(doc.data());
});

db.collection("canons").doc("newField")
    .onSnapshot(function(doc) {
        setNewField(doc.data());
});

function setBottomCannon(fbData){
  isShooting.bc = fbData.shooting;
  let val = 'Bottom Cannon Shooting: ' + fbData.shooting.toString();
  bottomCannon.innerHTML = val;
  //aCannonShooting = fbData.shooting;
  //console.log("bc");
}

function setLeftCannon(fbData){
  isShooting.lc = fbData.shooting;
  let val = 'Left Cannon Shooting: ' + fbData.shooting.toString();
  leftCannon.innerHTML = val;
  //aCannonShooting = fbData.shooting;
  //console.log(fbData.shooting);
}

function setRightCannon(fbData){
  isShooting.rc = fbData.shooting;
  let val = 'Right Cannon Shooting: ' + fbData.shooting.toString();
  rightCannon.innerHTML = val;
  //aCannonShooting = fbData.shooting;
}

function setTopCannon(fbData){
  isShooting.tc = fbData.shooting;
  let val = 'Top Cannon Shooting: ' + fbData.shooting.toString();
  topCannon.innerHTML = val;
  //aCannonShooting = fbData.shooting;
}

function setNewField(fbData){
  generateField = fbData.generate;
}
