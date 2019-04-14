// 这部分代码主要用于处理一些分辨率和适配手机
// 判断是否是手机，使用userAgent判断
function IsPC() {
    let userAgentInfo = navigator.userAgent;
    let Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"
    ];
    let flag = true;
    for (let v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

if (!IsPC()) {
    classChange()
// 阻止浏览器滚动
    let mql = window.matchMedia('(orientation: portrait)')
   if (!mql.matches) {
           alert("请旋转屏幕后刷新继续游戏")//目前只适配了竖屏手机 横屏会出提示
    } 
    let body = document.getElementsByTagName("body");
    let width = window.screen.availWidth;//读取当前宽度
    let height = window.screen.availHeight;//读取当前高度
    let screen = document.getElementById("screen");
    let can = screen.children[0]
    screen.style.width = width + 'px';
    screen.style.height = width + 'px';
    can.width = width;
    can.height = width;
    body[0].className="Mobile";//设置标签
    body[0].style.width = width + 'px';
    body[0].style.height = height + 'px';   
} else {
    document.getElementsByTagName("body")[0].className = "Pc"
    let can = document.getElementById("screen").children[0];
    document.getElementById("blank").innerHTML="<p style='padding-top:20px'>使用上下左右进行游戏</p>"
    can.width = 600;
    can.height = 600;
}

function classChange() {
    // 切换mobile与pc的一部分ui
    let x = window.screen.availWidth/480.0;
    let y = (window.screen.availHeight -30-window.screen.availWidth)/290.0;
    console.log(x,y)
    let scale=x>y?y:x;
    var contral= document.getElementById("contral");
    contral.style.left=(window.screen.availWidth/2.0)+"px";
    contral.style.bottom=(window.screen.availHeight -50-window.screen.availWidth)/2.0+"px";
    contral.style.transform="scale("+scale+","+scale+")"//缩放控制区以适配不同的设备
    let buttons=document.getElementsByClassName("button-large");

    //修改按钮大小
    for (let i = 0; i < buttons.length; i++) {
        const element = buttons[i];
        console.log(element)
        element.classList.remove("button-block","button-rounded")
        element.classList.add("button-box")
    }
    document.getElementById("back").innerHTML="<i class='fas fa-angle-double-left'></i>";//将按钮修改为图标
    document.getElementById("refresh").innerHTML="<i class='fas fa-redo-alt'></i>"
    // document.getElementById("setLevel").innerHTML="<i class='fas fa-paper-plane'></i>"
    document.getElementById("setLevel").innerHTML="GO"    
    document.getElementById("level").classList.add("button","button-caution","button-large","button-box")    
    // document.getElementById("contral").style.transform="scale("+scale+","+scale+")"
}