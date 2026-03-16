// influence: power/ambition points, rude choices
// morality: ethics points, nicer choices
// lastChoice: remembers the most recent choice for branch dialogue

let moralityPoints = 0;
let influencePoints = 0;
let index = 0; // position in the story array
let lastChoice = null;
let currentSFX = null;

// kept as references
const soundeffects = {
    paper: new Audio("audio/rustle.mp3"),
    phone: new Audio("audio/phonering.mp3"),
    hangup: new Audio("audio/hangup.mp3"),
    pistol: new Audio("audio/pistol.mp3"),
    dog: new Audio("audio/dog.mp3"),
    pistol2: new Audio("audio/pistol2.mp3"),
    tyrant: new Audio("audio/tyrant.mp3"),
    impalement: new Audio("audio/impalement.mp3"),
};

// dom elements 
let textBox = document.getElementById("mainText");
let speakerName = document.getElementById("speakerName");
let background = document.getElementById("background");
let sceneCrest = document.getElementById("crest");

let hintLine = document.getElementById("hintText");
let extraLine = document.getElementById("extraText");

let b1 = document.getElementById("option1");
let b2 = document.getElementById("option2");
let nextButton = document.getElementById("next");

//hide hint, extra, and choice buttons initially
hintLine.setAttribute("hidden", "hidden");
extraLine.setAttribute("hidden", "hidden");
b1.setAttribute("hidden", "hidden");
b2.setAttribute("hidden", "hidden");

const sprite = document.getElementById("characterSprite");
const spriteContainer = sprite.parentElement;

