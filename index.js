let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

function speak(text) {
  let text_speak = new SpeechSynthesisUtterance(text);
  text_speak.rate = 1;
  text_speak.pitch = 1;
  text_speak.volume = 1;
  window.speechSynthesis.speak(text_speak);
}

function Greeting() {
  let hours = new Date().getHours();
  if (hours >= 0 && hours < 12) speak("Good Morning Sir");
  else if (hours >= 12 && hours < 16) speak("Good Afternoon Sir");
  else if (hours >= 16 && hours < 20) speak("Good Evening Sir");
  else speak("Hello Sir");
}

function reportBatteryStatus() {
  navigator.getBattery().then(battery => {
    const updateUI = () => {
      let level = Math.round(battery.level * 100);
      let charging = battery.charging ? "Charging" : "Not Charging";
      document.getElementById("battery-status").innerText = `Battery: ${level}% | ${charging}`;
    };
    updateUI();
    battery.addEventListener("levelchange", updateUI);
    battery.addEventListener("chargingchange", updateUI);
  });
}

let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = false;

recognition.onresult = (event) => {
  let transcript = event.results[event.resultIndex][0].transcript.trim();
  content.innerText = transcript;
  takeCommand(transcript.toLowerCase());
};

recognition.onerror = () => {
  recognition.stop();
  setTimeout(() => recognition.start(), 1000);
};

function takeCommand(message) {
  btn.style.display = "flex";
  voice.style.display = "none";

  if (message.includes("hello") || message.includes("hey")) {
    speak("Hello Sir, What can I help you with?");
  } else if (message.includes("who are you") || message.includes("who made you")) {
    speak("I am a Virtual Assistant, created by Ashish Sir.");
  } else if (message.includes("what can you do")) {
    speak("I can tell you the time, date, and open websites like YouTube, Amazon, and Flipkart.");
  } else if (message.includes("open")) {
    let website = message.replace("open", "").trim().toLowerCase().replace(/\s*dot\s*/g, ".").replace(/\s+/g, "");
    if (!website.includes(".")) website += ".com";
    speak(`Opening ${website}`);
    window.open(`https://${website}`, "_blank");
  } else if (message.includes("time")) {
    let time = new Date().toLocaleTimeString();
    speak(`Current time is ${time}`);
  } else if (message.includes("date")) {
    let date = new Date().toLocaleDateString();
    speak(`Today's date is ${date}`);
  } else if (message.includes("day")) {
    let day = new Date().toLocaleString(undefined, { weekday: 'long' });
    speak(`Today is ${day}`);
  } else if (message.includes("on amazon")) {
    let query = message.replace("on amazon", "").trim();
    speak(`Searching Amazon for ${query}`);
    window.open(`https://www.amazon.in/s?k=${query}`, "_blank");
  } else if (message.includes("on flipkart")) {
    let query = message.replace("on flipkart", "").trim();
    speak(`Searching Flipkart for ${query}`);
    window.open(`https://www.flipkart.com/search?q=${query}`, "_blank");
  } else if (message.includes("on youtube")) {
    let query = message.replace("on youtube", "").trim();
    speak(`Searching YouTube for ${query}`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
  } 
else if (message.includes("tell me about")) {
    let query = message.replace("tell me about", "").trim();
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${query}`)
        .then(response => response.json())
        .then(data => {
            if (data.extract) {
                speak(data.extract);
            } else {
                speak("Sorry, I couldn't find anything about " + query);
            }
        });
}

    else if (
    message.includes("open my linkedin ") || 
    message.includes("my linkedin profile") ||
    message.includes("open my linkedin profile")
    ) {
    speak("Opening your Linkedin profile.");
    window.open("https://www.linkedin.com/in/ashish-thakur-90b415330/", "_blank");
 }

   else if (message.includes("thank")) {
    speak("Thank you, I am always here to help you.");
  } else {
    speak("Here is what I found on Google.");
    window.open(`https://www.google.com/search?q=${message}`, "_blank");
  }
}

window.addEventListener("load", () => {
  Greeting();
  reportBatteryStatus();
 
});


btn.addEventListener("click", () => {
  recognition.start();
  btn.style.display = "none";
  voice.style.display = "block";
});
