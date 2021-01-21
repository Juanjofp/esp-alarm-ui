import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SewTank } from './';
import { SewCarInfo, SewCarInfoRepository } from '../services/sensor-info';
import { sendActions } from '../services/actionizer';

const sewCarInfo: SewCarInfo = { deviceId: 'deviceid', motorLeft: 'motorleftid', motorRight: 'motorrightid' };

const fakeSendActions = sendActions as jest.Mock;
jest.mock('../services/actionizer', () => {
    return {
        sendActions: jest.fn().mockResolvedValue({ indexAction: 0, status: true })
    };
});

beforeEach(() => {
    window.localStorage.clear();
    fakeSendActions.mockClear();
});

test('SewCar render without crash', async () => {
    render(<SewTank />);
    await screen.findByTestId(/sewtank-container/);
    await screen.findByText(/no configuration found/i);
});

test('SewCar render with a sewcar configuration', async () => {
    SewCarInfoRepository.save(sewCarInfo);

    render(<SewTank />);
    await screen.findByTestId(/sewtank-container/);

    const inputLeftMotor = await screen.findByTestId(/sewtank-motor-left-input/);
    const inputRightMotor = await screen.findByTestId(/sewtank-motor-right-input/);

    // Run forward
    fireEvent.change(inputLeftMotor, { target: { value: '220', valueAsNumber: 220 } });
    fireEvent.change(inputRightMotor, { target: { value: '220', valueAsNumber: 220 } });
    expect(fakeSendActions).toHaveBeenCalledTimes(2);
});
