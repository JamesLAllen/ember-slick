import Ember from 'ember';
import SequenceAnimation from '../animations/sequence_animation';
import SequenceSync from './sequence_sync';
import ArrangeRandom from './arrange_random';

var SyncRandom = SequenceAnimation.extend(SequenceSync, ArrangeRandom, {
	type: 'syncRandom',
});

export default SyncRandom;