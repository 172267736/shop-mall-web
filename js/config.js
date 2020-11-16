$(function () {
    $("#jqGrid").jqGrid({
        url: '/shop/admin/service/kv/store/list',
        datatype: "json",
        colModel: [			
			{ label: '字典编号', name: 'uniqueId', width: 45, key: true },
			{ label: '唯一键', name: 'keyFlag', width: 75 },
            { label: '组名一', name: 'firstName', width: 75 },
			{ label: '组名二', name: 'lastName', width: 60 }, 
            { label: '值', name: 'storeValue', width: 60 }, 
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
            keyFlag: null
        },
        showList: true,
        title:null,
        config:{
            uniqueId:null,
            keyFlag:'',
            firstName:'',
            lastName:'',
            storeValue:'',
            keyDescriptiom:''
        }
    },
    methods: {
        query: function () {
            vm.reload();
        },
        add: function(){
            vm.showList = false;
            vm.title = "新增";
            vm.config = {uniqueId:null,keyFlag:'',firstName:'',lastName:'',storeValue:'',keyDescriptiom:''};
        },
        update: function () {
            var id = getSelectedRowByKey("uniqueId");
            if(id == null){
                return ;
            }
            vm.showList = false;
            vm.title = "修改";
            vm.getConfig(id);
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
                    url: "shop/admin/service/kv/store/delete",
                    contentType: "application/json",
                    data:  JSON.stringify(data),
                    success: function(r){
                        if(r.code == '000000'){
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
            var url = vm.config.uniqueId == null ? "shop/admin/service/kv/store/save" : "shop/admin/service/kv/store/update";
            $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json",
                data: JSON.stringify(vm.config),
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
        getConfig: function(id){
            $.get("shop/admin/service/kv/store/detail?id="+id, function(r){
                 if(r.code === '000000'){
                        vm.config = r.data;
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
                postData:{'keyFlag': vm.q.keyFlag},
                page:page
            }).trigger("reloadGrid");
        }
    }
});