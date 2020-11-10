$(function () {
    $("#jqGrid").jqGrid({
        url: 'shop/admin/service/role/list',
        datatype: "json",
        colModel: [
            { label: '角色编号', name: 'uniqueId', width: 45, key: true },
            { label: '角色名称', name: 'roleName', width: 75 },
            { label: '备注', name: 'roleRemark', width: 100 },
            { label: '创建时间', name: 'createDate', width: 80, formatter: function(value, options, row){
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

//菜单树
var menu_ztree;
var menu_setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "uniqueId",
            pIdKey: "parentUniqueId",
            rootPId: -1
        },
        key: {
            url:"nourl"
        }
    },
    check:{
        enable:true,
        nocheckInherit:true
    }
};

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            roleName: null
        },
        showList: true,
        title:null,
        role:{
            roleName:null,
            roleRemark:null,
            menuIdList:[]
        }
    },
    methods: {
        query: function () {
            vm.reload();
        },
        add: function(){
            vm.showList = false;
            vm.title = "新增";
            vm.role = {roleName:null, roleRemark:null};
            vm.getMenuTree(null);
        },
        update: function () {
            var roleId = getSelectedRowByKey("uniqueId");
            if(roleId == null){
                return ;
            }
            vm.showList = false;
            vm.title = "修改";
            vm.getMenuTree(roleId);
        },
        del: function () {
            var roleId = getSelectedRowByKey("uniqueId");
            if(roleId == null){
                return ;
            }
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: "shop/admin/service/role/delete?id="+roleId,
                    contentType: "application/json",
                    success: function(r){
                        if(r.code == 0){
                            alert('操作成功', function(){
                                vm.reload();
                            });
                        }else{
                            alert(r.msg);
                        }
                    }
                });
            });
        },
        getRole: function(roleId){
            $.get("shop/admin/service/role/detail?id="+roleId, function(r){
                vm.role = r.data;
                //勾选角色所拥有的菜单
                var menuIds = vm.role.menuIdList;
                for(var i=0; i<menuIds.length; i++) {
                    var node = menu_ztree.getNodeByParam("uniqueId", menuIds[i]);
                    menu_ztree.checkNode(node, true, false);
                }
            });
        },
        saveOrUpdate: function () {
            //获取选择的菜单
            var nodes = menu_ztree.getCheckedNodes(true);
            var menuIdList = new Array();
            for(var i=0; i<nodes.length; i++) {
                menuIdList.push(nodes[i].uniqueId);
            }
            vm.role.menuIdList = menuIdList;
            var url = vm.role.uniqueId == null ? "shop/admin/service/role/save" : "shop/admin/service/role/update";
            $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json",
                data: JSON.stringify(vm.role),
                success: function(r){
                    if(r.code === '000000'){
                        alert('操作成功', function(){
                            vm.reload();
                        });
                    }else{
                        alert(r.msg);
                    }
                }
            });
        },
        getMenuTree: function(roleId) {
            //加载菜单树
            $.get("shop/admin/service/menu/listAll", function(r){
                menu_ztree = $.fn.zTree.init($("#menuTree"), menu_setting, r.data);
                //展开所有节点
                menu_ztree.expandAll(true);

                if(roleId != null){
                    vm.getRole(roleId);
                }
            });
        },
        reload: function () {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam','page');
            $("#jqGrid").jqGrid('setGridParam',{
                postData:{'roleName': vm.q.roleName},
                page:page
            }).trigger("reloadGrid");
        }
    }
});