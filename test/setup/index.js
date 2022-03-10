import superagent from 'superagent';
import getPort from 'get-port';

export const setupMockServer = (expectedResponse = null) => {
    const mockResponse = expectedResponse || {
        statusCode: 200,
        body: {
            data: 'mock response',
        },
    };

    const getMockServerPort = getPort;

    const createMockServer = async (path = '/', methods = [], mockServerPort = 1337) => {
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
                stubs: methods?.map?.((method) => ({
                    predicates: [
                        {
                            contains: {
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
                                    'Access-Control-Allow-Origin': 'http://localhost:3000',
                                    'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT',
                                    'Access-Control-Allow-Headers': '*',
                                },
                                ...mockResponse,
                            },
                        },
                    ],
                })) || [],
            });

            console.log('mock server created', res);
        } catch (err) {
            console.error(err);
        }
    };

    const destroyMockServer = async (mockServerPort = 1337) => {
        // TEAR DOWN MOCK SERVER
        try {
            if (!mockServerPort) throw 'port not set';
            const res = await superagent.delete(`http://localhost:2525/imposters/${mockServerPort}`);
            console.log('mock server destroyed', res);
        } catch (err) {
            console.error(err);
        }
    };

    const getMockServer = async (mockServerPort = 1337) => {
        // retrieve the HTTP request details received by mock server
        try {
            if (!mockServerPort) throw 'port not set';
            return await superagent.get(`http://localhost:2525/imposters/${mockServerPort}`).then((res) => res.data);
        } catch (err) {
            console.error(err);
            return {};
        }
    };

    return { getMockServerPort, createMockServer, destroyMockServer, getMockServer };
};

const { getMockServerPort, createMockServer, destroyMockServer, getMockServer } = setupMockServer();

createMockServer('/track', ['OPTIONS', 'POST']);
