// Represents a boid
class Boid {
    constructor() {
        this.position = createVector(random(width), random(height))
        this.velocity = p5.Vector.random2D()
        this.velocity.setMag(random(2, 4))
        this.acceleration = createVector()
        this.maxForce = 0.1 // Max steering force
        this.maxSpeed = 1 // Max steering speed
        this.triangleSize = 3
        this.perceptionRadius = 50
    }

    /*
    Logic so that boids reappear on 
    the other side of the screen (like a taurus)
    */
    correctPosition() {
        if (this.position.x > width) {
            this.position.x = 0
        }
        else if (this.position.x < 0) {
            this.position.x = width
        }
        if (this.position.y > width) {
            this.position.y = 0
        }
        else if (this.position.y < 0) {
            this.position.y = width
        }
    }

    // Aligns the boids and returns a steering force
    alignWithNeighbors(boids) {
        let steering = createVector()
        let total = 0
        
        for (let other of boids) {
            let d = dist(
                this.position.x, 
                this.position.y, 
                other.position.x, 
                other.position.y
            )
            
            if ( other != this && d < this.perceptionRadius) {
                steering.add(other.velocity)
                total++
            }
        }

        // at this point, "steering" actually contains the group net velocity
        
        if (total > 0) {
            steering.div(total)
            // At this point, "steering" contains group avg velocity

            steering.setMag(this.maxSpeed)
            // At this point, "steering" is a velocity vector in the direction of the group's average, at max speed

            steering.sub(this.velocity)
            steering.limit(this.maxForce)
        }
        return steering
    }

    separateFromNeighbors(boids) {
        let steering = createVector()
        let total = 0
        
        for (let other of boids) {
            let d = dist(
                this.position.x, 
                this.position.y, 
                other.position.x, 
                other.position.y
            )
            
            if ( other != this && d < this.perceptionRadius) {
                let diff = p5.Vector.sub(this.position, other.position)
                diff.mult(1 / d) //Inversly proportional (further = lower magnitude)
                steering.add(diff)
                total++
            }
        }
        
        if (total > 0) {
            steering.div(total)
            steering.setMag(this.maxSpeed)
            //steering.sub(this.velocity)
            steering.limit(this.maxForce)
        }
        return steering
    }

    // Steer towards the average centre of mass of the flock
    cohereWithNeighbors(boids) {
        let steering = createVector()
        let total = 0
        
        for (let other of boids) {
            let d = dist(
                this.position.x, 
                this.position.y, 
                other.position.x, 
                other.position.y
            )
            
            if ( other != this && d < this.perceptionRadius) {
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
        
        let separation = this.separateFromNeighbors(boids)
        let alignment = this.alignWithNeighbors(boids)
        let cohesion = this.cohereWithNeighbors(boids)

        this.acceleration.add(separation)
        this.acceleration.add(alignment)
        this.acceleration.add(cohesion)
    }

    // Updates the position of the boid
    update() {
        this.position.add(this.velocity)
        this.velocity.add(this.acceleration)
        this.velocity.limit(this.maxSpeed)
    }

    // Rendering of the boid as a triangle and rotation towards velocity
    render() {
        let theta = this.velocity.heading() + radians(90);
        push()
        translate(this.position.x, this.position.y)
        rotate(theta)
        beginShape()
        vertex(0, -this.triangleSize * 2)
        vertex(-this.triangleSize, this.triangleSize * 2)
        vertex(this.triangleSize, this.triangleSize * 2)
        endShape()
        pop()
    }
}