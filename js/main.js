


// 
// main loop


// imports
const {sin, cos, random, floor, abs} = Math

function looper(){
    if(this.time === undefined || this.time === null){ this.time = 0; this.delay = 0; }
    // var w = window.innerWidth;
    // var h = window.innerHeight;
    // var ar = h/w;

    creature.targetPoint = [food.xx,food.yy]
    creature2.targetPoint = [food2.xx,food2.yy]
    // console.log('C1 target: ',creature.targetPoint)
    // console.log("C2 target: ", creature2.targetPoint)
    // const radius = 10;
    //creature.accel = 0;
    //setRotation(90+this.time/4, creature)
    // console.log(mouseP, mouseIn)
    //console.log('looping',this.time)
    // console.log('rotation', creature.rotation)
    //console.log(angleOfTargetPoint(mouseP[0],mouseP[1],creature))
    // console.log("creature",creature.turning)

    //console.log("creature1",creature2.turning)
    // console.log(floor(creature.xx), floor(creature.yy))
    // console.log(floor(mouseP[0]), floor(mouseP[1]))


    for(var i=0; i<creatures.length; i++){calc(creatures[i])}
    this.time++;
    setTimeout(()=>{looper();},this.delay)    
}



//
//setup
///////////////////

//declare fundamentals and hierarchy
const creature = document.createElement('div')
creature.innerHTML = '1';
const cpointer = document.createElement('div')
const food = document.createElement('div')
creature.classList.add('creature')
cpointer.classList.add('cpointer')
food.classList.add('food')
const mains = document.body.getElementsByTagName('main')
const main = mains[0]
creature.appendChild(cpointer)
main.appendChild(creature)
main.appendChild(food)

const mouseP = [0,0]
var mouseIn = false;
const creatureStartSize = 5;
const dampC = 0.02;
const dampR = 0.04;

//set initial values of fundamentals
creature.maxSpeed = 1;
creature.accel = 0.01;
creature.vel = [0,0];
creature.spin = 0;
creature.spinAccel = 0.1;
creature.maxSpin = 2;
creature.turning = 0;   //(-1, 0, 1) for CCW, none, CW
creature.targetPoint = null; //becomes vector of location values

setSize(creatureStartSize, creature)
randomColor(creature)
setRotation(90, creature)
setLocation(-50,-50,creature)

const creatures = [];
creatures.push(creature)
const creature2 = cloneCreature(creature)
// food.xx = 0;
// food.yy = 0;
sizeFood(3,food)
positionFood(random()*160-80,random()*160-80,food)


const foods = [];
foods.push(food)
const food2 = cloneFood(food)

// positionFood(-40,-40,food2)

window.addEventListener("mousemove", (evt)=>{
    mouseP[0] = 100*(evt.clientX - window.innerWidth/2) / (window.innerWidth/2)
    mouseP[1] = 100*(evt.clientY - window.innerHeight/2) / (window.innerHeight/2)
    mouseIn = true;
})
window.addEventListener("mouseout", ()=>{
    mouseP[0] = 0
    mouseP[1] = 0
    mouseIn = false;
})
window.addEventListener("resize", ()=>{
    console.log('resize event size',creature.size)
    for(var c of creatures){
        setSize(c.size,c)
    }
    for(var f of foods){
        sizeFood(f.size,f)
    }
    
})

///start app
looper()


function cloneFood(piece){
    const newPiece = piece.cloneNode(true)
    main.appendChild(newPiece)
    // newPiece.xx = 0; newPiece.yy = 0;
    sizeFood(3, newPiece)
    positionFood(random()*160-80,random()*160-80,newPiece)
    foods.push(newPiece)
    return newPiece
}

