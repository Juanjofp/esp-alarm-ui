import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import user from '@testing-library/user-event';
import { SewCar } from './';
import { SewCarInfo, SewCarInfoRepository } from '../services/sensor-info';
import { sendActions } from '../services/actionizer';

const sewCarInfo: SewCarInfo = { deviceId: 'deviceid', motorLeft: 'motorleftid', motorRight: 'motorrightid' };
const expectedStop = {
    actions: [
        {
            payload: {
                enabled: false,
                power: 0,
                reverse: false
            },
            sensorId: 'motorleftid',
            type: 'DCMOTOR'
        },
        {
            payload: {
                enabled: false,
                power: 0,
                reverse: false
            },
            sensorId: 'motorrightid',
            type: 'DCMOTOR'
        }
    ],
    deviceId: 'deviceid'
};
const expectedForward = {
    actions: [
        {
            payload: {
                enabled: true,
                power: 100,
                reverse: false
            },
            sensorId: 'motorleftid',
            type: 'DCMOTOR'
        },
        {
            payload: {
                enabled: true,
                power: 100,
                reverse: false
            },
            sensorId: 'motorrightid',
            type: 'DCMOTOR'
        }
    ],
    deviceId: 'deviceid'
};
const expectedBackward = {
    actions: [
        {
            payload: {
                enabled: true,
                power: 220,
                reverse: true
            },
            sensorId: 'motorleftid',
            type: 'DCMOTOR'
        },
        {
            payload: {
                enabled: true,
                power: 220,
                reverse: true
            },
            sensorId: 'motorrightid',
            type: 'DCMOTOR'
        }
    ],
    deviceId: 'deviceid'
};
const expectedLeft = {
    actions: [
        {
            payload: {
                enabled: true,
                power: 0,
                reverse: false
            },
            sensorId: 'motorleftid',
            type: 'DCMOTOR'
        },
        {
            payload: {
                enabled: true,
                power: 180,
                reverse: false
            },
            sensorId: 'motorrightid',
            type: 'DCMOTOR'
        }
    ],
    deviceId: 'deviceid'
};
const expectedRight = {
    actions: [
        {
            payload: {
                enabled: true,
                power: 90,
                reverse: false
            },
            sensorId: 'motorleftid',
            type: 'DCMOTOR'
        },
        {
            payload: {
                enabled: true,
                power: 0,
                reverse: false
            },
            sensorId: 'motorrightid',
            type: 'DCMOTOR'
        }
    ],
    deviceId: 'deviceid'
};
const expectedLeftForward = {
    actions: [
        {
            payload: {
                enabled: true,
                power: 167,
                reverse: false
            },
            sensorId: 'motorleftid',
            type: 'DCMOTOR'
        },
        {
            payload: {
                enabled: true,
                power: 250,
                reverse: false
            },
            sensorId: 'motorrightid',
            type: 'DCMOTOR'
        }
    ],
    deviceId: 'deviceid'
};
const expectedRightForward = {
    actions: [
        {
            payload: {
                enabled: true,
                power: 150,
                reverse: false
            },
            sensorId: 'motorleftid',
            type: 'DCMOTOR'
        },
        {
            payload: {
                enabled: true,
                power: 100,
                reverse: false
            },
            sensorId: 'motorrightid',
            type: 'DCMOTOR'
        }
    ],
    deviceId: 'deviceid'
};
const expectedLeftBackward = {
    actions: [
        {
            payload: {
                enabled: true,
                power: 73,
                reverse: true
            },
            sensorId: 'motorleftid',
            type: 'DCMOTOR'
        },
        {
            payload: {
                enabled: true,
                power: 110,
                reverse: true
            },
            sensorId: 'motorrightid',
            type: 'DCMOTOR'
        }
    ],
    deviceId: 'deviceid'
};
const expectedRightBackward = {
    actions: [
        {
            payload: {
                enabled: true,
                power: 210,
                reverse: true
            },
            sensorId: 'motorleftid',
            type: 'DCMOTOR'
        },
        {
            payload: {
                enabled: true,
                power: 140,
                reverse: true
            },
            sensorId: 'motorrightid',
            type: 'DCMOTOR'
        }
    ],
    deviceId: 'deviceid'
};

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
    render(<SewCar />);
    await screen.findByTestId(/sewcar-form-container/);
});

