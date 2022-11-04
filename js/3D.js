import * as THREE from "three"
import {OrbitControls} from "OrbitControls"
import {GLTFLoader} from 'GLTFLoader'
import {RectAreaLightHelper} from "RectAreaLightHelper"
import {RectAreaLightUniformsLib} from 'RectAreaLightUniformsLib'
import Stats from 'Stats'

/*Мониторинг системы*/
const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

/*Сцена*/
const scene = new THREE.Scene()

/*Камера*/
const camera = new THREE.PerspectiveCamera(50, 1, 0.05, 5000)

/*Освещение*/
const ambientLight = new THREE.AmbientLight(0x404040, 1) // soft white light
scene.add(ambientLight)

const pointLight = new THREE.DirectionalLight(0xFFFFFF, 1.2)
pointLight.position.set(-10, 0, 0)
scene.add(pointLight)

const helper = new RectAreaLightHelper(pointLight)
scene.add(helper)

/*Рендер*/
const renderer = new THREE.WebGLRenderer()
document.body.querySelector('.container').appendChild(renderer.domElement)
//подогнать размер окна под рендер
const setSize = () => {
    let [width, height] = [$('.container').width(), $('.container').height()]
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
}
setSize()
$(window).resize(setSize)

/*Управление*/
const controls = new OrbitControls(camera, renderer.domElement)
// controls.autoRotate = true
// controls.enableDamping = true // придать вес
controls.enablePan = false
controls.minDistance = 3
controls.rotateSpeed = 0.4
controls.zoomSpeed = 1.7
controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: null,
    RIGHT: THREE.MOUSE.ROTATE
}

//скорость rotation и вес rotation в зависимости от кнопки мыши
$(".container").on("mousedown", function (event) {
    switch (event.which) {
        case 1:
            controls.rotateSpeed = 0.2
            controls.enableDamping = true
            break
        case 3:
            controls.rotateSpeed = 0.6
            controls.enableDamping = false
            break
    }
})

/*Менеджер загрузки*/
const loadingManager = new THREE.LoadingManager()
loadingManager.onProgress = () => {
    $('#loading').show()
    $('#loading').animate({transform: 'rotate(-90deg)'})
}
loadingManager.onLoad = () => {
    $('#loading').hide()
    camera.position.z = 8
    // gsap.fromTo(camera.position,
    //     {z: 358},
    //     {
    //         duration: 1.5,
    //         z: 8,
    //         ease: "power1.out",
    //         onComplete: () => controls.maxDistance = 80
    //     })
    animate()
}

/*Окружение*/
const uvTexture_env = new THREE.TextureLoader(loadingManager).load('textures/galaxy.png')
const geometry_env = new THREE.SphereGeometry(1000, 64, 32).scale(-1, 1, 1)
const environment = new THREE.Mesh(geometry_env, new THREE.MeshBasicMaterial({map: uvTexture_env}))
scene.add(environment)

/*Планеты*/
let resolutionPlanet = 10
let radiusPlanet = 2
const planet = new THREE.Mesh(new THREE.SphereGeometry(radiusPlanet, 128 * resolutionPlanet, 64 * resolutionPlanet))
scene.add(planet)

//текстуры
const textureLoader = new THREE.TextureLoader()
let [planetName, prefics] = ['', '']

function loadTextures() {
    const material = new THREE.MeshPhongMaterial()
    //обновление текстур
    for (let i in textures[planetName][prefics]) {
        let textureName = textures[planetName][prefics][i]
        switch (textureName.split('_')[0].split('.')[0]) {
            case 'color':
                material.displacementMap = textureLoader.load(`textures/${planetName}/` + textureName)
                material.displacementScale = 0.015
                material.map = textureLoader.load(`textures/${planetName}/` + textureName)
                break
            case 'normalMap':
                material.normalScale = new THREE.Vector2(2.85, -0.85)
                material.normalMap = textureLoader.load(`textures/${planetName}/` + textureName)
                break
            case 'specular':
                material.specular.set(0x333333)
                material.specularMap = textureLoader.load(`textures/${planetName}/` + textureName)
                break
            default:
                material.shininess = 18
            // material.transparent = true
            // material.opacity = 0.2
        }
    }
    return material
}

$('.planet-panel').on('click', 'li', function () {
    //сделать активной кнопку планеты
    $('.planet-panel li').not(this).removeClass('active')
    $(this).addClass('active')
    //выбрать планету
    planetName = $('.planet-panel li.active').text()
    //проверка на наличие формата текстур
    if (textures[planetName]['4K'] == undefined) {
        $('#4K').hide()
        prefics = '2K'
    } else {
        $('#4K').show()
        prefics = $('#4K').attr('class') == 'active' ? '4K' : '2K'
    }
    //обновить тектсуры
    planet.material = loadTextures()
    //загрузить участки
    planet.remove(plots)
    addPlots()
})

$('#4K').click(function () {
    planet.material = loadTextures()
})

/*Участки*/
const gltfLoader = new GLTFLoader()
let plots
let radiusUser = 0.1
let plotsProperties = {
    intersect: {color: 'yellow', opacity: {start: 0.3, end: 0}},
    selected: {color: 'red', opacity: {start: 0.7, end: 0}}
}
const geometry = new THREE.CircleGeometry(radiusUser, 32)

