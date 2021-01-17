import { screen, render, within } from '@testing-library/react';
import user from '@testing-library/user-event';
import { SensorInfo } from '../services/sensor-info';
import { SewSensorsCRUD } from './';

test('SewSensorsCRUD should show an empty list when no sensors', async () => {
    render(<SewSensorsCRUD onChange={() => {}} />);
    screen.getByText(/No sensors found!/i);

    // Create new Sensor panel
    screen.getByTestId('sew-sensors-crud-input-deviceid');
    screen.getByTestId('sew-sensors-crud-input-sensorid');
    screen.getByTestId('sew-sensors-crud-input-name');
    screen.getByTestId('sew-sensors-crud-select-type');
    // screen.getByTestId('sew-sensors-crud-input-color');
    const saveButton = screen.getByTestId('sew-sensors-crud-button-save');
    expect(saveButton).toBeDisabled();
});

test('SewSensorsCRUD should add a new Sensor to list', async () => {
    const newSensorInfo: SensorInfo = {
        deviceId: 'deviceId',
        sensorId: 'sensorId',
        type: 'DISTANCE',
        name: 'Sensor 1',
        color: '#DB3E00'
    };
    const updateSensorList = jest.fn();
    render(<SewSensorsCRUD sensors={[]} onChange={updateSensorList} />);
    screen.getByText(/No sensors found!/i);

    // Create new Sensor panel
    const device = screen.getByTestId('sew-sensors-crud-input-deviceid');
    const id = screen.getByTestId('sew-sensors-crud-input-sensorid');
    const name = screen.getByTestId('sew-sensors-crud-input-name');
    const type = screen.getByTestId('sew-sensors-crud-select-type');
    // const color = screen.getByTestId('sew-sensors-crud-input-color') as HTMLInputElement;
    const saveButton = screen.getByTestId('sew-sensors-crud-button-save');
    expect(saveButton).toBeDisabled();

    // Add values
    user.type(device, newSensorInfo.deviceId);
    user.type(id, newSensorInfo.sensorId);
    user.type(name, newSensorInfo.name);
    user.selectOptions(type, newSensorInfo.type);
    // color.setSelectionRange(0, 8);
    // user.type(color, newSensorInfo.color!, { initialSelectionStart: 0, initialSelectionEnd: 8 });

    expect(saveButton).not.toBeDisabled();
    user.click(saveButton);
    expect(updateSensorList).toHaveBeenCalledTimes(1);
    expect(updateSensorList).toHaveBeenNthCalledWith(1, [newSensorInfo]);
});

test('SewSensorsList should show 3 SewSwitchButtons from sensors list and delete Sensor 2', async () => {
    const sensors: SensorInfo[] = [
        { deviceId: 'deviceid', sensorId: '123456789', name: 'Sensor 1', type: 'SWITCH', color: '#ABC' },
        { deviceId: 'deviceid', sensorId: '123456788', name: 'Sensor 2', type: 'SWITCH', color: '#AAA' },
        { deviceId: 'deviceid', sensorId: '123456787', name: 'Sensor 3', type: 'SWITCH', color: '#0F5' }
    ];
    const updateSensorList = jest.fn();
    render(<SewSensorsCRUD sensors={sensors} onChange={updateSensorList} />);

    const sensorsViews = screen.getAllByTestId(/sew-sensors-crud-list-/i);
    expect(sensorsViews.length).toBe(3);

    // Delete Sensor 2
    const svSensor2 = within(sensorsViews[1]);
    user.click(svSensor2.getByTestId('sew-sensors-crud-button-delete'));
    expect(updateSensorList).toHaveBeenCalledTimes(1);
    expect(updateSensorList).toHaveBeenNthCalledWith(1, [sensors[0], sensors[2]]);
});
