<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>My first three.js app</title>
    <link rel="stylesheet" href="../index.css">
    <script src="https://code.jquery.com/jquery-3.6.0.js"></script>
    <link href="https://code.jquery.com/ui/1.10.4/themes/ui-lightness/jquery-ui.css"
          rel="stylesheet">
    <script src="https://code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.3/gsap.min.js"></script>
</head>
<body>

<div class="work-panel">
    <div class="container"></div>
    <svg id="loading" xmlns="http://www.w3.org/2000/svg" height="80" width="80" viewBox="0 0 48 48">
        <path d="M15.8 41h16.4v-6.35q0-3.5-2.375-6.025Q27.45 26.1 24 26.1t-5.825 2.525Q15.8 31.15 15.8 34.65ZM8 44v-3h4.8v-6.35q0-3.5 1.825-6.425T19.7 24q-3.25-1.3-5.075-4.25Q12.8 16.8 12.8 13.3V7H8V4h32v3h-4.8v6.3q0 3.5-1.825 6.45T28.3 24q3.25 1.3 5.075 4.225Q35.2 31.15 35.2 34.65V41H40v3Z"/>
    </svg>
    <il class="help-panel">
        <li>
            <img src="/images/left%20click.svg" alt="">
            <i>--- режим <b>медленного</b> вращения</i>
        </li>
        <li>
            <img src="/images/right%20click.svg" alt="">
            <i>--- режим <b>быстрого</b> вращения</i>
        </li>
    </il>
    <il class="planet-panel"></il>
    <div class="action-panel">
        <svg class="buttons_activate" id="fullscreen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" height="48"
             width="48">
            <path d="M28.85 34.3h9.55v-9.7h-3v6.7h-6.55ZM9.65 23.4h3v-6.7h6.55v-3H9.65ZM7 40q-1.2 0-2.1-.9Q4 38.2 4 37V11q0-1.2.9-2.1Q5.8 8 7 8h34q1.2 0 2.1.9.9.9.9 2.1v26q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h34V11H7v26Zm0 0V11v26Z"/>
        </svg>
        <div class="block_move">
            <div class="slider_speed_arround"></div>
            <svg id="around_axis" xmlns="http://www.w3.org/2000/svg" height="48" width="48">
                <path d="M22.55 41.9q-6.15-.5-10.35-5.05Q8 32.3 8 26.05q0-3.85 1.775-7.25t4.975-5.55l2.15 2.15q-2.8 1.65-4.35 4.525Q11 22.8 11 26.05q0 5 3.3 8.65 3.3 3.65 8.25 4.2Zm3 0v-3q5-.6 8.25-4.225 3.25-3.625 3.25-8.625 0-5.45-3.775-9.225Q29.5 13.05 24.05 13.05h-1l3 3-2.15 2.15-6.65-6.65L23.9 4.9l2.15 2.15-3 3h1q6.7 0 11.35 4.675 4.65 4.675 4.65 11.325 0 6.25-4.175 10.8Q31.7 41.4 25.55 41.9Z"/>
            </svg>
        </div>
        <div class="block_move">
            <div class="slider_speed_arround"></div>
            <svg id="camera_around" xmlns="http://www.w3.org/2000/svg" height="48" width="48">
                <path d="M8.35 40v-3h6.5l-.75-.6q-3.2-2.55-4.65-5.55-1.45-3-1.45-6.7 0-5.3 3.125-9.525Q14.25 10.4 19.35 8.8v3.1q-3.75 1.45-6.05 4.825T11 24.15q0 3.15 1.175 5.475 1.175 2.325 3.175 4.025l1.5 1.05v-6.2h3V40Zm20.35-.75V36.1q3.8-1.45 6.05-4.825T37 23.85q0-2.4-1.175-4.875T32.75 14.6l-1.45-1.3v6.2h-3V8h11.5v3h-6.55l.75.7q3 2.8 4.5 6t1.5 6.15q0 5.3-3.1 9.55-3.1 4.25-8.2 5.85Z"/>
            </svg>
        </div>
        <svg class="buttons_activate" id="grid" xmlns="http://www.w3.org/2000/svg" height="48" width="48">
            <path d="M10.75 44v-6.75H4v-3h6.75V25.5H4v-3h6.75v-8.75H4v-3h6.75V4h3v6.75h8.75V4h3v6.75h8.75V4h3v6.75H44v3h-6.75v8.75H44v3h-6.75v8.75H44v3h-6.75V44h-3v-6.75H25.5V44h-3v-6.75h-8.75V44Zm3-9.75h8.75V25.5h-8.75Zm11.75 0h8.75V25.5H25.5ZM13.75 22.5h8.75v-8.75h-8.75Zm11.75 0h8.75v-8.75H25.5Z"/>
        </svg>
        <div class="block_move">
            <div class="slider_speed_arround"></div>
            <svg id="sound" xmlns="http://www.w3.org/2000/svg" height="48" width="48">
                <path d="M28 41.45v-3.1q4.85-1.4 7.925-5.375T39 23.95q0-5.05-3.05-9.05-3.05-4-7.95-5.35v-3.1q6.2 1.4 10.1 6.275Q42 17.6 42 23.95t-3.9 11.225Q34.2 40.05 28 41.45ZM6 30V18h8L24 8v32L14 30Zm21 2.4V15.55q2.75.85 4.375 3.2T33 24q0 2.85-1.65 5.2T27 32.4Zm-6-16.8L15.35 21H9v6h6.35L21 32.45ZM16.3 24Z"/>
            </svg>
        </div>
        <svg class="buttons_activate" id="shadow" xmlns="http://www.w3.org/2000/svg" height="48" width="48">
            <path d="M24 42q-3.75 0-7.025-1.425-3.275-1.425-5.7-3.85-2.425-2.425-3.85-5.7Q6 27.75 6 24q0-3.75 1.425-7.025 1.425-3.275 3.85-5.7 2.425-2.425 5.7-3.85Q20.25 6 24 6q3.75 0 7.025 1.425 3.275 1.425 5.7 3.85 2.425 2.425 3.85 5.7Q42 20.25 42 24q0 3.75-1.425 7.025-1.425 3.275-3.85 5.7-2.425 2.425-5.7 3.85Q27.75 42 24 42Zm-5.6-4.1q-2.15-2.65-3.275-6.225Q14 28.1 14 24t1.15-7.675Q16.3 12.75 18.4 10.1q-4.3 1.75-6.85 5.525Q9 19.4 9 24t2.55 8.375Q14.1 36.15 18.4 37.9Zm6.95 1.05q5.45-.5 9.275-4.325t4.325-9.275Zm-2.2-.65 15.8-15.8q-.1-1-.325-1.95T38 18.65l-17.3 17.3q.55.7 1.15 1.275.6.575 1.3 1.075Zm-3.6-4.05L37.1 16.7q-.4-.7-.9-1.375T35.15 14L18.1 31.05q.25.8.6 1.575.35.775.85 1.625ZM17.5 28.9l16.25-16.3q-.7-.55-1.4-1.025-.7-.475-1.45-.875L17 24.6q.05 1.15.15 2.2.1 1.05.35 2.1Zm-.4-7.25 11.85-11.8q-1.1-.4-2.225-.6Q25.6 9.05 24.45 9q-3.1 1.65-5 4.95-1.9 3.3-2.35 7.7Z"/>
        </svg>
        <svg class="buttons_activate" id="4K" xmlns="http://www.w3.org/2000/svg" height="48" width="48">
            <path d="M33.8 28h2v-3.15H39V23.2h-3.2V20h-2v3.2h-3.15v1.65h3.15Zm-10.3 2H26v-4.5l4.2 4.5h3.3l-5.6-6 5.6-6h-3.3L26 22.5V18h-2.5Zm-6.35 0h2.5v-3.15h2v-2.5h-2V18h-2.5v6.35H14V18h-2.5v8.85h5.65ZM9 42q-1.2 0-2.1-.9Q6 40.2 6 39V9q0-1.2.9-2.1Q7.8 6 9 6h30q1.2 0 2.1.9.9.9.9 2.1v30q0 1.2-.9 2.1-.9.9-2.1.9Zm0-3h30V9H9v30ZM9 9v30V9Z"/>
        </svg>
        <svg class="buttons_activate" id="show_user" xmlns="http://www.w3.org/2000/svg" height="48" width="48">
            <path d="M22.05 23q-3.15 0-5.35-2.2-2.2-2.2-2.2-5.3 0-3.15 2.2-5.325Q18.9 8 22 8q3.15 0 5.325 2.175Q29.5 12.35 29.5 15.45q0 3.15-2.175 5.35Q25.15 23 22.05 23ZM22 20q1.9 0 3.2-1.325 1.3-1.325 1.3-3.175 0-1.9-1.3-3.2-1.3-1.3-3.15-1.3-1.9 0-3.225 1.3-1.325 1.3-1.325 3.15 0 1.9 1.325 3.225Q20.15 20 22 20Zm22.9 27-7-7q-1.15.85-2.375 1.175Q34.3 41.5 33 41.5q-3.55 0-6.025-2.475Q24.5 36.55 24.5 33q0-3.55 2.475-6.025Q29.45 24.5 33 24.5q3.55 0 6.025 2.475Q41.5 29.45 41.5 33q0 1.3-.325 2.525Q40.85 36.75 40 37.9l7 7ZM33 38.5q2.35 0 3.925-1.575Q38.5 35.35 38.5 33q0-2.35-1.575-3.925Q35.35 27.5 33 27.5q-2.35 0-3.925 1.575Q27.5 30.65 27.5 33q0 2.35 1.575 3.925Q30.65 38.5 33 38.5ZM6 40v-4.7q0-1.85.875-3.15Q7.75 30.85 9.4 30q2.35-1.15 6.125-2.175t7.675-.775q-.4.65-.75 1.425T21.9 30q-3.9-.05-6.8.925-2.9.975-4.5 1.775-.7.4-1.15 1.075Q9 34.45 9 35.3V37h12.9q.55.85 1 1.575.45.725 1 1.425Zm16-24.5ZM21.9 37Z"/>
        </svg>
        <svg class="buttons_activate" id="plots" xmlns="http://www.w3.org/2000/svg" height="48" width="48">
            <path d="M34.6 42q-3.1 0-5.25-2.15T27.2 34.6q0-3.1 2.15-5.25t5.25-2.15q3.1 0 5.25 2.15T42 34.6q0 3.1-2.15 5.25T34.6 42Zm0-3q1.9 0 3.15-1.25T39 34.6q0-1.9-1.25-3.15T34.6 30.2q-1.9 0-3.15 1.25T30.2 34.6q0 1.9 1.25 3.15T34.6 39Zm0-4.4Zm-21.2.9q-3.1 0-5.25-2.15T6 28.1q0-3.1 2.15-5.25t5.25-2.15q3.1 0 5.25 2.15t2.15 5.25q0 3.1-2.15 5.25T13.4 35.5Zm0-3q1.85 0 3.125-1.275T17.8 28.1q0-1.85-1.275-3.125T13.4 23.7q-1.85 0-3.125 1.275T9 28.1q0 1.85 1.275 3.125T13.4 32.5Zm0-4.4Zm8.45-9.3q-3.1 0-5.25-2.15t-2.15-5.25q0-3.1 2.15-5.25T21.85 4q3.1 0 5.25 2.15t2.15 5.25q0 3.1-2.15 5.25t-5.25 2.15Zm0-3q1.9 0 3.15-1.25t1.25-3.15q0-1.9-1.25-3.15T21.85 7q-1.9 0-3.15 1.25t-1.25 3.15q0 1.9 1.25 3.15t3.15 1.25Zm0-4.4Z"/>
        </svg>
        <script>
            $('.buttons_activate').click(function () {
                $(this).toggleClass('active')
            })
            $(".slider_speed_arround").slider({
                range: "min",
                min: 0.1,
                max: 4,
                step: (4 - 0.1) / 100,
                value: 1,
                orientation: "vertical"
            });
            $('.block_move').hover(function () {
                $(this).find('.slider_speed_arround').stop().slideDown('fast');
            }, function () {
                $(this).find('.slider_speed_arround').stop().slideUp('fast');
            });
            $('#sound, #around_axis').prev().slider({
                min: 0,
                max: 1,
                value: 0.4,
                step: (4 - 0.1) / 100,
            });
        </script>
    </div>
