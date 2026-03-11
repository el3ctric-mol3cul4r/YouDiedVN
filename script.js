let moralityPoints = 0;
let influencePoints = 0;
let index = 0;
let lastChoice = null;

let textBox = document.getElementById("mainText");
let speakerName = document.getElementById("speakerName");
let background = document.getElementById("background");
let sceneCrest = document.getElementById("crest");

let hintLine = document.getElementById("hintText");
let extraLine = document.getElementById("extraText");

let b1 = document.getElementById("option1");
let b2 = document.getElementById("option2");
let nextButton = document.getElementById("next");

hintLine.setAttribute("hidden", "hidden");
extraLine.setAttribute("hidden", "hidden");
b1.setAttribute("hidden", "hidden");
b2.setAttribute("hidden", "hidden");

const story = [
    // Chapter 1
    {
        chapter: 1,
        speaker: "James Marcus",
        bg: "images/flashback.jpg",
        sprite: "sprites/JamesMarcus.jpg",  
        spriteVisible: true,
        extra: "Note: This is a flashback to 1978.",
        text: "As the co-founder of Umbrella, I couldn't help but notice how you two excelled at the Umbrella Executive Training Center."
    },
    {
        speaker: "James Marcus",
        bg: "images/flashback.jpg",
        text: "The entire class was lackluster apart from you two. As they say, 'Everyone else is so much chaff!'"
    },
    {
        speaker: "James Marcus",
        bg: "images/flashback.jpg",
        extra: "Fast forward to a few years after.",
        text: "I look forward to working with you two at the prestigious Arklay Laboratory."
    },
    {
        speaker: "You",
        bg: "images/marcusdesk.jpg",
        spriteVisible: false,
        text: "Here we are. The real reason Birkin and I are senior researchers at Umbrella."
    },
    {
        speaker: "You",
        bg: "images/marcusdesk.jpg",
        sprite: "assets/research.jpg",  
        spriteVisible: true,
        text: "James Marcus's research. He wouldn't suspect his star pupils..."
    },
    {
        speaker: "You",
        bg: "images/marcusdesk.jpg",
        text: "What a fool."
    },
    {
        speaker: "You",
        bg: "images/marcusdesk.jpg",
        hint: "Hint: The choice you make influence your endings, but you cannot see how.",
        text: "Should I steal Marcus's research? It's right there..."
    },
    {
        choice: true,
        options: [
            {
                text: "Yes, it would be beneficial for future research.",
                effect: () => { influencePoints++; console.log("Influence:", influencePoints); lastChoice = "influence"; spriteContainer.classList.add("hidden");},
            },
            {
                text: "No, I should use my own research.",
                effect: () => { moralityPoints++; console.log("Morality:", moralityPoints); lastChoice = "morality";}
            }
        ]
    },
    {
        speaker: "You",
        bg: "images/marcusdesk.jpg",
        text: "Umbrella is damn corrupt. Especially Spencer."
    },
    {
        speaker: "You",
        bg: "images/marcusdesk.jpg",
        extra: "Note: Oswell E. Spencer, the co-founder of Umbrella, hired Wesker and Birkin on behalf of them being spies. He is paranoid to say the least…",
        text: "Can’t believe he would do that to his own colleague.."
    },
    {
        speaker: "You",
        bg: "images/marcusdesk.jpg",
        text: "...Either way, the future of Umbrella lies in our hands now."
    },
    {
        speaker: "",
        bg: "images/marcusdesk.jpg",
        text: "End of chapter 1."
    },

    // chapter 2
    {
        chapter: 2,
        speaker: "William Birkin",
        bg: "images/umbrelladay.jpg",
        sprite: "sprites/WilliamBirkin1.jpg",  
        spriteVisible: true,
        text: "Good mythical morning! You heard what Spencer suggested, right?"
    },
    {
        speaker: "You",
        bg: "images/umbrelladay.jpg",
        text: "No. What else does he want to pile on us?"
    },
    {
        speaker: "William Birkin",
        bg: "images/umbrelladay.jpg",
        text: "He suggested that we use the ebola sample we received from the U.S. government…"
    },
    {
        speaker: "William Birkin",
        bg: "images/umbrelladay.jpg",
        text: "Alongside the research you.. “acquired” from Marcus yesterday. This should be good!"
    },
    {
        speaker: "William Birkin",
        bg: "images/umbrelladay.jpg",
        text: "You did get your hands on it... Right?"
    },
    {
        speaker: "You",
        bg: "images/umbrelladay.jpg",
        branch: true,
        text1: "Yes, of course. It is insanely valuable.",
        text2: "No… We can manage on our own. I would never willingly take another’s research.",
    },
    {
        speaker: "William Birkin",
        bg: "images/umbrelladay.jpg",
        branch: true,
        text1: "Great! Let’s get to work then!",
        text2: "You’re such a stickler, Al. I’ll go snatch it now. Meet you at the lab!",
    },
    {
        speaker: "You",
        bg: "images/umbrellalab.jpg",
        spriteVisible: false,
        text: "What was in the research, Birkin?"
    },
    {
        speaker: "William Birkin",
        bg: "images/umbrellalab.jpg",
        extra: "Note: The t-virus prototype, developed by James Marcus, is a virus capable of necrosis.",
        text: "The information on the t-virus. I’m currently creating a sample of it."
    },
    {
        speaker: "You",
        bg: "images/umbrellalab.jpg",
        text: "And how do you plan to satisfy Spencer’s idea of using the ebola sample?"
    },
    {
        speaker: "William Birkin",
        bg: "images/umbrellalab.jpg",
        extra: "Note: The t-virus was developed using leech DNA and a pre-existing virus, the progenitor virus.",
        text: "I was just about to ask you… Should we splice its genes and insert them into the t-virus?"
    },
    {
        speaker: "William Birkin",
        bg: "images/umbrellalab.jpg",
        extra: "Note: The t-virus was initially created with the goal of creating illegal bioweapons...",
        text: "Or rather, should we just leave the t-virus strain as is and reduce potential risks?"
    },
    {
        choice: true,
        options: [
            {
                text: "Use the ebola sample.",
                effect: () => { influencePoints++; console.log("Influence:", influencePoints); lastChoice = "influence";},
            },
            {
                text: "Keep the strain pure.",
                effect: () => { moralityPoints++; console.log("Morality:", moralityPoints); lastChoice = "morality";}
            }
        ]
    },
    {
        speaker: "You",
        bg: "images/umbrellalab.jpg",
        branch: true,
        text1: "Splice the ebola genes. Not only will this please Spencer, but effectiveness will increase.",
        text2: "Keep the t-virus strain pure. It doesn’t need all those symptoms.",
    },
    {
        speaker: "William Birkin",
        bg: "images/umbrellalab.jpg",
        branch: true,
        text1: "Agreed. I’ll work on that ASAP!",
        text2: "Boo. I’m adding ebola anyway. Don’t want to get in trouble with our boss…",
    },
    {
        speaker: "You",
        bg: "images/umbrellalab.jpg",
        text: "..."
    },
    {
        speaker: "You",
        bg: "images/umbrellalab.jpg",
        text: "Do you believe the ebola will increase necrosis capabilities?"
    },
    {
        speaker: "William Birkin",
        bg: "images/umbrellalab.jpg",
        text: "Perhaps. Hopefully this satisfies Spencer enough so he’s not on our backs about using the virus to create zombies rather than… To kill."
    },
    {
        speaker: "You",
        bg: "images/umbrellalab.jpg",
        text: "He’s blind if he can’t recognize the benefits we could reap from a regenerative virus."
    },
    {
        speaker: "You",
        bg: "images/umbrellalab.jpg",
        text: "But honestly, I wouldn’t be surprised if he was upset. He is old and feeble-minded, corrupt and weak. An imbecile."
    },
    {
        speaker: "You",
        bg: "images/umbrellalab.jpg",
        text: "The future of Umbrella lies in our hands, Birkin. I hope you recognize that."
    },
    {
        speaker: "William Birkin",
        bg: "images/umbrellalab.jpg",
        text: "Of course I do, Al! Hence why we should take over the company!"
    },
    {
        speaker: "You",
        bg: "images/umbrellalab.jpg",
        text: "Precisely. We need to start working on human experimentation."
    },
    {
        speaker: "William Birkin",
        bg: "images/umbrellalab.jpg",
        extra: "Note: James Marcus experimented on mediocre company trainees to develop the t-virus prototype.",
        text: "Are you sure? Marcus got in hot water yesterday because of that…"
    },
    {
        choice: true,
        options: [
            {
                text: "Yes, human experimentation is needed.",
                effect: () => { influencePoints++; console.log("Influence:", influencePoints); lastChoice = "influence";},
            },
            {
                text: "No, maybe animal experimentation will work.",
                effect: () => { moralityPoints++; console.log("Morality:", moralityPoints); lastChoice = "morality";}
            }
        ]
    },
    {
        speaker: "You",
        bg: "images/umbrellalab.jpg",
        branch: true,
        text1: "Birkin, the t-virus requires human subjects. A puny animal would be unable to handle such a magnificent pathogen.",
        text2: "Well, perhaps animal experimentation will suffice.",
    },
    {
        speaker: "William Birkin",
        bg: "images/umbrellalab.jpg",
        branch: true,
        text1: "I don't know... I'm not risking it. Not this early.",
        text2: "Well.. On second thought, maybe we should go with a third option.",
    },
    {
        speaker: "William Birkin",
        bg: "images/umbrellalab.jpg",
        extra: "Yes, this is actually canon.",
        text: "I'll experiment on human embryos. It should be less risky.",
    },
    {
        speaker: "You",
        bg: "images/umbrellalab.jpg",
        text: "Suit yourself. Hand me the sample once you've finished combining it with ebola.",
    },
    {
        speaker: "William Birkin",
        bg: "images/umbrellalab.jpg",
        text: "Aye aye, captain!",
    },
    {
        speaker: "William Birkin",
        bg: "images/umbrellalab.jpg",
        extra: "A few hours later...",
        text: "...",
    },
    {
        speaker: "William Birkin",
        bg: "images/umbrellalab2.jpg",
        text: "Actually, I just finished. Here it is in all its glory.",
    },
    {
        speaker: "You",
        bg: "images/umbrellalab2.jpg",
        sprite: "assets/tvirus.jpg",  
        spriteVisible: true,
        text: "It’s a fine sample, Birkin. Nice work.",
    },
    {
        speaker: "William Birkin",
        bg: "images/umbrellalab2.jpg",
        text: "Thank you. I’ve dubbed it the Beta strain.",
    },
    {
        speaker: "William Birkin",
        bg: "images/umbrellalab2.jpg",
        text: "It bypasses the immune system much better.",
    },
    {
        speaker: "You",
        bg: "images/umbrellalab2.jpg",
        text: "This means…",
    },
    {
        speaker: "William Birkin",
        bg: "images/umbrellalab2.jpg",
        text: "Yup! We’ll be able to create large-scale bioweapons that will do our bidding!",
    },
    {
        speaker: "You",
        bg: "images/umbrellalab2.jpg",
        text: "Excellent.",
    },

    // chapter 3
];


