const container = document.getElementById("questionContainer");

questions.forEach((q,index)=>{
    let box = document.createElement("div");
    box.className = "question-box";

    box.innerHTML = `
        <div class="question-title">${q}</div>
        <div class="controls">
            <button class="record-btn">🎙 Start</button>
            <div class="circle">30</div>
            <div class="timer-text">30s</div>
            <button class="cue-btn">💡 Cue</button>
        </div>
        <div class="cue-text"></div>
        <div class="audio-container"></div>
    `;

    container.appendChild(box);

    const recordBtn = box.querySelector(".record-btn");
    const circle = box.querySelector(".circle");
    const timerText = box.querySelector(".timer-text");
    const cueBtn = box.querySelector(".cue-btn");
    const cueText = box.querySelector(".cue-text");
    const audioContainer = box.querySelector(".audio-container");

    let mediaRecorder;
    let chunks = [];
    let countdown;

    recordBtn.onclick = async ()=>{
        let timeLeft = 30;
        circle.textContent = timeLeft;
        timerText.textContent = timeLeft+"s";

        const stream = await navigator.mediaDevices.getUserMedia({audio:true});
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        chunks=[];

        mediaRecorder.ondataavailable = e => chunks.push(e.data);

        countdown = setInterval(()=>{
            timeLeft--;
            circle.textContent = timeLeft;
            timerText.textContent = timeLeft+"s";

            if(timeLeft<=0){
                clearInterval(countdown);
                mediaRecorder.stop();
            }
        },1000);

        mediaRecorder.onstop = ()=>{
            let blob = new Blob(chunks);
            let url = URL.createObjectURL(blob);

            audioContainer.innerHTML = `
                <audio controls src="${url}"></audio>
                <br>
                <a href="${url}" download="Q${index+1}.webm">Download</a>
            `;
        };
    };

    cueBtn.onclick = ()=>{
        let cueContent = cues[index+1] || "No cue available yet.";
        cueText.style.display = "block";
        cueText.textContent = cueContent;
    };
});