

// imports
const {sin, cos, random, floor, abs} = Math
let trialNum = trunc(random()*10000000,7)
//
//setup
///////////////////

// //declare fundamentals and hierarchy
const logOption = document.createElement('div')
logOption.classList.add('log-option')
const checkboxLog = document.createElement('input')  //checkboxes[0]
checkboxLog.type = "checkbox"
checkboxLog.classList.add('checkbox-log')
const checknote = document.createTextNode(`Log mutations to Local Storage: (Check to record)  (F5 to start new)`)

checkboxLog.addEventListener('change', ()=>{

    if(checkboxLog.checked){
        checknote.nodeValue = `(Log mutations to Local Storage: recording trial ${trialNum} )  (F5 to start new)`
    }else{
        trialNum = trunc(random()*10000000,7)
        checknote.nodeValue = `(Log mutations to Local Storage: not saving )  (F5 to start new)`
    }
})

const stats = document.createElement('div')
stats.classList.add('stats')


const statsOption = document.createElement('div')
statsOption.classList.add('stats-option')
const checkboxStats = document.createElement('input')  //checkboxes[0]
checkboxStats.type = "checkbox"
checkboxStats.classList.add('checkbox-stats')

const statsToggleLabel = document.createTextNode('Display Stats')

checkboxStats.addEventListener('change', ()=>{

    if(checkboxStats.checked){
        stats.style.display = "block"
    }else{
        stats.style.display = "none"
    }
})



const leaderDisplay = document.createElement('div')
leaderDisplay.classList.add("leader-display")
const statsDisplay = document.createElement('table')
statsDisplay.classList.add('stats-display')



const creature = document.createElement('div') 
creature.innerHTML = '1';
const cpointer = document.createElement('div')
const food = document.createElement('div')
creature.classList.add('creature')
cpointer.classList.add('cpointer')
food.classList.add('food')
const mains = document.body.getElementsByTagName('main')
const main = mains[0]


stats.appendChild(leaderDisplay)
stats.appendChild(statsDisplay)
creature.appendChild(cpointer)
logOption.appendChild(checkboxLog)
logOption.appendChild(checknote)
statsOption.appendChild(checkboxStats)
statsOption.appendChild(statsToggleLabel)
main.appendChild(creature)
main.appendChild(food)
main.appendChild(logOption)
main.appendChild(statsOption)
main.appendChild(stats)
//set environment
const mouseP = [0,0]
var mouseIn = false;
var firstframe = true;
var famNum = 0;
var leader = creature

const creatureStartSize = 5;
const creatureStartCount = 12;

const familyStats = new Array(creatureStartCount)
const foodStartCount = 300;
const dampC = 0.02;
const dampR = 0.04;

const creatures = [];
const foods = [];
const starveRate = 0.001; //0.001
const minimumSize = 2;
const puberty = 10;
const foodRate = 1;
const mutationRate = 0.25;
const foodStartSize = 1;
const growthRate = 1;
const divideloss = 2;
//set starting creature parameters
creature.maxSpeed = 0.2; //0.1
creature.accel = 0.02;//0.01
creature.spinAccel = 0.1;//0.1
creature.maxSpin = 2; //2
creature.range = 100; //100
creature.spinglide = 160; //160
creature.glidesteps = 40; //40
creature.aimrange = 20; //20

//set initial values of fundamentals
creature.familyNumber = -1;
creature.generation = 1;
creature.vel = [0,0];
creature.spin = 0;
creature.turning = 0;   //(-1, 0, 1) for CCW, none, CW
creature.target = null; //becomes vector of location values
creature.eatCount = 0;

setSize(creatureStartSize, creature)
randomColor(creature)
setRotation(60, creature)
setLocation(-50,-50,creature)
sizeFood(foodStartSize,food)
const xrand = random()*160;
const yrand = random()*160;
positionFood(parseInt(xrand)-80,parseInt(yrand)-80,food)

foods.push(food)
creatures.push(creature)

