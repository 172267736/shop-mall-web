$(function () {
    $("#jqGrid").jqGrid({
        url: '/shop/admin/service/user/list',
        datatype: "json",
        colModel: [			
			{ label: '用户编号', name: 'uniqueId', width: 45, key: true },
			{ label: '用户名', name: 'userName', width: 75 },
            { label: '昵称', name: 'nickName', sortable: false, width: 75 },
			{ label: '状态', name: 'userState', width: 60, formatter: function(value, options, row){
				return value === 0 ? '<span class="label label-success">正常</span>':'<span class="label label-danger">禁用</span>';
			}},
			{ label: '创建时间', name: 'createDate', width: 85, formatter: function(value, options, row){
                return timeFormat(value);
            }}
        ],
		viewrecords: true,
        height: 385,
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: true, 
        rownumWidth: 25, 
        autowidth:true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader : {
            root: "data.list",
            total: "data.page",
            records: "data.count"
        },
        prmNames : {
            page:"page", 
            rows:"limit", 
            order: "order"
        },
        gridComplete:function(){
        	//隐藏grid底部滚动条
        	$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
        }
    });
});

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            userName: null
        },
        showList: true,
        title:null,
        roleList:{},
        user:{
            uniqueId:null,
            nickName:'',
            userName:'',
            userState:0,
            roleIdList:[]
        }
    },
    methods: {
        query: function () {
            vm.reload();
        },
        add: function(){
            vm.showList = false;
            vm.title = "新增";
            vm.roleList = {};
            vm.user = {uniqueId:null,nickName:'',userName:'',userState:0, roleIdList:[]};

            //获取角色信息
            this.getRoleList();
        },
        update: function () {
            var userId = getSelectedRowByKey("uniqueId");
            if(userId == null){
                return ;
            }

            vm.showList = false;
            vm.title = "修改";

            vm.getUser(userId);
            //获取角色信息
            this.getRoleList();
        },
        del: function () {
            var ids = getSelectedRowsByKey("uniqueId");
            if(ids == null){
                return ;
            }
            var data = {'ids':ids};
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "shop/admin/service/user/delete",
                    contentType: "application/json",
                    data: JSON.stringify(data),
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(){
                                vm.reload();
                            });
                        }else if(r.code == '100002'){
                            location.href = "login.html";
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        saveOrUpdate: function () {
            var url = vm.user.uniqueId == null ? "shop/admin/service/user/save" : "shop/admin/service/user/update";
            $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json",
                data: JSON.stringify(vm.user),
                success: function(r){
                    if(r.code === '000000'){
                        alert('操作成功', function(){
                            vm.reload();
                        });
                    }else if(r.code == '100002'){
                        location.href = "login.html";
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        getUser: function(userId){
            $.get("shop/admin/service/user/detail?id="+userId, function(r){
                if(r.code === '000000'){
                    vm.user = r.data; 
                }else if(r.code == '100002'){
                    location.href = "login.html";
                }else{
                    alert(r.msg);
                }
               
            });
        },
        getRoleList: function(){
            $.get("shop/admin/service/role/listAll", function(r){
                if(r.code === '000000'){
                    vm.roleList = r.data;
                }else if(r.code == '100002'){
                    location.href = "login.html";
                }else{
                    alert(r.msg);
                }
            });
        },
        reload: function () {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam','page');
            $("#jqGrid").jqGrid('setGridParam',{
                postData:{'userName': vm.q.userName},
                page:page
            }).trigger("reloadGrid");
        }
    }
});