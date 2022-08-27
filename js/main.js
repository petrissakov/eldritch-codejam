import ancientsData from "../data/ancients.js";
import difficulties from "../data/difficulties.js"
import  {brownCards, blueCards, greenCards}  from "../data/mythicCards/index.js";


const ancients_c = document.querySelector('.ancients_c');
const level_list = document.querySelector('.level_list'); 
const game_c = document.querySelector('.game_c');
const button = document.querySelector('#start_game_btn'); // если кнопка уже создавалась - больше не создаем, только показываем
const stages_container = document.querySelector('.stages_container');
const deck_container = document.querySelector('.deck_c');
const card_container = document.querySelector('.card_c');

let current_stage = []

let game_settings = {
    ancient: null,
    levelID: '',
    stage: 0
};

let deck = []

let stage_h = [
    'Первая Стадия',
    'Вторая Стадия',
    'Третья Стадия'
]

function showAncient(){
    if(game_settings.ancient){
        showStart();
    }
    for(let ancient of ancientsData){
    const div = document.createElement('div');
    div.classList.add('ancient_card');
    div.id = ancient.id;
    div.style.backgroundImage=`url('${ancient.cardFace}')`
    ancients_c.append(div);
    div.onclick = setAncient;
    }
}

function setAncient(event){
    if(game_settings.ancient) {
        document.querySelector(`#${game_settings.ancient.id}`).classList.toggle('active'); // снимаем на прежнем элементе выделение
        event.srcElement.classList.toggle('active');
        game_settings.ancient = ancientsData.filter((value)=>value.id==event.srcElement.id)[0]; // получаем объект ancient из массива
        showStart();
        console.log(game_settings);
        return;
    } // если древний уже установлен - повторно список не выводим
    event.srcElement.classList.toggle('active');
    game_settings.ancient = ancientsData.filter((value)=>value.id==event.srcElement.id)[0];
    console.log(game_settings);
    showdiff();
    
    
}

function showdiff(){
    

    for(let level of difficulties){

        const li = document.createElement('li');
        li.classList.add('level_item');
        li.id = level.id;
        li.textContent = level.name;
        level_list.append(li);
        li.onclick = setDiff;
    }


}

function setDiff(event){
if(game_settings.levelID) {
    document.querySelector(`#${game_settings.levelID}`).classList.remove('active'); // снимаем на прежнем элементе выделение
    event.srcElement.classList.add('active');
    game_settings.levelID = event.srcElement.id;
    console.log(game_settings);
    showStart();
    return;
} // если сложность уже установлена повторно не выводим
event.srcElement.classList.toggle('active');
game_settings.levelID = event.srcElement.id;
showStart();
}


function showStart(event){
    button.classList.toggle('hidden')
    console.log(game_settings);
    button.onclick = startGame;

}


function randomArr(arr, len){ // фукнция возвращает рандомный список длиной len из исходного arr
    let result = [];
    let srcArrlen = arr.length;
    for(let i=1; i<=len; i++){
        if(i>srcArrlen) break;
        let random_index = Math.floor(Math.random()*arr.length);
        result.push(arr[random_index]);
        arr.splice(random_index,1);

    }
    return result;
}

function getCards(count, level, deck){
    let result = [];
    let easy_cards = deck.filter((value)=>value['difficulty']=='easy');
    let normal_cards = deck.filter((value)=>value['difficulty']=='normal');
    let hard_cards = deck.filter((value)=>value['difficulty']=='hard');

    if(level=="veryeasy"){
        let delta = count - easy_cards.length;

        if(delta<=0) result = randomArr(easy_cards, count);
        else result = randomArr(easy_cards.concat(randomArr(normal_cards,delta)),count);
       } else if(level=='easy'){
            let easy_normal = easy_cards.concat(normal_cards);
            result = randomArr(easy_normal, count);
       } else if(level=='normal'){
            result = randomArr(deck, count);
       } else if(level=='hard'){
            let normal_hard = normal_cards.concat(hard_cards);
            result = randomArr(normal_hard, count);
       } else if(level=='veryhard'){
            let delta = count - hard_cards.length;
            if(delta<=0) result = randomArr(hard_cards, count);
            else result = randomArr(hard_cards.concat(randomArr(normal_cards,delta)),count);
       }
    return result;
}

function shuffleDeck(){
    let ancient = game_settings.ancient;
    let blue_sum = ancient.firstStage.blueCards + ancient.secondStage.blueCards + ancient.thirdStage.blueCards;
    let blueDeck = getCards(blue_sum, game_settings.levelID, blueCards);
    let green_sum = ancient.firstStage.greenCards + ancient.secondStage.greenCards + ancient.thirdStage.greenCards;
    let greenDeck = getCards(green_sum, game_settings.levelID, greenCards);
    let brown_sum = ancient.firstStage.brownCards + ancient.secondStage.brownCards + ancient.thirdStage.brownCards;
    let brownDeck = getCards(brown_sum, game_settings.levelID, brownCards);

    let firstStage = [
        ...randomArr(greenDeck, ancient.firstStage.greenCards),
        ...randomArr(blueDeck, ancient.firstStage.blueCards),
        ...randomArr(brownDeck, ancient.firstStage.brownCards),
    ];


    let secondStage = [
        ...randomArr(greenDeck, ancient.secondStage.greenCards),
        ...randomArr(blueDeck, ancient.secondStage.blueCards),
        ...randomArr(brownDeck, ancient.secondStage.brownCards),
    ];


    let thirdStage = [
        ...randomArr(greenDeck, ancient.thirdStage.greenCards),
        ...randomArr(blueDeck, ancient.thirdStage.blueCards),
        ...randomArr(brownDeck, ancient.thirdStage.brownCards),
    ]

    return [firstStage, secondStage, thirdStage];
}



function startGame(){

    button.classList.add('hidden');
    deck = shuffleDeck();
    console.log(deck);
    for(let i=0; i<deck.length; i++){
        let stage = document.createElement('div');
        stage.classList.add('stage');
        stage.id = 'stage' + String(i + 1);
        let stage_text = document.createElement('span');
        stage_text.classList.add('stage_text');
        stage_text.textContent = stage_h[i];
        stage.append(stage_text);
        let colors_container = document.createElement('div');
        colors_container.classList.add('colors_container');

        for(let color of ['green', 'blue', 'brown']){
            console.log(color);
            let dot = document.createElement('div');
            dot.classList.add('dot');
            dot.classList.add(color);
            dot.textContent = deck[i].filter((value)=>value.color==color).length;
            colors_container.append(dot);
        }
        

        stages_container.append(stage);
        stage.append(colors_container);
    }
    deck_container.classList.toggle('hidden');
    deck_container.onclick = showCard;
}

function showCard(){

    if(deck[0].length==0) deck.shift(); // если карты на стадии закончились удаляем пустой список из массива
    let card = randomArr(deck[0], 1)[0];
    console.log(card);
    card_container.style.backgroundImage = `url('${card.cardFace}')`;
    card_container.classList.remove('hidden');

}

showAncient();

