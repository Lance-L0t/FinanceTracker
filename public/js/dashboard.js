

const inputContainer = document.querySelector(".input-container");
const inputMenu = document.querySelector(".input-menu");
const depositContainer = document.querySelector(".deposit-container");

function submitHistoryInfo() {
  inputContainer.style.display = "flex";

  inputMenu.style.display = "block";

  depositContainer.style.display = "none";

}

function topUp() {
  inputContainer.style.display = "flex";

  depositContainer.style.display = "block";

  inputMenu.style.display = "none";
}

function cancel() {
  inputContainer.style.display = "none";

  inputMenu.style.display = "none";

  depositContainer.style.display = "none";
  details.value = "";
  amount.value = "";
  depositAmount.value = "";
  depositInfo.value = "";
}

//Notification Functions
const notificationBox = document.getElementById("notification-box");
const closeBtn = document.getElementById("close-notification");
let dismissTimer = null;

function dismissNotification() {
  notificationBox.classList.add("fade-out");

  setTimeout(() => {
    notificationBox.style.display = "none";
  }, 250);
}

function showNotification(title, message, duration = 5000) {
  if (dismissTimer) clearTimeout(dismissTimer);

  notificationBox.querySelector(".notification-title").textContent = title;
  notificationBox.querySelector(".notification-message").textContent = message;

  notificationBox.style.display = "flex";
  notificationBox.classList.remove("fade-out");

  dismissTimer = setTimeout(() => {
    dismissNotification();
  }, duration);
}

// closeBtn.addEventListener("click", () => {
//   if (dismissTimer) clearTimeout(dismissTimer);
//   dismissNotification();
// });














window.addEventListener("load", async () => {
    await getUsernameAndBalance();
    await renderTransactions();
    await getTotalExpenses();
    await getTotalIncome();
    await updateSavings();
});


async function getUsernameAndBalance() {
  const response2 = await fetch("/expenses/user");
  const [userData] = await response2.json();
  const nameOutput = document.querySelector(".username");
  nameOutput.innerText = userData.username;
  document.getElementById("balance-display").textContent =
    `KSH ${userData.balance.split('.')[0]}`;
}


//Display Transactions From database

async function renderTransactions() {
  const tbody = document.getElementById("transaction-rows");
  const response1 = await fetch("/expenses");
  const transactions = await response1.json();
  tbody.innerHTML = transactions
    .map(
      (item) => `
    <tr>
    <td>${item.title}</td>
      <td>${item.category}</td>
      <td>${new Date(item.date).toLocaleDateString()}</td>
      <td>KSH ${Number(item.amount).toFixed(2)}</td>
    </tr>
  `,
    )
    .join("");
}

// // Send Money to database
document.getElementById("addBalanceBtn").addEventListener("click", async () => {
  const description = document.getElementById("depositInfo").value;
  const amount = document.getElementById("depositAmount").value;

  if (
    !description ||
    !amount ||
    description.trim() === "" ||
    amount.trim() === ""
  ) {
    showNotification("Error Occured", "Invalid Information...");
    dismissNotification();
    return;
  }
  const body = { description, amount };
  const response = await fetch("/expenses/topup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const message = await response.json();
  if (message[0].affectedRows > 0) {
    updateBalance();
    renderTransactions();
    getTotalExpenses();
    getTotalIncome();
    cancel();
    showNotification("Success", "Amount Added SuccessFully...");
  } else {
    showNotification("Error Occurred", "Something Went Wrong", 6000);
  }
});

async function getTotalExpenses() {
  const response1 = await fetch("/expenses/total");
  const totalAmount = await response1.json();

  document.getElementById("expensesTotal").textContent =
    `KSH ${totalAmount.total}`;
}

async function getTotalIncome() {
  const response = await fetch("/expenses/income");
  const totalIncome = await response.json();
  document.getElementById("incomeTotal").textContent =
    `KSH ${totalIncome.total}`;
}

//Send expense to database


//savings

async function updateSavings() {
  const response = await fetch("/savings");
  const savingsAmount = await response.json();
  document.getElementById("savingsTotal").textContent =
    `KSH ${savingsAmount.total_savings.split('.')[0]}`;
}
