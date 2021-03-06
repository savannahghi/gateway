const _ = require('lodash');
const { parse } = require('graphql');
const { ApolloGateway } = require('@apollo/gateway');
const { composeAndValidate } = require('@apollo/federation');
const env = require('env-var');

const { getServiceListWithTypeDefs } = require('./poll_schema_registry');

// tracing
var initTracer = require('jaeger-client').initTracer
const opentracing = require('opentracing')
const trace_constants = require("./constants.js")

var tracer = initTracer(trace_constants.config, trace_constants.options)

const customGatewaySpan = tracer.startSpan("custom_gateway");
class CustomGateway extends ApolloGateway {
	constructor(...args) {
		super(...args);

		this.serviceDefinitionsCache = [
			// Temporary workaround just to make sure that the array won't be empty
			// If "serviceDefinitions" is empty, uncaught expection will be trown by the library
			{
				name: 'InternalError',
				url: 'InternalError',
				typeDefs: parse(
					`type InternalError { message: String! } extend type Query { internalError: InternalError }`
				),
			},
		];
	}

	// Hack, because for some reason by default the lib doesn't want to add listeners in "unmanaged" mode
	// Without this the schema polling doesn't work properly - server schema won't be updated
	onSchemaChange(callback) {
		this.onSchemaChangeListeners.add(callback);

		return () => {
			this.onSchemaChangeListeners.delete(callback);
		};
	}

	async loadServiceDefinitions() {
		try {
			return await this.tryToLoadServiceDefinitions();
		} catch (error) {
			customGatewaySpan.setTag(opentracing.Tags.ERROR, true).log({error: error });
			customGatewaySpan.log({'event': 'load_service_definition'});
			customGatewaySpan.finish();

			console.error(`Polling schema failed: ${error.message}`, {
				original_error: error,
			});

			return {
				serviceDefinitions: this.serviceDefinitionsCache,
				isNewSchema: false,
			};
		}
	}

	async tryToLoadServiceDefinitions() {
		let isNewSchema = false;

		this.config.serviceList = await getServiceListWithTypeDefs();

		// for each service, fetch its introspection schema
		const serviceDefinitions = this.config.serviceList.map((service) => {
			const previousDefinition = this.serviceSdlCache.get(service.name);

			// this lets us know if any downstream service has changed
			// and we need to recalculate the schema
			if (previousDefinition !== service.typeDefs) {
				isNewSchema = true;
			}

			this.serviceSdlCache.set(service.name, service.typeDefs);

			return {
				...service,
				typeDefs: parse(service.typeDefs),
			};
		});

		// Validate the schema before passing it, otherwise the gateway library will throw uncaught expection
		if (validateSchema(serviceDefinitions)) {
			this.serviceDefinitionsCache = serviceDefinitions;
		}

		return {
			serviceDefinitions: this.serviceDefinitionsCache,
			isNewSchema,
		};
	}
}

function validateSchema(serviceList) {
	const validateSchemaSpan = tracer.startSpan("validate_schema");
	let schema, errors;

	try {
		({ schema, errors } = composeAndValidate(serviceList));
	} catch (error) {
		validateSchemaSpan.setTag(opentracing.tags.setTag.ERROR, true).log({error: error })
		validateSchemaSpan.log({'event': 'validate_schema'})
		validateSchemaSpan.finish()

		errors = [error];
	}

	if (errors && errors.length) {
		console.error(
			'Schema validation failed, falling back to previous schema',
			{
				errors: JSON.stringify(errors),
				serviceList,
			}
		);

		return null;
	}

	return schema;
}

module.exports = CustomGateway;
