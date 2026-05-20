// Cookie に保存
function setCookie(name, value, days = 7) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
}

// Cookie を取得
function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let c of cookies) {
        const [key, val] = c.split("=");
        if (key === name) return val;
    }
    return null;
}

// レシピ表示
function displayRecipe(meal) {
    const div = document.getElementById("recipe");
    div.innerHTML = `
        <h2><u>${meal.strMeal}</u></h2>
        <img src="${meal.strMealThumb}" alt="meal image">
        <p><strong>カテゴリ:</strong> ${meal.strCategory}</p>
        <p><strong>エリア:</strong> ${meal.strArea}</p>
        <p><strong>作り方:</strong><br>${meal.strInstructions}</p>
    `;
}

// APIからランダムレシピ取得
async function fetchRandomRecipe() {
    const url = "https://www.themealdb.com/api/json/v1/1/random.php";
    const res = await fetch(url);
    const data = await res.json();
    const meal = data.meals[0];

    displayRecipe(meal);

    // IDを Cookie に保存
    setCookie("lastRecipeId", meal.idMeal);

    return meal;
}

// 最後に見たレシピを cookie から復元
async function loadLastRecipe() {
    const lastId = getCookie("lastRecipeId");
    if (!lastId) return;

    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${lastId}`;
    const res = await fetch(url);
    const data = await res.json();
    const meal = data.meals[0];

    displayRecipe(meal);
}

document.getElementById("random-btn").addEventListener("click", fetchRandomRecipe);

// ページ読み込み時に cookie から復元
loadLastRecipe();
