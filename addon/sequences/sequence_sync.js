import Ember from 'ember';

var SequenceSync = Ember.Mixin.create({
	sequenceAnimations:function(animation){
		console.log('SEQUENCE ANIMATION SYNC');
		var self = this;
		animation.start();
	},
});

export default SequenceSync;