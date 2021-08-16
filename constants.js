const env = require('env-var');

const config = {
    serviceName: 'gateway-tracing',
    reporter: {
        collectorEndpoint: env.get('JAEGER_URL').required().asString(),
        logSpans: true,
    },
    sampler: {
        type: 'const',
        param: 1
    }
};
const options = {
    tags: {
        'gateway-version': '0.0.0',
    },
    logger: console,
};

module.exports = { config, options };