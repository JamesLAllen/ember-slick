import Ember from 'ember';

var ArrangeForward = Ember.Mixin.create({
	arrangeAnimations:function(){
		return this._animations;
	},
});

export default ArrangeForward;