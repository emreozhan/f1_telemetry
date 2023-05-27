<h1 align="center">Hi 👋, I'm Emre</h1>
<h3 align="center">I develop tiny Racing telemetry app for 'F1 2022' game </h3>

<h3 align="left">Setup:</h3>
<p align="left">
    Open Telemetry settings broadcast mode in the game
</p>
<img src="https://github.com/emreozhan/f1_telemetry/blob/master/my-telemetry-fe/src/gameSettings.png?raw=true" alt="GameSetting" width="100" height="100"/> 


Start Backend app
```bash
cd telemetry-be
yarn run start
```


Check be local ip in App.tsx file
```bash
const response = await axios.get('http://192.168.2.100:3500/messages');
```

Start FE app, you can reach ui on your local network localhost:3000  or http://192.168.2.100:3000/ 
```bash
cd my-telemetry-fe
yarn run start
```

<img src="https://github.com/emreozhan/f1_telemetry/blob/master/my-telemetry-fe/src/telemetryV1.png?raw=true" alt="Dashboard" width="100" height="100"/> 


<h3 align="left">Languages and Tools:</h3>
<p align="left"> <a href="https://getbootstrap.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/bootstrap/bootstrap-plain-wordmark.svg" alt="bootstrap" width="40" height="40"/> </a> <a href="https://expressjs.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/> </a> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> </a> <a href="https://reactjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/> </a> <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="40" height="40"/> </a> </p>