import Ember from 'ember';
import AbstractAnimation from './animations/abstract_animation';
import SyncForward from './sequences/sync_forward';
import SyncReverse from './sequences/sync_reverse';
import AsyncForward from './sequences/async_forward';
import AsyncReverse from './sequences/async_reverse';
import SyncRandom from './sequences/sync_random';
import AsyncRandom from './sequences/async_random';
import AnimationState from './states/animation_state';


var SlickFactory = Ember.Object.extend({
	createNewSequence:function(sequence, name){
		switch(sequence){
			case 'syncForward':
				return SyncForward.create({name:name});
				break;
			case 'asyncForward':
				return AsyncForward.create({name:name});
				break;
			case 'syncReverse':
				return SyncReverse.create({name:name});
				break;
			case 'asyncReverse':
				return AsyncReverse.create({name:name});
				break;
			case 'syncRandom':
				return SyncRandom.create({name:name});
				break;
			case 'asyncRandom':
				return AsyncRandom.create({name:name});
				break;
			default:
				// this allows the user to create their own sequence
				// and pass it in.
				return sequence;
		}
	},
	assembleAnimations:function(){
		// only 2 animations are needed for the basic version of EmberSlick
		return {
			showing: AbstractAnimation.create({name:'showing'}),
			hiding: AbstractAnimation.create({name:'hiding'})
		}
	},
	assembleSequences:function(sequences){
		var assembledSequences = {};
		for (var name in sequences) {
			var sequence = sequences[name];
			switch(name){
				case 'show':
					name = 'showing';
					break;
				case 'hide':
					name = 'hiding';
					break;
				case 'childrenShow':
					name = 'childrenShowing';
					break;
				case 'childrenHide':
					name = 'childrenHiding';
					break;
			}
			assembledSequences[name] = this.createNewSequence(sequence, name);
		}

		assembledSequences['childrenRemoving'] = this.createNewSequence(sequences['childrenHide'], 'childrenRemoving');
		assembledSequences['childrenAdding'] = this.createNewSequence(sequences['childrenShow'], 'childrenAdding');

		return assembledSequences;
	},
	assembleStates:function(){
		return {
			init: this.createAnimationState('init'),
			showing: this.createAnimationState('showing'),
			shown: this.createAnimationState('shown'),
			hiding: this.createAnimationState('hiding'),
			hidden: this.createAnimationState('hidden'),
			destroying: this.createAnimationState('destroying')
		}
	},
	createAnimationState:function(name){
		return AnimationState.create({name:name});
	}
});

export default SlickFactory;