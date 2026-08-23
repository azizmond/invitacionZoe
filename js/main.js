const EVENT_CONFIG = {
  name: "Zoe",
  event: "Mis 15",
  date: "2026-10-23T21:00:00-03:00",
  humanDate: "Viernes 23 de octubre de 2026",
  time: "21:00 hs",
  venue: "GREL'S Eventos",
  address: "Av. de Mayo 1357, Ramos Mejía, Buenos Aires, Argentina",
  mapQuery: "GREL'S Eventos, Av. de Mayo 1357, Ramos Mejía, Buenos Aires, Argentina"
};

const whatsappContacts = {
  zoe: "5411921908540",
  susy: "5411934445790",
  andy: "5411930753095"
};

const countdownNodes = {
  days: document.querySelector("[data-countdown-days]"),
  hours: document.querySelector("[data-countdown-hours]"),
  minutes: document.querySelector("[data-countdown-minutes]"),
  seconds: document.querySelector("[data-countdown-seconds]"),
  message: document.querySelector("[data-countdown-message]")
};

const form = document.querySelector("#rsvp-form");
const statusNode = document.querySelector("[data-form-status]");
const dietaryFieldset = document.querySelector("#dietary-fieldset");
const dietaryOptions = document.querySelector("#dietary-options");
const otherDietaryWrap = document.querySelector("#other-dietary-wrap");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const targetDate = new Date(EVENT_CONFIG.date);

function pad(number) {
  return String(number).padStart(2, "0");
}

function formatContactLabel(contactKey) {
  return whatsappContacts[contactKey] ?? contactKey;
}

function getSelectedValue(name) {
  const control = form.querySelector(`input[name="${name}"]:checked`);
  return control ? control.value : "";
}

function getSelectedPreferences() {
  return Array.from(form.querySelectorAll('input[name="dietaryPreferences"]:checked'))
    .map((input) => input.value)
    .filter(Boolean);
}

function updateCountdown() {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    countdownNodes.days.textContent = "00";
    countdownNodes.hours.textContent = "00";
    countdownNodes.minutes.textContent = "00";
    countdownNodes.seconds.textContent = "00";
    countdownNodes.message.textContent = "¡Llegó el gran día! ✨";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  countdownNodes.days.textContent = pad(days);
  countdownNodes.hours.textContent = pad(hours);
  countdownNodes.minutes.textContent = pad(minutes);
  countdownNodes.seconds.textContent = pad(seconds);
  countdownNodes.message.textContent = "La cuenta regresiva sigue avanzando.";
}

function updateDietaryVisibility() {
  const attendance = getSelectedValue("attendance");
  const dietNeed = getSelectedValue("dietaryNeed");
  const attended = attendance === "Sí";
  const needsDiet = dietNeed === "Sí";

  dietaryFieldset.hidden = !attended;
  if (!attended) {
    dietaryOptions.hidden = true;
    otherDietaryWrap.hidden = true;
    form.querySelectorAll('input[name="dietaryPreferences"]').forEach((input) => {
      input.checked = false;
    });
    const otherInput = form.querySelector("#other-dietary");
    if (otherInput) {
      otherInput.value = "";
    }
    return;
  }

  dietaryOptions.hidden = !needsDiet;
  if (!needsDiet) {
    otherDietaryWrap.hidden = true;
    form.querySelectorAll('input[name="dietaryPreferences"]').forEach((input) => {
      input.checked = false;
    });
    const otherInput = form.querySelector("#other-dietary");
    if (otherInput) {
      otherInput.value = "";
    }
  }
}

function clearErrors() {
  document.querySelectorAll("[data-error-for]").forEach((node) => {
    node.textContent = "";
  });
  if (statusNode) {
    statusNode.textContent = "";
  }
}

function setError(name, message) {
  const errorNode = document.querySelector(`[data-error-for="${name}"]`);
  if (errorNode) {
    errorNode.textContent = message;
  }
}

