import Ember from 'ember';
import SlickAnimatedView from 'ember-slick/slick_animated_view';

export default Ember.View.extend(SlickAnimatedView, {
	preserveView:false,
	templateName: 'categories/category-tile',
	actions:{
		togglePreserveView:function(){
			this.toggleProperty('preserveView');
		}
	},
	show:function(complete, options){
		// console.log('showing now! lkj;lkj;');
		this._super.apply(this, arguments);
		// this._super(complete, options);
	},
	hide:function(complete, options){
		// console.log('hiding now! lkj;lkj;');
		this._super.apply(this, arguments);
	}
});
