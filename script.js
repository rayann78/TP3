// Initialisation des variables
let carsList = [];

// Récupérer les voitures depuis l'API
function fetchCars() {
    fetch("http://localhost:3000/api/cars", {
        method: "GET",
        headers: {
            "x-api-key": "secret_phrase_here",
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Votre API ne fonctionne pas!");
            }
            return res.json();
        })
        .then((data) => {
            carsList = data; // Mettre à jour la liste des voitures
            writeDom(); // Afficher les données
        })
        .catch((error) => {
            console.error("Erreur lors de la récupération des voitures :", error);
        });
}

// Afficher les cartes dynamiques
function writeDom() {
    const carContainer = document.querySelector(".row");
    carContainer.innerHTML = "";

    carsList.forEach((car) => {
        const card = `
            <article class="col">
                <div class="card shadow-sm">
                    <img src="${car.carImage}" class="card-img-top" alt="${car.carName}" />
                    <div class="card-body">
                        <h5 class="card-title">${car.carName}</h5>
                        <p class="card-text">Released in ${car.carYear}.</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <button 
                                    type="button" 
                                    class="btn btn-sm btn-outline-secondary view" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#exampleModal" 
                                    data-id="${car.id}">
                                    View
                                </button>
                                <button 
                                    type="button" 
                                    class="btn btn-sm btn-outline-secondary edit" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#exampleModal" 
                                    data-id="${car.id}">
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        `;
        carContainer.innerHTML += card;
    });

    addEventListeners(); 
}

function addEventListeners() {
    document.querySelectorAll(".view").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const carId = e.target.getAttribute("data-id");
            viewModal(carId);
        });
    });

    document.querySelectorAll(".edit").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const carId = e.target.getAttribute("data-id");
            editModal(carId);
        });
    });
}

// Fonction pour afficher les détails d'une voiture (View)
function viewModal(carId) {
    // Récupérer les données de la voiture via l'API
    fetch(`http://localhost:3000/api/cars/${carId}`, {
        method: "GET",
        headers: {
            "x-api-key": "secret_phrase_here",
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error("Erreur avec la voiture ayant cet identifiant");
            }
            return res.json();
        })
        .then((data) => {
            const selectedCar = data;

            // Modifier le corps du modal pour afficher l'image de la voiture
            const modalBody = `
                <img src="${selectedCar.carImage}" alt="${selectedCar.carName}" class="img-fluid" />
                <p><strong>Name:</strong> ${selectedCar.carName}</p>
                <p><strong>Year:</strong> ${selectedCar.carYear}</p>
            `;
            modifyModal(selectedCar.carName, modalBody, false); // Appeler modifyModal avec les détails

            // Modifier le footer du modal (pas de bouton "Save Changes" pour la vue)
            document.querySelector(".modal-footer").innerHTML = `
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            `;
        })
        .catch((error) => {
            console.error("Erreur lors de la récupération des voitures :", error);
            showError("Erreur lors de la récupération des données de la voiture.");
        });
}

// Fonction pour afficher un message d'erreur
function showError(message) {
    const errorElement = document.createElement("div");
    errorElement.classList.add("alert", "alert-danger");
    errorElement.textContent = message;
    document.body.appendChild(errorElement);
    setTimeout(() => {
        errorElement.remove();
    }, 3000);
}

// Modifier le contenu du modal
function modifyModal(modalTitle, modalBody, showSaveButton) {
    document.querySelector(".modal-title").textContent = modalTitle;
    document.querySelector(".modal-body").innerHTML = modalBody;

    const footer = document.querySelector(".modal-footer");
    footer.innerHTML = `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        ${showSaveButton ? '<button type="button" class="btn btn-primary" id="saveChangesButton">Save Changes</button>' : ''}
    `;
}

// Fonction pour modifier une voiture (Edit)
function editModal(carId) {
    const car = carsList.find((item) => item.id === parseInt(carId));
    
    if (car) {
        const formHtml = `
            <form id="editForm">
                <div class="mb-3">
                    <label for="carName" class="form-label">Car Name</label>
                    <input type="text" class="form-control" id="carName" value="${car.carName}">
                </div>
                <div class="mb-3">
                    <label for="carYear" class="form-label">Car Year</label>
                    <input type="number" class="form-control" id="carYear" value="${car.carYear}">
                </div>
                <div class="mb-3">
                    <label for="carImage" class="form-label">Car Image URL</label>
                    <input type="text" class="form-control" id="carImage" value="${car.carImage}">
                </div>
            </form>
        `;
        modifyModal("Edit Car", formHtml, true);

        // Gestion du bouton "Submit"
        document.querySelector("#saveChangesButton").addEventListener("click", () => {
            const newName = document.querySelector("#carName").value;
            const newYear = document.querySelector("#carYear").value;
            const newImage = document.querySelector("#carImage").value;

            // Préparer les nouvelles données à envoyer
            const updatedCar = {
                id: car.id,
                carName: newName,
                carYear: newYear,
                carImage: newImage
            };

            // Envoyer les données modifiées à l'API via PUT
            fetch(`http://localhost:3000/api/cars/${car.id}`, {
                method: "PUT",
                headers: {
                    "x-api-key": "secret_phrase_here",
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(updatedCar)
            })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Erreur lors de la mise à jour des données.");
                }
                return res.json();
            })
            .then((updatedCarData) => {
                // Mise à jour de la liste des voitures avec les nouvelles données
                const index = carsList.findIndex((car) => car.id === updatedCarData.id);
                carsList[index] = updatedCarData;
                writeDom();
                const modal = bootstrap.Modal.getInstance(document.getElementById("exampleModal"));
                modal.hide();
            })
            .catch((error) => {
                console.error("Erreur lors de la mise à jour de la voiture :", error);
                showError("Erreur lors de la mise à jour de la voiture.");
            });
        });
    } else {
        console.error("Car not found for editing");
    }
}

// Charger le DOM au démarrage
document.addEventListener("DOMContentLoaded", fetchCars);
