import { sendActions, ActionBody, isActionError } from './actionizer';

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
    const action: ActionBody = (null as unknown) as ActionBody;

    const actionizerResponse = await sendActions(action);

    expect(actionizerResponse).toEqual({ errorCode: 500 });
    expect(fakeFetch).toHaveBeenCalledTimes(1);
    expect(fakeFetch).toHaveBeenNthCalledWith(1, 'http://localhost/', {
        body: '[null]',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST'
    });
});

test('sendAction should return an error when body is empty array', async () => {
    const action: ActionBody = ([] as unknown) as ActionBody;

    const actionizerResponse = await sendActions(action);

    expect(actionizerResponse).toEqual([]);
});

test('sendAction should return an error when body is empty object', async () => {
    fakeFetch.mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve([{ action: { tenantId: 'SEW' }, error: 4001, message: 'sensorId is required' }])
    });
    const action: ActionBody = ({} as unknown) as ActionBody;

    const actionizerResponse = await sendActions(action);

    expect(actionizerResponse).toEqual([{ action: { tenantId: 'SEW' }, error: 4001, message: 'sensorId is required' }]);
});

test('sendAction should send one action to actionizer server', async () => {
    const action: ActionBody = { sensorId: 'sensorId', type: 'SWITCH', payload: 0 };
    fakeFetch.mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve([{ action: { ...action, tenantId: 'SEW' }, status: 200 }])
    });

    const actionizerResponse = await sendActions(action);

    expect(actionizerResponse).toEqual([{ action: { ...action, tenantId: 'SEW' }, status: 200 }]);
});

test('sendAction should send two action to actionizer server', async () => {
    const actions: ActionBody[] = [
        { sensorId: 'sensorId', type: 'SWITCH', payload: 0 },
        { sensorId: 'sensorId2', type: 'SWITCH', payload: 0 }
    ];
    const expectedResult = actions.map(action => ({ action: { ...action, tenantId: 'SEW' }, status: 200 }));
    fakeFetch.mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve(expectedResult)
    });

    const actionizerResponse = await sendActions(actions);

    expect(actionizerResponse).toEqual(expectedResult);
});

test('sendAction should send one action and one fail to actionizer server', async () => {
    const actions: ActionBody[] = [
        { sensorId: 'sensorId', type: 'SWITCH', payload: 0 },
        ({ sensor: 'sensorId2' } as unknown) as ActionBody
    ];
    const expectedResult = [
        { action: { ...actions[0], tenantId: 'SEW' }, status: 200 },
        { action: { ...actions[1], tenantId: 'SEW' }, error: 4001, message: 'sensorId is required' }
    ];
    fakeFetch.mockResolvedValueOnce({
        status: 200,
        json: () => Promise.resolve(expectedResult)
    });

    const actionizerResponse = await sendActions(actions);

    expect(actionizerResponse).toEqual(expectedResult);
});

test('isActionError should safeguard response from sendActions', () => {
    expect(isActionError({ errorCode: 200 })).toBe(true);
    expect(isActionError([])).toBe(false);
});
