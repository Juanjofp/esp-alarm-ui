import { ACTIONEIZER_URL } from '../config';

export type SensorId = string;
export type SensorType = 'SWITCH' | 'DISTANCE';
export type SwitchValues = 0 | 1;
export type ActionPayload = SwitchValues;
export type Action = {
    sensorId: SensorId;
    type: SensorType;
    payload: ActionPayload;
};
export type Device = {
    deviceId: string;
    actions: Action[];
};

export type ActionizerResponse = { actionIndex: number; status: number };
export type ActionizerErrorResponse = { errorCode: number };
export const isActionError = (response: ActionizerResponse[] | ActionizerErrorResponse): response is ActionizerErrorResponse => {
    if (!!(response as ActionizerErrorResponse).errorCode) return true;
    return false;
};

export async function sendActions(devices: Device | Device[]): Promise<ActionizerResponse[] | ActionizerErrorResponse> {
    const body = Array.isArray(devices) ? devices : [devices];
    if (body.length < 1) return [];
    const response = await fetch(ACTIONEIZER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (response.status === 200 || response.status === 202) return response.json();
    return { errorCode: response.status };
}
