// Set the date we're counting down to
var countDownDate = new Date("Dec 29, 2020 15:00:00").getTime();


function setup() {
  noCanvas();

  var timer = select('#timer');
  
  var interval = setInterval(timeIt, 1000);

  function timeIt() {
    // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    
    timer.html(days + "d " + hours + "h " + minutes + "m " + seconds + "s");
  }

}