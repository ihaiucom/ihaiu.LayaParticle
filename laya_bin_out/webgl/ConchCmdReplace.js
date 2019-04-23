//class laya.layagl.ConchCmdReplace
var ConchCmdReplace=(function(){
	function ConchCmdReplace(){}
	__class(ConchCmdReplace,'laya.layagl.ConchCmdReplace');
	ConchCmdReplace.__init__=function(){
		var cmdO=/*__JS__ */laya.display.cmd;
		var cmdONative=/*__JS__ */laya.layagl.cmdNative;
		var key;
		for (key in cmdO){
			if (cmdONative[key+"Native"]){
				cmdO[key].create=cmdONative[key+"Native"].create;
			}
		}
	}

	return ConchCmdReplace;
})()


