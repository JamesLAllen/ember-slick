import Ember from 'ember';
import SequenceAnimation from '../animations/sequence_animation';
import SequenceSync from './sequence_sync';
import ArrangeReverse from './arrange_reverse';

var SyncReverse = SequenceAnimation.extend(SequenceSync, ArrangeReverse, {
	type: 'syncReverse',
});

export default SyncReverse;