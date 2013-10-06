var mouseX, mouseY;
var wDown = false;
var aDown = false;
var sDown = false;
var dDown = false;
var coneWidth = Math.PI / 2;
var canvas = document.getElementById("canvas");
var world = new World(canvas.width, canvas.height);

canvas.tabIndex = 0;
canvas.focus();

setInterval(run, 1000/60);

function World(x, y) {
	this.x = x;
	this.y = y;

	this.player = new Thing(x / 2, y / 2);
	this.player.speed = 3;
	this.things = [];

	for (var i=0; i<1000; i++)
		this.things.push(new Thing(Math.random()*2.5*x,
								   Math.random()*2.5*y));
}

function Thing(x, y) {
	this.x = x;
	this.y = y;
	this.radius = 10;

	this.points = [];

	//octagon
	var theta = 0;
	for (var i=0; theta < Math.PI*2; i++) {
		this.points.push([this.radius * Math.cos(theta),
						  this.radius * Math.sin(theta)]);
		theta += Math.PI / 4;
	}

	//square
	/*this.points.push([this.radius, this.radius]);
	this.points.push([this.radius, -this.radius]);
	this.points.push([-this.radius, -this.radius]);
	this.points.push([-this.radius, this.radius]);*/
}

function run() {
	update();
	draw();
}

function update() {
	var player = world.player;

	if(wDown)
		player.y -= player.speed;
	
	if(aDown)
		player.x -= player.speed;
	
	if(sDown)
		player.y += player.speed;

	if(dDown)
		player.x += player.speed;
}

function draw() {
	var ctx = canvas.getContext("2d");
	var player = world.player;

	blankCanvas(ctx);

	var minX = player.x - canvas.width/2;
	var minY = player.y - canvas.height/2;
	var maxX = player.x + canvas.width/2;
	var maxY = player.y + canvas.height/2;

	//things
	ctx.fillStyle = "rgb(0,0,255)";
	for (var i=0; i<world.things.length; i++) {
		var thing = world.things[i];
		if (minX < thing.x && thing.x < maxX &&
			minY < thing.y && thing.y < maxY) 
			drawThing(thing, ctx);
	}

	//thing shadows
	ctx.fillStyle = "rgb(0,0,0)";
	for (var i=0; i<world.things.length; i++) {
		var thing = world.things[i];
		if (minX < thing.x && thing.x < maxX &&
			minY < thing.y && thing.y < maxY) 
			castShadow(thing, ctx);
	}

	//limitVisionCone(ctx);

	//player
	ctx.fillStyle = "rgb(200,0,0)";
	drawThing(player, ctx);
}

function drawThing(thing, ctx) {
	var player = world.player;
	var x = canvas.width/2 + thing.x - player.x;
	var y = canvas.height/2 + thing.y - player.y;

	ctx.beginPath();
	var p = thing.points[0];
	ctx.moveTo(x + p[0],
			   y + p[1]);
	for (var i=1; i<thing.points.length; i++) {
		p = thing.points[i];
		ctx.lineTo(x + p[0],
				   y + p[1]);
	}
	ctx.fill();
}

function castShadow(thing, ctx) {
	var minAngle = Math.PI*2;
	var maxAngle = -Math.PI*2;
	var minPoint, maxPoint;
	var thingAngle = angleToPoint([0,0], thing);

	for (var i=0; i<thing.points.length; i++) {
		var p = thing.points[i];
		var theta = angleToPoint(p, thing);

		if (thingAngle > Math.PI / 2 && theta < 0)
			theta += Math.PI * 2;
		if (thingAngle < -Math.PI / 2 && theta > 0)
			theta -= Math.PI * 2;

		if (theta < minAngle) {
			minAngle = theta;
			minPoint = p;
		}

		if (theta > maxAngle) {
			maxAngle = theta;
			maxPoint = p;
		}
	}


	//shadowify
	var player = world.player;
	var x = canvas.width/2 + thing.x - player.x;
	var y = canvas.height/2 + thing.y - player.y;

	ctx.fillStyle = "rgb(0,0,0)";

	ctx.beginPath();
	ctx.moveTo(x + minPoint[0], y + minPoint[1]);
	ctx.lineTo(x + minPoint[0] + Math.cos(minAngle)*5000,
			   y + minPoint[1] + Math.sin(minAngle)*5000);
	ctx.lineTo(x + maxPoint[0] + Math.cos(maxAngle)*5000,
			   y + maxPoint[1] + Math.sin(maxAngle)*5000);
	ctx.lineTo(x + maxPoint[0], y + maxPoint[1]);
	ctx.fill();
}

function limitVisionCone(ctx) {
	var player = world.player;
	var mouseAngle = Math.atan2(mouseY - player.y,
							    mouseX - player.x);
	var theta = mouseAngle + coneWidth / 2;

	ctx.fillStyle = "rgb(0,0,0)";
	ctx.beginPath();
	ctx.moveTo(player.x, player.y);
	while (theta < mouseAngle - coneWidth / 2 + Math.PI*2) {
		ctx.lineTo(player.x + Math.cos(theta) * 5000,
				   player.y + Math.sin(theta) * 5000);
		theta += Math.PI / 4;
	}

	theta = mouseAngle - coneWidth / 2;
	ctx.lineTo(player.x + Math.cos(theta) * 5000,
			   player.y + Math.sin(theta) * 5000);

	ctx.fill();
}

function angleToPoint(point, thing) {
	var player = world.player;
	var theta = Math.atan2((thing.y + point[1]) - player.y,
						   (thing.x + point[0]) - player.x);

	return theta;
}

function angle(thing1, thing2) {
	return Math.atan2(thing2.y-thing1.y, thing2.x-thing1.x);
}

function blankCanvas(ctx) {
	ctx.fillStyle = "rgb(0,55,0)";
	ctx.fillRect(0,0, canvas.width, canvas.height);
}

function mouseMove() {
	mouseX = event.pageX-9;
	mouseY = event.pageY-10;
}

function keyDown() {
	if (event.keyCode == 87) {
		wDown = true;
	} else if (event.keyCode == 65) {
		aDown = true;
	} else if (event.keyCode == 83) {
		sDown = true;
	} else if (event.keyCode == 68) {
		dDown = true;
	}
}

function keyUp() {
	if (event.keyCode == 87) {
		wDown = false;
	} else if (event.keyCode == 65) {
		aDown = false;
	} else if (event.keyCode == 83) {
		sDown = false;
	} else if (event.keyCode == 68) {
		dDown = false;
	}
}
