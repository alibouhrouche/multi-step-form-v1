let currentStep = 0;
const sidebarSteps = document.querySelectorAll(".sidebar-step");
const formSteps = document.querySelectorAll(".form-step");
document.getElementById("plan-change").addEventListener("click", () => {
  sidebarSteps[currentStep].classList.remove("active");
  formSteps[currentStep].classList.remove("visible");
  currentStep = 1;
  sidebarSteps[currentStep].classList.add("active");
  formSteps[currentStep].classList.add("visible");
});
const formContainer = document.querySelector(".form-container");
/** @type {NodeListOf<HTMLFormElement>} */
const forms = document.querySelectorAll(".form-step__content");
let currentForm = forms[currentStep];
const nextBtn = document.querySelectorAll(".form-step__button--next");
const backBtn = document.querySelectorAll(".form-step__button--back");
/** @type {HTMLInputElement} */
const yearlySwitch = document.getElementById("yearly");
yearlySwitch.addEventListener("change", () => {
  forms[2].dataset.time = yearlySwitch.checked ? "yearly" : "monthly";
});
nextBtn.forEach((btn) => {
  btn.addEventListener("click", next);
});
backBtn.forEach((btn) => {
  btn.addEventListener("click", back);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    next();
  }
})
function resetInputs() {
  currentForm.querySelectorAll(".form-step__input").forEach((input) => {
    input.classList.remove("invalid", "required");
  });
}
function next() {
  resetInputs();
  if (currentStep > 3) {
    return;
  }
  if (currentStep === 3) {
    advance();
    logResult();
    return;
  }
  if (currentForm.checkValidity()) {
    advance();
    if (currentStep === 3) {
      generateInvoice();
    }
  } else {
    currentForm.querySelectorAll("input").forEach((input) => {
      if (!input.checkValidity()) {
        if (input.required && input.value === "") {
          input.parentElement.classList.add("required");
        } else {
          input.parentElement.classList.add("invalid");
        }
      }
    });
  }
}
function logResult() {
    const formDataMap = [];
    forms.forEach((form) => {
        const formData = new FormData(form);
        formDataMap.push(formData);
    })
    const addOns = []
    if (formDataMap[2].get("online-service")) {
        addOns.push("Online service");
    }
    if (formDataMap[2].get("larger-storage")) {
        addOns.push("Larger storage");
    }
    if (formDataMap[2].get("customizable-profile")) {
        addOns.push("Customizable profile");
    }
    const res = {
        name: formDataMap[0].get("name"),
        email: formDataMap[0].get("email"),
        phone: formDataMap[0].get("phone"),
        plan: formDataMap[1].get("plan"),
        duration: formDataMap[1].get("yearly") === "yearly" ? "yearly" : "monthly",
        addOns,
    }
    console.log(res);
}
function generateInvoice() {
    const prices = {
        arcade: [9, 90],
        advanced: [12, 120],
        pro: [15, 150]
    }
    const planNames = {
        arcade: "Arcade",
        advanced: "Advanced",
        pro: "Pro"
    }
    const addOnsNames = {
        'online-service': "Online service",
        'larger-storage': "Larger storage",
        'customizable-profile': "Customizable profile"
    }
    const addOnsPrices = {
        'online-service': [1, 10],
        'larger-storage': [2, 20],
        'customizable-profile': [2, 20]
    }
    const planData = new FormData(forms[1])
    const plan = planData.get("plan");
    const yearly = planData.get("yearly") === "yearly";
    const price = yearly ? prices[plan][1] : prices[plan][0];
    document.getElementById("plan-name").textContent = planNames[plan] + " (" + (yearly ? "Yearly" : "Monthly") + ")";
    document.getElementById("plan-price").textContent = `$${price}/${yearly ? "yr" : "mo"}`
    const addOnsData = new FormData(forms[2])
    const addOns = []
    for (const [key, value] of addOnsData) {
        if (value === "on") {
            addOns.push(key)
        }
    }
    const addOnsOutput = document.getElementById("add-ons")
    addOnsOutput.innerHTML = ""
    let total = price;
    addOns.forEach(addOn => {
        const name = addOnsNames[addOn]
        const price = yearly ? addOnsPrices[addOn][1] : addOnsPrices[addOn][0]
        total += price
        addOnsOutput.innerHTML += `
        <li>
            <span>${name}</span>
            <span>+$${price}/${yearly ? "yr" : "mo"}</span>
        </li>
        `
    })
    document.getElementById("total-price").innerHTML = `
        <span>Total (per ${yearly ? "year" : "month"})</span>
        <span class="form-result__total-price">$${total}/${yearly ? "yr" : "mo"}</span>
    `
}
function advance() {
    if (currentStep < 3)
    sidebarSteps[currentStep].classList.remove("active");
    formSteps[currentStep].classList.remove("visible");
    currentStep++;
    if (currentStep < 4)
    sidebarSteps[currentStep].classList.add("active");
    formSteps[currentStep].classList.add("visible");
}

function back() {
  sidebarSteps[currentStep].classList.remove("active");
  formSteps[currentStep].classList.remove("visible");
  currentStep--;
  sidebarSteps[currentStep].classList.add("active");
  formSteps[currentStep].classList.add("visible");
}
