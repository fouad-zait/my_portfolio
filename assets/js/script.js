'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}



// On enlève le comportement par défaut (action="#") et on envoie via EmailJS
form.addEventListener("submit", function (e) {
  e.preventDefault(); // ← très important !

  // Optionnel : désactiver le bouton pendant l'envoi
  formBtn.setAttribute("disabled", "");
  formBtn.innerHTML = '<ion-icon name="hourglass"></ion-icon> Envoi...';

  const formData = {
    fullname: form.querySelector('input[name="fullname"]').value,
    email:    form.querySelector('input[name="email"]').value,
    message:  form.querySelector('textarea[name="message"]').value,
    // optionnel : date: new Date().toLocaleString()
  };

  emailjs.send(
    "service_ovrnoz3",      // ← ton SERVICE ID
    "template_iqezkkj",     // ← ton TEMPLATE ID
    formData
  )
  .then(
    function(response) {
      console.log("SUCCESS!", response.status, response.text);
      alert("Message envoyé avec succès ✓ Merci !");
      form.reset();
      formBtn.removeAttribute("disabled");
      formBtn.innerHTML = '<ion-icon name="paper-plane"></ion-icon><span>Send Message</span>';
    },
    function(error) {
      console.error("FAILED...", error);
      alert("Désolé, une erreur est survenue. Réessaie plus tard.");
      formBtn.removeAttribute("disabled");
      formBtn.innerHTML = '<ion-icon name="paper-plane"></ion-icon><span>Send Message</span>';
    }
  );
});

// Garde ta validation actuelle (elle reste utile)
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}
// ────────────────────────────────────────────────
// MODAL VIDÉO POUR LES PROJETS – VERSION CORRIGÉE ET ROBUSTE
// ────────────────────────────────────────────────

// On attend que le DOM soit complètement chargé pour éviter les erreurs "null"
document.addEventListener('DOMContentLoaded', () => {

  // Sélection des éléments (avec vérifications)
  const videoModal     = document.getElementById('projectVideoModal');
  const modalBackdrop  = document.getElementById('modalBackdrop');
  const modalCloseBtn  = document.querySelector('.modal-close-btn');
  const projectVideo   = document.getElementById('projectVideo');
  const videoSource    = projectVideo ? projectVideo.querySelector('source') : null;
  const videoLoader    = document.querySelector('.video-loader');

  // Vérification de base (optionnel – pour debug)
  if (!videoModal || !projectVideo || !videoSource) {
    console.warn("Modal vidéo incomplet : vérifie que #projectVideoModal, #projectVideo et <source> existent dans le HTML");
    return;
  }

  // ─── OUVERTURE DU MODAL ───────────────────────────────────────
  document.querySelectorAll('.project-item a[data-video]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      const videoUrl = this.getAttribute('data-video');
      if (!videoUrl) {
        console.warn("Aucune URL vidéo trouvée sur cet élément");
        return;
      }

      // Mise à jour de la source vidéo
      videoSource.src = videoUrl;
      projectVideo.load();
      projectVideo.currentTime = 0;
      projectVideo.muted = false;

      // Affichage du modal
      if (videoModal) {
        videoModal.classList.add('active');
      }

      // Gestion du loader (optionnel mais sympa)
      if (videoLoader) {
        videoLoader.style.display = 'block';
      }

      // On cache le loader dès que la vidéo est prête
      projectVideo.addEventListener('canplay', () => {
        if (videoLoader) videoLoader.style.display = 'none';
      }, { once: true });

      // Tentative de lecture automatique
      projectVideo.play().catch(err => {
        console.log("Lecture auto bloquée (politique du navigateur) :", err);
      });
    });
  });

  // ─── FONCTION DE FERMETURE ────────────────────────────────────
  const closeVideoModal = () => {
    if (videoModal) {
      videoModal.classList.remove('active');
    }
    if (projectVideo) {
      projectVideo.pause();
      // projectVideo.currentTime = 0;   // décommente si tu veux reset à chaque fermeture
    }
    if (videoLoader) {
      videoLoader.style.display = 'block'; // on le remet visible pour la prochaine ouverture
    }
  };

  // ─── ÉVÉNEMENTS DE FERMETURE ──────────────────────────────────
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeVideoModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeVideoModal);
  }

  // Fermeture avec la touche Échap
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && videoModal?.classList.contains('active')) {
      closeVideoModal();
    }
  });

});
