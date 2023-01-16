import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls';
import SphereEnvironment from './sphereEnvironment';

import './style.css';
import WaveEnvironment from './waveEnvironment';

const sphere = new SphereEnvironment(300, 300);
const wave = new WaveEnvironment(sphere.arrowDirection);

document.body.appendChild(sphere.domElement);
document.body.appendChild(wave.domElement);

sphere.initControls();
new ArcballControls(wave.camera, wave.domElement);
