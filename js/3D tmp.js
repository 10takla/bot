import * as THREE from 'https://unpkg.com/three@0.139.0/build/three.module.js'
import {OrbitControls} from "https://unpkg.com/three@0.139.0/examples/jsm/controls/OrbitControls.js"
import {GLTFLoader} from "https://threejs.org/examples/jsm/loaders/GLTFLoader.js"
import {GLTFExporter} from 'https://threejs.org/examples/jsm/exporters/GLTFExporter.js'
import {RectAreaLightHelper} from "https://unpkg.com/three@0.139.0/examples/jsm/helpers/RectAreaLightHelper.js"
import {RectAreaLightUniformsLib} from "https://unpkg.com/three@0.139.0/examples/jsm/lights/RectAreaLightUniformsLib.js"
import {RGBELoader} from "./RGBELoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, 10 / 10, 0.1, 5000);
camera.position.z = 358;

const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
renderer.setPixelRatio(window.devicePixelRatio)
document.body.querySelector('.container').appendChild(renderer.domElement)

//менеджер загрузки
const loadingManager = new THREE.LoadingManager()
loadingManager.onLoad = () => {
    // $('.container video').remove()
    $('#loading').hide()
    animate()
    gsap.to(camera.position, {
        duration: 1.5,
        z: 8,
        ease: "power1.out",
        onComplete: () => controls.maxDistance = 80
    })
}
loadingManager.onStart = () => {
}
let amount = 90
loadingManager.onProgress = () => {
    $('#loading').show()
    $('#loading').animate({
        opacity: 0.25,
        MozTransform: 'rotate(-' + -amount + 'deg)',
        transform: 'rotate(' + -amount + 'deg)'
    })
}

//звук
const listener = new THREE.AudioListener()
camera.add(listener)

const sound = new THREE.Audio(listener)
scene.add(sound);
const audioLoader = new THREE.AudioLoader()
audioLoader.load('audio/space.mp3', function (buffer) {
    sound.setBuffer(buffer)
    sound.setLoop(true)
    sound.setVolume($('#sound').prev().slider("option", "value"))
    sound.play()
})

$('#sound').prev().on('slide', function (event, ui) {
    sound.setVolume(ui.value)
})

let val_sound = 0
$('#sound').click(function () {
    $('#sound').prev().slider("option", "value", val_sound)
    val_sound = sound.getVolume()
    sound.setVolume($('#sound').prev().slider("option", "value"))
})

//Resize
function setSize() {
    let width = $('.container').width()
    let height = $('.container').height()
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    $('.container video').width(width)
    $('.container video').css('top', '-' + $('.container video').height() / 2 - height / 2 + 'px')
    renderer.setSize(width, height)
}

setSize()
$(window).resize(setSize)

$('.work_panel #fullscreen').click(function () {
    $('.container').toggleClass('active')
    $(this).toggleClass('active')
    setSize()
})

//свет
const light = new THREE.AmbientLight(0x404040, 1) // soft white light
scene.add(light)

const pLight = new THREE.DirectionalLight(0xFFFFFF, 1.2)
pLight.position.set(-10, 0, 0)
scene.add(pLight)

const helper = new RectAreaLightHelper(pLight)
scene.add(helper)

let val_light = 4
let val_pLight = 0
$('#shadow').click(function () {
    light.intensity = [val_light, val_light = light.intensity][0]
    pLight.intensity = [val_pLight, val_pLight = pLight.intensity][0]
})
//скайбокс
// renderer.outputEncoding = THREE.sRGBEncoding;
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 1;
//
// const hdrTextureURL = new URL('../textures/galaxy.hdr', import.meta.url);
// new RGBELoader().load(hdrTextureURL, function (texture) {
//     texture.mapping = THREE.EquirectangularReflectionMapping;
//     scene.background = texture;
// });

//сфера окружение
const uvTexture_env = new THREE.TextureLoader(loadingManager).load('textures/galaxy.png')
const geometry_env = new THREE.SphereGeometry(1000, 64, 32)
const material_env = new THREE.MeshBasicMaterial({
    map: uvTexture_env,
});
const enviroment = new THREE.Mesh(geometry_env.scale(-1, 1, 1), material_env)
scene.add(enviroment)

