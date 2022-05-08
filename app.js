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



const topBtn = document.querySelector(".top");
const habilityTittle = document.querySelector('.habilidades-title')
const options = {
  threshold: 1.0,
};

const rootElement = document.documentElement;

const scrollToTop = () => {
  rootElement.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

topBtn.addEventListener("click", (e) => {
  if (e.target.matches(".top") || e.target.matches(".top *")) {
    scrollToTop();
  }
});

const addClass = () => topBtn.classList.add("btnActive");
const removeClass = () => topBtn.classList.remove("btnActive");

const ojo = (entrys) => {
  entrys.forEach((entry) => {
    if (entry.isIntersecting) {
      addClass();
    }else{
      removeClass()
    }
  });
};

const observer = new IntersectionObserver(ojo, options);
observer.observe(habilityTittle);





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

AOS.init();