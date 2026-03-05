const darkBtn = document.querySelector('.dark');
const body = document.body;
const inputContainer = document.querySelector('.input-container');
const inputMenu = document.querySelector('.input-menu');

let addvalue = 0;
const submitBtn = document.querySelector('#add-expenditure');
const selection = document.getElementById('choices');
const details = document.getElementById('details');
const amount = document.getElementById('amount');
const balance = document.getElementById('balance');

const category = document.querySelector('.first-transaction category');
const detailsContainer = document.querySelector('.first-transaction details');
const amountContainer = document.querySelector('.first-transaction amount');
const balanceContainer = document.querySelector('.first-transaction balance');

const containers = [category , detailsContainer , amountContainer , balanceContainer];

let i = localStorage.getItem('state');

if (i % 2 != 0) {
    body.classList.toggle('dark-mode');
}
darkBtn.addEventListener('click', function(){

    i++;
    localStorage.setItem('state', i);
    console.log(i);
    if(i % 2 == 0){
        body.classList.toggle('dark-mode');
        darkBtn.innerHTML = '<i class="fa-solid fa-moon"></i> Dark';
    }else{
        body.classList.toggle('dark-mode');
        darkBtn.innerHTML = '<i class="fa-solid fa-sun"></i> Light';
    }
})

function submitHistoryInfo(){
    inputContainer.style.display = 'block';
    inputContainer.style.opacity = '1';
}


function addHistoryInfo(){

    const selectionChoice = selection.value;
    const additionalInfo = details.value;
    const amountSpent = amount.value;
    const remainingBalance = balance.value;

    const inputValues = [selectionChoice , additionalInfo, amountSpent , remainingBalance];

    if (additionalInfo == '' && amountSpent == '' && remainingBalance == '') {
        let errorMessage = document.createElement('h6');
        let timer = setInterval(function(){
            errorMessage.textContent = 'Fill all the inputs...';
            inputMenu.append(errorMessage);
        }, 1000);

        setTimeout(function(){
            clearInterval(timer);
            errorMessage.remove()
        }, 5000);
        

    } else {
        inputContainer.style.display = 'none';
        updateHistory();
        
}
}

function updateHistory(){
    let tag = document.createElement('h5');

}

// Add balance button

const addBalanceBtn = document.querySelector('.add-btn');
addBalanceBtn.addEventListener('mouseclick', function(){

    const btnContainer = document.querySelector('.add-balance-menu');

    btnContainer.style.display = 'flex';
})