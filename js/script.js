let timeEl = document.getElementById("time");
let doAudioEl = document.getElementById("doAudio");
let sliderEl = document.getElementById("slider");

let freq = 440;
let d;
let text;
let timedelta;

const synth = window.speechSynthesis;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

window.addEventListener("keypress", (e)=>{if(e.code == "Enter" || e.code == "Space") doAudioEl.checked = (doAudioEl.checked? false:true);});

async function getInitTime() {
    let now = Date.now();
    let x = await fetch("https://use.ntpjs.org/v1/time.json");
    let y = await x.json();
    timedelta = now-(y["now"]*1000);
    console.log(`Timedelta: ${timedelta}`);
}

function timeCallback(){
    console.log("Beep");
    let oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    setTimeout(()=>{oscillator.stop();}, 100);
}
function speakTime(){
    setTimeout(timeCallback, 3000)
    let time = new Date(d.getTime() + 3000);
    let msg = time.toLocaleTimeString("no-NO");
    console.log(msg);

    var utterThis = new SpeechSynthesisUtterance('Klokken er '+msg);
    utterThis.lang = "nb-NO";

    synth.speak(utterThis);
}
function updateTime(){
    d = new Date(Date.now()-timedelta);
    oldText = text;
    text = d.toLocaleTimeString("no-NO");
    if(oldText != text){
        timeEl.innerHTML = text;
        if (text.slice(-1) == 7 && doAudioEl.checked) speakTime();
    }
    window.requestAnimationFrame(updateTime);
}
getInitTime()
window.requestAnimationFrame(updateTime);