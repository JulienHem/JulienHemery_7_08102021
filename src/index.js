import "../public/css/all.css";
import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';

let _recipesArray = [];
let _recipeResult = [];

let searchBarResult = [];

let dropdownIngredientsArray = [];
let dropdownUstensilsArray = [];
let dropdownApparelsArray = [];

let items = [];

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

const _everyRecipeWords = [];


fetch('../../recipes.json')
    .then((response) => {
        response.json().then(recipes => {
            displayRecipe(recipes);
            _recipesArray = recipes;
            recipes.forEach((recipe) => {
                const localRecipeWord = [];
                localRecipeWord.push(recipe.name.toLowerCase());
                recipe.ingredients.forEach(ingredient => {
                    localRecipeWord.push(ingredient.ingredient.toLowerCase());
                    dropdownIngredientsArray.push(ingredient.ingredient.toLowerCase())
                })
                recipe.ustensils.forEach(ustensil => {
                    localRecipeWord.push(ustensil.toLowerCase());
                    dropdownUstensilsArray.push(ustensil.toLowerCase())

                })
                localRecipeWord.push(recipe.appliance.toLowerCase());
                dropdownApparelsArray.push(recipe.appliance.toLowerCase());

                _everyRecipeWords.push(localRecipeWord);
            })
            console.log(_everyRecipeWords);

            let tree = new RecipeTree();
            // 1ST FOR
            _everyRecipeWords.forEach((recipe, index) => {
                for (let i = 0; i < recipe.length; i++) {
                    let previousNode = null;
                    let reversedLetters = [];
                    // 2ND FOR
                    for (let x = [...recipe[i]].length; x > 0; x--) {
                        let next;
                        if (x === [...recipe[i]].length) {
                            next = null;
                        } else {
                            next = previousNode;
                        }

                        const data = {
                            position: x,
                            recipe: [index],
                            value: [...recipe[i]][x - 1],
                            next: next,
                        }
                        let recipenode = new RecipeNode(data);
                        previousNode = recipenode;
                        reversedLetters.push(recipenode);
                    }
                    let previous = null;
                    // Get previous letter
                    for (let j = reversedLetters.length - 1; j >= 0; j--) {
                        reversedLetters[j].previous = previous;
                        previous = reversedLetters[j];
                    }
                    // TREE IN THE RIGHT ORDER
                    for (let j = reversedLetters.length - 1; j >= 0; j--) {
                        if (j === reversedLetters.length - 1) {
                            const existingNode = tree.verifyValue(reversedLetters[j].value);
                            if (existingNode) {
                                check(existingNode, reversedLetters[j], index);
                                break;
                            }
                        }
                        tree.add(reversedLetters[j]);
                    }
                }

            })
            console.log(tree)
            _noDuplicateIngredient = [...new Set(dropdownIngredientsArray)]
            _noDuplicateUstensil = [...new Set(dropdownUstensilsArray)]
            _noDuplicateApparels = [...new Set(dropdownApparelsArray)]
            displayDetailsInFilters(_noDuplicateIngredient, ingredientsHiddenData, tagIngredientsInput, 'ingredients-filter', '#3282F7', _dropdownTagsIngredients);
            displayDetailsInFilters(_noDuplicateUstensil, toolsHiddenData, tagToolsInput, 'tools-filter', '#ED6454', _dropdownTagsTools);
            displayDetailsInFilters(_noDuplicateApparels, apparelsHiddenData, tagApparelsInput, 'apparels-filter', '#68D9A4', _dropdownTagsApparels);

        })
    })

function check(existingNode, compareNode, recipeNumber) {
    if (existingNode.value === compareNode.value) {
        if (!existingNode.recipe.includes(recipeNumber)) existingNode.recipe.push(recipeNumber);
        if (existingNode.next && compareNode.next) {
            if (Array.isArray(existingNode.next)) {
                existingNode.next.forEach(node => {
                    check(node, compareNode.next, recipeNumber);
                })
            } else {
                check(existingNode.next, compareNode.next, recipeNumber);
            }
        }
    } else {
        if (Array.isArray(existingNode.previous.next)) {
            let isInArray = false;
            let nodeInArray;
            existingNode.previous.next.forEach(node => {
                if (node.value === compareNode.value) {
                    isInArray = true;
                    nodeInArray = node;
                }
            })
            if (isInArray) {
                if (nodeInArray.next && compareNode.next) check(nodeInArray.next, compareNode.next, recipeNumber);
            } else {
                existingNode.previous.next = [...existingNode.previous.next, compareNode];
            }
        } else {
            if (existingNode.previous.value === compareNode.value) {
                if (existingNode.next && compareNode.next) check(existingNode.next, compareNode.next, recipeNumber);
            } else {
                existingNode.previous.next = [existingNode.previous.next, compareNode];
            }
        }
    }
}

class RecipeNode {
    constructor(data) {
        this.position = data.position;
        this.value = data.value;
        this.recipe = data.recipe;
        this.next = data.next;
        this.previous = data.previous;
    }
}

class RecipeTree {
    recipeNodes = [];

    add(recipenode) {
        this.recipeNodes.push(recipenode);
    }

    verifyValue(letter) {
        for (const node of this.recipeNodes) {
            if (node.position !== 1) continue;
            if (node.value === letter) {
                return node;
            }
        }
        return false;
    };
}


