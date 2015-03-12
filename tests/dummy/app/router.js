import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
	
	
	this.route('about');
	this.resource('items', {path:'/'}, function() { 
		this.route('item', {path:':item_id'}, function(){
			this.resource('categories', {path: '/'}, function() {
				this.route('category', {path:':category_id'});
			});
		});
	});
  
});

export default Router;
