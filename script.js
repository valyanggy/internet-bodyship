/*Inspired by Helene Federici and Chris Coleman */

var tree; //a graphics buffer to draw the tree into

var paths = []; //an array for all the growing branches


let maxFrames = 1;
let saveIt = false;
let counter = 0;

let gui;
let s;
let s2;
let t;


function setup() {
    
    let myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.parent('myZone');

    gui = createGui();
    gui.setStrokeWeight(1);
    s = createSlider2d("Slider2d", 10, height - 200, 155, 155, 0, 255, 0, 255);
    s2 = createSlider("Slider", 10, height - 250, 155, 32, 0, 10);
    t = createToggle("mode", 10, height-300, 155, 32);

    tree = createGraphics(windowWidth, windowHeight); //decide how big the image is to hold the tree drawing
    ellipseMode(CENTER);
    smooth();
    // noLoop();
    frameRate(50); //draw speed
    paths.push(new Pathfinder());
    positionX = 0;
    blue = random(0, 105);
    green = random(200, 300);
    bg=color(random(0,25), random(5,35), random(0,25));


}

function draw() {
    drawGui();
    gui.loadStyle("Grey");
    background(255);

    

    if (s.isChanged) {
        // Print a message when Slider2d is changed
        // that displays its value.
        print(s.label + " = {" + s.valX + ", " + s.valY + "}");
    }
    if (s2.isChanged) {
        // Print a message when Slider is changed
        // that displays its value.
        print(s2.label + " = " + s2.val);
    }
    if (t.isPressed) {
        // Print a message when Button is pressed.
        print(t.label + " is " + t.val);
    }

    if (t.val) {
        // Draw an ellipse when Button is held.
        gui.loadStyle("TerminalGreen");
        fill(bg);
        rect(0, 0, windowWidth, windowHeight);
      }

    image(tree, positionX, 0, width, height); //here we draw the tree to the screen every frame
    tree.noStroke(); //tree has no stroke

    for (var i = 0; i < paths.length; i++) { //start drawing the tree by going thru all the branches

        var loc = paths[i].location.copy(); //grab a copy of their location
        var diam = paths[i].diameter; //grab a copy of the branch diameter
        count = random(0, 100);


        paths[i].update(); //update the position and direction for the growth of each branch
        if (count > s2.val) {
            tree.fill(s.valX, green - (diam * 2.8), blue); //color of the tree
            tree.rect(loc.x, loc.y, diam, diam); //here we draw the next ellipse for each branch into the tree buffer
            // tree.ellipse(loc.x, loc.y, diam, diam); //here we draw the next ellipse for each branch into the tree buffer


        } else if (frameCount > 200) {
            offset = random(-10, 10);
            offsetDiam = random(.1, 1)
            tree.fill(random(200), 200 - (diam * 5.8), s.valY); //color of the tree
            tree.ellipse(loc.x + offset, loc.y + offset, diam * offsetDiam, diam * offsetDiam); //here we draw the next ellipse for each branch into the tree buffer
            paths[i].update(); //update the position and direction for the growth of each branch
        }
    }
    drawGui();
    if (saveIt && counter < maxFrames) {
        let num = nf(counter, 3, 0);
        let filename = num + ".png";

        save(filename);
        counter++;
    }

}


function Pathfinder(parent) { //the class for making branches - note that it allows for another branch object to be passed in...
    if (parent === undefined) { //if this is the first branch, then use the following settings - note that this is how you deal with different constructors
        this.location = createVector(width/2, height* 0.8); //placemnet of the first branch, or trunk
        this.velocity = createVector(0, -1); //direction for the trunk, here -1 in the y axis = up
        this.diameter = random(10, 80); //size of trunk
        // this.diameter = s.val;
    } else {
        // tree.rect(loc.x + offset, loc.y + offset, diam * random(1, 2), diam * random(1, 2));
        this.location = parent.location.copy(); //for a new branch, copy in the last position, the end of the branch
        this.velocity = parent.velocity.copy(); //for a new branch, copy the direction the old branch was going
        // control the branch area(value = 1.2 gone crazy)
        var area = PI * sq(parent.diameter / 1.5); //find the area of the branch cross section
        // lower the number, denser the branches
        var newDiam = sqrt(area / 5 / PI) * 3; //divide it by two and calculate the diameter of this new branch
        this.diameter = newDiam; //save the new diameter
        // add in here got things look stalled and crazy, like + 2
        parent.diameter = newDiam; //the parent branch keeps on growing, but with the new diameter as well
    }
    this.update = function() { //update the growth of the tree
        if (this.diameter > 2) { //this indicates when the tree should stop growing, the smallest branch diameter
            this.location.add(this.velocity); //update the location of the end of the branch
            var bump = new createVector(random(-.97, .97), random(-.97, .97)); //this determines how straight or curly the growth is, here it is +-13% variation
            bump.mult(0.1); //this reduces that by ten so now it is +-1.3% variation
            this.velocity.add(bump); //apply that to the velocity for the next growth
            this.velocity.normalize(); //make sure our vector is normalized to be between 0-1
            if (random(0, 1) < .01) { //this is the probability that the tree splits, here it is 1% (now 2%) chance
                paths.push(new Pathfinder(this)); //if it is time for a split, make a new path
            }
        }
    }
}

function keyTyped() {
    if (key == 's') {
        saveIt = true;
    }

}

function touchMoved() {
    // do some stuff
    return false;
}