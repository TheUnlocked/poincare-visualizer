import { Box3, Color, DoubleSide, Group, Mesh, MeshBasicMaterial, ShapeGeometry, Vector3 } from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

const loader = new SVGLoader();

const material = new MeshBasicMaterial({
    color: new Color('#ffffff'),
    side: DoubleSide,
});

export const [horizontal, vertical, diagonal, antidiagonal, left, right] = (await Promise.all([
    './textures/horizontal.svg',
    './textures/vertical.svg',
    './textures/diagonal.svg',
    './textures/antidiagonal.svg',
    './textures/left.svg',
    './textures/right.svg',
].map(x => loader.loadAsync(x))))
.map(({ paths }) => {
    const group = new Group();
    for (const path of paths) {
        for (const shape of SVGLoader.createShapes(path)) {
            const geometry = new ShapeGeometry(shape);
            const mesh = new Mesh(geometry, material);
            group.add(mesh);
        }
    }

    const size = new Box3().expandByObject(group).getSize(new Vector3()).divideScalar(-2);
    for (const mesh of group.children) {
        mesh.position.set(size.x, 0, size.z);
    }

    group.scale.set(0.0003, -0.0003, 0.0003)

    return group;
});
