/*表单操作 */
(function () {
    // 元素们
    var eleForm = document.querySelector('#form');
    var eleTbody = document.querySelector('#result tbody');
    var eleStatus = document.getElementById('status');
    // 模板字符内容
    var strTplList = document.getElementById('tplList').innerHTML;
    
    var logError = function (error) {
        eleStatus.style.display = 'block';
        eleStatus.innerHTML = '<span class="error">'+ error +'</span>';
    }, logInfo = function (info) {
        eleStatus.style.display = 'block';
        eleStatus.innerHTML = '<span class="info">'+ info + '</span>';
    };
    
    // 简易模板方法
    String.prototype.temp = function(obj) {
        return this.replace(/\$\w+\$/gi, function(matchs) {        
            return obj[matchs.replace(/\$/g, "")] || '';
        });
    };
    
    // 本演示使用的数据库名称
    var dbName = 'project';
    // 版本
    var version = 1;
    // 数据库数据结果
    var db;

    // 打开数据库
    var DBOpenRequest = window.indexedDB.open(dbName, version);
    
    // 如果数据库打开失败
    DBOpenRequest.onerror = function(event) {
        logError('数据库打开失败');
    };
    
    DBOpenRequest.onsuccess = function(event) {        
        // 存储数据结果
        db = DBOpenRequest.result;
        
        // 显示数据
        method.show();
    };
    
    // 下面事情执行于：数据库首次创建版本，或者window.indexedDB.open传递的新版本（版本数值要比现在的高）
    DBOpenRequest.onupgradeneeded = function(event) {
        var db = event.target.result;
     
        db.onerror = function(event) {
            logError('数据库打开失败');
        };
    
        // 创建一个数据库存储对象
        var objectStore = db.createObjectStore(dbName, { 
            keyPath: 'id',
            autoIncrement: true
        });
    
        // 定义存储对象的数据项
        objectStore.createIndex('id', 'id', {
            unique: true    
        });
        objectStore.createIndex('name', 'name');
        objectStore.createIndex('begin', 'begin');
        objectStore.createIndex('end', 'end');
        objectStore.createIndex('person', 'person');
        objectStore.createIndex('remark', 'remark');
    };
    
    var method = {
        add: function (newItem) {
            var transaction = db.transaction([dbName], "readwrite");
            // 打开已经存储的数据对象
            var objectStore = transaction.objectStore(dbName);
            // 添加到数据对象中
            var objectStoreRequest = objectStore.add(newItem);        
            objectStoreRequest.onsuccess = function(event) {
                method.show();
            };
        },
        edit: function (id, data) {
            // 编辑数据
            var transaction = db.transaction([dbName], "readwrite");
            // 打开已经存储的数据对象
            var objectStore = transaction.objectStore(dbName);
            // 获取存储的对应键的存储对象
            var objectStoreRequest = objectStore.get(id);
            // 获取成功后替换当前数据
            objectStoreRequest.onsuccess = function(event) {
                // 当前数据
                var myRecord = objectStoreRequest.result;
                // 遍历替换
                for (var key in data) {
                    if (typeof myRecord[key] != 'undefined') {
                        myRecord[key] = data[key];
                    }
                }
                // 更新数据库存储数据                
                objectStore.put(myRecord);
            };
        },
        del: function (id) {
            // 打开已经存储的数据对象
            var objectStore = db.transaction([dbName], "readwrite").objectStore(dbName);            
            // 直接删除            
            var objectStoreRequest = objectStore.delete(id);
            // 删除成功后
            objectStoreRequest.onsuccess = function() {
                method.show();
            };
        },
        show: function () {
            // 最终要展示的HTML数据
            var htmlProjectList = '';
            // 打开对象存储，获得游标列表
            var objectStore = db.transaction(dbName).objectStore(dbName);
            objectStore.openCursor().onsuccess = function(event) {
                var cursor = event.target.result;
                // 如果游标没有遍历完，继续下面的逻辑
                if (cursor) {
                    htmlProjectList = htmlProjectList + strTplList.temp(cursor.value);            
                    // 继续下一个游标项
                    cursor.continue();
                // 如果全部遍历完毕
                } else {
                    logInfo('');
                    eleTbody.innerHTML = htmlProjectList;
                    
                    if (htmlProjectList == '') {
                        logInfo('暂无数据');    
                    }
                }
            }
        }
    };
    
    // 表单提交新增数据
    eleForm.addEventListener('submit', function (event) {
        event.preventDefault();    
        
        var formData = {};
        
        [].slice.call(this.querySelectorAll('input,textarea')).forEach(function (ele) {
            if (ele.name) {
                formData[ele.name] = ele.value;    
            }
        });
            
        // 添加新的数据
        method.add(formData);
        
        this.reset();
    });
    
    // 编辑事件
    eleTbody.addEventListener('focusout', function (event) {
        var eleTd = event.target;
        // 获取id，也就是获得主键
        var id = eleTd && eleTd.getAttribute('data-id');
        if (!id || !/td/.test(eleTd.tagName)) { return; }
        
        // 这是要替换的数据
        var data = {
            id: id * 1    
        };
        // 获得现在的数据
        [].slice.call(eleTd.parentElement.querySelectorAll('td[data-key]')).forEach(function (td) {
            var key = td.getAttribute('data-key');
            var value = td.innerText || td.textContent || '';
            
            data[key] = value;
        });
        
        // 更新本地数据库
        method.edit(id, data);
    });
    // 删除事件
    eleTbody.addEventListener('click', function (event) {
        var eleBtn = event.target, id = '';
        if (eleBtn && eleBtn.classList.contains('jsListDel') && (id = eleBtn.getAttribute('data-id'))) {
            method.del(id * 1);    
            event.preventDefault();        
        }
    });
})();