const sprite = document.getElementById("characterSprite");
const spriteContainer = sprite.parentElement;

function renderScene() {
  let scene = story[index];
  if (scene.choice) { 
    showChoices(scene); return; 
  }

  if (scene.chapter) {
    sceneCrest.innerText = `✦ Chapter ${scene.chapter} ✦`;
  }

  speakerName.innerText = scene.speaker;
  background.src = scene.bg;

  if (scene.spriteVisible && scene.sprite) {
    sprite.src = scene.sprite;
    spriteContainer.classList.remove("hidden");
  } else if (scene.spriteVisible === false) {
    spriteContainer.classList.add("hidden");
  }

  
  if (scene.branch) {
    let branchText = lastChoice === "morality" ? scene.text2 : scene.text1;
    textBox.innerText = branchText;
  } else {
    textBox.innerText = scene.text;
    showHint(scene);
    showExtra(scene); 
  }
}

nextButton.onclick = function () {
    index++;
    if (index >= story.length) {
        textBox.innerText = "End.";
        speakerName.innerText = "";
        nextButton.disabled = true;
        return;
    }
    renderScene();
};

function showChoices(scene) {
    nextButton.setAttribute("hidden", "hidden");
    b1.removeAttribute("hidden");
    b2.removeAttribute("hidden");

    b1.innerText = scene.options[0].text;
    b2.innerText = scene.options[1].text;

    b1.onclick = function () {
        scene.options[0].effect();
        continueStory();
    };
    b2.onclick = function () {
        scene.options[1].effect();
        continueStory();
    };
}

function showHint(scene) {
    if (scene.hint) {
        hintLine.removeAttribute("hidden");
        hintLine.innerText = scene.hint;
    } else {
        hintLine.setAttribute("hidden", "hidden");
    }
}

function showExtra(scene) {
    if (scene.extra) {
        extraLine.removeAttribute("hidden");
        extraLine.innerText = scene.extra;
    } else {
        extraLine.setAttribute("hidden", "hidden");
    }
}

function continueStory() {
    b1.setAttribute("hidden", "hidden");
    b2.setAttribute("hidden", "hidden");
    nextButton.removeAttribute("hidden");

    index++;
    

    if (index >= story.length) {
        textBox.innerText = "End.";
        speakerName.innerText = "";
        nextButton.disabled = true;
        return;
    }

    renderScene();
}

renderScene();