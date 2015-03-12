import Ember from 'ember';
import AbstractAnimation from './abstract_animation';

var SequenceAnimation = AbstractAnimation.extend({
	length:function(){
		if(this.get('_queue')){
			return this.get('_queue').length;
		}
		return 0;
	}.property('_queue').volatile(),
	_animations:null,
	_queue:null,
	_queueIndex:0,
	_currentAnimation:null,
	_currentId:null,
	init:function(){
		this._super.apply(this, arguments);
		this._store = this._store || {};
		this._animations = this._animations || Ember.A();
		this._queue = this._queue || Ember.A();
	},
	toString:function(){
		var viewString = '';
		if (this.view){
			viewString = '<' + this.view.toString() + '>';
		}
		return '[SequenceAnimation] ' + this.type + ' ' + this._uid + viewString;
	},
	start:function(){
		this._super.apply(this, arguments);
		this.startCurrentAnimation();
	},
	stop:function(){
		if (this.getState() !== 'started'){
			return;
		}
		if (this._currentAnimation){
			this._currentAnimation.stop();
		}
		this._super.apply(this, arguments);
	},
	complete:function(){
		if (this.getState() === 'completed'){
			return;
		}
		this._super.apply(this, arguments);
	},
	reset:function(){
		this._super.apply(this, arguments);
		this._currentAnimation = null;
		this._queueIndex = 0;
		this._animations.forEach(function(animation, index){
			// this.removeAnimationListeners(animation);
			if (animation && animation.reset){
				animation.reset();
			}
		}, this);
		
	},
	destroy:function(){
		this._super.apply(this, arguments);
	},
	startCurrentAnimation:function(){
		// if (this.getState() !== 'started'){
		// 	return;
		// }
		// console.log('start current animation', this._queue.length, this._currentAnimation, this._queueIndex);

		if (this._queue.length <= 0){
			// console.log('QUEUE LENGTH IS < 0, COMPLETE', this.toString());
			this.complete();
			return;
		}
		if (!this._currentAnimation){
			this._queueIndex = 0;
			this._currentAnimation = this._queue[this._queueIndex];
		}
		// this.addAnimationListeners(this._currentAnimation);
		this._currentAnimation.one('started', this, this.handleAnimationStarted);
		this._currentId = this._currentAnimation.toString();
		this._currentAnimation.start();
	},
	nextAnimation:function(){
		this._nextAnimation();
	},
	_nextAnimation:function(){
		// console.log('nextAnimation', this.getState());
		if (this.getState() !== 'started'){
			return;
		}
		// console.log(this._queueIndex, this._queue.length, this._queue);
		var nextIndex = this._queueIndex + 1;
		if (nextIndex >= this._queue.length){
			this.complete();
			return;
		}
		this._queueIndex = nextIndex;
		this._currentAnimation = this._queue[this._queueIndex];
		this.startCurrentAnimation();
	},
	handleAnimationStarted:function(animation){

		animation.on('completed', this, this.handleAnimationCompleted);
		animation.on('stopped', this, this.handleAnimationStopped);
	},
	handleAnimationCompleted:function(animation){

		animation.off('completed', this, this.handleAnimationCompleted);
		animation.off('stopped', this, this.handleAnimationStopped);
		if (this._currentAnimation !== animation){
			console.log('animation completed but return silently');
			return;
		}
		Ember.run.scheduleOnce('afterRender', this, this.nextAnimation);
	},
	handleAnimationStopped:function(animation){
		animation.off('completed', this, this.handleAnimationCompleted);
		animation.off('stopped', this, this.handleAnimationStopped);
		if (this._currentAnimation !== animation){
			return;
		}
		this.stop();
	},

	updateQueue:function(){
		this.stop();
		Ember.run.scheduleOnce('sync', this, this._updateQueue);
	},
	_updateQueue:function(){
		this._queue = this.arrangeAnimations();
	},
	addAnimation:function(animation){
		if (!animation){
			// TODO: throw ember error here, assert that it's of type AbstractAnimation
		}
		this._animations.removeObject(animation);
		this._animations.addObject(animation);
		this.updateQueue();
	},
	removeAnimation:function(animation){
		this._animations.removeObject(animation);
		this.updateQueue();
	},
	replaceAllAnimations:function(animations){
		this._animations = Ember.A();
		animations.forEach(function(animation, index){
			this.addAnimation(animation);
		}, this);
	},
	arrangeAnimations:function(){
		return this._animations;
	},
	sequenceAnimations:function(){

	}
});

export default SequenceAnimation;