let money = 5;
let electricty = 0;
let greenCertification = 0;
let electrictyPrice = 0;
let greenPrice = 0;
let engineers = 0;

function multiSpace(num){
    let multipilerSpace = 1;
    while(num>=10){
        multipilerSpace++;
        num = (num/10).toFixed();
    }
    return multipilerSpace;
}

function fail(text){
    let alert = document.querySelector("#alert");
    alert.innerHTML = text;
    alert.classList.remove('close');
    alert.classList.add('open');
    setTimeout(function(){
        alert.classList.remove('open');
        alert.classList.add('close');
        alert.innerHTML = "";
    }, 2000);
}

function updateResources(){
    document.querySelector(".money").innerHTML='Money: '+money;
    document.querySelector(".electricty").innerHTML='Electricty: '+electricty;
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

function getPrice(){
    electrictyPrice = Number((Math.floor(Math.random() * (35 - 10)) + 10)/100).toFixed(2);
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
        this.freeSpace = 20/multiSpace(multiplier);
    }

    update(){
        updateResources();
        document.querySelector(`${this.name} .buildings`).innerHTML=this.buildings;
        document.querySelector(`${this.name} .level`).innerHTML=this.level+1;
        document.querySelector(`${this.name} .production`).innerHTML=this.production();
        document.querySelector(`${this.name} .buildPrice`).innerHTML=this.buildPrice();
        document.querySelector(`${this.name} .upgradePrice`).innerHTML=this.upgradePrice();
        document.querySelector(`${this.name} .space`).innerHTML=this.space();
    }

    space(){
        return Number(this.freeSpace*(this.level+1));
    }

    production(){
        let product = Number((this.buildings*(this.level+1)*this.multiplier)/(100*multiSpace(this.multiplier)));
        return Number(product+(product*engineers*0.02)).toFixed(3);
    }

    buildPrice(){
        return Number((this.price+this.buildings*3)*this.multiplier);
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
        return (1+this.level)*50*this.price*this.multiplier;
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
        if(this.space() > this.buildings){
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
        else fail("You need more free space!");
    }
}

class ConvencionalPowerPlant extends PowerPlant{
    constructor(name, multiplier){
        super(name, multiplier);
        this.green = 10;
    }

    update(){
        super.update();
        document.querySelector(`${this.name} .greenBuildPrice`).innerHTML=this.priceGreen();
        document.querySelector(`${this.name} .greenUpgradePrice`).innerHTML=this.upgradePriceGreen();
    }

    priceGreen(){
        return Number(this.green * (this.buildings+1));
    }

    upgradePriceGreen(){
        return Number(this.green * (this.level+1));
    }
    
    build(m){
        if(this.space() > this.buildings){
            if((m>=this.buildPrice()) && (greenCertification>=this.priceGreen())){
                money = Number((money - this.buildPrice()).toFixed(5));
                greenCertification = greenCertification-this.priceGreen();
                this.buildings++;
                this.update();
            }
            else fail("You need more money or Green Certification!");
        }
        else fail("You need more free space!");
    }

    upgrade(m){
        if((m>=this.upgradePrice()) && (greenCertification>=this.upgradePriceGreen())){
            money = Number((money - this.upgradePrice()).toFixed(5));
            greenCertification = greenCertification-this.upgradePriceGreen();
            this.level++;
            this.update();
        }
        else fail("You need more money or Green Certification!");
    }
}

const buildings = [
    new GreenPowerPlant('.wind', 1),
    new GreenPowerPlant('.solar', 10),
    new ConvencionalPowerPlant('.coal', 1000),
];

function offlineProduction(){
    let timeDiff = Number((Date.now() - localStorage.getItem('lastTime'))/100);
    let newElectricty = 0;
    buildings.forEach(function(building){
        newElectricty += Number(building.production()*timeDiff);
    });
    electricty += newElectricty;
}

window.onload = function(){
    if(localStorage.length != 0){
        buildings.forEach(function(building){
            building.getStorage();
        });
        getResources();
        offlineProduction();
    }
    buildings.forEach(function(building){
        building.update();
    });
    updateResources();
    getPrice();
}

function hardReset(num){
    localStorage.clear();
    money = 5;
    electricty = 0;
    greenCertification = 0;
    buildings.forEach(function(building){
        building.level = 0;
        building.buildings = 0;
        building.update();
    });
    engineers = num;
}

function softReset(){
    let tempBuildings = 0;
    let tempEnginiers = 0;
    buildings.forEach(function(building){
        tempBuildings += building.buildings;
    });
    tempEnginiers = (tempBuildings/2000).toFixed();
    hardReset(tempEnginiers);
}

buildings.forEach(function(building){
    document.querySelector(`${building.name} .build`).addEventListener('click', function(){ 
        building.build(money);
    });
    document.querySelector(`${building.name} .upgrade`).addEventListener('click', function(){ 
        building.upgrade(money);
    });    
});

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
    buildings.forEach(function(building){
        building.updateStorage();
    });
    setResources();
});

setInterval(function(){
    let newElectricty = 0;
    buildings.forEach(function(building){
        newElectricty += Number(building.production());
    });
    electricty = Number((electricty + newElectricty).toFixed(3));
    updateResources();
}, 50);

setInterval(function(){
    getPrice();
}, 60000)