//each object represents a scene
//   chapter - updates the chapter e.g. "✦ Chapter 1 ✦"
//   speaker - name shown in the speaker tag
//   bg - background image
//   sprite - character sprite image
//   spriteVisible - true = show sprite, false = hide sprite
//   text - dialogue text
//   hint - gameplay hint shown below the scene, usually reminders
//   extra - lore notes
//   sound - audio playing during scene
//   branch - uses text1/text2 based on lastChoice if true
//   text1 - dialogue shown when lastChoice === "influence"
//   text2 -dialogue shown when lastChoice === "morality"
//   choice - adds two choice buttons instead of next if true
//   options - {text, effect} for the two choices
//   endingStart - triggers loadChapter6Ending()
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


    //chapter 4
    {
        chapter: 4,
        speaker: "Albert Wesker",
        bg: "images/umbrellalab2.jpg",
        sprite: "sprites/AlbertWesker1",
        extra: "This is a few months later, after the tyrant project has commenced.",
        text: "Birkin.",
    },
    {
        speaker: "You",
        bg: "images/umbrellalab2.jpg",
        text: "What’s the issue, Wesker? You seem… On edge.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrellalab2.jpg",
        text: "Have you been testing the beta strain on animals, Birkin?",
    },
    {
        speaker: "You",
        bg: "images/umbrellalab2.jpg",
        text: "Maybe I have. Why?",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrellalab2.jpg",
        sound: "audio/dog.mp3",
        text: "…",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrellalab2.jpg",
        text: "Do you hear that, Birkin?",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrellalab2.jpg",
        text: "The consequences of your own actions are about to knock down the damned door.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrellalab2.jpg",
        text: "I thought you were only experimenting on human embryos.",
    },
    {
        speaker: "You",
        bg: "images/umbrellalab2.jpg",
        text: "…",
    },
    {
        speaker: "You",
        bg: "images/umbrellalab2.jpg",
        hint: "Reminder: Wesker suggested experimentation on large animals that would have greater chances of becoming bioweapons.",
        text: "I started moving onto larger animals, like you had suggested earlier.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrellalab2.jpg",
        text: "It would’ve been fine if one of them hadn’t escaped.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrellalab2.jpg",
        text: "Now thousands of animals are vectors for the virus, Birkin.",
    },
    {
        speaker: "You",
        bg: "images/umbrellalab2.jpg",
        text: "Spencer’s going to be pissed… This is really bad.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrellalab2.jpg",
        text: "Really? You just realized that now?",
    },
    {
        speaker: "You",
        bg: "images/umbrellalab2.jpg",
        text: "We should go talk to Spencer, Dr. Sarcastic.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrellalab2.jpg",
        text: "It is your funeral, dearest Birkin.",
    },
    {
        speaker: "You",
        bg: "images/umbrellameeting.jpg",
        spriteVisible: false,
        text: "Dr. Spencer?...",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/umbrellameeting.jpg",
        text: "I’m so nervous. I’m not sure what he’s going to say.",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/umbrellameeting.jpg",
        text: "Not to mention my job, and perhaps life, is on the line…",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/umbrellameeting.jpg",
        text: "Given his track record of assassinating his rivals and even colleagues…",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/umbrellameeting.jpg",
        sprite: "sprites/OswellESpencer.jpg",
        spriteVisible: true,
        text: "Ah, good evening, Dr. Birkin.",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/umbrellameeting.jpg",
        text: "Why doesn’t he just get to the point?.. He’s always so ominous…",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/umbrellameeting.jpg",
        text: "You’re here to speak to me about the leak of the beta virus, correct?",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/umbrellameeting.jpg",
        text: "How does he know?",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/umbrellameeting.jpg",
        text: "Raccoon City is littered with clones of the dog you first experimented on. Cerberus.",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/umbrellameeting.jpg",
        extra: "Raccoon City is a fictional city in the midwest where the Resident Evil games take place.",
        text: "And now people are starting to inch closer to figuring us out, Birkin boy.",
    },
    {
        speaker: "You",
        bg: "images/umbrellameeting.jpg",
        text: "I’m sorry I made such a grave mistake, sir. I was just trying to foster the advancement of the t-virus prototype.",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/umbrellameeting.jpg",
        text: "Oh, I’m sure. But now you and Wesker here are going to have to clean up this mess.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrellameeting.jpg",
        text: "I’ll handle it. Birkin already worked on the majority of the strain.",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/umbrellameeting.jpg",
        text: "!...",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/umbrellameeting.jpg",
        text: "Since when has he been so generous?..",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/umbrellameeting.jpg",
        text: "Fine by me. Actually, it works out perfectly, Birkin boy.",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/umbrellameeting.jpg",
        extra: "Wesker is the captain of a specialized unit for dangerous cases, S.T.A.R.S.",
        text: "Your friend Wesker here works for the RPD. He can use his position to erase the traces of us at the crime scene…",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrellameeting.jpg",
        text: "Enough taunting, Spencer. What do I have to do?",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/umbrellameeting.jpg",
        text: "Lure your little S.T.A.R.S team to my mansion out in the woods.",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/umbrellameeting.jpg",
        text: "The police have been searching in the forest, where the dogs are.",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/umbrellameeting.jpg",
        text: "Destroy the remaining evidence there…",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/umbrellameeting.jpg",
        text: "And the underground lab.",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/umbrellameeting.jpg",
        text: "Do all of that after you feed your S.T.A.R.S. team to your latest bioweapon.",
    },
    {
        speaker: "You",
        bg: "images/umbrellameeting.jpg",
        text: "The Tyrant!",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/umbrellameeting.jpg",
        text: "Yes. It will be beneficial for combat data.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrellameeting.jpg",
        text: "When will this occur?",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/umbrellameeting.jpg",
        text: "X-day.",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/umbrellameeting.jpg",
        text: "I have a bad feeling about this plan… Not to mention it’ll put Wesker in danger.",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/umbrellameeting.jpg",
        text: "Should I object to it?...",
    },
    {
        choice: true,
        options: [
            {
                text: "Say nothing.",
                effect: () => { influencePoints++; console.log("Influence:", influencePoints); lastChoice = "influence";},
            },
            {
                text: "Yes, this plan is extremely risky and wrong.",
                effect: () => { moralityPoints++; console.log("Morality:", moralityPoints); lastChoice = "morality";}
            }
        ]
    },
    {
        speaker: "You",
        bg: "images/umbrellameeting.jpg",
        branch: true,
        text1: "Sounds good.",
        text2: "I don’t know… Not only is it cruel, but it’s also really dangerous for Wesker.",
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/umbrellameeting.jpg",
        branch: true,
        text1: "Good. I’m glad you both are prepped for it.",
        text2: "You’ve become soft-hearted. Focus on the future of Umbrella, Birkin.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrellameeting.jpg",
        branch: true,
        hint: "Wesker will remember that.",
        text1: "…Of course.",
        text2: "…Thank you for your concern.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrellameeting.jpg",
        text: "…I will start working on the details, Spencer.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/umbrellameeting.jpg",
        branch: true,
        text1: "…",
        text2: "Just... Leave Birkin alone for now."
    },
    {
        speaker: "Oswell E. Spencer",
        bg: "images/umbrellameeting.jpg",
        extra: "Fast forward two weeks later...",
        text: "Very well. Get to work, boys.",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/black.jpg",
        sound: "audio/phonering.mp3",
        spriteVisible: false,
        text: "...",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/black.jpg",
        text: "Hello?",
    },
    {
        speaker: "???",
        bg: "images/black.jpg",
        text: "Privyet. You will betray Umbrella tomorrow, da?",
    },
    {
        speaker: "Albert Wesker",
        bg: "images/black.jpg",
        text: "Yes, Sergei. I will deliver the embryos to your company ASAP.",
    },
    {
        speaker: "Sergei Vladimir",
        bg: "images/black.jpg",
        text: "Good.",
    },
    {
        speaker: "",
        bg: "images/black.jpg",
        text: "End of Chapter 4."
    },


    // chapter 5
    {
        chapter: 5,
        speaker: "Jill Valentine",
        bg: "images/dining_hall.jpg",
        sprite: "sprites/JillValentine1.jpg",
        spriteVisible: true,
        hint: "Remember, Wesker is the Captain of the RPD S.T.A.R.S unit, in charge of dangerous missions.",
        text: "Captain, I’m glad you found this mansion!",
    },
    {
        speaker: "Jill Valentine",
        bg: "images/dining_hall.jpg",
        spriteVisible: false,
        sprite: "sprites/JillValentine2.jpg",
        spriteVisible: true,
        text: "But I can’t help but wonder where the Bravo team is… Maybe we should go out and look for them. It feels wrong to stay here…",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/dining_hall.jpg",
        text: "How naive can she possibly be? She really deserves to be a test subject for the Tyrant.",
    },
    {
        speaker: "Jill Valentine",
        bg: "images/black.jpg",
        spriteVisible: false,
        text: "...",
    },
    {
        speaker: "You",
        bg: "images/doors.jpg",
        sprite: "sprites/JillValentine1.jpg",
        spriteVisible: true,
        text: "Jill… Jill! Don’t open that door! You got a death wish, woman? They’re part of the STARS team. They can manage on their own.",
    },
    {
        speaker: "You",
        bg: "images/doors.jpg",
        text: "And if not…",
    },
    {
        choice: true,
        options: [
            {
                text: "They deserve to die.",
                effect: () => { influencePoints++; console.log("Influence:", influencePoints); lastChoice = "influence";},
            },
            {
                text: "They're not cut out for this.",
                effect: () => { moralityPoints++; console.log("Morality:", moralityPoints); lastChoice = "morality";}
            }
        ]
    },
    {
        speaker: "You",
        bg: "images/doors.jpg",
        branch: true,
        text1: "They deserve to die. Natural selection, after all.",
        text2: "Maybe they don't deserve their positions.",
    },
    {
        speaker: "Jill Valentine",
        bg: "images/doors.jpg",
        spriteVisible: false,
        sprite: "sprites/JillValentine2.jpg",
        spriteVisible: true,
        text: "…",
    },
    {
        speaker: "Barry Burton",
        bg: "images/doors.jpg",
        sprite: "sprites/BarryBurton1.jpg",
        spriteVisible: true,
        text: "That’s extreme, Captain. I’m not one to question, but you gotta have some respect for her.",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/doors.jpg",
        text: "Barry. Don’t get out of line. You know damn well you’re here to assist me.",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/doors.jpg",
        text: "Either that, or I kill your entire family and feed them to the Tyrant.",
    },
    {
        speaker: "Barry Burton",
        bg: "images/doors.jpg",
        spriteVisible: false,
        sprite: "sprites/BarryBurton2.jpg",
        spriteVisible: true,
        text: "…",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/doors.jpg",
        text: "Good. He caught the look I gave him. Poor fool.",
    },
    {
        speaker: "You",
        bg: "images/doors.jpg",
        spriteVisible: false,
        text: "As your captain, I do not expect you to question my authority. And I will not tolerate it.",
    },
    {
        speaker: "You",
        bg: "images/doors.jpg",
        text: "Understood?",
    },
    {
        speaker: "Barry/Jill/Chris",
        bg: "images/doors.jpg",
        text: "Yes, sir!",
    },
    {
        speaker: "You",
        bg: "images/doors.jpg",
        text: "Good. I want you all to split up and look around the mansion for any insights into what could’ve possibly caused the virus outside.",
    },
    {
        speaker: "You",
        bg: "images/doors.jpg",
        text: "I want a full report on clues as soon as possible.",
    },
    {
        speaker: "Chris Redfield",
        bg: "images/doors.jpg",
        sprite: "sprites/ChrisRedfield1.jpg",
        spriteVisible: true,
        text: "Where will you be, Captain Wesker?",
    },
    {
        speaker: "You",
        bg: "images/doors.jpg",
        text: "I’m not sure. I’ll go downstairs to scan the darkest areas of the mansion.",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/doors.jpg",
        text: "He’s as stupid as everyone else. I’m lying, of course.",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/doors.jpg",
        text: "I have more… Pressing matters to attend to in the basement.",
    },
    {
        speaker: "You",
        bg: "images/doors.jpg",
        text: "Now go. I’m counting on all of you.",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/lab1.jpg",
        spriteVisible: false,
        text: "The Tyrant seems primed and ready to go. Now we play the waiting game.",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/lab1.jpg",
        text: "Those poor idiots. They must be shaking from the fear.",
    },
    {
        speaker: "You",
        bg: "images/umbrella.gif",
        text: "...Day-X starts now.",
    },
    {
        speaker: "You",
        bg: "images/black.jpg",
        text: "...",
    },
    {
        speaker: "Jill Valentine",
        bg: "images/black.jpg",
        text: "Captain Wesker?",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/lab2.jpg",
        text: "Finally. It’s been hours since I left them.",
    },
    {
        speaker: "Jill Valentine",
        bg: "images/lab2.jpg",
        sprite: "sprites/JillValentine2.jpg",
        spriteVisible: true,
        text: "What are you doing?",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/black.jpg",
        text: "...",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/lab3.jpg",
        sprite: "assets/pistol.jpg",
        spriteVisible: true,
        text: "...This, dearheart.",
    },
    {
        speaker: "Jill Valentine",
        bg: "images/lab3.jpg",
        text: "Captain! You bastard!",
    },
    {
        speaker: "You",
        bg: "images/lab3.jpg",
        text: "Shut up. Where is Chris?",
    },
    {
        speaker: "Jill Valentine",
        bg: "images/lab3.jpg",
        text: "We got separated. I don’t know!",
    },
    {
        speaker: "Chris Redfield",
        bg: "images/lab3.jpg",
        spriteVisible: false,
        text: "Wesker!...",
    },
    {
        speaker: "Chris Redfield",
        bg: "images/lab4.jpg",
        text: "What the hell is this?",
    },
    {
        speaker: "You",
        bg: "images/lab4.jpg",
        sprite: "assets/pistol2.jpg",
        spriteVisible: true,
        text: "None of your damn business.",
    },
    {
        speaker: "Barry Burton",
        bg: "images/lab4.jpg",
        sound: "audio/pistol2.mp3",
        text: "Follow the man’s orders.",
    },
    {
        speaker: "Jill Valentine",
        bg: "images/lab4.jpg",
        text: "Not you too, Barry!",
    },
    {
        speaker: "You",
        bg: "images/lab3.jpg",
        spriteVisible: false,
        sprite: "assets/pistol.jpg",
        spriteVisible: true,
        text: "Oh, him too. You and Chris are not the only ones held hostage, you know.",
    },
    {
        speaker: "You",
        bg: "images/black.jpg",
        spriteVisible: false,
        text: "Now… It’s time for you all to die.",
    },
    {
        speaker: "You",
        bg: "images/black.jpg",
        sound: "audio/tyrant.mp3",
        text: "...!",
    },
    {
        speaker: "Chris Redfield",
        bg: "images/black.jpg",
        text: "Jill, Barry, run!",
    },
    {
        speaker: "You",
        bg: "images/black.jpg",
        sound: "audio/impalement.mp3",
        extra: "The tyrant turned on you, recognizing you as one of its hostile makers.",
        text: "...",
    },
    {
        speaker: "",
        bg: "images/black.jpg",
        text: "End of Chapter 5."
    },


    // chapter 6
    {
        chapter: 6,
        speaker: "You (thoughts)",
        bg: "images/black.jpg",
        text: "I'm alive, somehow.",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/black.jpg",
        text: "Birkin saved my life with the t-virus shot he gave me before.",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/black.jpg",
        text: "He knew I was going to be in trouble…",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/black.jpg",
        text: "Never mind that. Umbrella probably thinks I’m dead.",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/black.jpg",
        text: "This means I can betray them.",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/lab5.jpg",
        sound: "audio/phone.mp3",
        sprite: "assets/phone.jpg",
        spriteVisible: true,
        text: "...",
    },
    {
        speaker: "???",
        bg: "images/lab5.jpg",
        text: "Hello?",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/lab5.jpg",
        extra: "The g, or golgotha virus, is superior to the t-virus in its bioweapon-creating ability.",
        text: "Ada. Find the g-virus. Bring it to me, ASAP.",
    },
    {
        speaker: "Ada Wong",
        bg: "images/lab5.jpg",
        spriteVisible: false,
        extra: "Switch to Birkin's POV...",
        text: "Roger, Albert.",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/umbrellalab2.jpg",
        sprite: "assets/gvirus.jpg",
        spriteVisible: true,
        text: "I wonder if Wesker is okay. I finished the g-virus we were developing together.",
    },
    {
        speaker: "You (thoughts)",
        bg: "images/umbrellalab2.jpg",
        text: "He'd be so proud of me.",
    },
    {
        speaker: "???",
        bg: "images/umbrellalab2.jpg",
        text: "U.S. Military here! Put the vial down!",
    },
    {
        speaker: "You",
        bg: "images/umbrellalab2.jpg",
        text: "What? Why are you here?!",
    },
    {
        speaker: "U.S. Military",
        bg: "images/umbrellalab2.jpg",
        extra: "The military discovered that Umbrella had been creating bioweapons, despite Wesker’s efforts to hide it. Sergei Vladimir betrayed Wesker, telling the military about the development of the g-virus.",
        text: "Stop asking questions. Put it down, or we will shoot!",
    },
    {
        speaker: "You",
        bg: "images/umbrellalab2.jpg",
        extra: "From here, nothing is canon.",
        text: "No! My precious virus! It took me too long to develop!",
    },
    { 
        speaker: "You (thoughts)",
        bg: "images/umbrellalab2.jpg",
        spriteVisible: false,
        text: "When will Wesker come back?",
    },
    { 
        endingStart: true,
    },
];  

