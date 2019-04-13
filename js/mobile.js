let equipmentType = "Pc"



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
    document.getElementById("setLevel").innerHTML="<i class='fas fa-paper-plane'></i>"
    document.getElementById("level").classList.add("button","button-caution","button-large","button-box")
    let mql = window.matchMedia('(orientation: portrait)')
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
    function handleOrientationChange(mql) {
        if (mql.matches) {
            equipmentType = "Vertical" //竖屏  
            body[0].style.width = width + 'px';
            body[0].style.height = height + 'px';
        } else {
            equipmentType = "Horizontal" //横屏
            body[0].style.width = height + 'px';
            body[0].style.height = width + 'px';
        }
        body[0].className = equipmentType;
    }

    // 输出当前屏幕模式
    handleOrientationChange(mql);
    // 监听屏幕模式变化
    mql.addListener(handleOrientationChange);

} else {
    document.getElementsByTagName("body")[0].className = equipmentType
    let can = document.getElementById("screen").children[0];
    can.width = 600;
    can.height = 600;
}