import { SensorInfoRepository, SensorInfo } from './sensor-info';

beforeEach(() => {
    window.localStorage.clear();
});

test('SensorInfo.load should return all sensors from local storage', () => {
    const savedData = [{ deviceId: 'deviceid', sensorId: 'mysensorid', type: 'SWITCH', name: 'Juanjo Rojo' }];
    window.localStorage.setItem('sensor-info', JSON.stringify(savedData));

    const sensorInfoData = SensorInfoRepository.load();

    expect(sensorInfoData).toEqual(savedData);
});

test('SensorInfo.load should return empty array from empty local storage', () => {
    const sensorInfoData = SensorInfoRepository.load();

    expect(sensorInfoData).toEqual([]);
});

test('SensorInfo.load should return empty array from invalid local storage', () => {
    const fakeConsole = jest.spyOn(console, 'log').mockImplementation(() => {});
    window.localStorage.setItem('sensor-info', 'invalid-data');

    const sensorInfoData = SensorInfoRepository.load();

    expect(sensorInfoData).toEqual([]);
    expect(fakeConsole).toHaveBeenCalledTimes(1);
    fakeConsole.mockRestore();
});

test('SensorInfo.save should return false when invalid data', () => {
    const saved = SensorInfoRepository.save(({} as unknown) as SensorInfo[]);

    expect(saved).toBe(false);
    expect(SensorInfoRepository.load()).toEqual([]);
});

test('SensorInfo.save should return false when empty array', () => {
    const saved = SensorInfoRepository.save([]);

    expect(saved).toBe(false);
    expect(SensorInfoRepository.load()).toEqual([]);
});

test('SensorInfo.save should return false when invalid array', () => {
    let saved = SensorInfoRepository.save([({ sensorId: 'sensorId' } as unknown) as SensorInfo]);

    expect(saved).toBe(false);
    expect(SensorInfoRepository.load()).toEqual([]);

    saved = SensorInfoRepository.save([({ sensorId: 'sensorId', type: 'SWITCH' } as unknown) as SensorInfo]);

    expect(saved).toBe(false);
    expect(SensorInfoRepository.load()).toEqual([]);

    saved = SensorInfoRepository.save([(45 as unknown) as SensorInfo]);

    expect(saved).toBe(false);
    expect(SensorInfoRepository.load()).toEqual([]);

    saved = SensorInfoRepository.save([({ sensorId: 25 } as unknown) as SensorInfo]);

    expect(saved).toBe(false);
    expect(SensorInfoRepository.load()).toEqual([]);
});

test('SensorInfo.save should return true when valid array', () => {
    const sensorsInfo: SensorInfo[] = [
        { deviceId: 'deviceid', sensorId: 'sensorId', type: 'SWITCH', name: 'Juanjo Rojo' },
        { deviceId: 'deviceid', sensorId: 'sensorId', type: 'SWITCH', name: 'Juanjo Azul' }
    ];
    const saved = SensorInfoRepository.save(sensorsInfo);

    expect(saved).toBe(true);
    expect(SensorInfoRepository.load()).toEqual(sensorsInfo);
});
