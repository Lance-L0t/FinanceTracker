window.addEventListener("load", async () => {
  const tableBody = document.getElementById("tableBody");

  const response = await fetch("/expenses");
  const transactions = await response.json();

  tableBody.innerHTML = transactions
    .map(
      (item) =>
        `<tr><td>
                      <div class="transaction-name">
                        <div class="transaction-icon">
                          <i class="fa-solid fa-utensils"></i>
                        </div>

                        <div>
                          <strong> ${item.description} </strong>

                          <small> ${item.description} </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span class="badge ${
                      item.category.toLowerCase() === "income" ? "success" : "primary"
                    }"> ${item.category} </span>
                    </td>

                    <td>${new Date(item.date).toLocaleDateString()}</td>

                    <td class=" ${
                      item.category.toLowerCase() === "income" ? "income" : "expense"
                    }">${
                      item.category.toLowerCase() === "income" ? "+" : "-"
                    }${item.amount}</td>

                    <td>
                      <span class="badge success"> Completed </span>
                    </td>

                    <td>
                      <button class="icon-btn">
                        <i class="fa-solid fa-ellipsis"></i>
                      </button>
                    </td></tr>`,
    )
    .join("");
});


document.getElementById('categoryMenu').addEventListener('change', async () => {
  const category = document.getElementById('categoryMenu').value;
const tableBody = document.getElementById("tableBody");
tableBody.innerHTML = "";
  const response = await fetch(`/expenses/filter/${category}`);
  const transactions = await response.json();
  tableBody.innerHTML = transactions
    .map(
      (item) =>
        `<tr><td>
                      <div class="transaction-name">
                        <div class="transaction-icon">
                          <i class="fa-solid fa-utensils"></i>
                        </div>

                        <div>
                          <strong> ${item.description} </strong>

                          <small> ${item.description} </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span class="badge ${
                      item.category.toLowerCase() === "income" ? "success" : "primary"
                    }"> ${item.category} </span>
                    </td>

                    <td>${new Date(item.date).toLocaleDateString()}</td>

                    <td class=" ${
                      item.category.toLowerCase() === "income" ? "income" : "expense"
                    }">${
                      item.category.toLowerCase() === "income" ? "+" : "-"
                    }${item.amount}</td>

                    <td>
                      <span class="badge success"> Completed </span>
                    </td>

                    <td>
                      <button class="icon-btn">
                        <i class="fa-solid fa-ellipsis"></i>
                      </button>
                    </td></tr>`,
    )
    .join("");
})

document.getElementById('transactionType').addEventListener('change', async () => {
  const category = document.getElementById('transactionType').value;
const tableBody = document.getElementById("tableBody");
tableBody.innerHTML = "";
  const response = await fetch(`/expenses/filter/${category}`);
  const transactions = await response.json();

  tableBody.innerHTML = transactions
    .map(
      (item) =>
        `<tr><td>
                      <div class="transaction-name">
                        <div class="transaction-icon">
                          <i class="fa-solid fa-utensils"></i>
                        </div>

                        <div>
                          <strong> ${item.title} </strong>

                          <small> ${item.description} </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span class="badge ${
                      item.category.toLowerCase() === "income" ? "success" : "primary"
                    }"> ${item.category} </span>
                    </td>

                    <td>${new Date(item.date).toLocaleDateString()}</td>

                    <td class=" ${
                      item.category.toLowerCase() === "income" ? "income" : "expense"
                    }">${
                      item.category.toLowerCase() === "income" ? "+" : "-"
                    }${item.amount}</td>

                    <td>
                      <span class="badge success"> Completed </span>
                    </td>

                    <td>

    <!-- FUNCTION: Open transaction actions menu -->
    <div class="transaction-actions">

        <button class="icon-btn transaction-menu-btn">
            <i class="fa-solid fa-ellipsis"></i>
        </button>

        <div class="transaction-dropdown">

            <!-- FUNCTION: Edit selected transaction -->
            <button class="edit-btn">
                <i class="fa-solid fa-pen"></i>
                Edit
            </button>

            <!-- FUNCTION: Delete selected transaction -->
            <button class="delete-btn">
                <i class="fa-solid fa-trash"></i>
                Delete
            </button>

        </div>

    </div>

</td></tr>`,
    )
    .join("");
})



document.getElementById("expenseBtn").addEventListener("click", async () => {
  const category = document.getElementById("choices").value;
  const description = document.getElementById("details").value;
  const amount = document.getElementById("amount").value;

  if (
    !category ||
    category.trim() === ''||
    !description ||
    !amount ||
    description.trim() === "" ||
    Number.isNaN(amount)
  ) {
    showNotification("Error Occured", "Invalid Information...");
    return;
  }

  const body = { category, description, amount };

  try {
    let response = await fetch("/expenses/newExpense", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    response = await response.json();
    showNotification("Success", "Added new expense");
    getTotalExpenses();
    getUsernameAndBalance()
  } catch (error) {
    console.log(error);
  }
});