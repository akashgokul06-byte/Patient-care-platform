(() => {
  "use strict";

  // Public health-check URL only. No patient data or credentials are sent.
  const API_URL = "https://script.google.com/macros/s/AKfycbxLulHJAvyrTgzXMvMNVxsKY5mq8zvR94MsV-P0WFZ7ZMRCRa9CgigbEX8Oe0AjIPZa4A/exec";
  const navButtons = [...document.querySelectorAll(".rail-item[data-view]")];
  const title = document.getElementById("pageTitle");
  const toast = document.getElementById("toast");
  const sidebar = document.getElementById("sidebar");
  const backendStatus = document.getElementById("backendStatus");

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
    if (view !== "overview") notify(`${views[view]} — this section will be connected in a later development phase.`);
  }

  navButtons.forEach(button => button.addEventListener("click", () => setView(button.dataset.view)));
  document.querySelectorAll("[data-view-link]").forEach(button => button.addEventListener("click", () => setView(button.dataset.viewLink)));
  document.getElementById("menuToggle").addEventListener("click", () => sidebar.classList.toggle("open"));
  document.getElementById("notificationButton").addEventListener("click", () => notify("You’re all caught up in this preview."));
  document.getElementById("addMeal").addEventListener("click", () => notify("Meal logging will be enabled after secure patient access is implemented."));
  document.getElementById("todayDate").textContent = new Intl.DateTimeFormat("en-IN", {weekday:"short", day:"numeric", month:"short"}).format(new Date());
  document.getElementById("mealDate").textContent = new Intl.DateTimeFormat("en-IN", {weekday:"short", day:"2-digit", month:"long", year:"numeric"}).format(new Date());

  function setBackendStatus(state, label) {
    if (!backendStatus) return;
    backendStatus.classList.remove("checking", "online", "offline");
    backendStatus.classList.add(state);
    backendStatus.innerHTML = "<i></i> " + label;
    backendStatus.title = label;
  }

  // JSONP is used only for this non-sensitive, read-only health check.
  // Do not use JSONP for patient records, login, or any protected operation.
  window.PCP_HEALTH_CALLBACK = function (data) {
    if (data && data.ok === true && data.status === "foundation-only") {
      setBackendStatus("online", "Backend online · health check only");
    } else {
      setBackendStatus("offline", "Backend response unexpected");
    }
  };

  const healthScript = document.createElement("script");
  healthScript.src = API_URL + "?callback=PCP_HEALTH_CALLBACK&v=" + Date.now();
  healthScript.async = true;
  healthScript.onerror = () => setBackendStatus("offline", "Backend unavailable");
  document.head.appendChild(healthScript);

  window.setTimeout(() => {
    if (backendStatus && backendStatus.classList.contains("checking")) {
      setBackendStatus("offline", "Backend check timed out");
    }
  }, 12000);
})();
