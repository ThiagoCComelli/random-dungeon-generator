class Canvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;

    this.allObjectsAsleep = false;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawObject(obj) {
    this.ctx.fillStyle = obj.color || "#000";
    this.ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
  }

  drawEdge(edge) {
    this.ctx.beginPath();
    this.ctx.moveTo(
      edge.start.obj.x + edge.start.obj.width / 2,
      edge.start.obj.y + edge.start.obj.height / 2
    );
    this.ctx.lineTo(
      edge.end.obj.x + edge.end.obj.width / 2,
      edge.end.obj.y + edge.end.obj.height / 2
    );
    this.ctx.strokeStyle = "#F00";
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.lineWidth = 5;
    this.ctx.stroke();
  }

  update(objs) {
    let changed = false;
    for (const rect of objs) {
      for (const otherRect of objs) {
        if (rect !== otherRect) {
          if (
            rect.x < otherRect.x + otherRect.width &&
            rect.x + rect.width > otherRect.x &&
            rect.y < otherRect.y + otherRect.height &&
            rect.y + rect.height > otherRect.y
          ) {
            let overlapX =
              Math.min(rect.x + rect.width, otherRect.x + otherRect.width) -
              Math.max(rect.x, otherRect.x);

            let overlapY =
              Math.min(rect.y + rect.height, otherRect.y + otherRect.height) -
              Math.max(rect.y, otherRect.y);

            if (overlapX < overlapY) {
              if (rect.x < otherRect.x) {
                rect.x -= overlapX;
                otherRect.x += overlapX;
              } else {
                rect.x += overlapX;
                otherRect.x -= overlapX;
              }
            } else {
              if (rect.y < otherRect.y) {
                rect.y -= overlapY;
                otherRect.y += overlapY;
              } else {
                rect.y += overlapY;
                otherRect.y -= overlapY;
              }
            }

            changed = true;
          }
        }
      }
    }

    this.allObjectsAsleep = !changed;
  }

  draw(objs) {
    this.clear();

    for (let i = 0; i < objs.length; i++) {
      this.drawObject(objs[i]);
    }
  }
}
