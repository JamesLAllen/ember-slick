import Ember from 'ember';

var SequenceAsync = Ember.Mixin.create({

	sequenceAnimations:function(animation){
		// var self = this;
		console.log('SEQUENCE ANIMATION ASYNC');
		// animation.start().then(function(){
		// 	self.animationCompleted(animation);
		// }).catch(function(){
		// 	self.animationAborted(animation);
		// 	self.abort();
		// });

		if (this.get('_queue').length <= 0){
			return this.complete();
		}
		var self = this;
		this.get('_queue').forEach(function(id, index){
			var item = self.getAnimation(id);
			// console.log('each item', item);
			item.set('index', index);
			Ember.run.scheduleOnce('afterRender', self, function(){
				// console.log('item = ', item);
				item.start();
			});
		});
		// self.startNextAnimation();
	},
	handleSequenceCompleted:function(animation){
		// console.log('slkjhlkjhlequence completed', name);
		animation.off('isComplete', this, this.handleSequenceCompleted);
		animation.off('abort', this, this.handleSequenceAborted);
		this.get('_completedAnimations').push(animation.toString());
		if (this.get('_completedAnimations').length >= this.get('_queue').length){
			this.complete();
		}
		// this.startNextAnimation();


	},
});

export default SequenceAsync;