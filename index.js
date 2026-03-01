const darkBtn = document.querySelector('.dark');
const body = document.body;
const transactionContainer = document.querySelector('.transaction-history');

let addvalue = 0;
const addHistoryBtn = document.getElementById('add-expenditure');




let i = localStorage.getItem('state');
console.log('local storage = ',i);

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