function validateForm() {
  const guestName = form.querySelector("#guest-name");
  const attendance = getSelectedValue("attendance");
  const dietNeed = getSelectedValue("dietaryNeed");
  const attended = attendance === "Sí";
  const needsDiet = dietNeed === "Sí";
  const preferences = getSelectedPreferences();
  const otherDietary = form.querySelector("#other-dietary");

  let isValid = true;

  if (!guestName.value.trim()) {
    setError("guestName", "El nombre es obligatorio.");
    isValid = false;
  }

  if (!attendance) {
    setError("attendance", "Indicá si vas a asistir.");
    isValid = false;
  }

  if (attended && !dietNeed) {
    setError("dietaryNeed", "Indicá si necesitás una dieta especial.");
    isValid = false;
  }

  if (attended && needsDiet && preferences.length === 0) {
    setError("dietaryNeed", "Si elegís dieta especial, seleccioná al menos una preferencia.");
    isValid = false;
  }

  if (attended && needsDiet && preferences.includes("Otra") && !otherDietary.value.trim()) {
    setError("dietaryNeed", "Especificá cuál es la otra preferencia.");
    isValid = false;
  }

  return isValid;
}

function buildMessage(contactKey) {
  const guestName = form.querySelector("#guest-name").value.trim();
  const attendance = getSelectedValue("attendance");
  const dietNeed = getSelectedValue("dietaryNeed");
  const preferences = getSelectedPreferences();
  const otherDietary = form.querySelector("#other-dietary").value.trim();
  const extraMessage = form.querySelector("#message").value.trim();

  const preferenceLines = preferences
    .filter((item) => item !== "Otra")
    .join(", ");

  const finalPreferences = [];
  if (preferenceLines) {
    finalPreferences.push(preferenceLines);
  }
  if (preferences.includes("Otra") && otherDietary) {
    finalPreferences.push(otherDietary);
  }

  const lines = [
    `Hola ${EVENT_CONFIG.name}, soy ${guestName}.`,
    `Quería confirmar que ${attendance === "Sí" ? "sí voy a asistir" : "no podré asistir"} a ${EVENT_CONFIG.event}.`
  ];

  lines.push(`Evento: ${EVENT_CONFIG.humanDate} a las ${EVENT_CONFIG.time}.`);

  if (attendance === "Sí") {
    lines.push(`Necesidad de dieta especial: ${dietNeed || "No especificada"}.`);
    if (dietNeed === "Sí") {
      lines.push(`Preferencias: ${finalPreferences.join(" · ") || "Sin preferencias"}.`);
    }
  }

  if (extraMessage) {
    lines.push(`Mensaje: ${extraMessage}.`);
  }

  lines.push(`Evento: ${EVENT_CONFIG.venue}.`);
  lines.push(`Dirección: ${EVENT_CONFIG.address}.`);
  lines.push(`Contacto seleccionado: ${contactKey.toUpperCase()}.`);

  return encodeURIComponent(lines.join("\n"));
}

function openWhatsApp(contactKey) {
  clearErrors();

  if (!validateForm()) {
    if (statusNode) {
      statusNode.textContent = "Revisá los campos marcados antes de enviar el mensaje.";
    }
    return;
  }

  const phone = whatsappContacts[contactKey];
  const message = buildMessage(contactKey);
  const url = `https://wa.me/${phone}?text=${message}`;

  if (statusNode) {
    statusNode.textContent = `Preparando WhatsApp para ${formatContactLabel(contactKey)}...`;
  }

  window.open(url, "_blank", "noopener,noreferrer");
}

function revealElements() {
  if (prefersReducedMotion.matches) {
    document.querySelectorAll(".reveal").forEach((element) => {
      element.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16
    }
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
}

function bindInteractions() {
  if (!form) {
    return;
  }

  form.addEventListener("change", (event) => {
    if (event.target.matches('input[name="attendance"], input[name="dietaryNeed"]')) {
      updateDietaryVisibility();
    }

    if (event.target.matches("[data-other-toggle]")) {
      otherDietaryWrap.hidden = !event.target.checked;
      if (!event.target.checked) {
        const otherInput = form.querySelector("#other-dietary");
        if (otherInput) {
          otherInput.value = "";
        }
      }
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    openWhatsApp("zoe");
  });

  document.querySelectorAll("[data-whatsapp-contact]").forEach((button) => {
    button.addEventListener("click", () => {
      openWhatsApp(button.dataset.whatsappContact);
    });
  });

  updateDietaryVisibility();
}

updateCountdown();
setInterval(updateCountdown, 1000);
revealElements();
bindInteractions();
