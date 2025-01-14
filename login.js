const loginForm = document.querySelector("form");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const emailInput = loginForm.elements["email"].value;
  const usernameInput = loginForm.elements["userName"].value;

  try {
    // Vérification des champs
    checkEmail(emailInput);
    checkUsername(usernameInput);

    // Si tout est valide, collecter et afficher les données
    const userCredentials = {
      email: emailInput,
      userName: usernameInput,
    };
    console.log(userCredentials);

    // Appeler la fonction pour gérer la connexion
    handleLogin(userCredentials);

  } catch (err) {
    // Gérer les erreurs en les affichant
    displayError(err.message);
  }
});

// Vérification du nom d'utilisateur
function checkUsername(value) {
  if (!value || value.trim() === "") {
    throw new Error("Le nom d'utilisateur est vide !");
  }

  const validPattern = /^[a-zA-Z0-9]+$/;
  if (!validPattern.test(value)) {
    throw new Error(
      "Le nom d'utilisateur doit uniquement contenir des caractères alphanumériques."
    );
  }
}

// Vérification de l'email
function checkEmail(value) {
  if (!value || value.trim() === "") {
    throw new Error("L'adresse email est vide !");
  }

  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(value)) {
    throw new Error("L'adresse email n'est pas valide.");
  }
}

// Fonction pour afficher les erreurs
function displayError(errorMessage) {
  const errorAlert = document.querySelector(".alert");
  errorAlert.innerText = errorMessage;
  errorAlert.classList.remove("d-none");
  setTimeout(() => {
    errorAlert.classList.add("d-none");
  }, 2000);
}

// Fonction pour gérer la connexion
async function handleLogin(userCredentials) {
  const apiEndpoint = "http://localhost:3000/api/users/login";

  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "x-api-key": "secret_phrase_here",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userCredentials),
    });

    if (!response.ok) {
      // Lancer une erreur si la réponse n'est pas OK
      throw new Error("Les identifiants sont incorrects.");
    }

    const result = await response.json();
    console.log(result);

    // Enregistrer les données utilisateur dans le localStorage
    localStorage.setItem("_id", result._id);
    localStorage.setItem("token", result.token);
    localStorage.setItem("img", result.userImg);

    // Rediriger après une connexion réussie
    window.location.pathname = "/"; // Destination personnalisable
  } catch (err) {
    // Afficher l'erreur en cas d'exception
    displayError(err.message);
  }
}
