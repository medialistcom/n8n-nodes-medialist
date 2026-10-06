import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MediaListApi implements ICredentialType {
	name = 'mediaListApi';

	displayName = 'Media List API';

	icon: Icon = { light: 'file:../icons/medialist.svg', dark: 'file:../icons/medialist.dark.svg' };

	documentationUrl = 'https://medialist.com/developers';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your Media List API key (starts with ml_live_). API access comes with paid Media List plans.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://medialist.com/api/v1',
			url: '/me',
			method: 'GET',
		},
	};
}
