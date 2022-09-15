const CELL_SIZE = 24;
//行数
const ROWS = 18;
//列数
const COLS = 18;
//控制绘制速度，setTimeout 的第二个参数
let speed = 1;
const PARENT_EL = document.querySelector(".maze");
PARENT_EL.style.width = `${CELL_SIZE*COLS}px`;
PARENT_EL.style.height = `${CELL_SIZE*ROWS}px`;
let grid = [];
let neighbors = [];
let startCell;
let myStack = [];


class Cell {
    constructor(row,col) {
        this.row = row;
        this.col = col;
        this.el = document.createElement("div");
        this.el.classList.add("cell");
        this.el.style.width = `${CELL_SIZE}px`
        this.el.style.height = `${CELL_SIZE}px`
        this.top = this.row * CELL_SIZE;
        this.left = this.col * CELL_SIZE;
        this.visited = false;
    }
    //随机获取到周围的一个
    randomNeighbor() {
        neighbors = []
        if(grid.length === 0) return null
        let cell = null;
        //top
        if(this.row>0) {
            cell = grid.find(cell=>cell.row===this.row-1&&cell.col===this.col)
            if(cell.visited===false) neighbors.push({dir:"top",cell})
        }
        //bottom
        if(this.row<ROWS-1) {
            cell = grid.find(cell=>cell.row===this.row+1&&cell.col===this.col)
            if(cell.visited===false) neighbors.push({dir:"bottom",cell})
        }
        //left
        if(this.col>0) {
            cell = grid.find(cell=>cell.row===this.row&&cell.col===this.col-1)
            if(cell.visited===false) neighbors.push({dir:"left",cell})
        }
        //right
        if(this.col<COLS-1) {
            cell = grid.find(cell=>cell.row===this.row&&cell.col===this.col+1)
            if(cell.visited===false) neighbors.push({dir:"right",cell})
        }
        if(neighbors.length===0) return null;
        let next = neighbors[randInt(0,neighbors.length)];
        next.cell.visited = true;
        myStack.push(next.cell);
        return next
    }
    pathTo(neighbor){
        let dir = neighbor.dir
        let cell = neighbor.cell
        switch (dir){
            case "top":
                this.el.style.borderTop = "1px solid rgb(255,218,149)";
                cell.el.style.borderBottom = "1px solid rgb(255,218,149)";
                break;
            case "bottom":
                this.el.style.borderBottom = "1px solid rgb(255,218,149)";
                cell.el.style.borderTop = "1px solid rgb(255,218,149)";
                break;
            case "left":
                this.el.style.borderLeft = "1px solid rgb(255,218,149)"
                cell.el.style.borderRight = "1px solid rgb(255,218,149)"
                break;
            case "right":
                this.el.style.borderRight = "1px solid rgb(255,218,149)"
                cell.el.style.borderLeft = "1px solid rgb(255,218,149)"
                break;
        }
        cell.el.style.backgroundColor = "red";
    }
    render(){
        this.el.style.left = `${this.left}px`
        this.el.style.top = `${this.top}px`
    }
}

function generateCells(){
    for(let c = 0; c < COLS; c++){
        for(let r = 0;r<ROWS;r++){
            let cell = new Cell(r,c)
            grid.push(cell);
            PARENT_EL.appendChild(cell.el)
        }
    }
    setInterval(function (){
        for(let a = 0; a < grid.length; a++){
            grid[a].render();
        }
    })
    startCell = randOne();
    startCell.visited = true;
    startCell.el.style.backgroundColor = "rgb(255,218,149)";
    myStack.push(startCell)
    if(myStack.length!==0) draw();
}
generateCells();

function randInt(min,max){
    return min + Math.floor(Math.random()*(max-min))
}

function randOne(){
    return grid[randInt(0,grid.length)];
}

function draw(){
    let latest = myStack[myStack.length-1];
    if(latest){
        latest.el.style.backgroundColor = 'rgb(255,218,149)'
        let next = latest.randomNeighbor();
        if(next) {
            latest.pathTo(next)
        }else if(next ===null){
            myStack[myStack.length-1].el.style.backgroundColor = "white"
            console.log(myStack[myStack.length-1].el.style.borderLeft);
            if(myStack[myStack.length-1].el.style.borderLeft.includes("rgb(255, 218, 149)")){
                myStack[myStack.length-1].el.style.borderLeft = "1px solid white"
            }
            if(myStack[myStack.length-1].el.style.borderBottom.includes("rgb(255, 218, 149)")){
                myStack[myStack.length-1].el.style.borderBottom = "1px solid white"
            }
            if(myStack[myStack.length-1].el.style.borderTop.includes("rgb(255, 218, 149)")){
                myStack[myStack.length-1].el.style.borderTop = "1px solid white"
            }
            myStack.pop();
        }
        setTimeout(draw,speed)
        console.log("running")
    }
}
