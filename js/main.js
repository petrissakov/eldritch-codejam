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

let deck = [];

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
        resetGame();

        showStart();
        return;
    } // если древний уже установлен - повторно список не выводим
    event.srcElement.classList.toggle('active');
    game_settings.ancient = ancientsData.filter((value)=>value.id==event.srcElement.id)[0];
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
    resetGame();
    showStart();
    return;
} // если сложность уже установлена повторно не выводим
event.srcElement.classList.toggle('active');
game_settings.levelID = event.srcElement.id;
showStart();
}


function showStart(event){
    button.classList.remove('hidden')
    console.log(game_settings);
    button.onclick = showDeck;

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

function getCards(count, level, src_deck){
    let result = [];
    let all_card = src_deck.slice();
    let easy_cards = src_deck.filter((value)=>value['difficulty']=='easy');
    let normal_cards = src_deck.filter((value)=>value['difficulty']=='normal');
    let hard_cards = src_deck.filter((value)=>value['difficulty']=='hard');

    if(level=="veryeasy"){
        let delta = count - easy_cards.length;

        if(delta<=0) result = randomArr(easy_cards, count);
        else result = randomArr(easy_cards.concat(randomArr(normal_cards,delta)),count);
       } else if(level=='easy'){
            let easy_normal = easy_cards.concat(normal_cards);
            result = randomArr(easy_normal, count);
       } else if(level=='normal'){
            result = randomArr(all_card, count);
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



function showDeck(){

    button.classList.add('hidden');
    deck = shuffleDeck();
    console.log(deck);
    deck_container.classList.remove('hidden'); // выводим рубашку колоды
    stages_container.classList.remove('hidden');
    if(document.querySelector('.stage')) { // если раксладка карт по цветам уже была создана - только обновляем значения
        console.log('раскладка уже есть')
        
        refreshDeck();
        return;
    }

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
            let dot = document.createElement('div');
            dot.classList.add('dot');
            dot.classList.add(color);
            let value = deck[i].filter((value)=>value.color==color).length;
            dot.textContent = (value == 0) ? '' : value;
            colors_container.append(dot);
        }
        

        stages_container.append(stage);
        stage.append(colors_container);
    }
    deck_container.onclick = showCard;
}

function refreshDeck(){
    const stages = document.querySelectorAll('.stage');
   for(let i=0;i<stages.length;i++){
    
    for(let color of ['green', 'blue', 'brown']){
        const dot  = stages[i].querySelector(`.${color}`);
        let value = deck[i].filter((value)=>value.color==color).length;
        dot.textContent = (value == 0) ? '' : value;

    }
   }

}

function showCard(){
    let card;
    for(let stage=0; stage<deck.length; stage++){
        if(deck[stage].length==0) {// если карты на стадии закончились пропускаем stage
            document.querySelector(`#stage${stage+1}>.stage_text`).classList.add('finish');
            continue;
        } 
        console.log('stage' + stage);
        card_container.classList.remove('hidden');
        card = randomArr(deck[stage], 1)[0];
        break;
        
    }
    console.log(card);
    if(!card){
        card_container.style.backgroundImage = `none`
        deck_container.classList.add('hidden');
        card_container.classList.add('hidden'); // скрываем карту
        return
    }
    card_container.style.backgroundImage = `url('${card.cardFace}')`;
    card_container.classList.remove('hidden');
    refreshDeck();
}

function resetGame(){
    console.log('Reseting game...')
    deck = [];
    card_container.style.backgroundImage = `none`
    stages_container.classList.add('hidden');
    deck_container.classList.add('hidden');
    card_container.classList.add('hidden'); // скрываем карту
    document.querySelectorAll('.stage_text').forEach((item)=>item.classList.remove('finish'))

    console.log(greenCards.length, blueCards.length, brownCards.length);
}

showAncient();

