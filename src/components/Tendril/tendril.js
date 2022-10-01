export default class Tendril {
  constructor(options) {
    this.options = {
      ...options,
      spring: options.spring || 0.45,
      settings: {
        debug: false,
        size: 50,
        friction: 0.5,
        dampening: 0.25,
        tension: 0.98,
        ...options.settings,
      },
    };

    this.init();
  }

  init() {
    const { spring, settings, position } = this.options;

    this.spring = spring + Math.random() * 0.1 - 0.05;
    this.friction = settings.friction + Math.random() * 0.01 - 0.005;
    this.nodes = [];

    for (let i = 0; i < settings.size; i++) {
      let node = {
        x: 0,
        y: 0,
        vy: 0,
        vx: 0,
      };

      node.x = position.x;
      node.y = position.y;

      this.nodes.push(node);
    }
  }

  update() {
    const { settings, position } = this.options;

    // init
    let spring = this.spring,
      node = this.nodes[0];

    node.vx += (position.x - node.x) * spring;
    node.vy += (position.y - node.y) * spring;

    // update
    for (let prevNode, i = 0, n = this.nodes.length; i < n; i++) {
      node = this.nodes[i];

      if (i > 0) {
        prevNode = this.nodes[i - 1];

        node.vx += (prevNode.x - node.x) * spring;
        node.vy += (prevNode.y - node.y) * spring;
        node.vx += prevNode.vx * settings.dampening;
        node.vy += prevNode.vy * settings.dampening;
      }

      node.vx *= this.friction;
      node.vy *= this.friction;
      node.x += node.vx;
      node.y += node.vy;

      spring *= settings.tension;
    }
  }

  draw(ctx) {
    let x = this.nodes[0].x,
      y = this.nodes[0].y,
      currentNode,
      nextNode;

    ctx.beginPath();
    ctx.moveTo(x, y);

    for (let i = 1, n = this.nodes.length - 1; i < n; i++) {
      currentNode = this.nodes[i];
      nextNode = this.nodes[i + 1];
      x = (currentNode.x + nextNode.x) * 0.5;
      y = (currentNode.y + nextNode.y) * 0.5;

      ctx.quadraticCurveTo(currentNode.x, currentNode.y, x, y);
    }

    ctx.quadraticCurveTo(currentNode.x, currentNode.y, nextNode.x, nextNode.y);
    ctx.stroke();
    ctx.closePath();
  }
}