// reads the index and updates elements
// such as the speaker name, background, etc.
function renderScene() {
  let scene = story[index];
  if (scene.choice) {  // if a choice prompt, call showChoices() instead
    showChoices(scene); return; 
  }

  stopSFX(); //stop sound effects before next scene

  if (scene.sound) { // play scene sound effects if clarified
    currentSFX = new Audio(scene.sound);
    currentSFX.play();
  }

  if (scene.chapter) { // update chapter if new chapter starts
    sceneCrest.innerText = `✦ Chapter ${scene.chapter} ✦`;
  }

  speakerName.innerText = scene.speaker; // update speaker and background image
  background.src = scene.bg;

  if (scene.spriteVisible && scene.sprite) { // show or hide character sprite 
    sprite.src = scene.sprite;
    spriteContainer.classList.remove("hidden");
  } else if (scene.spriteVisible === false) {
    spriteContainer.classList.add("hidden");
  }

  
  if (scene.branch) { // display dialogue based on lastChoice
    let branchText = lastChoice === "morality" ? scene.text2 : scene.text1;
    textBox.innerText = branchText;
  } else {
    textBox.innerText = scene.text;
    showHint(scene);
    showExtra(scene); 
  }

  if (scene.endingStart) { 
    loadChapter6Ending();
    index++;
    renderScene();
    return;
  }
}

