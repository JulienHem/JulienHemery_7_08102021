import "../public/css/all.css";
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

let _recipesArray = [];

let searchBarResult = [];

let dropdownIngredientsArray = [];
let dropdownUstensilsArray = [];
let dropdownApparelsArray = [];


// For main searchbar
let _noDuplicateIngredient = [];
let _noDuplicateUstensil = [];
let _noDuplicateApparels = [];

// For dropdown tags
let _dropdownTagsIngredients = [];
let _dropdownTagsTools = [];
let _dropdownTagsApparels = [];
const _searchInput = document.querySelector('.search-input');
const cardContainer = document.querySelector('.cards');
const ingredientsFilter = document.querySelector('#ingredients-filter');
const apparelsFilter = document.querySelector('#apparels-filter');
const toolsFilter = document.querySelector('#tools-filter');
const apparelsHiddenData = document.querySelector('.apparels-filter-all');
const ingredientsHiddenData = document.querySelector('.ingredients-filter-all');
const toolsHiddenData = document.querySelector('.tools-filter-all ');
const ingredientsInput = document.querySelector('#ingredients-input');
const apparelsInput = document.querySelector('#apparels-input');
const ustensilsInput = document.querySelector('#ustensils-input');
const selectedItemContainer = document.querySelector('.selected-item');
const tagToolsInput = document.querySelector('.tools-input');
const tagIngredientsInput = document.querySelector('.ingredients-input');
const tagApparelsInput = document.querySelector('.apparels-input');


fetch('../../recipes.json')
    .then((response) => {
        response.json().then(recipes => {
            displayRecipe(recipes);
            _recipesArray = recipes;
            recipes.forEach(recipe => {
                recipe.ingredients.forEach(ingredient => {
                    dropdownIngredientsArray.push(ingredient.ingredient.toLowerCase())
                })
                recipe.ustensils.forEach(ustensil => {
                    dropdownUstensilsArray.push(ustensil.toLowerCase())

                })
                dropdownApparelsArray.push(recipe.appliance.toLowerCase());

            })
            _noDuplicateIngredient = [...new Set(dropdownIngredientsArray)]
            _noDuplicateUstensil = [...new Set(dropdownUstensilsArray)]
            _noDuplicateApparels = [...new Set(dropdownApparelsArray)]
            displayDetailsInFilters(_noDuplicateIngredient, ingredientsHiddenData, tagIngredientsInput, 'ingredients-filter', '#3282F7', _dropdownTagsIngredients);
            displayDetailsInFilters(_noDuplicateUstensil, toolsHiddenData, tagToolsInput, 'tools-filter', '#ED6454', _dropdownTagsTools);
            displayDetailsInFilters(_noDuplicateApparels, apparelsHiddenData, tagApparelsInput, 'apparels-filter', '#68D9A4', _dropdownTagsApparels);

        })
    })


function displayRecipe(recipes) {

    for (const {name, time, description, ingredients} of recipes) {
        const card = document.createElement('div');
        const cardImg = document.createElement('div');
        const cardDetails = document.createElement('div');
        const cardDetailsTop = document.createElement('div');
        const cardName = document.createElement('div');
        const cardTimer = document.createElement('div');
        const cardIngredientContainer = document.createElement('div');
        const cardDetailsBot = document.createElement('div');
        const cardDescription = document.createElement('div');

        card.classList.add('card');
        cardImg.classList.add('card-img');
        cardDetails.classList.add('card-details');
        cardDetailsTop.classList.add('card-details-top');
        cardName.classList.add('card-details-top-title');
        cardTimer.classList.add('card-details-top-timer');
        cardDetailsBot.classList.add('card-details-bot');
        cardDescription.classList.add('card-details-bot-description');
        cardIngredientContainer.classList.add('card-details-bot-container');
        cardDetailsBot.appendChild(cardIngredientContainer)

        for (const {ingredient, quantity, unit} of ingredients) {

            const cardIngredients = document.createElement('div');
            cardIngredients.classList.add('card-details-bot-ingredients');
            const ingredientName = ingredient ? ingredient : '';
            const ingredientUnit = unit ? unit : '';
            const ingredientQty = quantity ? quantity : '';

            cardIngredients.innerHTML = ingredientName + ': ' + ingredientQty + ' ' + ingredientUnit
            cardIngredientContainer.appendChild(cardIngredients);

        }
        cardName.innerHTML = name;
        cardTimer.innerHTML = time + ' min';
        cardDescription.innerHTML = description;

        cardContainer.appendChild(card);
        card.appendChild(cardImg);
        card.appendChild(cardDetails);
        cardDetails.appendChild(cardDetailsTop);
        cardDetailsTop.appendChild(cardName);
        cardDetailsTop.appendChild(cardTimer);
        cardDetails.appendChild(cardDetailsBot);
        cardDetailsBot.appendChild(cardDescription);
    }
}


