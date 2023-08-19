const searchBtn = document.querySelector("#search-btn");
const mealList = document.querySelector("#meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.querySelector("#recipe-close-btn");

// Add Event listeners to get details from the target meal
mealList.addEventListener("click", getMealRecipe);
// Close btn event
recipeCloseBtn.addEventListener("click", () => {
  mealDetailsContent.parentElement.classList.remove("showRecipe");
});
// Event listeners for the search btn
searchBtn.addEventListener("click", getMealList);
// Define the function that the search btn lsitening for
// the loader
let loader = `
<div class="lds-roller">
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
</div>`;
function getMealList() {
  mealList.innerHTML = loader;
  // the value that came from the form search
  let searchInputText = document.querySelector("#search-input").value.trim();
  //   the API link
  const api = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputText}`;
  //   Fetching data from api
  fetch(api)
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      if (data.meals) {
        data.meals.forEach((meal) => {
          html += `
            <div class = "meal-item" data-id = "${meal.idMeal}">
                <div class = "meal-img">
                    <img src = "${meal.strMealThumb}" alt = "food">
                </div>
                <div class = "meal-name">
                    <h3>${meal.strMeal}</h3>
                    <a href = "#" class = "recipe-btn">Get Recipe</a>
                </div>
          </div>
            `;
        });
        // remove the class of notFound for reset the grid to the normal sitiuation
        mealList.classList.remove("notFound");
      } else {
        // If there is no meal with the entered value
        html = `<p>Sorry, We don't find any meal with ${searchInputText}</p>`;
        mealList.classList.add("notFound");
      }
      mealList.innerHTML = html;
    });
}

// Function to get full details of the recipe
function getMealRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("recipe-btn")) {
    let mealItem = e.target.parentElement.parentElement;
    let api = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`;
    fetch(api)
      .then((response) => response.json())
      .then((d) => {
        mealRecipeModal(d.meals);
      });
  }
}

// create modal
function mealRecipeModal(meal) {
  meal = meal[0];
  let html = `
    <h2 class = "recipe-title">${meal.strMeal}</h2>
    <p class = "recipe-category">${meal.strCategory}</p>
    <div class = "recipe-instruct">
    <h3>Instructions:</h3>
    <p>${meal.strInstructions}</p>
    </div>
    <div class = "recipe-meal-img">
    <img src = "${meal.strMealThumb}" alt = "">
    </div>
    <div class = "recipe-link">
    <a href = "${meal.strYoutube}" target = "_blank">Watch Video</a>
    </div>
    `;
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add("showRecipe");
}
