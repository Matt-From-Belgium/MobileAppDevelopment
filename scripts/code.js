let globalSettings={
    favorietLand:"",
    favorietekleur:"",
};

$( document ).ready(function(){
    loadSettings();
    prepareSpeelVeld();
    console.log('document ready');

    $('#formFavorietLand').submit(()=>{
        saveSettings();
    })
})

const saveSettings = () => {
    globalSettings.favorietLand = document.getElementById("favorietland").value;
    globalSettings.favorietekleur = document.getElementById('kleur').value;

    localStorage.setItem('Instellingen',JSON.stringify(globalSettings));
    console.log("instellingen opgeslagen");
}

const loadSettings = () => {
    let settings = localStorage.getItem('Instellingen');
    if(settings !== null){
        globalSettings = JSON.parse(settings);
        console.log("settings geladen");
    }
    else
    {
        console.log("geen settings gevonden");
    }
}

const prepareSpeelVeld = () =>{


    let speelveld = document.getElementById("speelveld");
    speelveld.style.display='block';
    speelveld.style.width = window.innerWidth + "px";
    speelveld.style.height = window.innerHeight + "px";

    setTimeout(()=>{
        startGame()
    },500);
}

const addBall = () =>{

}

const startGame = () => {
    let speelveld = document.getElementById("speelveld");

    let bal = document.createElement("img");
    bal.id="bal";
    bal.src='images/ball.png';

    bal.style.left = ((speelveld.clientWidth - bal.offsetWidth)/2)+'px';
    bal.style.top = ((speelveld.clientHeight - bal.offsetHeight)/2)+'px';

    speelveld.appendChild(bal);

    let goalThuisploeg = document.createElement("div");
    goalThuisploeg.classList.add("goal");
    goalThuisploeg.style.width=speelveld.offsetWidth*0.4+'px';
    goalThuisploeg.style.height=speelveld.offsetHeight*0.1+'px';
    goalThuisploeg.innerText="Thuisploeg";
    goalThuisploeg.style.top='0px';
    goalThuisploeg.style.left = (speelveld.clientWidth - (speelveld.offsetWidth*0.4))/2+'px';

    let goalUitploeg = document.createElement("div");
    goalUitploeg.classList.add("goal");
    goalUitploeg.style.width=speelveld.offsetWidth*0.4+'px';
    goalUitploeg.style.height=speelveld.offsetHeight*0.1+'px';
    goalUitploeg.innerText="uitploeg";
    goalUitploeg.style.top=speelveld.clientHeight - (speelveld.offsetHeight*0.1) + 'px';
    goalUitploeg.style.left = (speelveld.clientWidth - (speelveld.offsetWidth*0.4))/2+'px';

    speelveld.appendChild(goalThuisploeg);
    speelveld.appendChild(goalUitploeg);
}
