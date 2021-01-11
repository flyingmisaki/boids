// Represents a boid
class Boid {
    constructor() {
        this.position = createVector(random(width), random(height))
        this.velocity = p5.Vector.random2D()
        this.velocity.setMag(random(2, 4))
        this.acceleration = createVector()
        this.maxForce = 0.6 // Max steering force
        this.maxSpeed = 2 // Max steering speed
    }

    /*
    Crappy logic so that boids reappear on 
    the other side of the screen (like a taurus)
    +++ TO IMPLEMENT PROPERLY +++
    */
    edges() {
        if (this.position.x > width) {
            this.position.x = 0
        } else if (this.position.x < 0) {
            this.position.x = width
        }
        if (this.position.y > width) {
            this.position.y = 0
        } else if (this.position.y < 0) {
            this.position.y = width
        }
    }

    // Aligns the boids and returns a steering force
    align(boids) {
        let perceptionRadius = 50
        let steering = createVector()
        let total = 0
        
        for (let other of boids) {
            let d = dist(
                this.position.x, 
                this.position.y, 
                other.position.x, 
                other.position.y
            )
            
            if ( other != this && d < perceptionRadius) {
                steering.add(other.velocity)
                total++
            }
        }
        
        if (total > 0) {
            steering.div(total)
            steering.setMag(this.maxSpeed)
            steering.sub(this.velocity)
            steering.limit(this.maxForce)
        }
        return steering
    }

    separation(boids) {
        let perceptionRadius = 50
        let steering = createVector()
        let total = 0
        
        for (let other of boids) {
            let d = dist(
                this.position.x, 
                this.position.y, 
                other.position.x, 
                other.position.y
            )
            
            if ( other != this && d < perceptionRadius) {
                let diff = p5.Vector.sub(this.position, other.position)
                diff.mult(1 / d) //Inversly proportional (further = lower magnitude)
                steering.add(diff)
                total++
            }
        }
        
        if (total > 0) {
            steering.div(total)
            steering.setMag(this.maxSpeed)
            steering.sub(this.velocity)
            steering.limit(this.maxForce)
        }
        return steering
    }

    // Steer towards the average centre of mass of the flock
    cohesion(boids) {
        let perceptionRadius = 50
        let steering = createVector()
        let total = 0
        
        for (let other of boids) {
            let d = dist(
                this.position.x, 
                this.position.y, 
                other.position.x, 
                other.position.y
            )
            
            if ( other != this && d < perceptionRadius) {
                steering.add(other.position)
                total++
            }
        }
        
        if (total > 0) {
            steering.div(total)
            steering.sub(this.position)
            steering.setMag(this.maxSpeed)
            steering.sub(this.velocity)
            steering.limit(this.maxForce)
        }
        return steering
    }

    // Flocking of the boids
    flock(boids) {
        this.acceleration.set(0, 0) // Stops from accumulating acceleration

        let alignment = this.align(boids)
        let cohesion = this.cohesion(boids)
        let separation = this.separation(boids)

        alignment.mult(alignSlider.value())
        cohesion.mult(cohesionSlider.value())
        separation.mult(separationSlider.value())
        
        this.acceleration.add(alignment)
        this.acceleration.add(cohesion)
        this.acceleration.add(separation)
    }

    // Updates the position of the boid
    update() {
        this.position.add(this.velocity)
        this.velocity.add(this.acceleration)
        this.velocity.limit(this.maxSpeed)
    }

    // Drawing and stroke of the boid
    show() {
        strokeWeight(8)
        stroke(255)
        point(this.position.x, this.position.y)
    }
}