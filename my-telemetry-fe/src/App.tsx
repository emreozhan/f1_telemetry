import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import CarTelemetry from './car-telemetry';
import { CarTelemetryProps } from './props/CarTelemetryProps';
import 'bootstrap/dist/css/bootstrap.css';
import { ToggleButton } from 'react-bootstrap';

function App() {
    const [carTelemetryData, setCarTelemetryData] = useState<CarTelemetryProps>();
    const [pause, setPause] = useState(false);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!pause) {
                try {
                    const response = await axios.get('http://192.168.2.100:3500/messages');
                    if (response.data.CarTelemetry) {
                        setCarTelemetryData(response.data.CarTelemetry);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        };

        const interval = setInterval(fetchMessages, 100);

        return () => clearInterval(interval);
    }, [pause]);

    return (
        <div className="App">
            <header className="App-header">
                <ToggleButton
                    className="ml-0 mb-2"
                    id="toggle-check"
                    type="checkbox"
                    variant="outline-warning"
                    checked={pause}
                    value="1"
                    onChange={(e) => setPause(!pause)}
                >
                    {pause ? 'Paused' : 'Pause'}
                </ToggleButton>

                <CarTelemetry {...carTelemetryData}></CarTelemetry>
            </header>
        </div>
    );
}

export default App;
