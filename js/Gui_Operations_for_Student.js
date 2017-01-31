

// Get the modal
var modal = document.getElementById('myModal');
var modal2 = document.getElementById('myModal2');
var modal3 = document.getElementById('participation_Modal');

// Get the button that opens the modal
var btn = document.getElementById("addClassBtn");
var btnSubject = document.getElementById("addSubjectBtn");
var btn2 =document.getElementById("btnCancel")
var btn3 =document.getElementById("btnCancel3")

var cancelBtn1 = document.getElementsByClassName('btnCancel')[0];
var cancelBtn2 = document.getElementsByClassName('btnCancel')[1];
var cancelBtn3 = document.getElementsByClassName('btnCancel')[2];

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var span2 = document.getElementsByClassName("close")[1];
var span3 = document.getElementsByClassName("close")[2];
// When the user clicks on the button, open the modal

var events = document.getElementsByClassName("event");

Array.prototype.forEach.call(events,function (ev) {
  ev.onclick = function () {
    modal3.style.display = "block";
  }
});

var tiles = document.getElementsByClassName("radio-tile");

Array.prototype.forEach.call(tiles,function (tile) {
    tile.onclick = function () {
      Array.prototype.forEach.call(tiles,function (til) {
        til.style.backgroundColor = "#8f41cb";
      });
    tile.style.backgroundColor = "#521F6F";
  }
});

cancelBtn1.onclick = function () {
  modal.style.display = "none";
}
span.onclick = function () {
  modal.style.display = "none";
}

cancelBtn2.onclick = function () {
  modal2.style.display = "none";
}
span2.onclick = function () {
  modal2.style.display = "none";
}

cancelBtn3.onclick = function () {
  modal3.style.display = "none";
}
span3.onclick = function () {
  modal3.style.display = "none";
}


btn.onclick = function() {
  modal.style.display = "block";
}
btnSubject.onclick = function() {
  modal2.style.display = "block";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if(event.target == modal2){
    modal2.style.display = "none";
  }
  if(event.target == modal3){
    modal3.style.display = "none";
  }
}
