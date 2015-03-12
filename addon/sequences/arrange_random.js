import Ember from 'ember';

var ArrangeRandom = Ember.Mixin.create({
	arrangeAnimations:function(){
		var animations = this._animations.copy();
		var currentIndex = animations.length;
		var temporaryValue = null;
		var randomIndex = null;
		while (currentIndex != 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = animations[currentIndex];
			animations[currentIndex] = animations[randomIndex];
			animations[randomIndex] = temporaryValue;
		}
		return animations;
	},
});

export default ArrangeRandom;