/////////   DOM ELEMENTS    ////////////////////////////////////////////

    const container=document.querySelector(".container");
    const nextpiece=document.querySelector(".nextpiece");
    const start=document.querySelector("#start");
    const left=document.querySelector("#left");
    const right=document.querySelector("#right");
    const down=document.querySelector("#down");
    const drop=document.querySelector("#drop");
    const rotatebutton=document.querySelector("#rotate");
    const scorevalue=document.querySelector("#scorevalue");
    const linesvalue=document.querySelector("#lines");
    const highscorevalue=document.querySelector("#highscore");
    const help=document.querySelector("#help");
    const scoring=document.querySelector("#scoring");
    const level=document.querySelector("#level");

/////////   GLOBAL VARIABLES  /////////////////////////////////////////
    let content=[];
    let nextpiececontent=[];
    let curr=[];
    const shapes=[setO,setI,setL,set_L,setZ,set_Z,setT];
    let intervalId;
    let nextshape=setRandom();
    let isrunning=false;
    let score=0;
    let highscore=0;
    let lines=0;
    level.value=2;
    let timedelay=500;
    let cardout=false;

///////     AUDIO   //////////////////////////////////////////////////

const click=new Audio("click.wav");
const rotation=new Audio("rotation.wav");
const bottom=new Audio("reachbottom.wav");
const gameover=new Audio("gameover.wav");

////////    MAIN    ///////////////////////////////////////////////////

    for(let i=0;i<22;i++){
        let temp=[];
        for(let j=0;j<12;j++){
            temp.push(document.createElement("div"));
            temp[j].className="box";
            container.append(temp[j]);
        }
        content.push(temp);
    }
    for(let i=0;i<22;i++)content[i][0].classList.add("focus","borderfocus");
    for(let i=1;i<12;i++)content[0][i].classList.add("focus","borderfocus");
    for(let i=1;i<22;i++)content[i][11].classList.add("focus","borderfocus");
    for(let i=1;i<11;i++)content[21][i].classList.add("focus","borderfocus");

    for(let i=0;i<6;i++){
        let temp=[];
        for(let j=0;j<6;j++){
            temp.push(document.createElement("div"));
            // temp[j].className="box";
            nextpiece.append(temp[j]);
        }
        nextpiececontent.push(temp);
    }
    // game();

/////////   EVENT LISTENERS     ///////////////////////////////////////
    document.querySelector("#more").onclick=()=>{
        if(cardout)document.querySelector("#levelcard").style.left="-300px";
        else document.querySelector("#levelcard").style.left="10px";
        cardout=!cardout;
    }

    level.onchange=()=>{timedelay=(600)-(50*level.value);
        document.querySelector("#levelnumber").textContent="LEVEL "+level.value;
    }

    help.addEventListener("mouseenter",()=>{
        document.querySelector("#helpcard").style.zIndex="2";
    })
    help.addEventListener("mouseleave",()=>{
        document.querySelector("#helpcard").style.zIndex="-1";
    })

    scoring.addEventListener("mouseenter",()=>{
        document.querySelector("#scoringcard").style.zIndex="2";
    })
    scoring.addEventListener("mouseleave",()=>{
        document.querySelector("#scoringcard").style.zIndex="-1";
    })

    document.addEventListener("keydown",(event)=>{
        console.log(event);
        if(event.key=="ArrowRight"){
            click.play();
            moveRight();
        }
        else if(event.key=="ArrowLeft"){
            click.play();
            moveLeft();
        }
        else if(event.key=="ArrowUp")rotate();
        else if(event.key=="ArrowDown"){
            click.play();
            if(moveDown())score++;
            
        }
        else if(event.key=="Enter"){
            let i=0;
            while(moveDown())i++;
            score+=(i*2);
        }
    });

    start.onclick=()=>{
        if(isrunning) return ;
        isrunning=true;
        game();
    }
    left.onclick=()=>{
        click.play();
        moveLeft();
    }
    right.onclick=()=>{
        click.play();
        moveRight();
    }
    down.onclick=()=>{
        click.play();
        if(moveDown())score++;
    }
    drop.onclick=()=>{
        let i=0;
        while(moveDown())i++;
        score+=(i*2);
    }
    rotatebutton.onclick=()=>{
        rotate();
    }

