import Ember from 'ember';

export default Ember.ObjectController.extend({
	needs:['items'],
	onInit:function(){
		
	}.on('init'),
	items:function(){
		return this.get('controllers.items.model');
	}.property('controllers.items.model'),
});
