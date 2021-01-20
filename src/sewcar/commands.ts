import { Action, Device, sendActions } from '../services/actionizer';
import { SewCarInfo } from '../services/sensor-info';

const createDCMotorAction = (sensorId: string, enabled: boolean, reverse: boolean, power: number): Action => ({
    sensorId: sensorId,
    type: 'DCMOTOR',
    payload: { enabled: enabled, reverse: reverse, power: power }
});
const createDeviceBody = (deviceId: string, actions: Action[]): Device => ({
    deviceId,
    actions
});

export const createCommands = (sewCar: SewCarInfo) => ({
    stop: () => {
        const deviceBody = createDeviceBody(sewCar.deviceId, [
            createDCMotorAction(sewCar.motorLeft, false, false, 0),
            createDCMotorAction(sewCar.motorRight, false, false, 0)
        ]);
        sendActions(deviceBody);
    },
    forward: (power: number) => {
        const deviceBody = createDeviceBody(sewCar.deviceId, [
            createDCMotorAction(sewCar.motorLeft, true, false, power),
            createDCMotorAction(sewCar.motorRight, true, false, power)
        ]);
        sendActions(deviceBody);
    },
    backward: (power: number) => {
        const deviceBody = createDeviceBody(sewCar.deviceId, [
            createDCMotorAction(sewCar.motorLeft, true, true, power),
            createDCMotorAction(sewCar.motorRight, true, true, power)
        ]);
        sendActions(deviceBody);
    },
    left: (power: number) => {
        const deviceBody = createDeviceBody(sewCar.deviceId, [
            createDCMotorAction(sewCar.motorLeft, true, false, 0),
            createDCMotorAction(sewCar.motorRight, true, false, power)
        ]);
        sendActions(deviceBody);
    },
    right: (power: number) => {
        const deviceBody = createDeviceBody(sewCar.deviceId, [
            createDCMotorAction(sewCar.motorLeft, true, false, power),
            createDCMotorAction(sewCar.motorRight, true, false, 0)
        ]);
        sendActions(deviceBody);
    },
    leftForward: (power: number) => {
        const deviceBody = createDeviceBody(sewCar.deviceId, [
            createDCMotorAction(sewCar.motorLeft, true, false, Math.round((power * 2) / 3)),
            createDCMotorAction(sewCar.motorRight, true, false, power)
        ]);
        sendActions(deviceBody);
    },
    rightForward: (power: number) => {
        const deviceBody = createDeviceBody(sewCar.deviceId, [
            createDCMotorAction(sewCar.motorLeft, true, false, power),
            createDCMotorAction(sewCar.motorRight, true, false, Math.round((power * 2) / 3))
        ]);
        sendActions(deviceBody);
    },
    leftBackward: (power: number) => {
        const deviceBody = createDeviceBody(sewCar.deviceId, [
            createDCMotorAction(sewCar.motorLeft, true, true, Math.round((power * 2) / 3)),
            createDCMotorAction(sewCar.motorRight, true, true, power)
        ]);
        sendActions(deviceBody);
    },
    rightBackward: (power: number) => {
        const deviceBody = createDeviceBody(sewCar.deviceId, [
            createDCMotorAction(sewCar.motorLeft, true, true, power),
            createDCMotorAction(sewCar.motorRight, true, true, Math.round((power * 2) / 3))
        ]);
        sendActions(deviceBody);
    }
});
