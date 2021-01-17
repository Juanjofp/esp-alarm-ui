import * as React from 'react';
import { SensorInfo } from '../services/sensor-info';
import { sendActions, isActionError, ActionPayload } from '../services/actionizer';
import './styles.css';

export type SewSwitchButtonProps = {
    sensor: SensorInfo;
};
export type SewSwitchButtonState = { loading: boolean; payload: ActionPayload | -1 };
export const SewSwitchButton: React.FC<SewSwitchButtonProps> = ({ sensor }) => {
    const [action, setAction] = React.useState<SewSwitchButtonState>({
        payload: 0,
        loading: false
    });

    const runAction = React.useCallback(
        async (payload: ActionPayload) => {
            try {
                setAction(action => ({ ...action, loading: true }));
                const response = await sendActions({
                    deviceId: sensor.deviceId,
                    actions: [{ sensorId: sensor.sensorId, type: sensor.type, payload }]
                });
                setAction(action => ({
                    payload: isActionError(response) ? -1 : payload,
                    loading: false
                }));
            } catch (error) {
                setAction(action => ({
                    payload: -1,
                    loading: false
                }));
            }
        },
        [sensor]
    );

    React.useEffect(() => {
        // Start button in OFF state
        runAction(0);
    }, [runAction]);
    return (
        <button
            className='ButtonSwitch'
            data-testid={`sew-switch-button-${sensor.sensorId}`}
            onClick={() => runAction(action.payload === 0 ? 1 : 0)}
            disabled={action.loading}
            style={{ backgroundColor: sensor.color }}
        >
            <div className='ButtonSwitchState'>
                {action.loading ? 'Loading' : action.payload === 1 ? 'ON' : action.payload === -1 ? '??' : 'OFF'}
            </div>
            <div className='ButtonSwitchName'>{sensor.name}</div>
        </button>
    );
};
