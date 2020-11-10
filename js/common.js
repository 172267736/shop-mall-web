//jqGrid的配置信息
$.jgrid.defaults.width = 1000;
$.jgrid.defaults.responsive = true;
$.jgrid.defaults.styleUI = 'Bootstrap';

var baseURL = "../../";

//工具集合Tools
window.T = {};

// 获取请求参数
// 使用示例
// location.href = http://localhost:8080/index.html?id=123
// T.p('id') --> 123;
var url = function(name) {
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
};
T.p = url;

//全局配置
$.ajaxSetup({
	dataType: "json",
    headers: {"Content-Type": "application/json;charset=utf8", "AuthToken": localStorage.getItem("AuthToken")},
	cache: false
});

//重写alert
window.alert = function(msg, callback){
	parent.layer.alert(msg, function(index){
		parent.layer.close(index);
		if(typeof(callback) === "function"){
			callback("ok");
		}
	});
}

//重写confirm式样框
window.confirm = function(msg, callback){
	parent.layer.confirm(msg, {btn: ['确定','取消']},
	function(){//确定事件
		if(typeof(callback) === "function"){
			callback("ok");
		}
	});
}

//选择一条记录
function getSelectedRow() {
    var rowKey = $("#jqGrid").getGridParam("selrow");
    if(!rowKey){
    	alert("请选择一条记录");
    	return ;
    }
    var selectedIDs = $("#jqGrid").getGridParam("selarrrow");
    if(selectedIDs.length > 1){
    	alert("只能选择一条记录");
    	return ;
    }
    
    return selectedIDs[0];
}

//选择一条记录
function getSelectedRowByKey(key) {
    var rowKey = $("#jqGrid").getGridParam("selrow");
    if(!rowKey){
        alert("请选择一条记录");
        return ;
    }
    var selectedIDs = $("#jqGrid").getGridParam("selarrrow");
    if(selectedIDs.length > 1){
        alert("只能选择一条记录");
        return ;
    }
    return $("#jqGrid").jqGrid('getRowData',selectedIDs[0])[key];
}


//选择一条记录
function getSelectedRowData(rowId) {
    return $("#jqGrid").jqGrid('getRowData',rowId);
}

//选择多条记录
function getSelectedRows() {
    var rowKey = $("#jqGrid").getGridParam("selrow");
    if(!rowKey){
    	alert("请选择一条记录");
    	return ;
    }
    return $("#jqGrid").getGridParam("selarrrow");
}

//判断是否为空
function isBlank(value) {
    return !value || !/\S/.test(value)
}

//构建url参数
function buildUrl(url, param) {
    url = url + "?";
    for (var o in param) {
        if (param[o] != -1&&param[o] != "") {
            url += o + "=" + param[o] + "&";
        }
    }
    return url.substring(0, url.length - 1);
}

function timeFormat(timestamp) {
    var date = new Date(timestamp);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) :         
            date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() + ' ': 
            date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D + h + m + s;
}   