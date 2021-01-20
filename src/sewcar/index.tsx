import * as React from 'react';
import { SewCarInfo, SewCarInfoRepository } from '../services/sensor-info';
import { createCommands } from './commands';
import './styles.css';

// Arrows
import IMG_UP from './images/up.png';

const sewCarInfoReducer = (state: SewCarInfo, action: Partial<SewCarInfo>) => ({ ...state, ...action });
const initialState: SewCarInfo = { deviceId: '', motorLeft: '', motorRight: '' };
const isSewCarInfoCompleted = (sensor: SewCarInfo) => {
    if (!sensor.deviceId || sensor.deviceId.length < 6) return false;
    if (!sensor.motorLeft || sensor.motorLeft.length < 8) return false;
    if (!sensor.motorRight || sensor.motorRight.length < 8) return false;
    return true;
};
type SewCarFormProps = {
    setSewCar: (sewCar: SewCarInfo) => void;
};
const SewCarForm: React.FC<SewCarFormProps> = ({ setSewCar }) => {
    const [sewCar, updateSewCar] = React.useReducer(sewCarInfoReducer, initialState);
    const saveSewCar = React.useCallback(
        (sewCar: SewCarInfo) => {
            SewCarInfoRepository.save(sewCar);
            setSewCar(sewCar);
        },
        [setSewCar]
    );
    return (
        <div className='SewCarContainer' data-testid='sewcar-form-container'>
            <div className='SewCarAddField'>
                <span className='SewCarAddFieldLabel'>Device Id</span>
                <input
                    className='SewCarAddFieldValue'
                    type='text'
                    data-testid='sewcar-form-input-deviceid'
                    onChange={ev => updateSewCar({ deviceId: ev.target.value })}
                    value={sewCar.deviceId}
                />
            </div>
            <div className='SewCarAddField'>
                <span className='SewCarAddFieldLabel'>Motor Left Id</span>
                <input
                    className='SewCarAddFieldValue'
                    type='text'
                    data-testid='sewcar-form-input-motor-left'
                    onChange={ev => updateSewCar({ motorLeft: ev.target.value })}
                    value={sewCar.motorLeft}
                />
            </div>
            <div className='SewCarAddField'>
                <span className='SewCarAddFieldLabel'>Motor Right Id</span>
                <input
                    className='SewCarAddFieldValue'
                    type='text'
                    data-testid='sewcar-form-input-motor-right'
                    onChange={ev => updateSewCar({ motorRight: ev.target.value })}
                    value={sewCar.motorRight}
                />
            </div>
            <button
                data-testid='sewcar-form-button-save'
                disabled={!isSewCarInfoCompleted(sewCar)}
                onClick={() => saveSewCar(sewCar)}
                className={!isSewCarInfoCompleted(sewCar) ? 'SewCarAddButtonDisabled' : 'SewCarAddButton'}
            >
                SAVE
            </button>
        </div>
    );
};

