import Ember from 'ember';
import SequenceAnimation from '../animations/sequence_animation';
import SequenceAsync from './sequence_async';
import ArrangeReverse from './arrange_reverse';

var AsyncReverse = SequenceAnimation.extend(SequenceAsync, ArrangeReverse, {
	type: 'asyncReverse',
});

export default AsyncReverse;