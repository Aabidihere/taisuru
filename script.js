const form = document.getElementById("communityForm");
const success = document.getElementById("success");

const fields = [
  { id: "name", message: "Please enter your name." },
  { id: "address", message: "Please enter your address." },
  { id: "issue", message: "Please describe your issue." },
  { id: "focus", message: "Please tell us what the councillor should focus on." },
  { id: "suggestion", message: "Please add a suggestion or question." }
];

function setError(input, message) {
  const label = input.closest("label");
  label.classList.add("invalid");
  label.querySelector(".error").textContent = message;
}

function clearError(input) {
  const label = input.closest("label");
  label.classList.remove("invalid");
  label.querySelector(".error").textContent = "";
}

fields.forEach(({ id }) => {
  const input = document.getElementById(id);
  input.addEventListener("input", () => {
    if (input.value.trim()) clearError(input);
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let valid = true;

  fields.forEach(({ id, message }) => {
    const input = document.getElementById(id);
    if (!input.value.trim()) {
      setError(input, message);
      valid = false;
    } else {
      clearError(input);
    }
  });

  if (!valid) return;

  const submitButton = form.querySelector("button[type=submit]");
  const originalButtonText = submitButton.innerHTML;

  submitButton.disabled = true;
  submitButton.innerHTML = "Sending...";

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: {
        "Accept": "application/json"
      }
    });

    const result = await response.json();

    if (!response.ok || result.success === false) {
      throw new Error("Submission failed");
    }

    success.classList.add("show");
    success.scrollIntoView({ behavior: "smooth", block: "center" });
    form.reset();

    setTimeout(() => {
      success.classList.remove("show");
    }, 7000);
  } catch (error) {
    alert("We could not send your registration. Please check your internet connection and try again.");
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  }
});
