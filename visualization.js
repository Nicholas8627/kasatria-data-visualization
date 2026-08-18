import * as THREE
from "three";


import {
    CSS3DRenderer
}
from
"three/addons/renderers/CSS3DRenderer.js";


import {
    OrbitControls
}
from
"three/addons/controls/OrbitControls.js";


import {
    createPersonTile
}
from
"./tileFactory.js";


import {
    createLayoutTargets
}
from
"./layouts.js";


let camera;
let scene;
let renderer;
let controls;


let objects =
    [];


let targets =
    {};


let animationFrameId =
    null;


/* ========================================
   INITIALIZE
======================================== */

export function initVisualization(
    people
) {

    cleanupVisualization();


    createScene();


    createCamera();


    createRenderer();


    createControls();


    createTiles(
        people
    );


    targets =
        createLayoutTargets(
            objects.length
        );


    bindLayoutButtons();


    bindResizeHandler();


    transformTo(
        "table",
        1200
    );


    animate();
}


/* ========================================
   SCENE
======================================== */

function createScene() {

    scene =
        new THREE.Scene();
}


/* ========================================
   CAMERA
======================================== */

function createCamera() {

    camera =
        new THREE.PerspectiveCamera(

            40,

            window.innerWidth /
            window.innerHeight,

            1,

            10000
        );


    camera.position.z =
        4200;
}


/* ========================================
   RENDERER
======================================== */

function createRenderer() {

    renderer =
        new CSS3DRenderer();


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );


    renderer.domElement
        .style.position =
        "absolute";


    renderer.domElement
        .style.top =
        "0";


    renderer.domElement
        .style.left =
        "0";


    const container =
        document.getElementById(
            "three-container"
        );


    container.innerHTML =
        "";


    container.appendChild(
        renderer.domElement
    );
}


/* ========================================
   CONTROLS
======================================== */

function createControls() {

    controls =
        new OrbitControls(
            camera,
            renderer.domElement
        );


    controls.enableDamping =
        true;


    controls.dampingFactor =
        0.08;


    controls.minDistance =
        800;


    controls.maxDistance =
        8000;


    controls.target.set(
        0,
        0,
        0
    );


    controls.update();
}


/* ========================================
   TILES
======================================== */

function createTiles(
    people
) {

    objects =
        [];


    people.forEach(
        person => {

            const object =
                createPersonTile(
                    person
                );


            /*
             * Initial random
             * starting position.
             */

            object.position.x =
                Math.random() *
                4000 -
                2000;


            object.position.y =
                Math.random() *
                3000 -
                1500;


            object.position.z =
                Math.random() *
                3000 -
                1500;


            scene.add(
                object
            );


            objects.push(
                object
            );
        }
    );
}


/* ========================================
   LAYOUT BUTTONS
======================================== */

function bindLayoutButtons() {

    const buttons =
        document.querySelectorAll(
            "[data-layout]"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const layoutName =
                        button
                            .dataset
                            .layout;


                    transformTo(
                        layoutName,
                        1200
                    );

                }
            );

        }
    );
}


/* ========================================
   TRANSFORM
======================================== */

export function transformTo(
    layoutName,
    duration = 1200
) {

    const selectedTargets =
        targets[
            layoutName
        ];


    if (
        !selectedTargets
    ) {

        console.warn(
            `Unknown layout: ${layoutName}`
        );

        return;
    }


    setActiveButton(
        layoutName
    );


    const startTime =
        performance.now();


    const startStates =
        objects.map(
            object => ({

                position:
                    object.position
                        .clone(),

                quaternion:
                    object.quaternion
                        .clone()

            })
        );


    function updateTransition(
        currentTime
    ) {

        const elapsed =
            currentTime -
            startTime;


        const progress =
            Math.min(
                elapsed /
                duration,
                1
            );


        const eased =
            easeInOutCubic(
                progress
            );


        objects.forEach(
            (
                object,
                index
            ) => {


                const target =
                    selectedTargets[
                        index
                    ];


                const start =
                    startStates[
                        index
                    ];


                if (
                    !target ||
                    !start
                ) {

                    return;
                }


                object.position
                    .lerpVectors(

                        start.position,

                        target.position,

                        eased
                    );


                object.quaternion
                    .slerpQuaternions(

                        start.quaternion,

                        target.quaternion,

                        eased
                    );

            }
        );


        if (
            progress <
            1
        ) {

            requestAnimationFrame(
                updateTransition
            );
        }
    }


    requestAnimationFrame(
        updateTransition
    );
}


/* ========================================
   ACTIVE BUTTON
======================================== */

function setActiveButton(
    layoutName
) {

    const buttons =
        document.querySelectorAll(
            "[data-layout]"
        );


    buttons.forEach(
        button => {

            const isActive =
                button
                    .dataset
                    .layout ===
                layoutName;


            button.classList.toggle(
                "active",
                isActive
            );

        }
    );
}


/* ========================================
   EASING
======================================== */

function easeInOutCubic(t) {

    if (
        t <
        0.5
    ) {

        return (
            4 *
            t *
            t *
            t
        );
    }


    return (
        1 -
        Math.pow(
            -2 * t + 2,
            3
        ) /
        2
    );
}


/* ========================================
   RESIZE
======================================== */

function bindResizeHandler() {

    window.addEventListener(
        "resize",
        onWindowResize
    );
}


function onWindowResize() {

    if (
        !camera ||
        !renderer
    ) {

        return;
    }


    camera.aspect =
        window.innerWidth /
        window.innerHeight;


    camera
        .updateProjectionMatrix();


    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
}


/* ========================================
   ANIMATION LOOP
======================================== */

function animate() {

    animationFrameId =
        requestAnimationFrame(
            animate
        );


    if (
        controls
    ) {

        controls.update();
    }


    if (
        renderer &&
        scene &&
        camera
    ) {

        renderer.render(
            scene,
            camera
        );
    }
}


/* ========================================
   CLEANUP
======================================== */

function cleanupVisualization() {

    if (
        animationFrameId !==
        null
    ) {

        cancelAnimationFrame(
            animationFrameId
        );


        animationFrameId =
            null;
    }


    window.removeEventListener(
        "resize",
        onWindowResize
    );


    if (
        controls
    ) {

        controls.dispose();


        controls =
            null;
    }


    objects =
        [];


    targets =
        {};


    scene =
        null;


    camera =
        null;


    renderer =
        null;
}