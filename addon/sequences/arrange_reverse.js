import Ember from 'ember';

var ArrangeReverse = Ember.Mixin.create({
	arrangeAnimations:function(){
		var animations = this._animations.copy();
		return animations.reverseObjects();
	},
});

export default ArrangeReverse;