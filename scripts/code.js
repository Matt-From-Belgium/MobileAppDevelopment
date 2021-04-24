let globalSettings={
    favorietLand:"",
    favorietekleur:"",
};

let speelData = [];

class Match{
    constructor(thuisploeg,uitploeg) {
        this.thuisploeg = thuisploeg;
        this.uitploeg = uitploeg;
        this.thuisscore = 0;
        this.uitscore = 0;
    }
}

class speeldag{
    constructor() {
        this.matchen = [];

    }

}

$( document ).ready(function(){
    $("#speelDataListView").listview();
    $("#speeldagMatchListView").listview();
    loadSettings();
    loadData();
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

const loadData = () =>{
    let speelDataString = localStorage.getItem("speelData");
    if(speelDataString !== null){
        speelData = JSON.parse(speelDataString);
        console.log("speeldata geladen")
    }
    else{
        console.log('geen speeldata gevonden => creëren');
        let speeldag1 = new speeldag();
        speeldag1.matchen.push(new Match("België","Algerije"));
        speeldag1.matchen.push(new Match("Rusland","Zuid-Korea"));

        let speeldag2 = new speeldag();
        speeldag2.matchen.push(new Match("België","Rusland"));
        speeldag2.matchen.push(new Match("Zuid-Korea","Algerije"));

        speelData.push(speeldag1);
        speelData.push(speeldag2);

        localStorage.setItem("speelData",JSON.stringify(speelData));

        console.log("speeldata aangemaakt");

    }

        for(let speeldag in speelData){
            let li = document.createElement("li");
            $(li).jqmData("speeldag-index",speeldag);


            let a = document.createElement("a");
            $(a).text(speeldag);
            a.href="#pageSpeeldag";

            $(li).append(a);

            $(li).click(loadSpeeldag)

            $("#speelDataListView").append(li);
            $("#speelDataListView").listview("refresh");

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

const loadSpeeldag = (e) =>{
    
    let target = e.currentTarget;
    let speeldagIndex = $(target).jqmData("speeldag-index");
    let speeldag = speelData[speeldagIndex];

    let matchlist = $("#speeldagMatchListView");
    $(matchlist).empty();

    for(let match in speeldag.matchen){
        let newLi = document.createElement("li");
        let newA = document.createElement("a");
        newA.href="#pageSpeelveld";
        newA.innerText= speeldag.matchen[match].thuisploeg + "- " + speeldag.matchen[match].uitploeg + " : " + speeldag.matchen[match].thuisscore + " - "+ speeldag.matchen[match].uitscore;

        newLi.appendChild(newA);
        $(matchlist).append(newLi);
    }

    matchlist.listview("refresh");



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
