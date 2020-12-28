import * as React from 'react';
import { screen, render, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { SewSwitchButton } from '.';
import { SensorInfo } from '../services/sensor-info';
import { sendActions, isActionError, ActionBody } from '../services/actionizer';

const fakeSendActions = (sendActions as unknown) as jest.Mock;
const fakeIsActionError = (isActionError as unknown) as jest.Mock;
jest.mock('../services/actionizer');

const waitForButtonResponse = async (button: HTMLElement) => {
    expect(button).toBeDisabled();
    screen.getByText('Loading');
    await waitFor(() => expect(button).not.toBeDisabled());
};

test('SewSwitchButton should show a button from a SensorInfo and switch on', async () => {
    const sensor: SensorInfo = { sensorId: '123456789', name: 'Juanjo Rojo', type: 'SWITCH', color: '#EE1010' };
    const action: ActionBody = { sensorId: sensor.sensorId, type: sensor.type, payload: 0 };
    fakeSendActions.mockResolvedValue([{ action, status: 200 }]);
    fakeIsActionError.mockReturnValue(false);

    // Button start requesting OFF
    render(<SewSwitchButton sensor={sensor} />);
    const button = screen.getByTestId(`sew-switch-button-${sensor.sensorId}`);
    await waitForButtonResponse(button);
    screen.getByText(sensor.name);
    screen.getByText('OFF');
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, { payload: 0, sensorId: '123456789', type: 'SWITCH' });
    expect(fakeSendActions).toHaveBeenCalledTimes(1);

    // Button request ON
    fakeSendActions.mockClear();
    fakeIsActionError.mockClear();
    action.payload = 1;
    user.click(button);
    await waitForButtonResponse(button);
    screen.getByText('ON');
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, { payload: 1, sensorId: '123456789', type: 'SWITCH' });
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
});

test('SewSwitchButton should show a button from a SensorInfo and switch off', async () => {
    const sensor: SensorInfo = { sensorId: '123456789', name: 'Juanjo Rojo', type: 'SWITCH', color: '#EE1010' };
    const action: ActionBody = { sensorId: sensor.sensorId, type: sensor.type, payload: 0 };
    fakeSendActions.mockResolvedValue([{ action, status: 200 }]);
    fakeIsActionError.mockReturnValue(false);

    // Button start requesting OFF
    render(<SewSwitchButton sensor={sensor} />);
    const button = screen.getByTestId(`sew-switch-button-${sensor.sensorId}`);
    await waitForButtonResponse(button);
    screen.getByText(sensor.name);
    screen.getByText('OFF');
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, { payload: 0, sensorId: '123456789', type: 'SWITCH' });
    expect(fakeSendActions).toHaveBeenCalledTimes(1);

    // Enable Switch
    action.payload = 1;
    user.click(button);
    await waitForButtonResponse(button);
    // Disable Switch
    fakeSendActions.mockClear();
    fakeIsActionError.mockClear();
    action.payload = 0;
    user.click(button);
    await waitForButtonResponse(button);

    screen.getByText('OFF');
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, { payload: 0, sensorId: '123456789', type: 'SWITCH' });
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
});

test('SewSwitchButton should show ERROR when sensorId not found', async () => {
    const sensor: SensorInfo = { sensorId: '123456789', name: 'Juanjo Rojo', type: 'SWITCH', color: '#EE1010' };
    fakeSendActions.mockResolvedValue([]);
    fakeIsActionError.mockReturnValue(false);

    // Button start requesting OFF
    render(<SewSwitchButton sensor={sensor} />);
    const button = screen.getByTestId(`sew-switch-button-${sensor.sensorId}`);
    await waitForButtonResponse(button);
    screen.getByText(sensor.name);
    screen.getByText('??');
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, { payload: 0, sensorId: '123456789', type: 'SWITCH' });
    expect(fakeSendActions).toHaveBeenCalledTimes(1);

    // Button request again
    fakeSendActions.mockClear();
    fakeIsActionError.mockClear();
    user.click(button);
    await waitForButtonResponse(button);
    screen.getByText('??');
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, { payload: 0, sensorId: '123456789', type: 'SWITCH' });
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
});

test('SewSwitchButton should show ERROR when sensorId not found but has other sensors', async () => {
    const sensor: SensorInfo = { sensorId: '123456789', name: 'Juanjo Rojo', type: 'SWITCH', color: '#EE1010' };
    fakeSendActions.mockResolvedValue([{ action: { sensorId: '123456788', type: sensor.type, payload: 0 }, status: 200 }]);
    fakeIsActionError.mockReturnValue(false);

    // Button start requesting OFF
    render(<SewSwitchButton sensor={sensor} />);
    const button = screen.getByTestId(`sew-switch-button-${sensor.sensorId}`);
    await waitForButtonResponse(button);
    screen.getByText(sensor.name);
    screen.getByText('??');
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, { payload: 0, sensorId: '123456789', type: 'SWITCH' });
    expect(fakeSendActions).toHaveBeenCalledTimes(1);

    // Button request again
    fakeSendActions.mockClear();
    fakeIsActionError.mockClear();
    user.click(button);
    await waitForButtonResponse(button);
    screen.getByText('??');
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, { payload: 0, sensorId: '123456789', type: 'SWITCH' });
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
});

test('SewSwitchButton should show ERROR when server return an error', async () => {
    const sensor: SensorInfo = { sensorId: '123456789', name: 'Juanjo Rojo', type: 'SWITCH', color: '#EE1010' };
    fakeSendActions.mockResolvedValue([{ action: { sensorId: '123456789' }, error: 4001, message: 'sensorId is required' }]);
    fakeIsActionError.mockReturnValue(false);

    // Button start requesting OFF
    render(<SewSwitchButton sensor={sensor} />);
    const button = screen.getByTestId(`sew-switch-button-${sensor.sensorId}`);
    await waitForButtonResponse(button);
    screen.getByText(sensor.name);
    screen.getByText('??');
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, { payload: 0, sensorId: '123456789', type: 'SWITCH' });
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
});

test('SewSwitchButton should show ERROR when request fails', async () => {
    const sensor: SensorInfo = { sensorId: '123456789', name: 'Juanjo Rojo', type: 'SWITCH', color: '#EE1010' };
    fakeSendActions.mockResolvedValue({ errorCode: 'Server fails' });
    fakeIsActionError.mockReturnValue(true);

    // Button start requesting OFF
    render(<SewSwitchButton sensor={sensor} />);
    const button = screen.getByTestId(`sew-switch-button-${sensor.sensorId}`);
    await waitForButtonResponse(button);
    screen.getByText(sensor.name);
    screen.getByText('??');
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, { payload: 0, sensorId: '123456789', type: 'SWITCH' });
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
});

test('SewSwitchButton should show ERROR when server crash', async () => {
    const sensor: SensorInfo = { sensorId: '123456789', name: 'Juanjo Rojo', type: 'SWITCH', color: '#EE1010' };
    fakeSendActions.mockRejectedValue({ errorCode: 'Server fails' });
    fakeIsActionError.mockReturnValue(true);

    // Button start requesting OFF
    render(<SewSwitchButton sensor={sensor} />);
    const button = screen.getByTestId(`sew-switch-button-${sensor.sensorId}`);
    await waitForButtonResponse(button);
    screen.getByText(sensor.name);
    screen.getByText('??');
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, { payload: 0, sensorId: '123456789', type: 'SWITCH' });
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
});
