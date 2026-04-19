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

const chartCanvas = document.getElementById("chartCanvas");


const messageBox = document.querySelector('.box');


let storedTasks = []

let balance = Number(currentBalance.value);
if (balance) {
  balance = Number(currentBalance.value);
} else {
  balance = 0.0;
}

currentBalance.textContent = `$${balance}`;

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

  //Storage Object  
  //Assign the values to the object
  const transactionHistory = {
      name : selectionChoice,
      details : additionalInfo,
      amount : amountSpent
    };

    //Adding the object to array
    storedTasks.push(transactionHistory);

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
      console.log(balance);
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
      currentBalance.textContent = `$${balance}`;

      inputContainer.style.display = "none";
      selection.value = "Personal";
      details.value = "";
      amount.value = '';
      showMessage(`$${amountSpent} has been deducted!`, 'red');
      amountSpent = "";
    } else {
      showMessage('Insufficient Balance!', 'red');
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
  console.log(balance);
  balance += Number(depositAmount.value);
  cont.style.display = "none";
  currentBalance.textContent = `$${balance}`;
  showMessage('Succesfully Deposited!', 'lime');

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

function showMessage(message , color){
    const toast = document.createElement('p');
    toast.classList.add('notification');
    toast.textContent = `${message}`;
    toast.style.color = `${color}`;
    messageBox.appendChild(toast);
    toast.style.opacity = '1';
    
    setTimeout(function (){
        toast.style.opacity = '0';        
        toast.remove();
    }, 6000);
}

// Chart COde
// new Chart(chartCanvas, {
//   type: "bar",
//   data: {
//     labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
//     datasets: [
//       {
//         label: "# of Votes",
//         data: [12, 19, 3, 5, 2, 3],
//         borderWidth: 1,
//       },
//     ],
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   },
// });