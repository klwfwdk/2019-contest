
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
    let mql = window.matchMedia('(orientation: portrait)')
   if (!mql.matches) {
           alert("请旋转屏幕后刷新继续游戏")
    } 
    let body = document.getElementsByTagName("body");
    let width = window.screen.width > window.screen.height ? window.screen.height : window.screen.width;
    let height = window.screen.width < window.screen.height ? window.screen.height : window.screen.width;
    let screen = document.getElementById("screen");
    let can = screen.children[0]
    console.log(can)
    screen.style.width = width + 'px';
    screen.style.height = width + 'px';
    can.width = width;
    can.height = width;
    body[0].className="Mobile";
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
    let x = window.screen.width/480.0;
    let y = (window.screen.height-30-window.screen.width)/290.0;
    console.log(x,y)
    let scale=x>y?y:x;
    var contral= document.getElementById("contral");
    contral.style.left=(window.screen.width/2.0)+"px";
    contral.style.bottom=(window.screen.height-30-window.screen.width)/2.0+"px";
    contral.style.transform="scale("+scale+","+scale+")"
    let buttons=document.getElementsByClassName("button-large");

    //修改按钮大小
    for (let i = 0; i < buttons.length; i++) {
        const element = buttons[i];
        console.log(element)
        element.classList.remove("button-block","button-rounded")
        element.classList.add("button-box")
    }
    document.getElementById("back").innerHTML="<i class='fas fa-angle-double-left'></i>";
    document.getElementById("refresh").innerHTML="<i class='fas fa-redo-alt'></i>"
    // document.getElementById("setLevel").innerHTML="<i class='fas fa-paper-plane'></i>"
    document.getElementById("setLevel").innerHTML="GO"    
    document.getElementById("level").classList.add("button","button-caution","button-large","button-box")    
    // document.getElementById("contral").style.transform="scale("+scale+","+scale+")"
}