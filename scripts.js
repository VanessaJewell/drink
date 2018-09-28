'use strict'

let container = document.getElementById('container');
let buttonRandom = document.getElementById('buttonRandom');
let name = document.getElementById('name');
let buttonName = document.getElementById('buttonName');
let ingredient = document.getElementById('ingredient');
let ingredientButton = document.getElementById('ingredientButton')

ingredientButton.addEventListener('click', function() {
    fetchDrink("filter.php?i=" + ingredient.value.replace(/ /g, '+'));
})

buttonName.addEventListener('click', function() {
    fetchDrink("search.php?s=" + name.value.replace(/ /g, '+'));
})

buttonRandom.addEventListener('click', function() {
  recipe("random.php");
})

//this function is called in the fetchDrink function when an unknown input is entered by the user//
let wrongInfo = function () {
  let p = document.createElement('p');
  let pText = document.createTextNode('Please enter a valid drink or ingredient');

  p.setAttribute("class", "orange")
  p.appendChild(pText);
  container.appendChild(p);
}

//This function is called by a click event listener and returns a drink name based on drink or ingredient inputs from the user. The user can then pick from a list of drink names which also has an event listener set up which then calls the recipe function.//
function fetchDrink(userInput) {
  let req = new XMLHttpRequest();
  req.onreadystatechange = function() {
    if (req.readyState == 4) {
      if (req.status == 200) {
        name.value = '';
        ingredient.value = '';
        container.innerHTML = '';
        if (req.response) {
          let data = JSON.parse(req.response);
          if (data.drinks !== null) {
            let list = document.createElement('ul');
            name.value = '';
            ingredient.value = '';
            container.innerHTML = '';
            for (let i = 0; i < data.drinks.length; i++) {
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
        else {
            wrongInfo();
          }
        }
        else {
          wrongInfo();
        }
      }
    }
  }
  req.open('GET',"https://www.thecocktaildb.com/api/json/v1/1/" + userInput, true);

  req.send();
}

//This function is called either by an event listener set up on the buttonRandom or by the fetchDrink function and returns a drink picture, name, ingredients, and recipe.//
function recipe(drinkInput) {
  let req = new XMLHttpRequest();
  req.onreadystatechange = function() {

    if (req.readyState == 4) {
      if (req.status == 200) {
        container.innerHTML = '';
        let data = JSON.parse(req.response);
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
          if (dataArray[i][0].includes("Measure") && dataArray[i][1] !== "" && dataArray[i][1] !== " " && dataArray[i][1] !== null) {
            measArray.push(dataArray[i][1]);
          };
        }
        for (let i = 0; i < dataArray.length; i++) {
          if (dataArray[i][0].includes("Ingredient") && dataArray[i][1] !== "" && dataArray[i][1] !== " " && dataArray[i][1] !== null) {
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
  }
  req.open('GET',"https://www.thecocktaildb.com/api/json/v1/1/" + drinkInput, true);

  req.send();
}
