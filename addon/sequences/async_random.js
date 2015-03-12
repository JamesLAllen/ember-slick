import Ember from 'ember';
import SequenceAnimation from '../animations/sequence_animation';
import SequenceAsync from './sequence_async';
import ArrangeRandom from './arrange_random';

var AsyncRandom = SequenceAnimation.extend(SequenceAsync, ArrangeRandom, {
	type: 'asyncRandom',
});

export default AsyncRandom;