function looper(){

    if(this.time === undefined || this.time === null){ this.time = 0; this.delay = 0; }
    
    
    
    if(firstframe){
        for(let i = 0; i< creatureStartCount; i++){
            cloneCreature(creature)
        }
        kill(creature)
        for(let i = 1; i< foodStartCount; i++){
            cloneFood(food)
        }
    }

    if(this.time%floor(100/foodRate) === 0){
        cloneFood(food)
    }

    leaderDisplay.style.backgroundColor = leader.style.backgroundColor
    leaderDisplay.innerText = "Leader: Gen " +leader.generation.toString()+", Score " +leader.eatCount.toString()
    statsDisplay.innerHTML = ""
    const tHead = statsDisplay.createTHead();
    const head = tHead.insertRow(0)
    head.insertCell(0).innerHTML = "<b>Max Gen</b>"
    head.insertCell(1).innerHTML = "<b>Members</b>"
    for(let f in familyStats){
        const row = statsDisplay.insertRow(i)
        const cell1 = row.insertCell(0)
        cell1.innerHTML = familyStats[f].maxGen
        cell1.style.backgroundColor = familyStats[f].familyColor
        const cell2 = row.insertCell(1)
        cell2.innerHTML = familyStats[f].count
        cell2.style.backgroundColor = familyStats[f].familyColor
    }   

    // const row1 = statsDisplay.insertRow(0)
    // const cell1 = row1.insertCell(0)
    // cell1.innerHTML = "hmmmmmm"
    
    for(var i=0; i<creatures.length; i++){
        calc(creatures[i])
    }
    this.time++;
    firstframe = false;
    setTimeout(()=>{looper();},this.delay)    
}


//////////
//per frame calcs
//////////

function calc(which){
    setSize(which.size-starveRate,which)
    // console.log(which.size)
    if(which.size<minimumSize){
        kill(which)
    }

    calcNearestTarget(which)
    
    const newpos = [which.xx + which.vel[0] , which.yy + which.vel[1]]
    setLocation( newpos[0], newpos[1], which )
    setRotation(which.rotation + which.spin, which)
    calcTurn(which)
    calcSpin(which)
    const dirvec = dirVecFromDeg(which.rotation)
    

    which.vel[0] = which.vel[0]*(1-dampC);
    which.vel[1] = which.vel[1]*(1-dampC);
    
    if(shouldAccel(which)[0]){
        which.vel[0] += dirvec[0]*which.accel
    }
    if(shouldAccel(which)[1]){
        which.vel[1] += dirvec[1]*which.accel
    }
  
    
    let spx = which.vel[0]**2
    let spy = which.vel[1]**2
    let sp = spx + spy
    
    let speedsq = sp
    let speed = Math.sqrt(speedsq)

    
    const srat = speed/which.maxSpeed;
    
    if(srat >1){
        which.vel[0] = which.vel[0]/srat
        which.vel[1] = which.vel[1]/srat
    }
    
}








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
    sizeFood(foodStartSize, newPiece)
    positionFood(random()*160-80,random()*160-80,newPiece)
    foods.push(newPiece)
    return newPiece
}

