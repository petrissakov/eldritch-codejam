import ancientsData from "../data/ancients.js";
import difficulties from "../data/difficulties.js"
import  {brownCards, blueCards, greenCards}  from "../data/mythicCards/index.js";


const ancients_c = document.querySelector('.ancients_c');
const level_list = document.querySelector('.level_list'); 
const game_c = document.querySelector('.game_c');
let game_settings = {
    ancient: null,
    levelID: '',
};

let cardDeck = [
    {'green':0, 'brown':0, 'blue':0},
    {'green':0, 'brown':0, 'blue':0},
    {'green':0, 'brown':0, 'blue':0},
];


function showAncient(){
    for(let ancient of ancientsData){
    const div = document.createElement('div');
    div.classList.add('ancient_card');
    div.id = ancient.id;
    div.style.backgroundImage=`url('${ancient.cardFace}')`
    ancients_c.append(div);
    div.onclick = showdiff;
    }
}

function showdiff(event){
    
    if(game_settings.ancient) {
        document.querySelector(`#${game_settings.ancient.id}`).classList.toggle('active'); // снимаем на прежнем элементе выделение
        event.srcElement.classList.toggle('active');
        game_settings.ancient = ancientsData.filter((value)=>value.id==event.srcElement.id)[0]; // получаем объект ancient из массива
        console.log(game_settings);
        return;
    } // если древний уже установлен - повторно список не выводим
    event.srcElement.classList.toggle('active');
    game_settings.ancient = ancientsData.filter((value)=>value.id==event.srcElement.id)[0];
    console.log(game_settings);

    for(let level of difficulties){

        const li = document.createElement('li');
        li.classList.add('level_item');
        li.id = level.id;
        li.textContent = level.name;
        level_list.append(li);
        li.onclick = showStart;
    }


}

function showStart(event){
    if(game_settings.levelID) {
        document.querySelector(`#${game_settings.levelID}`).classList.toggle('active'); // снимаем на прежнем элементе выделение
        event.srcElement.classList.toggle('active');
        game_settings.levelID = event.srcElement.id;
        console.log(game_settings);
        return;
    } // если сложность уже установлена повторно не выводим
    event.srcElement.classList.toggle('active');
    game_settings.levelID = event.srcElement.id;
    console.log(game_settings);
    const div = document.createElement('div');
    div.id = 'start_game_btn';
    div.textContent = 'В путь!';
    game_c.append(div);
    div.onclick = startGame;

}

function randomChoice(arr){
    return Math.floor(Math.random()*arr.length);
}

function getCards(count, level, deck){
    let result = [];
    let easy_cards = deck.filter((value)=>value['difficulty']=='easy')
    let normal_cards = deck.filter((value)=>value['difficulty']=='normal')
    let hard_cards = deck.filter((value)=>value['difficulty']=='hard')
    console.log(easy_cards);
    if(level=="veryeasy"){
        let delta = count - easy_cards.length; // получаем количество недостающих карт
        if(delta>0){
        result = result.concat(easy_cards); // помещаем все легки карты
        for(let i=0; i<delta; i++){ // добиваем нормальными
            let elem = normal_cards.splice(randomChoice(normal_cards),1)[0];
            console.log(elem);
            result.push(elem);
        }
    } else {
        for(let i=0; i<count; i++){
            let elem = normal_cards.splice(randomChoice(normal_cards),1)[0];
            console.log(elem);
            result.push(elem);
        }
    }
    }
    console.log(result);
}

function shuffleDeck(){
    
}

function startGame(){

    const button = document.querySelector('#start_game_btn');
    button.style.display = "None";
    getCards(9, game_settings.levelID, blueCards);
}


showAncient();