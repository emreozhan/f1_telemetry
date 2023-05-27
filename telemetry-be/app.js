var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dgram = require('dgram');
const cors = require('cors');

let messages = [];

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var messagesRouter = require('./routes/messages')(messages);

var app = express();

// view engine setup
let corsOptions = {
    origin: ['http://localhost:3000', 'http://127.0.0.1', 'http://192.168.2.228:3000', 'http://192.168.2.100:3000']
};
app.use(cors(corsOptions));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/messages', messagesRouter);

//catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const udpServer = dgram.createSocket('udp4');
const PORT = 20777;

udpServer.on('message', (message, remote) => {
    var buffer = Buffer.from(message); // udpMessage, UDP to buffer

    // Paket başlığını (header)
    var packetHeader = {
        m_packetFormat: buffer.readUInt16LE(0),
        m_gameMajorVersion: buffer.readUInt8(2),
        m_gameMinorVersion: buffer.readUInt8(3),
        m_packetVersion: buffer.readUInt8(4),
        m_packetId: buffer.readUInt8(5),
        m_sessionUID: buffer.readBigUInt64LE(6),
        m_sessionTime: buffer.readFloatLE(14),
        m_frameIdentifier: buffer.readUInt32LE(18),
        m_playerCarIndex: buffer.readUInt8(22),
        m_secondaryPlayerCarIndex: buffer.readUInt8(23)
    };

    if (packetHeader.m_packetId == 0) {
        // CarMotionData
        var carMotionData = [];
        var offset = 24; // CarMotionData'nın start ofset

        for (var i = 0; i < 22; i++) {
            var carData = {
                m_worldPositionX: buffer.readFloatLE(offset),
                m_worldPositionY: buffer.readFloatLE(offset + 4),
                m_worldPositionZ: buffer.readFloatLE(offset + 8),
                m_worldVelocityX: buffer.readFloatLE(offset + 12),
                m_worldVelocityY: buffer.readFloatLE(offset + 16),
                m_worldVelocityZ: buffer.readFloatLE(offset + 20),
                m_worldForwardDirX: buffer.readInt16LE(offset + 24),
                m_worldForwardDirY: buffer.readInt16LE(offset + 26),
                m_worldForwardDirZ: buffer.readInt16LE(offset + 28),
                m_worldRightDirX: buffer.readInt16LE(offset + 30),
                m_worldRightDirY: buffer.readInt16LE(offset + 32),
                m_worldRightDirZ: buffer.readInt16LE(offset + 34),
                m_gForceLateral: buffer.readFloatLE(offset + 36),
                m_gForceLongitudinal: buffer.readFloatLE(offset + 40),
                m_gForceVertical: buffer.readFloatLE(offset + 44),
                m_yaw: buffer.readFloatLE(offset + 48),
                m_pitch: buffer.readFloatLE(offset + 52),
                m_roll: buffer.readFloatLE(offset + 56)
            };

            carMotionData.push(carData);
            offset += 60; // CarMotionData size 60 byte
        }

        // Ekstra oyuncu aracı verilerini ayrıştırın
        var suspensionPosition = [];
        var suspensionVelocity = [];
        var suspensionAcceleration = [];
        var wheelSpeed = [];
        var wheelSlip = [];

        for (var i = 0; i < 4; i++) {
            suspensionPosition.push(buffer.readFloatLE(offset));
            suspensionVelocity.push(buffer.readFloatLE(offset + 4));
            suspensionAcceleration.push(buffer.readFloatLE(offset + 8));
            wheelSpeed.push(buffer.readFloatLE(offset + 12));
            wheelSlip.push(buffer.readFloatLE(offset + 16));
            offset += 20; // each tyre data 20 byte
        }

        var localVelocityX = buffer.readFloatLE(offset);
        var localVelocityY = buffer.readFloatLE(offset + 4);
        var localVelocityZ = buffer.readFloatLE(offset + 8);
        var angularVelocityX = buffer.readFloatLE(offset + 12);
        var angularVelocityY = buffer.readFloatLE(offset + 16);
        var angularVelocityZ = buffer.readFloatLE(offset + 20);
        var angularAccelerationX = buffer.readFloatLE(offset + 24);
        var angularAccelerationY = buffer.readFloatLE(offset + 28);
        var angularAccelerationZ = buffer.readFloatLE(offset + 32);
        var frontWheelsAngle = buffer.readFloatLE(offset + 36);

        // PacketMotionData
        var packetMotionData = {
            m_header: packetHeader,
            m_carMotionData: carMotionData,
            m_suspensionPosition: suspensionPosition,
            m_suspensionVelocity: suspensionVelocity,
            m_suspensionAcceleration: suspensionAcceleration,
            m_wheelSpeed: wheelSpeed,
            m_wheelSlip: wheelSlip,
            m_localVelocityX: localVelocityX,
            m_localVelocityY: localVelocityY,
            m_localVelocityZ: localVelocityZ,
            m_angularVelocityX: angularVelocityX,
            m_angularVelocityY: angularVelocityY,
            m_angularVelocityZ: angularVelocityZ,
            m_angularAccelerationX: angularAccelerationX,
            m_angularAccelerationY: angularAccelerationY,
            m_angularAccelerationZ: angularAccelerationZ,
            m_frontWheelsAngle: frontWheelsAngle
        };
    }

    if (packetHeader.m_packetId == 6) {
        var carTelemetryData = [];
        var offset = 24; // CarTelemetryData start ofset
        for (var i = 0; i < 22; i++) {
            var carData = {
                m_speed: buffer.readUInt16LE(offset),
                m_throttle: buffer.readFloatLE(offset + 2),
                m_steer: buffer.readFloatLE(offset + 6),
                m_brake: buffer.readFloatLE(offset + 10),
                m_clutch: buffer.readUInt8(offset + 14),
                m_gear: buffer.readInt8(offset + 15),
                m_engineRPM: buffer.readUInt16LE(offset + 16),
                m_drs: buffer.readUInt8(offset + 18),
                m_revLightsPercent: buffer.readUInt8(offset + 19),
                m_revLightsBitValue: buffer.readUInt16LE(offset + 20),
                m_brakesTemperature: [
                    buffer.readUInt16LE(offset + 22),
                    buffer.readUInt16LE(offset + 24),
                    buffer.readUInt16LE(offset + 26),
                    buffer.readUInt16LE(offset + 28)
                ],
                m_tyresSurfaceTemperature: [
                    buffer.readUInt8(offset + 30),
                    buffer.readUInt8(offset + 31),
                    buffer.readUInt8(offset + 32),
                    buffer.readUInt8(offset + 33)
                ],
                m_tyresInnerTemperature: [
                    buffer.readUInt8(offset + 34),
                    buffer.readUInt8(offset + 35),
                    buffer.readUInt8(offset + 36),
                    buffer.readUInt8(offset + 37)
                ],
                m_engineTemperature: buffer.readUInt16LE(offset + 38),
                m_tyresPressure: [
                    buffer.readFloatLE(offset + 40),
                    buffer.readFloatLE(offset + 44),
                    buffer.readFloatLE(offset + 48),
                    buffer.readFloatLE(offset + 52)
                ],
                m_surfaceType: [
                    buffer.readUInt8(offset + 56),
                    buffer.readUInt8(offset + 57),
                    buffer.readUInt8(offset + 58),
                    buffer.readUInt8(offset + 59)
                ]
            };

            carTelemetryData.push(carData);
            offset += 60; // CarTelemetryData'nın size 60 byte
        }

        var packetCarTelemetryData = {
            //m_header: packetHeader, TODO BigInt Parse
            CarTelemetry: carTelemetryData[0],
            m_mfdPanelIndex: buffer.readUInt8(offset),
            m_mfdPanelIndexSecondaryPlayer: buffer.readUInt8(offset + 1),
            m_suggestedGear: buffer.readInt8(offset + 2)
        };

        messages.push({
            message: packetCarTelemetryData
        });

        messages[0] = {
            message: packetCarTelemetryData
        };
    }
});

udpServer.on('listening', () => {
    const address = udpServer.address();
    console.log(`UDP server listening on ${address.address}:${address.port}`);
});

udpServer.bind(PORT);

module.exports = app;
