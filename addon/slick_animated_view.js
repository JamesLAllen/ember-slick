import Ember from 'ember';
import EmberPardon from 'ember-pardon';
import SlickCore from './slick_core';

Ember.View.reopen(EmberPardon);

var SlickAnimatedView = Ember.Mixin.create({
	init:function(){
		this._super.apply(this, arguments);
		if (this.isVirtual){
			return;
		}
		this.slick = SlickCore(this);
	},
	willShow:Ember.K,
	willHide:Ember.K,
	show:function(complete, options){
		// this.set('isVisible', true);
		var complete = complete || Ember.K;
		// this.$().fadeTo(500, 1, complete);
		complete();
	},
	hide:function(complete, options){
		var complete = complete || Ember.K;
		// this.$().fadeTo(500, 0, complete);
		complete();
	},
	showInterrupt:Ember.K,
	hideInterrupt:Ember.K,
	didShow:Ember.K,
	didHide:Ember.K,
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