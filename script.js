const g_pixelMax = 300;


let g_cellOnLine = 20;
let g_recSizeX = g_pixelMax / g_cellOnLine;
let g_recSizeY = g_pixelMax / g_cellOnLine;

let g_refreshSpeed = 500;
const g_maxSpeed = 1000;

let g_ctx = null;
let g_process = null;

let g_data = null;
let g_frame = 0;

let g_height = 0;
let g_width = 0;

const check = () => {
    // Check for the various File API support.
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
    // Instantiate a slider
    var mySlider = new Slider("input.slider", {
        min: 10,
        max: g_maxSpeed,
        value: g_refreshSpeed,
        scale: 'logarithmic',
        step: 5
    });

    document.getElementById("slider-value").textContent = g_refreshSpeed;

    mySlider.on("change", (sliderValue) => {
        document.getElementById("slider-value").textContent = sliderValue.newValue;
        g_refreshSpeed = sliderValue.newValue;
    });
}

const draw = () => {
    const canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        g_ctx = canvas.getContext('2d');
        g_ctx.clearRect(0, 0, 300, 300);
        g_ctx.save();
        drawGrid();
        g_ctx.restore();
    }
}

const start = () => {
    if (g_process) stop();
    nextFrame();
}

const stop = () => {
    if (!g_process) return;
    clearTimeout(g_process);
    g_process = null;
}

const reset = () => {
    stop();
    g_frame = 0;
}

const restart = () => {
    reset();
    start();
}

const drawGrid = () => {
    for (let y = 0; y < g_height; y++) {
        for (let x = 0; x < g_width; x++) {
            g_ctx.fillStyle = getState(x, y);
            g_ctx.fillRect(x * g_recSizeX, y * g_recSizeY, g_recSizeX, g_recSizeY);
        }
    }
    g_frame += g_height + 1;
    if (g_frame >= g_data.length) {
        reset();
        console.log('--END-ANIMATION--');
    }
}

const updateFilePlaceHolder = () => {
    const selectedFile = document.getElementById('inputGroupFile01').files[0];
    console.log(selectedFile);
    document.getElementById('inputGroupFile01-label').innerHTML = selectedFile.name;

    readFile(selectedFile);
}

const getRandomColor = () => {
    return Math.floor(Math.random() * Math.floor(2)) == 0 ? 'rgba(0, 0, 200, 0.5)' : 'rgb(200, 0, 0)';
}

const getState = (x, y) => {
    return g_data[y + g_frame][x] === '0' ? 'rgba(0, 0, 200, 0.5)' : 'rgb(200, 0, 0)';
}

const nextFrame = () => {
    g_process = setTimeout(() => {
        if (g_data) { window.requestAnimationFrame(draw); }
        nextFrame();
    }, g_maxSpeed - g_refreshSpeed);
}

const readFile = (file) => {

    var reader = new FileReader();
    reader.readAsText(file);

    reader.onload = () => {
        parseFileData(reader.result);
    };

    reader.onerror = () => {
        console.log(reader.error);
    };
}

const parseFileData = (data) => {
    const datalist = data
        .split(/\r/)
        .join((' '))
        .split(/\n/);
    const result = new Array();
    datalist.forEach(line => {
        result.push(line
            .trimLeft()
            .trimRight()
            .split(' '));
    });

    g_frame = 0;
    g_data = result;
    g_height = 0;
    g_width = g_data[0].length;
    for (let i = 0; i < g_data.length; i++) {
        if (g_data[i].length !== g_width) break;
        g_height++;
    }
    if (g_data[length - 1] !== g_width) g_data.pop();
    g_recSizeY = g_pixelMax / g_height;
    g_recSizeX = g_pixelMax / g_width;
}
