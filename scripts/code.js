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

    let goalThuisploeg = document.createElement("div");
    goalThuisploeg.id="goalThuisploeg";

    $(goalThuisploeg).width($("#speelveld").innerWidth()*0.5);
    $(goalThuisploeg).height(50);
    $(goalThuisploeg).addClass("goal");
    $(goalThuisploeg).css('top',0);
    $(goalThuisploeg).css('left',($("#speelveld").innerWidth() - $(goalThuisploeg).innerWidth())/2);


    let goalUitploeg = document.createElement("div");
    goalUitploeg.id="goalUitploeg";

    $(goalUitploeg).width($("#speelveld").innerWidth()*0.5);
    $(goalUitploeg).height(50);
    $(goalUitploeg).addClass("goal");
    $(goalUitploeg).css('top',$("#speelveld").innerHeight() - $(goalUitploeg).innerHeight());
    $(goalUitploeg).css('left',($("#speelveld").innerWidth() - $(goalUitploeg).innerWidth())/2);

    speelveld.append(goalThuisploeg);
    speelveld.append(goalUitploeg);
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
        $(newLi).jqmData("match-index", match);
        $(newLi).jqmData('speeldag-index', speeldag);
        $(newLi).click((e)=>{
            loadMatch(e)
        })
    }

    matchlist.listview("refresh");

const loadMatch=(e)=>{
    let target = e.currentTarget;
    let match = $(target).jqmData('match-index');
    let speeldag = $(target).jqmData('speeldag-index');


    startGame(speeldag.matchen[match]);
}

}

const startGame = (match) => {
    let speelveld = $("#speelveld");


    let bal = document.createElement("img");
    $(bal).attr("src","images/ball.png");
    $(bal).attr("id","bal");

    let ballLeftPos = ($("#speelveld").innerWidth() - $(bal).innerWidth())/2;
    let ballTopPos = ($("#speelveld").innerHeight() - $(bal).innerHeight())/2;

    $(bal).css("left",ballLeftPos);
    $(bal).css("top",ballTopPos);

    let goalThuisploeg = document.getElementById("goalThuisploeg")
    $(goalThuisploeg).text(match.thuisploeg);
    
    let goalUitploeg = document.getElementById("goalUitploeg")
    $(goalUitploeg).text(match.uitploeg);

    speelveld.append(bal);




}
