// function removeObj(bgObj: any, title: any, msgObj: any) {
//     //点击标题栏触发的事件 
//     document.body.removeChild(bgObj);
//     //删除背景层Div 
//     document.getElementById("msgDiv")?.removeChild(title);
//     //删除提示框的标题栏 
//     document.body.removeChild(msgObj);
//     //删除提示框层 
// }
export function sAlert(str: string) {
    let msgw, msgh, bordercolor;
    msgw = 400;//提示窗口的宽度 
    msgh = 150;//提示窗口的高度 
    // titleheight=25//提示窗口标题高度 
    bordercolor = "#007bff";//提示窗口的边框颜色 
    // titlecolor="#99CCFF";//提示窗口的标题颜色 
    let sWidth, sHeight;
    sWidth = document.body.offsetWidth;//浏览器工作区域内页面宽度 或使用 screen.width//屏幕的宽度 
    sHeight = screen.height;//屏幕高度（垂直分辨率） 
    //背景层（大小与窗口有效区域相同，即当弹出对话框时，背景显示为放射状透明灰色） 
    let bgObj = document.createElement("div");//创建一个div对象（背景层） //动态创建元素，这里创建的是 div 
    //定义div属性，即相当于(相当于，但确不是，必须对对象属性进行定义 
    //<div id="bgDiv" style="position:absolute; top:0; background-color:#777; filter:progid:DXImagesTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75); opacity:0.6; left:0; width:918px; height:768px; z-index:10000;"></div> 
    bgObj.setAttribute('id', 'bgDiv');
    bgObj.style.position = "absolute";
    bgObj.style.top = "0";
    bgObj.style.background = "#777";
    bgObj.style.filter = "progid:DXImageTransform.Microsoft.Alpha(style=3,opacity=25,finishOpacity=75";
    bgObj.style.opacity = "0.6";
    bgObj.style.left = "0";
    bgObj.style.width = "100%";
    bgObj.style.height = sHeight + "px";
    bgObj.style.zIndex = "10000";
    bgObj.style.overflow = "hidden";
    document.body.appendChild(bgObj);//在body内添加该div对象 
    //创建一个div对象（提示框层） 
    let msgObj = document.createElement("div")
    //定义div属性，即相当于 
    //<div id="msgDiv" align="center" style="background-color:white; border:1px solid #336699; position:absolute; left:50%; top:50%; font:12px/1.6em Verdana,Geneva,Arial,Helvetica,sans-serif; margin-left:-225px; margin-top:npx; width:400px; height:100px; text-align:center; line-height:25px; z-index:100001;"></div> 
    msgObj.setAttribute("id", "msgDiv");
    msgObj.setAttribute("align", "center");
    msgObj.style.background = "white";
    msgObj.style.border = "1px solid " + bordercolor;
    msgObj.style.position = "absolute";
    msgObj.style.left = "50%";
    msgObj.style.top = "50%";
    msgObj.style.font = "12px/1.6em Verdana, Geneva, Arial, Helvetica, sans-serif";
    msgObj.style.marginLeft = "-225px";
    msgObj.style.marginTop = -75 + document.documentElement.scrollTop + "px";
    msgObj.style.width = msgw + "px";
    msgObj.style.height = msgh + "px";
    msgObj.style.textAlign = "center";
    msgObj.style.lineHeight = "25px";
    msgObj.style.zIndex = "10001";
    let title = document.createElement("h4");//创建一个h4对象（提示框标题栏） 
    //定义h4的属性，即相当于 
    //<h4 id="msgTitle" align="right" style="margin:0; padding:3px; background-color:#336699; filter:progid:DXImageTransform.Microsoft.Alpha(startX=20, startY=20, finishX=100, finishY=100,style=1,opacity=75,finishOpacity=100); opacity:0.75; border:1px solid #336699; height:18px; font:12px Verdana,Geneva,Arial,Helvetica,sans-serif; color:white; cursor:pointer;" οnclick="">关闭</h4> 
    title.setAttribute("id", "msgTitle");
    title.setAttribute("align", "right");
    title.style.margin = "0";
    title.style.padding = "3px";
    title.style.background = bordercolor;
    title.style.filter = "progid:DXImageTransform.Microsoft.Alpha(startX=20, startY=20, finishX=100, finishY=100,style=1,opacity=75,finishOpacity=100);";
    title.style.opacity = "0.75";
    title.style.border = "1px solid " + bordercolor;
    title.style.height = "30px";
    title.style.font = "12px Verdana, Geneva, Arial, Helvetica, sans-serif";
    title.style.color = "white";
    title.style.cursor = "pointer";
    title.style.lineHeight = "30px";
    title.innerHTML = "关闭";
    title.onclick = removeObj;
    let button = document.createElement("input");//创建一个input对象（提示框按钮） 
    //定义input的属性，即相当于 
    //<input type="button" align="center" style="width:100px; align:center; margin-left:250px; margin-bottom:10px;" value="关闭"> 
    button.setAttribute("type", "button");
    button.setAttribute("value", "关闭");
    button.style.width = "100px";
    button.style.height = "30px";
    button.style.textAlign = "center";
    button.style.marginLeft = "250px";
    button.style.marginBottom = "10px";
    button.style.background = bordercolor;
    button.style.border = "1px solid " + bordercolor;
    button.style.color = "white";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.onclick = removeObj;
    
    function removeObj() {
        //点击标题栏触发的事件 
        document.body.removeChild(bgObj);
        //删除背景层Div 
        document.getElementById("msgDiv")?.removeChild(title);
        //删除提示框的标题栏 
        document.body.removeChild(msgObj);
        //删除提示框层 
    }

    document.body.appendChild(msgObj);//在body内添加提示框div对象msgObj 
    document.getElementById("msgDiv")?.appendChild(title);//在提示框div中添加标题栏对象title 
    let txt = document.createElement("p");//创建一个p对象（提示框提示信息） 
    //定义p的属性，即相当于 
    //<p style="margin:1em 0;" id="msgTxt">测试效果</p> 
    txt.style.margin = "1em 0"
    txt.setAttribute("id", "msgTxt");
    txt.innerHTML = str;//来源于函数调用时的参数值 
    document.getElementById("msgDiv")?.appendChild(txt);//在提示框div中添加提示信息对象txt 
    document.getElementById("msgDiv")?.appendChild(button);//在提示框div中添加按钮对象button 
} 