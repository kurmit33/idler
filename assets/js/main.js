let money = 5;
let electricty = 0;
let greenCertification = 0;
let electrictyPrice = 0;
let greenPrice = 0;
let engineers = 0;
let intervalTime = 100;
let eventName;
let eventMultipiler = 0;
let timeStartEvent = 0;
let timeFinishEvent = 0;
let multiplierBuild = 1;
let lastMultiplierBuild = 1;

let hidden, visibilityChange;
if (typeof document.hidden !== "undefined") {  
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} 
else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
} 
else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}

function changeInterval(){
    if(document[hidden]){
        intervalTime = 2000;
    }
    else{
        intervalTime = 100;
    }
}

if (typeof document.addEventListener === "undefined" || hidden === undefined) {
    console.log("This demo requires a browser, such as Google Chrome or Firefox, that supports the Page Visibility API.");
} 
else { 
    document.addEventListener(visibilityChange, changeInterval(), false);
}

function changeNumber(num, digits){
    let si = [
        { value: 1, symbol: "" },
        { value: 1E3, symbol: "K" },
        { value: 1E6, symbol: "M" },
        { value: 1E9, symbol: "G" },
        { value: 1E12, symbol: "T" },
        { value: 1E15, symbol: "P" },
        { value: 1E18, symbol: "E" }
    ];

    let rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
     let i;
    for(i = si.length - 1; i > 0; i--){
        if(num >si[i].value) break;
    }
    return (num/si[i].value).toFixed(digits).replace(rx, "$1") + ' '+si[i].symbol;
}
function multiSpace(num){
    let multipilerSpace = 1;
    while(num>=10){
        multipilerSpace++;
        num = (num/10).toFixed();
    }
    return multipilerSpace;
}

function fail(text, timeOn){
    let alert = document.querySelector("#alert");
    alert.innerHTML = text;
    alert.classList.remove('close');
    alert.classList.add('open');
    setTimeout(function(){
        alert.classList.remove('open');
        alert.classList.add('close');
        alert.innerHTML = "";
    }, timeOn);
}

function updateResources(){
    document.querySelector(".money").innerHTML='Money: '+changeNumber(money, 2);
    document.querySelector(".electricty").innerHTML='Electricty: '+changeNumber(electricty, 4);
    document.querySelector(".greenCer").innerHTML='Green certification: '+greenCertification;
    document.querySelector(".engineers").innerHTML='Engineers: '+engineers;
}

function setResources(){
    localStorage.setItem('money', money);
    localStorage.setItem('electricty', electricty);
    localStorage.setItem('greenCertification', greenCertification);
    localStorage.setItem('lastTime', Date.now());
    localStorage.setItem('engineers', engineers);
}

function getResources(){
    money = Number(localStorage.getItem('money'));
    electricty = Number(localStorage.getItem('electricty'));
    greenCertification = Number(localStorage.getItem('greenCertification'));
    engineers = Number(localStorage.getItem('engineers'));
}

function randomus(mini, maxiu, multi){
    return Number((Math.floor(Math.random() * (maxiu - mini)) + mini)*multi);
}

function getPrice(){
    electrictyPrice = Number(randomus(10, 35, 0.01).toFixed(2));
    greenPrice = Number(randomus(350, 700, 1).toFixed(2));
    document.querySelector('.priceElectricty').innerHTML = "Electricty price: "+ electrictyPrice;
    document.querySelector('.priceGreenCer').innerHTML = "Green price: "+ greenPrice;
}

function sell(name){
    switch(name){
        case 'electricty':
            money = Number(money)+Number(electricty)*Number(electrictyPrice);
            money = money.toFixed(5);
            electricty = 0;
        break;
        case 'green':
            money = Number(money)+Number(greenCertification)*Number(greenPrice);
            money = money.toFixed(5);
            greenCertification = 0;
        break;
    }
}

class PowerPlant{
    constructor(name, multiplier){
        this.buildings = 0;
        this.level = 0;
        this.multiplier = multiplier;
        this.name = name;
        this.price = 5;
        this.freeSpace = 20/multiSpace(multiplier);
    }

    update(){
        updateResources();
        document.querySelector(`${this.name} .buildings`).innerHTML= changeNumber(this.buildings, 0);
        document.querySelector(`${this.name} .level`).innerHTML=changeNumber(this.level+1, 0);
        document.querySelector(`${this.name} .production`).innerHTML=changeNumber(this.production(), 0);
        document.querySelector(`${this.name} .buildPrice`).innerHTML=changeNumber(this.buildPrice(parseInt(multiplierBuild)), 0);
        document.querySelector(`${this.name} .upgradePrice`).innerHTML=changeNumber(this.upgradePrice(parseInt(multiplierBuild)), 0);
        document.querySelector(`${this.name} .space`).innerHTML=changeNumber(this.space(), 0);
    }