function searchRecipe() {
    let recipeResult = [..._recipesArray];
    let tagsIngredientsArray = [];
    let tagsToolArray = [];
    let tagsApparelsArray = [];

    _recipesArray.forEach(recipe => {
        let recipeIncluded = false;
        let hasBeenFiltered = false;

        if (_searchInput.value.length >= 3) {
            hasBeenFiltered = true;
            if (recipe.name.toLowerCase().includes(_searchInput.value.toLowerCase())) {
                recipeIncluded = true;
            }

            recipe.ingredients.forEach(ingredient => {
                if (ingredient.ingredient.toLowerCase().includes(_searchInput.value.toLowerCase())) {
                    recipeIncluded = true;
                }
            });
            recipe.ustensils.forEach(ustensil => {
                if (ustensil.toLowerCase().includes(_searchInput.value.toLowerCase())) {
                    recipeIncluded = true;
                }
            });

            if (recipe.appliance.toLowerCase().includes(_searchInput.value.toLowerCase())) {

                recipeIncluded = true;
            }
        }

        if (_dropdownTagsIngredients.length > 0) {
            hasBeenFiltered = true;

            recipe.ingredients.forEach(ingredient => {
                recipeIncluded = false;

                _dropdownTagsIngredients.forEach(ingredientTag => {
                    if (ingredientTag.toLowerCase().includes(ingredient.ingredient.toLowerCase())) {
                        recipeIncluded = true;
                    }
                })
            });

        }

        if (_dropdownTagsTools.length > 0) {
            hasBeenFiltered = true;
            recipe.ustensils.forEach(tool => {
                recipeIncluded = false;

                _dropdownTagsTools.forEach(toolsTag => {
                    if (toolsTag.toLowerCase().includes(tool.toLowerCase())) {
                        recipeIncluded = true;
                    }
                })
            });

        }

        if (_dropdownTagsApparels.length > 0) {
            hasBeenFiltered = true;
            _dropdownTagsApparels.forEach(apparelsTag => {


                recipeIncluded = apparelsTag.toLowerCase().includes(recipe.appliance.toLowerCase());
            })


        }

        if (!recipeIncluded && hasBeenFiltered) {
            const recipeIndex = recipeResult.indexOf(recipe);
            recipeResult.splice(recipeIndex, 1);
        }
    })

    cardContainer.innerHTML = '';


    recipeResult.forEach(recipe => {

        recipe.ingredients.forEach(ingredient => {
            tagsIngredientsArray.push(ingredient.ingredient.toLowerCase())
        })
        recipe.ustensils.forEach(ustensil => {
            tagsToolArray.push(ustensil.toLowerCase())

        })
        tagsApparelsArray.push(recipe.appliance.toLowerCase());

    })


    _noDuplicateIngredient = [...new Set(tagsIngredientsArray)];
    _noDuplicateUstensil = [...new Set(tagsToolArray)];
    _noDuplicateApparels = [...new Set(tagsApparelsArray)];

    displayRecipe(recipeResult);
    displayDetailsInFilters(_noDuplicateIngredient, ingredientsHiddenData, tagIngredientsInput, 'ingredients-filter', '#3282F7', _dropdownTagsIngredients);
    displayDetailsInFilters(_noDuplicateUstensil, toolsHiddenData, tagToolsInput, 'tools-filter', '#ED6454', _dropdownTagsTools);
    displayDetailsInFilters(_noDuplicateApparels, apparelsHiddenData, tagApparelsInput, 'apparels-filter', '#68D9A4', _dropdownTagsApparels);

}