function stopSFX() { // pause and reset sound effect at the start of every rendered scene
    if (currentSFX) {
        currentSFX.pause();
        currentSFX.currentTime = 0;
        currentSFX = null;
    }
}

nextButton.onclick = function () { // advances index by 1 and renders the next scene.
    index++;
    if (index >= story.length) {
        textBox.innerText = "End.";
        speakerName.innerText = "";
        nextButton.disabled = true;
        return;
    }
    renderScene();
};

function showChoices(scene) { // hides the Next button and shows the two option buttons. each button calls its effect and then resumes story with continueStory()
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

function showHint(scene) { // shows hints in scenes with hints
    if (scene.hint) {
        hintLine.removeAttribute("hidden");
        hintLine.innerText = scene.hint;
    } else {
        hintLine.setAttribute("hidden", "hidden");
    }
}

function showExtra(scene) { // shows extra notes in scenes with extra
    if (scene.extra) {
        extraLine.removeAttribute("hidden");
        extraLine.innerText = scene.extra;
    } else {
        extraLine.setAttribute("hidden", "hidden");
    }
}

function continueStory() { // called after a choice is made. hides choice buttons and reshows next
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

function loadChapter6Ending() { // calculates final score and displays one of three endings.
    console.log("Final Scores.");
    console.log("Influence:", influencePoints);
    console.log("Morality:", moralityPoints);

    const scoreLabel = `Final Score — Influence: ${influencePoints} | Morality: ${moralityPoints}`;
    extraLine.removeAttribute("hidden");
    extraLine.innerText = scoreLabel;

    let ending = [];

    if (influencePoints > moralityPoints) {
        ending = [
            {
                speaker: "You",
                bg: "images/lab5.jpg",
                text: "Thank you for the virus, Ada.",
            },
            {
                speaker: "Ada Wong",
                bg: "images/lab5.jpg",
                sprite: "sprites/AdaWong.jpg",
                spriteVisible: true,
                text: "At your service, Albert.",
            },
            {
                speaker: "Ada Wong",
                bg: "images/lab5.jpg",
                text: "However, your friend didn’t survive. He… Injected himself with the other remaining vial of it.",
            },
            {
                speaker: "You (thoughts)",
                bg: "images/lab5.jpg",
                text: "What a fool. He knew his immune system wasn't as strong as mine…",
            },
            {
                speaker: "William Birkin",
                bg: "images/umbrellalab2.jpg",
                spriteVisible: false,
                sprite: "sprites/WilliamBirkin1.jpg",
                spriteVisible: true,
                text: "Wesker! No, my colleague!",
            },
            {
                speaker: "William Birkin",
                bg: "images/umbrellalab2.jpg",
                text: "I need to know he’s safe!",
            },
            {
                speaker: "William Birkin",
                bg: "images/umbrellalab2.jpg",
                text: "I need…",
            },
            {
                speaker: "William Birkin",
                bg: "images/umbrellalab2.jpg",
                spriteVisible: false,
                sprite: "sprites/WilliamBirkin2.jpg",
                spriteVisible: true,
                text: "Even if he didn’t save me, I…",
            },
            {
                speaker: "William Birkin",
                bg: "images/umbrellalab2.jpg",
                text: "...I can’t live without him anyways…",
            },
            {
                speaker: "William Birkin",
                bg: "images/umbrellalab2.jpg",
                text: "Farewell, c...cruel wor... world…",
            },
            { 
                speaker: "", 
                bg: "images/black.jpg", 
                extra: scoreLabel, 
                text: "INFLUENCE ENDING: Solo world domination." 
            },
        ];
    } else if (moralityPoints > influencePoints) {
        ending = [
            {
                speaker: "You (thoughts)",
                bg: "images/umbrellanight.jpg",
                text: "Birkin.. That idiot’s gotten himself in trouble.",
            },
            {
                speaker: "You (thoughts)",
                bg: "images/umbrellanight.jpg",
                text: "Umbrella’s dangerous, but… I need to save Birkin.",
            },
            {
                speaker: "William Birkin",
                bg: "images/umbrellalab2.jpg",
                text: "Wesker!",
            },
            {
                speaker: "You",
                bg: "images/umbrellalab2.jpg",
                text: "Birkin, shut up and duck!",
            },
            {
                speaker: "You",
                bg: "images/umbrellalab2.jpg",
                sound: "audio/pistol.jpg",
                text: "Crawl through the vent!",
            },
            {
                speaker: "You",
                bg: "images/black.jpg",
                text: "Good, we lost them. You okay, Birkin?",
            },
            {
                speaker: "William Birkin",
                bg: "images/black.jpg",
                text: "Yeah.",
            },
            {
                speaker: "William Birkin",
                bg: "images/black.jpg",
                text: "Why… why would you do that, Wesker?",
            },
            {
                speaker: "William Birkin",
                bg: "images/black.jpg",
                text: "Do what?",
            },
            {
                speaker: "William Birkin",
                bg: "images/black.jpg",
                text: "Save… me?",
            },
            {
                speaker: "William Birkin",
                bg: "images/black.jpg",
                text: "…The g-virus.",
            },
            {
                speaker: "William Birkin",
                bg: "images/black.jpg",
                text: "I couldn’t care less about you.",
            },
            {
                speaker: "William Birkin",
                bg: "images/black.jpg",
                text: "..Aw.",
            },
            {
                speaker: "William Birkin",
                bg: "images/black.jpg",
                text: "..Fine. There’s no one else I would rather dominate the world with.",
            },
            {
                speaker: "William Birkin",
                bg: "images/black.jpg",
                sprite: "assets/gvirus.jpg",
                spriteVisible: true,
                text: "And now with this… We have the power to...",
            },
            { 
                speaker: "", 
                bg: "images/black.jpg", 
                extra: scoreLabel, 
                text: "MORALITY ENDING: Joint world domination." 
            },
        ];
    } else {
        ending = [
            {
                speaker: "You (thoughts)",
                bg: "images/umbrellanight.jpg",
                text: "Birkin.. That idiot’s gotten himself in trouble.",
            },
            {
                speaker: "You (thoughts)",
                bg: "images/umbrellanight.jpg",
                text: "Umbrella’s dangerous, but… I need to save Birkin.",
            },
            {
                speaker: "William Birkin",
                bg: "images/umbrellalab2.jpg",
                text: "Wesker!",
            },
            {
                speaker: "You",
                bg: "images/umbrellalab2.jpg",
                text: "Birkin, shut up and duck!",
            },
            {
                speaker: "You",
                bg: "images/umbrellalab2.jpg",
                sound: "audio/pistol.jpg",
                sprite: "sprites/Hunk.jpg",
                spriteVisible: true,
                text: "Shoot, there’s nowhere to go, we’re cornered…",
            },
            {
                speaker: "William Birkin",
                bg: "images/umbrellalab2.jpg",
                text: "Wesker!... I… I’ll save you! I’ll save us!",
            },
            {
                speaker: "You",
                bg: "images/umbrellalab2.jpg",
                text: "Birkin, no, you can’t handle it!",
            },
            {
                speaker: "William Birkin",
                bg: "images/umbrellalab2.jpg",
                text: "Wesker, I can’t lose you! Can’t lose this!",
            },
            {
                speaker: "You",
                bg: "images/umbrellalab2.jpg",
                sound: "audio/pistol.jpg",
                text: "Birkin! No!",
            },
            {
                speaker: "",
                bg: "images/black.jpg",
                text: "Both of you died tragically. Birkin died from the g-virus taking over his body.. And you were shot dead.",
            },
            { 
                speaker: "", 
                bg: "images/black.jpg", 
                extra: scoreLabel, 
                text: "EQUAL ENDING: No world domination." 
            },
        ];
    }

    for (let i = 0; i < ending.length; i++) { // splice the ending scenes into the story array immediately after the current index
        story.splice(index + 1 + i, 0, ending[i]);
    }
}

renderScene(); // render first scene on page load