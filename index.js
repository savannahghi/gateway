const express = require('express');
const app = express();
const router = express.Router();
const { json } = require('body-parser');
const Sentry = require('@sentry/node');
const env = require('env-var');
const { ApolloServer } = require('apollo-server-express');
const CustomGateway = require('./custom_gateway');
const AuthenticatedDataSource = require('./remote_data_source');
const { onError, getBearerToken } = require("./utils")

// environment variables that have defaults
const PORT = env.get('PORT').default('8000').asPortNumber()
const SUBSCRIPTIONS_ENABLED = env.get('SUBSCRIPTIONS_ENABLED').default('false').asBool()
const INTROSPECTION_ENABLED = env.get('INTROSPECTION_ENABLED').default('true').asBool()
const PLAYGROUND_ENABLED = env.get('PLAYGROUND_ENABLED').default('true').asBool()
const DEBUG = env.get('SUBSCRIPTIONS_ENABLED').default('false').asBool()
const SENTRY_DSN = env.get('SENTRY_DSN').required().asString()
const APQ_ENABLED = env.get('APQ_ENABLED').default('true').asBool()
const POLLING_ENABLED = env.get('POLLING_ENABLED').default('true').asBool()
const SERVICE_HEALTH_CHECK_ENABLED = env.get('SERVICE_HEALTH_CHECK_ENABLED').default('false').asBool()
const POLLING_INTERVAL = env.get('POLLING_INTERVAL').default('10000').asIntPositive()
const terminated = false;

// open tracing
var initTracer = require('jaeger-client').initTracer
const opentracing = require('opentracing')
const trace_constants = require("./constants.js")

var tracer = initTracer(trace_constants.config, trace_constants.options)

Sentry.init({ dsn: SENTRY_DSN });

app.use(router);
router.use(json());

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

(async () => {

	const idToken = await getBearerToken()

	const gateway = new CustomGateway({
		debug: DEBUG,
		// buildService: Define this function to customize your gateway's data transport
		// to some or all of your implementing services. This customization 
		// can include using a protocol besides HTTP.
		buildService({ name, url }) {
			return new AuthenticatedDataSource({ url });
		},
		apq: APQ_ENABLED,
		pollingTimer: POLLING_ENABLED ? POLLING_INTERVAL : 0,
		experimental_pollInterval: POLLING_ENABLED ? POLLING_INTERVAL : 0,
		introspectionHeaders: {
			'Authorization': 'Bearer ' + idToken
		},
		serviceHealthCheck: SERVICE_HEALTH_CHECK_ENABLED,
	});

	const server = new ApolloServer({
		gateway,
		subscriptions: SUBSCRIPTIONS_ENABLED,
		debug: DEBUG,
		playground: PLAYGROUND_ENABLED,
		introspection: INTROSPECTION_ENABLED,
		context: ({ req }) => {
			return {
				req,
			};
		},
	});

	const rootPath = "/"
	const corsConfig = {
		credentials: true,
		allowedHeaders: [
			'Authorization',
			'X-Authorization',
		],
		exposedHeaders: [
			'Authorization',
			'X-Authorization',
		],
	};

	server.applyMiddleware({ app, rootPath, cors: corsConfig });

	// The error handler must be before any other error middleware and after all controllers
	app.use(Sentry.Handlers.errorHandler());


	// fallback error handling
	app.use(onError);


	app.get('/health', (req, res) => {
		const healthSpan = tracer.startSpan("check_health")
		healthSpan.addTags({[opentracing.Tags.HTTP_METHOD]: req.method})
		if (terminated) {
			const terminatedSpan = tracer.startSpan("termination_check", {childOf: healthSpan});

			var response = res.status(429).send('terminated');

			logger.info('health check failed due to application terminating');
			terminatedSpan.setTag(opentracing.Tags.HTTP_STATUS_CODE, response.statusCode);
			terminatedSpan.log({'event': 'health_check_terminated'});
			terminatedSpan.finish();

			return response;
		}

		var response = res.status(200).send('ok');

		const okSpan = tracer.startSpan("ok_check", {childOf: healthSpan});
		okSpan.setTag(opentracing.Tags.HTTP_STATUS_CODE, response.statusCode);
		okSpan.log({'event': 'health ok'});
    	okSpan.finish();

		return response;
	});

	app.listen({ port: PORT }, () =>
		console.log(`🚀 Server listening at http://localhost:${PORT}${server.graphqlPath}`)
	);


})();