function positionFood(xx,yy,piece){
    piece.xx = xx;
    piece.yy = yy;
    const size = piece.size;

    if(xx>=0){
        piece.style.setProperty('left','calc(50% - '+ size/2 + '% + '+(xx/2).toString()+'%)')
    }else{
        piece.style.setProperty('left','calc(50% - '+ size/2 + '% - '+abs(xx/2).toString()+'%)')
    }

    if(yy>=0){
        piece.style.setProperty('top','calc(50% - '+ size/2 + '% + '+(yy/2).toString()+'%)')
    }else{
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
    newCreature.vel = [random()*2-1,random()*2-1];
    newCreature.spin = 0;
    newCreature.spinAccel = which.spinAccel
    newCreature.maxSpin = which.maxSpin;
    newCreature.turning = 0;
    newCreature.target = null;
    newCreature.range = which.range;
    newCreature.spinglide = which.spinglide
    newCreature.glidesteps = which.glidesteps
    newCreature.aimrange = which.aimrange
    newCreature.eatCount = 0;
    newCreature.familyNumber = which.familyNumber
    setSize(creatureStartSize, newCreature)
    newCreature.style.backgroundColor = which.style.backgroundColor
    setRotation(random()*360, newCreature)
    setLocation(which.xx,which.yy,newCreature)
    creatures.push(newCreature)
    newCreature.generation = which.generation + 1;
    newCreature.innerHTML = '<div style="margin-top: 15%"}>'+newCreature.generation.toString() + "</div>"+"<div>" + newCreature.eatCount.toString()+"</div>";
    newCreature.appendChild(cpointer.cloneNode(true))
    mutate(newCreature)

    //set initials of first family members
    if(famNum<creatureStartCount){
        // console.log('newfamily',famNum)
        newCreature.style.backgroundColor = 'hsla(' + (famNum*360/creatureStartCount).toString() + ', 100%, 50%,0.5)';
        setLocation(random()*160-80,random()*160-80,newCreature)
        newCreature.vel = [0,0]
        newCreature.familyNumber = famNum
        familyStats[famNum] = {
            familyNum: famNum
            ,familyColor: newCreature.style.backgroundColor
            ,members: [newCreature]
            ,maxGen: newCreature.generation
            ,count: 1
        }
        famNum++
    }else{
        // console.log(familyStats)
        const fnum = newCreature.familyNumber
        const fams = familyStats.filter((e,i)=>{
            return e.familyNum === fnum
        })
        // console.log('fams',fams)
        const fam = fams[0]
        // console.log('fam',fam)
        // console.log(familyStats)
        fam.members.push(newCreature)
        if(newCreature.generation > fam.maxGen){
            fam.maxGen = newCreature.generation
        }
        fam.count++
    }

    return newCreature
}

function mutate(which){
    which.maxSpeed *= 1+(random()*2-1)*mutationRate    // 0.2; //1
    which.accel *= 1+(random()*2-1)*mutationRate    // 0.002;//0.01
    which.spinAccel *= 1+(random()*2-1)*mutationRate    // 0.05;//0.1
    which.maxSpin *= 1+(random()*2-1)*mutationRate    // 1; //2
    which.range *= 1+(random()*2-1)*mutationRate  // 50; //100
    which.spinglide *= 1+(random()*2-1)*mutationRate   // 60; //160
    which.glidesteps *= 1+(random()*2-1)*mutationRate    // 1; //40
    which.aimrange *= 1+(random()*2-1)*mutationRate      //20; //20
         // 20; //20

    which.maxSpeed = trunc(which.maxSpeed)
    which.accel = trunc(which.accel)
    which.spinAccel = trunc(which.spinAccel)
    which.maxSpin = trunc(which.maxSpin)
    which.range = trunc(which.range)
    which.spinglide = trunc(which.spinglide)
    which.glidesteps = trunc(which.glidesteps)
    which.aimrange = trunc(which.aimrange)

    // console.log('Mutation new stats ')
    // console.log('generation: ',which.generation)
    // console.log('familycolor', which.style.backgroundColor)
    // console.log('maxSpeed',which.maxSpeed  )     // 0.2; //1
    // console.log('accel',which.accel     )  // 0.002;//0.01
    // console.log('spinAccel',which.spinAccel )      // 0.05;//0.1
    // console.log('maxSpin',which.maxSpin   )    // 1; //2
    // console.log('range',which.range     )  // 50; //100
    // console.log('spinglide',which.spinglide )      // 60; //160
    // console.log('glidesteps',which.glidesteps)       // 1; //40
    // console.log('aimrange',which.aimrange  )        //20; //20

    if(checkboxLog.checked){
        const storagekey = 'EvolveTrial'+trialNum.toString()
        var localData = JSON.parse(localStorage.getItem(storagekey))
        if(localData===null){
            localData = []
        }
        localData.push(
            { generation: which.generation 
            , familycolor: which.style.backgroundColor
            , accel: which.accel
            , spnAccel: which.spinAccel
            , maxSpin: which.maxSpin
            , range: which.range
            , spinglide: which.spinglide
            , glidesteps: which.glidesteps
            , aimrange: which.aimrange
            }
        )
        localStorage.setItem(storagekey, JSON.stringify(localData))
    }
}

// screen center is 0,0; x from -100 to 100, y from -100 to 100.
function setLocation(cx, cy, which){
    var xx = cx/2;
    var yy = cy/2;
   const offset = 0//which.size/2;
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
    which.size = num;
    if(window.innerHeight > window.innerWidth){
        which.style.width = num.toString() + 'vw'
        which.style.fontSize = (num/2.5).toString()+ 'vw'
    }else{
        which.style.width = num.toString() + 'vh'
        which.style.fontSize = (num/2.5).toString()+ 'vh'
    }
}


function randomColor (which){
    which.style.backgroundColor = 'hsla(' + (random()*360).toString() + ', 100%, 50%,0.5)';
}


function setRotation(deg, which){
    deg = deg % 360
    which.rotation = deg
    which.style.transform = "rotate("+deg.toString()+"deg)"
}

function kill(which){
    //family stats adjust
    const fn = which.familyNumber
    // console.log(fn)
    if(fn >= 0){
        const fams = familyStats.filter((e,i)=>{
            return e.familyNum === fn
        })
        const family = fams[0]
        const findex = familyStats.indexOf(family)
        const members = family.members
        const fmindex = members.indexOf(which)

        members[fmindex] = null
        members.splice(fmindex,1)
        family.maxGen = 0;
        for(let m = 0; m<members.length; m++){
            const member = members[m]
            if(member.generation > family.maxGen){
                family.maxGen = member.generation
            }
        }
        family.count--
        // console.log(family.count)
        if(family.count === 0){
            console.log('family ', fn, ' extinct')
            familyStats.splice(findex,1)
        }
        // console.log(familyStats[fn])
    }
    
    const cindex = creatures.indexOf(which)
    which.remove();
    creatures[cindex] == null
    creatures.splice(cindex,1)

}


function calcNearestTarget(which){
    if (foods.length === 0){ which.target = null; return}
    const potentials = []
    const distances = []
    for(let f of foods){
        const diffx = abs(f.xx-which.xx)
        const diffy = abs(f.yy-which.yy)
        if(diffx>which.range || diffy>which.range) continue;
        const dist = distance(which.xx,which.yy, f.xx,f.yy)
        if (dist<which.range){ potentials.push(f); distances.push(dist)}
    }
    if (potentials.length === 0){which.target = null; return}
    let closest = 0 //index of closest potential target
    for(let i in distances){
        i = parseInt(i)
        if(distances[i]<distances[closest]){
            closest = i
        }
    }
    which.target = potentials[closest]
    
    const consumeRange = which.size/2 + potentials[closest].size/2-1
    if(distances[closest]<consumeRange){
        eatTheFood(which)
    }
}

function eatTheFood(which){
    const findex = foods.indexOf(which.target)
    foods[findex].remove()
    foods[findex] = null
    foods.splice(findex,1)
    which.target = null;
    setSize(which.size + growthRate, which)
    which.eatCount++;
    if(which.eatCount>leader.eatCount){
        leader = which;
    }
    // console.log(leader)
    which.innerHTML = '<div style="margin-top: 15%"}>'+which.generation.toString() + "</div>"+"<div>" + which.eatCount.toString()+"</div>";
    which.appendChild(cpointer.cloneNode(true))
    if(which.size > puberty){
        cloneCreature(which)
        setSize(which.size/divideloss, which)
    }
}

function calcSpin(which){
    if(!(which.turning === 0)){
        which.spin *= 1-trunc(dampR*which.spin)
        which.spin += which.spinAccel*which.turning
        if(which.spin > which.maxSpin ){
            which.spin = which.maxSpin
        }else if(which.spin < -which.maxSpin){
            which.spin = -which.maxSpin
        }
    }
}

function calcTurn(which){
    if(which.target != null){
        const tp = [which.target.xx, which.target.yy]
        const goal = angleOfTargetPoint(tp[0],tp[1],which)
        var diff = goal - which.rotation;
        diff = diff%360;
        if(diff<0){
            diff+=360;
        }
        
        if((which.turning != 1) && (diff > which.spin*which.spinglide) && (diff <= 180) ){
            which.turning = 1;
        }else if((which.turning != -1) && (diff < (360+which.spin*which.spinglide)) && (diff > 180) ){
            which.turning = -1;
        }else{
            which.turning = 0;
        }
    }else{
        which.turning = 0;
    }
}

function shouldAccel(which){
    if (which.target == null) {return [true,true]};

    const xxc = which.xx;
    const yyc = which.yy;
    const xxt = which.target.xx
    const yyt = which.target.yy
    const xv = which.vel[0]
    const yv = which.vel[1]
    const distx = xxt-xxc;
    const disty = yyt-yyc;
    


    const glidex = xv*which.glidesteps - dampexp(xv,which.glidesteps)  
    const glidey = yv*which.glidesteps - dampexp(yv,which.glidesteps)  
    

    const goal = angleOfTargetPoint(xxt,yyt,which)
    var diff = goal - which.rotation;
    diff = diff%360;
    if(diff<0){
        diff+=360;
    }
    const underrange = (diff < which.aimrange)
    const overrange = (diff > (360 - which.aimrange));
    const aimed = (underrange || overrange);

    let SAx = aimed && ((distx>0 && distx>glidex) || ( distx<0 && distx<glidex));
    let SAy = aimed && ((disty>0 && disty>glidey) || ( disty<0 && disty<glidey));
    return [SAx, SAy];

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

    angle = radtodeg(trunc(Math.atan2(diffy,diffx)))
    angle += 90;
    if (angle < 0){angle+=360}
    else if (angle >=360){
        angle-=360
    }
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
    return Math.sqrt(trunc((x2-x1)**2)+trunc((y2-y1)**2))
}

function degtorad(deg){
    return deg/180*Math.PI
}

function radtodeg(rad){
    return rad*180/trunc(Math.PI)
}

function dirVecFromDeg(deg){
    const dir = [0,0];
    dir[0] = sin(degtorad(deg))
    dir[1] = -cos(degtorad(deg))
    return dir
}


function trunc(val, prec = 8){
    const stringnum = val.toPrecision(prec)
    let decp = 0
    let dpfound = false;
    let firstdnfound = false;
    let lastdigit = '1';
    for(let i=0; i<stringnum.length; i++){
        const std = stringnum[i]
        if(std==='.'){dpfound=true}
        if(dpfound){
            if(std!='0'){firstdnfound = true}
        }
        if(dpfound && firstdnfound){
            if(lastdigit==='0'&&std=='0') break
            decp++
            lastdigit = std
        }
    }
    let ret = +parseFloat(val.toPrecision(prec)).toFixed(decp)
    if(typeof(ret) != "number"){throw new Error}
    return ret
}