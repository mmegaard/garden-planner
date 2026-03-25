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

  zoom(zoomlevel: number): Viewport {
    const newWidth = this.width * zoomlevel;
    const newHeight = this.height * zoomlevel;
    const newX = this.x - (newWidth - this.width) / 2;
    const newY = this.y - (newHeight - this.height) / 2;
    return new Viewport(newX, newY, newWidth, newHeight);
  }

  zoomAt(zoomlevel: number, fx: number, fy: number): Viewport {
    const newWidth = this.width * zoomlevel;
    const newHeight = this.height * zoomlevel;
    const worldX = this.x + fx * this.width;
    const worldY = this.y + fy * this.height;
    const newX = worldX - fx * newWidth;
    const newY = worldY - fy * newHeight;
    return new Viewport(newX, newY, newWidth, newHeight);
  }

  screenToWorld(fx: number, fy: number): number[] {
    //console.log("fx", fx);
    return [this.x + fx * this.width, this.y + fy * this.height];
  }

  pan(deltaX: number, deltaY: number): Viewport {
    const newX = this.x + deltaX;
    const newY = this.y + deltaY;
    return new Viewport(newX, newY, this.width, this.height);
  }
}

export default Viewport;
