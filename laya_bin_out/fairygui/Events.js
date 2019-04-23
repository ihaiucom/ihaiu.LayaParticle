//class fairygui.Events
var Events=(function(){
	function Events(){}
	__class(Events,'fairygui.Events');
	Events.createEvent=function(type,target,source){
		fairygui.Events.$event.setTo(type,target,source?source.target:target);
		if(source){
			fairygui.Events.$event.touchId=source.touchId;
			fairygui.Events.$event.nativeEvent=source.nativeEvent;
		}
		else{
			fairygui.Events.$event.nativeEvent=null;
		}
		fairygui.Events.$event._stoped=false;
		return fairygui.Events.$event;
	}

	Events.dispatch=function(type,target,source){
		target.event(type,fairygui.Events.createEvent(type,target,source));
	}

	Events.STATE_CHANGED="fui_state_changed";
	Events.XY_CHANGED="fui_xy_changed";
	Events.SIZE_CHANGED="fui_size_changed";
	Events.SIZE_DELAY_CHANGE="fui_size_delay_change";
	Events.CLICK_ITEM="fui_click_item";
	Events.SCROLL="fui_scroll";
	Events.SCROLL_END="fui_scroll_end";
	Events.DROP="fui_drop";
	Events.FOCUS_CHANGED="fui_focus_changed";
	Events.DRAG_START="fui_drag_start";
	Events.DRAG_MOVE="fui_drag_move";
	Events.DRAG_END="fui_drag_end";
	Events.PULL_DOWN_RELEASE="fui_pull_down_release";
	Events.PULL_UP_RELEASE="fui_pull_up_release";
	Events.GEAR_STOP="fui_gear_stop";
	__static(Events,
	['$event',function(){return this.$event=new Event();}
	]);
	return Events;
})()


