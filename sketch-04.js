import canvasSketch from 'canvas-sketch';
import random from 'canvas-sketch-util/random';
import math from 'canvas-sketch-util/math';
import { Pane } from 'tweakpane';


const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const params = {
  cols: 24,
  rows: 200,
  scaleMin: 3.15,
  scaleMax: 1,
  freq: 0.0005,
  amp: 5.22,
  lineCap: 'Butt',
  frame: 0,
  animate: true,
  speed: 15,
  stroke: 1.99,
  strokeColor: 'rgba(255, 206, 206, 1)',
  backgroundColor: 'rgba(67, 60, 60, 1)',
  style: 'line'
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = params.backgroundColor;
    context.fillRect(0, 0, width, height);

    const cols = params.cols;
    const rows = params.rows;
    const numCells = cols * rows;
  
    const gridWidth = width * 0.8;
    const gridHeight = height * 0.8;
    const cellWidth = gridWidth / cols;
    const cellHeight = gridHeight / rows;
    const marginX = (width - gridWidth) * 0.5;
    const marginY = (height -  gridHeight) * 0.5;

    for ( let i = 0; i < numCells; i ++) {
      const col = i % cols;
      const row = Math.floor( i / cols);

      /* x, y values of each cell */
      const x = col * cellWidth;
      const y = row * cellHeight;
       /*e cell width and height values */
      const w = cellWidth * 0.8;
      const h = cellHeight * 0.8;

  
      const animateFrame = params.animate ? frame * params.speed : params.frame;
      /* noise2D returns a number between -1 and 1 */
      /* frame to change the speed of the animation */
      //const randomNoise = random.noise2D(x + frame * 30, y, params.freq);

      /* 3D */
    
   
      const randomNoise = random.noise3D(x, y, animateFrame , params.freq);

      /* use randomNoise to set the angle of rotation of the line in the grid*/
      /* noise2D returns a number between -1 and 1 then multipy by Math.PI 
      return -180 degree to 180 degree */
      const angle = randomNoise * Math.PI * params.amp;

      /* change scale of the lines */
     /*  randomNoise range is between -1 and 1 
      the lineScale will need to in the range of 0 - 1 */
     /*  const lineScale = (randomNoise + 1) / 2  * 30; */

     /* option 2 use the mapRange */

     const lineScale = math.mapRange( randomNoise, -1, 1 ,params.scaleMin, params.scaleMax)

      context.save();

      context.translate(x,y);
      context.translate(marginX, marginY);
      context.translate(cellWidth * 0.5, cellHeight * 0.5)
      context.rotate(angle);

      context.lineWidth = lineScale;
      context.lineCap = params.lineCap;


      context.beginPath();

      /* draw line */
      /* context.moveTo(w * - params.stroke , 0);
      context.lineTo(w * params.stroke , 0); */

     /*  draw circle */
    //  const drawCicle = context.arc(0, 0,  params.stroke, 0, 2 * Math.PI);
     
      if (params.style === "line") {
        context.moveTo(w * - params.stroke , 0);
        context.lineTo(w * params.stroke , 0);
      } else {
        context.arc(0, 0,  params.stroke, 0, 2 * Math.PI);
      }

      context.strokeStyle = params.strokeColor;
      context.stroke();
     

      context.restore();
    }
  };
};



/* TweakPane */

  const pane = new Pane();
  let folder;

  /* Grid folder */
  folder = pane.addFolder({
    title: 'Grid',
  });

  folder.addInput(params, 'cols', {min: 2, max: 200, step: 1});
  folder.addInput(params, 'rows', {min: 2, max: 200, step: 1});

  /* Stroke folder */
  folder = pane.addFolder({
    title: 'Stroke',
  });
  folder.addInput(params, 'scaleMin', {min: 1, max: 100});
  folder.addInput(params, 'scaleMax', {min: 1, max: 100});
  folder.addInput(params, 'stroke', {min: 0.01, max: 3});
  
  /* Path Folder */
  folder = pane.addFolder({
    title: 'Draw Path'
  })

  folder.addInput(params, 'style', {
    options: {
      Line: 'line',
      Circle: 'circle'
    }
  });

  /* Noise folder */
  folder = pane.addFolder({
    title: 'Noise'
  })

    folder.addInput(params, 'freq', { 
      min: -0.01, 
      max: 0.1,
    });
    folder.addInput(params, 'amp', { 
      min: 0,
      max: 60
    });

  /* Line Cap folder */
  folder = pane.addFolder({
    title: 'LineCap'
  })
  
    folder.addInput(params, 'lineCap', {
      options: {
        Butt: 'butt',
        Round: 'round',
        Square: 'square'
      }
    });

    /* Animation folder */
    folder = pane.addFolder({
      title: 'Animation'
    })
    
    const toggleAnimation = folder.addInput(params, 'animate');
    const animatSpeed = folder.addInput(params, 'speed', {
      min: 15, 
      max: 300, 
      hidden: false
    });
    const frame = folder.addInput(params, 'frame', {
      min: 0, 
      max: 999, 
      hidden: true
    });

    toggleAnimation.on('change', () => {
        frame.hidden = !frame.hidden;
        animatSpeed.hidden = !animatSpeed.hidden;
    });
    

     /* Color folder */
     folder = pane.addFolder({
      title: 'Colors'
    })
    folder.addInput(params, 'strokeColor', {
      picker: 'inline', 
      expanded: true}
      );
    folder.addInput(params, 'backgroundColor', {
      picker: 'inline', 
      expanded: true
    });

    canvasSketch(sketch, settings);