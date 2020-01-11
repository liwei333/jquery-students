var nowPage = 1;
var pageSize = 15;
var allPageSize = 0;
var tableData = [];
var flag = false;
// 绑定事件
function bindEvent() {
    $('.menu-list').on('click', 'dd', function () {
        console.log()
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        var id = $(this).data('id');
        if(id == 'student-list') {
            getTableData();
        }
        $('.content').fadeOut();
        $('#' + id).fadeIn();
    });

    $('#add-student-btn').click(function (e) {
        e.preventDefault();
        if (flag) {
            return false;
        }
        flag = true;
        var data = $('#add-student-form').serializeArray();
        data = formatObj(data);
        transferData('/api/student/addStudent', data, function (res) {
            alert('已添加成功');
            $('#add-student-form')[0].reset();
            $('.list').trigger('click');
            flag = false;
        });
    });
    $('#edit-student-btn').click(function (e) {
        e.preventDefault();
        if (flag) {
            return false;
        }
        flag = true;
        var data = $('#edit-student-form').serializeArray();
        data = formatObj(data);
        transferData('/api/student/updateStudent', data, function (res) {
            alert('已修改成功');
            $('#edit-student-form')[0].reset();
            $('.mask').trigger('click');
            // 编辑提交之后需要更新表格数据  更新表格数据有两个接口一个是翻页的接口一个是搜索的接口 需要判断调用哪个获取数据 如果搜索框有内容则取过滤后的数据  否则获取所有翻页数据
            var val = $('#search-word').val();
            if (val) {
                filterData(val);
            } else {
                getTableData();
            }
            flag = false;
        });
    });
    $('#tbody').on('click', '.edit', function (e) {
        // console.log($(this).index());
        var index = $(this).data('index');
        renderFrom(tableData[index]);
        $('.dialog').slideDown();
    });
    $('#tbody').on('click', '.del', function (e) {
        // console.log($(this).index());
        var index = $(this).data('index');
        var isDel = window.confirm('确认删除？');
        if (isDel) {
            transferData('/api/student/delBySno', {
                sNo: tableData[index].sNo
            }, function (res) {
                alert('删除成功');
                $('.list').trigger('click');
            })
        }
    });
    $('.mask').click(function () {
        $('.dialog').slideUp();
    });
    // 搜索按钮点击事件
    $('#search-submit').click(function (e) {
        // 搜索框里面的内容  关键字
        var val = $('#search-word').val();
        nowPage = 1;
        if (val) {
            filterData(val);
        } else {
            getTableData();
        }
    })
}

function formatObj(arr) {
    var obj = {};
    for (var i = 0; i < arr.length; i++) {
        if (!obj[arr[i].name]) {
            obj[arr[i].name] = arr[i].value;
        }
    }
    return obj;
}
// 获取表格数据  没有过滤的 
function getTableData() {
    transferData('/api/student/findByPage', {
        page: nowPage,
        size: pageSize
    }, function (res) {
       allPageSize = res.data.cont;
       tableData = res.data.findByPage;
       renderTable(tableData);
    });
}
// 渲染表格数据函数
function renderTable(data) {
    var str = '';
    data.forEach(function (item, index) {
        str += ' <tr>\
        <td>' + item.sNo +'</td>\
        <td>' + item.name + '</td> \
        <td>' + ( item.sex ? '女' : '男') + '</td>\
        <td>' + item.email + '</td>\
        <td>' + (new Date().getFullYear() - item.birth) + '</td>\
        <td>' + item.phone +'</td>\
        <td>' + item.address + '</td>\
        <td>\
            <button class="btn edit" data-index=' + index + '>编辑</button>\
            <button class="btn del" data-index=' + index + '>删除</button>\
        </td>\
    </tr>';
    });
    $('#tbody').html(str);
    // 添加翻页
    $('#turn-page').page({
        allPageSize: allPageSize,
        nowPage: nowPage,
        pageSize: pageSize,
        changePageCb: function (obj) {
            // 改变页码和每页条数的时候 要更新数据  
            nowPage = obj.nowPage;
            pageSize = obj.pageSize;
            // getTableData();
            // 判断数据是取过滤数据还是取所有同学的翻页数据
            var val = $('#search-word').val();
            if (val) {
                filterData(val);
            } else {
                getTableData();
            }
        }
    })
}
// CORS   ===> 后端添加请求头
function transferData(url, data, cb) {
    $.ajax({
        type: 'get',
        url: 'http://api.duyiedu.com' + url,
        data: $.extend(data, {
            appkey: 'dongmeiqi_1551761333531',
        }),
        dataType: 'json',
        success: function (res) {
            if (res.status == 'success') {
                cb(res);
            } else {
                alert(res.msg);
            }
        }
    })
}
// 回填表单数据
function renderFrom (data) {
    var form = $('#edit-student-form')[0];
    for (var prop in data) {
        if (form[prop]) {
            form[prop].value = data[prop];
        }
    }
}
function init() {
    bindEvent();
    console.log($('.list'))
    $('.list').trigger('click');
}
// 搜索过滤数据
function filterData(val) {
    transferData('/api/student/searchStudent', {
        sex: -1,
        page: nowPage,
        size: pageSize,
        search: val,
    }, function (res) {
        console.log(res);
        allPageSize = res.data.cont;
        renderTable(res.data.searchList);
    });
}
init();