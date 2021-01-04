/*图标切换*/
let myImage=document.querySelector('img');
//把<img>元素的引用存放在myImage变量中

myImage.onclick=function(){
    let mySrc=myImage.getAttribute('src');
    //获取这张图片的src属性值
    if(mySrc==='/images/动画.svg'){
        myImage.setAttribute('src','/images/现实.svg');
    }
    else{
        myImage.setAttribute('src','/images/动画.svg');
    }
}


/**汉堡包js动画 */
//   // Look for .hamburger
//   var hamburger = document.querySelector(".hamburger");
//   // On click
//   hamburger.addEventListener("click", function() {
//     // Toggle class "is-active"
//     hamburger.classList.toggle("is-active");
//     // Do something else, like open/close menu
//   });