function displayRecipe(recipes) {
    cardContainer.innerHTML = '';

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
    _recipeResult = [..._recipesArray];
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
            recipeIncluded = false;

            _dropdownTagsIngredients.forEach(ingredientTag => {
                recipe.ingredients.forEach(ingredient => {
                    if (ingredient.ingredient.toLowerCase().includes(ingredientTag.toLowerCase())) {
                        recipeIncluded = true;
                    }
                })
                if (!recipeIncluded) {
                    spliceRecipe(recipeIncluded, hasBeenFiltered, recipe);
                    return;
                }
            });
            if (!recipeIncluded) {
                return;
            }
        }
        if (_dropdownTagsTools.length > 0) {
            hasBeenFiltered = true;
            recipeIncluded = false;
            _dropdownTagsTools.forEach(toolsTag => {
                recipe.ustensils.forEach(tool => {
                    if (tool.toLowerCase().includes(toolsTag.toLowerCase())) {
                        recipeIncluded = true;
                    }
                })
                if (!recipeIncluded) {
                    spliceRecipe(recipeIncluded, hasBeenFiltered, recipe);
                    return;
                }
            });
            if (!recipeIncluded) {
                return;
            }

        }
        if (_dropdownTagsApparels.length > 0) {
            hasBeenFiltered = true;
            _dropdownTagsApparels.forEach(apparelsTag => {
                recipeIncluded = recipe.appliance.toLowerCase().includes(apparelsTag.toLowerCase());
                console.log(recipeIncluded)
                if (!recipeIncluded) {
                    spliceRecipe(recipeIncluded, hasBeenFiltered, recipe);
                    return;
                }
            });
            if (!recipeIncluded) {
                return;
            }
        }

    })

    _recipeResult.forEach(recipe => {

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
    console.log(_recipeResult)

    displayRecipe(_recipeResult);
    displayDetailsInFilters(_noDuplicateIngredient, ingredientsHiddenData, tagIngredientsInput, 'ingredients-filter', '#3282F7', _dropdownTagsIngredients);
    displayDetailsInFilters(_noDuplicateUstensil, toolsHiddenData, tagToolsInput, 'tools-filter', '#ED6454', _dropdownTagsTools);
    displayDetailsInFilters(_noDuplicateApparels, apparelsHiddenData, tagApparelsInput, 'apparels-filter', '#68D9A4', _dropdownTagsApparels);

}

function spliceRecipe(recipeIncluded, hasBeenFiltered, recipe) {
    if (!recipeIncluded && hasBeenFiltered) {

        const recipeIndex = _recipeResult.indexOf(recipe);
        if (recipeIndex !== -1) _recipeResult.splice(recipeIndex, 1);
    }
}


function displayDetailsInFilters(itemsArray, itemContainer, input, parentContainer, backgroundColor, tagsArray) {
    itemContainer.innerText = '';

    itemsArray.forEach((item) => {
        const itemTitle = document.createElement('span');

        itemTitle.classList.add('item-title');
        itemTitle.innerText = item;
        itemContainer.appendChild(itemTitle);
        createTag(itemTitle, itemsArray, itemContainer, input, parentContainer, tagsArray, backgroundColor);

    })
}


function createTag(item, itemsArray, itemContainer, input, parentContainer, tagArray, backgroundColor) {
    item.addEventListener('click', (e) => {

        let tag = document.createElement('div');
        let deleteIconSpan = document.createElement('span');
        let deleteIcon = document.createElement('i');
        const container = document.querySelector('.selected-item');
        deleteIconSpan.addEventListener('click', (e) => {
            tag.remove();
            let itemIndex = tagArray.indexOf(item.innerText);
            tagArray.splice(itemIndex, 1)
            searchRecipe();

            if (container.innerHTML === '' && _searchInput.value === '') {
                displayRecipe(_recipesArray);
            } else {
                displayRecipe(_recipeResult);
            }

            displayDetailsInFilters(_noDuplicateIngredient, ingredientsHiddenData, tagIngredientsInput, 'ingredients-filter', '#3282F7', _dropdownTagsIngredients);
            displayDetailsInFilters(_noDuplicateUstensil, toolsHiddenData, tagToolsInput, 'tools-filter', '#ED6454', _dropdownTagsTools);
            displayDetailsInFilters(_noDuplicateApparels, apparelsHiddenData, tagApparelsInput, 'apparels-filter', '#68D9A4', _dropdownTagsApparels);

        });

        deleteIcon.classList.add('far', 'fa-times-circle', 'delete-icon');
        tag.classList.remove('hide-tag');
        tag.classList.add('item');
        tag.innerText = e.target.innerText;
        deleteIconSpan.appendChild(deleteIcon)

        tag.appendChild(deleteIconSpan);
        selectedItemContainer.appendChild(tag);
        if (input.parentNode.id === parentContainer) {
            tagArray.push(e.target.innerText);
            console.log(tagArray)
            tag.style.backgroundColor = backgroundColor;
        }
        searchRecipe();
    })
}


function searchInDropdown(input, hiddenDataContainer) {

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
                hiddenDataContainer.appendChild(span);
            }
        })
    })
}


function openOrCloseHiddenData(idSelector, filterParent, hiddenDataContainer, input) {
    window.addEventListener('click', function (e) {
        if (document.querySelector(idSelector).contains(e.target)) {
            filterParent.style.width = '750px';
            hiddenDataContainer.style.visibility = 'visible';
            searchInDropdown(input, hiddenDataContainer);

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

