'use strict';

// Declare app level module which depends on views, and components


// Get the modal
var modal = document.getElementById('myModal');
var modal2 = document.getElementById('myModal2');

// Get the button that opens the modal
var btn = document.getElementById("addClassBtn");
var btnSubject = document.getElementById("addSubjectBtn");
var btn2 =document.getElementById("btnCancel")
var btn3 =document.getElementById("btnCancel2")
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var span2 = document.getElementsByClassName("close")[1];
// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}
btnSubject.onclick = function() {
  modal2.style.display = "block";
}
btn2.onclick = function() {
  modal.style.display = "none";
}
btn3.onclick = function() {
  modal2.style.display = "none";
}
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}
span2.onclick = function() {
  modal2.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if(event.target == modal2){
    modal2.style.display = "none";
  }
}