    space(){
        return Number(this.freeSpace*(this.level+1));
    }

    production(name, multi){
        let eventMulti = 0;
        if(this.name == name) eventMulti = multi;
        let product = Number((this.buildings*(this.level+1)*this.multiplier)/100);
        return Number(product+(product*engineers*0.02)+(product*eventMulti)).toFixed(3);
    }

    buildPrice(num){
        let tempPrice = 0;
        for(let i=this.buildings; i<(this.buildings+num); i++){
            tempPrice = Number((this.price+i*3)*this.multiplier)+Number(tempPrice);
        }
        return tempPrice;
    }

    build(m){
        if(m>=this.buildPrice(num)){
            money = Number((money - this.buildPrice(num)).toFixed(5));
            this.buildings++;
            this.update();
        }
        else fail("You need more money!", 2000);
    }

    upgradePrice(num){
        let tempPrice = 0;
        for(let i=this.level; i<(this.level+num); i++){
            tempPrice = Number((1+i)*50*this.price*this.multiplier)+Number(tempPrice);
        }
        return tempPrice; 
    }

    upgrade(m, num){
        if(m>=this.upgradePrice(num)){
            money = Number((money - this.upgradePrice(num)).toFixed(5));
            this.level += num;
            this.update();
        }
        else fail("You need more money!", 2000);
    }

    getStorage(){
        this.level = Number(localStorage.getItem(this.name+'Level'));
        this.buildings = Number(localStorage.getItem(this.name+'Buildings'));
    }

    updateStorage(){
        localStorage.setItem(this.name+'Level', this.level);
        localStorage.setItem(this.name+'Buildings', this.buildings);
    }
}

class GreenPowerPlant extends PowerPlant{
    build(m, num){
        if(this.space() >= (this.buildings+num)){
            if(m>=this.buildPrice(num)){
                money = Number((money - this.buildPrice(num)).toFixed(5));
                for(let i=this.buildings; i<=(this.buildings+num); i++){
                    if(i%25 == 0) greenCertification +=this.multiplier;
                }
                this.buildings += num;
                this.update();
            }
            else fail("You need more money!", 2000);
        }
        else fail("You need more free space!", 2000);
    }
}

class ConvencionalPowerPlant extends PowerPlant{
    constructor(name, multiplier){
        super(name, multiplier);
        this.green = 10;
    }

    production(name, multi){
        return Number(super.production(name, multi)*100)
    }

    priceGreen(num){
        let tempBuildGreen = 0;
        for(let i=this.buildings; i<(this.buildings+num); i++){
            tempBuildGreen = Number(this.green * Number(i+1))+Number(tempBuildGreen);
        }
        return Number(tempBuildGreen);
    }

    upgradePriceGreen(num){
        let tempPrice = 0;
        for(let i=this.level; i<(this.level+num); i++){
            tempPrice = Number(this.green * Number(i+1)*10)+Number(tempPrice);
        }
        return Number(tempPrice);
    }
    update(){
        super.update();
        document.querySelector(`${this.name} .greenBuildPrice`).innerHTML=changeNumber(this.priceGreen(parseInt(multiplierBuild)), 0);
        document.querySelector(`${this.name} .greenUpgradePrice`).innerHTML=changeNumber(this.upgradePriceGreen(parseInt(multiplierBuild)), 0);
    }
    build(m, num){
        if(this.space() >= (this.buildings+num)){
            if((m>=this.buildPrice(num)) && (greenCertification>=this.priceGreen(num))){
                money = Number((money - this.buildPrice(num)).toFixed(5));
                greenCertification = greenCertification-this.priceGreen(num);
                this.buildings += num;
                this.update();
            }
            else fail("You need more money or Green Certification!", 2000);
        }
        else fail("You need more free space!", 2000);
    }

    upgrade(m, num){
        if((m>=this.upgradePrice(num)) && (greenCertification>=this.upgradePriceGreen(num))){
            money = Number((money - this.upgradePrice(num)).toFixed(5));
            greenCertification = greenCertification-this.upgradePriceGreen(num);
            this.level += num;  
            this.update();
        }
        else fail("You need more money or Green Certification!", 2000);
    }
}

