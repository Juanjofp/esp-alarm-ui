import { screen, render, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { SensorInfo } from '../services/sensor-info';
import { SewSensorsList } from './';
import { sendActions, isActionError, Device } from '../services/actionizer';

const fakeSendActions = (sendActions as unknown) as jest.Mock;
const fakeIsActionError = (isActionError as unknown) as jest.Mock;
jest.mock('../services/actionizer');

const waitForButtonResponse = async (button: HTMLElement) => {
    expect(button).toBeDisabled();
    screen.getByText('Loading');
    await waitFor(() => expect(button).not.toBeDisabled());
};

test('SewSensorsList should show a link to CRUD when no sensors availables', async () => {
    const { rerender } = render(<SewSensorsList />);
    screen.getByText(/Add sensors/i);

    rerender(<SewSensorsList sensors={[]} />);
    await screen.findByText(/Add sensors/i);
});

test('SewSensorsList should show 3 SewSwitchButtons from a device', async () => {
    const sensors: SensorInfo[] = [
        { deviceId: 'deviceid', sensorId: '123456789', name: 'Sensor 1', type: 'SWITCH', color: '#ABC' },
        { deviceId: 'deviceid', sensorId: '123456788', name: 'Sensor 2', type: 'SWITCH', color: '#AAA' },
        { deviceId: 'deviceid', sensorId: '123456787', name: 'Sensor 3', type: 'SWITCH', color: '#0F5' }
    ];
    fakeSendActions.mockImplementation((device: Device) => {
        return Promise.resolve([{ actionIndex: 0, status: 200 }]);
    });
    fakeIsActionError.mockReturnValue(false);

    render(<SewSensorsList sensors={sensors} />);

    expect(screen.queryByText(/Add sensors/i)).not.toBeInTheDocument();
    const buttons = await screen.findAllByTestId(/sew-switch-button-/i);
    expect(buttons.length).toBe(sensors.length);
    // Buttons init to OFF state
    for (let i = 0; i < buttons.length; i++) {
        screen.getByText(sensors[i].name);
        expect(buttons[i]).toHaveTextContent(/OFF/);
        expect(fakeSendActions).toHaveBeenCalledTimes(3);
        expect(fakeSendActions).toHaveBeenNthCalledWith(i + 1, {
            deviceId: 'deviceid',
            actions: [{ payload: 0, sensorId: sensors[i].sensorId, type: 'SWITCH' }]
        });
    }

    // Turn ON all buttons
    for (let i = 0; i < buttons.length; i++) {
        fakeSendActions.mockClear();
        user.click(buttons[i]);
        await waitForButtonResponse(buttons[i]);
        screen.getByText(sensors[i].name);
        expect(buttons[i]).toHaveTextContent(/ON/);
        expect(fakeSendActions).toHaveBeenCalledTimes(1);
        expect(fakeSendActions).toHaveBeenNthCalledWith(1, {
            deviceId: 'deviceid',
            actions: [{ payload: 1, sensorId: sensors[i].sensorId, type: 'SWITCH' }]
        });
    }

    // Turn OFF all buttons
    for (let i = 0; i < buttons.length; i++) {
        fakeSendActions.mockClear();
        user.click(buttons[i]);
        await waitForButtonResponse(buttons[i]);
        screen.getByText(sensors[i].name);
        expect(buttons[i]).toHaveTextContent(/OFF/);
        expect(fakeSendActions).toHaveBeenCalledTimes(1);
        expect(fakeSendActions).toHaveBeenNthCalledWith(1, {
            deviceId: 'deviceid',
            actions: [{ payload: 0, sensorId: sensors[i].sensorId, type: 'SWITCH' }]
        });
    }
});