/*下拉框 输入时显示原字*/
/*动态增删改*/

/*title变化 */
window.onblur = function () {
    document.title = "_(:з)∠)_计划持续摸鱼中";
};
window.onfocus = function () {
    document.title = "(oﾟvﾟ)ノ计划绝赞进行中";
};

// var currentStep = 0;
// var max_line_num = 0;
// //添加新记录
// function add_line() {
//     max_line_num = $("#content tr:last-child").children("td").html();
//     if (max_line_num == null) {
//         max_line_num = 1;
//     }
//     else {
//         max_line_num = parseInt(max_line_num);
//         max_line_num += 1;
//     }
//     $('#content').append(
//         "<tr id='line" + max_line_num + "'>" +
//         "<td class='td_Num'>" + max_line_num + "</td>" +
//         "<td class='td_Item'><input type='text' class='stepName' value='步骤名称" + max_line_num + "'></input></td>" +
//         "<td class='td_Item'><input type='text' class='stepDescription' value='步骤描述" + max_line_num + "'></td>" +
//         "<td class='td_Oper'>" +
//         "<span οnclick='remove_line(this);'>删除</span> " +
//         "</td>" +
//         "</tr>");
// }
// //删除选择记录
// function remove_line(index) {
//     if (index != null) {
//         currentStep = $(index).parent().parent().find("td:first-child").html();
//     }
//     if (currentStep == 0) {
//         alert('请选择一项!');
//         return false;
//     }
//     if (confirm("确定要删除改记录吗？")) {
//         $("#content tr").each(function () {
//             var seq = parseInt($(this).children("td").html());
//             if (seq == currentStep) { $(this).remove(); }
//             if (seq > currentStep) { $(this).children("td").each(function (i) { if (i == 0) $(this).html(seq - 1); }); }
//         });
//     }
// }

