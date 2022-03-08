
window.addEventListener('load', () => {
    // console.log(resizeImageData)
    const canvas = document.querySelector('#canvas')
    const ctx = canvas.getContext('2d')
    const predictBtn = document.querySelector('#button1')
    const clearBtn = document.querySelector('#button2')
    const predictionText = document.querySelector('.prediciton')

    canvas.width = window.innerHeight / 2
    canvas.height = window.innerHeight / 2
    ctx.filter = "grayscale(1)";
    offsetX = canvas.getBoundingClientRect().x
    offsetY = canvas.getBoundingClientRect().y


    let digit_model
    let img_data

    function preprocessCanvas(image) {
        // resize the input image to target size of (1, 28, 28)
        let tensor = tf.browser.fromPixels(image)
            .resizeNearestNeighbor([28, 28])
            .mean(2)
            .expandDims(2)
            .expandDims()
            .toFloat();
        // console.log(tensor)
        return tensor.div(255.0);
    }

    const imageLoad = async () => {

        let imageData = canvas.toDataURL()
        let tensor = preprocessCanvas(canvas)
        let predictions = await digit_model.predict(tensor).data()
        let results = Array.from(predictions)
        let maxResult = Math.max(...results)
        predictionText.textContent = results.indexOf(maxResult)

    }


    const modelLoad = async () => {
        digit_model = await tf.loadLayersModel('./models/model.json')

    }



    modelLoad()
    predictBtn.addEventListener('click', imageLoad);

    let painting = false;

    function startPosition(e) {
        painting = true
        draw(e)
    }

    function finishedPosition() {
        painting = false;
        ctx.beginPath()
    }

    function draw(e) {
        if (!painting) return
        // console.log("drawing now")
        ctx.lineWidth = 10
        ctx.lineCap = "round"
        ctx.strokeStyle = "white"
        ctx.lineTo(e.clientX - offsetX, e.clientY - offsetY)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(e.clientX - offsetX, e.clientY - offsetY)
    }
    canvas.addEventListener('mousedown', startPosition)
    canvas.addEventListener('mouseup', finishedPosition)
    canvas.addEventListener('mousemove', (e) => draw(e))
    const clearCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        predictionText.textContent = ""
    }

    clearBtn.addEventListener('click', clearCanvas)
})
