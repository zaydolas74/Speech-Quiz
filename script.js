var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
const spreekKnop = document.querySelector("#spreekBtn");
const herstartKnop = document.querySelector("#opnieuwBtn");
const vraagElement = document.querySelector("#vraag");
const quizContainer = document.querySelector(".quiz-container");

const vragen = [
  {
    vraag: "Welk dier is bekend als de koning van de jungle?",
    antwoorden: ["leeuw"],
  },
  {
    vraag: "Hoe heet het grootste landdier ter wereld?",
    antwoorden: ["olifant"],
  },
  {
    vraag: "Wat voor soort dier is een pinguïn?",
    antwoorden: ["vogel"],
  },
];

let huidigeVraagIndex = 0;
let laatsteTranscriptie = "";
const herkenning = new SpeechRecognition();
herkenning.lang = "nl-BE";
let timeoutId;

herkenning.onresult = function (event) {
  clearTimeout(timeoutId);
  laatsteTranscriptie = event.results[0][0].transcript.toLowerCase();
  if (vragen[huidigeVraagIndex].antwoorden.includes(laatsteTranscriptie)) {
    quizContainer.style.backgroundColor = "#8BC34A";
    setTimeout(() => {
      quizContainer.style.backgroundColor = "#fff";
      huidigeVraagIndex++;
      if (huidigeVraagIndex < vragen.length) {
        stelVraag();
      } else {
        quizContainer.style.backgroundColor = "#8BC34A";
        vraagElement.textContent = "Quiz is over";
        spreekKnop.disabled = true;
        spreekKnop.style.display = "none";
        herstartKnop.style.display = "inline-block";
      }
    }, 700);
  } else {
    quizContainer.style.backgroundColor = "#FF5722";
    setTimeout(() => {
      quizContainer.style.backgroundColor = "#fff";
      spreekKnop.disabled = false;
    }, 700);
  }
};

herkenning.onspeechend = function () {
  herkenning.stop();
};

herkenning.onend = function () {
  if (
    huidigeVraagIndex < vragen.length &&
    !vragen[huidigeVraagIndex].antwoorden.includes(laatsteTranscriptie)
  ) {
    quizContainer.style.backgroundColor = "#FF5722";
    setTimeout(() => {
      quizContainer.style.backgroundColor = "#fff";
      spreekKnop.disabled = false;
    }, 700);
  }
};

spreekKnop.addEventListener("click", function () {
  spreekKnop.disabled = true;
  stelVraag();
});

herstartKnop.addEventListener("click", function () {
  location.reload();
});

function stelVraag() {
  vraagElement.textContent = vragen[huidigeVraagIndex].vraag;
  leesVraagVoor(vragen[huidigeVraagIndex].vraag).then(() => {
    herkenning.start();
    timeoutId = setTimeout(() => {
      herkenning.stop();
    }, 5000);
  });
}

function leesVraagVoor(vraag) {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const uiting = new SpeechSynthesisUtterance(vraag);
    uiting.lang = "nl-BE";
    uiting.onend = resolve;
    synth.speak(uiting);
  });
}
