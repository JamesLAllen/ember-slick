import Ember from 'ember';

// var store = {};
var instanceIndex = 0;

var SlickCore = Ember.Object.extend(Ember.Evented, {
	view: null,
	sequences: null,
	animations: null,
	states: null,
	_destroyOnHide: true,
	_uid: null,
	_uIndex: null,
	_currentState: 'init',
	_animationState: 'preRender',
	_children: null,
	_childrenRemoving: null,
	_transitioning: false,
	init:function(){
		this._super.apply(this, arguments);
		this.generateUid();
		this._children = Ember.A();
		this._childrenRemoving = Ember.A();
		this.setupSequences();
		this.setupStates();
		this.addViewObservers();
	},
	toString:function(){
		return '<EmberSlick:' + this._uid + '>';
	},
	getState:function(){
		return this._currentState;
	},
	getAnimationState:function(){
		return this._animationState;
	},
	generateUid:function(){
		this._uIndex = instanceIndex;
		this._uid = 'slick_' + instanceIndex;
		instanceIndex ++;
	},
	setupSequences:function(){
		for (var name in this.sequences) {
			var sequence = this.sequences[name];
			var animation = this.animations[name];

			if (!sequence || !animation || (sequence && !sequence.addAnimation)){
				continue;
			}
			sequence.addAnimation(animation);
		}

		var childrenCombined = this.sequences['childrenCombined'];
		var showingSequence = this.sequences['showing'];
		var hidingSequence = this.sequences['hiding'];
		var childrenHiding = this.sequences['childrenHiding'];
		var childrenShowing = this.sequences['childrenShowing'];
		var childrenRemoving = this.sequences['childrenRemoving'];
		var childrenAdding = this.sequences['childrenAdding'];

		childrenCombined.addAnimation(childrenRemoving);
		childrenCombined.addAnimation(childrenAdding);

		if (childrenHiding){
			
			hidingSequence.addAnimation(childrenHiding);
		}
		if (childrenShowing){
			
			showingSequence.addAnimation(childrenShowing);
		}
		
		
	},
	setupStates:function(){
		for (var name in this.states) {
			var state = this.states[name];
			var sequence = this.sequences[name];
			if (!state || !sequence){
				continue;
			}
			state.animation = sequence;
		}
	},
	transitionTo:function(state){
		Ember.run.scheduleOnce('render', this, this._updateClasses, state);
		Ember.run.scheduleOnce('afterRender', this, this._transitionTo, state);
	},

	_updateClasses:function(state){

		if (!this.view || (this.view && !this.view.$())){
			return;
		}
		var previousState = this._currentState;

		if (previousState){
			this.view.$().removeClass(previousState);
		}
		if (!this.view.$().hasClass(state)){
			this.view.$().addClass(state);
		}
	},

	_transitionTo:function(state){
		if (this._currentState === state){
			return;
		}
		var previousState = this._currentState;
		this._currentState = state;

		if (this.states[previousState] && this.states[previousState].exit) { this.states[previousState].exit(); }

	    if (this.states[this._currentState].enter) { this.states[this._currentState].enter(); }
	},
	
	addViewObservers:function(){
		// Ember.addObserver(this.view, 'childViews', Ember.$.proxy(this.childrenUpdate, this));
		this.addAnimationListeners();
		this.addSequenceListeners();
		
	},
	addAnimationListeners:function(){
		var showing = this.animations['showing'];
		var hiding = this.animations['hiding'];
		showing.set('view', this.view);
		hiding.set('view', this.view);
		showing.on('started', this, this.handleAnimationStart);
		showing.on('stopped', this, this.handleAnimationStopped);
		showing.on('completed', this, this.handleAnimationComplete);

		hiding.on('started', this, this.handleAnimationStart);
		hiding.on('stopped', this, this.handleAnimationStopped);
		hiding.on('completed', this, this.handleAnimationComplete);
	},
	addSequenceListeners:function(){

		var showing = this.sequences['showing'];
		var hiding = this.sequences['hiding'];
		showing.on('started', this, this.handleSequenceStart);
		showing.on('stopped', this, this.handleSequenceStopped);
		showing.on('completed', this, this.handleSequenceComplete);

		hiding.on('started', this, this.handleSequenceStart);
		hiding.on('stopped', this, this.handleSequenceStopped);
		hiding.on('completed', this, this.handleSequenceComplete);
	},
	removeViewObservers:function(){
		this.removeAnimationListeners();
		this.removeSequenceListeners();

	},
	removeAnimationListeners:function(){
		var showing = this.animations['showing'];
		var hiding = this.animations['hiding'];
		showing.off('started', this, this.handleAnimationStart);
		showing.off('stopped', this, this.handleAnimationStopped);
		showing.off('completed', this, this.handleAnimationComplete);

		hiding.off('started', this, this.handleAnimationStart);
		hiding.off('stopped', this, this.handleAnimationStopped);
		hiding.off('completed', this, this.handleAnimationComplete);
	},
	removeSequenceListeners:function(){
		var showing = this.sequences['showing'];
		var hiding = this.sequences['hiding'];
		showing.off('started', this, this.handleSequenceStart);
		showing.off('stopped', this, this.handleSequenceStopped);
		showing.off('completed', this, this.handleSequenceComplete);

		hiding.off('started', this, this.handleSequenceStart);
		hiding.off('stopped', this, this.handleSequenceStopped);
		hiding.off('completed', this, this.handleSequenceComplete);
	},
	removeChild:function(slick){
		// slick._destroyOnHide = true;
		this._children.removeObject(slick);
		this._childrenRemoving.addObject(slick);
		this._childrenRemoving = this._childrenRemoving.sortBy('_uIndex');
		// Ember.run.scheduleOnce('sync', this, this.childrenUpdate);
		// Ember.run.debounce(this, this.childrenUpdate, 200);
		this.childrenUpdate();
	},
	addChild:function(slick){
		this._childrenRemoving.removeObject(slick);
		this._children.addObject(slick);
		this._children = this._children.sortBy('_uIndex');
		Ember.run.scheduleOnce('afterRender', this, this.childrenUpdate);
	},
	childrenUpdate:function(){
		this._isUpdating = true;
		this._childrenUpdate();
	},
	_childrenUpdate:function(){
		var adding = Ember.A();
		var removing = Ember.A();
		var hiding = Ember.A();

		var childrenShowing = this.sequences['childrenShowing'];
		var childrenHiding = this.sequences['childrenHiding'];

		var removingSequence = this.sequences['childrenCombined']._animations[0];
		var addingSequence = this.sequences['childrenCombined']._animations[1];

		if (this._childrenRemoving.length > 0){
			this._childrenRemoving.forEach(function(slick, index){
				var sequence = slick.sequences['hiding'];
				if (sequence){
					removing.addObject(sequence);
				}
			}, this);
			
		}
		
		if (this._children.length > 0){
			this._children.forEach(function(slick, index){
				var sequence = slick.sequences['showing'];
				var hidingSequence = slick.sequences['hiding'];
				if (sequence){
					adding.addObject(sequence);
				}
				if(hidingSequence){
					hiding.addObject(hidingSequence);
				}
			}, this);
			
		}
		childrenHiding.replaceAllAnimations(hiding);
		childrenShowing.replaceAllAnimations(adding);
		addingSequence.replaceAllAnimations(adding);
		removingSequence.replaceAllAnimations(removing);

		this.sequences['childrenCombined'].reset();

		if (this.getState() === 'init' && this.view){
			var parent = this.view.get('parentView');

			if (parent && parent.slick){
				parent.slick.addChild(this);
			}
			return;
		}
		this.sequenceChildren();
	},
	sequenceChildren:function(){
		var timeout = 70;
		this._isUpdating = false;
		Ember.run.scheduleOnce('afterRender', this, this._sequenceChildren);
	},
	_sequenceChildren:function(){
		if (this._isUpdating){
			return;
		}
		this._currentSequence = this.sequences['childrenCombined'];
		this._currentSequence.start();
	},
	handleAnimationStart:function(animation){
		var name = animation.name;
		var complete = Ember.$.proxy(animation.complete, animation);
		if (this.getAnimationState() === name || !this.view || !this.view.$()){
			complete();
			return;
		}
		this.view.$().addClass('animating');
		this._animationState = name;
		switch(name){
			case 'showing':
				if (this.getState() === 'shown'){
					complete();
					return;
				}
				this.view.trigger('show', complete);
				break;
			case 'hiding':
				if (this.getState() === 'hidden'){
					complete();
					return;
				}
				this.view.trigger('hide', complete);
				break;
		}
		
	},
	handleAnimationStopped:function(animation){
		if (this.view && this.view.$()){
			this.view.$().removeClass('animating');
		}
	},
	handleAnimationComplete:function(animation){
		if (!this.view.$()){
			return;
		}
		this.view.$().removeClass('animating');
	},
	handleSequenceStart:function(sequence){
		var name = sequence.name;
		if (this.getState() === name){
			return;
		}
		this._currentSequence = sequence;
		var name = sequence.name;
		switch(name){
			case 'showing':
				// if (this.getState() === 'shown'){
				// 	return;
				// }
				this.transitionTo('showing');
				break;
			case 'hiding':
				// if (this.getState() === 'hidden'){
				// 	return;
				// }
				this.transitionTo('hiding');
				break;
		}
	},
	handleSequenceStopped:function(sequence){
		if (this._currentSequence){

		}
	},

	handleSequenceComplete:function(sequence){
		var name = sequence.name;
		if (name !== this.getState()){
			return;
		}
		switch(name){
			case 'showing':
				this.transitionTo('shown');
				this.showViewComplete();
				break;
			case 'hiding':
				this.transitionTo('hidden');
				this.hideViewComplete();
				break;
		}
	},

	addAnimation:function(id, animation){
		if (!animation){
			return;
		}
		// if (Ember.typeOf(animation) !== )  // TODO: make sure is type of SimpleAnimation
		this.animations[id] = animation;
		var sequence = this.animations[id];
		if (!sequence){
			return;
		}
		sequence.addAnimation(animation);
	},
	getAnimation:function(id){
		return this.animations[id];
	},
	removeAnimation:function(id){
		delete this.animations[id];
	},
	addSequence:function(id, sequence){
		if (!sequence){
			return;
		}
		// if (Ember.typeOf(sequence) !== ) // TODO: make sure is type of AnimationSequence
		this.sequences[id] = sequence;
		var state = this.states[id];
		if (!state){
			return;
		}
		state.animation = sequence;
	},
	getSequence:function(id){
		return this.sequences[id];
	},
	removeSequence:function(animation){

	},
	addState:function(id, state){

		this.states[id] = state;
	},
	getStateById:function(id){
		return this.states[id];
	},
	removeState:function(id){

	},
	readyToShow:function(){
		var parentView = this.view.get('parentView');
		if (!parentView || (parentView && !parentView.slick)){
			return true;
		}
		if (parentView.slick.getState() === 'hidden' || parentView.slick.getState() === 'init'){
			return false;
		}
		return true;
	},
	readyToHide:function(){
		if (this._childrenRemoving.length <= 0){
			return true;
		}
		var childrenHidden = true;
		this._childrenRemoving.forEach(function(child, index){
			if (child.getState() !== 'hidden'){
				childrenHidden = false;
			}
		}, this);
		if (!childrenHidden){
			return false;
		}
		return true;
	},
	readyToDestroy:function(){
		if (!this.view){
			return true;
		}
		var parent = this.view.get('parentView');
		if (parent && parent.slick && parent.slick.getState() === 'hidden'){
			return true;
		}
		if (this.getState() === 'hidden' || this.getState() === 'init'){
			return true;
		}
		return false;
	},
	insertView:function(){
		this._insertView();
	},
	_insertView:function(){
		var parent = this.view.get('parentView');
		var childViews = this.view.get('childViews');
		this.view.destroyNow = false;
		if (parent && parent.slick){
			parent.slick.addChild(this);
			return;
		}
		Ember.run.scheduleOnce('afterRender', this, this.showView);
	},
	destroyView:function(){
		if (this.view.destroyNow || !this.view){
			return;
		}
		if (this.readyToDestroy()){
			var parent = this.view.get('parentView');
			if (parent && parent.slick){
				parent.slick._children.removeObject(this);
				parent.slick._childrenRemoving.removeObject(this);
			}
			this._animationState = 'destroying';
			var virtualParent = this.view._parentView;
			if (virtualParent && virtualParent.get('childViews').length <= 1){
				virtualParent.destroyNow = true;
				virtualParent.destroy();
			}
			return;
		}
		this.view.pardon();
		var parent = this.view.get('parentView');
		if (parent && parent.slick){
			parent.slick.removeChild(this);
			return;
		}
		this.hideView();
	},
	showView:function(){
		this.transitionTo('showing');
	},
	showViewComplete:function(){
	},
	hideView:function(){
		if (this.getState() === 'hidden'){
			this.hideViewComplete();
			return;
		}
		this.transitionTo('hiding');
	},
	hideViewComplete:function(){
		if (this._destroyOnHide){
			this.destroySlick();
		}
	},
	destroySlick:function(){
		this.view.destroyNow = true;
		this.view.destroy();
		var virtualParent = this.view._parentView;
		if (virtualParent && virtualParent.get('childViews').length <= 1){
			virtualParent.destroyNow = true;
			virtualParent.destroy();
		}
		this.destroy();
	},
});

// SlickCore.store = store;

export default SlickCore;