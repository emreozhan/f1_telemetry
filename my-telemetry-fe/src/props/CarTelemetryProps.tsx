import React from 'react';

export interface CarTelemetryProps {
    m_gear?: number;
    m_speed?: number;
    m_throttle?: number;
    m_brake?: number;
    m_drs?: boolean;
    m_engineRPM?: number;
    m_steer?: number;
    m_clutch?: any;
    m_revLightsPercent?: number;
    m_engineTemperature?: number;
    m_brakesTemperature?: number[];
    m_tyresSurfaceTemperature?: number[];
    m_tyresInnerTemperature?: number[];
}
