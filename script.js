let moralityPoints = 0;
let influencePoints = 0;
let index = 0;
let lastChoice = null;
let currentSFX = null;

const soundeffects = {
    paper: new Audio("audio/rustle.mp3"),
    phone: new Audio("audio/phonering.mp3"),
    hangup: new Audio("audio/hangup.mp3"),
    pistol: new Audio("audio/pistol.mp3"),
};

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
    // chapter 1
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
        speaker: "You (thoughts)",
        bg: "images/marcusdesk.jpg",
        spriteVisible: false,
        sound: "audio/rustle.mp3",
        text: "Here we are. The real reason Birkin and I are senior researchers at Umbrella."
    },
    {
        speaker: "You (thoughts)",
        bg: "images/marcusdesk.jpg",
        sprite: "assets/research.jpg",  
        spriteVisible: true,
        text: "James Marcus's research. He wouldn't suspect his star pupils..."
    },
    {
        speaker: "You (thoughts)",
        bg: "images/marcusdesk.jpg",
        text: "What a fool."
    },
    {
        speaker: "You (thoughts)",
        bg: "images/marcusdesk.jpg",
        hint: "Hint: The choice you make influence your endings, but you cannot see how.",
        text: "Should I steal Marcus's research? It's right there..."
    },
    {
        choice: true,
        options: [
            {
                text: "Yes, it would be beneficial for future research.",
                effect: () => { influencePoints++; console.log("Influence:", influencePoints); lastChoice = "influence"; spriteContainer.classList.add("hidden"); new Audio("audio/rustle.mp3").play();},
            },
            {
                text: "No, I should use my own research.",
                effect: () => { moralityPoints++; console.log("Morality:", moralityPoints); lastChoice = "morality";}
            }
        ]
    },
    {
        speaker: "You (thoughts)",
        bg: "images/marcusdesk.jpg",
        text: "Umbrella is damn corrupt. Especially Spencer."
    },
    {
        speaker: "You (thoughts)",
        bg: "images/marcusdesk.jpg",
        extra: "Note: Oswell E. Spencer, the co-founder of Umbrella, hired Wesker and Birkin on behalf of them being spies. He is paranoid to say the least…",
        text: "Can’t believe he would do that to his own colleague.."
    },
    {
        speaker: "You (thoughts)",
        bg: "images/marcusdesk.jpg",
        text: "...Either way, the future of Umbrella lies in our hands now."
    },
    {
        speaker: "",
        bg: "images/marcusdesk.jpg",
        text: "End of Chapter 1."
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
        text: "Do you believe the ebola will increase necrosis?"
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
    {
        speaker: "",
        bg: "images/umbrellalab2.jpg",
        spriteVisible: false,
        text: "End of Chapter 2.",
    },


    // chapter 3
    {
        chapter: 3,
        speaker: "You",
        bg: "images/birkindesk.jpg",
        sound: "audio/phonering.mp3",
        text: "...",
    },
    {
        speaker: "You",
        bg: "images/birkindesk.jpg",
        sprite: "assets/phone.jpg",  
        spriteVisible: true,
        text: "Hello?",
    },
    {
        speaker: "???",
        bg: "images/birkindesk.jpg",
        text: "Good evening. I heard you developed a so-called “beta” strain of the virus.",
    },
    {
        speaker: "You",
        bg: "images/birkindesk.jpg",
        text: "Ah, good evening, Dr. Spencer. Yes, I did.",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/birkindesk.jpg",
        text: "Wow, news really does travel fast. Hopefully he won’t get too upset.",
    },
    {
        speaker: "You",
        bg: "images/birkindesk.jpg",
        text: "What about it?",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/birkindesk.jpg",
        text: "Nothing. So you aren’t planning to kill with said virus?",
    },
    {
        speaker: "You",
        bg: "images/birkindesk.jpg",
        text: "…No, Spencer. This is where you’re wrong.",
    },
    {
        speaker: "You",
        bg: "images/birkindesk.jpg",
        text: "This virus is so lethal it will not only kill victims...",
    },
    {
        speaker: "You",
        bg: "images/birkindesk.jpg",
        text: "…But revive them into mindless beings.",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/birkindesk.jpg",
        text: "…",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/birkindesk.jpg",
        text: "Damned geniuses. I knew you two had potential.",
    },
    {
        speaker: "You",
        bg: "images/birkindesk.jpg",
        text: "Thanks, Dr. Spencer.",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/birkindesk.jpg",
        text: "However, this is not the main topic I called you for.",
    },
    {
        speaker: "You",
        bg: "images/birkindesk.jpg",
        text: "Of course. You wouldn’t waste your time on something as frivolous as praise, would you now?",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/birkindesk.jpg",
        text: "Don’t get sassy with me.",
    },
    {
        speaker: "You",
        bg: "images/birkindesk.jpg",
        text: "Sorry, Dr. Spencer. I was practicing my Wesker impression.",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/birkindesk.jpg",
        extra: "Note: Spencer took Wesker in as an orphan and fed him Umbrella ideology, alongside 12 other orphans with superior immune systems. He named this Project W.",
        text: "What a poor excuse. I never raised him to speak like that to me.",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/birkindesk.jpg",
        text: "Anyways, my apprentice, I wanted to ask a favor of you and your little lab partner.",
    },
    {
        speaker: "You",
        bg: "images/birkindesk.jpg",
        text: "At your service…",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/birkindesk.jpg",
        text: "I need you to assassinate James Marcus.",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/birkindesk.jpg",
        text: "I know you and Wesker stole his research with the t-virus prototype. It shouldn’t be too much of a leap, correct?",
    },
    {
        speaker: "You",
        bg: "images/birkindesk.jpg",
        text: "…",
    },
    {
        speaker: "You",
        bg: "images/birkindesk.jpg",
        text: "…Why?",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/birkindesk.jpg",
        text: "He is unstable. He has been experimenting on my own men at the company.",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/birkindesk.jpg",
        text: "My workers. My colleagues. He is a liability.",
    },
    {
        choice: true,
        options: [
            {
                text: "Guess I'll do it...",
                effect: () => { influencePoints++; console.log("Influence:", influencePoints); lastChoice = "influence";},
            },
            {
                text: "Absolutely not.",
                effect: () => { moralityPoints++; console.log("Morality:", moralityPoints); lastChoice = "morality";}
            }
        ]
    },
    {
        speaker: "You",
        bg: "images/birkindesk.jpg",
        branch: true,
        text1: "While your concern is rather paranoid, maybe I'll do i-",
        text2: "Absolutely not, Spencer. Are you out of your mind?",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/birkindesk.jpg",
        text: "You MUST kill him. Dump his body where he will not be found.",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/birkindesk.jpg",
        text: "Don’t let me down, Birkin. Inform Wesker and perform the task ASAP.",
    },
    {
        speaker: "You",
        bg: "images/birkindesk.jpg",
        sound: "audio/hangup.mp3",
        spriteVisible: false,
        text: "...",
    },
    {
        speaker: "You",
        bg: "images/birkindesk.jpg",
        text: "How on earth am I ever going to tell Wesker?",
    },
    {
        speaker: "You",
        bg: "images/umbrelladay.jpg",
        text: "Wesker.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrelladay.jpg",
        sprite: "sprites/AlbertWesker1.jpg",
        spriteVisible: true,
        text: "What do you want, Birkin?",
    },
    {
        speaker: "You",
        bg: "images/umbrelladay.jpg",
        text: "Urgent news… Spencer found out about the t-virus strain we made.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrelladay.jpg",
        text: "So? Is he upset?",
    },
    {
        speaker: "You",
        bg: "images/umbrelladay.jpg",
        text: "I told him about the zombies… He doesn’t care.",
    },
    {
        speaker: "You",
        bg: "images/umbrelladay.jpg",
        hint: "Reminder: James Marcus was caught experimenting on trainees to develop the t-virus prototype.",
        text: "…Remember how I told you about Marcus being in hot water?",
    },
    {
        speaker: "You",
        bg: "images/umbrelladay.jpg",
        text: "Spencer wants him assassinated because of it.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrelladay.jpg",
        text: "Pfft. The old man wants his company's co-founder assassinated?",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrelladay.jpg",
        text: "He’s always been so selfish. Ever since Project W.",
    },
    {
        speaker: "You",
        bg: "images/umbrelladay.jpg",
        text: "..And he wants us to kill him.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrelladay.jpg",
        extra: "Fast forward to that night...",
        text: "Coward. At least it’ll be fun.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrellanight.jpg",
        spriteVisible: false,
        text: "...",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrellanight.jpg",
        sprite: "sprites/AlbertWesker2.jpg",
        spriteVisible: true,
        text: "Are you ready, Birkin?",
    },
    {
        speaker: "You",
        bg: "images/umbrellanight.jpg",
        text: "I think?.... I’ve never killed a man before.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrellanight.jpg",
        text: "Well, you’ll find it’s rather fun to see the light drain from their eyes.",
    },
    {
        speaker: "You",
        bg: "images/umbrellanight.jpg",
        text: "…That’s sadistic..",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrellanight.jpg",
        text: "But it’s a true statement. Not that I’d expect you to know.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrellanight.jpg",
        text: "...Ha. Birkin, you’re shaking. Are you sure you’re ready?",
    },
    {
        choice: true,
        options: [
            {
                text: "Of course.",
                effect: () => { influencePoints++; console.log("Influence:", influencePoints); lastChoice = "influence";},
            },
            {
                text: "It seems kinda extreme..",
                effect: () => { moralityPoints++; console.log("Morality:", moralityPoints); lastChoice = "morality";}
            }
        ]
    },
    {
        speaker: "You",
        bg: "images/umbrellanight.jpg",
        branch: true,
        text1: "Of… Of course, Albert. I’ve made up my mind.",
        text2: "Do we really have to kill him?...",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrellanight.jpg",
        branch: true,
        text1: "Good. There is no room for hesitation.",
        text2: "Yes. Desperate times call for desperate measures, Birkin. Learn that.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrellanight.jpg",
        text: "Now, put on your gloves. We’re going into his office.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/marcusdesk.jpg",
        spriteVisible: false,
        text: "Ah, there you are, Dr. Marcus! We’ve been looking for you... For far too long.",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/marcusdesk.jpg",
        text: "God, that sent shivers down my spine, and I’m not even the one being assassinated.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/marcusdeath.jpg",
        text: "Time to die, doctor.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/black.jpg",
        sound: "audio/pistol.mp3",
        text: "",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/marcusdesk.jpg",
        spriteVisible: true,
        text: "Poor fool. I always knew Marcus was a senile idiot.",
    },
    {
        speaker: "You",
        bg: "images/marcusdesk.jpg",
        text: "Oh wow. There are more files on his desk.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/marcusdesk.jpg",
        text: "I’m surprised you noticed them, given how shaken up you look.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/marcusdesk.jpg",
        text: "Maybe you aren’t as helpless as I thought…",
    },
    {
        speaker: "You",
        bg: "images/marcusdesk.jpg",
        text: "Hey!",
    },
    {
        speaker: "You",
        bg: "images/marcusdesk.jpg",
        text: "Anyways, move. I want to see what's in them.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/marcusdesk.jpg",
        spriteVisible: false,
        text: "As you wish. I highly recommend you steal them.",
    },
    {
        speaker: "You",
        bg: "images/marcusdesk.jpg",
        sprite: "assets/research2.jpg",
        spriteVisible: true,
        text: "Trust me, I will.",
    },
    {
        speaker: "You",
        bg: "images/marcusdesk.jpg",
        spriteVisible: false,
        sound: "audio/rustle.mp3",
        text: "… I was reading those!",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/marcusdesk.jpg",
        sprite: "sprites/AlbertWesker2.jpg",
        spriteVisible: true,
        text: "I have an idea, Birkin. Looking at this poor idiot’s corpse..",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/marcusdesk.jpg",
        text: "What if we use him as our first adult human test subject for our little ebola t-virus passion project?",
    },
    {
        choice: true,
        options: [
            {
                text: "Good idea!",
                effect: () => { influencePoints++; console.log("Influence:", influencePoints); lastChoice = "influence";},
            },
            {
                text: "We should dump the body.",
                effect: () => { moralityPoints++; console.log("Morality:", moralityPoints); lastChoice = "morality";}
            }
        ]
    },
    {
        speaker: "You",
        bg: "images/marcusdesk.jpg",
        branch: true,
        text1: "You’re a damn genius, Al! I can’t wait to watch Marcus writhe in pain!",
        text2: "Nah, we should dump the body like Spencer told us.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/marcusdesk.jpg",
        branch: true,
        text1: "Birkin, it was a joke. But I’m proud of you. You’re starting to turn into a twisted soul.",
        text2: "Agreed. It was a test, and you passed it. Wouldn’t want to get in trouble with the higher-ups… Well, higher-up.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/marcusdesk.jpg",
        text: "However, I think it’s time for us to experiment on actual dead corpses now.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/marcusdesk.jpg",
        text: "Preferably not Marcus. He’s not worth our magnificent creation.",
    },
    {
        speaker: "You",
        bg: "images/marcusdesk.jpg",
        text: "Agreed. We need to start creating those bioweapons that’ll do our bidding.",
    },
    {
        speaker: "You",
        bg: "images/marcusdesk.jpg",
        text: "That’s what the beta strain is for, anyways.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/marcusdesk.jpg",
        text: "Let’s commence, then. We’ll call it…",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/marcusdesk.jpg",
        extra: "The t in t-virus stands for tyrant, named after the ferocity of its victims.",
        text: "The Tyrant project.",
    },
    {
        speaker: "",
        bg: "images/marcusdesk.jpg",
        text: "End of Chapter 3.",
    },
];


const sprite = document.getElementById("characterSprite");
const spriteContainer = sprite.parentElement;

function renderScene() {
  let scene = story[index];
  if (scene.choice) { 
    showChoices(scene); return; 
  }

  stopSFX();

  if (scene.sound) {
    currentSFX = new Audio(scene.sound);
    currentSFX.play();
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

function stopSFX() {
    if (currentSFX) {
        currentSFX.pause();
        currentSFX.currentTime = 0;
        currentSFX = null;
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