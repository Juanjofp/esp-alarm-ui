import { sendActions, Device, isActionError } from './actionizer';

let fakeFetch: jest.SpyInstance;
beforeAll(() => {
    fakeFetch = jest.spyOn(window, 'fetch');
});

afterEach(() => {
    fakeFetch.mockClear();
});

afterAll(() => {
    fakeFetch.mockReset();
});

test('sendAction should return an error when body is null', async () => {
    fakeFetch.mockResolvedValueOnce({ status: 500 });
    const action: Device = (null as unknown) as Device;

    const actionizerResponse = await sendActions(action);

    expect(actionizerResponse).toEqual({ errorCode: 500 });
    expect(fakeFetch).toHaveBeenCalledTimes(1);
    expect(fakeFetch).toHaveBeenNthCalledWith(1, 'https://actionizer.sew', {
        body: '[null]',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
    });
});

test('sendAction should return an empty array when body is empty array', async () => {
    const action: Device = ([] as unknown) as Device;

    const actionizerResponse = await sendActions(action);

    expect(actionizerResponse).toEqual([]);
});

test('sendAction should return an error when body is empty object', async () => {
    fakeFetch.mockResolvedValueOnce({
        status: 400,
        json: () => Promise.resolve({ errorCode: 400 })
    });
    const action: Device = ({} as unknown) as Device;

    const actionizerResponse = await sendActions(action);

    expect(actionizerResponse).toEqual({ errorCode: 400 });
});

test('sendAction should send one action to actionizer server', async () => {
    const action: Device = { deviceId: 'deviceid', actions: [{ sensorId: 'sensorId', type: 'SWITCH', payload: 0 }] };
    fakeFetch.mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve([{ actionIndex: 0, status: 200 }])
    });

    const actionizerResponse = await sendActions(action);

    expect(actionizerResponse).toEqual([{ actionIndex: 0, status: 200 }]);
});

test('sendAction should send two action to actionizer server', async () => {
    const actions: Device[] = [
        {
            deviceId: 'deviceId',
            actions: [
                { sensorId: 'sensorId', type: 'SWITCH', payload: 0 },
                { sensorId: 'sensorId2', type: 'SWITCH', payload: 0 }
            ]
        }
    ];
    const expectedResult = [{ actionIndex: 0, status: 200 }];
    fakeFetch.mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve(expectedResult)
    });

    const actionizerResponse = await sendActions(actions);

    expect(actionizerResponse).toEqual(expectedResult);
});

test('sendAction should send two devices with two actions to actionizer server', async () => {
    const actions: Device[] = [
        {
            deviceId: 'deviceId',
            actions: [
                { sensorId: 'sensorId', type: 'SWITCH', payload: 0 },
                { sensorId: 'sensorId2', type: 'SWITCH', payload: 0 }
            ]
        },
        {
            deviceId: 'deviceId2',
            actions: [
                { sensorId: 'sensorId', type: 'SWITCH', payload: 0 },
                { sensorId: 'sensorId2', type: 'SWITCH', payload: 0 }
            ]
        }
    ];
    const expectedResult = [
        { actionIndex: 0, status: 200 },
        { actionIndex: 1, status: 200 }
    ];
    fakeFetch.mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve(expectedResult)
    });

    const actionizerResponse = await sendActions(actions);

    expect(actionizerResponse).toEqual(expectedResult);
});

test('sendAction should send one action and one fail to actionizer server', async () => {
    const actions: Device[] = [
        { deviceId: 'deviceid', actions: [{ sensorId: 'sensorId', type: 'SWITCH', payload: 0 }] },
        ({ sensor: 'sensorId2' } as unknown) as Device
    ];
    const expectedResult = { errorCode: 400 };
    fakeFetch.mockResolvedValueOnce({
        status: 400,
        json: () => Promise.resolve(expectedResult)
    });

    const actionizerResponse = await sendActions(actions);

    expect(actionizerResponse).toEqual(expectedResult);
});

test('isActionError should safeguard response from sendActions', () => {
    expect(isActionError({ errorCode: 200 })).toBe(true);
    expect(isActionError([])).toBe(false);
});