/////////   FUNCTIONS   ///////////////////////////////////////////////

    async function game(){
        clearboard();
        score=0;
        lines=0;
        setScore();
        setLines();
        while(nextshape()){
            focus(curr);
            console.log("game running");
            nextshape=setRandom();
            displayNext(nextshape);
            await rundown();
            completeRows();
        }
        gameover.play();
        isrunning=false;
        highscore=(score>highscore)?score:highscore;
        highscorevalue.textContent=highscore;
        console.log("Game over");
    }

    function rundown(){
        return new Promise((resolve,reject)=>{
            intervalId=setInterval(()=>{
                setScore();
                if(moveDown()==false){
                    clearInterval(intervalId);
                    bottom.play();
                    resolve("finished rundown");
                }
            },timedelay);
        });
    }

    function completeRows(){
        let rows=[curr[0][0],curr[1][0],curr[2][0],curr[3][0]];
        rows.sort((a,b)=>{return a-b;});
        for(let i of rows){
            let j=-1;
            console.log(i);
            if(isRowFull(i)){
                lines++;
                setLines();
                clearRow(i);
                j++;
            }
            if(j>=0)score+=((1<<j)*100);
        }
    }

    function isRowFull(i){
        for(let j=1;j<11;j++){
            if(content[i][j].classList.contains("focus")==false) return false;
        }
        return true;
    }

    // function isRowEmpty(i){
    //     for(let j=1;j<11;j++){
    //         if(content[i][j].calssList.contains("focus")) return false;
    //     }
    //     return true;
    // }

    function clearRow(i){
        for(let j=i;j>1;j--){
            for(let k=1;k<11;k++)content[j][k].classList=content[j-1][k].classList;
        }
        for(let k=1;k<11;k++)content[1][k].classList.remove("focus");
    }

    function setRandom(){
        let i=Math.floor(Math.random()*7);
        return shapes[i];
    }
    
    function displayNext(nextpiece){
        for(let i=1;i<5;i++){
            for(let j=1;j<5;j++)nextpiececontent[i][j].classList.remove("focus","box");
        }
        if(nextpiece==setO)focusnext([[2,2],[2,3],[3,2],[3,3]]);
        else if(nextpiece==setI)focusnext([[2,1],[2,2],[2,3],[2,4]]);
        else if(nextpiece==setL)focusnext([[1,2],[2,2],[3,2],[3,3]]);
        else if(nextpiece==set_L)focusnext([[1,3],[2,3],[3,2],[3,3]]);
        else if(nextpiece==setZ)focusnext([[2,2],[2,1],[3,2],[3,3]]);
        else if(nextpiece==set_Z)focusnext([[2,2],[2,3],[3,2],[3,1]]);
        else if(nextpiece==setT)focusnext([[2,2],[2,1],[2,3],[3,2]]);
    }

    function rotate(){
        rotation.play();
        let mi=curr[1][0],mj=curr[1][1];
        let boxes=[];
        for(let i=0;i<4;i++){
            boxes.push([mi-mj+curr[i][1],mi+mj-curr[i][0]]);
        }
        unfocus(curr);
        if(isitpossible(boxes))curr=boxes;
        focus(curr);
    }

    function moveDown(){
        unfocus(curr);
        for(let i=0;i<4;i++)curr[i][0]++;
        if(!isitpossible(curr)){
            for(let i=0;i<4;i++)curr[i][0]--;
            focus(curr);
            return false;
        }
        focus(curr);
        return true;
    }

    function moveRight(){
        unfocus(curr);
        for(let i=0;i<4;i++)curr[i][1]++;
        if(!isitpossible(curr))for(let i=0;i<4;i++)curr[i][1]--;
        focus(curr);
    }

    function moveLeft(){
        unfocus(curr);
        for(let i=0;i<4;i++)curr[i][1]--;
        if(!isitpossible(curr))for(let i=0;i<4;i++)curr[i][1]++;
        focus(curr);
    }

    function setI(){
        curr=[[1,4],[1,5],[1,6],[1,7]];
        return isitpossible(curr);
    }

    function setT(){
        curr=[[1,4],[1,5],[1,6],[2,5]];
        return isitpossible(curr);
    }

    function setL(){
        curr=[[1,4],[1,5],[1,6],[2,4]];
        return isitpossible(curr);
    }

    function set_L(){
        curr=[[1,4],[1,5],[1,6],[2,6]];
        return isitpossible(curr);
    }

    function setZ(){
        curr=[[1,4],[1,5],[2,5],[2,6]];
        return isitpossible(curr);
    }

    function set_Z(){
        curr=[[1,6],[1,5],[2,5],[2,4]];
        return isitpossible(curr);
    }

    function setO(){
        curr=[[2,6],[2,5],[1,5],[1,6]];
        return isitpossible(curr);
    }

    function isitpossible(boxes){
        if(content[boxes[0][0]][boxes[0][1]].classList.contains("focus")||
        content[boxes[1][0]][boxes[1][1]].classList.contains("focus")||
        content[boxes[2][0]][boxes[2][1]].classList.contains("focus")||
        content[boxes[3][0]][boxes[3][1]].classList.contains("focus")) return false;
        return true;
    }

    function focus(boxes){
        for(let i=0;i<4;i++)
        content[boxes[i][0]][boxes[i][1]].classList.add("focus");
    }

    function unfocus(boxes){
        for(let i=0;i<4;i++)
        content[boxes[i][0]][boxes[i][1]].classList.remove("focus");
    }

    function focusnext(boxes){
        for(let i=0;i<4;i++)
        nextpiececontent[boxes[i][0]][boxes[i][1]].classList.add("focus","box");
    }

    function unfocusnext(boxes){
        for(let i=0;i<4;i++)
        nextpiececontent[boxes[i][0]][boxes[i][1]].classList.remove("focus");
    }

    function clearboard(){
        for(let i=1;i<21;i++){
            for(let j=1;j<11;j++){
                content[i][j].classList.remove("focus");
            }
        }
    }

    function setScore(){
        scorevalue.textContent=score;
    }
    function setLines(){
        linesvalue.textContent=lines;
    }