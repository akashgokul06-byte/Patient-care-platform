(() => {
  const navButtons = [...document.querySelectorAll(".rail-item[data-view]")];
  const title = document.getElementById("pageTitle");
  const toast = document.getElementById("toast");
  const sidebar = document.getElementById("sidebar");
  const views = {
    overview: "Body Overview", exercise: "Exercise Plans", progress: "My Progress",
    diet: "Nutrition & Diet", health: "Health Records", profile: "My Profile",
    settings: "Settings", fasting: "Fasting Tracker"
  };
  let toastTimer;
  function notify(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }
  function setView(view) {
    title.textContent = views[view] || views.overview;
    navButtons.forEach(button => button.classList.toggle("active", button.dataset.view === view));
    sidebar.classList.remove("open");
    if (view !== "overview") notify(`${views[view]} — this section will be connected in the next development phase.`);
  }
  navButtons.forEach(button => button.addEventListener("click", () => setView(button.dataset.view)));
  document.querySelectorAll("[data-view-link]").forEach(button => button.addEventListener("click", () => setView(button.dataset.viewLink)));
  document.getElementById("menuToggle").addEventListener("click", () => sidebar.classList.toggle("open"));
  document.getElementById("notificationButton").addEventListener("click", () => notify("You’re all caught up in this preview."));
  document.getElementById("addMeal").addEventListener("click", () => notify("Meal logging will be enabled when your patient account is connected."));
  document.getElementById("todayDate").textContent = new Intl.DateTimeFormat("en-IN", {weekday:"short", day:"numeric", month:"short"}).format(new Date());
  document.getElementById("mealDate").textContent = new Intl.DateTimeFormat("en-IN", {weekday:"short", day:"2-digit", month:"long", year:"numeric"}).format(new Date());
})();
