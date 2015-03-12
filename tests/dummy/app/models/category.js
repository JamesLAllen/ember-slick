import DS from 'ember-data';

var CategoryModel = DS.Model.extend({
	label: DS.attr('string')
});

CategoryModel.reopenClass({
	FIXTURES: [
		{
			id: 1,
			label: 'Category 1',
		},
		{
			id: 2,
			label: 'Category 2',
		},
		{
			id: 3,
			label: 'Category 3',
		},
		{
			id: 4,
			label: 'Category 4',
		},
		{
			id: 5,
			label: 'Category 5',
		},
		{
			id: 6,
			label: 'Category 6',
		},
		{
			id: 7,
			label: 'Category 7',
		},
		{
			id: 8,
			label: 'Category 8',
		},
		{
			id: 9,
			label: 'Category 9',
		},
		{
			id: 10,
			label: 'Category 10',
		},
		{
			id: 11,
			label: 'Category 11',
		},
		{
			id: 12,
			label: 'Category 12',
		},
		{
			id: 13,
			label: 'Category 13',
		},
		{
			id: 14,
			label: 'Category 14',
		},
		{
			id: 15,
			label: 'Category 15',
		},
		{
			id: 16,
			label: 'Category 16',
		},
		{
			id: 17,
			label: 'Category 17',
		},
		{
			id: 18,
			label: 'Category 18',
		},
		{
			id: 19,
			label: 'Category 19',
		},
		{
			id: 20,
			label: 'Category 20',
		},
		{
			id: 21,
			label: 'Category 21',
		},
		{
			id: 22,
			label: 'Category 22',
		}
	]

});

export default CategoryModel;