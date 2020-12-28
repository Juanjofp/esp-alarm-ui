import * as React from 'react';
import { SensorType } from '../services/actionizer';
import { SensorInfo } from '../services/sensor-info';

const sensorInfoReducer = (state: SensorInfo, action: Partial<SensorInfo>) => ({ ...state, ...action });
const initialState: SensorInfo = {
    sensorId: '',
    name: '',
    type: 'SWITCH',
    color: '#BA000D'
};
const isSensorInfoCompleted = (sensor: SensorInfo) => {
    if (!sensor.sensorId || sensor.sensorId.length < 8) return false;
    if (!sensor.name || sensor.name.length < 3) return false;
    return true;
};
export type SewSensorsCRUDAddProps = {
    addSensor: (sensors: SensorInfo) => void;
};
export const SewSensorsCRUDAdd: React.FC<SewSensorsCRUDAddProps> = ({ addSensor }) => {
    const [sensor, updateSensor] = React.useReducer(sensorInfoReducer, initialState);
    return (
        <div>
            <div>
                <span>Sensor ID</span>
                <input
                    type='text'
                    data-testid='sew-sensors-crud-input-sensorid'
                    onChange={ev => updateSensor({ sensorId: ev.target.value })}
                    value={sensor.sensorId}
                />
            </div>
            <div>
                <span>Sensor Name</span>
                <input
                    type='text'
                    data-testid='sew-sensors-crud-input-name'
                    onChange={ev => updateSensor({ name: ev.target.value })}
                    value={sensor.name}
                />
            </div>
            <div>
                <span>Sensor Type</span>
                <select
                    data-testid='sew-sensors-crud-select-type'
                    onChange={ev => updateSensor({ type: ev.target.value as SensorType })}
                    value={sensor.type}
                >
                    <option value='SWITCH'>SWITCH</option>
                    <option value='DISTANCE'>DISTANCE</option>
                </select>
            </div>
            <div>
                <span>Sensor Color</span>
                <input
                    type='text'
                    data-testid='sew-sensors-crud-input-color'
                    onChange={ev => updateSensor({ color: ev.target.value })}
                    value={sensor.color}
                />
            </div>
            <button data-testid='sew-sensors-crud-button-save' disabled={!isSensorInfoCompleted(sensor)} onClick={() => addSensor(sensor)}>
                SAVE
            </button>
        </div>
    );
};

export type SewSensorsCRUDInfoListProps = {
    sensors?: SensorInfo[];
    deleteSensor: (index: number) => void;
};
export const SewSensorsCRUDInfoList: React.FC<SewSensorsCRUDInfoListProps> = ({ sensors, deleteSensor }) => {
    if (!Array.isArray(sensors) || sensors.length < 1) {
        return (
            <div>
                <div>No Sensors found!</div>
            </div>
        );
    }
    return (
        <div>
            {sensors.map((sensorInfo, index) => (
                <div key={sensorInfo.sensorId} data-testid={`sew-sensors-crud-list-${sensorInfo.sensorId}`}>
                    <div>{sensorInfo.name}</div>
                    <button data-testid={`sew-sensors-crud-button-delete`} onClick={() => deleteSensor(index)}>
                        DELETE
                    </button>
                </div>
            ))}
        </div>
    );
};

export type SewSensorsCRUDProps = {
    sensors?: SensorInfo[];
    onChange: (sensors: SensorInfo[]) => void;
};
export const SewSensorsCRUD: React.FC<SewSensorsCRUDProps> = ({ sensors = [], onChange }) => {
    return (
        <div>
            <SewSensorsCRUDAdd addSensor={sensor => onChange([...sensors, sensor])} />
            <SewSensorsCRUDInfoList
                sensors={sensors}
                deleteSensor={(index: number) => onChange([...sensors.slice(0, index), ...sensors.slice(index + 1)])}
            />
        </div>
    );
};
