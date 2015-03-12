import Ember from 'ember';
import SlickAnimatedView from 'ember-slick/slick_animated_view';

var ProjectPage = Ember.View.extend(SlickAnimatedView, {
	preserveView: false,
	templateName:'items/item-page',
	actions:{
		togglePreserveView:function(){
			this.toggleProperty('preserveView');
		}
	},
	
});



export default ProjectPage;