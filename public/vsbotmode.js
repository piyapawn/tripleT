const colA = document.querySelectorAll(`.cell`);
colA.forEach(cell => cell.addEventListener('click', clicktable));

function clicktable(event){
    const tableID = event.currentTarget.getAttribute('id');
    const checkVal = event.currentTarget.innerHTML;
    console.log(tableID)
    if(checkVal == ``){
        event.currentTarget.innerHTML = 'X';
    }
}