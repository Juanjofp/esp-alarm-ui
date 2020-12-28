import { ACTIONEIZER_URL } from '../config';

export type SensorId = string;
export type SensorType = 'SWITCH' | 'DISTANCE';
export type SwitchValues = 0 | 1;
export type ActionPayload = SwitchValues;
export type ActionBody = {
    sensorId: SensorId;
    type: SensorType;
    payload: ActionPayload;
};

export type ActionResponse = { action: ActionBody & { tenantId: string }; status: number };
export type ActionErrorResponse = { errorCode: number };
export const isActionError = (response: ActionResponse[] | ActionErrorResponse): response is ActionErrorResponse => {
    if (!!(response as ActionErrorResponse).errorCode) return true;
    return false;
};

export async function sendActions(actions: ActionBody | ActionBody[]): Promise<ActionResponse[] | ActionErrorResponse> {
    const body = Array.isArray(actions) ? actions : [actions];
    if (body.length < 1) return [];
    const response = await fetch(ACTIONEIZER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (response.status === 200) return response.json();
    return { errorCode: response.status };
}
