"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WacapApi = void 0;
class WacapApi {
    constructor() {
        this.name = 'wacapApi';
        this.displayName = 'Wacap Docker API';
        this.documentationUrl = 'https://hub.docker.com/r/bangfkr/wacap';
        this.properties = [
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: 'http://localhost:3000',
                required: true,
                placeholder: 'http://localhost:3000',
                description: 'Base URL of your Wacap Docker API server',
            },
            {
                displayName: 'Device Token',
                name: 'apiKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                description: 'Device Token for API authentication (get from Settings > API Usage in dashboard)',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    'X-Device-Token': '={{$credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials.baseUrl}}',
                url: '/api/health',
                method: 'GET',
            },
        };
    }
}
exports.WacapApi = WacapApi;
