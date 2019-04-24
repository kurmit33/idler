let money=5;
let electricty=0;
let greenCertification = 0;
let electrictyPrice = 0;

function updateResources(){
    document.querySelector(".money").innerHTML='Money '+money;
    document.querySelector(".electricty").innerHTML='Electricty '+electricty;
    document.querySelector(".greenCer").innerHTML='Green certification '+greenCertification;
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

function getElectrictyPrice() {
    return ((Math.floor(Math.random() * (35 - 1)) + 1)/100).toFixed(2);
}

class PowerPlant{
    constructor(name, multiplier){
        this.buildings = 0;
        this.level = 0;
        this.multiplier = multiplier;
        this.name = name;
        this.price = 5;
    }

    update = function () {
        document.querySelector(`${this.name} .buildings`).innerHTML=this.buildings;
        document.querySelector(`${this.name} .level`).innerHTML=this.level+1;
        document.querySelector(`${this.name} .production`).innerHTML=this.production();
        document.querySelector(`${this.name} .buildPrice`).innerHTML=this.buildPrice();
        document.querySelector(`${this.name} .upgradePrice`).innerHTML=this.upgradePrice();
    }

    production = ()=>{ // tak metody wenętrzne
        if (this.buildings==0) return 0;
        else return (this.buildings*(this.level+1)*this.multiplier)/100;
    }

    buildPrice = ()=>{
        if(this.buildings == 0) return this.price*this.multiplier;
        else return  (this.price+this.buildings*3)*this.multiplier;
    }

    build = (m)=>{
        if(m>=this.buildPrice()){
            money = Number((money - this.buildPrice()).toFixed(3));
            this.buildings++;
            this.update();
        }
        else ;//alert("You need more money!");
    }

    upgradePrice = ()=>{
        if(this.level==0)   return this.price*10*this.multiplier;
        else                return this.level*50*this.price*this.multiplier;
    }

    upgrade = (m)=>{
        if(m>=this.upgradePrice()){
            money = Number((money - this.upgradePrice()).toFixed(3));
            this.level++;
            this.update();
        }
        else ;//alert("You need more money!");
    }

    getStorage = ()=>{
        this.level = Number(localStorage.getItem(this.name+'Level'));
        this.buildings = Number(localStorage.getItem(this.name+'Buildings'));
    }

    updateStorage = ()=>{
        localStorage.setItem(this.name+'Level', this.level);
        localStorage.setItem(this.name+'Buildings', this.buildings);
    }
}

let wt = new PowerPlant('.wind', 1);
let sp = new PowerPlant('.solar', 10);

window.onload = ()=>{
    if(localStorage.length >0){
        wt.getStorage();
        sp.getStorage();
    }
    wt.update();
    sp.update();
    getResources();
    electrictyPrice = getElectrictyPrice();
    document.querySelector('.sellPrice').innerHTML = electrictyPrice;
}

document.querySelector(`${wt.name} .build`).addEventListener('click', function(){ wt.build(money) });
document.querySelector(`${wt.name} .upgrade`).addEventListener('click', function(){ wt.upgrade(money) });
document.querySelector(`${sp.name} .build`).addEventListener('click', function(){ sp.build(money) });
document.querySelector(`${sp.name} .upgrade`).addEventListener('click', function(){ sp.upgrade(money) });

setInterval(()=>{
    electricty = Number((electricty + Number(wt.production()+sp.production())).toFixed(2));
    updateResources();
}, 100);

setInterval(()=>{
    localStorage.clear();
    wt.updateStorage();
    sp.updateStorage();
    setResources();
}, 1000);

setInterval(()=> {
    electrictyPrice = getElectrictyPrice();
    document.querySelector('.sellPrice').innerHTML = electrictyPrice;
}, 60000)