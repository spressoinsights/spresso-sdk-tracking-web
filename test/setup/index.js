import superagent from 'superagent';
import getPort from 'get-port';

export const setupMockServer = (path = '/', method = 'GET', expectedResponse = null) => {
    const mockResponse = expectedResponse || {
        statusCode: 200,
        body: {
            data: 'mock response',
        },
    };

    const getMockServerPort = getPort;

    const createMockServer = async (mockServerPort = 1337) => {
        try {
            if (!mockServerPort) throw 'port not set';
            // CREATE MOCK SERVER
            const res = await superagent.post('http://localhost:2525/imposters').send({
                port: mockServerPort,
                protocol: 'http',
                recordRequests: true,
                allowCORS: true,
                defaultResponse: {
                    statusCode: 404,
                },
                stubs: [
                    {
                        predicates: [
                            {
                                // endpoint that we're mocking
                                equals: {
                                    path,
                                    method,
                                    // headers: { 'Content-Type': 'application/json; charset=utf-8' },
                                },
                            },
                        ],
                        responses: [
                            {
                                is: {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'access-control-allow-origin': '*',
                                        'access-control-allow-methods': '*',
                                        'access-control-allow-headers': '*',
                                    },
                                    ...mockResponse,
                                },
                            },
                        ],
                    },
                ],
            });

            console.log('mock server created', res);
        } catch (err) {
            console.error('Error creating mock server:', err);
        }
    };

    const destroyMockServer = async (mockServerPort) => {
        // TEAR DOWN MOCK SERVER
        try {
            if (!mockServerPort) throw 'port not set';

            // await axios({
            //     method: 'DELETE',
            //     url: `http://localhost:2525/imposters/${mockServerPort}`,
            // });
            const res = await superagent.delete(`http://localhost:2525/imposters/${mockServerPort}`);
            console.log('mock server destroyed', res);
        } catch (err) {
            console.error('Error destroying mock server:', err);
        }
    };

    const getMockServer = async (mockServerPort) => {
        // retrieve the HTTP request details received by mock server
        try {
            if (!mockServerPort) throw 'port not set';
            // return await axios.get(`http://localhost:2525/imposters/${mockServerPort}`).then((res) => res.data);
            return await superagent.get(`http://localhost:2525/imposters/${mockServerPort}`).then((res) => res.data);
        } catch (err) {
            console.error('Error getting mock server requests:', err);
            return {};
        }
    };

    return { createMockServer, destroyMockServer, getMockServer };
};

const { getMockServerPort, createMockServer, destroyMockServer, getMockServer } = setupMockServer('/track', 'POST');

createMockServer();
