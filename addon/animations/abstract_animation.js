import Ember from 'ember';

var instanceIndex = 0;

var AbstractAnimation = Ember.Object.extend(Ember.Evented, {
	name:null,
	_state: 'init',
	_uid: null,
	init:function(){
		this._super.apply(this, arguments);
		this._uid = this.uid();
	},
	getState:function(){
		return this._state;
	},
	toString:function(){
		var viewString = '';
		if (this.view){
			viewString = '<' + this.view.toString() + '>';
		}
		return '[AbstractAnimation] ' + this._uid + viewString;
	},
	uid:function(){
		var uid = 'animation_' + instanceIndex;
		instanceIndex ++;
		return uid;
	},
	reset:function(){
		this.stop();
		this._state = 'init';
	},
	start:function(){
		// if (this.getState() === 'started'){
		// 	return;
		// }
		this._start();
	},
	_start:function(){
		this._state = 'started';
		this.trigger('started', this);
	},
	stop:function(){
		// if (this.getState() === 'stopped'){
		// 	return;
		// }
		this._stop();
	},
	_stop:function(){
		this._state = 'stopped';
		this.trigger('stopped', this);
	},
	complete:function(){
		// if (this.getState() === 'completed'){
		// 	return;
		// }
		this._complete();
	},
	_complete:function(){
		this._state = 'completed';
		this.trigger('completed', this);
	},
	destroy:function(){
		this._super.apply(this, arguments);
	}
});

export default AbstractAnimation;