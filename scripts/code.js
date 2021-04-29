let globalSettings={
    favorietLand:"",
    favorietekleur:"",
};

let speelData = [];
let ballTask;
let gameRunning = false;

const thuisGoalEvent = new Event('thuisGoal');
const uitGoalEvent = new Event('uitGoal');


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

    window.addEventListener('deviceorientation',updateLocation);
})

const updateLocation = (e)=>{
    if(gameRunning){
        clearInterval(ballTask);
        ballTask = setInterval(()=>{
            if(gameRunning){
                let beta = e.beta;
                let gamma = e.gamma;

                let newBalTop = Math.floor(parseFloat(document.getElementById("bal").style.top)+beta);
                let maxBalTop = $("#speelveld").innerHeight() - $("#bal").innerHeight()
                let minBalTop = 0;

                if(newBalTop > maxBalTop ){
                    newBalTop=maxBalTop;
                }

                if(newBalTop < minBalTop){
                    newBalTop=minBalTop;
                }

                let newBalLeft = Math.floor(parseFloat(document.getElementById("bal").style.left)+gamma);
                let minBalLeft = 0
                let maxBalLeft = $("#speelveld").innerWidth() - $("#bal").innerWidth();

                if(newBalLeft > maxBalLeft){
                    newBalLeft = maxBalLeft;
                }

                if(newBalLeft < minBalLeft){
                    newBalLeft = minBalLeft;
                }


                $("#bal").css("top",newBalTop);
                $("#bal").css('left',newBalLeft);

                detectGoal();
            }

        },50);
    }
}

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

const detectGoal=()=>{
    const bal = document.getElementById("bal");
    const thuisGoal = document.getElementById("goalThuisploeg");
    const uitGoal = document.getElementById("goalUitploeg");

    let thuisXok = false;
    let thuisYok = false;

    if(($(bal).position().left > $(thuisGoal).position().left) && ($(bal).position().left < $(thuisGoal).position().left + $(thuisGoal).innerWidth()-$(bal).innerWidth())){
        thuisXok = true;
    }

    if(($(bal).position().top < ($(thuisGoal).position().top + $(thuisGoal).innerHeight() ))){
        thuisYok = true;
    }

    if(thuisXok && thuisYok){

        dispatchEvent(thuisGoalEvent);

    }

    let uitXok = false;
    let uitYok = false;

    if($(bal).position().top + $(bal).innerHeight() > $(uitGoal).position().top){
        uitYok = true;
    }

    if(($(bal).position().left > $(uitGoal).position().left) && ($(bal).position().left < $(uitGoal).position().left + $(uitGoal).innerWidth() - $(bal).innerWidth())){
        uitXok = true;

    }

    if(uitXok && uitYok){
        dispatchEvent(uitGoalEvent);

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

    let bal = document.createElement("img");
    $(bal).attr("src","images/ball.png");
    $(bal).attr("id","bal");
    speelveld.append(bal);
    resetBall();
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

    window.addEventListener('thuisGoal',()=>{
        match.thuisscore++;
        alert(match.thuisscore + " - " + match.uitscore);
        resetBall()
        gameRunning=true;
    })

    window.addEventListener('uitGoal',()=>{
        match.uitscore++;
        alert(match.thuisscore + " - " + match.uitscore);
        resetBall()
        gameRunning=true;
    })


    /*$(bal).attr("src","images/ball.png");
    $(bal).attr("id","bal");

    let ballLeftPos = ($("#speelveld").innerWidth() - $(bal).innerWidth())/2;
    let ballTopPos = ($("#speelveld").innerHeight() - $(bal).innerHeight())/2;

    $(bal).css("left",ballLeftPos);
    $(bal).css("top",ballTopPos);*/

    let goalThuisploeg = document.getElementById("goalThuisploeg")
    $(goalThuisploeg).text(match.thuisploeg);
    
    let goalUitploeg = document.getElementById("goalUitploeg")
    $(goalUitploeg).text(match.uitploeg);


    resetBall();
    gameRunning = true;




}

const resetBall = () => {
    let bal = document.getElementById("bal");

    let ballLeftPos = ($("#speelveld").innerWidth() - $(bal).innerWidth())/2;
    let ballTopPos = ($("#speelveld").innerHeight() - $(bal).innerHeight())/2;

    $(bal).css("left",ballLeftPos);
    $(bal).css("top",ballTopPos);


}

