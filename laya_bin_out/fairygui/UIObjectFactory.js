//class fairygui.UIObjectFactory
var UIObjectFactory=(function(){
	function UIObjectFactory(){}
	__class(UIObjectFactory,'fairygui.UIObjectFactory');
	UIObjectFactory.setPackageItemExtension=function(url,type){
		if (url==null)
			throw new Error("Invaild url: "+url);
		var pi=UIPackage.getItemByURL(url);
		if (pi !=null)
			pi.extensionType=type;
		UIObjectFactory.packageItemExtensions[url]=type;
	}

	UIObjectFactory.setLoaderExtension=function(type){
		fairygui.UIObjectFactory.loaderType=type;
	}

	UIObjectFactory.resolvePackageItemExtension=function(pi){
		pi.extensionType=UIObjectFactory.packageItemExtensions["ui://"+pi.owner.id+pi.id];
		if(!pi.extensionType)
			pi.extensionType=UIObjectFactory.packageItemExtensions["ui://"+pi.owner.name+"/"+pi.name];
	}

	UIObjectFactory.newObject=function(pi){
		if(pi.extensionType!=null)
			return new pi.extensionType();
		else
		return UIObjectFactory.newObject2(pi.objectType);
	}

	UIObjectFactory.newObject2=function(type){
		switch (type){
			case 0:
				return new GImage();
			case 1:
				return new GMovieClip();
			case 9:
				return new GComponent();
			case 6:
				return new GBasicTextField();
			case 7:
				return new GRichTextField();
			case 8:
				return new GTextInput();
			case 5:
				return new GGroup();
			case 10:
				return new GList();
			case 3:
				return new GGraph();
			case 4:
				if (fairygui.UIObjectFactory.loaderType !=null)
					return new fairygui.UIObjectFactory.loaderType();
				else
				return new GLoader();
			case 12:
				return new GButton();
			case 11:
				return new GLabel();
			case 14:
				return new GProgressBar();
			case 15:
				return new GSlider();
			case 16:
				return new GScrollBar();
			case 13:
				return new GComboBox();
			default :
				return null;
			}
	}

	UIObjectFactory.packageItemExtensions={};
	UIObjectFactory.loaderType=null;
	return UIObjectFactory;
})()