function displayDetailsInFilters(itemsArray, itemContainer, input, parentContainer, backgroundColor, tagsArray) {
    itemContainer.innerText = '';

    itemsArray.forEach((item, index) => {
        const itemTitle = document.createElement('span');
        itemTitle.classList.add('item-title');
        itemTitle.innerText = item;
        itemContainer.appendChild(itemTitle);
        createTag(itemTitle, index, input, parentContainer, tagsArray, backgroundColor);
    })


}


function createTag(item, index, input, parentContainer, tagArray, backgroundColor) {
    item.addEventListener('click', (e) => {
        let tag = document.createElement('div');
        let deleteIcon = document.createElement('i');
        deleteIcon.classList.add('far', 'fa-times-circle', 'delete-icon');
        tag.classList.remove('hide-tag');
        tag.classList.add('item');
        tag.innerText = e.target.innerText;
        tag.appendChild(deleteIcon);
        selectedItemContainer.appendChild(tag);
        if (input.parentNode.id === parentContainer) {
            tagArray.push(e.target.innerText);
            tag.style.backgroundColor = backgroundColor;
        }
        setTimeout(() => {
            const deleteIcons = document.querySelectorAll('.delete-icon');

            deleteIcons.forEach(icon => {
                icon.addEventListener('click', (e) => {
                    e.target.parentNode.classList.add('hide-tag');
                })
            })

        }, 200)
        searchRecipe();
    })
}


function searchInDropdown(input, hiddenDataContainer) {
    let items = [];
    input.addEventListener('keyup', () => {
        if (input.id === 'ingredients-input') {
            items = _noDuplicateIngredient;
        } else if (input.id === 'apparels-input') {
            items = _noDuplicateApparels;
        } else if (input.id === 'ustensils-input') {
            items = _noDuplicateUstensil;
        }
        hiddenDataContainer.innerHTML = '';
        items.forEach((item) => {
            if (item.toLowerCase().includes(input.value.toLowerCase())) {
                const span = document.createElement('span');
                span.innerHTML = item;
                span.classList.add('item-title');
                hiddenDataContainer.appendChild(span)
            }
        })
    })
}


function openOrCloseHiddenData(idSelector, filterParent, hiddenDataContainer, input) {
    window.addEventListener('click', function (e) {
        if (document.querySelector(idSelector).contains(e.target)) {
            filterParent.style.width = '750px';
            hiddenDataContainer.style.visibility = 'visible';
            console.log(input)
            searchInDropdown(input, hiddenDataContainer)
        } else {
            filterParent.style.width = '250px';
            hiddenDataContainer.style.visibility = 'hidden';
        }
    });
}

openOrCloseHiddenData('#ingredients-filter', ingredientsFilter, ingredientsHiddenData, ingredientsInput);
openOrCloseHiddenData('#tools-filter', toolsFilter, toolsHiddenData, ustensilsInput);
openOrCloseHiddenData('#apparels-filter', apparelsFilter, apparelsHiddenData, apparelsInput);

_searchInput.addEventListener('keyup', () => {
    searchRecipe();
})


searchRecipe();


// TODO METTRE TOUT A PLAT DANS UN TABLEAU

// TODO TRI ALPHABETIQUE SUR CES MOTS

// TODO POSSIBILITE DES LETTRES




