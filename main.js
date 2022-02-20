import * as THREE from '/three/three.module.js';
//import * as DRAG from '/DragControls.js';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const geometry = new THREE.PlaneGeometry();
const material = new THREE.MeshBasicMaterial( {color: 0x58CAA1, side: THREE.DoubleSide} );
/*
const cube = new THREE.Mesh( geometry, material );
const cube2 = new THREE.Mesh( geometry, material );
cube2.position.set(1, 0, 0)
*/
const group = new THREE.Group();
/*
group.add(cube);
group.add(cube2);
*/

scene.add( group );


camera.position.z = 50;
//const controls = new DRAG.DragControls(group.children, camera, renderer.domElement);

function render() {

    requestAnimationFrame( render );
    //group.rotation.x += 0.005;
    //group.rotation.y += 0.005;
    renderer.render( scene, camera );

}

window.addEventListener( 'resize', function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}, false );

const vec = new THREE.Vector3();
const pos = new THREE.Vector3();

function createCube (x,y) {
    vec.set(
        ( x/ window.innerWidth ) * 2 - 1,
        - ( y / window.innerHeight ) * 2 + 1,
    0.5 );

    vec.unproject( camera );

    vec.sub( camera.position ).normalize();

    let distance = - camera.position.z / vec.z;

    pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );
    let sphere = new THREE.Mesh( geometry, material);

    sphere.position.set(pos.x,pos.y,pos.z);
    group.add(sphere);
}

let pressed = false;
let first = [null,null];
let last = [null,null];
let mousePos;
function onPointerMove( event ) {
    mousePos = [event.pageX, event.pageY];
    if (pressed == false) {
        return;
    };

    createCube(event.pageX,event.pageY);
}
function onPointerDown( event ) {
    pressed = true;

    
}
function onPointerUp( event ) {
    pressed = false;
}
function onEscapePressed( event) {
    if (event.code == "Escape") {
        group.clear();
    };
}

function onLPressed ( event ) {
    if (event.code != "KeyL") {
        return;
    }
    if (first[0] == null) {
        first = mousePos;
        return;
    }else {
        last = mousePos;
    }
    let steps = Math.abs(last[0]-first[0]) + Math.abs(last[1]-first[1]);
    steps = Math.ceil(steps/4);
    console.log(steps);
    let points = [(last[0]-first[0])/steps,(last[1]-first[1])/steps]
        
    for (let k=0; k<steps; k++) {
        createCube(first[0] + (points[0]*k), first[1] + (points[1]*k))
    }
    first = [null,null];
    last = [null,null];
}
window.addEventListener( 'pointermove', onPointerMove );
window.addEventListener( 'pointerdown', onPointerDown );
window.addEventListener( 'pointerup', onPointerUp );
window.addEventListener( 'keydown', onEscapePressed );
window.addEventListener( 'keydown', onLPressed);

render();
