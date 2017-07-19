<!--
<div class="loading">
    <div class="loadingBox">
        <img src="/resource/images/index_loading.gif" />
        <p>加载中</p>
    </div>
</div>
-->
<!-- header -->
<div class="ui-layout-north">
    <div id="header" class="header">
		<div class="menuLogo"><a href="javascript:;">运营管理后台</a></div>
	    <ul id="userCont" class="userCont clearfix">
			<li>    
		    	<a class="userName">${loginUser.nickname}</a>
		    </li>
	    	<li class="accountInfo">    
	        	<a href="javascript:;" class="settingTigger settingPassword">设置</a>
	        </li>
	        <li>	
	        	<a href="javascript:;" class="loginOut">退出</a>
	        </li>
	    </ul>
	    <div class="topUserInfo">
	    	<span class="welcomeUs" id="welcomeUs">欢迎${loginUser.username}，今天是${.now?string("yyyy年M月d号 EEEE")}</span>
	    </div>
	    <!-- End menuPart -->	    
	</div>
	<div class="navBox"></div>	
</div>
