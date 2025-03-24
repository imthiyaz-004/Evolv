// budget.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('budget-form');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const typeSelect = document.getElementById('type');
    const transactionList = document.getElementById('transaction-list');
    const totalIncomeDisplay = document.getElementById('total-income');
    const totalExpensesDisplay = document.getElementById('total-expenses');
    const netBalanceDisplay = document.getElementById('net-balance');

    let totalIncome = 0;
    let totalExpenses = 0;

    // Function to update the budget summary
    function updateBudgetSummary() {
        totalIncomeDisplay.textContent = totalIncome.toFixed(2);
        totalExpensesDisplay.textContent = totalExpenses.toFixed(2);
        const netBalance = totalIncome - totalExpenses;
        netBalanceDisplay.textContent = netBalance.toFixed(2);
    }

    // Function to add a transaction
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission

        const description = descriptionInput.value.trim();
        const amount = parseFloat(amountInput.value.trim());
        const type = typeSelect.value;

        if (description && !isNaN(amount)) {
            const listItem = document.createElement('li');
            listItem.textContent = `${description}: $${amount.toFixed(2)}`;

            // Apply different styles based on the transaction type
            if (type === 'income') {
                listItem.style.color = '#2e7d32'; // Dark green text
                listItem.style.backgroundColor = '#c8e6c9'; // Light green background
                totalIncome += amount; // Update total income
            } else if (type === 'expense') {
                listItem.style.color = '#c62828'; // Dark red text
                listItem.style.backgroundColor = '#ffcdd2'; // Light red background
                totalExpenses += amount; // Update total expenses
            }

            // Append the transaction to the list
            transactionList.appendChild(listItem);

            // Update the budget summary
            updateBudgetSummary();

            // Clear the input fields
            descriptionInput.value = '';
            amountInput.value = '';
            typeSelect.value = 'income'; // Reset to default
        }
    });
});
