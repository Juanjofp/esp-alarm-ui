import { SensorInfoRepository, SensorInfo, SewCarInfoRepository, SewCarInfo } from './sensor-info';

beforeEach(() => {
    window.localStorage.clear();
});

test('SensorInfoRepository.load should return all sensors from local storage', () => {
    const savedData = [{ deviceId: 'deviceid', sensorId: 'mysensorid', type: 'SWITCH', name: 'Juanjo Rojo' }];
    window.localStorage.setItem('sensor-info', JSON.stringify(savedData));

    const sensorInfoData = SensorInfoRepository.load();

    expect(sensorInfoData).toEqual(savedData);
});

test('SensorInfoRepository.load should return empty array from empty local storage', () => {
    const sensorInfoData = SensorInfoRepository.load();

    expect(sensorInfoData).toEqual([]);
});

test('SensorInfoRepository.load should return empty array from invalid local storage', () => {
    const fakeConsole = jest.spyOn(console, 'log').mockImplementation(() => {});
    window.localStorage.setItem('sensor-info', 'invalid-data');

    const sensorInfoData = SensorInfoRepository.load();

    expect(sensorInfoData).toEqual([]);
    expect(fakeConsole).toHaveBeenCalledTimes(1);
    fakeConsole.mockRestore();
});

test('SensorInfoRepository.save should return false when invalid data', () => {
    const saved = SensorInfoRepository.save(({} as unknown) as SensorInfo[]);

    expect(saved).toBe(false);
    expect(SensorInfoRepository.load()).toEqual([]);
});

test('SensorInfoRepository.save should return false when empty array', () => {
    const saved = SensorInfoRepository.save([]);

    expect(saved).toBe(false);
    expect(SensorInfoRepository.load()).toEqual([]);
});

test('SensorInfoRepository.save should return false when invalid array', () => {
    let saved = SensorInfoRepository.save([({ sensorId: 'sensorId' } as unknown) as SensorInfo]);
    expect(saved).toBe(false);
    expect(SensorInfoRepository.load()).toEqual([]);

    saved = SensorInfoRepository.save([({ sensorId: 'sensorId' } as unknown) as SensorInfo]);
    expect(saved).toBe(false);
    expect(SensorInfoRepository.load()).toEqual([]);

    saved = SensorInfoRepository.save([({ deviceId: 'deviceid' } as unknown) as SensorInfo]);
    expect(saved).toBe(false);
    expect(SensorInfoRepository.load()).toEqual([]);

    saved = SensorInfoRepository.save([({ deviceId: 'deviceid', sensorId: 'sensorid' } as unknown) as SensorInfo]);
    expect(saved).toBe(false);
    expect(SensorInfoRepository.load()).toEqual([]);

    saved = SensorInfoRepository.save([({ deviceId: 'deviceid', sensorId: 'sensorid', type: 'SWITCH' } as unknown) as SensorInfo]);
    expect(saved).toBe(false);
    expect(SensorInfoRepository.load()).toEqual([]);

    saved = SensorInfoRepository.save([(45 as unknown) as SensorInfo]);
    expect(saved).toBe(false);
    expect(SensorInfoRepository.load()).toEqual([]);

    saved = SensorInfoRepository.save([({ sensorId: 25 } as unknown) as SensorInfo]);
    expect(saved).toBe(false);
    expect(SensorInfoRepository.load()).toEqual([]);
});

test('SensorInfoRepository.save should return true when valid array', () => {
    const sensorsInfo: SensorInfo[] = [
        { deviceId: 'deviceid', sensorId: 'sensorId', type: 'SWITCH', name: 'Juanjo Rojo' },
        { deviceId: 'deviceid', sensorId: 'sensorId', type: 'SWITCH', name: 'Juanjo Azul' }
    ];
    const saved = SensorInfoRepository.save(sensorsInfo);

    expect(saved).toBe(true);
    expect(SensorInfoRepository.load()).toEqual(sensorsInfo);
});

test('SewCarInfoRepository.load should return null when no sewcar available', () => {
    expect(SewCarInfoRepository.load()).toBe(null);
});

test('SewCarInfoRepository.load should return SewCar info from local storage', () => {
    const savedData: SewCarInfo = { deviceId: 'deviceid', motorLeft: 'motor1', motorRight: 'motor2' };
    window.localStorage.setItem('sewcar-info', JSON.stringify(savedData));

    const sewCarInfo = SewCarInfoRepository.load();
    expect(sewCarInfo).toEqual(savedData);
});

test('SewCarInfoRepository.load should return null from invalid local storage', () => {
    const fakeConsole = jest.spyOn(console, 'log').mockImplementation(() => {});
    window.localStorage.setItem('sewcar-info', 'invalid-data');

    const sewCarInfo = SewCarInfoRepository.load();

    expect(sewCarInfo).toEqual(null);
    expect(fakeConsole).toHaveBeenCalledTimes(1);
    fakeConsole.mockRestore();
});

test('SewCarInfoRepository.save should return false when empty object', () => {
    const saved = SewCarInfoRepository.save(({} as unknown) as SewCarInfo);

    expect(saved).toBe(false);
    expect(SewCarInfoRepository.load()).toEqual(null);
});

test('SewCarInfoRepository.save should return false when null', () => {
    const saved = SewCarInfoRepository.save((null as unknown) as SewCarInfo);

    expect(saved).toBe(false);
    expect(SewCarInfoRepository.load()).toEqual(null);
});

test('SewCarInfoRepository.save should return false when invalid object', () => {
    let saved = SewCarInfoRepository.save({ deviceId: 'deviceid' } as SewCarInfo);

    expect(saved).toBe(false);
    expect(SewCarInfoRepository.load()).toEqual(null);

    saved = SewCarInfoRepository.save({ deviceId: 'deviceid', motorLeft: 'motorleftid' } as SewCarInfo);

    expect(saved).toBe(false);
    expect(SewCarInfoRepository.load()).toEqual(null);

    saved = SewCarInfoRepository.save({ motorLeft: 'motorleftid', motorRight: 'motorrightid' } as SewCarInfo);

    expect(saved).toBe(false);
    expect(SewCarInfoRepository.load()).toEqual(null);

    saved = SewCarInfoRepository.save({ deviceId: 'deviceid', motorRight: 'motorrightid' } as SewCarInfo);

    expect(saved).toBe(false);
    expect(SewCarInfoRepository.load()).toEqual(null);
});

test('SewCarInfoRepository.save should return true when valid array', () => {
    const saved = SewCarInfoRepository.save({ deviceId: 'deviceid', motorLeft: 'motorleftid', motorRight: 'motorrightid' });

    expect(saved).toBe(true);
    expect(SewCarInfoRepository.load()).toEqual({ deviceId: 'deviceid', motorLeft: 'motorleftid', motorRight: 'motorrightid' });
});

test('SewCarInfoRepository.delete should return true when delete info', () => {
    const savedData: SewCarInfo = { deviceId: 'deviceid', motorLeft: 'motor1', motorRight: 'motor2' };
    window.localStorage.setItem('sewcar-info', JSON.stringify(savedData));

    SewCarInfoRepository.delete();

    expect(SewCarInfoRepository.load()).toEqual(null);
});
