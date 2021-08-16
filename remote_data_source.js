const { RemoteGraphQLDataSource } = require('@apollo/gateway');
const DEBUG = true;

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
	async willSendRequest({ request, context }) {
		if (request.http.headers.get('Authorization') == null && request.http.headers.get('X-Authorization') == null) {
			if (DEBUG === true) {
				console.dir(context.req.headers, { depth: 1, colors: true })
			}

			if (context != null && context.req != null && context.req.headers != null && context.req.headers.authorization != null) {
				console.log('Set Authorization header from context')
				request.http.headers.set('Authorization', context.req.headers.authorization)
			}

			if (context != null && context.req != null && context.req.headers != null && context.req.headers['x-authorization'] != null) {
				console.log('Set Authorization header from context')
				request.http.headers.set('X-Authorization', context.req.headers['x-authorization'])
			}
		}

		console.log("\nRequest, right before it is sent...\n")
		console.dir(request, { depth: 10, colors: true })

		console.log("\nContext headers, before request is sent...\n")
		console.dir(context.headers, { depth: 10, colors: true })

		console.log("\nContext body, before request is sent...\n")
		console.dir(context.body, { depth: 10, colors: true })
		console.log("\n")
	}

	async didReceiveResponse({ response, request, context }) {
		// log the response, for troubleshooting
		if (DEBUG === true) {
			console.log("\nResponse data...\n")
			console.dir(response.data, { depth: 10, colors: true })

			console.log("\nResponse errors...\n")
			console.dir(response.errors, { depth: 10, colors: true })

			console.log("\nResponse extensions..\n")
			console.dir(response.extensions, { depth: 10, colors: true })

			console.log("\nRequest, gotten back from response...\n")
			console.dir(request, { depth: 10, colors: true })

			console.log("\nContext headers, gotten back from response...\n")
			console.dir(context.headers, { depth: 10, colors: true })

			console.log("\nContext body, gotten back from response...\n")
			console.dir(context.body, { depth: 10, colors: true })
			console.log("\n")
		}

		return response;
	}
}

module.exports = AuthenticatedDataSource;
