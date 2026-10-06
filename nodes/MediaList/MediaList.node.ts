import {
	NodeConnectionTypes,
	type INodeProperties,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';

// Every Media List API v1 response wraps its result in "data".
const unwrap = {
	output: {
		postReceive: [{ type: 'rootProperty' as const, properties: { property: 'data' } }],
	},
};

const show = (resource: string, operation: string[]) => ({ show: { resource: [resource], operation } });

const limit = (resource: string, operation: string[]): INodeProperties => ({
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	typeOptions: { minValue: 1, maxValue: 50 },
	default: 50,
	description: 'Max number of results to return',
	displayOptions: show(resource, operation),
	routing: { send: { type: 'query', property: 'per_page' } },
});

const page = (resource: string, operation: string[]): INodeProperties => ({
	displayName: 'Page',
	name: 'page',
	type: 'number',
	typeOptions: { minValue: 1 },
	default: 1,
	description: 'Page of results to return, starting at 1',
	displayOptions: show(resource, operation),
	routing: { send: { type: 'query', property: 'page' } },
});

const idField = (resource: string, operation: string[], label: string): INodeProperties => ({
	displayName: `${label} ID`,
	name: 'id',
	type: 'string',
	required: true,
	default: '',
	description: `The ID of the ${label.toLowerCase()}`,
	displayOptions: show(resource, operation),
});

export class MediaList implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Media List',
		name: 'mediaList',
		icon: { light: 'file:medialist.svg', dark: 'file:medialist.dark.svg' },
		group: ['input'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Find journalists, editors, producers, podcast hosts and creators, and read your Media List lists and campaigns',
		defaults: { name: 'Media List' },
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'mediaListApi', required: true }],
		requestDefaults: {
			baseURL: 'https://medialist.com/api/v1',
			headers: { Accept: 'application/json' },
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'Campaign', value: 'campaign' },
					{ name: 'Contact', value: 'contact' },
					{ name: 'List', value: 'list' },
					{ name: 'Outlet', value: 'outlet' },
				],
				default: 'contact',
			},

			// ------------------------------------------------------------------ contact
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['contact'] } },
				options: [
					{
						name: 'Get',
						value: 'get',
						action: 'Get a contact',
						description: 'Get the full profile of one contact',
						routing: { request: { method: 'GET', url: '=/contacts/{{encodeURIComponent($parameter.id)}}' }, ...unwrap },
					},
					{
						name: 'Search',
						value: 'search',
						action: 'Search contacts',
						description: 'Search journalists, editors, producers, podcast hosts and creators',
						routing: { request: { method: 'GET', url: '/contacts' }, ...unwrap },
					},
				],
				default: 'search',
			},
			idField('contact', ['get'], 'Contact'),
			{
				displayName: 'Keywords',
				name: 'q',
				type: 'string',
				default: '',
				placeholder: 'e.g. health tech',
				description: 'Free-text keywords matched against name, title, outlet and topics',
				displayOptions: show('contact', ['search']),
				routing: { send: { type: 'query', property: 'q' } },
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				displayOptions: show('contact', ['search']),
				options: [
					{ displayName: 'Beat', name: 'beat', type: 'string', default: '', routing: { send: { type: 'query', property: 'beat' } } },
					{ displayName: 'Country', name: 'country', type: 'string', default: '', placeholder: 'e.g. US', routing: { send: { type: 'query', property: 'country' } } },
					{
						displayName: 'Deliverable Emails Only',
						name: 'deliverable',
						type: 'boolean',
						default: false,
						description: 'Whether to return only contacts with a deliverable email',
						routing: { send: { type: 'query', property: 'deliverable', value: '={{$value ? "1" : ""}}' } },
					},
					{ displayName: 'Location', name: 'location', type: 'string', default: '', placeholder: 'e.g. Chicago', routing: { send: { type: 'query', property: 'location' } } },
					{
						displayName: 'Media Type',
						name: 'media',
						type: 'string',
						default: '',
						description: 'A media type value such as tv_radio (see Account > Get Filter Values)',
						routing: { send: { type: 'query', property: 'media' } },
					},
					{ displayName: 'Outlet', name: 'outlet', type: 'string', default: '', routing: { send: { type: 'query', property: 'outlet' } } },
					{ displayName: 'State', name: 'state', type: 'string', default: '', placeholder: 'e.g. TX', description: 'Two-letter US state code', routing: { send: { type: 'query', property: 'state' } } },
					{ displayName: 'Title', name: 'title', type: 'string', default: '', placeholder: 'e.g. editor', routing: { send: { type: 'query', property: 'title' } } },
					{ displayName: 'Topic', name: 'topic', type: 'string', default: '', routing: { send: { type: 'query', property: 'topic' } } },
				],
			},
			limit('contact', ['search']),
			page('contact', ['search']),

			// ------------------------------------------------------------------ outlet
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['outlet'] } },
				options: [
					{
						name: 'Search',
						value: 'search',
						action: 'Search outlets',
						description: 'Find newspapers, magazines, TV and radio stations, sites and podcasts',
						routing: { request: { method: 'GET', url: '/outlets' }, ...unwrap },
					},
				],
				default: 'search',
			},
			{
				displayName: 'Name or Domain',
				name: 'q',
				type: 'string',
				default: '',
				placeholder: 'e.g. Houston Chronicle',
				displayOptions: show('outlet', ['search']),
				routing: { send: { type: 'query', property: 'q' } },
			},
			limit('outlet', ['search']),
			page('outlet', ['search']),

			// ------------------------------------------------------------------ list
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['list'] } },
				options: [
					{
						name: 'Get',
						value: 'get',
						action: 'Get a list',
						description: 'Get one saved list',
						routing: { request: { method: 'GET', url: '=/lists/{{encodeURIComponent($parameter.id)}}' }, ...unwrap },
					},
					{
						name: 'Get Contacts',
						value: 'getContacts',
						action: 'Get the contacts in a list',
						description: 'Get the contacts saved in one list',
						routing: { request: { method: 'GET', url: '=/lists/{{encodeURIComponent($parameter.id)}}/contacts' }, ...unwrap },
					},
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many lists',
						description: 'Get your saved lists',
						routing: { request: { method: 'GET', url: '/lists' }, ...unwrap },
					},
				],
				default: 'getAll',
			},
			idField('list', ['get', 'getContacts'], 'List'),
			limit('list', ['getContacts']),
			page('list', ['getContacts']),

			// ------------------------------------------------------------------ campaign
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['campaign'] } },
				options: [
					{
						name: 'Get',
						value: 'get',
						action: 'Get a campaign',
						description: 'Get one email campaign with its status and counts',
						routing: { request: { method: 'GET', url: '=/campaigns/{{encodeURIComponent($parameter.id)}}' }, ...unwrap },
					},
					{
						name: 'Get Many',
						value: 'getAll',
						action: 'Get many campaigns',
						description: 'Get your email campaigns with send, open and click counts',
						routing: { request: { method: 'GET', url: '/campaigns' }, ...unwrap },
					},
				],
				default: 'getAll',
			},
			idField('campaign', ['get'], 'Campaign'),

			// ------------------------------------------------------------------ account
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['account'] } },
				options: [
					{
						name: 'Get',
						value: 'get',
						action: 'Get account and limits',
						description: 'Get your plan, remaining exports and API limits',
						routing: { request: { method: 'GET', url: '/me' }, ...unwrap },
					},
					{
						name: 'Get Filter Values',
						value: 'getFilterValues',
						action: 'Get search filter values',
						description: 'Get valid values for the media type, topic, country, state and language filters',
						routing: { request: { method: 'GET', url: '/facets' }, ...unwrap },
					},
				],
				default: 'get',
			},
		],
	};
}
