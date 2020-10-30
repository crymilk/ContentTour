alert('SURPRISE!MY BRO!');

/*
let myHeading=document.querySelector('h1');
myHeading.textContent='Hello world!';

document.querySelector('html').onclick=function(){
    alert('别动，没做好！');
}
*/

let myImage=document.querySelector('img');
//把<img>元素的引用存放在myImage变量中

myImage.onclick=function(){
    let mySrc=myImage.getAttribute('src');
    //获取这张图片的src属性值
    if(mySrc==='images/exp1.jpg'){
        myImage.setAttribute('src','images/exp2.jpg');
    }
    else{
        myImage.setAttribute('src','images/exp1.jpg');
    }
}

let myButton = document.querySelector('button');
let myHeading = document.querySelector('h1');

function setUserName(){
    let myName=prompt('请输入你的名字。');
    if(!myName||myName===NULL){
        setUserName();
    }
    else{
        localStorage.setItem('name',myName);
        //创建一个'name' 数据项，并把 myName 变量复制给它
        myHeading.textContent='欢迎来到杭州风景站!'+myName;
        //设置为一个欢迎字符串加上这个新设置的名字
    }
}

if(!localStorage.getItem('name')){
    setUserName();
}
else{
    let storedNmae=localStorage.getItem('name');
    myHeading.textContent='欢迎来到杭州风景站!'+storedNmae;
}

myButton.onclick=function(){
    setUserName();
}

//把一个匿名函数赋值给了 html 的 onclick 属性
//JavaScript 里一切皆对象，一切皆可储存在变量里。