//вернуть центр меша
function getBounding(object) {
    let boundingPlot = object.geometry.boundingBox
    var middlePlot = new THREE.Vector3()
    middlePlot.x = (boundingPlot.max.x + boundingPlot.min.x) / 2
    middlePlot.y = (boundingPlot.max.y + boundingPlot.min.y) / 2
    middlePlot.z = (boundingPlot.max.z + boundingPlot.min.z) / 2
    return object.worldToLocal(middlePlot).normalize()
}

const addPlots = () => {
    gltfLoader.load(`models/${planetName}.glb`, (gltf) => {
        plots = gltf.scene
        plots.scale.setScalar(radiusPlanet + 0.02)
        plots.children.forEach((plot, index) => {
            plot.material = new THREE.MeshBasicMaterial({
                transparent: true, color: 0xfcba03
            })
            /*Владельцы участков*/
            let user = dataPlanet[planetName].plots[index].user
            if (user) {
                let userPosition = getBounding(plot)
                const userCircle = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
                    map: textureLoader.load('../images/icons/' + user[0]['logo']),
                    transparent: true,
                    side: THREE.DoubleSide
                }))
                userCircle.position.copy(userPosition.normalize().multiplyScalar(radiusPlanet / 2 + radiusUser))
                plot.add(userCircle)
            }
        })
        checkOpacityPlot()
        checkOpacityUser()
        planet.add(plots)
        let plotsName = []
        plots.children.forEach((plot, index) => {
            plotsName[index] = plot.name
        })
        $.ajax({
            method: "GET",
            url: "/php/setDataPlots.php",
            data: {
                'id_planet': $(`.planet-panel li:contains("${planetName}")`).attr('id'),
                'plotLength': plots.children.length,
                'planetName': planetName
            }
        })
    })
}

//Проверка на видимость участков
function checkOpacityPlot() {
    $('#plots').hasClass('active') ? plots.children.forEach((plot) => {
        plotsProperties.selected.opacity.end = plotsProperties.intersect.opacity.start
        plot.material.opacity = plotsProperties.intersect.opacity.start
    }) : plots.children.forEach((plot) => {
        plotsProperties.selected.opacity.end = 0
        plot.material.opacity = 0
    })
}

$('#plots').click(checkOpacityPlot)

//Проверка на видимость пользователей
function checkOpacityUser() {
    $('#show_user').hasClass('active') ? plots.children.forEach((plot) => {
        if (plot.children[0] && plot != selectedObject) plot.children[0].material.opacity = 1
    }) : plots.children.forEach((plot) => {
        if (plot.children[0] && plot != selectedObject) plot.children[0].material.opacity = 0
    })
}

$('#show_user').click(checkOpacityUser)

/*Функции для анимации*/

//Отслеживание наведения мышью
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2(-2, -2)
let [intersectObject, selectedObject] = [null, null]

// Обновлять положение мыши
function positionMouse(event) {
    mouse.x = (event.clientX / $('.container').width()) * 2 - 1
    mouse.y = -(event.clientY / $('.container').height()) * 2 + 1
}

function doubleClick() {
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(plots.children, false)
    if (intersects.length) {
        if (selectedObject) {
            selectedObject.material.opacity = plotsProperties.selected.opacity.end
            if (!$('#show_user').hasClass('active')) selectedObject.children.forEach((user) => user.material.opacity = 0)
        }
        selectedObject = intersects[0].object
        selectedObject.material.opacity = plotsProperties.selected.opacity.start
        selectedObject.children.forEach((user) => user.material.opacity = 1)
        intersectObject.material.color.set(plotsProperties.selected.color)

        let position = getBounding(selectedObject)
        gsap.to(camera.position, {
            duration: 0.8,
            x: position.x * (radiusPlanet * 2),
            y: position.y * (radiusPlanet * 2),
            z: position.z * (radiusPlanet * 2),
        })

    }
}

document.querySelector('.container').addEventListener('mousemove', positionMouse, false)
document.querySelector('.container').addEventListener('dblclick', doubleClick, false)

function intersectsUpdate() {
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(plots.children, false)
    if (intersects.length) {
        if (intersectObject != intersects[0].object) {
            if (intersectObject && intersectObject != selectedObject) intersectObject.material.opacity = plotsProperties.intersect.opacity.end + plotsProperties.selected.opacity.end
            intersectObject = intersects[0].object
            intersectObject.material.opacity = plotsProperties.intersect.opacity.start + plotsProperties.selected.opacity.end
            intersectObject.material.color.set(plotsProperties.intersect.color)
        }
    } else {
        if (intersectObject && intersectObject != selectedObject) intersectObject.material.opacity = plotsProperties.intersect.opacity.end + plotsProperties.selected.opacity.end
        intersectObject = null
    }
    if (selectedObject) {
        selectedObject.material.opacity = plotsProperties.selected.opacity.start
        selectedObject.material.color.set(plotsProperties.selected.color)
    }
}

//Рекурсивная функция рендеринга
function animate() {
    requestAnimationFrame(animate)
    stats.update()

    //юзеры смотрят в камеру
    plots.children.forEach((plot) => {
        if (plot.children[0]) plot.children[0].lookAt(camera.position)
    })

    //Пересечения с мышью
    intersectsUpdate()


    camera.lookAt(planet.position)
    renderer.render(scene, camera)
}

/*Настройки сцены*/
$('.planet-panel li:first-child').trigger('click')
