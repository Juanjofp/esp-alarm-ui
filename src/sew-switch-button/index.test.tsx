import * as React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { SewSwitchButton } from '.';
import { SensorInfo } from '../services/sensor-info';
import { sendActions, isActionError, Action } from '../services/actionizer';

const fakeSendActions = (sendActions as unknown) as jest.Mock;
const fakeIsActionError = (isActionError as unknown) as jest.Mock;
jest.mock('../services/actionizer');

const waitForButtonResponse = async (button: HTMLElement) => {
    expect(button).toBeDisabled();
    screen.getByText('Loading');
    await waitFor(() => expect(button).not.toBeDisabled());
};

test('SewSwitchButton should show a button from a SensorInfo and switch on', async () => {
    const sensor: SensorInfo = { deviceId: 'deviceid', sensorId: '123456789', name: 'Juanjo Rojo', type: 'SWITCH', color: '#EE1010' };
    const action: Action = { sensorId: sensor.sensorId, type: sensor.type, payload: 0 };
    const deviceId = 'deviceid';
    fakeSendActions.mockResolvedValue([{ indexAction: 0, status: 200 }]);
    fakeIsActionError.mockReturnValue(false);

    // Button start requesting OFF
    render(<SewSwitchButton sensor={sensor} />);
    const button = screen.getByTestId(`sew-switch-button-${sensor.sensorId}`);
    await waitForButtonResponse(button);
    screen.getByText(sensor.name);
    screen.getByText('OFF');
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, {
        deviceId,
        actions: [action]
    });

    // Button request ON
    fakeSendActions.mockClear();
    fakeIsActionError.mockClear();
    user.click(button);
    await waitForButtonResponse(button);
    screen.getByText('ON');
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, {
        deviceId,
        actions: [{ ...action, payload: 1 }]
    });
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
});

test('SewSwitchButton should show a button from a SensorInfo and switch off', async () => {
    const sensor: SensorInfo = { deviceId: 'deviceid', sensorId: '123456789', name: 'Juanjo Rojo', type: 'SWITCH', color: '#EE1010' };
    const action: Action = { sensorId: sensor.sensorId, type: sensor.type, payload: 0 };
    const deviceId = 'deviceid';
    fakeSendActions.mockResolvedValue([{ indexAction: 0, status: 200 }]);
    fakeIsActionError.mockReturnValue(false);

    // Button start requesting OFF
    render(<SewSwitchButton sensor={sensor} />);
    const button = screen.getByTestId(`sew-switch-button-${sensor.sensorId}`);
    await waitForButtonResponse(button);
    screen.getByText(sensor.name);
    screen.getByText('OFF');
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, { deviceId, actions: [action] });
    expect(fakeSendActions).toHaveBeenCalledTimes(1);

    // Enable Switch
    user.click(button);
    await waitForButtonResponse(button);
    // Disable Switch
    fakeSendActions.mockClear();
    fakeIsActionError.mockClear();
    user.click(button);
    await waitForButtonResponse(button);

    screen.getByText('OFF');
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, { deviceId, actions: [action] });
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
});

test('SewSwitchButton should show ERROR when sensorId not found', async () => {
    const sensor: SensorInfo = { deviceId: 'deviceid', sensorId: '123456789', name: 'Juanjo Rojo', type: 'SWITCH', color: '#EE1010' };
    const action: Action = { sensorId: sensor.sensorId, type: sensor.type, payload: 0 };
    const deviceId = 'deviceid';
    fakeSendActions.mockResolvedValue({ errorCode: 400 });
    fakeIsActionError.mockReturnValue(true);

    // Button start requesting OFF
    render(<SewSwitchButton sensor={sensor} />);
    const button = screen.getByTestId(`sew-switch-button-${sensor.sensorId}`);
    await waitForButtonResponse(button);
    screen.getByText(sensor.name);
    screen.getByText('??');
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, { deviceId, actions: [action] });
    expect(fakeSendActions).toHaveBeenCalledTimes(1);

    // Button request again
    fakeSendActions.mockClear();
    fakeIsActionError.mockClear();
    user.click(button);
    await waitForButtonResponse(button);
    screen.getByText('??');
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, { deviceId, actions: [action] });
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
});

