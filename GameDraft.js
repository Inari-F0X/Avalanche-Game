//create the canvas which would hold the game area

var rightPressed=false
var leftPressed=false
var upPressed=false
var downPressed=false

document.body.addEventListener("keydown",keyDownHandler,false)
document.body.addEventListener("keyup",keyUpHandler,false)

function keyDownHandler(pressed) {
    if(pressed.key  == "ArrowRight") {
        rightPressed = true;
    }
    else if(pressed.key  == "ArrowLeft") {
        leftPressed = true;
    }
    else if(pressed.key  == "ArrowUp") {
        upPressed = true;
    }
    else if(pressed.key  == "ArrowDown") {
        downPressed = true;
    }
}
function keyUpHandler(pressed) {
    if(pressed.key  == "ArrowRight") {
        rightPressed = false;
    }
    else if(pressed.key  == "ArrowLeft") {
        leftPressed = false;
    }
    else if(pressed.key  == "ArrowUp") {
        upPressed = false;
    }
    else if(pressed.key  == "ArrowDown") {
        downPressed = false;
    }
}
var Box=[]

var brick1={
    width: 70,
    height: 70
}

var brick2={
    width: 50,
    height: 50
}
var player

var canvas ={
    area:document.createElement("canvas"),
    start: function(){
        this.area.width=500
        this.area.height=500
        this.context=this.area.getContext("2d")
        document.body.insertBefore(this.area,document.body.childNodes[0])
        this.frameNo=0
        this.interval=setInterval(updateGame,20)
    },
    clear:function(){
        this.context.clearRect(0,0,this.area.width,this.area.height)
    },
    stop: function(){
        clearInterval(this.interval)
    }

}


// when page is loaded, start the game
function OnStart(){

    //inital positon of player
    player=new gameObject(30,30,"blue",250-30,10,"t","player")
    
    //load the dimensions of the canvas
    canvas.start()
}
//create the objects/player--constructor
function gameObject(width,height,source,x,y,type,objType){
    //object dimensions
    this.width=width
    this.height=height
    this.x=x
    this.y=y
    this.type=type
    this.speedX=0;
    this.speedY=5;
    this.objType=objType
    this.grounded=false
    this.crash=false
    this.LeftCollider=false
    this.RightCollider=false
    this.TopCollider=false

    // Determine whether this is an image or not
    if(this.type=="image"){
        this.image=new Image()
        this.image.src=source
        this.update=function(){
            ctx=canvas.context
            ctx.drawImage(this.image,this.x,this.y,this.width,this.height)
        }
    }else{
        this.update=function(){
            ctx=canvas.context
            ctx.fillStyle=source
            ctx.fillRect(this.x,this.y,this.width,this.height)
        }
    }
    //update position of said object
    this.newPos=function(){
        this.x+=this.speedX
        this.y+=this.speedY
    }
    

    //movement of the object
    this.movement=function(){
        if (rightPressed){
            if(this.RightCollider==false){
                this.speedX=2
            }
        }
        else if(leftPressed){
            if(this.LeftCollider==false){
                this.speedX=-2
            }
        }
        else if (upPressed){
            if(this.grounded){
                this.speedY=-100
            }
        }
        else{
            this.speedX=0
        
        }
    }
    
    
    this.collider=function(Otherobj){
        var objLeft=this.x
        var objRight=this.x+(this.width)
        var objTop=this.y
        var objBottom=this.y+(this.height)
        var otherLeft=Otherobj.x
        var otherRight=Otherobj.x+(Otherobj.width)
        var otherTop=Otherobj.y
        var otherBottom=Otherobj.y+(Otherobj.height)
        this.crash =false

        // Vertical Collider variables
        var between1=objLeft>=otherLeft
        var between2=objRight<=otherRight
        var inLeft1=objLeft>otherLeft
        var inLeft2=objLeft<otherRight
        var inRight1=objRight<otherRight
        var inRight2=objRight>otherLeft
        var VerticalCollider=((between1&&between2)||(inLeft1&&inLeft2)||(inRight1&&inRight2))

        //Horizontal Collider 
        var Hbetween1=objTop>otherTop
        var Hbetween2=objBottom<=otherBottom
        var inTop1= objBottom<otherBottom
        var inTop2=objBottom>otherTop
        var inBottom1=objTop>otherTop
        var inBottom2=objTop<otherBottom
        var HorizontalCollider=((Hbetween1&&Hbetween2)||(inTop1&&inTop2)||(inBottom1&&inBottom2))
        
        //determine whether the object is the player or box
        if (this.objType=="player"){

            // determine if player is on the ground
            if((objBottom==canvas.area.height)||(VerticalCollider&&objBottom==otherTop)){
                this.speedY=0
                this.grounded=true
            }

            //determin if player has crashed
            if(((between1&&between2)||(inLeft1&&inLeft2)||(inRight1&&inRight2))&&this.grounded==true&&objTop==otherBottom){
                this.crash=true
            }
     
           if(HorizontalCollider&&objLeft==otherRight){
                this.LeftCollider=true
                this.x=otherRight
                this.speedX=0
           }
           if(HorizontalCollider&&objRight==otherLeft){
                this.RightCollider=true
                this.x=otherLeft-this.width
                this.speedX=0
           }
           
           
           if(VerticalCollider&&(objTop<=otherBottom&&objTop>otherTop)){
               this.y=otherBottom
               this.speedY=5
           }
           
            
        }
        else{
            if((objBottom==canvas.area.height)||(VerticalCollider&&objBottom==otherTop)){
                this.speedY=0
                this.grounded=true

            }
        }
        return this.crash
    }

}

//update the game
function updateGame(){
    var x , c,y,BHeight,BWidth,gamewidth,color;
    player.grounded=false
    player.RightCollider=false
    player.LeftCollider=false
    //check for collision for player
    for(i=49;i<Box.length;i+=50){
        if(player.collider(Box[i])){
            canvas.stop()
            return
        }
    }
    
    for(i=49;i<Box.length;i+=50){
        for(j=49;j<Box.length;j+=50){
            if(i==j){
                continue
            }
         Box[i].collider(Box[j])
        }
    }

    //clear the game
    canvas.clear()

    // send obstacles
    canvas.frameNo+=1
    if(everyinterval(50)){
        c=Math.floor(Math.random()*2)
        gamewidth=canvas.area.width
        switch(c){
        case 0:
            BHeight=brick1.height
            BWidth=brick1.width
            y=0-BHeight
            x=Math.floor(Math.random()*(500-BWidth)/2)*2
            color="green"
            break;
        
        case 1:
            BHeight=brick2.height
            BWidth=brick2.width
            y=0-BHeight
            x=Math.floor(Math.random()*(500-BWidth)/2)*2
            color="red"
            break;    
         }
    }
    Box.push(new gameObject(BWidth,BHeight,color,x,y,"pic","box"))
   


    //update position of player/obstacles
    
    player.movement()
    player.newPos()
    player.update()
    if(!player.ground){
        player.speedY=5
    }
    for(i=49;i<Box.length;i+=50){
        Box[i].newPos()
        Box[i].update()
        
    }
    //update camera view 

}

function everyinterval(n) {
    if ((canvas.frameNo / n) % 1 == 0) {
        return true;
    }
    return false;
}

