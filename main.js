const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let stars = [];
const layerCount = 3; // 3 layers for parallax
const speeds = [0.05, 0.1, 0.2]; // Slower speeds for distant stars
const baseStarCount = 50; // Base count of stars per layer
let shootingStar = null;

// Generate a random gray color for stars
function getRandomGrayColor() {
    const grayValue = Math.floor(Math.random() * 256);
    return `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
}

// Resize the canvas
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars(); // Recreate stars based on new dimensions
}

// Create the starfield
function createStars() {
    stars = [];
    const scalingFactor = Math.max(canvas.width, canvas.height) / 1000; // Scale star count
    for (let i = 0; i < layerCount; i++) {
        const starCount = Math.floor(baseStarCount * scalingFactor * (i + 1));
        for (let j = 0; j < starCount; j++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * (i + 1) + 0.5, // Larger stars for closer layers
                speed: speeds[i],
                opacity: Math.random(),
                baseOpacity: Math.random() * 0.5 + 0.5, // Base opacity for twinkling
                layer: i, // Track which layer the star belongs to
            });
        }
    }
}

// Update star positions and simulate twinkling
function updateStars() {
    stars.forEach((star) => {
        star.y -= star.speed; // All stars move upward
        star.opacity =
            star.baseOpacity + Math.sin(Date.now() * 0.001 * star.speed) * 0.3; // Smooth twinkle

        // Reset star position when it goes off-screen
        if (star.y < 0) {
            star.y = canvas.height;
            star.x = Math.random() * canvas.width;
        }
    });
}

// Draw the stars
function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Add a dark radial blur gradient background
    const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 8, // Start small for a blur effect
        canvas.width / 2,
        canvas.height / 2,
        canvas.width // Expand to the edges
    );
    gradient.addColorStop(0, "rgba(10, 20, 40, 1)"); // Deep dark blue at the center
    gradient.addColorStop(1, "rgba(0, 0, 0, 1)"); // Black at the edges
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw stars with parallax effect
    stars.forEach((star) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
    });
}

// Initialize a shooting star
function createShootingStar() {
    const startX = Math.random() * canvas.width;
    const startY = Math.random() * canvas.height;
    const angle = Math.random() * Math.PI * 2; // Random direction
    const length = Math.random() * 300 + 100; // Random trail length
    const speed = Math.random() * 4 + 2;

    shootingStar = {
        x: startX,
        y: startY,
        length: length,
        speed: speed,
        opacity: 1,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
    };

    // Schedule the next shooting star (20–40 seconds for rare appearance)
    const nextAppearance = Math.random() * 20000 + 20000;
    setTimeout(createShootingStar, nextAppearance);
}

// Update shooting star position
function updateShootingStar() {
    if (!shootingStar) return;

    shootingStar.x += shootingStar.dx;
    shootingStar.y += shootingStar.dy;
    shootingStar.opacity -= 0.01;

    if (
        shootingStar.opacity <= 0 ||
        shootingStar.x < 0 ||
        shootingStar.x > canvas.width ||
        shootingStar.y < 0 ||
        shootingStar.y > canvas.height
    ) {
        shootingStar = null; // Remove shooting star
    }
}

// Draw the shooting star
function drawShootingStar() {
    if (!shootingStar) return;

    const gradient = ctx.createLinearGradient(
        shootingStar.x,
        shootingStar.y,
        shootingStar.x - shootingStar.dx * shootingStar.length,
        shootingStar.y - shootingStar.dy * shootingStar.length
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
    gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

    ctx.beginPath();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    ctx.moveTo(shootingStar.x, shootingStar.y);
    ctx.lineTo(
        shootingStar.x - shootingStar.dx * shootingStar.length,
        shootingStar.y - shootingStar.dy * shootingStar.length
    );
    ctx.stroke();
    ctx.closePath();
}

// Animation loop
function animate() {
    updateStars();
    updateShootingStar();
    drawStars();
    drawShootingStar();
    requestAnimationFrame(animate);
}

// Handle resizing
window.addEventListener("resize", resizeCanvas);

// Initialize
resizeCanvas();
createStars();
setTimeout(createShootingStar, Math.random() * 20000 + 20000); // Rare shooting stars
animate();



















/***********************************************************************************************************************/




const translations = {};

// Cargar las traducciones
const loadTranslations = async (language = "en") => {
    try {
        if (!translations[language]) {
            const response = await fetch(`./translations/${language}.json`);
            translations[language] = await response.json();
        }
        applyTranslations(language);
        localStorage.setItem("language", language);
        updateButtonText(language);
    } catch (error) {
        console.error("Error al cargar traducciones:", error);
    }
};


const applyTranslations = (language) => {
    const elementsToTranslate = document.querySelectorAll("[id]");
    elementsToTranslate.forEach((element) => {
        const key = element.id;
        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });
};

const updateButtonText = (currentLanguage) => {
    const button = document.querySelector(".language-button");
    const nextLanguage = currentLanguage === "es" ? "en" : "es";
    button.textContent = nextLanguage;
};

document.querySelector(".language-button").addEventListener("click", () => {
    const currentLanguage = localStorage.getItem("language") || "en";
    const nextLanguage = currentLanguage === "es" ? "en" : "es";
    loadTranslations(nextLanguage);
});

document.addEventListener("DOMContentLoaded", () => {
    const selectedLanguage = localStorage.getItem("language") || "en";
    loadTranslations(selectedLanguage);

    const button = document.querySelector("#audio");

    button.play()
});










((contenedor, main, active, none) => {
    const contenedorIcon = document.querySelector(contenedor);
    const mainMenu = document.querySelector(main);

    contenedorIcon.addEventListener("click", (e) => {
        if (e.target.matches(contenedor) || e.target.matches(`${contenedor} *`)) {
            contenedorIcon.firstElementChild.classList.toggle(none);
            contenedorIcon.lastElementChild.classList.toggle(none);
            mainMenu.classList.toggle(active);
        }
    });
    mainMenu.addEventListener("click", (e) => {
        if (e.target.matches(`${main} *`)) {
            mainMenu.classList.remove(active);
            contenedorIcon.firstElementChild.classList.toggle(none);
            contenedorIcon.lastElementChild.classList.toggle(none);
        }
    });
})(".container-icon", ".main-menu", "main-menu-active", "none");




(() => {

    const form = document.getElementById("form");
    const alert = document.querySelector(".alert");
    const inputName = form.name;
    const inputEmail = form.email;
    const inputArea = form.message;

    const rexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
    const rexEmail =
        /^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$/;
    const rexMessage = /^[\s\S]{10,255}$/;

    const validar = (input, texto, expresion) => {
        if (expresion.test(input.value)) {
            input.classList.remove("error");
            input.classList.add("success");
        } else {
            alert.classList.add("alertError");
            alert.textContent = texto;

            input.classList.remove("success");
            input.classList.add("error");

            setTimeout(() => {
                alert.classList.remove("alertError");
                alert.textContent = "";
            }, 5000);
        }
    };

    inputName.addEventListener("blur", () => {
        validar(inputName, "este nombre es incorrecto", rexName);
    });

    inputEmail.addEventListener("blur", () => {
        validar(inputEmail, "este email es incorrecto", rexEmail);
    });

    inputArea.addEventListener("blur", () => {
        validar(inputArea, "este mensaje es incorrecto", rexMessage);
    });

    const send = () => {
        fetch("https://formsubmit.co/ajax/nendytorres@gmail.com", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                name: inputName.value,
                email: inputEmail.value,
                message: inputArea.value,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                inputName.classList.remove("success", "error");
                inputEmail.classList.remove("success", "error");
                inputArea.classList.remove("success", "error");
                form.reset();
            })
            .catch((error) => console.log(error));
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (
            rexName.test(inputName.value) &&
            rexEmail.test(inputEmail.value) &&
            rexMessage.test(inputArea.value)
        ) {
            send();

            alert.classList.add("alertSuccess");
            alert.textContent = "su mensaje se envio correctamente";

            setTimeout(() => {
                alert.classList.remove("alertSuccess");
                alert.textContent = "";
            }, 5000);
        } else {
            alert.classList.add("alertError");
            alert.textContent = "por favor complete el formulario";

            setTimeout(() => {
                alert.classList.remove("alertError");
                alert.textContent = "";
            }, 5000);
        }
    });



    document.querySelector("#copy-button").addEventListener("click", async () => {
        var textToCopy = document.getElementById("textToCopy");
        const text = textToCopy.value;
        navigator.clipboard.writeText(text);
        alert.classList.add("alertSuccess");
        alert.textContent = "email copied";

        setTimeout(() => {
            alert.classList.remove("alertSuccess");
        }, 5000);
    })


})();