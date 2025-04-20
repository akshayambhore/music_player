
let curaudio = new Audio();
let sname=" ";
let flag=0;
function convertSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);           // Calculate the number of minutes
    const remainingSeconds = Math.round(seconds % 60); // Calculate remaining seconds and round them

    // Ensure two-digit format for minutes and seconds
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
    return `${formattedMinutes}:${formattedSeconds}`;
}
function sbar()
{
    let sekbar = document.querySelector(".playbar");
    if(sname!=" ")
        {
            sekbar.style.opacity=1;
        }
        else
        {
            sekbar.style.opacity=0;
        }
}


async function getlist() {
    let a= await fetch("http://127.0.0.1:3000/song");
    let Response=await a.text();
    let div=document.createElement("div");
    div.innerHTML=Response;
    let as = div.getElementsByTagName("a");
    let list = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        // console.log(element);
        if(element.href.includes("/song/")&&!element.href.includes("DS_Store"))
            {
                list.push(element.href);
            }

    }
    return list;

}

async function getsongs(folder) {
    let a = await fetch(folder);
    let Response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = Response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href);
        }
    }
    return songs;
}

async function main() {
    let lef= document.querySelector(".left");
    let menu= document.querySelector(".menu");
    menu.addEventListener("click",()=>
        {
            
            lef.style.left=0;
        });
    let close= document.querySelector(".close");
    close.addEventListener("click",()=>            {
                lef.style.left=-100+"%";
            });
    sbar();
    let list = await getlist();
    console.log(list);
    let cote=document.querySelector(".card-container");

    for (let index = 0; index < list.length; index++) {
        const element = list[index];
        console.log(element);
        let b = await fetch(`${element}info.json`);
        let r= await b.json();
        cote.innerHTML+=`<div class="card ">
                        <div class="play">

                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <!-- Circular background -->
                                <circle cx="24" cy="24" r="24" fill="#1DB954" />

                                <!-- Play icon (perfectly centered) -->
                                <path d="M18 15L32 24L18 33V15Z" fill="white" />

                                <!-- Hover animation (optional) -->
                                <style>
                                    svg {
                                        transition: transform 0.2s ease;
                                        border-radius: 50%;
                                        cursor: pointer;
                                    }

                                    svg:hover {
                                        transform: scale(1.05);
                                    }
                                </style>
                            </svg>
                        </div>
                        <img src="${element}cover.jpg" alt="">
                        <h2>${r.title}</h2>
                        <p> ${r.discription} </p>
                    </div>`
    }
    let songs = [];
    let card = document.querySelectorAll(".card");
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    card.forEach((crd, index) => {
        crd.addEventListener("click", async () => {
            songs = [];
            console.log(list[index]);
            songs = await getsongs(list[index]);
            console.log(songs.length);
            songUL.innerHTML="";
            for (let index = 0; index < songs.length; index++) {
                const song = songs[index];
                songUL.innerHTML +=
                    `<li>
            <img class="musicimg" src="music.jpeg" alt="">
            <div class="info">
                <div>
                    ${(song.split("song/")[1]).replaceAll("%20", "_")}
                </div>
                <div>
                    Undefined
                </div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="playlist.svg" alt="">
            </div>
        </li>`
            };
            lago(); // songs ko sabkuch lagva denga play pouse next privious
        })
        // const playButtons = songUL.querySelectorAll('.playnow');
        // console.log(playButtons);
        
    });

    function lago() {

       
        curaudio.addEventListener("timeupdate", () => {
            console.log(curaudio.duration);
        });
        let play2 = document.getElementById("play");
        play2.addEventListener("click", () => {
            if (curaudio.paused&& sname!=" ") {
                curaudio.play();
                play2.src = "play.svg";
            }
            else {
                curaudio.pause();
                play2.src = "paus.svg";
            }
        });
        curaudio.addEventListener("timeupdate", () => {
            console.log(curaudio.duration);
        })
        const playButtons = songUL.querySelectorAll('.playnow');
        playButtons.forEach((playbtn, index) => {
            playbtn.addEventListener('click', () => {
                sname = (songs[index].split("song/")[1]).replaceAll("%20", "_").replace(".mp3", "");
                document.querySelector(".info1").innerHTML = sname;
                let audio = new Audio(songs[index]);
                curaudio.pause();
                curaudio = audio;
                curaudio.play();
                play.src = "play.svg";
                sbar();
                curaudio.addEventListener("timeupdate", () => {
                    document.querySelector(".time").innerHTML = convertSeconds(curaudio.currentTime) + " / " + convertSeconds(curaudio.duration);
                    document.querySelector(".circal").style.left = (curaudio.currentTime / curaudio.duration) * 100 + "%";
                });
                let sk = document.querySelector(".seekbar");
                sk.addEventListener("click", e => {
                    console.log(e.offsetX);
                    console.log(sk.clientWidth);
                    let perc = (e.offsetX / sk.clientWidth) * 100;
                    document.querySelector(".circal").style.left = perc + "%";
                    curaudio.currentTime = (perc * curaudio.duration) / 100;
                })
                let prev = document.getElementById("prev");
                prev.addEventListener("click", () => {
                    console.log("clicked");
                    if (index > 0) {
                        index--;
                        let audio = new Audio(songs[index]);
                        curaudio.pause();
                        curaudio = audio;
                        curaudio.play();
                        play.src = "play.svg";
                        sname = (songs[index].split("song/")[1]).replaceAll("%20", "_").replace(".mp3", "");
                        document.querySelector(".info1").innerHTML = sname;

                    }
                    curaudio.addEventListener("timeupdate", () => {
                        document.querySelector(".time").innerHTML = convertSeconds(curaudio.currentTime) + " / " + convertSeconds(curaudio.duration);
                        document.querySelector(".circal").style.left = (curaudio.currentTime / curaudio.duration) * 100 + "%";
                    });
                });
                let next = document.getElementById("next");
                next.addEventListener("click", () => {
                    console.log("clicked");
                    if (index < songs.length - 1) {
                        index++;
                        let audio = new Audio(songs[index]);
                        curaudio.pause();
                        curaudio = audio;
                        curaudio.play();
                        play.src = "play.svg";
                        sname = (songs[index].split("song/")[1]).replaceAll("%20", "_").replace(".mp3", "");
                        document.querySelector(".info1").innerHTML = sname;

                    }
                    curaudio.addEventListener("timeupdate", () => {
                        document.querySelector(".time").innerHTML = convertSeconds(curaudio.currentTime) + " / " + convertSeconds(curaudio.duration);
                        document.querySelector(".circal").style.left = (curaudio.currentTime / curaudio.duration) * 100 + "%";
                    });
                });


            });
        });
    }

}

main();