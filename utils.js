'use strict';

const env = require('env-var');
const axios = require('axios')


// mandatory environment variables
const LOGIN_SERVICE_URL = env.get('LOGIN_SERVICE_URL').required().asUrlString()
const LOGIN_SERVICE_FLAVOUR = env.get('LOGIN_SERVICE_FLAVOUR').required().asString()

// tracing
var initTracer = require('jaeger-client').initTracer
const opentracing = require('opentracing')
const trace_constants = require("./constants.js")

var tracer = initTracer(trace_constants.config, trace_constants.options)

function onError(err, req, res, next) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(res.sentry + '\n');
}

// log in and get an authorization token that can be used to introspect downstream services
async function getBearerToken() {
    const getBearerTokenSpan = tracer.startSpan("get_bearer_token");

    var idToken = ""
    await axios.post(LOGIN_SERVICE_URL, {
        flavour: LOGIN_SERVICE_FLAVOUR
    })
        .then((res) => {
            idToken = res.data.id_token
        })
        .catch((error) => {
            console.error(`Login error: ${error}`)

            getBearerTokenSpan.setTag(opentracing.Tags.ERROR, true).log({ error: error });
            getBearerTokenSpan.log({'event': 'get_bearer_token'});
            getBearerTokenSpan.finish();

            throw `Login error: ${error}`
        })
    return idToken
}

exports.onError = onError
exports.getBearerToken = getBearerToken
