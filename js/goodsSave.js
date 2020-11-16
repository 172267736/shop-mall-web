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
        statusList:[
            {id:null,name:'状态'},
            {id:'0',name:'下架'},
            {id:'1',name:'上架'}
        ],
        bigImgList:{},
        goodsTags:{
            belongClassifyIdList:[]
        },
        title:"新增",
        goods:{
            status:0
        }
    },
    methods: {
        save: function () {
            var id = getSelectedRowByKey("uniqueId");
            if(id == null){
                return ;
            }
            vm.showList = false;
            vm.title = "修改";
            vm.disabledList = {goodsName:true};
            vm.getClassifyTree(id);
        },
        reload: function(){
            location.href = "goods.html";
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
