const darkBtn = document.querySelector(".dark");
const body = document.body;
const inputContainer = document.querySelector(".input-container");
const inputMenu = document.querySelector(".input-menu");

let addvalue = 0;
const submitBtn = document.querySelector("#add-expenditure");

const category = document.querySelector(".first-transaction category");
const detailsContainer = document.querySelector(".first-transaction details");
const amountContainer = document.querySelector(".first-transaction amount");

const cont = document.querySelector(".input-container");
const cancelBtn = document.getElementById("cancelBtn");

let currentBalance = document.getElementById("balance-display");

const addBalanceBtn = document.querySelector(".add-btn");
const depositContainer = document.querySelector(".deposit-container");

const depositAmount = document.getElementById("depositAmount");
const depositInfo = document.getElementById("depositInfo");

let balance = Number(currentBalance.value);

let contain = [
  document.querySelector(".first-transaction.category"),
  document.querySelector(".first-transaction.details"),
  document.querySelector(".first-transaction.amount"),
];

let i = localStorage.getItem("state");

if (i % 2 != 0) {
  body.classList.toggle("dark-mode");
}
darkBtn.addEventListener("click", function () {
  i++;
  localStorage.setItem("state", i);
  console.log(i);
  if (i % 2 == 0) {
    body.classList.toggle("dark-mode");
    darkBtn.innerHTML = '<i class="fa-solid fa-moon"></i> Dark';
  } else {
    body.classList.toggle("dark-mode");
    darkBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Light';
  }
});

function submitHistoryInfo() {
  inputContainer.style.display = "block";
  inputContainer.style.opacity = "1";
  inputMenu.style.display = "block";
  depositContainer.style.display = "none";
}

function addHistoryInfo() {
  let selection = document.getElementById("choices");
  let details = document.getElementById("details");
  let amount = document.getElementById("amount");

  let selectionChoice = selection.value;
  let additionalInfo = details.value;
  let amountSpent = amount.value;

  let inputValues = [selectionChoice, additionalInfo, amountSpent];
  if (additionalInfo == "" || amountSpent == "") {
    let errorMessage = document.createElement("h6");
    console.log(selectionChoice, amountSpent, additionalInfo);
    let timer = setInterval(function () {
      errorMessage.textContent = "Fill all the inputs...";
      inputMenu.append(errorMessage);
    }, 1000);

    setTimeout(function () {
      clearInterval(timer);
      errorMessage.remove();
    }, 5000);
  } else {
    let k = 0;

    if (balance >= amountSpent) {
      balance -= amountSpent;

      contain.forEach((container) => {
        let tag = document.createElement("h5");
        console.log(container, inputValues[k]);
        tag.style.paddingBlock = "5px";
        if (Number(inputValues[k])) {
          tag.textContent = "$" + String(inputValues[k]);
        } else {
          tag.textContent = inputValues[k];
        }
        container.append(tag);
        cont.style.display = "none";
        tag.style.color = "red";
        k++;
      });
      inputContainer.style.display = "none";
      selectionChoice = "Personal";
      additionalInfo = "";
      amountSpent = "";
    } else {
      alert("Insufficient Balance");
    }
  }
}

// Add balance button

function topUp() {
  depositContainer.style.display = "block";
  cont.style.display = "block";
  inputMenu.style.display = "none";
}

//Exit input container

function cancel() {
  selectionChoice = "Personal";
  additionalInfo = "";
  amountSpent = "";
  cont.style.display = "none";
}

function updateBalance() {
  console.log(balance)
  balance += Number(depositAmount.value);
  cont.style.display = "none";
  currentBalance.textContent = `$${balance}`;

  let info = ["Deposit", depositInfo.value, String(depositAmount.value)];
  let p = 0;
  contain.forEach((element) => {
    let balanceDisplay = document.createElement("h5");
    if (Number(info[p])) {
      balanceDisplay.textContent = `$${info[p]}`;
    } else {
      balanceDisplay.textContent = info[p];
    }
    balanceDisplay.style.color = "lime";
    element.append(balanceDisplay);
    p++;
  });
}
