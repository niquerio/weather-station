//implement the class
export class circle{
    //create the constructor
    constructor(radius,squareR ) {
        this.radius = radius;
    }
    //create the methods to calculate the diameter and area of circle
    getDiameter() {
        return this.radius * 2;
    }
    getArea() {
        return Math.round(Math.PI * this.radius);
    }
}