// //保存数据
// function SaveData() {
//     var data = "<root>";
//     $('#content tr').each(function () {
//         data += "<item>";
//         var stepName = $(this).find("td:eq(1)").find("input").val();
//         var stepDescription = $(this).find("td:eq(2)").find("input").val();
//         data += "   <stepName>" + stepName + "</stepName>";
//         data += "   <stepDescription>" + stepDescription + "</stepDescription>";
//         data += "<item>";
//     });
//     data += "</root>";
//     alert(data);
// }


// //存储数据
// function saveData() {
//     var d = new Date();
//     d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
//     //24h=24h*60min*60s*1000ms
//     var expires = ";expires=" + d.toUTCString();
//     //toUTCString()根据世界时间把date对象转换成字符串

//     //获取所有的input
//     $("input").each(function () {
//         var id = $(this).attr('id');
//         var val = $.trim($(this).val());
//         document.cookie = id + '=' + val + expires;
//     })
//     //获取所有的select
//     $("select").each(function () {
//         var id = $(this).attr('id');
//         var val = $.trim($(this).val());
//         document.cookie = id + '=' + val + expires;
//     })
//     //获取所有的textarea
//     $("textarea").each(function () {
//         var id = $(this).attr('id');
//         var val = $.trim($(this).val());
//         document.cookie = id + '=' + val + expires;
//     })
//     //图片
//     $("img").each(function () {
//         var id = $(this).attr('id');
//         var val = $.trim($(this).attr("src"));
//         document.cookie = id + '=' + val + expires;
//     })
// }

// //加载数据
// function loadData() {
//     var cookie = document.cookie;
//     cookie += ";";
//     //给获取所有的input赋值
//     $("input").each(function () {
//         var id = $(this).attr('id');
//         $(this).val(getValue(id, cookie));
//     })
//     //给获取所有的select赋值
//     $("select").each(function () {
//         var id = $(this).attr('id');
//         $(this).val(getValue(id, cookie));
//     })
//     //给获取所有的textarea赋值
//     $("textarea").each(function () {
//         var id = $(this).attr('id');
//         $(this).val(getValue(id, cookie));
//     })
//     //图片
//     $("img").each(function () {
//         var id = $(this).attr('id');
//         $(this).attr("src", getValue(id, cookie));
//     })
// }


// function getValue(id, cookie) {
//     var cookie_pos = cookie.indexOf(id);
//     if (cookie_pos != '-1') {
//         cookie_pos += id.length + 1;
//         var cookie_end = cookie.indexOf(";", cookie_pos);

//         if (cookie_end == '-1') {

//             cookie_end = cookie.length;

//         }

//         var value = cookie.substring(cookie_pos, cookie_end);
//         return value;
//     }
// }

// var row_last_num = 0;
// function AddRow() {
//     row_last_num += 1;
//     $("tbody").append("<tr id='tr" + row_last_num + "'>" +
//         "<td onclick='ChangeCell(this);'>单击修改</td>" +
//         "<td onclick='ChangeCell(this);'>单击修改</td>" +
//         "<td onclick='ChangeCell(this);'>单击修改</td>" +
//         "<td><a href='#' class='remove' onclick='RemoveRow(this);'>删除</a></td></tr>");
// }

// function RemoveRow(o) {
//     $(o).parent().parent().remove();
// }

// //改变标签类型为<input>
// function ChangeCell(o) {
//     $(o).replaceWith("<input type='text' class='current' onblur='UpdateCell(event);'>");
//     $("input.current").focus();
// }

// //修改标签类型为<td>并且将input中的值赋给该标签的text
// //todo: 当键盘输入回车时，完成当前输入
// function UpdateCell(event) {
//     var o = event.target;
//     var elem = $(o);
//     var temp = elem.val();
//     var info = '';
//     if (temp && temp != "") {
//         elem.replaceWith("<td onclick='ChangeCell(this);'>" + temp + "</td>");
//     } else {
//         elem.focus();
//         info = '字段不得为空！';
//     }
//     $('.info').text(info);
// }