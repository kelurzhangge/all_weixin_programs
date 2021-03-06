//snake.js
var app = getApp();
var innerAudioContext

Page({
   data:{
        score: 0,//比分
        maxscore: 0,//最高分
        startx: 0,
        starty: 0,
        endx:0,
        endy:0,//以上四个做方向判断来用
        ground:[],//存储操场每个方块
        rows:28,
        cols:22,//操场大小
        snake:[],//存蛇
        speed:500,//蛇速度
        speeded:100,//加速后的速度
        food:[],//存食物
        direction:'',//方向,初识方向设置为right
        modalHidden: true,
        timer:''
   } ,
   onLoad:function(params){
        console.log(params)
        //console.log(params.have_download+","+params.savedFilePath)
    //取缓存中的最高分
       var maxscore = wx.getStorageSync('maxscore');
       if(!maxscore) maxscore = 0
        this.setData({
        maxscore:maxscore
        });
    
        this.initGround(this.data.rows,this.data.cols);//初始化操场
        this.initSnake(3);//初始化蛇
        this.creatFood();//初始化食物
        this.move(this.data.speed);//蛇移动
        this.playbgm(params);//播放背景音乐
   },
   //背景音乐
   playbgm: function(params) {
        if (params.have_download == '1') {
            console.log("have_download is 1")
            var res = wx.getSystemInfoSync()
            console.log("platform is "+res.platform)
            if (res.platform == 'ios') {
                innerAudioContext = wx.getBackgroundAudioManager();
            } else {
                innerAudioContext = wx.createInnerAudioContext();
            }

            innerAudioContext.title= 'bg-music'
            innerAudioContext.autoplay = true
            innerAudioContext.src = params.savedFilePath
        } else {
            console.log("have_download is 0")
            var res = wx.getSystemInfoSync()
            console.log("platform is "+res.platform)
            if (res.platform == 'ios') {
               innerAudioContext = wx.getBackgroundAudioManager();
            } else {
               innerAudioContext = wx.createInnerAudioContext();
            }

            innerAudioContext.title= 'bg-music'
            innerAudioContext.autoplay = true
            innerAudioContext.src = 'http://jsdx.sc.chinaz.com/Files/DownLoad/sound1/201610/7895.wav'
        }
   },
   //计分器
    storeScore:function(){

      if(this.data.maxscore < this.data.score){
      this.setData({
        maxscore:this.data.score
        })
        wx.setStorageSync('maxscore', this.data.maxscore)
      }
  },
  //操场，二维数组初始化成操场，
    initGround:function(rows,cols){
        for(var i=0;i<rows;i++){
            var arr=[];
            this.data.ground.push(arr);
            for(var j=0;j<cols;j++){
        //操场颜色为0
                this.data.ground[i].push(0);
            }
        }
    },
   //蛇
   initSnake:function(len){
       for(var i=0;i<len;i++){
            /*if (i == 0) {
                this.data.ground[0][i]='tail';
            } else */if (i == len-1) {
                this.data.ground[0][i]='header';
            } else {
                this.data.ground[0][i]='body';
            }
      //初始化蛇，蛇的颜色为1
           //this.data.ground[0][i]=1;
      //存蛇的坐标
           this.data.snake.push([0,i]);
       }
   },
   //移动函数
   move:function(speed){
       var that=this;
    //设定定时器
       this.data.timer=setInterval(function(){
            that.changeDirection(that.data.direction);
            that.setData({
                ground: that.data.ground
            })
       }, speed);

   },
  //手指触摸起始位置
    tapStart: function(event){
        this.setData({
            startx: event.touches[0].pageX,
            starty: event.touches[0].pageY
            })
    },
  //手指移动
    tapMove: function(event){
      //长按操作。。。
      // 停止setInterval循环
      clearInterval(this.data.timer)
      // 设置长按速度
      this.move(this.data.speeded)

        this.setData({
            endx: event.touches[0].pageX,
            endy: event.touches[0].pageY
            })
    },
  //触摸结束位置计算
    tapEnd: function(event){
    // 停止setInterval循环
      clearInterval(this.data.timer)
    // 恢复加速前的速度
      this.move(this.data.speed)
    //取横向坐标迁移值与纵向坐标迁移值
        var heng = (this.data.endx) ? (this.data.endx - this.data.startx) : 0;
        var shu = (this.data.endy) ? (this.data.endy - this.data.starty) : 0;

    //迁移值大于5才视为用户有滑动意图
        if(Math.abs(heng) > 5 || Math.abs(shu) > 5){
      //计算方向，heng>shu则为横向移动，反之为纵向移动
            var direction = (Math.abs(heng) > Math.abs(shu)) ? this.computeDir(1, heng):this.computeDir(0, shu);
      //限制不能反向移动
            switch(direction){
            case 'left':
                if(this.data.direction=='right')return;
                break;
            case 'right':
                if(this.data.direction=='left')return;
                break;
            case 'top':
                if(this.data.direction=='bottom')return;
                break;
            case 'bottom':
                if(this.data.direction=='top')return;
                break;
            default:
        }
      //更改蛇移动的方向
        this.setData({
        startx:0,
        starty:0,
        endx:0,
        endy:0,
        direction:direction
        })
        
    }
    },
  //若为横向移动，heng值大于0向右，小于零向左；纵向移动，shu值大于0为下，小于0为上
    computeDir: function(heng, num){
    if(heng) return (num > 0) ? 'right' : 'left';
    return (num > 0) ? 'bottom' : 'top';
    },
    creatFood:function(){
        for(;;) {
            var x=Math.floor(Math.random()*this.data.rows);
            var y=Math.floor(Math.random()*this.data.cols);

            var arr = this.data.snake;
            var len=this.data.snake.length;
            var is_fold_flag = 0;//是否重叠标记
            for(var i=0;i<len;i++){
                console.log("arr[i] is"+arr[i][0]+arr[i][1]); 
                if (x == arr[i][0] && y == arr[i][1]) {//食物与蛇的位置重叠，继续获取新的位置
                    continue;
                } else {
                    is_fold_flag++;
                }
            };
            /*console.log("is_fold_flag is"+is_fold_flag)
            console.log("food is ("+x+","+y+")")
            console.log("snake is "+this.data.snake)
            console.log("snake length is "+this.data.snake.length)*/
            if (is_fold_flag == len) { //食物位置没有和蛇的位置重叠，则跳出，说明找到了合适的位置
                break;
            }
        }
        
        var ground= this.data.ground;
        
    //食物颜色为2
        ground[x][y]=2;
    //更新ground数据，存食物位置
        this.setData({
            ground:ground,
            food:[x,y]
        });
    },
    changeDirection:function(dir){
        console.log("imahere changeDirection func"+ dir + "end")
        switch(dir){
        case 'left':
            return this.changeLeft();
            break;
        case 'right':
            return this.changeRight();
            break;
        case 'top':
            return this.changeTop();
            break;
        case 'bottom':
            return this.changeBottom();
            break;
        default:
        }
    },
    changeLeft:function(){
        
        var arr=this.data.snake;
        var len=this.data.snake.length;
        var snakeHEAD=arr[len-1][1];
        var snakeTAIL=arr[0];
        var ground=this.data.ground;
        ground[snakeTAIL[0]][snakeTAIL[1]]=0;  
        for(var i=0;i<len-1;i++){
                arr[i]=arr[i+1];   
        };

        var x=arr[len-1][0];
        var y=arr[len-1][1]-1;
        arr[len-1]=[x,y];
            this.checkGame(snakeTAIL);
        for(var i=0;i<len;i++){
            /*if (i == 0) {
                ground[arr[i][0]][arr[i][1]]='tail';
            } else */if (i == len-1) {
                ground[arr[i][0]][arr[i][1]]='header_'+this.data.direction;
            } else {
                ground[arr[i][0]][arr[i][1]]='body_'+this.data.direction;
            }
            //ground[arr[i][0]][arr[i][1]]=1;
        } 
        
        this.setData({
                ground:ground,
            snake:arr
        });
        
        return true;
    },
    changeRight:function(){
        
        var arr=this.data.snake;
        var len=this.data.snake.length;
        var snakeHEAD=arr[len-1][1];
        var snakeTAIL=arr[0];
        var ground=this.data.ground;
        ground[snakeTAIL[0]][snakeTAIL[1]]=0;  
        for(var i=0;i<len-1;i++){
                arr[i]=arr[i+1];   
        };

        var x=arr[len-1][0];
        var y=arr[len-1][1]+1;
        arr[len-1]=[x,y];
        this.checkGame(snakeTAIL);
        for(var i=0;i<len;i++){
            /*if (i == 0) {
                ground[arr[i][0]][arr[i][1]]='tail';
            } else */if (i == len-1) {
                ground[arr[i][0]][arr[i][1]]='header_'+this.data.direction;
            } else {
                ground[arr[i][0]][arr[i][1]]='body_'+this.data.direction;
            }
            //ground[arr[i][0]][arr[i][1]]=1;

        } 
        
        this.setData({
                ground:ground,
            snake:arr
        });
        
        
    //    var y=this.data.snake[0][1];
    //    var x=this.data.snake[0][0];
    //     this.data.ground[x][y]=0;
    //     console.log(this.data.ground[x]);
    //      console.log(this.data.snake);
    //     for(var i=0;i<this.data.snake.length-1;i++){
    //         this.data.snake[i]=this.data.snake[i+1];
    //     }
    //     this.data.snake[this.data.snake.length-1][1]++;
    //     for(var j=1;j<this.data.snake.length;j++){
    //         this.data.ground[this.data.snake[j][0]][this.data.snake[j][1]]=1;
    //     }
        return true;
    },
    changeTop:function(){
        
        var arr=this.data.snake;
        var len=this.data.snake.length;
        var snakeHEAD=arr[len-1][1];
        var snakeTAIL=arr[0];
        var ground=this.data.ground;
        ground[snakeTAIL[0]][snakeTAIL[1]]=0;  
        for(var i=0;i<len-1;i++){
                arr[i]=arr[i+1];   
        };

        var x=arr[len-1][0]-1;
        var y=arr[len-1][1];
        arr[len-1]=[x,y];
            this.checkGame(snakeTAIL);
        for(var i=0;i<len;i++){
            /*if (i == 0) {
                ground[arr[i][0]][arr[i][1]]='tail';
            } else */if (i == len-1) {
                ground[arr[i][0]][arr[i][1]]='header_'+this.data.direction;
            } else {
                ground[arr[i][0]][arr[i][1]]='body_'+this.data.direction;
            }
            //ground[arr[i][0]][arr[i][1]]=1;
        } 
        this.setData({
            ground:ground,
            snake:arr
        });
      
        return true;
    },
    changeBottom:function(){
        /*1.蛇的红点框先一下一下的消失start*/
        var arr=this.data.snake;
        var len=this.data.snake.length;
        var snakeHEAD=arr[len-1];
        var snakeTAIL=arr[0];
        var ground=this.data.ground;
        
        ground[snakeTAIL[0]][snakeTAIL[1]]=0;  
        for(var i=0;i<len-1;i++){
                arr[i]=arr[i+1];   
        };
        /*2.找到往前走的这一步(方块)的位置(x,y)*/
        var x=arr[len-1][0]+1;
        var y=arr[len-1][1];
        arr[len-1]=[x,y];
        this.checkGame(snakeTAIL);
        /*3.找到snake显示需要的点，并赋值1*/
        for(var i=0;i<len;i++){
            /*if (i == 0) {
                ground[arr[i][0]][arr[i][1]]='tail';
            } else */if (i == len-1) {
                ground[arr[i][0]][arr[i][1]]='header_'+this.data.direction;
            } else {
                ground[arr[i][0]][arr[i][1]]='body_'+this.data.direction;
            }
            //ground[arr[i][0]][arr[i][1]]=1;
        } 
        this.setData({
            ground:ground,
            snake:arr
        });
        return true;
    },
    checkGame:function(snakeTAIL){
        var arr=this.data.snake;
        var len=this.data.snake.length;
        var snakeHEAD=arr[len-1];
        /*1.上下左右临界，限制在ground框中*/
        if(snakeHEAD[0]<0||snakeHEAD[0]>=this.data.rows||snakeHEAD[1]>=this.data.cols||snakeHEAD[1]<0){
                clearInterval(this.data.timer);
                this.setData({
                modalHidden: false,
                    })  
                //停止播放背景音乐
                innerAudioContext.stop();
                    
        }
        /*2.判断蛇尾和蛇身是否等于蛇头位置*/
        for(var i=0;i<len-1;i++){
            if(arr[i][0]==snakeHEAD[0]&&arr[i][1]==snakeHEAD[1]){
                clearInterval(this.data.timer);
                    this.setData({
                        modalHidden: false,
                    })
                    //停止播放背景音乐
                    innerAudioContext.stop();
            }
        }
        if(snakeHEAD[0]==this.data.food[0]&&snakeHEAD[1]==this.data.food[1]){
            arr.unshift(snakeTAIL);//在arr开头增加一个元素，蛇身变长一个方格
            this.setData({
                score:this.data.score+10
            });
            this.storeScore();
            this.creatFood();
        }
        
        
    },
    modalChange:function(){
        this.setData({
                score: 0,
            ground:[],
            snake:[],
                food:[],
                modalHidden: true,
                direction:''
        })
    
        //this.onLoad();
        var bgm_file_path = wx.getStorageSync('bgm_file_path');
        if (bgm_file_path) {
          wx.redirectTo({
            url: '/pages/snake/snake?have_download=1&savedFilePath='+bgm_file_path
          })
        }  else {
            wx.redirectTo({
                url: '/pages/snake/snake?have_download=0'
            })
        }
        
    }

  
});
