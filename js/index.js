//生成菜单
var menuItem = Vue.extend({
    name: 'menu-item',
    props:{item:{}},
    template:[
        '<li>',
        '	<a v-if="item.menuType === 1" href="javascript:;">',
        '		<i v-if="item.icon != null" :class="item.icon"></i>',
        '		<span>{{item.menuName}}</span>',
        '		<i class="fa fa-angle-left pull-right"></i>',
        '	</a>',
        '	<ul v-if="item.menuType === 1" class="treeview-menu">',
        '		<menu-item :item="item" v-for="item in item.child"></menu-item>',
        '	</ul>',

        '	<a v-if="item.menuType === 2 && item.parentId === 0" :href="\'#\'+item.menuUrl">',
        '		<i v-if="item.icon != null" :class="item.icon"></i>',
        '		<span>{{item.menuName}}</span>',
        '	</a>',

        '	<a v-if="item.menuType === 2 && item.parentId != 0" :href="\'#\'+item.menuUrl">',
        '		<i v-if="item.icon != null" :class="item.icon"></i>',
        '		<i v-else class="fa fa-circle-o"></i> {{item.menuName}}',
        '	</a>',
        '</li>'
    ].join('')
});

//iframe自适应
$(window).on('resize', function() {
	var $content = $('.content');
	$content.height($(this).height() - 154);
	$content.find('iframe').each(function() {
		$(this).height($content.height());
	});
}).resize();

//注册菜单组件
Vue.component('menuItem',menuItem);

var vm = new Vue({
	el:'#rrapp',
	data:{
		userName:'',
		menuList:{},
		main:"main.html",
		password:'',
		newPassword:'',
        navTitle:"控制台"
	},
	methods: {
		getMenuList: function (event) {
			$.getJSON("/shop/admin/service/menu/listByUser", function(r){
				if(r.code=="000000"){
					vm.menuList = r.data;
				}else if(r.code=="100002"){
					parent.location.href = "login.html"
				}
			});
		},
		updatePassword: function(){
			layer.open({
				type: 1,
				skin: 'layui-layer-molv',
				title: "修改密码",
				area: ['550px', '270px'],
				shadeClose: false,
				content: jQuery("#passwordLayer"),
				btn: ['修改','取消'],
				btn1: function (index) {
					var data = "userName="+vm.userName+"&oldPwd="+vm.password+"&newPwd="+vm.newPassword;
					$.ajax({
						type: "POST",
					    url: "/shop/admin/service/user/password/update",
					    data: data,
					    dataType: "json",
					    success: function(result){
							if(result.code == "000000"){
								layer.close(index);
								layer.alert('修改成功', function(index){
									location.reload();
								});
							}else{
								layer.alert(result.msg);
							}
						}
					});
	            }
			});
		},
    donate: function () {
	        layer.open({
	            type: 2,
	            title: false,
	            area: ['806px', '467px'],
	            closeBtn: 1,
	            shadeClose: false,
	            content: ['http://cdn.renren.io/donate.jpg', 'no']
	        });
    	}
	},
	created: function(){
		this.userName = localStorage.getItem("userName");
		this.getMenuList();
	},
	updated: function(){
		//路由
		var router = new Router();
		routerList(router, vm.menuList);
		router.start();
	}
});



function routerList(router, menuList){
	for(var key in menuList){
		var menu = menuList[key];
		if(menu.menuType == 1){
			routerList(router, menu.child);
		}else if(menu.menuType == 2){
			router.add('#'+menu.menuUrl, function() {
				var url = window.location.hash;
				
				//替换iframe的url
			    vm.main = url.replace('#', '');
			    
			    //导航菜单展开
			    $(".treeview-menu li").removeClass("active");
			    $("a[href='"+url+"']").parents("li").addClass("active");
			    
			    vm.navTitle = $("a[href='"+url+"']").text();
			});
		}
	}
}
