let money = 5;

function update(name, obj, updateMoney) {
  document.querySelector(`${name} .buildings`).innerHTML = obj.buildings;
  document.querySelector(`${name} .level`).innerHTML = obj.level + 1;
  document.querySelector(`${name} .production`).innerHTML = obj.production();
  document.querySelector(`${name} .buildPrice`).innerHTML = obj.buildPrice();
  document.querySelector(`${name} .upgradePrice`).innerHTML = obj.upgradePrice();
  if (updateMoney)
    document.getElementById("money").innerHTML = "Money " + money;
}

function updateStorage(name, obj) {
  localStorage.setItem(name + "level", obj.level);
  localStorage.setItem(name + "buildings", obj.buildings);
}

function getStorage(name, obj) {
  obj.level = Number(localStorage.getItem(name + "level"));
  obj.buildings = Number(localStorage.getItem(name + "buildings"));
}

class WindTurbine {
  constructor() {
    this.buildings = 0;
    this.level = 0;
    this.priceNewBuilding = 5;
    this.priceNextLevel = 50;
  }

  production = function() {
    if (this.buildings == 0) return 0;
    else return (this.buildings * (this.level + 1)) / 100;
  };

  buildPrice = () => updatePrice('build', this, 3);

  upgradePrice = () => updatePrice('upgrade', this, 3);
}

class SolarPanel {
  constructor() {
    this.buildings = 0;
    this.level = 0;
    this.priceNewBuilding = 50;
    this.priceNextLevel = 500;
  }

  production = function() {
    if (this.buildings == 0) return 0;
    else return (this.buildings * (this.level + 1)) / 10;
  };

  buildPrice = () => updatePrice("build", this, 25);

  upgradePrice = () => updatePrice("upgrade", this, 5);
}

let wt = new WindTurbine();
let sp = new SolarPanel();

if (localStorage.length != 0) {
  getStorage("wt", wt);
  getStorage("sp", sp);
  money = Number(localStorage.getItem("money"));
}

window.onload = function() {
  update("#wind", wt, true);
  update("#solar", sp, false);
};

$("#wind .build").click(() =>build(wt, "#wind"))
$("#wind .upgrade").click(() =>  upgrade(wt, "#wind", 3));
$("#solar .build").click(() =>  build(sp, "#solar"));
$("#solar .upgrade").click(() => upgrade(sp, "#solar", 2));

setInterval(function() {
  money = Number(
    (money + Number(wt.production() + sp.production())).toFixed(2)
  );
  document.getElementById("money").innerHTML = "Money " + money;
}, 100);

setInterval(function() {
  localStorage.clear();
  updateStorage("wt", wt);
  updateStorage("sp", sp);
  localStorage.setItem("money", money);
}, 1000);

function build(obj, element) {
  if (money >= obj.buildPrice()) {
    money = Number((money - obj.buildPrice()).toFixed(2));
    obj.buildings++;
    update(element, obj, true);
  } else false; //alert("You need more money!");
}

function updatePrice(key, obj, increase) {
  switch (key) {
    case "build":
      if (obj.buildings == 0) return obj.priceNewBuilding;
      else return obj.priceNewBuilding + obj.buildings * increase;
    case "upgrade":
      if (obj.level == 0) return obj.priceNextLevel;
      else return obj.level * increase * obj.priceNextLevel;
  }
}

function upgrade (obj, element, fixed) {
    if (money >= obj.upgradePrice()) {
      money = Number((money - obj.upgradePrice()).toFixed(fixed));
      obj.level++;
      console.log(obj)
    return  update(element, obj, true);
    } else; //alert("You need more money!");
  };