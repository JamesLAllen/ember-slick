import Ember from 'ember';
// import EmberPardon from '../ember-pardon/ember_pardon';
import EmberSlick from './ember_slick';

var SlickAnimatedView = Ember.Mixin.create({
	init:function(){
		this._super.apply(this, arguments);
		if (this.isVirtual){
			return;
		}
		this.slick = EmberSlick(this);
	},
	willShow:Ember.K,
	willHide:Ember.K,
	show:function(complete, options){
		this.set('isVisible', true);
		complete();
	},
	hide:function(complete, options){
		complete();
	},
	showDidComplete:Ember.K,
	hideDidComplete:Ember.K,
	childrenWillShow:Ember.K,
	childrenWillHide:Ember.K,
	childrenDidShow:Ember.K,
	childrenDidHide:Ember.K,
	willInsertElement:function(){
		this._super.apply(this, arguments);
		if (!this.slick){
			return;
		}
		this.set('isVisible', false);
	},
	didInsertElement:function(){
		this._super.apply(this, arguments);
		if (!this.slick){
			return;
		}
		this.slick.insertView();
	},
	beforeDestroy:function(){
		if (this.destroyNow){
			this.unpardon();
			return;
		}
		if (!this.slick && !this.destroyNow){
			this.pardon();
			var childrenDestroyed = true;
			this.get('childViews').forEach(function(view){
				if (view.slick){
					if (!view.slick.readyToDestroy()){
						childrenDestroyed = false;
						view.destroy();
					}
				}
				
			}, this);
			if (childrenDestroyed){
				this.unpardon();
			}
			return;
		}
		if (!this.slick){
			return;
		}
		this.slick.destroyView();
	}
});

export default SlickAnimatedView;