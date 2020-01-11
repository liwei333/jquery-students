(function ($) {
    
    function TurnPage(options) {
        // 添加翻页的页面元素
        this.wrap = options.wrap;
        // 总的数据条数
        this.allPageSize = options.allPageSize;
        // 当前页
        this.nowPage = options.nowPage;
        // 每页展示的数据数量
        this.pageSize = options.pageSize;
        // 翻页的时候回调函数
        this.changePageCb = options.changePageCb;
        // 100 / 15  总页数
        this.allPage = Math.ceil(this.allPageSize / this.pageSize);
        // 如果当前页 大于了总页数  则报错不渲染翻页
        if (this.nowPage > this.allPage) {
            alert('页码错误');
            return false;
        }
        // this.init = function () {
            // 渲染dom元素
            this.renderDom();
            // 绑定事件
            this.bindEvent();
        // }
    }

    TurnPage.prototype.renderDom = function () {
        // 清空页面内要添加翻页的区间
        $(this.wrap).empty();
        // 每页条数元素
        var oDiv = $('<div class="page-size"><span>每页条数</span></div>');
        // 每页条数的输入框
        var oInp = $('<input class="size" type="number" min=1 max=50 value="' + this.pageSize +'"></input>');
        // 插入到页面中
        oDiv.append(oInp).appendTo(this.wrap);
        // 翻页部分
        var oUl = $('<ul class="my-turn-page"></ul>');
        // 展示三页
        // if (this.nowPage > 1) {
        //     $('<li class="prev-page">上一页</li>').appendTo(oUl);
        //     $('<li class="num">1</li>').appendTo(oUl);
        // }
        // if (this.nowPage > 2) {
        //     $('<span>...</span>').appendTo(oUl);
        // }
        // $('<li class="num active">' + this.nowPage + '</li>').appendTo(oUl);

        // if (this.nowPage < this.allPage - 1) {
        //     $('<span>...</span>').appendTo(oUl);
        // }
        // if (this.nowPage != this.allPage) {
        //     $('<li class="num">' + this.allPage + '</li>').appendTo(oUl);
        //     $('<li class="next-page">下一页</li>').appendTo(oUl);
        // }
        // 展示多页  中间5页
        // 渲染上一页按钮
        if (this.nowPage > 1) {
            $('<li class="prev-page">上一页</li>').appendTo(oUl);
        }
        // 单独渲染第一页
        if (this.nowPage > 3) {
            $('<li class="num">1</li>').appendTo(oUl);
        }
        // 渲染前面省略号
        if (this.nowPage > 4) {
            $('<span>...</span>').appendTo(oUl);
        }
        // 中间五页
        for (var i = this.nowPage - 2; i <= this.nowPage + 2; i ++) {
            if (i == this.nowPage) {
                $('<li class="num active">' + i + '</li>').appendTo(oUl);
            } else if (i > 0 && i <= this.allPage){
                $('<li class="num">' + i + '</li>').appendTo(oUl);
            }
        }
        // 渲染后面省略号
        if (this.nowPage + 2 < this.allPage - 1) {
            $('<span>...</span>').appendTo(oUl);
        }
        // 单独渲染最后一页
        if (this.nowPage + 2 < this.allPage) {
            $('<li class="num">' + this.allPage + '</li>').appendTo(oUl);
        }
        // 渲染下一页
        if (this.nowPage < this.allPage) {
            $('<li class="next-page">下一页</li>').appendTo(oUl);
        }
        $(this.wrap).append(oUl);
    }
    // 绑定事件
    TurnPage.prototype.bindEvent = function () {
        var self = this;
        // 每页的点击事件 点击页码进行翻页
        $('.num', this.wrap).click(function () {
            var page = parseInt($(this).text());
            self.changePage(page);
        });
        // 上一页点击事件
        $('.prev-page', this.wrap).click(function () {
            if (self.nowPage > 1) {
                self.changePage(self.nowPage - 1);
            }
        });
        // 下一页点击事件
        $('.next-page', this.wrap).click(function () {
            if (self.nowPage < self.allPage) {
                self.changePage(self.nowPage + 1);
            }
        });
        // 每页条数修改事件
        $('.size', this.wrap).change(function () {
            // 修改条数， 总页数也跟着变化  当前页应当初始化为1
            self.pageSize = parseInt($(this).val());
            self.allPage = Math.ceil(self.allPageSize / self.pageSize);
            self.changePage(1);
        });
    }
    // 切换页码
    TurnPage.prototype.changePage = function (page) {
        this.nowPage = page;
        // 重新渲染翻页
        this.renderDom();
        // 重新绑定事件
        this.bindEvent();
        // 执行翻页的回调函数  将一些数据返回给用户  用于页面数据修改   
        this.changePageCb && this.changePageCb({
            nowPage: this.nowPage,
            pageSize: this.pageSize,
        });
    }

    $.fn.extend({
        page: function (options) {
            options.wrap = this;
            new TurnPage(options);
            // pageObj.init();
            return this;
        }
    })
} (jQuery))