export type SewCarPadProps = {
    sewCar: SewCarInfo;
};
export const SewCarPad: React.FC<SewCarPadProps> = ({ sewCar }) => {
    const { stop, forward, backward, left, right, leftForward, rightForward, leftBackward, rightBackward } = React.useMemo(
        () => createCommands(sewCar),
        [sewCar]
    );
    const [power, setPower] = React.useState(200);
    const [pressed, setPressed] = React.useState('np');
    return (
        <div className='SewCarContainer' data-testid='sewcar-pad-container'>
            <div className='SewCarTitle'>SewCar GamePad</div>
            <div
                className='SewCarPad'
                onContextMenu={event => {
                    event.preventDefault();
                }}
                onMouseUp={() => {
                    stop();
                    setPressed('np');
                }}
                onTouchEnd={() => {
                    stop();
                    setPressed('np');
                }}
            >
                <div className='SewCarButtonsRow'>
                    <div
                        data-testid='sewcar-pad-button-upleft'
                        className={pressed === 'ul' ? 'SewCarActiveButton' : 'SewCarButton'}
                        onMouseDown={() => {
                            leftForward(power);
                            setPressed('ul');
                        }}
                        onTouchStart={() => {
                            leftForward(power);
                            setPressed('ul');
                        }}
                    >
                        <img src={IMG_UP} alt='forward' style={{ transform: 'rotate(-45deg)' }} />
                    </div>
                    <div
                        data-testid='sewcar-pad-button-up'
                        className={pressed === 'up' ? 'SewCarActiveButton' : 'SewCarButton'}
                        onMouseDown={() => {
                            forward(power);
                            setPressed('up');
                        }}
                        onTouchStart={() => {
                            forward(power);
                            setPressed('up');
                        }}
                    >
                        <img src={IMG_UP} alt='forward' />
                    </div>
                    <div
                        data-testid='sewcar-pad-button-upright'
                        className={pressed === 'ur' ? 'SewCarActiveButton' : 'SewCarButton'}
                        onMouseDown={() => {
                            rightForward(power);
                            setPressed('ur');
                        }}
                        onTouchStart={() => {
                            rightForward(power);
                            setPressed('ur');
                        }}
                    >
                        <img src={IMG_UP} alt='forward' style={{ transform: 'rotate(45deg)' }} />
                    </div>
                </div>
                <div className='SewCarButtonsRow'>
                    <div
                        data-testid='sewcar-pad-button-left'
                        className={pressed === 'lf' ? 'SewCarActiveButton' : 'SewCarButton'}
                        onMouseDown={() => {
                            left(power);
                            setPressed('lf');
                        }}
                        onTouchStart={() => {
                            left(power);
                            setPressed('lf');
                        }}
                    >
                        <img src={IMG_UP} alt='forward' style={{ transform: 'rotate(-90deg)' }} />
                    </div>
                    <div className='SewCarPowerValue'>{power}</div>
                    <div
                        data-testid='sewcar-pad-button-right'
                        className={pressed === 'rg' ? 'SewCarActiveButton' : 'SewCarButton'}
                        onMouseDown={() => {
                            right(power);
                            setPressed('rg');
                        }}
                        onTouchStart={() => {
                            right(power);
                            setPressed('rg');
                        }}
                    >
                        <img src={IMG_UP} alt='forward' style={{ transform: 'rotate(90deg)' }} />
                    </div>
                </div>
                <div className='SewCarButtonsRow'>
                    <div
                        data-testid='sewcar-pad-button-downleft'
                        className={pressed === 'dl' ? 'SewCarActiveButton' : 'SewCarButton'}
                        onMouseDown={() => {
                            leftBackward(power);
                            setPressed('dl');
                        }}
                        onTouchStart={() => {
                            leftBackward(power);
                            setPressed('dl');
                        }}
                    >
                        <img src={IMG_UP} alt='forward' style={{ transform: 'rotate(-135deg)' }} />
                    </div>
                    <div
                        data-testid='sewcar-pad-button-down'
                        className={pressed === 'dw' ? 'SewCarActiveButton' : 'SewCarButton'}
                        onMouseDown={() => {
                            backward(power);
                            setPressed('dw');
                        }}
                        onTouchStart={() => {
                            backward(power);
                            setPressed('dw');
                        }}
                    >
                        <img src={IMG_UP} alt='forward' style={{ transform: 'rotate(180deg)' }} />
                    </div>
                    <div
                        data-testid='sewcar-pad-button-downright'
                        className={pressed === 'dr' ? 'SewCarActiveButton' : 'SewCarButton'}
                        onMouseDown={() => {
                            rightBackward(power);
                            setPressed('dr');
                        }}
                        onTouchStart={() => {
                            rightBackward(power);
                            setPressed('dr');
                        }}
                    >
                        <img src={IMG_UP} alt='forward' style={{ transform: 'rotate(135deg)' }} />
                    </div>
                </div>
            </div>
            <div className='SewCarPower'>
                <input
                    style={{ width: '100%' }}
                    type='range'
                    min={0}
                    max={255}
                    step={1}
                    value={power}
                    onChange={ev => setPower(ev.target.valueAsNumber)}
                    data-testid='sewcar-pad-input-power'
                />
            </div>
        </div>
    );
};

export const SewCar: React.FC<{}> = () => {
    const [sewCarInfo, setSewCarInfo] = React.useState(() => SewCarInfoRepository.load());
    if (!sewCarInfo) {
        return <SewCarForm setSewCar={setSewCarInfo} />;
    }
    return <SewCarPad sewCar={sewCarInfo} />;
};