function positionFood(xx,yy,piece){
    console.log('positioning food to',xx,yy)
    piece.xx = xx;
    piece.yy = yy;
    const size = piece.size;

    if(xx>=0){
        console.log('calc(50% - '+ size/2 + '% + '+(xx/2).toString()+'%)')
        piece.style.setProperty('left','calc(50% - '+ size/2 + '% + '+(xx/2).toString()+'%)')
    }else{
        console.log('calc(50% - '+ size/2 + '% - '+abs(xx/2).toString()+'%)')
        piece.style.setProperty('left','calc(50% - '+ size/2 + '% - '+abs(xx/2).toString()+'%)')
    }

    if(yy>=0){
        console.log('calc(50% - '+ size/2 + '% + '+(yy/2).toString()+'%)')
        piece.style.setProperty('top','calc(50% - '+ size/2 + '% + '+(yy/2).toString()+'%)')
    }else{
        console.log('calc(50% - '+ size/2 + '% - '+abs(yy/2).toString()+'%)')
        piece.style.setProperty('top','calc(50% - '+ size/2 + '% - '+abs(yy/2).toString()+'%)')
    }

}

function sizeFood(num,piece){
    piece.size = num;
    if(window.innerHeight > window.innerWidth){
        piece.style.width = num.toString() + 'vw'
        
    }else{
        piece.style.width = num.toString() + 'vh'
    }
}

function cloneCreature(which){
    const newCreature = which.cloneNode(true)
    main.appendChild(newCreature)
    newCreature.maxSpeed = which.maxSpeed;
    newCreature.accel = which.accel;
    newCreature.vel = [0,0];
    newCreature.spin = 0;
    newCreature.spinAccel = which.spinAccel
    newCreature.maxSpin = which.maxSpin;
    newCreature.turning = 0;
    newCreature.targetPoint = null;
    setSize(creatureStartSize, newCreature)
    randomColor(newCreature)
    setRotation(random()*360, newCreature)
    setLocation(which.xx,which.yy,newCreature)
    creatures.push(newCreature)
    newCreature.innerHTML = creatures.length.toString();
    newCreature.appendChild(cpointer.cloneNode(true))
    return newCreature
}



// screen center is 0,0; x from -100 to 100, y from -100 to 100.
function setLocation(cx, cy, which){
    
    var xx = cx/2;
    var yy = cy/2;
   //console.log('location input',xx,yy)
   const offset = which.size/2;
   const limit = 50+offset;
    if(xx > limit){
        xx = -limit
    }else if(xx < -limit){
        xx = limit
    }

    if(yy > limit){
        yy = -limit
    }else if(yy < -limit){
        yy = limit
    }

    which.xx = xx*2
    which.yy = yy*2;

    if(cx>=0){
        which.style.setProperty('left','calc(50% - '+ which.size/2 + '% + '+xx.toString()+'%)')
    }else{
        which.style.setProperty('left','calc(50% - '+ which.size/2 + '% - '+abs(xx).toString()+'%)')
    }
    
    if(cy>=0){
        which.style.setProperty('top','calc(50% - '+ which.size/2 + '% + '+yy.toString()+'%)')
    }else{
        which.style.setProperty('top','calc(50% - '+ which.size/2 + '% - '+abs(yy).toString()+'%)')
    }
};


function setSize(num, which){
    // console.log('resizing', which)
    which.size = num;
    if(window.innerHeight > window.innerWidth){
        which.style.width = num.toString() + 'vw'
        which.style.fontSize = (num/2.5).toString()+ 'vw'
    }else{
        which.style.width = num.toString() + 'vh'
        which.style.fontSize = (num/2.5).toString()+ 'vh'
    }
    // console.log(which.style.width)
}


function randomColor (which){
    which.style.backgroundColor = 'hsl('+(random()*360).toString()+', 100%, 50%)';
}



function setRotation(deg, which){
    deg = deg % 360
    which.rotation = deg
    which.style.transform = "rotate("+deg.toString()+"deg)"
}



