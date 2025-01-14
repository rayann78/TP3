let isUserLoggedIn = false;

function verifyLogin() {
  const authToken = localStorage.getItem("token");
  const apiEndpoint = "http://localhost:3000/api/users/check"; // Endpoint pour vérifier l'utilisateur

  // Vérifie si le token est présent
  if (!authToken) {
    console.log("Aucun token trouvé.");
    return;
  }

  fetch(apiEndpoint, {
    method: "POST",
    headers: {
      "x-api-key": "secret_key_here", // Remplacer par votre clé API
      "Authorization": `Bearer ${authToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ action: "verify" }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur d'authentification");
      }
      return response.json().then((result) => {
        console.log(result);
        isUserLoggedIn = true; // L'utilisateur est authentifié
        updateHeaderForLoggedInUser(result);
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

function updateHeaderForLoggedInUser(userInfo) {
  if (window.location.pathname !== "/") {
    window.location.href = "/"; // Rediriger vers la page principale si nécessaire
  }

  const headerElement = document.querySelector("header"); // Mettre à jour le contenu du header

  const userAvatar = localStorage.getItem("img");
  headerElement.innerHTML = `
    <a href="/" class="d-flex align-items-center text-light text-decoration-none bg-secondary p-3">
      <h1 class="fs-4 mb-0">Games</h1>
    </a>
    <button class="btn p-3 logout-button text-light">
      <span class="fs-4">Se Déconnecter</span>
    </button>

    <div class="dropdown position-relative">
      <a href="#" class="d-flex align-items-center text-light text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        <img src="${userAvatar}" alt="User Avatar" width="32" height="32" class="rounded-circle me-2">
        <strong>${userInfo.username}</strong>
      </a>
      <ul class="dropdown-menu dropdown-menu-dark shadow">
        <li><a class="dropdown-item" href="#">Ajouter une voiture...</a></li>
        <li><a class="dropdown-item" href="#">Profil</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><button class="dropdown-item logout-button">Se Déconnecter</button></li>
      </ul>
    </div>
  `;

  const logoutButtons = document.querySelectorAll(".logout-button");
  logoutButtons.forEach((logoutBtn) => {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("_id");
      localStorage.removeItem("token");
      localStorage.removeItem("img");
      window.location.href = "./index.html"; // Redirection après déconnexion
    });
  });
}

// Appel de la fonction pour vérifier l'état de connexion à chaque chargement de page
verifyLogin();
