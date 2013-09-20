function World(x, y) {
	this.x = x;
	this.y = y;

	this.player = new Thing(400,300);
	this.things = [];

	for (var i=0; i<5; i++)
		this.things.push(new Thing(Math.random()*x,
								   Math.random()*y));
}

function Thing(x, y) {
	this.x = x;
	this.y = y;
	this.points = [];
	this.points.push([3,3]);
	this.points.push([3,-3]);
	this.points.push([-3,-3]);
	this.points.push([-3,3]);
}

function run() {
	draw();
}

function draw() {
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var player = world.player;

	drawBorders(canvas, ctx);


	var theta = Math.atan2(mouseY-player.y, mouseX-player.x);

	//line things
	ctx.fillStyle = "rgb(255,255,255)";
	ctx.beginPath();
	ctx.moveTo(player.x, player.y);
	ctx.lineTo(Math.cos(theta-Math.PI/4) * 5000, Math.sin(theta-Math.PI/4) * 5000);
	ctx.lineTo(Math.cos(theta+Math.PI/4) * 5000, Math.sin(theta+Math.PI/4) * 5000);
	ctx.fill();

	//things
	ctx.fillStyle = "rgb(0,0,0)";
	for (var i=0; i<world.things.length; i++) {
		var thing = world.things[i];
		castShadow(thing, ctx);
	
		ctx.fillStyle = "rgb(0,0,200)";
		drawThing(thing, ctx);
	}

	//player
	ctx.fillStyle = "rgb(200,0,0)";
	drawThing(player, ctx);
}

function castShadow(thing, ctx) {
	var minAngle = Math.PI*2;
	var maxAngle = -Math.PI*2;
	var minPoint, maxPoint;

	for (var i=0; i<thing.points.length; i++) {
		var p = thing.points[i];
		var theta = angleToPoint(p, thing);

		if (theta < minAngle) {
			minAngle = theta;
			minPoint = p;
		}

		if (theta > maxAngle) {
			maxAngle = theta;
			maxPoint = p;
		}
	}

	ctx.fillStyle = "rgb(0,0,0)";

	ctx.beginPath();
	ctx.moveTo(thing.x + minPoint[0], thing.y + minPoint[1]);
	ctx.lineTo(thing.x + minPoint[0] + Math.cos(minAngle)*5000,
			   thing.y + minPoint[1] + Math.sin(minAngle)*5000);
	ctx.lineTo(thing.x + maxPoint[0] + Math.cos(maxAngle)*5000,
			   thing.y + maxPoint[1] + Math.sin(maxAngle)*5000);
	ctx.lineTo(thing.x + maxPoint[0], thing.y + maxPoint[1]);
	ctx.fill();
}

function angleToPoint(point, thing) {
	var player = world.player;
	var theta = Math.atan2((thing.y + point[1]) - player.y,
						   (thing.x + point[0]) - player.x);
	return theta;
}

function drawThing(thing, ctx) {
	ctx.beginPath();
	var p = thing.points[0];
	ctx.moveTo(thing.x + p[0],
			   thing.y + p[1]);
	for (var i=1; i<thing.points.length; i++) {
		p = thing.points[i];
		ctx.lineTo(thing.x + p[0],
				   thing.y + p[1]);
	}
	ctx.fill();
}

function angle(thing1, thing2) {
	return Math.atan2(thing2.y-thing1.y, thing2.x-thing1.x);
}

function drawBorders(canvas, ctx) {
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillRect(0,0, canvas.width, canvas.height);
}

function mouseMove() {
	mouseX = event.pageX-9;
	mouseY = event.pageY-10;
}

var mouseX, mouseY;
var world = new World(800, 600);

setInterval(run, 1000/60);
