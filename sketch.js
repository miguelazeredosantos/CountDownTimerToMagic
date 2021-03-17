let canvas, ctx;

let scl = 9;
let speedLimit = 0.9 * scl;
let friction = 0.75;
let roboto;
let particles = [];
let oldDate = '';
let textStringArgs = [ 0, 0, 2 * scl ];
let timeStringParts = [ 'Hour', 'Minute', 'Second' ].map(n => `get${n}s`);
let textString = '';
let textString2 = [];
let textBounds = {};
let points = {};
let textPoints = [];
let order = [];

// Set the date we're counting down to
var countDownDate = new Date("Apr 29, 2021 15:10:00").getTime();

function preload() {
	roboto = loadFont('RobotoMono-Bold.ttf');
}

function setup() {
	canvas = createCanvas(windowWidth, windowHeight);
	ctx = canvas.drawingContext;
	
	for(let i = 0; i < 180 * scl; i++) {
		let p = new Particle();
		p.applyForce(p5.Vector.random2D().mult(random(1 * scl, 2 * scl)));
		particles.push(p);
	}
	
	textBounds = roboto.textBounds('0', ...textStringArgs);
	
	[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ':', 'd', 'h','m', 's' ].forEach(renderCharacter);
}

function draw() {
	ctx.clearRect(0, 0, width, height);
	fill(255);
	translate(width / 2, height / 2);
	
	let changed = getDate();
	
	ctx.beginPath();
	
	particles.forEach((p, i) => {
		let index = floor(map(i, 0, particles.length, 0, textPoints.length));
		let textPoint = textPoints[index % textPoints.length];
		
		p	.draw()
			.attractTo(textPoint)
			.update();
	});
	
	//ctx.fillStyle = 'hsl(205, 100%, 50%)';
	ctx.fillStyle = 'orange';
	ctx.fill();
	
	if(changed) { // Rotate the particles
		for(let i = 0; i < particles.length * 0.333; i++) {
			let p = particles.pop();
			p.applyForce(-20 * scl, -10 * scl);
			particles.unshift(p);
		}
	}
}

function renderCharacter(c) {
	let pts = roboto.textToPoints(c + '', ...textStringArgs, { sampleFactor: 0.875 })
		.map(n => createVector(n.x, n.y)
					.add(-textBounds.w * 0.5, textBounds.h * 0.5)
					.sub(8 * textBounds.w * 0.5 + textBounds.advance * 7)
					.mult(scl)
			);
	pts[0].z = -1; // First
	pts[pts.length - 1].z = 1; // Last
	points[c] = pts;
}

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
    
    
    //timer.html(days + "d " + hours + "h " + minutes + "m " + seconds + "s");
    let daysSplitted = days.toString().split('');
    daysSplitted.forEach(element => textString2.push(element));  
    textString2.push("d");
    let hoursSplitted = hours.toString().split('');
    hoursSplitted.forEach(element => textString2.push(element));
    textString2.push("h");
    let minutesSplitted = minutes.toString().split('');
    minutesSplitted.forEach(element => textString2.push(element));
    textString2.push("m");
    let secondsSplitted = seconds.toString().split('');
    secondsSplitted.forEach(element => textString2.push(element));
    textString2.push("s");
    //textString2 =  [days, "d ", hours, "h ", minutes, "m ", seconds, "s"];
  }

function getDate() {
	let date = new Date();
	if(oldDate.toString() === date.toString()) {
		return false;
	}
	oldDate = date;
  
  //console.log(date);
  
    timeIt();
  
	textString = timeStringParts
			.map(n => date[n]())
			.map(n => `0${n}`.slice(-2))
			.join(':')
			.split('');
  
    console.log(textString2);
  
	textPoints = [].concat(...textString2.map((n, i) => {
			let offset = (i * textBounds.w * textBounds.advance) * scl;
			return points[n].map(p => p.copy().add(offset, 0));
		}));
    
    textString2 = [];
    //console.log(textPoints);
	return true;
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

class Particle {
	constructor() {
		this.pos = createVector();
		this.vel = createVector();
		this.acc = createVector();
	}
	applyForce(...args) {
		this.acc.add(...args);
		return this;
	}
	attractTo(vec) {
		if(vec === undefined) {
			return this;
		}
		let v = vec	.copy()
					.sub(this.pos)
					.limit(speedLimit);
		this.applyForce(v);
		return this;
	}
	update() {
		let { pos, vel, acc } = this;
		vel.add(acc);
		acc.set(0, 0);
		vel.mult(friction);
		pos.add(vel);
		return this;
	}
	draw() {
		let { pos: { x, y } } = this;
		ctx.moveTo(x + 3, y);
		ctx.arc(x, y, 3, 0, TAU);
		return this;
	}
}

