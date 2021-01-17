import * as React from 'react';
import { SensorInfo } from '../services/sensor-info';
import { SewSwitchButton } from '../sew-switch-button';
import './styles.css';

const NoView: React.FC<{ sensor: SensorInfo }> = ({ sensor }) => (
    <div className='NoView'>
        {sensor.type} - {sensor.sensorId}
    </div>
);
const SensorsView: { [key: string]: React.FC<any> } = {
    SWITCH: SewSwitchButton
};
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
        <div className='ButtonsList'>
            {sensors.map(sensorInfo => {
                const Component = SensorsView[sensorInfo.type] ? SensorsView[sensorInfo.type] : NoView;
                return <Component key={sensorInfo.sensorId} sensor={sensorInfo} />;
            })}
        </div>
    );
};
