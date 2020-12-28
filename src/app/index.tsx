import * as React from 'react';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { SensorInfo, SensorInfoRepository } from '../services/sensor-info';
import { SewSensorsList } from '../sew-sensors-list';
import { SewSensorsCRUD } from '../sew-sensors-crud';
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
                <div>
                    Alarm UI
                    <div>
                        <Link to='/'>Buttons</Link>
                        <Link to='/sensors'>Sensors</Link>
                    </div>
                </div>
                <Switch>
                    <Route path='/sensors'>
                        <SewSensorsCRUD sensors={sensorsInfo} onChange={saveSensorInfo} />
                    </Route>
                    <Route path='/'>
                        <SewSensorsList sensors={sensorsInfo} />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