//планета
let planet_name = $('.planet_menu li:first-child').addClass('active').text()
let prefics = ''
let tmp_prefics = '_4K'
if ($('#4K').attr('class') == 'active') {
    prefics = '_4K'
    tmp_prefics = ''
}
$('#4K').css('display', 'none')

const textur_loading = new THREE.TextureLoader()
let name_texture = ''

function setMaterial() {
    const mater = new THREE.MeshPhongMaterial()
    for (let i in textures[planet_name]) {
        name_texture = textures[planet_name][i]
        switch (name_texture.split('.')[0]) {
            case 'color' + prefics:
                mater.displacementMap = textur_loading.load(`textures/${planet_name}/` + name_texture)
                mater.displacementScale = 0.015
                mater.map = textur_loading.load(`textures/${planet_name}/` + name_texture)
                break
            case 'normalMap' + prefics:
                mater.normalScale = new THREE.Vector2(2.85, -0.85)
                mater.normalMap = textur_loading.load(`textures/${planet_name}/` + name_texture)
                break
            case 'specular' + prefics:
                mater.specular.set(0x333333)
                mater.specularMap = textur_loading.load(`textures/${planet_name}/` + name_texture)
                break
            default:
                mater.shininess = 18
        }
        if (name_texture.split('.')[0] == 'color_4K') {
            $('#4K').css('display', 'block')
        }
    }
    return mater
}

const planet = new THREE.Mesh(new THREE.SphereGeometry(2, 128 * 10, 64 * 10), setMaterial())
// planet.material.transparent = true
// planet.material.opacity = 0.3
scene.add(planet)

$('.planet_menu').on('click', 'li', function () {
    $(this).parent().find('li.active').removeClass('active')
    $(this).addClass('active')
    $('#4K').css('display', 'none')
    planet_name = $(this).text()
    planet.material = setMaterial()
    setDisplacement()
})

$('#4K').click(function () {
    $(this).toggleClass('active')
    prefics = [tmp_prefics, tmp_prefics = prefics][0]
    planet.material = setMaterial()
})

//участки
const gltfLoader = new GLTFLoader(loadingManager)
let plots
let plots_scale = 2.02
gltfLoader.load('models/Earth.glb', (gltf) => {
    plots = gltf.scene
    plots.scale.multiplyScalar(0)
    plots.scale.addScalar(plots_scale)
    plots.children.forEach((plot) => {
        if (plot.isMesh) {
            plot.material = new THREE.MeshBasicMaterial({
                transparent: true, opacity: 0, color: 0xfcba03
            })
        }
    })
    planet.add(plots)
})

$('#plots').click(function () {
    $(this)
})

//пользователи
let circle_radius = 0.05
const geometry = new THREE.CircleGeometry(circle_radius, 32)

function addUser(plot) {
    let boundingPlot = plot.geometry.boundingBox
    var middlePlot = new THREE.Vector3();
    middlePlot.x = (boundingPlot.max.x + boundingPlot.min.x) / 2;
    middlePlot.y = (boundingPlot.max.y + boundingPlot.min.y) / 2;
    middlePlot.z = (boundingPlot.max.z + boundingPlot.min.z) / 2;

    let user_position = plot.worldToLocal(middlePlot)
    const userCircle = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        map: textur_loading.load('../images/icons/mongrol.svg'),
        opacity: 0,
        transparent: true
    }))
    userCircle.material.side = THREE.DoubleSide
    userCircle.position.copy(user_position.normalize().multiplyScalar((plots_scale / 2) + circle_radius))

    plot.add(userCircle)
}

//сетка
const wire = new THREE.Mesh(new THREE.SphereGeometry(2.005, 64, 32))
var bool_scale = true
wire.material = new THREE.MeshPhongMaterial({
    transparent: bool_scale,
    opacity: 0,
    wireframe: true,
    emissive: 'white',
    shininess: 0
})

$('#grid').click(function () {
    bool_scale = !bool_scale
    wire.material.transparent = bool_scale
})

