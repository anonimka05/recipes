const BASE_URL = "https://dummyjson.com/";
const wrapper = document.getElementById("wrapper");
const mainPage = document.getElementById("mainPage");
const detailPage = document.getElementById("detailPage");
const detailTitle = document.getElementById("detailTitle");
const detailContent = document.getElementById("detailContent");
const purchaseModal = document.getElementById("purchaseModal");

let allData = [];
console.log(allData);

function renderCard(data) {
  const fragment = document.createDocumentFragment();

  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    wrapper.innerHTML = "";

    card.innerHTML = `
            <div>
                <img src="${item.image}" alt="${item.name}"/>
                <h3>${item.name}</h3>
                <p>${item.cuisine}</p>
                <div class="icons"> 
                    <div class="rating">
                      <p>${item.rating}</p>
                      <i class='fa fa-star-o' style='font-size:19px;color:orange'></i>
                    </div>
                   <div class="like">
                      <i class='fa ${
                        item.liked ? "fa-solid liked" : "fa-regular"
                      } fa-heart' 
                        style='font-size:19px;color:${
                          item.liked ? "#ff1744" : "#724bff"
                        }' 
                        onclick="toggleLike(${item.id}, this)"></i> 
                      <button onclick="more(${
                        item.id
                      })" type="button">more</button>
                    </div>
                </div>
            </div>`;
    fragment.appendChild(card);
  });

  wrapper.appendChild(fragment);
}

function fetchData(endpoint) {
  fetch(`${BASE_URL}${endpoint}`)
    .then((res) => {
      if (!res.ok) throw new Error("Something went wrong!");
      return res.json();
    })
    .then((res) => {
      allData = res.recipes;
      console.log(allData);

      renderCard(res.recipes);
    })
    .catch(console.error)
    .finally(() => {
      console.log("Fetch completed");
    });
}

window.addEventListener("load", () => {
  fetchData("recipes");
});

function toggleLike(recipeId, element) {
  const recipe = allData.find((r) => r.id === recipeId);
  if (recipe) {
    recipe.liked = !recipe.liked;

    if (recipe.liked) {
      element.classList.remove("fa-solid");
      element.classList.add("fa-solid", "liked");
      element.style.color = "#ff1744";
      element.style.transform = "scale(1.3)";
      setTimeout(() => {
        element.style.transform = "scale(1)";
      }, 200);
    } else {
      element.classList.remove("fa-solid", "liked");
      element.classList.add("fa-regular");
      element.style.color = "#724bff";
    }
  }
}


function more(recipeId) {
  const recipe = allData.find((r) => r.id === recipeId);
  if (!recipe) return;

  mainPage.style.display = "none";
  detailPage.style.display = "block";

  detailTitle.textContent = recipe.name;

  detailContent.innerHTML = `
        <img src="${recipe.image}" alt="${
    recipe.name
  }" class="recipe-image-large">
        
        <div class="recipe-stats">
            <div class="stat-item">
                <div class="stat-value">${recipe.prepTimeMinutes}</div>
                <div class="stat-label">Prep Time (min)</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${recipe.cookTimeMinutes}</div>
                <div class="stat-label">Cook Time (min)</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${recipe.servings}</div>
                <div class="stat-label">Servings</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${recipe.caloriesPerServing}</div>
                <div class="stat-label">Calories/Serving</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${recipe.difficulty}</div>
                <div class="stat-label">Difficulty</div>
            </div>
        </div>

        <div class="section-title">🥘 Meal Types</div>
        <div class="meal-types">
            ${recipe.mealType
              .map((type) => `<span class="meal-type">${type}</span>`)
              .join("")}
        </div>
        <br><br>

        <div class="section-title">🛒 Ingredients</div>
        <div class="ingredients-grid">
            ${recipe.ingredients
              .map(
                (ingredient) => `
                <div class="ingredient-item">${ingredient}</div>
            `
              )
              .join("")}
        </div>

        <div class="section-title">👨‍🍳 Instructions</div>
        <div class="instructions-list">
            ${recipe.instructions
              .map(
                (instruction) => `
                <div class="instruction-item">${instruction}</div>
            `
              )
              .join("")}
        </div>

        <div style="text-align: center; margin-top: 30px;">
            <div class="rating" style="justify-content: center; font-size: 1.2rem;">
                <span style="color: orange;">★★★★☆</span>
                <span style="margin-left: 10px;">${recipe.rating}/5.0 (${
    recipe.reviewCount
  } reviews)</span>
            </div>
        </div>
    `;

  window.scrollTo(0, 0);
}

function confirmPurchase() {
  const fullName = document.getElementById("fullName").value;
  const email = document.getElementById("email").value;
  const cardNumber = document.getElementById("cardNumber").value;
  const expiry = document.getElementById("expiry").value;
  const cvv = document.getElementById("cvv").value;

  if (!fullName || !email || !cardNumber || !expiry || !cvv) {
    alert("Please fill in all fields");
    return;
  }

  document.querySelector(".purchase-form").style.display = "none";
  document.querySelector(".purchase-buttons").style.display = "none";
  document.getElementById("successMessage").style.display = "block";

  setTimeout(() => {
    closePurchaseModal();
    document.querySelector(".purchase-form").style.display = "flex";
    document.querySelector(".purchase-buttons").style.display = "flex";
  }, 3000);
}

function goBack() {
  detailPage.style.display = "none";
  mainPage.style.display = "block";
  window.scrollTo(0, 0);
}

window.onclick = function (event) {
  if (event.target === purchaseModal) {
    closePurchaseModal();
  }
};

window.scrollTo(0, 0);

function goBack() {
  detailPage.style.display = "none";
  mainPage.style.display = "block";
  window.scrollTo(0, 0);
}

renderCard(allData);
