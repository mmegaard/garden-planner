class Viewport {
  x: number;
  y: number;
  width: number;
  height: number;
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  screenToWorld(fx: number, fy: number): number[] {
    console.log("fx", fx);
    return [this.x + fx * this.width, this.y + fy * this.height];
  }

  zoom(zoomlevel: number): Viewport {
    const newWidth = this.width * zoomlevel;
    const newHeight = this.height * zoomlevel;
    const newX = this.x - (newWidth - this.width) / 2;
    const newY = this.y - (newHeight - this.height) / 2;
    return new Viewport(newX, newY, newWidth, newHeight);
  }

  pan(deltaX: number, deltaY: number): Viewport {
    console.log("curret position of viewport in world space", this.x, this.y);
    console.log("moved this much on screen", deltaX, deltaY);

    const newX = this.x + deltaX;
    const newY = this.y + deltaY;
    return new Viewport(newX, newY, this.width, this.height);
  }
}

export default Viewport;
