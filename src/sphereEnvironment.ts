import { ArrowHelper, Camera, Color, Group, Mesh, MeshBasicMaterial, MOUSE, PerspectiveCamera, Quaternion, Raycaster, RingGeometry, Scene, SphereGeometry, Vector3, WebGLRenderer } from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { antidiagonal, diagonal, horizontal, left, right, vertical } from './symbols';

const raycaster = new Raycaster();
const quat = new Quaternion();

export default class SphereEnvironment {
    renderer: WebGLRenderer;
    camera: Camera;
    
    private cameraControls?: TrackballControls;
    private sphere: Mesh;

    readonly arrowDirection = new Vector3(0, 1, 0);

    get domElement() {
        return this.renderer.domElement;
    }

    constructor(width: number, height: number) {
        const scene = new Scene();
        this.camera = new PerspectiveCamera(70, width / height, 0.01, 10);
        this.camera.position.set(0, 0, 3);
        this.camera.lookAt(new Vector3());

        this.renderer = new WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);

        const sphereGroup = new Group();

        this.sphere = new Mesh(
            new SphereGeometry(1),
            new MeshBasicMaterial({ transparent: true, opacity: 0.7, color: new Color('#111111') }),
        );

        sphereGroup.add(this.sphere);

        const arrow = new ArrowHelper(this.arrowDirection, new Vector3(), 1, new Color('red'), 0.2, 0.1);
        sphereGroup.add(arrow);

        const ringGeometry = new RingGeometry(1.01, 1.01, 30);
        const ringMaterial = new MeshBasicMaterial({ wireframe: true });
        const rings = [
            new Mesh(ringGeometry, ringMaterial),
            new Mesh(ringGeometry, ringMaterial),
            new Mesh(ringGeometry, ringMaterial),
        ];

        rings[1].rotateX(Math.PI / 2);
        rings[2].rotateY(Math.PI / 2);

        rings.forEach(r => sphereGroup.add(r));

        // Add symbols
        horizontal.position.set(0, 1.1, 0);
        vertical.position.set(0, -1.3, 0);
        left.position.set(1.2, -0.05, 0);
        right.rotateY(Math.PI);
        right.position.set(-1.2, -0.05, 0);
        diagonal.rotateY(-Math.PI / 2);
        diagonal.position.set(0, -0.05, 1.2);
        antidiagonal.rotateY(Math.PI / 2);
        antidiagonal.position.set(0, -0.05, -1.2);
        sphereGroup.add(horizontal);
        sphereGroup.add(vertical);
        sphereGroup.add(diagonal);
        sphereGroup.add(antidiagonal);
        sphereGroup.add(right);
        sphereGroup.add(left);

        // Initial rotation
        sphereGroup.rotateX(Math.PI / 10);
        sphereGroup.rotateY(-Math.PI / 6);

        scene.add(sphereGroup);

        const render = () => {
            this.cameraControls?.update();

            arrow.setDirection(this.arrowDirection);

            this.renderer.render(scene, this.camera);
        }


        let draggingArrow = false;
        this.domElement.addEventListener('mousedown', e => {
            if (e.button === MOUSE.RIGHT) {
                draggingArrow = true;
            }
        });

        this.domElement.addEventListener('mouseup', e => {
            if (e.button === MOUSE.RIGHT) {
                draggingArrow = false;
            }
        });

        this.domElement.addEventListener('mousemove', e => {
            if (!draggingArrow) {
                return;
            }

            raycaster.setFromCamera(
                {
                    x: ((e.clientX - 10) / this.domElement.clientWidth) * 2 - 1,
                    y: -((e.clientY - 10) / this.domElement.clientHeight) * 2 + 1
                },
                this.camera
            )
            const [intersection] = raycaster.intersectObject(this.sphere, true);
            if (intersection) {
                quat.setFromEuler(sphereGroup.rotation).invert();
                this.arrowDirection.copy(intersection.point).applyQuaternion(quat).normalize();
            }
        })

        this.renderer.setAnimationLoop(render);

        this.domElement.id = 'sphere';
    }

    initControls() {
        this.cameraControls = new TrackballControls(this.camera, this.domElement);
        this.cameraControls.noZoom = true;
        this.cameraControls.noPan = true;
    }
}