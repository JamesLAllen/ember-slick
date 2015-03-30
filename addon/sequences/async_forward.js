import Ember from 'ember';
import SequenceAnimation from '../animations/sequence_animation';
import SequenceAsync from './sequence_async';
import ArrangeForward from './arrange_forward';

var AsyncForward = SequenceAnimation.extend(SequenceAsync, ArrangeForward, {
	type: 'asyncForward'
});

export default AsyncForward;