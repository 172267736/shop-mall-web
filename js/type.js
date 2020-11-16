$(function () {
    $("#jqGrid").jqGrid({
        url: '/shop/admin/service/goods/type/list',
        datatype: "json",
        colModel: [			
			{ label: '主键编号', name: 'uniqueId', width: 45, key: true },
			{ label: '名称', name: 'classifyName', width: 75 },
            { label: '上级分类', name: 'classifyParentName', width: 75 },
            { label: '图标', name: 'classifyIcon', width: 75 },
			{ label: '说明', name: 'classifyDescription', width: 60 }, 
			{ label: '创建时间', name: 'createDate', width: 85, formatter: function(value, options, row){
                return timeFormat(value);
            }}
        ],
		viewrecords: true,
        height: 385,
        rowNum: 10,
		rowList : [10,30,50],
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

var ztree;

var setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "uniqueId",
            pIdKey: "classifyParentId",
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
            classifyName: null
        },
        showList: true,
        title:null,
        classify:{
            uniqueId:null,
            classifyName:'',
            classifyIcon:'',
            classifyParentId:0,
            classifyParentName:'',
            classifyDescription:''
        }
    },
    methods: {
        initTypeTree: function(typeId){
            //加载菜单树
            $.get("shop/admin/service/goods/type/listAll", function(r){
                if(r.code ==='000000'){
                    ztree = $.fn.zTree.init($("#typeTree"), setting, r.data);
                    if(vm.classify.classifyParentId!=0){
                        var node = ztree.getNodeByParam("uniqueId",vm.classify.classifyParentId);
                        ztree.selectNode(node);
                        vm.classify.classifyParentName = node.name;
                    }
                }else if(r.code == '100002'){
                    location.href = "login.html";
                }else{
                    alert(r.msg);
                }
            })
        },
        query: function () {
            vm.reload();
        },
        add: function(){
            vm.showList = false;
            vm.title = "新增";
            vm.classify = {uniqueId:null,classifyName:'',classifyIcon:'',classifyParentId:0,classifyParentName:'',classifyDescription:''};
            vm.initTypeTree();
        },
        update: function () {
            var id = getSelectedRowByKey("uniqueId");
            if(id == null){
                return ;
            }
            $.get("shop/admin/service/goods/type/detail?id="+id, function(r){
                 if(r.code === '000000'){
                        vm.showList = false;
                        vm.title = "修改";
                        vm.classify = r.data;
                        vm.initTypeTree(id);
                    }else if(r.code == '100002'){
                        location.href = "login.html";
                    }else{
                        alert(r.msg);
                    }
            });
        },
        showTypeTree: function(){
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "选择分类",
                area: ['300px', '450px'],
                shade: 0,
                shadeClose: false,
                content: jQuery("#typeLayer"),
                btn: ['确定', '取消'],
                btn1: function (index) {
                    var node = ztree.getSelectedNodes();
                    //选择上级菜单
                    vm.classify.classifyParentId = node[0].uniqueId;
                    vm.classify.classifyParentName = node[0].name;

                    layer.close(index);
                }
            });
        },
        saveOrUpdate: function () {
            var url = vm.classify.uniqueId == null ? "shop/admin/service/goods/type/save" : "shop/admin/service/goods/type/update";
            $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json",
                data: JSON.stringify(vm.classify),
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
        reload: function () {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam','page');
            $("#jqGrid").jqGrid('setGridParam',{
                postData:{'classifyName': vm.q.classifyName},
                page:page
            }).trigger("reloadGrid");
        }
    }
});