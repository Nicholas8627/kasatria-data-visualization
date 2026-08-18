import * as THREE
from "three";


/* ========================================
   LAYOUT SETTINGS
======================================== */

const TABLE_COLUMNS =
    20;

const TABLE_ROWS =
    10;


const GRID_COLUMNS =
    5;

const GRID_ROWS =
    4;

const GRID_DEPTH =
    10;


/* ========================================
   TABLE LAYOUT
   20 × 10
======================================== */

export function createTableTargets(
    count
) {

    const targets =
        [];


    const spacingX =
        150;

    const spacingY =
        190;


    for (
        let index = 0;
        index < count;
        index++
    ) {

        const object =
            new THREE.Object3D();


        const column =
            index %
            TABLE_COLUMNS;


        const row =
            Math.floor(
                index /
                TABLE_COLUMNS
            );


        object.position.x =
            (
                column -
                (
                    TABLE_COLUMNS -
                    1
                ) / 2
            ) *
            spacingX;


        object.position.y =
            (
                (
                    TABLE_ROWS -
                    1
                ) / 2 -
                row
            ) *
            spacingY;


        object.position.z =
            0;


        object.rotation.set(
            0,
            0,
            0
        );


        targets.push(
            object
        );
    }


    return targets;
}


/* ========================================
   SPHERE
======================================== */

export function createSphereTargets(
    count
) {

    const targets =
        [];


    const radius =
        850;


    for (
        let index = 0;
        index < count;
        index++
    ) {

        const object =
            new THREE.Object3D();


        const phi =
            Math.acos(
                -1 +
                (
                    2 *
                    index
                ) /
                count
            );


        const theta =
            Math.sqrt(
                count *
                Math.PI
            ) *
            phi;


        object.position
            .setFromSphericalCoords(
                radius,
                phi,
                theta
            );


        const direction =
            object.position
                .clone()
                .multiplyScalar(
                    2
                );


        object.lookAt(
            direction
        );


        targets.push(
            object
        );
    }


    return targets;
}


/* ========================================
   DOUBLE HELIX
======================================== */

export function createHelixTargets(
    count
) {

    const targets =
        [];


    const radius =
        780;


    const verticalSpacing =
        19;


    const angleStep =
        0.32;


    const strandLength =
        Math.ceil(
            count /
            2
        );


    for (
        let index = 0;
        index < count;
        index++
    ) {

        const object =
            new THREE.Object3D();


        const strand =
            index %
            2;


        const positionInStrand =
            Math.floor(
                index /
                2
            );


        const angle =
            positionInStrand *
            angleStep;


        const strandOffset =
            strand === 0
                ? 0
                : Math.PI;


        const finalAngle =
            angle +
            strandOffset;


        object.position.x =
            radius *
            Math.sin(
                finalAngle
            );


        object.position.z =
            radius *
            Math.cos(
                finalAngle
            );


        object.position.y =
            (
                positionInStrand -
                strandLength /
                2
            ) *
            verticalSpacing;


        const lookTarget =
            new THREE.Vector3(

                object.position.x *
                2,

                object.position.y,

                object.position.z *
                2
            );


        object.lookAt(
            lookTarget
        );


        targets.push(
            object
        );
    }


    return targets;
}


/* ========================================
   GRID
   5 × 4 × 10
======================================== */

export function createGridTargets(
    count
) {

    const targets =
        [];


    const spacingX =
        260;

    const spacingY =
        220;

    const spacingZ =
        420;


    for (
        let index = 0;
        index < count;
        index++
    ) {

        const object =
            new THREE.Object3D();


        const x =
            index %
            GRID_COLUMNS;


        const y =
            Math.floor(
                index /
                GRID_COLUMNS
            ) %
            GRID_ROWS;


        const z =
            Math.floor(
                index /
                (
                    GRID_COLUMNS *
                    GRID_ROWS
                )
            );


        object.position.x =
            (
                x -
                (
                    GRID_COLUMNS -
                    1
                ) / 2
            ) *
            spacingX;


        object.position.y =
            (
                (
                    GRID_ROWS -
                    1
                ) / 2 -
                y
            ) *
            spacingY;


        object.position.z =
            (
                z -
                (
                    GRID_DEPTH -
                    1
                ) / 2
            ) *
            spacingZ;


        object.rotation.set(
            0,
            0,
            0
        );


        targets.push(
            object
        );
    }


    return targets;
}


/* ========================================
   PYRAMID / TETRAHEDRON
   4 TRIANGULAR FACES
======================================== */

/**
 * Creates a four-face pyramid
 * (regular tetrahedron).
 *
 * With 200 records,
 * approximately 50 cards are placed
 * on every triangular face.
 *
 * @param {number} count
 * @returns {THREE.Object3D[]}
 */
