/*Inspired by Helene Federici and Chris Coleman */

var tree; //a graphics buffer to draw the tree into

var paths = []; //an array for all the growing branches


let maxFrames = 1;
let saveIt = false;
let counter = 0;

let gui;
let s;
let s2;


function setup() {
    background(255)
    let myCanvas = createCanvas(windowWidth, windowHeight);
    myCanvas.parent('myZone');

    gui = createGui();
    gui.setStrokeWeight(1);
    s = createSlider2d("Slider2d", 10, 210, 175, 175, 0, 255, 0, 255);
    s2 = createSlider("Slider", 50, 50, 300, 32, 0, 10);

    tree = createGraphics(windowWidth, windowHeight); //decide how big the image is to hold the tree drawing
    ellipseMode(CENTER);
    smooth();
    frameRate(50); //draw speed
    paths.push(new Pathfinder());
    positionX = 0;





}

function draw() {

    image(tree, positionX, 0, width, height); //here we draw the tree to the screen every frame
    tree.noStroke(); //tree has no stroke
    for (var i = 0; i < paths.length; i++) { //start drawing the tree by going thru all the branches

        var loc = paths[i].location.copy(); //grab a copy of their location
        var diam = paths[i].diameter; //grab a copy of the branch diameter
        count = random(0, 100);
        // let trunk = s.val;

        paths[i].update(); //update the position and direction for the growth of each branch
        if (count > 1) {
            tree.fill(map(mouseX, 0, width, 0, 50), map(mouseX, 0, width, 0, 240) - (diam * 2.8), map(mouseX, 0, width, 10, 130)); //color of the tree
            tree.rect(loc.x, loc.y, diam, diam); //here we draw the next ellipse for each branch into the tree buffer
            // tree.ellipse(loc.x, loc.y, diam, diam); //here we draw the next ellipse for each branch into the tree buffer


        } else if (frameCount > 200) {
            // offset = random(-20, 30);
            offset = 1;
            offsetDiam = random(.1, 1)
            tree.fill(map(mouseX, 0, width, 200, 305), 400 - (diam * 2.8), map(mouseX, 0, width, 100, 200)); //color of the tree
            tree.ellipse(loc.x + offset, loc.y + offset, diam * offsetDiam, diam * offsetDiam); //here we draw the next ellipse for each branch into the tree buffer
            paths[i].update(); //update the position and direction for the growth of each branch
        }
    }


    if (saveIt && counter < maxFrames) {
        let num = nf(counter, 3, 0);
        let filename = num + ".png";

        save(filename);
        counter++;
    }

}


function Pathfinder(parent) { //the class for making branches - note that it allows for another branch object to be passed in...
    if (parent === undefined) { //if this is the first branch, then use the following settings - note that this is how you deal with different constructors
        this.location = createVector(500, 500); //placemnet of the first branch, or trunk
        this.velocity = createVector(0, -1); //direction for the trunk, here -1 in the y axis = up
        this.diameter = random(5, 20); //size of trunk
        // this.diameter = s.val;
    } else {
        // tree.rect(loc.x + offset, loc.y + offset, diam * random(1, 2), diam * random(1, 2));
        this.location = parent.location.copy(); //for a new branch, copy in the last position, the end of the branch
        this.velocity = parent.velocity.copy(); //for a new branch, copy the direction the old branch was going
        // control the branch area(value = 1.2 gone crazy)
        var area = PI * sq(parent.diameter / 1); //find the area of the branch cross section
        // lower the number, denser the branches
        var newDiam = sqrt(area / 5 / PI) * 2; //divide it by two and calculate the diameter of this new branch
        this.diameter = newDiam; //save the new diameter
        // add in here got things look stalled and crazy, like + 2
        parent.diameter = newDiam; //the parent branch keeps on growing, but with the new diameter as well
    }
    this.update = function() { //update the growth of the tree
        if (this.diameter > 2) { //this indicates when the tree should stop growing, the smallest branch diameter
            this.location.add(this.velocity); //update the location of the end of the branch
            var bump = new createVector(random(-.87, .87), random(-.87, .87)); //this determines how straight or curly the growth is, here it is +-13% variation
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