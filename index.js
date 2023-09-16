console.log("first")
const canvas = document.querySelector("canvas"),
    ctx = canvas.getContext("2d"),
    sizeSlider = document.querySelector("#size-slider"),
    colorBtns = document.querySelectorAll(".colors .option"),
    colorPicker = document.querySelector("#color-pick"),
    clearCanvas=document.querySelector(".clear-canvas"),
    saveImg=document.querySelector(".save-img")

let prevX, prevY, snapshot,
    isDrawing = false, brushWidth = 5,
    selectedTool = "brush",
    selectedColor = "#000";

const setCanvasBg=()=>{
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle=selectedColor;
}

const toolbtns = document.querySelectorAll(".tool")
const fillColor = document.querySelector("#fill-color")

window.addEventListener("load", () => {
    canvas.height = canvas.offsetHeight;
    canvas.width = canvas.offsetWidth;
    setCanvasBg();
})

const drawRect = (e) => {
    if (!fillColor.checked) {
        return ctx.strokeRect(e.offsetX, e.offsetY, prevX - e.offsetX, prevY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, prevX - e.offsetX, prevY - e.offsetY)
}

const drawTriangle = (e) => {
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(prevX * 2 - e.offsetX, e.offsetY);
    ctx.closePath();
    fillColor.checked ? ctx.fill() :
        ctx.stroke();
}

const drawCircle = (e) => {
    ctx.beginPath();
    let radius = Math.sqrt((Math.pow(prevX - e.offsetX), 2) + Math.pow((prevY - e.offsetY), 2))
    ctx.arc(prevX, prevY, radius, 0, 2 * Math.PI);
    fillColor.checked ? ctx.fill() : ctx.stroke()
}

const startDraw = (e) => {
    isDrawing = true;
    prevX = e.offsetX; //current mouseX
    prevY = e.offsetY; //current mouseY
    ctx.beginPath();
    ctx.strokeStyle = selectedColor
    ctx.fillStyle = selectedColor
    ctx.lineWidth = brushWidth;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
}
const drawing = (e) => {
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0)
    if (selectedTool == "brush" || selectedTool == "eraser") {
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke()
    }
    else if (selectedTool == "rectangle") {
        drawRect(e)
    }
    else if (selectedTool == "circle") {
        drawCircle(e)
    }
    else {
        drawTriangle(e)
    }
}

toolbtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // removing active class from previous element
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active")
        selectedTool = btn.id
        console.log(btn.id)
    })
})

sizeSlider.addEventListener("change", () => {
    brushWidth = sizeSlider.value
})

colorBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected")
        btn.classList.add("selected")
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color")
    })
})

colorPicker.addEventListener("change", () => {
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click()
})

clearCanvas.addEventListener("click",()=>{
    ctx.clearRect(0,0,canvas.width ,canvas.height);
    setCanvasBg();
})

saveImg.addEventListener("click",()=>{
    const link = document.createElement("a");
    link.download=`${Date.now()}.jpg`;
    link.href=canvas.toDataURL();
    link.click();
})

canvas.addEventListener("mousedown", startDraw)
canvas.addEventListener("mousemove", drawing)
canvas.addEventListener("mouseup", () => {
    isDrawing = false
})