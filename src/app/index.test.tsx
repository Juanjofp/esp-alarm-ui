import React from 'react';
import { render, screen, within } from '@testing-library/react';
import user from '@testing-library/user-event';
import App from './';
import { sendActions, isActionError, ActionBody } from '../services/actionizer';

beforeEach(() => localStorage.clear());

const fakeSendActions = (sendActions as unknown) as jest.Mock;
const fakeIsActionError = (isActionError as unknown) as jest.Mock;
jest.mock('../services/actionizer');

test('renders App without crash', async () => {
    localStorage.setItem(
        'sensor-info',
        JSON.stringify([
            { sensorId: '123456789', name: 'Sensor 1', type: 'SWITCH', color: '#ABC' },
            { sensorId: '123456788', name: 'Sensor 2', type: 'SWITCH', color: '#AAA' },
            { sensorId: '123456787', name: 'Sensor 3', type: 'SWITCH', color: '#0F5' }
        ])
    );
    fakeSendActions.mockImplementation((action: ActionBody) => {
        return Promise.resolve([{ action, status: 200 }]);
    });
    fakeIsActionError.mockReturnValue(false);

    render(<App />);

    const title = screen.getByText(/Alarm UI/i);
    expect(title).toBeInTheDocument();
    expect(screen.queryByText(/Add sensors/i)).not.toBeInTheDocument();
    const buttons = await screen.findAllByTestId(/sew-switch-button-/i);
    expect(buttons.length).toBe(3);
});

test('renders App empty without crash', async () => {
    fakeSendActions.mockImplementation((action: ActionBody) => {
        return Promise.resolve([{ action, status: 200 }]);
    });
    fakeIsActionError.mockReturnValue(false);

    render(<App />);

    const title = screen.getByText(/Alarm UI/i);
    expect(title).toBeInTheDocument();
    screen.getByText(/Add sensors/i);
    const buttons = screen.queryAllByTestId(/sew-switch-button-/i);
    expect(buttons.length).toBe(0);
});

test('renders App and navigate to sensors', async () => {
    const initialSensors = [
        { sensorId: '123456789', name: 'Sensor 1', type: 'SWITCH', color: '#ABC' },
        { sensorId: '123456788', name: 'Sensor 2', type: 'SWITCH', color: '#AAA' },
        { sensorId: '123456787', name: 'Sensor 3', type: 'SWITCH', color: '#0F5' }
    ];
    localStorage.setItem('sensor-info', JSON.stringify(initialSensors));
    fakeSendActions.mockImplementation((action: ActionBody) => {
        return Promise.resolve([{ action, status: 200 }]);
    });
    fakeIsActionError.mockReturnValue(false);

    render(<App />);
    const title = screen.getByText(/Alarm UI/i);
    expect(title).toBeInTheDocument();
    expect(screen.queryByText(/Add sensors/i)).not.toBeInTheDocument();
    const buttons = await screen.findAllByTestId(/sew-switch-button-/i);
    expect(buttons.length).toBe(3);

    // Navigate to Sensors
    user.click(screen.getByText(/sensors/i));

    // Delete Sensor 2
    const sensorsViews = screen.getAllByTestId(/sew-sensors-crud-list-/i);
    expect(sensorsViews.length).toBe(3);

    // Delete Sensor 2
    const svSensor2 = within(sensorsViews[1]);
    user.click(svSensor2.getByTestId('sew-sensors-crud-button-delete'));
    const restSensors = localStorage.getItem('sensor-info');
    expect(JSON.parse(restSensors!)).toEqual([initialSensors[0], initialSensors[2]]);

    // Return to home state
    user.click(screen.getByText(/buttons/i));
    const newButtons = await screen.findAllByTestId(/sew-switch-button-/i);
    expect(newButtons.length).toBe(2);
});
