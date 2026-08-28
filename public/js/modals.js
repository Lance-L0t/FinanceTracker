/* =========================================
   ADD TRANSACTION MODAL
========================================= */

const transactionModal = document.getElementById("transactionModal");

const openTransactionModal = document.getElementById("openTransactionModal");

const closeTransactionModal = document.getElementById("closeTransactionModal");

const cancelTransaction = document.getElementById("cancelTransaction");

/* Open transaction modal */
if (openTransactionModal) {
  openTransactionModal.addEventListener("click", () => {
    transactionModal.classList.add("active");
  });
}

/* Close transaction modal */
if (closeTransactionModal) {
  closeTransactionModal.addEventListener("click", () => {
    closeTransaction();
  });
}

/* Cancel transaction button */
if (cancelTransaction) {
  cancelTransaction.addEventListener("click", () => {
    closeTransaction();
  });
}

function closeTransaction() {
  transactionModal.classList.remove("active");

  document.getElementById("transactionForm").reset();
}

/* =========================================
   ADD MONEY MODAL
========================================= */

const moneyModal = document.getElementById("moneyModal");

const openMoneyModal = document.getElementById("openMoneyModal");

const closeMoneyModal = document.getElementById("closeMoneyModal");

const cancelMoney = document.getElementById("cancelMoney");

/* Open add money modal */
if (openMoneyModal) {
  openMoneyModal.addEventListener("click", () => {
    moneyModal.classList.add("active");
  });
}

/* Close add money modal */
if (closeMoneyModal) {
  closeMoneyModal.addEventListener("click", () => {
    closeMoney();
  });
}

/* Cancel add money button */
if (cancelMoney) {
  cancelMoney.addEventListener("click", () => {
    closeMoney();
  });
}

function closeMoney() {
  moneyModal.classList.remove("active");

  document.getElementById("moneyForm").reset();
}

/* =========================================
   CLOSE WHEN CLICKING OUTSIDE
========================================= */

if (transactionModal) {
  transactionModal.addEventListener("click", (event) => {
    if (event.target === transactionModal) {
      closeTransaction();
    }
  });
}

if (moneyModal) {
  moneyModal.addEventListener("click", (event) => {
    if (event.target === moneyModal) {
      closeMoney();
    }
  });
}

/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (transactionModal && transactionModal.classList.contains("active")) {
      closeTransaction();
    }

    if (moneyModal && moneyModal.classList.contains("active")) {
      closeMoney();
    }
  }
});

/* =========================================
   ADD TRANSACTION MODAL
========================================= */

// const transactionModal = document.getElementById("transactionModal");

// const openTransactionModal = document.getElementById("openTransactionModal");

// const closeTransactionModal = document.getElementById("closeTransactionModal");

// const cancelTransaction = document.getElementById("cancelTransaction");

/* Open transaction modal */
if (openTransactionModal) {
  openTransactionModal.addEventListener("click", () => {
    transactionModal.classList.add("active");
  });
}

/* Close transaction modal */
if (closeTransactionModal) {
  closeTransactionModal.addEventListener("click", () => {
    closeTransaction();
  });
}

/* Cancel transaction button */
if (cancelTransaction) {
  cancelTransaction.addEventListener("click", () => {
    closeTransaction();
  });
}

function closeTransaction() {
  transactionModal.classList.remove("active");

  document.getElementById("transactionForm").reset();
}

/* =========================================
   ADD MONEY MODAL
========================================= */

// const moneyModal = document.getElementById("moneyModal");

// const openMoneyModal = document.getElementById("openMoneyModal");

// const closeMoneyModal = document.getElementById("closeMoneyModal");

// const cancelMoney = document.getElementById("cancelMoney");

/* Open add money modal */
if (openMoneyModal) {
  openMoneyModal.addEventListener("click", () => {
    moneyModal.classList.add("active");
  });
}

/* Close add money modal */
if (closeMoneyModal) {
  closeMoneyModal.addEventListener("click", () => {
    closeMoney();
  });
}

/* Cancel add money button */
if (cancelMoney) {
  cancelMoney.addEventListener("click", () => {
    closeMoney();
  });
}

function closeMoney() {
  moneyModal.classList.remove("active");

  document.getElementById("moneyForm").reset();
}

/* =========================================
   CLOSE WHEN CLICKING OUTSIDE
========================================= */

if (transactionModal) {
  transactionModal.addEventListener("click", (event) => {
    if (event.target === transactionModal) {
      closeTransaction();
    }
  });
}

if (moneyModal) {
  moneyModal.addEventListener("click", (event) => {
    if (event.target === moneyModal) {
      closeMoney();
    }
  });
}

/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (transactionModal && transactionModal.classList.contains("active")) {
      closeTransaction();
    }

    if (moneyModal && moneyModal.classList.contains("active")) {
      closeMoney();
    }
  }
});
/* =========================================
   SUBMIT ADD TRANSACTION
========================================= */

const transactionForm = document.getElementById("transactionForm");

if (transactionForm) {
  transactionForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const category = document.getElementById("transactionCategory").value;

    const description = document
      .getElementById("transactionDescription")
      .value.trim();

    const amount = document.getElementById("transactionAmount").value;

    /* Validate transaction information */

    if (!category || !description || !amount || Number(amount) <= 0) {
      if (typeof showNotification === "function") {
        showNotification(
          "Invalid Information",
          "Please enter valid transaction information.",
        );
      }

      return;
    }

    try {
      const response = await fetch("/expenses/newExpense", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          category,
          description,
          amount,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add transaction");
      }

      /* Transaction successfully added */

      closeTransaction();

      if (typeof showNotification === "function") {
        showNotification(
          "Transaction Added",
          "Your transaction was added successfully.",
        );
      }

      /*
       * Refresh transaction table if the function exists.
       */

      if (typeof renderTransactions === "function") {
        renderTransactions();
      }

      /*
       * Refresh dashboard balance if available.
       */

      if (typeof getUsernameAndBalance === "function") {
        getUsernameAndBalance();
      }

      /*
       * Refresh expense total if available.
       */

      if (typeof getTotalExpenses === "function") {
        getTotalExpenses();
      }
    } catch (error) {
      console.error("Add transaction error:", error);

      if (typeof showNotification === "function") {
        showNotification("Error", "Unable to add the transaction.");
      }
    }
  });
}
