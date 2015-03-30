import Ember from 'ember';
import EmberSlick from 'ember-slick';

var ProjectPage = Ember.View.extend({
	preserveView: false,
	templateName:'items/item-page',
	actions:{
		togglePreserveView:function(){
			this.toggleProperty('preserveView');
		}
	},
	
});



export default ProjectPage;