test('SewCar render a SewCarForm when no SewCarInfo available', async () => {
    render(<SewCar />);

    await screen.findByTestId(/sewcar-form-container/);
    const inputDeviceId = await screen.findByTestId(/sewcar-form-input-deviceid/);
    const inputMotorLeft = await screen.findByTestId(/sewcar-form-input-motor-left/);
    const inputMotorRight = await screen.findByTestId(/sewcar-form-input-motor-right/);
    const btnSave = await screen.findByTestId(/sewcar-form-button-save/);
    expect(btnSave).toBeDisabled();

    // Set sewCarInfo data
    user.type(inputDeviceId, sewCarInfo.deviceId);
    expect(btnSave).toBeDisabled();
    user.type(inputMotorLeft, sewCarInfo.motorLeft);
    expect(btnSave).toBeDisabled();
    user.type(inputMotorRight, sewCarInfo.motorRight);
    expect(btnSave).not.toBeDisabled();

    // Save sewCarInfo
    user.click(btnSave);
    await screen.findByTestId(/sewcar-pad-container/);
    expect(SewCarInfoRepository.load()).toEqual(sewCarInfo);
});

test('SewCar render a SewCarPad when SewCarInfo available', async () => {
    SewCarInfoRepository.save(sewCarInfo);

    render(<SewCar />);
    await screen.findByTestId(/sewcar-pad-container/);
});

