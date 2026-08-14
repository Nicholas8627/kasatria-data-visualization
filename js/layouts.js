import * as THREE from "three";


/* ========================================
   LAYOUT SETTINGS
======================================== */

const TABLE_COLUMNS = 20;
const TABLE_ROWS = 10;

const GRID_COLUMNS = 5;
const GRID_ROWS = 4;
const GRID_DEPTH = 10;


/* ========================================
   TABLE LAYOUT
   20 × 10
======================================== */

/**
 * Creates a 20-column × 10-row table layout.
 *
 * @param {number} count
 * @returns {THREE.Object3D[]}
 */
export function createTableTargets(count) {

    const targets = [];

    const spacingX = 150;
    const spacingY = 190;


    for (let index = 0; index < count; index++) {

        const object =
            new THREE.Object3D();


        const column =
            index % TABLE_COLUMNS;


        const row =
            Math.floor(
                index / TABLE_COLUMNS
            );


        object.position.x =
            (
                column -
                (TABLE_COLUMNS - 1) / 2
            ) * spacingX;


        object.position.y =
            (
                (TABLE_ROWS - 1) / 2 -
                row
            ) * spacingY;


        object.position.z = 0;


        object.rotation.set(
            0,
            0,
            0
        );


        targets.push(object);
    }


    return targets;
}


/* ========================================
   SPHERE LAYOUT
======================================== */

/**
 * Distributes all objects evenly
 * around the surface of a sphere.
 *
 * @param {number} count
 * @returns {THREE.Object3D[]}
 */
export function createSphereTargets(count) {

    const targets = [];

    const radius = 850;


    for (let index = 0; index < count; index++) {

        const object =
            new THREE.Object3D();


        /*
         * Fibonacci-style distribution
         * gives a visually even sphere.
         */

        const phi =
            Math.acos(
                -1 +
                (2 * index) /
                count
            );


        const theta =
            Math.sqrt(
                count * Math.PI
            ) * phi;


        object.position.setFromSphericalCoords(
            radius,
            phi,
            theta
        );


        /*
         * Make each tile face away
         * from the sphere centre.
         */

        const direction =
            object.position
                .clone()
                .multiplyScalar(2);


        object.lookAt(direction);


        targets.push(object);
    }


    return targets;
}


/* ========================================
   DOUBLE HELIX LAYOUT
======================================== */

/**
 * Creates TWO intertwined helices.
 *
 * Assignment requirement:
 * Double Helix instead of the
 * Three.js example's single helix.
 *
 * @param {number} count
 * @returns {THREE.Object3D[]}
 */
export function createHelixTargets(count) {

    const targets = [];

    const radius = 780;

    const verticalSpacing = 19;

    const angleStep = 0.32;


    /*
     * Half the people go to strand A,
     * half go to strand B.
     */

    const strandLength =
        Math.ceil(count / 2);


    for (let index = 0; index < count; index++) {

        const object =
            new THREE.Object3D();


        /*
         * Even index  = first strand
         * Odd index   = second strand
         */

        const strand =
            index % 2;


        const positionInStrand =
            Math.floor(index / 2);


        const angle =
            positionInStrand *
            angleStep;


        /*
         * Second strand is 180°
         * opposite the first strand.
         */

        const strandOffset =
            strand === 0
                ? 0
                : Math.PI;


        const finalAngle =
            angle +
            strandOffset;


        object.position.x =
            radius *
            Math.sin(finalAngle);


        object.position.z =
            radius *
            Math.cos(finalAngle);


        object.position.y =
            (
                positionInStrand -
                strandLength / 2
            ) *
            verticalSpacing;


        /*
         * Rotate tile so it faces
         * outward from the helix.
         */

        const lookTarget =
            new THREE.Vector3(
                object.position.x * 2,
                object.position.y,
                object.position.z * 2
            );


        object.lookAt(
            lookTarget
        );


        targets.push(object);
    }


    return targets;
}


/* ========================================
   GRID LAYOUT
   5 × 4 × 10
======================================== */

/**
 * Creates the required:
 *
 * 5 columns ×
 * 4 rows ×
 * 10 depth layers
 *
 * Total = 200 positions.
 *
 * @param {number} count
 * @returns {THREE.Object3D[]}
 */
export function createGridTargets(count) {

    const targets = [];


    const spacingX = 260;
    const spacingY = 220;
    const spacingZ = 420;


    for (let index = 0; index < count; index++) {

        const object =
            new THREE.Object3D();


        /*
         * x changes every record.
         */

        const x =
            index %
            GRID_COLUMNS;


        /*
         * y changes after every
         * group of 5.
         */

        const y =
            Math.floor(
                index /
                GRID_COLUMNS
            ) %
            GRID_ROWS;


        /*
         * z changes after every
         * 5 × 4 = 20 records.
         */

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
                (GRID_COLUMNS - 1) / 2
            ) *
            spacingX;


        object.position.y =
            (
                (GRID_ROWS - 1) / 2 -
                y
            ) *
            spacingY;


        object.position.z =
            (
                z -
                (GRID_DEPTH - 1) / 2
            ) *
            spacingZ;


        object.rotation.set(
            0,
            0,
            0
        );


        targets.push(object);
    }


    return targets;
}


/* ========================================
   CREATE ALL TARGETS
======================================== */

/**
 * Creates all four layouts for
 * the supplied number of records.
 *
 * @param {number} count
 * @returns {Object}
 */
export function createLayoutTargets(count) {

    return {

        table:
            createTableTargets(count),

        sphere:
            createSphereTargets(count),

        helix:
            createHelixTargets(count),

        grid:
            createGridTargets(count)

    };
}