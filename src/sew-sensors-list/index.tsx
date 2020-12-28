import * as React from 'react';
import { SensorInfo } from '../services/sensor-info';
import { SewSwitchButton } from '../sew-switch-button';

export type SewSensorsListProps = {
    sensors?: SensorInfo[];
};
export const SewSensorsList: React.FC<SewSensorsListProps> = ({ sensors }) => {
    if (!Array.isArray(sensors) || sensors.length < 1) {
        return (
            <div>
                <div>No Sensors found!</div>
                <div>Add Sensors</div>
            </div>
        );
    }
    return (
        <div>
            {sensors.map(sensorInfo => (
                <SewSwitchButton key={sensorInfo.sensorId} sensor={sensorInfo} />
            ))}
        </div>
    );
};
