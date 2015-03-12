import Ember from 'ember';


var AnimationState = Ember.Object.extend({
	name: null,
	animation: null,
	// get animation(){
	// 	return this._animation;
	// },
	// set animation(value){
	// 	this._animation = value;
	// },
	enter: function(){
		var animation = this.get('animation');
		if (animation && animation.getState() !== 'started'){
			animation.start();
		}
		return this;
	},
	exit: function(){
		var animation = this.get('animation');
		if (animation){
			// console.log('exit state', animation.getState(), this.name);
		}
		if (animation && animation.getState() === 'started'){
			animation.stop();
		}
		return this;
	},

});

export default AnimationState;