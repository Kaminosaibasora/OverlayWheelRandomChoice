// Récupérer le canvas et son contexte
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// Définir les paramètres
var centerX = canvas.width / 2;
var centerY = canvas.height / 2;
var radius = canvas.height / 2;

let div = document.getElementById("choix")
// var words = [
//     "EAU", "Bière", "Calvados", "Jus d'orange", 
//     // "Mot 6", "Mot 7", "Mot 8", "Mot 9", "Mot 10"
// ];
var words = div.textContent.split(", ");
var data = []
var numSlices = words.length;
var sliceAngle = Math.PI*2 / numSlices;
let angleWord = 360 / words.length;
var spinTimeout = null;
var spinTime = 0;
var spinTimeTotal = 0;


let configData = () => {
    data = []
    words = shuffleArray(words)
    words.forEach(w => {
        data.push({
            word : w,
            angle: 0
        });
    });
    for (let i = 0; i < data.length; i++) {
        data[i].angle = i * angleWord;
        // console.log(data[i].word + " - " + data[i].angle + " : " + data[i].alpha);
    }
}

// Fonction pour dessiner la roue
let drawRouletteWheel = ( decalage ) => {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.save();
    ctx.fillStyle = "red";
    // console.log("==================== "+centerX + " - " + centerY);
    ctx.translate(centerX, centerY);
    ctx.rotate(decalage);
    ctx.font = "17px Arial";
    data.forEach(w => {
        // console.log(w.word + " - " + w.angle);
        ctx.fillText(w.word, centerX/2, 0, centerX/2);
        ctx.rotate(sliceAngle);
    });
    ctx.restore();
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, 0-(sliceAngle/2), sliceAngle-(sliceAngle/2));
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + radius * Math.cos(sliceAngle-(sliceAngle/2)), centerY + radius * Math.sin(sliceAngle-(sliceAngle/2))); // Dessine une ligne vers le point final de l'arc
    ctx.stroke()
}

// Fonction pour faire tourner la roue
let spinWheel = () => {
    configData()
    drawRouletteWheel(0);
    spinTime = 0;
    spinTimeTotal = getRandomInt(data.length*2, data.length*6);
    console.log("####### " + spinTimeTotal + " ######");
    rotateWheel();
}

let rotateWheel = () => {
    spinTime += 1;
    if (spinTime >= spinTimeTotal) {
        clearTimeout(spinTimeout);
        getWinner();
        return;
    }
    // console.log("-------------- " + spinTime + " -------------");
    data.forEach( w => {
        w.angle = w.angle + angleWord;
        if (w.angle >= 360) {
            w.angle -=360;
        }
    })
    let biais = 1;
    if (spinTime < (spinTimeTotal/2)) {
        biais = 0.4
    }
    if (spinTime > (spinTimeTotal/5*4)) {
        biais = 2
    }
    if (spinTime > (spinTimeTotal/10*9)) {
        biais = 4
    }
    drawRouletteWheel(sliceAngle * (spinTime-0.25));
    setTimeout('drawRouletteWheel(sliceAngle * (spinTime-0.5));', 15*biais)
    setTimeout('drawRouletteWheel(sliceAngle * (spinTime-0.75));', 30*biais)
    setTimeout('drawRouletteWheel(sliceAngle * spinTime);', 45*biais)
    spinTimeout = setTimeout('rotateWheel()', 60*biais);
}

let getWinner = () => {
    data.forEach( (w) => {
        if (w.angle == 0) {
            console.log(w.word + " is the Winner !");
        }
    });
}

let getRandomInt = (x, y) => {
    let min = Math.ceil(x);
    let max = Math.floor(y);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

configData()
drawRouletteWheel(0);
