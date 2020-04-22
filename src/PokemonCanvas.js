
import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import '../styles/WaveViewer.scss';

import { BlockPageScroll } from './BlockPageScroll';

var x = "black",
y = 2;
const WV_WIDTH = 512;
const WV_HEIGHT = 512;

function Create2DArray(rows,cols) {
    var x = new Array(rows);

    for (var i = 0; i < x.length; i++) {
      x[i] = new Array(cols);
      x[i].fill(0);
    }
    
    return x;
}

class PokemonCanvas extends Component {
    constructor() {
      super();
  
      this.state = {
          config: "config",
          rows: 100,
          cols: 100,
          width: WV_WIDTH, 
          height: WV_HEIGHT
      }
      this.cvRef = React.createRef();
  
        this.prevX =  0;
        this.currX =  0;
        this.prevY =  0;
        this.currY =  0;
    
      this.flag = false;
      this.dot_flag = false;
      this.cells = Create2DArray(this.state.rows, this.state.cols);
    }
  
    /**
     * Render the initial layout of the canvas and set the default values upon mount
     */
    componentDidMount() {
      // set the canvas props
      let cv = this.cvRef.current;
      let ctx = cv.getContext('2d');
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#fff';
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.save();
  
    //   window.addEventListener("resize", this.handleResize);
    }

   draw() {
       let {width, height,rows, cols} = this.state;
        let cv = this.cvRef.current;
        let ctx = cv.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(this.prevX, this.prevY);
        ctx.lineTo(this.currX, this.currY);
        ctx.strokeStyle = x;
        ctx.lineWidth = y;
        ctx.stroke();
        ctx.closePath();


       
        let incSteps = 10;
        let xStart = Math.min(this.prevX, this.currX);
        let xEnd = Math.max(this.prevX, this.currX);
        let xStep = (xEnd - xStart) / incSteps;
        let yStart = Math.min(this.prevY, this.currY);
        let yEnd = Math.max(this.prevY, this.currY);
        let yStep = (yEnd - yStart) / incSteps;
        for (let i = xStart; i < xEnd; i += xStep){
            for (let j = yStart; j < yEnd; j += yStep){
                this.cells[ Math.floor(j / width * cols)][Math.floor(i / height * rows)] = 1;
            }
        }

        let config = rows + " " + cols + "\n";
        let r,c;
        for (r = 0; r < this.state.rows; r ++){
            for (c = 0; c< this.state.cols; c++){
                
                if (this.cells[r][c] === 1){
                   config += r + " " + c + " \n";
                }
            }
        }

        this.setState({
            config: config
        })

        this.drawCells();
    }

    drawCells(){
        let r,c;
        let cv = this.cvRef.current;
        let ctx = cv.getContext('2d');
        let cellHeight = this.state.height / this.state.rows;
        let cellWidth = this.state.width / this.state.cols;

        for (r = 0; r < this.state.rows; r ++){
            for (c = 0; c< this.state.cols; c++){
                
                if (this.cells[r][c] === 1){
                    ctx.beginPath();
                    ctx.strokeStyle = x;
                    ctx.lineWidth = y;
                    ctx.fillRect( c * cellWidth, r * cellHeight, cellWidth, cellHeight);
                    ctx.stroke();   
                }
            }
        }

    }

    findxy(res, e) {
        let cv = this.cvRef.current;
        let ctx = cv.getContext('2d');
        if (res == 'down') {
            this.prevX = this.currX;
            this.prevY = this.currY;
            this.currX = e.clientX - cv.offsetLeft;
            this.currY = e.clientY - cv.offsetTop;
    
            this.flag = true;
            this.dot_flag = true;
            if (this.dot_flag) {
                ctx.beginPath();
                ctx.fillStyle = x;
                ctx.fillRect(this.currX, this.currY, 2, 2);
                ctx.closePath();
                this.dot_flag = false;
            }
 
        }
        if (res == 'up' || res == "out") {
            this.flag = false;
        }
        if (res == 'move') {
            if (this.flag) {
                this.prevX = this.currX;
                this.prevY = this.currY;
                this.currX = e.clientX - cv.offsetLeft;
                this.currY = e.clientY - cv.offsetTop;
           
                this.draw();
            }
        }
       
    }
  
    mouseup(e) {
        this.findxy('up', e)
    }
    mouseout(e) {
        this.findxy('out', e)
    }
    mousedown(e) {
        this.findxy('down', e)
    }
    mousemove(e) {
        this.findxy('move', e)
    }
 
 
    render() {

      return (
        <div className="wave-viewer">
          {/* <BlockPageScroll> */}
      <div> rows:{this.state.rows}&nbsp;
            cols:{this.state.cols} 
      </div>
            <canvas
              style = {{
                position: 'relative',
                // width: '100vw',
                backgroundColor: 'white',
                border: '1px solid #000000',
                top: '9.75vh',
            }}
              ref={this.cvRef}
              width={this.state.width}
              height={this.state.height}
              onMouseDown={e => this.mousedown(e)}
              onMouseMove={e => this.mousemove(e)}
              onMouseUp={e => this.mouseup(e)}
              onMouseOut={e => this.mouseout(e)}
            ></canvas>

            <textarea  
            style = {{
                position: 'relative',
                // width: '100vw',
                backgroundColor: 'white',
                border: '1px solid #000000',
                top: '9.75vh',
                height: '512px',
            }} value = {this.state.config}>
              
          </textarea>
          {/* </BlockPageScroll> */}
   
        </div>
      );
    }
  }
  export default PokemonCanvas;
