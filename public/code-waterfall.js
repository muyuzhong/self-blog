(function() {
  'use strict';

  function init() {
    var canvas = document.getElementById('code-waterfall-canvas');
    if (!canvas) { setTimeout(init, 100); return; }
    if (canvas.__heartInit) return;
    canvas.__heartInit = true;

    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var w, h, cx, cy, heartSize;
    var insidePoints = [];
    var frame = 0;
    var startTime = performance.now();

    var codeChars = [
      'function','const','return','await','async','import','export',
      'class','if','else','for','while','switch','case','break',
      '=>','[]','{}','()','<>',';','::',
      '===','!==','&&','||','?.','??','...',
      'type','interface','enum','let','var','new','this',
      'try','catch','throw','yield','void','null','true','false',
      'undefined','NaN','Infinity','Promise','async','await',
      '+','-','*','/','%','=','!','<','>','&','|','^','~','#','@',
      '0x1f','0xFF','[]','{}','()','``','""',"''"
    ];
    var colors = ['#00ff88','#00e67a','#00cc6a','#00b35c','#00994d','#007a3d'];
    var charStep = 13;

    function randomChar() {
      return codeChars[Math.floor(Math.random() * codeChars.length)];
    }
    function randomColor() {
      return colors[Math.floor(Math.random() * colors.length)];
    }

    function createHeartPath(ctx, cx, cy, s) {
      ctx.beginPath();

      // Main heart body
      ctx.moveTo(cx + s*0.05, cy - s*0.6);
      ctx.bezierCurveTo(cx + s*0.35, cy - s*0.65, cx + s*0.52, cy - s*0.4, cx + s*0.55, cy - s*0.15);
      ctx.bezierCurveTo(cx + s*0.58, cy + s*0.15, cx + s*0.5, cy + s*0.42, cx + s*0.28, cy + s*0.55);
      ctx.bezierCurveTo(cx + s*0.08, cy + s*0.64, cx - s*0.15, cy + s*0.6, cx - s*0.32, cy + s*0.42);
      ctx.bezierCurveTo(cx - s*0.48, cy + s*0.2, cx - s*0.55, cy - s*0.05, cx - s*0.5, cy - s*0.3);
      ctx.bezierCurveTo(cx - s*0.45, cy - s*0.55, cx - s*0.25, cy - s*0.68, cx + s*0.05, cy - s*0.6);
      ctx.closePath();

      // Aortic arch (top-left)
      ctx.moveTo(cx - s*0.12, cy - s*0.48);
      ctx.bezierCurveTo(cx - s*0.32, cy - s*0.72, cx - s*0.18, cy - s*0.95, cx + s*0.02, cy - s*0.85);
      ctx.bezierCurveTo(cx - s*0.08, cy - s*0.9, cx - s*0.22, cy - s*0.65, cx - s*0.08, cy - s*0.46);
      ctx.closePath();

      // Pulmonary trunk (top)
      ctx.moveTo(cx + s*0.08, cy - s*0.52);
      ctx.lineTo(cx + s*0.2, cy - s*0.78);
      ctx.lineTo(cx + s*0.32, cy - s*0.72);
      ctx.lineTo(cx + s*0.2, cy - s*0.48);
      ctx.closePath();

      // Superior vena cava (top-right)
      ctx.moveTo(cx + s*0.3, cy - s*0.45);
      ctx.lineTo(cx + s*0.4, cy - s*0.62);
      ctx.lineTo(cx + s*0.46, cy - s*0.58);
      ctx.lineTo(cx + s*0.36, cy - s*0.42);
      ctx.closePath();
    }

    function computeInsidePoints() {
      insidePoints = [];
      createHeartPath(ctx, cx, cy, heartSize);
      for (var y = charStep; y < h - charStep; y += charStep) {
        for (var x = charStep; x < w - charStep; x += charStep) {
          if (ctx.isPointInPath(x, y)) {
            insidePoints.push({
              x: x, y: y,
              char: randomChar(),
              color: randomColor(),
              phase: Math.random() * Math.PI * 2
            });
          }
        }
      }
    }

    function heartbeatScale(t) {
      var period = 1000;
      var p = (t % period) / period;
      if (p < 0.13) {
        return 1 + Math.sin(p / 0.13 * Math.PI) * 0.06;
      } else if (p < 0.28) {
        return 1 + 0.06 * (1 - (p - 0.13) / 0.15);
      } else if (p < 0.4) {
        return 1 + Math.sin((p - 0.28) / 0.12 * Math.PI) * 0.03;
      }
      return 1;
    }

    function heartbeatGlow(t) {
      var period = 1000;
      var p = (t % period) / period;
      if (p < 0.13) return 20 + Math.sin(p / 0.13 * Math.PI) * 30;
      if (p < 0.28) return 20 + 30 * (1 - (p - 0.13) / 0.15);
      if (p < 0.4) return 20 + Math.sin((p - 0.28) / 0.12 * Math.PI) * 15;
      return 20;
    }

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      cx = w / 2;
      cy = h / 2;
      heartSize = Math.min(w, h) * 0.30;
      computeInsidePoints();
    }

    function draw(now) {
      frame++;
      canvas.__frame = frame;
      var elapsed = now - startTime;

      ctx.fillStyle = 'rgba(40, 60, 60, 0.35)';
      ctx.fillRect(0, 0, w, h);

      var scale = heartbeatScale(elapsed);
      var glow = heartbeatGlow(elapsed);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.translate(-cx, -cy);

      createHeartPath(ctx, cx, cy, heartSize);
      ctx.clip();

      ctx.font = '12px "JetBrains Mono", "Fira Code", "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Expose debug info
      canvas.__insidePointsLen = insidePoints.length;
      canvas.__heartSize = heartSize;

      for (var i = 0; i < insidePoints.length; i++) {
        var pt = insidePoints[i];
        if (frame % 10 === 0 && Math.random() < 0.05) {
          pt.char = randomChar();
          pt.color = randomColor();
        }
        var flicker = Math.sin(elapsed * 0.0025 + pt.phase) * 0.12 + 0.88;
        ctx.globalAlpha = flicker * 0.85;
        ctx.fillStyle = pt.color;
        ctx.fillText(pt.char, pt.x, pt.y);
      }

      ctx.globalAlpha = 1;

      // Interventricular groove shadow
      var s = heartSize;
      ctx.strokeStyle = 'rgba(0, 40, 25, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - s*0.08, cy - s*0.25);
      ctx.bezierCurveTo(cx + s*0.05, cy + s*0.02, cx + s*0.12, cy + s*0.22, cx - s*0.02, cy + s*0.42);
      ctx.stroke();

      ctx.restore();

      // Outer glow stroke
      createHeartPath(ctx, cx, cy, heartSize);
      ctx.shadowColor = '#00ff88';
      ctx.shadowBlur = glow;
      ctx.strokeStyle = 'rgba(0, 255, 136, ' + (0.25 + (glow/50)*0.45) + ')';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.shadowBlur = 0;

      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(draw);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