</div>
<script>
    var textures = {}
    var dataPlanet = {}
    $.ajax({
        method: "GET",
        context: $('.planet-panel'),
        url: "php/get_data_planet.php",
        dataType: "JSON"
    }).done(function (data) {
        dataPlanet = data
        for (var i in data) {
            let row = data[i]
            textures[row['name']] = row['textures']
            $(this).append(`<li id="${row['id_planet']}">${row['name']}</li>`)
        }
    })
</script>
<script type="importmap">
        {
            "imports": {
                "three": "https://unpkg.com/three@0.139.0/build/three.module.js",
                "OrbitControls": "https://unpkg.com/three@0.146.0/examples/jsm/controls/OrbitControls.js",
                "GLTFLoader": "https://unpkg.com/three@0.146.0/examples/jsm/loaders/GLTFLoader.js",
                "RectAreaLightHelper": "https://unpkg.com/three@0.146.0/examples/jsm/helpers/RectAreaLightHelper.js",
                "RectAreaLightUniformsLib": "https://unpkg.com/three@0.146.0/examples/jsm/lights/RectAreaLightUniformsLib.js",
                "RGBELoader": "https://unpkg.com/three@0.146.0/examples/jsm/loaders/RGBELoader.js",
                "Stats": "https://unpkg.com/three@0.146.0/examples/jsm/libs/stats.module.js"
            }
        }
</script>
<script type="module" src="js/3D.js"></script>

</body>
</html>