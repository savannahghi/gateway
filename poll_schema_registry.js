const { get } = require('lodash');
const request = require('request-promise-native');
const env = require('env-var');

// mandatory environment variable
const SCHEMA_REGISTRY_URL = env.get('SCHEMA_REGISTRY_URL').required().asString()

exports.getServiceListWithTypeDefs = async () => {
	const services = [];
	const serviceTypeDefinitions = await request({
		baseUrl: SCHEMA_REGISTRY_URL,
		method: 'POST',
		url: '/schema/compose',
		json: true,
		body: {
			services,
		},
	});

	return get(serviceTypeDefinitions, 'data', []).map((schema) => {
		const service = services.find(
			(service) => service.name === schema.name
		);
		console.log(
			`Got ${schema.name} service schema with version ${schema.version}`
		);

		return {
			name: schema.name,
			url: schema.url,
			version: schema.version,
			typeDefs: schema.type_defs,
			typeDefsOriginal: schema.type_defs_original,
			...(service ? service : {}),
		};
	});
};
