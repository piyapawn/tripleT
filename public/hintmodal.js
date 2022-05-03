//HintModal
var Hintmodal = document.getElementById("HintModal");

var Hintbtn = document.getElementById("hint");

var Hintspan = document.getElementsByClassName("closeHint")[0];

Hintbtn.onclick = function() {
  Hintmodal.style.display = "block";
  }
  Hintspan.onclick = function() {
    Hintmodal.style.display = "none";
  }
  window.onclick = function(event) {
    if (event.target == Hintmodal) {
      Hintmodal.style.display = "none";
    }
  }