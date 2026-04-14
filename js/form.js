import {
  isEmpty,
  isValidEmail,
  isValidPhone,
  showError,
  clearError,
} from "./utils.js";

const form = document.getElementById("jobForm");
const steps = document.querySelectorAll(".form-step");
const progress = document.getElementById("progress");
const progressLabel = document.getElementById("progressLabel");
const fileLabel = document.getElementById("fileLabel");

const experienceInput = form.elements["experience"];
const condField = document.getElementById("condLeadership");

let stepIndex = 0;

// ===== Analytics =====
let started = Number(localStorage.getItem("started") || 0);
let submitted = Number(localStorage.getItem("submitted") || 0);

if (!sessionStorage.getItem("formStarted")) {
  started++;
  localStorage.setItem("started", started);
  sessionStorage.setItem("formStarted", "true");
}

const statStarted = document.getElementById("statStarted");
const statSubmitted = document.getElementById("statSubmitted");

if (statStarted) statStarted.textContent = started;
if (statSubmitted) statSubmitted.textContent = submitted;

// ===== Load saved data =====
const savedData = JSON.parse(localStorage.getItem("jobForm")) || {};

for (const [key, value] of Object.entries(savedData)) {
  const input = form.elements[key];
  if (input && input.type !== "file") {
    input.value = value;
  }
}

// ===== Conditional Field Logic =====
function toggleConditionalField() {
  const val = Number(experienceInput.value);

  if (val > 5) {
    condField.classList.add("visible");
  } else {
    condField.classList.remove("visible");
  }
}

toggleConditionalField();

experienceInput.addEventListener("input", toggleConditionalField);

// ===== Show Step =====
function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle("active", i === index);
  });

  progress.style.width = `${((index + 1) / steps.length) * 100}%`;

  if (progressLabel) {
    progressLabel.textContent = `Step ${index + 1} of ${steps.length}`;
  }
}

// ===== Validation =====
function validateStep(index) {
  const inputs = steps[index].querySelectorAll("input");
  console.log(inputs);
  let isValid = true;

  inputs.forEach((input) => {
    const condParent = input.closest(".cond-field");

    // Skip hidden fields
    if (condParent && !condParent.classList.contains("visible")) {
      return;
    }

    const value = input.value;

    if (isEmpty(value)) {
      showError(input, "This field is required");
      isValid = false;
      return;
    }

    if (input.name === "email" && !isValidEmail(value)) {
      showError(input, "Invalid email format");
      isValid = false;
      return;
    }

    if (input.name === "phone" && !isValidPhone(value)) {
      showError(input, "Enter valid 10-digit number");
      isValid = false;
      return;
    }

    if (
      input.name === "leadershipRoles" &&
      Number(form.experience.value) > 5 &&
      isEmpty(value)
    ) {
      showError(input, "Leadership role required");
      isValid = false;
      return;
    }

    clearError(input);
  });

  return isValid;
}

// ===== Navigation =====
document.querySelectorAll(".next").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!validateStep(stepIndex)) return;

    stepIndex = Math.min(stepIndex + 1, steps.length - 1);
    showStep(stepIndex);
    saveForm();

    if (stepIndex === steps.length - 1) {
      populateReview();
    }
  });
});

document.querySelectorAll(".prev").forEach((btn) => {
  btn.addEventListener("click", () => {
    stepIndex = Math.max(stepIndex - 1, 0);
    showStep(stepIndex);
  });
});

// ===== Save Data =====
function saveForm() {
  const data = {};
  console.log("data", data);

  Array.from(form.elements).forEach((el) => {
    if (el.name) data[el.name] = el.value;
  });

  localStorage.setItem("jobForm", JSON.stringify(data));
}

form.addEventListener("input", saveForm);

// ===== File Validation =====
form.resume.addEventListener("change", () => {
  const file = form.resume.files[0];
  if (!file) return;

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(file.type)) {
    alert("Only PDF, DOC, DOCX allowed");
    form.resume.value = "";
    fileLabel.textContent = "";
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert("File must be less than 2MB");
    form.resume.value = "";
    fileLabel.textContent = "";
    return;
  }

  fileLabel.textContent = `Selected: ${file.name} (${(
    file.size /
    1024 /
    1024
  ).toFixed(2)} MB)`;
});

// ===== Review =====
function populateReview() {
  const data = JSON.parse(localStorage.getItem("jobForm")) || {};
  const review = document.getElementById("review");

  const resumeFile = form.resume.files[0];
  const fileName = resumeFile ? resumeFile.name : "Not uploaded";
  console.log(fileName);

  review.innerHTML = `
    <div class="review-row">
      <span class="review-key">Full Name</span>
      <span class="review-val">${data.name || "-"}</span>
    </div>
    <div class="review-row">
      <span class="review-key">Email</span>
      <span class="review-val">${data.email || "-"}</span>
    </div>
    <div class="review-row">
      <span class="review-key">Phone</span>
      <span class="review-val">${data.phone || "-"}</span>
    </div>
    <div class="review-row">
      <span class="review-key">Experience</span>
      <span class="review-val">${data.experience || 0} years</span>
    </div>
    <div class="review-row">
      <span class="review-key">Skills</span>
      <span class="review-val">${data.skills || "-"}</span>
    </div>
    <div class="review-row">
      <span class="review-key">Resume</span>
      <span class="review-val">${fileName}</span>
    </div>
  `;
}

// ===== Submit =====
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let submitted = Number(localStorage.getItem("submitted") || 0);
  submitted++;

  localStorage.setItem("submitted", submitted);
  localStorage.removeItem("jobForm");

  window.location.href = "thankyou.html";
});

// ===== Init =====
showStep(stepIndex);
