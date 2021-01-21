import * as React from 'react';
import Nouislider from 'nouislider-react';
import 'nouislider/distribute/nouislider.css';
import { SewCarInfoRepository } from '../services/sensor-info';
import './styles.css';

export const SewTank: React.FC<{}> = () => {
    const sewCarInfo = React.useMemo(() => SewCarInfoRepository.load(), []);
    const [powerMotors, setPowerMotors] = React.useState([0, 0]);
    const sendActions = React.useCallback(powerMotors => {
        console.log('Power Motors', powerMotors);
        setPowerMotors(powerMotors);
    }, []);
    if (!sewCarInfo)
        return (
            <div data-testid='sewtank-container' className='SewTankContainer'>
                No configuration found!, please go to SewCar to configure it!
            </div>
        );
    return (
        <div data-testid='sewtank-container' className='SewTankContainer'>
            <div className='SewTankPower'>
                <Nouislider
                    data-testid='sewtank-motor-left-input'
                    orientation='vertical'
                    start={[powerMotors[0]]}
                    connect={[true, false]}
                    range={{ min: -255, max: 255 }}
                    style={{ width: 100, height: 300 }}
                    onUpdate={console.log}
                    onChange={console.log}
                    onSlide={(...args) => console.log('Slide', args)}
                    direction='rtl'
                />
            </div>
            <div className='SewTankPower1'>
                <Nouislider
                    data-testid='sewtank-motor-right-input'
                    orientation='vertical'
                    start={[powerMotors[1]]}
                    range={{ min: -255, max: 255 }}
                    connect={[true, false]}
                    style={{ width: 100, height: 300 }}
                    onUpdate={console.log}
                    onChange={console.log}
                    onSlide={(...args) => console.log('Slide', args)}
                    direction='rtl'
                />
            </div>
        </div>
    );
};
