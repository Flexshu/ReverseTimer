const nameInput = document.getElementById('name');
const dateInput = document.getElementById('date');

class Timer{
    static idCounter = 0;
    static timers = [];

    constructor(name, date){
        this.id = Timer.idCounter;
        this.name = name;
        this.date = date;
    }

    get timeDiff(){
        return this.date.getTime() - Date.now();
    }

    get timeTillEvent(){
        const timeDiff = this.timeDiff;
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
    }

    createTimer(){
        const timerGroup = document.createElement('div');
        timerGroup.classList.add('timerGroup');
        timerGroup.innerHTML = `
            <h1 class="eventName">Time till ${this.name}:</h1>
            <h1 class="timer" id="timer${Timer.idCounter++}">${this.timeTillEvent}</h2>
        `;
        document.body.appendChild(timerGroup);
        this.updateTimer();
        Timer.timers.push(this);
        localStorage.setItem('timers', JSON.stringify(Timer.timers));
        localStorage.setItem('idCounter', Timer.idCounter);
        console.log(JSON.parse(localStorage.getItem('timers')));
    }

    updateTimer(){
        const timerElement = document.getElementById(`timer${this.id}`);
        const timeDiff = this.timeDiff;
        if (timeDiff < 0){
            timerElement.innerHTML = 'Event has already passed';
            return;
        }
        timerElement.innerHTML = this.timeTillEvent;
    }

    static updateTimers(){
        Timer.timers.forEach(timer => {timer.updateTimer();});
    }
}

function addTimer(){
    if (nameInput.value === '' || dateInput.value === '') return;
    const timer = new Timer(nameInput.value, new Date(dateInput.value));
    timer.createTimer();
    nameInput.value = '';
    dateInput.value = '';
}

setInterval(Timer.updateTimers, 1000);

function deleteTimers(){
    Timer.timers = [];
    document.querySelectorAll('.timerGroup').forEach(timerGroup => {
        timerGroup.remove();
    });
    localStorage.removeItem('timers');
    localStorage.removeItem('idCounter');
    Timer.idCounter = 0;
}

function loadTimers(){
    Timer.idCounter = parseInt(localStorage.getItem('idCounter')) || 0;
    const savedTimers = JSON.parse(localStorage.getItem('timers')) || [];
    Timer.timers = savedTimers.map(data => {
        const timer = new Timer(data.name, new Date(data.date));
        timer.id = data.id;
        return timer;
    });
    Timer.timers.forEach(timer => {
        const timerGroup = document.createElement('div');
        timerGroup.classList.add('timerGroup');
        timerGroup.innerHTML = `
            <h1 class="eventName">Time till ${timer.name}:</h1>
            <h1 class="timer" id="timer${timer.id}">${timer.timeTillEvent}</h2>
        `;
        document.body.appendChild(timerGroup);
        timer.updateTimer();
    });
}
loadTimers();