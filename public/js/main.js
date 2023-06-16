document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('expense-form');
  const expenseList = document.getElementById('expense-list');

  form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get the form values
    const amountInput = document.getElementById('amount');
    const descriptionInput = document.getElementById('description');
    const dateInput = document.getElementById('date');

    const amount = amountInput.value.trim();
    const description = descriptionInput.value.trim();
    const date = dateInput.value;

    // Validate the form values
    if (amount === '' || description === '' || date === '') {
      alert('Please enter amount, description, and date');
      return;
    }

    // Check if there is an active expense being edited
    const activeExpenseId = form.getAttribute('data-edit-id');
    if (activeExpenseId) {
      // Update the expense item with the new values
      const expenseItem = document.querySelector(`[data-id="${activeExpenseId}"]`);
      if (expenseItem) {
        const updatedExpense = {
          amount: parseFloat(amount),
          description,
          date
        };

        try {
          // Send the updated expense data to the server
          const response = await fetch(`/expenses/${activeExpenseId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedExpense)
          });

          if (response.ok) {
            // Update the expense item in the DOM
            expenseItem.querySelector('.amount').innerText = amount;
            expenseItem.querySelector('.description').innerText = description;
            expenseItem.querySelector('.date').innerText = date;

            // Clear the form fields and remove the active expense ID attribute
            amountInput.value = '';
            descriptionInput.value = '';
            dateInput.value = '';
            form.removeAttribute('data-edit-id');
          } else {
            console.error('Error:', response.status);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    } else {
      // Create a new expense
      const expense = {
        amount: parseFloat(amount),
        description,
        date
      };

      try {
        // Send the expense data to the server
        const response = await fetch('/expenses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(expense)
        });

        if (response.ok) {
          // Add the new expense to the expense list
          const newExpense = await response.json();
          const expenseItem = createExpenseItem(newExpense);
          expenseList.appendChild(expenseItem);
        } else {
          console.error('Error:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  });

  // Helper function to create an expense item element
  function createExpenseItem(expense) {
    const listItem = document.createElement('li');
    listItem.setAttribute('data-id', expense.id);
    listItem.innerHTML = `
      <span class="amount">${expense.amount}</span>
      <span class="description">${expense.description}</span>
      <span class="date">${expense.date}</span>
      <button class="edit-button" data-id="${expense.id}">Edit</button>
      <button class="delete-button" data-id="${expense.id}">Delete</button>
    `;

    // Add event listener to the edit button
    const editButton = listItem.querySelector('.edit-button');
    editButton.addEventListener('click', () => {
      // Populate the form with the expense details for editing
      const amountInput = document.getElementById('amount');
      const descriptionInput = document.getElementById('description');
      const dateInput = document.getElementById('date');

      amountInput.value = expense.amount;
      descriptionInput.value = expense.description;
      dateInput.value = expense.date;

      // Set the active expense ID attribute on the form
      form.setAttribute('data-edit-id', expense.id);
    });

    return listItem;
  }

  // Fetch existing expenses and display them on page load
  async function fetchExpenses() {
    try {
      const response = await fetch('/expenses');

      if (response.ok) {
        const expenses = await response.json();

        expenses.forEach(expense => {
          const expenseItem = createExpenseItem(expense);
          expenseList.appendChild(expenseItem);
        });
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  fetchExpenses();

  // Event delegation for delete expense button clicks
  expenseList.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-button')) {
      const expenseId = event.target.dataset.id;

      try {
        const response = await fetch(`/expenses/${expenseId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          // Remove the expense item from the DOM
          event.target.parentElement.remove();
        } else {
          console.error('Error:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  });
});
