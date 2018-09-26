'use strict'

let container = document.getElementById('container');
let buttonRandom = document.getElementById('buttonRandom');
let name = document.getElementById('name');
let buttonName = document.getElementById('buttonName');
let ingredient = document.getElementById('ingredient');
let ingredientButton = document.getElementById('ingredientButton')

ingredientButton.addEventListener('click', function() {
    fetchIngredient("filter.php?i=" + ingredient.value.replace(/ /g, '+'));
})

buttonName.addEventListener('click', function() {
    fetchIngredient("search.php?s=" + name.value.replace(/ /g, '+'));
})

buttonRandom.addEventListener('click', function() {
  recipe("random.php");
})

function fetchIngredient(input) {
  let req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if(req.readyState == 4) {
      if(req.status == 200) {
        let data = JSON.parse(req.response);
        let list = document.createElement('ul');
        name.value = '';
        ingredient.value = '';
        container.innerHTML = '';
        for(let i = 0; i < data.drinks.length; i++) {
          let item = document.createElement('li');
          let text = document.createTextNode(data.drinks[i].strDrink);

          item.appendChild(text);
          list.appendChild(item);
          item.setAttribute("class", "pick");
          container.appendChild(list);

          item.addEventListener('click', function() {
            recipe('search.php?s=' + data.drinks[i].strDrink.replace(/ /g, '+'));
          })
        }
      }
    }
    else {
      console.log('Oops, there was an error: ' + req.status);
      // let p = document.createElement('p');
      // let pText = document.createTextNode('Please enter a valid drink or ingredient');
      //
      // p.setAttribute("class", "orange")
      // p.appendChild(pText);
      // container.appendChild(p);
    }
  }
  req.open('GET',"https://www.thecocktaildb.com/api/json/v1/1/" + input, true);

  req.send();
}

function recipe(a) {
  let req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    container.innerHTML = '';
    if(req.readyState == 4) {
      if(req.status == 200) {
        let data = JSON.parse(req.response);
        console.log(data);
        let img = document.createElement('img');
        let name = document.createElement('h3');

        img.setAttribute('src',data.drinks[0].strDrinkThumb)
        let nameText = document.createTextNode(data.drinks[0].strDrink);

        name.appendChild(nameText);
        container.appendChild(img);
        container.appendChild(name);

        let dataArray = Object.entries(data.drinks[0]);
        let measArray = [];
        let ingArray = [];
        for (let i = 0; i < dataArray.length; i++) {
          if (dataArray[i][0].includes("Measure") && dataArray[i][1] !== "" && dataArray[i][1] !== " " && dataArray[i][1] !== null && dataArray[i][1] !== "") {
            measArray.push(dataArray[i][1]);
          };
        }
        for (let i = 0; i < dataArray.length; i++) {
          if (dataArray[i][0].includes("Ingredient") && dataArray[i][1] !== "" && dataArray[i][1] !== " " && dataArray[i][1] !== null && dataArray[i][1] !== "") {
            ingArray.push(dataArray[i][1]);
          };
        }
        let ul = document.createElement('ul');

        for (let i = 0; i < measArray.length; i++) {
          let li = document.createElement('li');
          let text = document.createTextNode(measArray[i] + ' ' + ingArray[i]);
          li.appendChild(text);
          ul.appendChild(li);
          container.appendChild(ul);
        }
        let instruct = document.createElement('p');
        let instructText = document.createTextNode(data.drinks[0].strInstructions);

        instruct.appendChild(instructText);
        container.appendChild(instruct);
      }
    }
    else {
      console.log('Oops, there was an error: ' + req.status);
    }
  }
  req.open('GET',"https://www.thecocktaildb.com/api/json/v1/1/" + a, true);

  req.send();
}
