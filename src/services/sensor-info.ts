import { SensorId, SensorType } from './actionizer';

const validateSensorInfo = (sensorInfo: SensorInfo) => {
    if (!sensorInfo || typeof sensorInfo !== 'object') return false;
    if (typeof sensorInfo['deviceId'] !== 'string') return false;
    if (typeof sensorInfo['sensorId'] !== 'string') return false;
    if (typeof sensorInfo['type'] !== 'string') return false;
    if (typeof sensorInfo['name'] !== 'string') return false;
    return true;
};

export type SensorInfo = {
    deviceId: string;
    sensorId: SensorId;
    type: SensorType;
    name: string;
    color?: string;
};

export const SensorInfoRepository = {
    load: (): SensorInfo[] => {
        const strData = window.localStorage.getItem('sensor-info');
        if (!strData) return [];
        try {
            const repo = JSON.parse(strData);
            return repo;
        } catch (err) {
            console.log('Error parsing data', err);
            return [];
        }
    },
    save: (sensorsInfo: SensorInfo[]) => {
        if (!Array.isArray(sensorsInfo) || sensorsInfo.length < 1) return false;
        for (const sensorInfo of sensorsInfo) {
            if (!validateSensorInfo(sensorInfo)) return false;
        }
        window.localStorage.setItem('sensor-info', JSON.stringify(sensorsInfo));
        return true;
    }
};
