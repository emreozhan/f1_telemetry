import React from 'react';
import './App.css';
import Gauge from 'react-svg-gauge';
import { CarTelemetryProps } from './props/CarTelemetryProps';
import { Col, Container, Row, Badge } from 'react-bootstrap';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Image from 'react-bootstrap/Image';
import f1CarLogo from './resources/f1.png';
import steerLogo from './resources/steer.png';
import './custom.css';

const maxRpm = 12000;

const CarTelemetry: React.FC<CarTelemetryProps> = (props) => {
    const {
        m_gear = 0,
        m_speed = 0,
        m_throttle = 0,
        m_brake = 0,
        m_drs,
        m_engineRPM = 0,
        m_steer = 0,
        m_clutch = 0,
        m_revLightsPercent = 0,
        m_engineTemperature = 0,
        m_brakesTemperature = [1, 2, 3, 4],
        m_tyresSurfaceTemperature = [1, 2, 3, 4],
        m_tyresInnerTemperature = [1, 2, 3, 4]
    } = props;

    const calculateRpmRatio = (rpm?: number) => {
        const rpmPercentage = (m_engineRPM / maxRpm) * 100;

        const firstVal = rpmPercentage > 35 ? 35 : rpmPercentage;
        const secondVal = rpmPercentage - 35 >= 35 ? 35 : Math.max(rpmPercentage - 35, 0);
        const thirdVal = rpmPercentage > 70 ? rpmPercentage % 70 : 0;

        return [firstVal, secondVal, thirdVal];
    };
    return (
        <Container>
            <Row>
                <Row className="mb-4">
                    <Col>
                        <ProgressBar>
                            <ProgressBar variant="success" now={calculateRpmRatio()[0]} key={1} />
                            <ProgressBar striped variant="danger" now={calculateRpmRatio()[1]} key={2} />
                            <ProgressBar variant="warning" now={calculateRpmRatio()[2]} key={3} />
                        </ProgressBar>
                    </Col>
                </Row>
                <Col xs={6}>
                    <Col>
                        <Badge bg={'primary'}>{'Gear: ' + m_gear} </Badge>
                        <Gauge label="" color="green" value={m_speed} min={0} max={350} width={450} />
                        <Badge bg={m_drs ? 'success' : 'secondary'} className="mb-4">
                            DRS
                        </Badge>
                    </Col>
                    <Col>
                        <ProgressBar variant="success" now={Math.floor(m_throttle * 100)} min={0} max={100} className="mt-2" />
                    </Col>
                    <Col>
                        <ProgressBar variant="danger" now={Math.floor(m_brake * 100)} min={0} max={100} className="mt-2" />
                    </Col>
                </Col>
                <Col className="mt-4" xs={6}>
                    <div className="container">
                        <Image width={'70%'} src={f1CarLogo}></Image>
                        <div className="top-left">
                            <div>{m_tyresInnerTemperature[3]} °C</div>
                            <div>{m_tyresSurfaceTemperature[3]} °C</div>
                            <div>{m_brakesTemperature[3]} °C</div>
                        </div>
                        <div className="top-right">
                            <div>{m_tyresInnerTemperature[2]} °C</div>
                            <div>{m_tyresSurfaceTemperature[2]} °C</div>
                            <div>{m_brakesTemperature[2]} °C</div>
                        </div>
                        <div className="bottom-right">
                            <div>{m_tyresInnerTemperature[1]} °C</div>
                            <div>{m_tyresSurfaceTemperature[1]} °C</div>
                            <div>{m_brakesTemperature[1]} °C</div>
                        </div>
                        <div className="bottom-left">
                            <div>{m_tyresInnerTemperature[0]} °C</div>
                            <div>{m_tyresSurfaceTemperature[0]} °C</div>
                            <div>{m_brakesTemperature[0]} °C</div>
                        </div>
                        <div className="centered">
                            <div>RPM: {m_engineRPM}</div>
                            <div>Temp: {m_engineTemperature} °C</div>
                        </div>
                    </div>
                    <Image width={'40%'} style={{ transform: `rotate(${m_steer * 90}deg)` }} src={steerLogo}></Image>
                </Col>
            </Row>
        </Container>
    );
};

export default CarTelemetry;
