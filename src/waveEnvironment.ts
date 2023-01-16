import { Complex, complex, multiply } from 'mathjs';
import { AmbientLight, AxesHelper, Camera, FogExp2, HemisphereLight, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import Wave from './wave'
import { blochRotX, blochRotY, column } from './math';

const RIGHT = new Vector3(1, 0, 0);
const UP = new Vector3(0, 1, 0);
const FORWARD = new Vector3(0, 0, 1);

const groundVector = new Vector3();

export default class WaveEnvironment {
    renderer: WebGLRenderer;
    camera: Camera;
    wave = new Wave();

    get domElement() {
        return this.renderer.domElement;
    }

    constructor(poincareDirection: Vector3) {
        const scene = new Scene();
        this.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
        this.camera.position.x = -1.5;
        this.camera.position.y = 1.5;
        this.camera.position.z = 2;

        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight - 1);

        const mainLight = new HemisphereLight(0xffffbb, 0x080820, 1);
        const ambient = new AmbientLight(0x404040);

        scene.fog = new FogExp2(0, 0.2);
        scene.add(mainLight);
        scene.add(ambient);
        scene.add(this.wave);
        scene.add(new AxesHelper(1));

        const initialPolarization = column(complex(1, 0), complex(0, 0));

        this.renderer.setAnimationLoop(time => {
            groundVector.copy(poincareDirection).projectOnPlane(UP);
            let phi = FORWARD.angleTo(groundVector);
            if (RIGHT.dot(groundVector) < 0) {
                phi = -phi;
            }
            let theta = UP.angleTo(poincareDirection);
            if (groundVector.dot(poincareDirection) < 0) {
                theta = -theta;
            }

            const rotation = multiply(
                blochRotY(phi),
                blochRotX(theta),
            );

            // This is just to make it look a bit prettier.
            // Ultimately there's not a ton we can do about it though.
            const phaseAdjustment = phi / 2;

            this.wave.phase = time / 5_000 - phaseAdjustment;
            this.wave.polarization = multiply(rotation, initialPolarization) as Complex[][];

            this.renderer.render(scene, this.camera);
        });

        this.renderer.domElement.id = 'wave';
    }
}
