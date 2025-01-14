let userAuthenticated = false;

function validateUserSession() {
  const authToken = localStorage.getItem("token");
  const verificationUrl = "http://localhost:3000/api/users/check"; // URL pour valider l'utilisateur

  // Vérifie si le token est présent dans le stockage local
  if (!authToken) {
    console.log("Token non trouvé.");
    return;
  }

  fetch(verificationUrl, {
    method: "POST",
    headers: {
      "x-api-key": "replace_with_your_api_key", // Remplacez par votre clé API
      "Authorization": `Bearer ${authToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ action: "validate" }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur d'identification");
      }
      return response.json().then((userData) => {
        console.log(userData);
        userAuthenticated = true; // Marque l'utilisateur comme connecté
        updateHeaderForAuthenticatedUser(userData);
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

function updateHeaderForAuthenticatedUser(userData) {
  if (window.location.pathname !== "/") {
    window.location.href = "/"; // Redirige vers la page principale si nécessaire
  }

  const headerElement = document.querySelector("header"); // Sélectionne l'en-tête pour modification

  const userAvatar = localStorage.getItem("img");
  headerElement.innerHTML = `
    <a href="/" class="d-flex align-items-center text-light text-decoration-none bg-secondary p-3">
      <span class="fs-4 text-center">Games</span>
    </a>
    <button class="d-flex align-items-center text-light text-decoration-none btn p-3 logout-btn">
      <span class="fs-4 text-center">Déconnexion</span>
    </button>

    <div class="dropdown position-relative">
      <a href="#" class="d-flex align-items-center text-light text-decoration-none dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
        <img src="${userAvatar}" alt="User Avatar" width="32" height="32" class="rounded-circle me-2">
        <strong>${userData.username}</strong>
      </a>
      <ul class="dropdown-menu dropdown-menu-dark shadow">
        <li><a class="dropdown-item" href="#">Ajouter une voiture...</a></li>
        <li><a class="dropdown-item" href="#">Profil</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><button class="dropdown-item logout-btn">Se déconnecter</button></li>
      </ul>
    </div>
  `;

  const logoutButtons = document.querySelectorAll(".logout-btn");
  logoutButtons.forEach((logoutButton) => {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("_id");
      localStorage.removeItem("token");
      localStorage.removeItem("img");
      window.location.href = "./index.html"; // Redirige après déconnexion
    });
  });
}

// Appelle la fonction pour vérifier l'état de connexion à chaque chargement de page
validateUserSession();