function setDisplacement() {
    for (let i in textures[planet_name]) {
        name_texture = textures[planet_name][i]
        switch (name_texture.split('.')[0]) {
            case 'color' + prefics:
                wire.material.displacementMap = textur_loading.load('textures/' + planet_name + '/color' + prefics + '.jpg')
                wire.material.displacementScale = 0.015
        }
    }
}

setDisplacement()
planet.add(wire)

//OrbitControls
const controls = new OrbitControls(camera, renderer.domElement)
controls.autoRotate = true
controls.autoRotateSpeed = $('#camera_around').prev().slider("option", "value")
controls.enableDamping = true
controls.enablePan = false
// controls.maxDistance = 80
controls.minDistance = 3
controls.rotateSpeed = 0.5
controls.zoomSpeed = 1.7

$('#camera_around').prev().on("slide", function (event, ui) {
    controls.autoRotate = true
    controls.autoRotateSpeed = ui.value
});

let rotation_camera = 0
$('.work_panel #camera_around').click(function () {
    controls.autoRotateSpeed = [rotation_camera, rotation_camera = controls.autoRotateSpeed][0]
    $('#camera_around').prev().slider("option", "value", controls.autoRotateSpeed)
})

let rotation_planet = $('#around_axis').prev().slider("option", "value") / 900

const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2(-2, -2)
const mouse2 = new THREE.Vector2(-2, -2)
let selected_move
let selected_click

function onMouseDbClick(event) {
    mouse2.x = (event.clientX / $('.container').width()) * 2 - 1
    mouse2.y = -(event.clientY / $('.container').height()) * 2 + 1

    raycaster.setFromCamera(mouse2, camera)
    const intersects = raycaster.intersectObjects(plots.children, false)
    if (selected_move) {
        if (selected_click) {
            selected_click.scale.subScalar(0.01)
            selected_click.material.opacity = 0
            selected_click.children[0].material.opacity = 0
            selected_click.children[0].scale.setScalar(1)
        }
        selected_click = intersects[0].object
        selected_click.scale.addScalar(0.01)
    }
}

function onMouseMove(event) {
    mouse.x = (event.clientX / $('.container').width()) * 2 - 1
    mouse.y = -(event.clientY / $('.container').height()) * 2 + 1
}

function selectorMouse() {
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(plots.children, false)

    if (intersects.length) {
        if (selected_move != intersects[0].object) {
            if (selected_move) {
                selected_move.material.opacity = 0
                selected_move.children[0].material.opacity = 0
            }
            selected_move = intersects[0].object
            selected_move.material.opacity = 1
            selected_move.children[0].material.opacity = 1
        }
    } else {
        if (selected_move) {
            selected_move.material.opacity = 0
            selected_move.children[0].material.opacity = 0
        }
        selected_move = null
    }
    if (selected_click) {
        selected_click.material.opacity = 0.5
        selected_click.children[0].material.opacity = 1
        selected_click.children[0].scale.setScalar(2)
    }
}

function animate() {
    requestAnimationFrame(animate)
    planet.rotation.y += rotation_planet
    controls.update()
    plots.children.forEach((plot) => {
        plot.children[0].lookAt(camera.position)
    })
    selectorMouse()

    renderer.render(scene, camera)
}

document.querySelector('.container').addEventListener('mousemove', onMouseMove, false)
document.querySelector('.container').addEventListener('dblclick', onMouseDbClick, false)

let tmp_rotation_planet = 0
$('#around_axis').click(function () {
    rotation_planet = [tmp_rotation_planet, tmp_rotation_planet = rotation_planet][0]
    $('#around_axis').prev().slider("option", "value", rotation_planet * 100)
})

$('#around_axis').prev().on("slide", function (event, ui) {
    rotation_planet = ui.value / 100
})

$('#around_axis').click()
$('#fullscreen').click()
$('#camera_around').click()
let clicker = false
$('#show_user').click(function () {
    if (clicker) selected_click.scale.subScalar(0.4)
    else selected_click.scale.addScalar(0.4)
    clicker = !clicker
})