test('SewCarPad run forward command and stop when down/up mouse button', async () => {
    SewCarInfoRepository.save(sewCarInfo);

    render(<SewCar />);
    await screen.findByTestId(/sewcar-pad-container/);

    const powerInput = await screen.findByTestId(/sewcar-pad-input-power$/);
    fireEvent.change(powerInput, { target: { value: '100', valueAsNumber: 100 } });

    // Forward Action
    const upButton = await screen.findByTestId(/sewcar-pad-button-up$/);
    fireEvent.mouseDown(upButton);
    fireEvent.contextMenu(upButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, expectedForward);
    fireEvent.mouseUp(upButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(2);
    expect(fakeSendActions).toHaveBeenNthCalledWith(2, expectedStop);
});

test('SewCarPad run forward command and stop when touch start/end', async () => {
    SewCarInfoRepository.save(sewCarInfo);

    render(<SewCar />);
    await screen.findByTestId(/sewcar-pad-container/);

    const powerInput = await screen.findByTestId(/sewcar-pad-input-power$/);
    fireEvent.change(powerInput, { target: { value: '100', valueAsNumber: 100 } });

    // Forward Action
    const upButton = await screen.findByTestId(/sewcar-pad-button-up$/);
    fireEvent.touchStart(upButton);
    fireEvent.contextMenu(upButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, expectedForward);
    fireEvent.touchEnd(upButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(2);
    expect(fakeSendActions).toHaveBeenNthCalledWith(2, expectedStop);
});

test('SewCarPad run Backward command and stop when down/up mouse button', async () => {
    SewCarInfoRepository.save(sewCarInfo);

    render(<SewCar />);
    await screen.findByTestId(/sewcar-pad-container/);

    const powerInput = await screen.findByTestId(/sewcar-pad-input-power$/);
    fireEvent.change(powerInput, { target: { value: '220', valueAsNumber: 220 } });

    // Backward Action
    const downButton = await screen.findByTestId(/sewcar-pad-button-down$/);
    fireEvent.mouseDown(downButton);
    fireEvent.contextMenu(downButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, expectedBackward);
    fireEvent.mouseUp(downButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(2);
    expect(fakeSendActions).toHaveBeenNthCalledWith(2, expectedStop);
});

test('SewCarPad run Backward command and stop when touch start/end', async () => {
    SewCarInfoRepository.save(sewCarInfo);

    render(<SewCar />);
    await screen.findByTestId(/sewcar-pad-container/);

    const powerInput = await screen.findByTestId(/sewcar-pad-input-power$/);
    fireEvent.change(powerInput, { target: { value: '220', valueAsNumber: 220 } });

    // Backward Action
    const downButton = await screen.findByTestId(/sewcar-pad-button-down$/);
    fireEvent.touchStart(downButton);
    fireEvent.contextMenu(downButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, expectedBackward);
    fireEvent.touchEnd(downButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(2);
    expect(fakeSendActions).toHaveBeenNthCalledWith(2, expectedStop);
});

test('SewCarPad run Left command and stop when down/up mouse button', async () => {
    SewCarInfoRepository.save(sewCarInfo);

    render(<SewCar />);
    await screen.findByTestId(/sewcar-pad-container/);

    const powerInput = await screen.findByTestId(/sewcar-pad-input-power$/);
    fireEvent.change(powerInput, { target: { value: '180', valueAsNumber: 180 } });

    // Left Action
    const leftButton = await screen.findByTestId(/sewcar-pad-button-left$/);
    fireEvent.mouseDown(leftButton);
    fireEvent.contextMenu(leftButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, expectedLeft);
    fireEvent.mouseUp(leftButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(2);
    expect(fakeSendActions).toHaveBeenNthCalledWith(2, expectedStop);
});

test('SewCarPad run Left command and stop when touch start/end', async () => {
    SewCarInfoRepository.save(sewCarInfo);

    render(<SewCar />);
    await screen.findByTestId(/sewcar-pad-container/);

    const powerInput = await screen.findByTestId(/sewcar-pad-input-power$/);
    fireEvent.change(powerInput, { target: { value: '180', valueAsNumber: 180 } });

    // Left Action
    const leftButton = await screen.findByTestId(/sewcar-pad-button-left$/);
    fireEvent.touchStart(leftButton);
    fireEvent.contextMenu(leftButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, expectedLeft);
    fireEvent.touchEnd(leftButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(2);
    expect(fakeSendActions).toHaveBeenNthCalledWith(2, expectedStop);
});

test('SewCarPad run Right command and stop when down/up mouse button', async () => {
    SewCarInfoRepository.save(sewCarInfo);

    render(<SewCar />);
    await screen.findByTestId(/sewcar-pad-container/);

    const powerInput = await screen.findByTestId(/sewcar-pad-input-power$/);
    fireEvent.change(powerInput, { target: { value: '90', valueAsNumber: 90 } });

    // Right Action
    const rightButton = await screen.findByTestId(/sewcar-pad-button-right$/);
    fireEvent.mouseDown(rightButton);
    fireEvent.contextMenu(rightButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, expectedRight);
    fireEvent.mouseUp(rightButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(2);
    expect(fakeSendActions).toHaveBeenNthCalledWith(2, expectedStop);
});

test('SewCarPad run Right command and stop when touch start/end', async () => {
    SewCarInfoRepository.save(sewCarInfo);

    render(<SewCar />);
    await screen.findByTestId(/sewcar-pad-container/);

    const powerInput = await screen.findByTestId(/sewcar-pad-input-power$/);
    fireEvent.change(powerInput, { target: { value: '90', valueAsNumber: 90 } });

    // Right Action
    const rightButton = await screen.findByTestId(/sewcar-pad-button-right$/);
    fireEvent.touchStart(rightButton);
    fireEvent.contextMenu(rightButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, expectedRight);
    fireEvent.touchEnd(rightButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(2);
    expect(fakeSendActions).toHaveBeenNthCalledWith(2, expectedStop);
});

test('SewCarPad run LeftForward command and stop when down/up mouse button', async () => {
    SewCarInfoRepository.save(sewCarInfo);

    render(<SewCar />);
    await screen.findByTestId(/sewcar-pad-container/);

    const powerInput = await screen.findByTestId(/sewcar-pad-input-power$/);
    fireEvent.change(powerInput, { target: { value: '250', valueAsNumber: 250 } });

    // LeftForward Action
    const leftForwardButton = await screen.findByTestId(/sewcar-pad-button-upleft$/);
    fireEvent.mouseDown(leftForwardButton);
    fireEvent.contextMenu(leftForwardButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, expectedLeftForward);
    fireEvent.mouseUp(leftForwardButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(2);
    expect(fakeSendActions).toHaveBeenNthCalledWith(2, expectedStop);
});

test('SewCarPad run LeftForward command and stop when touch start/end', async () => {
    SewCarInfoRepository.save(sewCarInfo);

    render(<SewCar />);
    await screen.findByTestId(/sewcar-pad-container/);

    const powerInput = await screen.findByTestId(/sewcar-pad-input-power$/);
    fireEvent.change(powerInput, { target: { value: '250', valueAsNumber: 250 } });

    // LeftForward Action
    const leftForwardButton = await screen.findByTestId(/sewcar-pad-button-upleft$/);
    fireEvent.touchStart(leftForwardButton);
    fireEvent.contextMenu(leftForwardButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, expectedLeftForward);
    fireEvent.touchEnd(leftForwardButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(2);
    expect(fakeSendActions).toHaveBeenNthCalledWith(2, expectedStop);
});

test('SewCarPad run RightForward command and stop when down/up mouse button', async () => {
    SewCarInfoRepository.save(sewCarInfo);

    render(<SewCar />);
    await screen.findByTestId(/sewcar-pad-container/);

    const powerInput = await screen.findByTestId(/sewcar-pad-input-power$/);
    fireEvent.change(powerInput, { target: { value: '150', valueAsNumber: 150 } });

    // RightForward Action
    const rightForwardButton = await screen.findByTestId(/sewcar-pad-button-upright$/);
    fireEvent.mouseDown(rightForwardButton);
    fireEvent.contextMenu(rightForwardButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, expectedRightForward);
    fireEvent.mouseUp(rightForwardButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(2);
    expect(fakeSendActions).toHaveBeenNthCalledWith(2, expectedStop);
});

test('SewCarPad run RightForward command and stop when touch start/end', async () => {
    SewCarInfoRepository.save(sewCarInfo);

    render(<SewCar />);
    await screen.findByTestId(/sewcar-pad-container/);

    const powerInput = await screen.findByTestId(/sewcar-pad-input-power$/);
    fireEvent.change(powerInput, { target: { value: '150', valueAsNumber: 150 } });

    // Rightward Action
    const rightForwardButton = await screen.findByTestId(/sewcar-pad-button-upright$/);
    fireEvent.touchStart(rightForwardButton);
    fireEvent.contextMenu(rightForwardButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, expectedRightForward);
    fireEvent.touchEnd(rightForwardButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(2);
    expect(fakeSendActions).toHaveBeenNthCalledWith(2, expectedStop);
});

test('SewCarPad run LeftBackward command and stop when down/up mouse button', async () => {
    SewCarInfoRepository.save(sewCarInfo);

    render(<SewCar />);
    await screen.findByTestId(/sewcar-pad-container/);

    const powerInput = await screen.findByTestId(/sewcar-pad-input-power$/);
    fireEvent.change(powerInput, { target: { value: '110', valueAsNumber: 110 } });

    // LeftBackward Action
    const leftBackwardButton = await screen.findByTestId(/sewcar-pad-button-downleft$/);
    fireEvent.mouseDown(leftBackwardButton);
    fireEvent.contextMenu(leftBackwardButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, expectedLeftBackward);
    fireEvent.mouseUp(leftBackwardButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(2);
    expect(fakeSendActions).toHaveBeenNthCalledWith(2, expectedStop);
});

test('SewCarPad run LeftBackward command and stop when touch start/end', async () => {
    SewCarInfoRepository.save(sewCarInfo);

    render(<SewCar />);
    await screen.findByTestId(/sewcar-pad-container/);

    const powerInput = await screen.findByTestId(/sewcar-pad-input-power$/);
    fireEvent.change(powerInput, { target: { value: '110', valueAsNumber: 110 } });

    // LeftBackward Action
    const leftBackwardButton = await screen.findByTestId(/sewcar-pad-button-downleft$/);
    fireEvent.touchStart(leftBackwardButton);
    fireEvent.contextMenu(leftBackwardButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, expectedLeftBackward);
    fireEvent.touchEnd(leftBackwardButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(2);
    expect(fakeSendActions).toHaveBeenNthCalledWith(2, expectedStop);
});

test('SewCarPad run RightBackward command and stop when down/up mouse button', async () => {
    SewCarInfoRepository.save(sewCarInfo);

    render(<SewCar />);
    await screen.findByTestId(/sewcar-pad-container/);

    const powerInput = await screen.findByTestId(/sewcar-pad-input-power$/);
    fireEvent.change(powerInput, { target: { value: '210', valueAsNumber: 210 } });

    // Backward Action
    const rightBackwardButton = await screen.findByTestId(/sewcar-pad-button-downright$/);
    fireEvent.mouseDown(rightBackwardButton);
    fireEvent.contextMenu(rightBackwardButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, expectedRightBackward);
    fireEvent.mouseUp(rightBackwardButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(2);
    expect(fakeSendActions).toHaveBeenNthCalledWith(2, expectedStop);
});

test('SewCarPad run RightBackward command and stop when touch start/end', async () => {
    SewCarInfoRepository.save(sewCarInfo);

    render(<SewCar />);
    await screen.findByTestId(/sewcar-pad-container/);

    const powerInput = await screen.findByTestId(/sewcar-pad-input-power$/);
    fireEvent.change(powerInput, { target: { value: '210', valueAsNumber: 210 } });

    // Backward Action
    const rightBackwardButton = await screen.findByTestId(/sewcar-pad-button-downright$/);
    fireEvent.touchStart(rightBackwardButton);
    fireEvent.contextMenu(rightBackwardButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(1);
    expect(fakeSendActions).toHaveBeenNthCalledWith(1, expectedRightBackward);
    fireEvent.touchEnd(rightBackwardButton);
    expect(fakeSendActions).toHaveBeenCalledTimes(2);
    expect(fakeSendActions).toHaveBeenNthCalledWith(2, expectedStop);
});
