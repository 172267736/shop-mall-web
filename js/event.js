$(function () {
    $("#jqGrid").jqGrid({
        url: '/shop/admin/service/event/track/list',
        datatype: "json",
        colModel: [			
			{ label: '事件编号', name: 'uniqueId', width: 45, key: true },
			{ label: '事件标志', name: 'eventDo', width: 75 },
            { label: '事件人', name: 'eventWho', width: 75 },
			{ label: '发生时间', name: 'eventWhen', width: 60, formatter: function(value, options, row){
                return timeFormat(value);
            }}, 
            { label: '版本', name: 'eventVersion', width: 60 }, 
			{ label: '来源', name: 'eventSource', width: 85, }, 
            { label: '来源', name: 'eventDescription', width: 85, }
        ],
		viewrecords: true,
        height: 385,
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: true, 
        rownumWidth: 25, 
        autowidth:true,
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
            eventWho: null,
            eventDo: null
        },
        title:null
    },
    methods: {
        query: function () {
            vm.reload();
        },
        reload: function () {
            vm.showList = true;
            var page = $("#jqGrid").jqGrid('getGridParam','page');
            $("#jqGrid").jqGrid('setGridParam',{
                postData:{'eventWho': vm.q.eventWho,'eventDo': vm.q.eventDo},
                page:page
            }).trigger("reloadGrid");
        }
    }
});