"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WacapApi = void 0;
class WacapApi {
    constructor() {
        this.name = 'wacapApi';
        this.displayName = 'Wacap HTTP API';
        this.documentationUrl = 'https://github.com/izzelislam/wacapp';
        this.properties = [
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: 'http://localhost:3000',
                required: true,
                placeholder: 'http://localhost:3000',
                description: 'Base URL of your Wacap API server',
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                description: 'API Key for authentication (leave empty if not required)',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'X-Api-Key': '={{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials.baseUrl}}',
                url: '/api/sessions',
                method: 'GET',
            },
        };
    }
}
exports.WacapApi = WacapApi;
