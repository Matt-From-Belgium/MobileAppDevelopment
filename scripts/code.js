$( document ).ready(function(){
    prepareSpeelVeld();
    console.log('document ready');
})

const prepareSpeelVeld = () =>{
    document.getElementById("speelveld").style.height = window.innerHeight;

    let speelveld = document.getElementById("speelveld");
    speelveld.style.width = window.innerWidth + "px";
    speelveld.style.height = window.innerHeight + "px";

    let bal = document.createElement("img");
    bal.src='images/ball.png';
    bal.id="bal";



    speelveld.appendChild(bal);

}