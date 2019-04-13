let screen = document.getElementById("screen").children[0];
let cxt = screen.getContext("2d");
////console.log(screen.clientWidth / 560.0, screen.clientHeight / 560.0);
cxt.scale(screen.clientWidth / 560.0, screen.clientHeight / 560.0)

var blockWidth = 35,
    blockHeight = 35;
var curMap; //当前的地图
var curLevel; //当前等级的地图
// var player=document.getElementById("player"); //玩家
var curPlayer;
var playerPosition
var iCurlevel = 0; //当前关卡数
var moveTimes = 0; //移动了多少次
var moveHistory = {
    his: [],
    push: (arrayIn) => {
        moveTimes++;
        if (this.his.length > 40) {
            this.his.shift()
        }
        return this.his.push(arrayIn)
    },
    pop: () => {
        
        let popMap=this.his.pop()
        if (typeof(popMap) != "undefined") {
            moveTimes--;
            return popMap;
        }else{
            alert("已经无法撤销了，如有需要请点重置按钮");
            return curMap;
        }
        return curMap;
    },
    clean: () => {
        his = [];
    }
}; //记录移动历史
var imageInfo = [{
        name: "block",
        src: "image/block.png"
    },
    {
        name: "wall",
        src: "image/wall.png"
    },
    {
        name: "box1",
        src: "image/box1.png"
    },
    {
        name: "box2",
        src: "image/box2.png"
    },
    {
        name: "trap",
        src: "image/trap.png"
    },
    {
        name: "up",
        src: "image/up.png"
    },
    {
        name: "down",
        src: "image/down.png"
    },
    {
        name: "left",
        src: "image/left.png"
    },
    {
        name: "right",
        src: "image/right.png"
    }
]
var block, wall, box1, box2, trap, up, down, left, right;

function imgPreload(imageInfo, callback) {
    let count = 0,
        Num = imageInfo.length,
        images = {};
    for (let i = 0; i < imageInfo.length; i++) {
        const img = imageInfo[i];
        images[img.name] = new Image();
        images[img.name].onload = function () {
            if (++count >= Num) {
                callback(images);
            }
        }
        images[img.name].src = img.src;
        // //console.log(images)
    }
}

imgPreload(imageInfo, function (imageInfo) {
    ////console.log(images.block);
    block = imageInfo.block;
    wall = imageInfo.wall;
    box1 = imageInfo.box1;
    box2 = imageInfo.box2;
    trap = imageInfo.trap;
    up = imageInfo.up;
    down = imageInfo.down;
    left = imageInfo.left;
    right = imageInfo.right;
    init();
});
//返回一个位置为xy的点的记录
function Position(x, y) {
    this.x = x;
    this.y = y;
    if (x < 0 || y < 0 || x > 16 || y > 16) {
        this.curInfo = -1;
        this.defInfo = -1;
    } else {
        this.curInfo = curMap[x][y]; //读取当前
        if (maps[iCurlevel][x][y] === 4 || maps[iCurlevel][x][y] === 3) {
            this.defInfo = 0;
        } else if (maps[iCurlevel][x][y] === 5) {
            this.defInfo = 2;
        } else {
            this.defInfo = maps[iCurlevel][x][y]
        } //读取默认地图位置,但是忽略任务和箱子记录
    }

}

function init() {
    moveTimes=0;//重置步数
    curMap = copyArr(maps[iCurlevel]); //构建用于缓存的地图
    curLevel = maps[iCurlevel]; //当前等级的初始地图
    curPlayer = down; //初始化小人
    moveHistory.clean();
    playerPosition = new Position(5, 5); //设置小人位置，数值随意 因为在接下来会被修改
    DrawMap(curMap); //绘制出当前等级的地图
}

async function DrawMap(mapInfo) {
    for (var i = 0; i < 16; i++) {
        for (var j = 0; j < 16; j++) {
            ////console.log(blockHeight, blockWidth)
            cxt.drawImage(block, blockWidth * j, blockHeight * i, blockWidth, blockHeight);
        }
    }
    for (var i = 0; i < 16; i++) {
        for (var j = 0; j < 16; j++) {
            var pic = block; //初始图片

            switch (mapInfo[i][j]) {
                case 1: //墙壁
                    pic = wall;
                    break;
                case 2: //陷阱
                    pic = trap;
                    break;
                case 3: //箱子
                    pic = box1;
                    break;
                case 4: //玩家
                    pic = curPlayer; //小人有四个方向 具体显示哪个图片需要和上下左右方位值关联
                    // 获取小人的坐标位置
                    playerPosition = new Position(i, j);
                    if (playerPosition.defInfo == 2) {
                        let pic = trap;
                        await cxt.drawImage(pic, blockWidth * j - (pic.width - blockWidth) / 2, blockHeight * i - (pic.height - blockHeight), pic.width, pic.height)
                    }
                    break;
                case 5: //绘制箱子及陷进位置
                    pic = box2;
                    break;
            }
            
            //每个图片不一样宽 需要在对应地板的中心绘制地图
           await cxt.drawImage(pic, blockWidth * j - (pic.width - blockWidth) / 2, blockHeight * i - (pic.height - blockHeight), pic.width, pic.height)
        }
    }
    await showInfo()
}