class Event{
    constructor(name, title, chanceMin, chanceMax, workTime){
        this.name = name;
        this.title = title;
        this.chanceMin = chanceMin;
        this.chanceMax = chanceMax;
        this.workTime = workTime;
        this.lessOrMore= "";
    }
    goodOrBad(){
        if(randomus(1, 3, 1)==1) {
            this.lessOrMore = "more energy. The Multiplier is ";
            return Number(randomus(10, 50, 0.01).toFixed(2));
        }
        else {
        this.lessOrMore = "less energy. The Multiplier is ";
           return Number(-randomus(10, 50, 0.01).toFixed(2));
        }
    }
    isOn(randomNum){
        if((randomNum>=100) && (this.name == 'WorldEnd')) {
            hardReset(10);
            fail(this.title, 15000);
        }
        if((randomNum >= this.chanceMin) && (randomNum<this.chanceMax)){
            timeStartEvent = Date.now();
            timeFinishEvent = Date.now()+this.workTime;
            eventName = this.name;
            eventMultipiler = this.goodOrBad();
            fail((this.title+this.lessOrMore+eventMultipiler), 25000);
        }
    }
}

const buildings = [
    new GreenPowerPlant('.wind', 1),
    new GreenPowerPlant('.solar', 10),
    new ConvencionalPowerPlant('.coal', 1000),
    new ConvencionalPowerPlant('.bioGas', 2500),
];
const events = [
    new Event('.wind', "Wind Turbin produce ", 1, 20, 120000),
    new Event('.solar', "Solar panel produce ", 20, 40, 120000),
    new Event('.coal', "Coal power plant produce ", 40, 60, 120000),
    new Event('WorldEnd', "World is END!!!! ", 100, 101, 100),
];
function offlineProduction(){
    let timeDiff = Number((Date.now() - localStorage.getItem('lastTime'))/100);
    let newElectricty = 0;
    for(const building of buildings){
        newElectricty += Number(building.production(eventName, eventMultipiler)*timeDiff);
    }
    electricty += newElectricty;
}

window.onload = function(){
    if(localStorage.length != 0){
        for(const building of buildings){
            building.getStorage();
        }
        getResources();
        offlineProduction();
    }
    for(const building of buildings){
        building.update();
    }
    updateResources();
    getPrice();
}

function hardReset(num){
    localStorage.clear();
    money = 5;
    electricty = 0;
    greenCertification = 0;
    for(const building of buildings){
        building.level = 0;
        building.buildings = 0;
        building.update();
    }
    engineers = Number(num)+Number(engineers);
}

function check(num){
    let tempName;
    if(lastMultiplierBuild != multiplierBuild){
        tempName = "#mm"+lastMultiplierBuild;
        document.querySelector(tempName).classList.remove('radioChecked');
        tempName = "#mm"+num;
        document.querySelector(tempName).classList.add('radioChecked');
        for(const building of buildings){
            building.update();
        }
    }
    lastMultiplierBuild = multiplierBuild;
}

function softReset(){
    let tempBuildings = 0;
    let tempEnginiers = 0;
    for(const building of buildings){
        tempBuildings += Number(building.buildings);
    }
    tempEnginiers = Number(Math.floor(tempBuildings/2000));
    hardReset(tempEnginiers);
}

for(const building of buildings){
    document.querySelector(`${building.name} .build`).addEventListener('click', function(){ 
            building.build(money, parseInt(multiplierBuild));
    });
    document.querySelector(`${building.name} .upgrade`).addEventListener('click', function(){ 
        building.upgrade(money, parseInt(multiplierBuild));
    });    
}
for(const radio of document.querySelectorAll('.radios')){
        radio.addEventListener('click', function(){
            multiplierBuild = document.querySelector('input[name="multi"]:checked').value;
        check(multiplierBuild);
    });
}
document.querySelector('.hardReset').addEventListener('click', function(){
    hardReset(0);
});
document.querySelector('.softReset').addEventListener('click', function(){
    softReset();
});
document.querySelector('.sellElectricty').addEventListener('click', function(){
    sell('electricty');
});
document.querySelector('.sellgreenCer').addEventListener('click', function(){
    sell('green');
});


window.addEventListener('unload', function(){
    localStorage.clear();
    for(const building of buildings){
        building.updateStorage();
    }
    setResources();
});

setInterval(function(){
    let newElectricty = 0;
    for(const building of buildings){
        newElectricty += Number(building.production(eventName, eventMultipiler));
    }
    electricty = Number((electricty + newElectricty).toFixed(3));
    updateResources();
}, intervalTime);

setInterval(function(){
    if(timeFinishEvent<Date.now()){
        eventName = "";
        eventMultipiler = 0;
    }
}, 100);

setInterval(function(){
    getPrice();
}, 60000);

setInterval(function(){
    if(Date.now()>timeFinishEvent){
        let number = randomus(1, 101, 1);
        for(const event of events){
            event.isOn(number);
        }
    }
}, 300000);
