import * as React from 'react';
import { SensorType } from '../services/actionizer';
import { SensorInfo } from '../services/sensor-info';
import { GithubPicker } from 'react-color';
import './styles.css';

const defaultColors = ['firebrick', '#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB'];
const sensorInfoReducer = (state: SensorInfo, action: Partial<SensorInfo>) => ({ ...state, ...action });
const initialState: SensorInfo = {
    deviceId: '',
    sensorId: '',
    name: '',
    type: 'SWITCH',
    color: '#DB3E00'
};
const isSensorInfoCompleted = (sensor: SensorInfo) => {
    if (!sensor.deviceId || sensor.deviceId.length < 6) return false;
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
        <div className='CRUDListAdd'>
            <div className='CRUDListAddField'>
                <span className='CRUDListAddFieldLabel'>Device ID</span>
                <input
                    className='CRUDListAddFieldValue'
                    type='text'
                    data-testid='sew-sensors-crud-input-deviceid'
                    onChange={ev => updateSensor({ deviceId: ev.target.value })}
                    value={sensor.deviceId}
                />
            </div>
            <div className='CRUDListAddField'>
                <span className='CRUDListAddFieldLabel'>Sensor ID</span>
                <input
                    className='CRUDListAddFieldValue'
                    type='text'
                    data-testid='sew-sensors-crud-input-sensorid'
                    onChange={ev => updateSensor({ sensorId: ev.target.value })}
                    value={sensor.sensorId}
                />
            </div>
            <div className='CRUDListAddField'>
                <span className='CRUDListAddFieldLabel'>Sensor Name</span>
                <input
                    className='CRUDListAddFieldValue'
                    type='text'
                    data-testid='sew-sensors-crud-input-name'
                    onChange={ev => updateSensor({ name: ev.target.value })}
                    value={sensor.name}
                />
            </div>
            <div className='CRUDListAddField'>
                <span className='CRUDListAddFieldLabel'>Sensor Type</span>
                <select
                    className='CRUDListAddFieldValue'
                    data-testid='sew-sensors-crud-select-type'
                    onChange={ev => updateSensor({ type: ev.target.value as SensorType })}
                    value={sensor.type}
                >
                    <option value='SWITCH'>SWITCH</option>
                    <option value='DCMOTOR'>DCMOTOR</option>
                    <option value='DISTANCE'>DISTANCE</option>
                </select>
            </div>
            <div className='CRUDListAddField'>
                <span className='CRUDListAddFieldLabel'>Sensor Color</span>
                <GithubPicker
                    triangle='hide'
                    colors={defaultColors}
                    className='CRUDListAddFieldValue'
                    color={sensor.color}
                    onChangeComplete={color => updateSensor({ color: color.hex })}
                />
            </div>
            <button
                data-testid='sew-sensors-crud-button-save'
                disabled={!isSensorInfoCompleted(sensor)}
                onClick={() => addSensor(sensor)}
                className={!isSensorInfoCompleted(sensor) ? 'CRUDListAddButtonDisabled' : 'CRUDListAddButton'}
            >
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
            <div className='CRUDListNoSensors'>
                <div>No Sensors found!</div>
            </div>
        );
    }
    return (
        <div className='CRUDListSensors'>
            {sensors.map((sensorInfo, index) => (
                <div
                    key={sensorInfo.sensorId}
                    data-testid={`sew-sensors-crud-list-${sensorInfo.sensorId}`}
                    className='CRUDListSensorsItem'
                    style={{ backgroundColor: sensorInfo.color }}
                >
                    <div className='CRUDListSensorsItemLabels'>
                        <div>{sensorInfo.name}</div>
                        <div>{sensorInfo.deviceId}</div>
                        <div>{sensorInfo.sensorId}</div>
                    </div>
                    <button
                        data-testid={`sew-sensors-crud-button-delete`}
                        onClick={() => deleteSensor(index)}
                        className='CRUDListSensorsItemButton'
                    >
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
        <div className='CRUDList'>
            <SewSensorsCRUDAdd addSensor={sensor => onChange([...sensors, sensor])} />
            <SewSensorsCRUDInfoList
                sensors={sensors}
                deleteSensor={(index: number) => onChange([...sensors.slice(0, index), ...sensors.slice(index + 1)])}
            />
        </div>
    );
};
