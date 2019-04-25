let money = 5;
let electricty = 0;
let greenCertification = 0;
let electrictyPrice = 0;
let greenPrice = 0;


function fail(text){
    let alert = document.querySelector("#alert");
    alert.innerHTML = text;
    alert.classList.remove('close');
    alert.classList.add('open');
    setTimeout(()=>{
        alert.classList.remove('open');
        alert.classList.add('close');
        alert.innerHTML = "";
    }, 2000);
}

function updateResources(){
    document.querySelector(".money").innerHTML='Money: '+money;
    document.querySelector(".electricty").innerHTML='Electricty: '+electricty;
    document.querySelector(".greenCer").innerHTML='Green certification: '+greenCertification;
}

function setResources(){
    localStorage.setItem('money', money);
    localStorage.setItem('electricty', electricty);
    localStorage.setItem('greenCertification', greenCertification);
}

function getResources(){
    money = Number(localStorage.getItem('money'));
    electricty = Number(localStorage.getItem('electricty'));
    greenCertification = Number(localStorage.getItem('greenCertification'));
}

function getPrice(){
    electrictyPrice = Number((Math.floor(Math.random() * (35 - 1)) + 1)/100).toFixed(2);
    greenPrice = Number((Math.floor(Math.random() * (150 - 10)) + 10)).toFixed(2);
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
    }

    update(){
        document.querySelector(`${this.name} .buildings`).innerHTML=this.buildings;
        document.querySelector(`${this.name} .level`).innerHTML=this.level+1;
        document.querySelector(`${this.name} .production`).innerHTML=this.production();
        document.querySelector(`${this.name} .buildPrice`).innerHTML=this.buildPrice();
        document.querySelector(`${this.name} .upgradePrice`).innerHTML=this.upgradePrice();
    }

    production(){
        if (this.buildings==0) return 0;
        else return (this.buildings*(this.level+1)*this.multiplier)/100;
    }

    buildPrice(){
        if(this.buildings == 0) return this.price*this.multiplier;
        else return  (this.price+this.buildings*3)*this.multiplier;
    }

    build(m){
        if(m>=this.buildPrice()){
            money = Number((money - this.buildPrice()).toFixed(5));
            this.buildings++;
            this.update();
        }
        else fail("You need more money!");
    }

    upgradePrice(){
        if(this.level==0)   return this.price*10*this.multiplier;
        else                return this.level*50*this.price*this.multiplier;
    }

    upgrade(m){
        if(m>=this.upgradePrice()){
            money = Number((money - this.upgradePrice()).toFixed(5));
            this.level++;
            this.update();
        }
        else fail("You need more money!");
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
    build(m){
        if(m>=this.buildPrice()){
            money = Number((money - this.buildPrice()).toFixed(5));
            this.buildings++;
            if(this.buildings%25==0){
                greenCertification++;
            }
            this.update();
        }
        else fail("You need more money!");
    }
}

const buildings = [
    new PowerPlant('.wind', 1),
    new PowerPlant('.solar', 10),
];

window.onload = function(){
    if(localStorage.length != 0){
        buildings.forEach(function(building){
            building.getStorage();
        });
        getResources();
    }
    buildings.forEach(function(building){
        building.update();
    });
    updateResources();
    getPrice();
}

buildings.forEach(function(building){
    document.querySelector(`${building.name} .build`).addEventListener('click', ()=>{ 
        building.build(money);
    });
    document.querySelector(`${building.name} .upgrade`).addEventListener('click', ()=>{ 
        building.upgrade(money);
    });    
});

document.querySelector('.sellElectricty').addEventListener('click', function(){
    sell('electricty');
});
document.querySelector('.sellgreenCer').addEventListener('click', function(){
    sell('green');
});

setInterval(function(){
    let newElectricty = 0;
    buildings.forEach((building)=>{
        newElectricty += Number(building.production());
    });
    electricty = Number((electricty + newElectricty).toFixed(3));
    updateResources();
}, 100);

setInterval(function(){
    //localStorage.clear();
    //buildings.forEach((building)=>{
    //    building.updateStorage();
    //});
    //setResources();
}, 1000);

setInterval(function(){
    getPrice();
}, 60000)