function tryMoving(direction) {
    //console.log(direction);
    var point1;
    var point2;
    var Acce = Array(0, 2) //point2需要为这两者才能推动
    switch (direction) {
        case "up":
            curPlayer = up;
            //获取小人前面的两个坐标位置来进行判断小人是否能够移动
            point1 = new Position(playerPosition.x - 1, playerPosition.y);
            point2 = new Position(playerPosition.x - 2, playerPosition.y);
            break;
        case "down":
            curPlayer = down;
            point1 = new Position(playerPosition.x + 1, playerPosition.y);
            point2 = new Position(playerPosition.x + 2, playerPosition.y);
            break;
        case "left":
            curPlayer = left;
            point1 = new Position(playerPosition.x, playerPosition.y - 1);
            point2 = new Position(playerPosition.x, playerPosition.y - 2);
            break;
        case "right":
            curPlayer = right;
            point1 = new Position(playerPosition.x, playerPosition.y + 1);
            point2 = new Position(playerPosition.x, playerPosition.y + 2);
            break;

    }
    //判断人物是否能够移动

    switch (point1.curInfo) {
        case -1:
            return false;
            break;
        case 0:
            curMap[point1.x][point1.y] = 4; //将人向前移
            curMap[playerPosition.x][playerPosition.y] = playerPosition.defInfo; //将人原来的位置重置
            playerPosition = new Position(point1.x, point1.y)
            return true;
            break;
        case 1: //前方一格为墙壁
            return false;
            break;
        case 2: //前方一格为陷阱
            curMap[playerPosition.x][playerPosition.y] = playerPosition.defInfo;
            curMap[point1.x][point1.y] = 4;
            playerPosition = new Position(point1.x, point1.y);
            break;
        case 3:
            if (Acce.indexOf(point2.curInfo) !== -1) {
                curMap[point2.x][point2.y] += 3; //将箱子向前推
                curMap[point1.x][point1.y] = 4; //将人向前移
                curMap[playerPosition.x][playerPosition.y] = playerPosition.defInfo; //将人原来的位置重置
                playerPosition = new Position(point1.x, point1.y)
            } else {
                return false;
            }
            break;
        case 5: //与前方是箱子相同
            if (Acce.indexOf(point2.curInfo) !== -1) {
                curMap[point2.x][point2.y] += 3; //将箱子向前推
                curMap[point1.x][point1.y] = 4; //将人向前移
                curMap[playerPosition.x][playerPosition.y] = playerPosition.defInfo; //将人原来的位置重置
            } else {
                return false;
            }
            break;
        default:
            break;
    }
    return true;
}

// //console.log(screen,screen.clientWidth,screen.clientHeight)
function ListenKey(event) {
    ////console.log(moveHistory)
    moveHistory.push(copyArr(curMap)) //将现有的地图数据入栈
    let acceAble = false;
    let code;
    if (!event.keyCode) {
        code=event;//响应按钮点击
    } else {
        code=event.keyCode;
    }
    switch (code) {
        case 37: //左键头
            acceAble = tryMoving("left");
            break;
        case 38: //上键头
            acceAble = tryMoving("up");
            break;
        case 39: //右箭头
            acceAble = tryMoving("right");
            break;
        case 40: //下箭头
            acceAble = tryMoving("down");
            break;
        default:
            return true;
            break;
    }

    DrawMap(curMap).then(function () {
        let Finish = true;
        for (let i = 0; i < curMap.length; i++) {
            const element = curMap[i];
            if (element.indexOf(3) != -1) { //寻找箱子的位置，如果存在不处于陷阱位置的箱子就认为没有通过
                Finish = false;
                ////console.log(element,element.indexOf(3))
                break;
            }
        }

        if (Finish) {
            sleep(20).then(() => {
                alert("恭喜过关！！");
                setLevel(iCurlevel + 1);
            })
        }
    });
    if (!acceAble) {
        moveHistory.pop(); //如果方案不可行 出栈
    }
}

function setLevel() {
    let level = document.getElementById("level").value-1;
    if (!Number.isInteger(level)) {
        alert("请输入1-100的正整数");

        return false;
    }
    iCurlevel = level;
    if (iCurlevel>maps.length-1) {
        iCurlevel=maps.length-1
        alert("请输入100以及以下的数字");
        return false;
    }
    if (iCurlevel<0) {
        iCurlevel=0
        alert("请输入1以及以上的数字");
        return false;
    }
    init();
}

function nextLevel(){
    iCurlevel++;
    if (iCurlevel>maps.length-1) {
        iCurlevel=maps.length-1
        alert("本游戏一共只有"+maps.length+"关");
    }
    init();
}
function previousLevel(){
    iCurlevel--;
    iCurlevel=iCurlevel<0?0:iCurlevel;
    init();
}
document.onkeydown = ListenKey
//延迟执行
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function Prev() {

    let popMap = moveHistory.pop();
    curMap = copyArr(popMap);
    DrawMap(curMap);
}
//二维数组深拷贝
function copyArr(obj) {
    var out = [],
        i = 0,
        len = obj.length;
    for (; i < len; i++) {
        if (obj[i] instanceof Array) {
            out[i] = this.copyArr(obj[i]);
        } else out[i] = obj[i];
    }
    return out;
}

function showInfo() {
    let gameInfoNode=document.getElementById("gameInfo").children;
    gameInfoNode[0].textContent="当前第"+(iCurlevel+1)+"关";
    gameInfoNode[1].textContent="你移动了"+moveTimes+"步";
    document.getElementById("level").value=iCurlevel+1;
}