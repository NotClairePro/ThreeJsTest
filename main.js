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
const mainGroup = new THREE.Group();
/*
group.add(cube);
group.add(cube2);
*/

scene.add( mainGroup );


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

function createSquare (x,y) {
    vec.set(
        ( x/ window.innerWidth ) * 2 - 1,
        - ( y / window.innerHeight ) * 2 + 1,
    0.5 );

    vec.unproject( camera );

    vec.sub( camera.position ).normalize();

    let distance = - camera.position.z / vec.z;

    pos.copy( camera.position ).add( vec.multiplyScalar( distance ) );
    let square = new THREE.Mesh( geometry, material);

    square.position.set(pos.x,pos.y,pos.z);
    
    currentGroup.add( square );
}

let pressed = false;
let first = [null,null];
let last = [null,null];
let first2 = [null,null];
let last2 = [null,null];
let mousePos;
let currentGroup;
function onPointerMove( event ) {
    mousePos = [event.pageX, event.pageY];
    if (pressed == false) {
        return;
    };
    last2 = mousePos;
    let steps = Math.abs(last2[0]-first2[0]) + Math.abs(last2[1]-first2[1]);
    steps = Math.ceil(steps/4);
    let points = [(last2[0]-first2[0])/steps,(last2[1]-first2[1])/steps]
        
    for (let k=0; k<steps; k++) {
        createSquare(first2[0] + (points[0]*k), first2[1] + (points[1]*k))
    }
    first2 = mousePos;
    last2 = [null,null];
}
function onPointerDown( event ) {
    pressed = true;
    first2 = mousePos;
    currentGroup = new THREE.Group();
    mainGroup.add(currentGroup);
    createSquare(event.pageX, event.pageY);
}
function onPointerUp( event ) {
    pressed = false;
}
function onEscapePressed( event) {
    if (event.code == "Escape") {
        mainGroup.clear();
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
    let points = [(last[0]-first[0])/steps,(last[1]-first[1])/steps]
        
    for (let k=0; k<steps; k++) {

        createSquare(first[0] + (points[0]*k), first[1] + (points[1]*k))
    }
    first = [null,null];
    last = [null,null];
}

function Undo( event) {
    if (event.ctrlKey && event.key === 'z') {
        mainGroup.remove(mainGroup.children[mainGroup.children.length-1]);
    }
}
window.addEventListener( 'pointermove', onPointerMove );
window.addEventListener( 'pointerdown', onPointerDown );
window.addEventListener( 'pointerup', onPointerUp );
window.addEventListener( 'keydown', onEscapePressed );
window.addEventListener( 'keydown', onLPressed);
window.addEventListener( 'keydown', Undo );

render();
