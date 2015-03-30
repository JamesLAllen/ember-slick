import Ember from 'ember';
import defaults from './defaults';
import SlickFactory from './slick_factory';
import SlickCore from './slick_core';

var slickFactory = SlickFactory.create();

function EmberSlick(view){
	var userOptions = view.slick || {};

	var defaultOptions = Ember.copy(defaults);

	userOptions.animations = Ember.merge(defaultOptions.animations, userOptions.animations);
	userOptions.sequences = Ember.merge(defaultOptions.sequences, userOptions.sequences);
	userOptions.states = Ember.merge(defaultOptions.states, userOptions.states);
	
	var config = Ember.merge(defaultOptions, userOptions);
	config.sequences = slickFactory.assembleSequences(config.sequences);
	config.animations = slickFactory.assembleAnimations();
	config.states = slickFactory.assembleStates();
	config.view = view;
	var core = SlickCore.createWithMixins(config);
	return core;
}

export default EmberSlick;