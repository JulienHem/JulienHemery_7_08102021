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



fetch('../../recipes.json')
    .then((response) => {
        response.json().then(recipes => {
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
        })
    })
