$(function () {
    $("#jqGrid").jqGrid({
        url: '/shop/admin/service/menu/list',
        datatype: "json",
        colModel: [         
            {label: '菜单编号', name: 'uniqueId', visible: false, align: 'center', valign: 'middle', width: '80px'},
            {label: '菜单名称', name: 'menuName', align: 'center', valign: 'middle', width: '180px'},
            {label: '上级菜单', name: 'parentMenuName', align: 'center', valign: 'middle', width: '100px'},
            {label: '图标', name: 'icon', align: 'center', valign: 'middle', width: '80px', formatter: function(value, options, row){
                return value == null ? '' : '<i class="'+value+' fa-lg"></i>';
            }},
            {label: '类型', name: 'menuType', align: 'center', valign: 'middle', width: '100px',formatter: function(value, options, row){
                if(value === 1){
                    return '<span class="label label-primary">目录</span>';
                }
                if(value === 2){
                    return '<span class="label label-success">菜单</span>';
                }
                if(value === 3){
                    return '<span class="label label-warning">按钮</span>';
                }
            }},
            {label: '排序号', name: 'sortNumber', align: 'center', valign: 'middle', width: '100px'},
            {label: '菜单URL', name: 'menuUrl', align: 'center', valign: 'middle', width: '160px'}
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
        },
        gridComplete:function(){
            //隐藏grid底部滚动条
            $("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
        }
    });
});

var ztree;

var setting = {
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
    }
};

var vm = new Vue({
    el:'#rrapp',
    data:{
        q:{
            menuName:'',
            menuType:null
        },
        showList: true,
        title: null,
        menu:{
            parentMenuName:null,
            parentUniqueId:0,
            menuType:1,
            sortNumber:0
        }
    },
    methods: {
        getMenu: function(menuId){
            //加载菜单树
            $.get("shop/admin/service/menu/listAll", function(r){
                ztree = $.fn.zTree.init($("#menuTree"), setting, r.data);
                if(vm.menu.parentUniqueId!=0){
                    var node = ztree.getNodeByParam("uniqueId",vm.menu.parentUniqueId);
                    ztree.selectNode(node);
                    vm.menu.parentMenuName = node.name;
                }
            })
        },
        query: function () {
            vm.reload();
        },
        add: function(){
            vm.showList = false;
            vm.title = "新增";
            vm.menu = {parentMenuName:null,parentUniqueId:0,menuType:1,sortNumber:0};
            vm.getMenu();
        },
        update: function () {
            var menuId = getSelectedRowByKey("uniqueId");
            if(menuId == null){
                return ;
            }
            $.get("shop/admin/service/menu/detail?id="+menuId, function(r){
                vm.showList = false;
                vm.title = "修改";
                vm.menu = r.data;
                vm.getMenu(menuId);
            });
        },
        del: function () {
            var menuId = getSelectedRowByKey("uniqueId");
            if(menuId == null){
                return ;
            }
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "shop/admin/service/menu/delete?id="+menuId,
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
            });
        },
        saveOrUpdate: function () {
            if(isBlank(vm.menu.menuName)){
                alert("菜单名称不能为空");
                return true;
            }

            //菜单
            if(vm.menu.menuType === 2 && isBlank(vm.menu.menuUrl)){
                alert("菜单URL不能为空");
                return true;
            }
            var url = vm.menu.uniqueId == null ? "shop/admin/service/menu/save" : "shop/admin/service/menu/update";
            $.ajax({
                type: "POST",
                url:  url,
                contentType: "application/json",
                data: JSON.stringify(vm.menu),
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
        menuTree: function(){
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "选择菜单",
                area: ['300px', '450px'],
                shade: 0,
                shadeClose: false,
                content: jQuery("#menuLayer"),
                btn: ['确定', '取消'],
                btn1: function (index) {
                    var node = ztree.getSelectedNodes();
                    //选择上级菜单
                    vm.menu.parentUniqueId = node[0].uniqueId;
                    vm.menu.parentMenuName = node[0].name;

                    layer.close(index);
                }
            });
        },
        reload: function () {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam','page');
            $("#jqGrid").jqGrid('setGridParam',{
                postData:{'menuName': vm.q.menu,'menuType':vm.q.menuType},
                page:page
            }).trigger("reloadGrid");
        }
    }
});