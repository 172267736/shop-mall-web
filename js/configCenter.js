$(function () {
    $("#jqGrid").jqGrid({
        url: '',
        datatype: "local",
        colModel: [			
			{ label: '属性名', name: 'key', width: 180, sortable:false ,align:'left'},
			{ label: '属性值', name: 'value',  width: 180, sortable:false,align:'left'}
        ],
		viewrecords: true,
        height: 600,
        rownumbers: true, 
        rownumWidth: 25, 
        autowidth:true,
        jsonReader : {
            root: "data"
        },
        ondblClickRow:function(rowId){
        	var rowId = $("#jqGrid").getGridParam("selrow");
			if(rowId == null){
				alert("请选择一条记录");
				return;
			}
        	vm.update(rowId);
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
		configPath:'',
		paths:[],
        secondNode: '',
		showList: true,
		title: null,
		config:{}
	},
	methods: {
		serverChange: function(event){
			vm.secondNode = event.target.value;
			vm.reload();
		},
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.config = {};
			vm.showList = false;
			vm.title = "新增";
		},
		update: function (rowId) {
			
		},
		del: function (event) {
			alert("haha");
			var ids = getSelectedRows($("#jqGrid"));
			if(ids == null){
				return;
			}
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "sys/config/delete",
                    contentType: "application/json",
				    data: JSON.stringify(ids),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								vm.reload();
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		saveOrUpdate: function (event) {
			// var url = vm.config.id == null ? "sys/config/save" : "sys/config/update";
			$.ajax({
				type: "POST",
			    url: url,
                contentType: "application/json",
			    data: JSON.stringify(vm.config),
			    success: function(r){
			    	if(r.code === 0){
						alert('操作成功', function(index){
							vm.reload();
						});
					}else{
						alert(r.msg);
					}
				}
			});
		},
		reload: function (event) {
			vm.showList = true;
			$("#jqGrid").jqGrid('setGridParam',{ 
				datatype: "json",
                url:buildUrl('api/config/center/getNode',{'secondNode': vm.secondNode})
            }).trigger("reloadGrid");
		}
	},
	created: function(){
		$.getJSON('api/config/center/listNode', function(r){
			if(r.code=="000000"){
				vm.paths = r.data.paths;
				vm.configPath = r.data.configPath;
				vm.secondNode = vm.paths[0];
				vm.reload();
			}else if(r.code=="100002"){
				parent.location.href = "login.html"
			}
		});
	}
});