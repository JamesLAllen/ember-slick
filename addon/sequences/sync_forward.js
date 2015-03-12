import Ember from 'ember';
import SequenceAnimation from '../animations/sequence_animation';
import SequenceSync from './sequence_sync';
import ArrangeForward from './arrange_forward';

var SyncForward = SequenceAnimation.extend(SequenceSync, ArrangeForward, {
	type: 'syncForward',
});

export default SyncForward;