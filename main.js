
window.onload = function(){
    var left = getId('left'),
        up = getId('up'),
        right = getId('right'),
        down = getId('down');

    var box = getId('main'),
        pic = getId('img2'),
        previewImg = getId('previewImg'),
        mainBox = getId('example'),
        control = document.getElementsByClassName('minDiv'),
        flag = true,    //是否可以拖动
        oldWidth,addWidth,oldHeight,addHeight,oldTop;

    //计算选取区域相对图片的位置
    var pTop,pLeft,pRight,pDown;
    function caculateP(){
        pTop = box.offsetTop;
        pLeft = box.offsetLeft;
        pRight = pLeft + box.clientWidth;
        pDown = pTop + box.clientHeight;
    }

    //选取位置拖动
    box.addEventListener('mousedown',mHandler,false);
    function mHandler(e){
        if(flag){
            var oldClientX = e.clientX,
                oldClientY = e.clientY,
                oldX = box.offsetLeft,
                oldY = box.offsetTop;
            box.style.cursor = "move";
            window.addEventListener('mousemove',drag,false);
            window.addEventListener('mouseup',stop,false);
            function drag(e){
                var addX,addY;

                addX = e.clientX - oldClientX;
                addY = e.clientY - oldClientY;

                box.style.left = addX + oldX + 'px';
                box.style.top = addY + oldY +'px';

                //设置选择区域不超过图片大小
                caculateP();
                if(pTop < 0){
                    box.style.top = 0;
                }
                if(pLeft < 0){
                    box.style.left = 0;
                }
                if(pRight > mainBox.clientWidth){
                    box.style.left = mainBox.clientWidth - box.clientWidth +'px';
                }
                if(pDown > mainBox.clientHeight){
                    box.style.top = mainBox.clientHeight - box.clientHeight +'px';
                }
                setChoice();
                e.preventDefault();
            }
            function stop(){
                window.removeEventListener('mousemove',drag,false);
                box.style.cursor = "";
            }
        }
    }

    //图片剪切大小的调整
    for(var i = 0 ; i < control.length; i++){
        //绑定事件的时候需要传递i到处理函数
        control[i].addEventListener('mousedown',(function(i){
            return function(){
                Handler(i);
            };
        })(i),false);
    }
    function Handler(index){
        var direct = control[index].getAttribute('id');
        //此时在调整大小，不能拖动
        flag = false;

        window.addEventListener('mousemove',moveHandler,false);
        window.addEventListener('mouseup',upHandler,false);
        function moveHandler(e){
            switch (direct){
                case 'left-up':
                    moveLeft(e);
                    moveUp(e);
                    break;
                case 'left':
                    moveLeft(e);
                    break;
                case 'left-down':
                    moveLeft(e);
                    moveDown(e);
                    break;
                case 'up':
                    moveUp(e);
                    break;
                case 'right-up':
                    moveRight(e);
                    moveUp(e);
                    break;
                case 'right':
                    moveRight(e);
                    break;
                case 'right-down':
                    moveRight(e);
                    moveDown(e);
                    break;
                case 'down':
                    moveDown(e);
                    break;
                default:
                    console.warn('error');
            }

            //设置pic层同box层共同改变
            setChoice();
            //取消默认事件（选中）
            e.preventDefault();
        }
        function upHandler(){
            window.removeEventListener('mousemove',moveHandler,false);
            //调整完大小后标记为可拖动
            flag = true;
        }
    }
    //四个方向的处理函数
    function moveLeft(e){
        var leftX = e.clientX;

        oldLeft = parseInt(window.getComputedStyle(box,null).left);
        oldWidth = box.clientWidth;
        addWidth = getPosition(box).left - leftX;

        box.style.width = oldWidth + addWidth + 'px';
        box.style.left = oldLeft - addWidth +'px';

        //设置选择区域不超过图片大小
        caculateP();
        if(pLeft < 0){
            box.style.left = 0;
            box.style.width = oldWidth +'px';
        }
    }
    function moveRight(e){
        var rightX = e.clientX;

        oldWidth = box.clientWidth;
        addWidth = rightX - oldWidth - getPosition(box).left;

        box.style.width = oldWidth+addWidth+'px';

        //设置选择区域不超过图片大小
        caculateP();
        if(pRight > mainBox.clientWidth){
            box.style.left = mainBox.clientWidth - oldWidth +'px';
            box.style.width = oldWidth + 'px';
        }
    }
    function moveUp(e){
        var upY = e.clientY;

        oldTop = parseInt(window.getComputedStyle(box,null).top);
        oldHeight = box.clientHeight;
        addHeight = getPosition(box).top - upY;

        box.style.height = oldHeight + addHeight + 'px';
        box.style.top = oldTop - addHeight +'px';

        //设置选择区域不超过图片大小
        caculateP();
        if(pTop < 0){
            box.style.top = 0;
            box.style.height = oldHeight + 'px';
        }
    }
    function moveDown(e){
        var downY = e.clientY;

        oldHeight = box.clientHeight;
        addHeight = downY - oldHeight - getPosition(box).top;

        box.style.height = oldHeight+addHeight+'px';

        //设置选择区域不超过图片大小
        caculateP();
        if(pDown > mainBox.clientHeight){
            box.style.top = mainBox.clientHeight - oldHeight +'px';
            box.style.height = oldHeight + 'px';
        }
    }

    //设置pic层同box层共同改变
    function setChoice(){
        var top = box.offsetTop,
            left = box.offsetLeft,
            right = left + box.clientWidth,
            down = top + box.clientHeight;

        pic.style.clip = 'rect('+top+'px,'+right+'px,'+down+'px,'+left+'px)';
        setPreview();
    }
    //设置preview
    function setPreview(){
        var top = box.offsetTop,
            left = box.offsetLeft,
            right = left + box.clientWidth,
            down = top + box.clientHeight;

        previewImg.style.clip = 'rect('+top+'px,'+right+'px,'+down+'px,'+left+'px)';
        previewImg.style.left = - left + 'px';
        previewImg.style.top =  - top + 'px';
    }
};


//工具方法
function getId(id){
    return document.getElementById(id);
}
/**
 * 获取位置
 * @param node
 * @returns {{left: (Number|number), top: (Number|number)}}
 */
function getPosition(node){
    var position = {
        'left':node.offsetLeft,
        'top':node.offsetTop
    };
    //offsetParent是保存影响当前元素定位的父元素，parentNode则不存在这一关系还会存在文本节点。
    var parent = node.offsetParent;
    while(parent){
        position.left += parent.offsetLeft;
        position.top += parent.offsetTop;
        parent = parent.offsetParent;
    }
    return position;
}