export function createPyramidTargets(
    count
) {

    const targets =
        [];


    const size =
        950;


    /*
     * Vertices of a regular
     * tetrahedron centered near
     * the world origin.
     */

    const vertexA =
        new THREE.Vector3(
            1,
            1,
            1
        )
        .normalize()
        .multiplyScalar(
            size
        );


    const vertexB =
        new THREE.Vector3(
            -1,
            -1,
            1
        )
        .normalize()
        .multiplyScalar(
            size
        );


    const vertexC =
        new THREE.Vector3(
            -1,
            1,
            -1
        )
        .normalize()
        .multiplyScalar(
            size
        );


    const vertexD =
        new THREE.Vector3(
            1,
            -1,
            -1
        )
        .normalize()
        .multiplyScalar(
            size
        );


    /*
     * Four triangular faces.
     */

    const faces = [

        [
            vertexA,
            vertexB,
            vertexC
        ],

        [
            vertexA,
            vertexD,
            vertexB
        ],

        [
            vertexA,
            vertexC,
            vertexD
        ],

        [
            vertexB,
            vertexD,
            vertexC
        ]

    ];


    /*
     * Tetrahedron center.
     */

    const center =
        vertexA
            .clone()
            .add(
                vertexB
            )
            .add(
                vertexC
            )
            .add(
                vertexD
            )
            .divideScalar(
                4
            );


    const recordsPerFace =
        Math.ceil(
            count /
            faces.length
        );


    const goldenRatio =
        0.618033988749895;


    for (
        let index = 0;
        index < count;
        index++
    ) {

        const object =
            new THREE.Object3D();


        /*
         * Send records evenly
         * to 4 different faces.
         */

        const faceIndex =
            index %
            faces.length;


        const indexOnFace =
            Math.floor(
                index /
                faces.length
            );


        const face =
            faces[
                faceIndex
            ];


        const pointA =
            face[0];

        const pointB =
            face[1];

        const pointC =
            face[2];


        /*
         * Barycentric coordinates.
         *
         * These place each card
         * inside the triangular face.
         */

        const u =
            (
                indexOnFace +
                0.5
            ) /
            recordsPerFace;


        const v =
            (
                indexOnFace *
                goldenRatio
            ) %
            1;


        const sqrtU =
            Math.sqrt(
                u
            );


        const weightA =
            1 -
            sqrtU;


        const weightB =
            sqrtU *
            (
                1 -
                v
            );


        const weightC =
            sqrtU *
            v;


        object.position
            .copy(
                pointA
            )
            .multiplyScalar(
                weightA
            );


        object.position.add(

            pointB
                .clone()
                .multiplyScalar(
                    weightB
                )
        );


        object.position.add(

            pointC
                .clone()
                .multiplyScalar(
                    weightC
                )
        );


        /*
         * Calculate the face normal.
         */

        const edgeAB =
            pointB
                .clone()
                .sub(
                    pointA
                );


        const edgeAC =
            pointC
                .clone()
                .sub(
                    pointA
                );


        const normal =
            new THREE.Vector3()
                .crossVectors(
                    edgeAB,
                    edgeAC
                )
                .normalize();


        /*
         * Find centre of this face.
         */

        const faceCenter =
            pointA
                .clone()
                .add(
                    pointB
                )
                .add(
                    pointC
                )
                .divideScalar(
                    3
                );


        /*
         * Direction from the middle
         * of pyramid to the face.
         */

        const outwardDirection =
            faceCenter
                .clone()
                .sub(
                    center
                );


        /*
         * Ensure face normal points
         * outside the tetrahedron.
         */

        if (
            normal.dot(
                outwardDirection
            ) <
            0
        ) {

            normal.negate();
        }


        /*
         * Move card slightly away
         * from face so cards do not
         * visually enter the pyramid.
         */

        object.position.add(

            normal
                .clone()
                .multiplyScalar(
                    12
                )
        );


        /*
         * Keep cards pointing
         * outward from the face.
         */

        const lookTarget =
            object.position
                .clone()
                .add(
                    normal
                );


        object.lookAt(
            lookTarget
        );


        targets.push(
            object
        );
    }


    return targets;
}


/* ========================================
   CREATE ALL TARGETS
======================================== */

export function createLayoutTargets(
    count
) {

    return {

        table:
            createTableTargets(
                count
            ),

        sphere:
            createSphereTargets(
                count
            ),

        helix:
            createHelixTargets(
                count
            ),

        grid:
            createGridTargets(
                count
            ),

        pyramid:
            createPyramidTargets(
                count
            )

    };
}