function calc(which){
    const posx = which.xx;
    const posy = which.yy
    const newpos = [posx + which.vel[0] , posy + which.vel[1]]
    setLocation( newpos[0], newpos[1], which )
    setRotation(which.rotation + which.spin, which)


    if(which.targetPoint != null){
        const tp = which.targetPoint
        const goal = angleOfTargetPoint(tp[0],tp[1],which)
        var diff = goal - which.rotation;
        diff = diff%360;
        if(diff<0){
            diff+=360;
        }
        // console.log('goal',goal)
        // console.log('angle',which.rotation)
        //console.log('diff',floor(diff))
        const spinglide = 160;
        if((which.turning != 1) && (diff > which.spin*spinglide) && (diff <= 180) ){
            which.turning = 1;
        }else if((which.turning != -1) && (diff < (360+which.spin*spinglide)) && (diff > 180) ){
            which.turning = -1;
        }else{
            which.turning = 0;
        }
    }else{
        which.turning = 0;
    }

    if(which.turning === 0){
        //do nothing
    }else{
        which.spin *= 1-dampR*which.spin
        which.spin += which.spinAccel*which.turning
        if(which.spin > which.maxSpin ){
            which.spin = which.maxSpin
        }else if(which.spin < -which.maxSpin){
            which.spin = -which.maxSpin
        }
    }

    const dirvec = dirVecFromDeg(which.rotation)
    which.vel[0] *= 1-dampC;
    which.vel[1] *= 1-dampC;

    if(shouldAccel(which)[0]){
        which.vel[0] += dirvec[0]*which.accel
    }
    if(shouldAccel(which)[1]){
        which.vel[1] += dirvec[1]*which.accel
    }

    let speed = Math.sqrt(which.vel[0]**2 + which.vel[1]**2)

    const srat = speed/which.maxSpeed;
    if(srat >1){
        which.vel[0] /= srat
        which.vel[1] /= srat
    }
    
}


function shouldAccel(which){
    const xxc = which.xx;
    const yyc = which.yy;
    const xxt = which.targetPoint[0]
    const yyt = which.targetPoint[1]
    const xv = which.vel[0]
    const yv = which.vel[1]
    const distx = xxt-xxc;
    const disty = yyt-yyc;
    const steps = 40;


    const glidex = xv*steps - dampexp(xv,steps)  
    const glidey = yv*steps - dampexp(yv,steps)  
    

    const goal = angleOfTargetPoint(xxt,yyt,which)
    var diff = goal - which.rotation;
    diff = diff%360;
    if(diff<0){
        diff+=360;
    }
    const range = 20;
    const aimed = (diff<range || diff >(360-range))

    let SAx = aimed && ((distx>0 && distx>glidex) || ( distx<0 && distx<glidex))
    let SAy = aimed && ((disty>0 && disty>glidey) || ( disty<0 && disty<glidey))
    return [SAx, SAy]

}


//returns appropriate rotation angle for which creature to look at target point
function angleOfTargetPoint(xx,yy,which){
    
    var angle = 0;
    var diffx = xx-which.xx
    var diffy = yy-which.yy
    if (diffx > 100){
        diffx = diffx-200;
    }else if (diffx < -100){
        diffx = diffx+200;
    }

    if (diffy > 100){
        diffy = diffy-200;
    }else if (diffy < -100){
        diffy = diffy+200;
    }

    angle = radtodeg(Math.atan2(diffy,diffx))
    angle += 90;
    if (angle < 0){angle+=360}
    else if (angle >=360){
        angle-=360
    }
    // angle = angle % 360
    // console.log(angle)
    return angle
}

function dampexp(speed,gs){
    let ret = speed*dampC;
    let newsp = speed - ret;
    for(let i=1; i<=gs; i++){
        ret += newsp*dampC
        newsp -= ret;
    }
    return ret;
}
function distance(x1,y1,x2,y2){
    return Math.sqrt((x2-x1)**2+(y2-y1)**2)
}

function degtorad(deg){
    return deg/180*Math.PI
}

function radtodeg(rad){
    return rad*180/Math.PI
}

function dirVecFromDeg(deg){
    const dir = [0,0];
    dir[0] = sin(degtorad(deg))
    dir[1] = -cos(degtorad(deg))
    return dir
}



