

exports.ApolloGateway = jest.fn(
    ({
        serviceList,
        apq,
        pollingTimer,
        experimental_pollInterval,
        debug,
        buildService,
        introspectionHeaders,
    }) => {
        this.serviceList = serviceList
        this.apq = apq
        this.pollingTimer = pollingTimer
        this.experimental_pollInterval = experimental_pollInterval
        this.debug = debug
        this.buildService = buildService
        this.introspectionHeaders = introspectionHeaders
    }
);


exports.RemoteGraphQLDataSource = jest.fn();