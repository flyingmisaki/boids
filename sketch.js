const flock = []

let alignSlider, cohesionSlider, separationSlider

// Initial setup
function setup() {
    createCanvas(800, 600)

    for (let i = 0; i < 150; i++) {
        flock.push(new Boid())
    }
}

// Drawing and physics loop
function draw() {
    background(0, 0, 64)

    for (let boid of flock) {
        boid.correctPosition()
        boid.flock(flock)
        boid.update()
        boid.render()
    }
}