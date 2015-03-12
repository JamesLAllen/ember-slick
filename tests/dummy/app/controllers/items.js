import Ember from 'ember';

export default Ember.ArrayController.extend({
	// needs:['items/index'],
	// items:function(){
	// 	return this.get('controllers.items/index.model');
	// }.property('controllers.items/index.model'),
	// onProjectsChange:function(){
	// 	console.log('new items', this.get('items'));
	// }.observes('items')
});
