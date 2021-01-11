const flock = []

let alignSlider, cohesionSlider, separationSlider

// Initial setup
function setup() {
    createCanvas(800, 600)

    alignSlider = createSlider(0, 5, 1, 0.1)
    cohesionSlider = createSlider(0, 5, 1, 0.1)
    separationSlider = createSlider(0, 5, 1, 0.1)

    for (let i = 0; i < 100; i++) {
        flock.push(new Boid())
    }
}

// Drawing and physics loop
function draw() {
    background(51)

    for (let boid of flock) {
        boid.edges()
        boid.flock(flock)
        boid.update()
        boid.show()
    }
}