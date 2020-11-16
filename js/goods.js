$(function () {
    $("#jqGrid").jqGrid({
        url: '/shop/admin/service/goods/list',
        datatype: "json",
        colModel: [			
			{ label: '主键编号', name: 'uniqueId', width: 45, key: true },
			{ label: '名称', name: 'goodsName', width: 75 },
            { label: '品牌', name: 'goodsBrand', width: 75 },
            { label: '序号', name: 'topSort', width: 30 },
            { label: '标签', name: 'goodsTags', width: 60, align: 'left' }, 
            { label: '分类', name: 'belongClassifyNames', width: 60, align: 'left'},
			{ label: '原价(元)', name: 'originalPrice', width: 60 }, 
            { label: '现价(元)', name: 'currentPrice', width: 60 }, 
            { label: '库存单位', name: 'stockUnit', width: 30 },
            { label: '状态', name: 'status', width: 30 , formatter: function(value, options, row){
                return value === 1 ? '<span class="label label-success">上架</span>':'<span class="label label-danger">下架</span>';
            }},
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
            status: null,
            goodsName:'',
            goodsTag:''
        },
        statusList:[
            {id:null,name:'状态'},
            {id:'0',name:'下架'},
            {id:'1',name:'上架'}
        ],
        showList: true,
        bigImgList:{},
        goodsTags:{
            belongClassifyIdList:[]
        },
        title:null,
        goods:{
        }
    },
    methods: {
        getClassifyTree: function(id){
            //加载菜单树
            $.get("shop/admin/service/goods/type/listAll", function(r){
                if(r.code == '000000'){
                     ztree = $.fn.zTree.init($("#classifyTree"), setting, r.data);
                     //展开所有节点
                    ztree.expandAll(true);
                    if(id != null){
                        vm.getGoods(id);
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
           location.href = "goodsSave.html";
        },
        update: function () {
            var id = getSelectedRowByKey("uniqueId");
            if(id == null){
                return ;
            }
            vm.showList = false;
            vm.title = "修改";
            vm.disabledList = {goodsName:true};
            vm.getClassifyTree(id);
        },
        getGoods: function(id) {
            $.get("shop/admin/service/goods/detail?id="+id, function(r){
                if(r.code === '000000'){
                    vm.goods = r.data;
                    var classifyIds = vm.goods.belongClassifyIdList;
                    for(var i=0; i<classifyIds.length; i++) {
                        var node = ztree.getNodeByParam("uniqueId", classifyIds[i]);
                        ztree.checkNode(node, true, false);
                    }
                    vm.getGoodsProperty(id);
                    vm.getGoodsSku(id);
                }else if(r.code == '100002'){
                    location.href = "login.html";
                }else{
                    alert(r.msg);
                }
            });
        },
        getGoodsProperty: function(id){
            var colunms = Property.initColumn();
            var url = id==null?'':"shop/admin/service/goods/property/listByGoodsId?goodsId="+id;
            var table = new TreeTable(Property.id,url , colunms);
            table.setExpandColumn(0);
            table.setIdField("uniqueId");
            table.setCodeField("uniqueId");
            table.setParentCodeField("goodsPropertyKeyUniqueId");
            table.setExpandAll(false);
            table.init();
            Property.table = table;
        },
        getGoodsSku: function(id){
            var colunms = Sku.initColumn();
            var url = id==null?'':"shop/admin/service/goods/sku/listByGoodsId?goodsId="+id;
            var table = new TreeTable(Sku.id,url, colunms);
            table.setIdField("uniqueId");
            table.setCodeField("uniqueId");
            table.setParentCodeField("goodsPropertyKeyUniqueId");
            table.init();
            Sku.table = table;
        },
        updatePrice: function () {
            var url = "shop/admin/service/goods/updatePrice";
            var req = {"uniqueId":vm.goods.uniqueId,"currentPrice":vm.goods.currentPrice};
            $.ajax({
                type: "POST",
                url: url,
                contentType: "application/json",
                data: JSON.stringify(req),
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
                postData:{'status': vm.q.status, 'goodsTag': vm.q.goodsTag, 'goodsName': vm.q.goodsName},
                page:page
            }).trigger("reloadGrid");
        }
    }
});

var Property = {
    id: "goodsPropertyTable",
    table: null,
    layerIndex: -1
};


var Sku = {
    id: "goodsSkuTable",
    table: null,
    layerIndex: -1
};

/**
 * 初始化表格的列
 */

Property.initColumn = function () {
    var columns = [
        {title: '属性键', field: 'propertyKey', align: 'center', valign: 'middle', width: '80px',formatter: function(row, index){
             if(row.goodsPropertyKeyUniqueId!=0){
                return '<div class="form-property"></div>'
             }else{
                return row.propertyKey;
             }
        }},
        {title: '属性', field: 'propertyName', align: 'center', valign: 'middle', width: '80px',formatter: function(row, index){
             if(row.goodsPropertyKeyUniqueId!=0){
                return '<div class="form-property">'+row.propertyName+'</div>'
             }else{
                return row.propertyName;
             }
        }},
        {title: '排序号', field: 'sortNumber', align: 'center', valign: 'middle', width: '40px',formatter: function(row, index){
             if(row.goodsPropertyKeyUniqueId!=0){
                return '<div class="form-property">'+row.sortNumber+'</div>'
             }else{
                return row.sortNumber;
             }
        }},
        {title: '价格涨幅', field: 'valueCost', align: 'center', valign: 'middle', width: '40px',formatter: function(row, index){
             if(row.goodsPropertyKeyUniqueId!=0){
                return '<div class="form-property">'+row.valueCost+'元</div>'
             }else{
                return row.valueCost;
             }
        }}
    ];
    return columns;
};

Sku.initColumn = function () {
    var columns = [
        {title: '图片', field: 'smallImg', align: 'center', valign: 'middle', width: '80px',formatter: function(row, index){
            return '<img src="'+row.smallImg+'" style="width:18px;height:18px;"/>';
        }},
        {title: '属性', field: 'property', align: 'center', valign: 'middle', width: '200px'},
        {title: '价格', field: 'price', align: 'center', valign: 'middle', width: '40px'},
        {title: '库存量', field: 'goodsStock', align: 'center', valign: 'middle', width: '80px'}
    ];
    return columns;
};
