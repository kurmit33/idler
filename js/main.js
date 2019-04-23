let money=5;

function update(name, obj, updateMoney){
    document.querySelector(`${name} .buildings`).innerHTML=obj.buildings;
    document.querySelector(`${name} .level`).innerHTML=obj.level+1;
    document.querySelector(`${name} .production`).innerHTML=obj.production();
    document.querySelector(`${name} .buildPrice`).innerHTML=obj.buildPrice();
    document.querySelector(`${name} .upgradePrice`).innerHTML=obj.upgradePrice();
    if(updateMoney) document.getElementById("money").innerHTML='Money '+money;
} 

function updateStorage(name, obj){
    localStorage.setItem(name+'level', obj.level);
    localStorage.setItem(name+'buildings', obj.buildings);
}

function getStorage(name, obj){
    obj.level = Number(localStorage.getItem(name+'level'));
    obj.buildings = Number(localStorage.getItem(name+'buildings'));
}
class PowerPlant{
    constructor(name, multiplier){
        this.buildings = 0;
        this.level = 0;
        this.multiplier = multiplier;
        this.name = name;
        this.price = 5;
    }
    production = function () {
        if (this.buildings==0) return 0;
        else return (this.buildings*(this.level+1)*this.multiplier)/100;
    }

    buildPrice = function(){
        if(this.buildings == 0) return this.price*this.multiplier;
        else return  (this.price+this.buildings*3)*this.multiplier;
    }

    build = function(m){
        if(m>=this.buildPrice()){
            money = Number((money - this.buildPrice()).toFixed(3));
            this.buildings++;
            update(this.name, this, true);
        }
        else ;//alert("You need more money!");
    }
    upgradePrice = function(){
        if(this.level==0)   return this.price*10*this.multiplier;
        else                return this.level*50*this.price*this.multiplier;
    }

    upgrade = function(m){
        if(m>=this.upgradePrice()){
            money = Number((money - this.upgradePrice()).toFixed(3));
            this.level++;
            update(this.name, this, true);
        }
        else ;//alert("You need more money!");
    }
}

let wt = new PowerPlant('#wind', 1);
let sp = new PowerPlant('#solar', 10);

if(localStorage.length !=0){
    getStorage('wt', wt);
    getStorage('sp', sp);
    money = Number(localStorage.getItem('money'));
}
window.onload = function(){
    update('#wind', wt, true);
    update('#solar', sp, false);
}

$('#wind').find('.build').click(function(){
    wt.build(money);
});
$('#wind').find('.upgrade').click(function(){
    wt.upgrade(money);
});

$('#solar').find('.build').click(function(){
    sp.build(money);
});
$('#solar').find('.upgrade').click(function(){
    sp.upgrade(money);
});

setInterval(function(){
    money = Number((money + Number(wt.production()+sp.production())).toFixed(2));
    document.getElementById("money").innerHTML='Money '+money;
}, 100);
setInterval(function(){
    localStorage.clear();
    updateStorage('wt', wt);
    updateStorage('sp', sp);
    localStorage.setItem('money', money);
}, 1000);