import { Color, Mesh, MeshStandardMaterial, Object3D, DoubleSide, Vector3 } from 'three';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';
import { exp, complex, multiply, Complex } from 'mathjs';
import { column } from './math';

const RESOLUTION = 200;

const u = new Vector3();
const v = new Vector3();

export default class Wave extends Object3D {
    radius = 0.05;
    length = 2;

    /** angular frequency */
    private freq = 3;
    
    polarization = column(complex(1, 0), complex(0, 0));
    phase = 0;

    private mat = new MeshStandardMaterial({
        color: new Color('#049ef4'),
        side: DoubleSide,
        fog: true,
    });
    private mesh = new Mesh(new ParametricGeometry(undefined, RESOLUTION), this.mat);

    constructor() {
        super();

        this.add(this.mesh);

        this.mesh.onBeforeRender = (_renderer, _scene, _camera, geometry) => {
            const geom = new ParametricGeometry((t, angle, target) => {
                // t is the point along the wave
                // angle is the radius along the tube

                const waveAngle = this.freq * (t * 2 * Math.PI - this.phase);
                const positionFactor = exp(complex(0, waveAngle));
    
                const x = multiply(positionFactor, this.polarization[0][0]) as Complex;
                const y = multiply(positionFactor, this.polarization[1][0]) as Complex;

                target.x = x.re;
                target.y = y.re;
                target.z = (t - 0.5) * 2 * this.length;

                const dx_dt = -x.im;
                const dy_dt = -y.im;

                u.set(dx_dt, dy_dt, 1);
                v.set(1, 0, 0);
                v.cross(u).normalize();
                u.cross(v).normalize();
                
                const theta = angle * 2 * Math.PI;
                u.multiplyScalar(Math.cos(theta));
                v.multiplyScalar(Math.sin(theta));
                
                u.add(v).multiplyScalar(this.radius);

                target.add(u);
            }, RESOLUTION);

            const fromPositions = geom.getAttribute('position').array;
            const toPositions = geometry.getAttribute('position').array as Float32Array;
            for (let i = 0; i < toPositions.length; i++) {
                toPositions[i] = fromPositions[i];
            }
            geom.dispose();
            geometry.getAttribute('position').needsUpdate = true;
        };
    }
}