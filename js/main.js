let money=5;

function update(name, obj, m){
    $(name).find('.buildings').html(obj.buildings);
    $(name).find('.level').html(obj.level+1);
    $(name).find('.production').html(obj.production());
    $(name).find('.buildPrice').html(obj.buildPrice());
    $(name).find('.upgradePrice').html(obj.upgradePrice());
    if(m==true) document.getElementById("money").innerHTML='Money '+money;
} 

function updateStorage(name, obj){
    localStorage.setItem(name+'level', obj.level);
    localStorage.setItem(name+'buildings', obj.buildings);
}

function getStorage(name, obj){
    obj.level = Number(localStorage.getItem(name+'level'));
    obj.buildings = Number(localStorage.getItem(name+'buildings'));
}

class WindTurbine {
    constructor(){
        this.buildings = 0;
        this.level = 0;
        this.priceNewBuilding = 5;
        this.priceNextLevel = 50;
    }

    production = function () {
        if (this.buildings==0) return 0;
        else return (this.buildings*(this.level+1))/100;
    }    

    buildPrice = function(){
        if(this.buildings == 0) return this.priceNewBuilding;
        else return  this.priceNewBuilding+this.buildings*3;
    }

    build = function(m){
        if(m>=this.buildPrice()){
            money = Number((money - this.buildPrice()).toFixed(3));
            this.buildings++;
            update('#wind', this, true);
        }
        else ;//alert("You need more money!");
    }
    upgradePrice = function(){
        if(this.level==0)   return this.priceNextLevel;
        else                return this.level*5*this.priceNextLevel;
    }

    upgrade = function(m){
        if(m>=this.upgradePrice()){
            money = Number((money - this.upgradePrice()).toFixed(3));
            this.level++;
            update('#wind', this, true);
        }
        else ;//alert("You need more money!");
    }
}

class SolarPanel {
    constructor(){
        this.buildings = 0;
        this.level = 0;
        this.priceNewBuilding = 50;
        this.priceNextLevel = 500;
    }

    production = function () {
        if (this.buildings==0) return 0;
        else return (this.buildings*(this.level+1))/10;
    }    

    buildPrice = function(){
        if(this.buildings == 0) return this.priceNewBuilding;
        else return  this.priceNewBuilding+this.buildings*25;
    }

    build = function(m){
        if(m>=this.buildPrice()){
            money = Number((money - this.buildPrice()).toFixed(2));
            this.buildings++;
            update('#solar', this, true);
        }
        else ;//alert("You need more money!");
    }
    upgradePrice = function(){
        if(this.level==0)   return this.priceNextLevel;
        else                return this.level*5*this.priceNextLevel;
    }

    upgrade = function(m){
        if(m>=this.upgradePrice()){
            money = Number((money - this.upgradePrice()).toFixed(2));
            this.level++;
            update('#solar', this, true);
        }
        else ;//alert("You need more money!");
    }
}

let wt = new WindTurbine();
let sp = new SolarPanel();

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