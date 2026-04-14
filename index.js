const darkBtn = document.querySelector('.dark');
const body = document.body;
const inputContainer = document.querySelector('.input-container');
const inputMenu = document.querySelector('.input-menu');

let addvalue = 0;
const submitBtn = document.querySelector('#add-expenditure');


const category = document.querySelector('.first-transaction category');
const detailsContainer = document.querySelector('.first-transaction details');
const amountContainer = document.querySelector('.first-transaction amount');


const cont = document.querySelector('.input-container');
const cancelBtn = document.getElementById('cancelBtn');

// let contain = [];
// let inputValues = [];
// const remainingBalance = balance.value;




let i = localStorage.getItem('state');

if (i % 2 != 0) {
    body.classList.toggle('dark-mode');
}
darkBtn.addEventListener('click', function () {

    i++;
    localStorage.setItem('state', i);
    console.log(i);
    if (i % 2 == 0) {
        body.classList.toggle('dark-mode');
        darkBtn.innerHTML = '<i class="fa-solid fa-moon"></i> Dark';
    } else {
        body.classList.toggle('dark-mode');
        darkBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Light';
    }
})

function submitHistoryInfo() {
    inputContainer.style.display = 'block';
    inputContainer.style.opacity = '1';
}


function addHistoryInfo() {
    let selection = document.getElementById('choices');
    let details = document.getElementById('details');
    let amount = document.getElementById('amount');

    let selectionChoice = selection.value;
    let additionalInfo = details.value;
    let amountSpent = amount.value;


    let contain = [document.querySelector('.first-transaction.category'), document.querySelector('.first-transaction.details'), document.querySelector('.first-transaction.amount')];


    let inputValues = [selectionChoice, additionalInfo, amountSpent];
    if (additionalInfo == '' || amountSpent == '') {
        let errorMessage = document.createElement('h6');
        console.log(selectionChoice, amountSpent, additionalInfo)
        let timer = setInterval(function () {
            errorMessage.textContent = 'Fill all the inputs...';
            inputMenu.append(errorMessage);
        }, 1000);

        setTimeout(function () {
            clearInterval(timer);
            errorMessage.remove()
        }, 5000);


    } else {
        inputContainer.style.display = 'none';
        selectionChoice = '';
        additionalInfo = '';
        amountSpent = '';

        let k = 0;
        contain.forEach(container => {
            
            let tag = document.createElement('h5');
            console.log(container, inputValues[k]);
            tag.style.paddingBlock = '10px';
            tag.textContent = inputValues[k];
            container.append(tag);
            cont.style.display = 'none';
            k++;
        });
    }
}


// Add balance button

const addBalanceBtn = document.querySelector('.add-btn');
addBalanceBtn.addEventListener('mouseclick', function () {

    cont.style.display = 'block';
})


//Exit input container

function cancel() {
    cont.style.display = 'none';
}