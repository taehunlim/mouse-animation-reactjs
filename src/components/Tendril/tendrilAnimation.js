import Tendril from "./tendril";

export function tendrilAnimation({ canvas, trails, settings, remove }) {
  const ctx = canvas.getContext("2d");
  let position = {
      x: 0,
      y: 0,
    },
    tendrils = [];

  function init(event) {
    document.removeEventListener("mousemove", init);
    document.removeEventListener("touchstart", init);
    document.removeEventListener("touchmove", init);

    document.addEventListener("mousemove", mousemove);
    document.addEventListener("touchstart", touchstart);
    document.addEventListener("touchmove", mousemove);

    mousemove(event);
    reset();
    loop();
  }

  function reset() {
    tendrils = [];

    for (let i = 0; i < trails; i++) {
      tendrils.push(
        new Tendril({
          settings,
          position,
          spring: 0.45 + 0.025 * (i / trails),
        })
      );
    }
  }

  function loop() {
    if (!ctx.running) return;

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#1D1D1D";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = "hsla(346,98%,56%,0.25)";
    ctx.lineWidth = 1;
    ctx.strokeStyle = settings.color;

    for (let i = 0, tendril; i < trails; i++) {
      tendril = tendrils[i];

      tendril.update();
      tendril.draw(ctx);
    }

    requestAnimFrame(loop);
  }

  function resize() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
  }

  function start() {
    if (!ctx.running) {
      ctx.running = true;
      loop();
    }
  }

  function stop() {
    ctx.running = false;
  }

  function mousemove(event) {
    if (event.touches) {
      position.x = event.touches[0].pageX;
      position.y = event.touches[0].pageY;
    } else {
      position.x = event.clientX;
      position.y = event.clientY;
    }
  }

  function touchstart(event) {
    if (event.touches.length == 1) {
      position.x = event.touches[0].pageX;
      position.y = event.touches[0].pageY;
    }
  }

  window.requestAnimFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (fn) {
        window.setTimeout(fn, 1000 / 60);
      }
    );
  })();

  ctx.running = true;

  document.body.addEventListener("orientationchange", resize);
  window.addEventListener("resize", resize);
  window.addEventListener("focus", start);
  window.addEventListener("blur", stop);

  document.addEventListener("mousemove", init);
  document.addEventListener("touchstart", init);
  document.removeEventListener("touchmove", init);

  resize();

  if (remove) {
    console.log(123);
    document.body.removeEventListener("orientationchange", resize);
    window.removeEventListener("resize", resize);
    window.removeEventListener("focus", start);
    window.removeEventListener("blur", stop);

    document.removeEventListener("mousemove", mousemove);
    document.removeEventListener("touchstart", touchstart);
    document.removeEventListener("touchmove", mousemove);
  }
}
