import Ember from 'ember';
import EmberSlick from 'ember-slick';

export default Ember.View.extend({
	preserveView:false,
	templateName: 'categories/category-tile',
	actions:{
		togglePreserveView:function(){
			this.toggleProperty('preserveView');
		}
	},
	
	// childrenShow:'asyncForward',
	// childrenHide:'asyncReverse',
	// childrenCombined:'syncForward',
	show:function(complete, options){
		// console.log('showing now! lkj;lkj;');
		// this._super.apply(this, arguments);
		// this._super(complete, options);
		this.$().fadeTo(500, 1, complete);
	},
	hide:function(complete, options){
		// console.log('hiding now! lkj;lkj;');
		// this._super.apply(this, arguments);
		this.$().fadeTo(500, 0, complete);
	}
});