test('SewSwitchButton should show ERROR when sensorId not found but has other sensors', async () => {
    const sensor: SensorInfo = { deviceId: 'deviceid', sensorId: '123456789', name: 'Juanjo Rojo', type: 'SWITCH', color: '#EE1010' };
    const action: Action = { sensorId: sensor.sensorId, type: sensor.type, payload: 0 };
    const deviceId = 'deviceid';
    fakeSendActions.mockResolvedValue({ errorCode: 400 });
    fakeIsActionError.mockReturnValue(true);

    // Button start requesting OFF
    render(<SewSwitchButton sensor={sensor} />);
    const button = screen.getByTestId(`sew-switch-button-${sensor.sensorId}`);
    await waitForButtonResponse(button);
    screen.getByText(sensor.name);
    screen.getByText('??');
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, { deviceId, actions: [action] });
    expect(fakeSendActions).toHaveBeenCalledTimes(1);

    // Button request again
    fakeSendActions.mockClear();
    fakeIsActionError.mockClear();
    user.click(button);
    await waitForButtonResponse(button);
    screen.getByText('??');
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, { deviceId, actions: [action] });
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
});

test('SewSwitchButton should show ERROR when server return an error', async () => {
    const sensor: SensorInfo = { deviceId: 'deviceid', sensorId: '123456789', name: 'Juanjo Rojo', type: 'SWITCH', color: '#EE1010' };
    const action: Action = { sensorId: sensor.sensorId, type: sensor.type, payload: 0 };
    const deviceId = 'deviceid';
    fakeSendActions.mockResolvedValue({ errorCode: 400 });
    fakeIsActionError.mockReturnValue(true);

    // Button start requesting OFF
    render(<SewSwitchButton sensor={sensor} />);
    const button = screen.getByTestId(`sew-switch-button-${sensor.sensorId}`);
    await waitForButtonResponse(button);
    screen.getByText(sensor.name);
    screen.getByText('??');
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, { deviceId, actions: [action] });
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
});

test('SewSwitchButton should show ERROR when request fails', async () => {
    const sensor: SensorInfo = { deviceId: 'deviceid', sensorId: '123456789', name: 'Juanjo Rojo', type: 'SWITCH', color: '#EE1010' };
    const action: Action = { sensorId: sensor.sensorId, type: sensor.type, payload: 0 };
    const deviceId = 'deviceid';
    fakeSendActions.mockResolvedValue({ errorCode: 'Server fails' });
    fakeIsActionError.mockReturnValue(true);

    // Button start requesting OFF
    render(<SewSwitchButton sensor={sensor} />);
    const button = screen.getByTestId(`sew-switch-button-${sensor.sensorId}`);
    await waitForButtonResponse(button);
    screen.getByText(sensor.name);
    screen.getByText('??');
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, { deviceId, actions: [action] });
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
});

test('SewSwitchButton should show ERROR when server crash', async () => {
    const sensor: SensorInfo = { deviceId: 'deviceid', sensorId: '123456789', name: 'Juanjo Rojo', type: 'SWITCH', color: '#EE1010' };
    const action: Action = { sensorId: sensor.sensorId, type: sensor.type, payload: 0 };
    const deviceId = 'deviceid';
    fakeSendActions.mockRejectedValue({ errorCode: 'Server fails' });
    fakeIsActionError.mockReturnValue(true);

    // Button start requesting OFF
    render(<SewSwitchButton sensor={sensor} />);
    const button = screen.getByTestId(`sew-switch-button-${sensor.sensorId}`);
    await waitForButtonResponse(button);
    screen.getByText(sensor.name);
    screen.getByText('??');
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, { deviceId, actions: [action] });
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
});
