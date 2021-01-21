import * as React from 'react';
import { HashRouter as Router, Switch, Route, NavLink } from 'react-router-dom';
import { SensorInfo, SensorInfoRepository } from '../services/sensor-info';
import { SewSensorsList } from '../sew-sensors-list';
import { SewSensorsCRUD } from '../sew-sensors-crud';
import { SewCar } from '../sewcar';
import { SewTank } from '../sewtank';
import './styles.css';

function App() {
    const [sensorsInfo, setSensorsInfo] = React.useState(() => SensorInfoRepository.load());
    const saveSensorInfo = React.useCallback((sensors: SensorInfo[]) => {
        SensorInfoRepository.save(sensors);
        setSensorsInfo(sensors);
    }, []);
    return (
        <Router>
            <div className='App'>
                <div className='Title'>Alarm UI</div>
                <div className='Body'>
                    <Switch>
                        <Route path='/sewtank'>
                            <SewTank />
                        </Route>
                        <Route path='/sewcar'>
                            <SewCar />
                        </Route>
                        <Route path='/sensors'>
                            <SewSensorsCRUD sensors={sensorsInfo} onChange={saveSensorInfo} />
                        </Route>
                        <Route path='/'>
                            <SewSensorsList sensors={sensorsInfo} />
                        </Route>
                    </Switch>
                </div>
                <div className='Sections'>
                    <NavLink to='/' exact className={'TabSection'} activeClassName='TabSectionSelected'>
                        Buttons
                    </NavLink>
                    <NavLink to='/sensors' className='TabSection' activeClassName='TabSectionSelected'>
                        Sensors
                    </NavLink>
                    <NavLink to='/sewcar' className='TabSection' activeClassName='TabSectionSelected'>
                        SewCar
                    </NavLink>
                    <NavLink to='/sewtank' className='TabSection' activeClassName='TabSectionSelected'>
                        SewTank
                    </NavLink>
                </div>
            </div>
        </Router>
    );
}

export default App;
