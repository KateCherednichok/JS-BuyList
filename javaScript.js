let products = [];
let oldName = "";
//localStorage.clear();
const allProducts = localStorage.getItem('product')
    ? JSON.parse(localStorage.getItem('product'))
    : [
            { name: 'Помідори', amount: '1', added: false },
            { name: 'Печиво', amount: '1', added: false },
            { name: 'Сир', amount: '1', added: true }
    ];
allProducts.forEach(product => draw(product));

function draw(element){
        products.push(element.name.toUpperCase());

        const hElement = document.createElement('hr');
        document.querySelector('.add-product').appendChild(hElement);
        const lineItem = document.createElement('section');
        lineItem.classList.add('line');
        if(element.added){
            lineItem.innerHTML = createProductAdded(element.name, element.amount);
            createProductDown(element.name, element.amount);
        }
        else if (element.amount === '1'){
            lineItem.innerHTML = createProductOnlyOne(element.name);
            createProductUp(element.name, element.amount);
        }
        else {
            lineItem.innerHTML = createProduct(element.name, element.amount);
            createProductUp(element.name, element.amount)
        }
        document.querySelector('.add-product').appendChild(lineItem);
}

document.querySelector('.add').addEventListener('click',function () {
    addFromPage();
});

document.querySelector('.to-add').addEventListener('keydown', function (event){
    if(event.key === 'Enter'){
        addFromPage();
    }
})
function addFromPage() {
    let productName = document.querySelector('.to-add').value;
    productName = productName.charAt(0).toUpperCase() + productName.slice(1).toLowerCase();
    if (productName.trim() !== '') {
        if (products.includes(productName.toUpperCase())) {
            alert('Цей товар вже доданий!');
        }
        else {
            const lineItem = document.createElement('section');
            lineItem.classList.add('line');
            lineItem.innerHTML = createProductOnlyOne(productName);

            const hElement = document.createElement('hr');
            document.querySelector('.add-product').appendChild(hElement);

            document.querySelector('.add-product').appendChild(lineItem);
            createProductUp(productName, 1);

            products.push(productName.toUpperCase());
            addProductInStorage(productName);
        }
    }
    document.querySelector('.to-add').value = '';
    document.querySelector('.to-add').focus();
}

function plus(target) {
    let value = target.previousElementSibling;
    value.textContent++;
    let product = target.parentElement.previousElementSibling.textContent;
    let productItem = findElement(product);
    productItem.lastChild.textContent++;
    changeAmountInStorage(product, value.textContent);
    if(value.textContent==='2') {
        target.previousElementSibling.previousElementSibling.classList.remove('disabled');
    }
}

function minus(target){
    let value = target.nextElementSibling;
    value.textContent--;
    let product = target.parentElement.previousElementSibling.textContent;
    let productItem = findElement(product);
    productItem.lastChild.textContent--;
    changeAmountInStorage(product, value.textContent);
    if(value.textContent==='1') {
        target.classList.add('disabled');
    }
}

function findElement(name){
    let productsFromRight = document.getElementsByClassName('product-item');
    for(let i=0; i<productsFromRight.length; i++){
        if(productsFromRight[i].firstChild.textContent===name)
            return productsFromRight[i];
    }
}
document.addEventListener("focusout",function (event){
    if (event.target.className==='product-item-to-add'&&event.target.className!=='added'){
        let newName=event.target.textContent;
        if (newName!=='') {
            if (products.includes(newName.toUpperCase())) {
                event.target.textContent=oldName;
            }
            else {
                newName = newName.charAt(0).toUpperCase() + newName.slice(1).toLowerCase();
                findElement(oldName).firstChild.textContent = newName;
                event.target.textContent=newName;
                changeNameInStorage(newName);
            }
        }
    }
})

document.addEventListener('click', function (event) {
    let click = event.target;

    if (click.tagName === 'BUTTON') {
        if (click.className === "minus") {
          minus(click);
        } else if (click.className === "plus") {
            plus(click);
        } else if (click.className === "delete") {
          deleteFromList(click);
        } else if (click.className === "add-to-list") {
            if(click.id === 'not-bought'){
                returnToAdd(click);
            }
            else {
                moveToAdded(click);
            }
        }
    } else if (click.tagName === 'SPAN') {
        oldName = click.textContent;
    }
});

function returnToAdd(target){
    target.classList.add('blocked');
    target.previousElementSibling.classList.remove('blocked');
    target.previousElementSibling.previousElementSibling.classList.remove('blocked');

    let lineWithNumber = target.parentElement.previousElementSibling;
    lineWithNumber.firstElementChild.classList.remove('hidden');

    let amountProduct = lineWithNumber.firstElementChild.nextElementSibling.textContent;

    if(amountProduct > '1'){
        lineWithNumber.firstElementChild.classList.remove('disabled');
    }
    lineWithNumber.lastElementChild.classList.remove('hidden');
    lineWithNumber.previousElementSibling.classList.remove('added');
    lineWithNumber.previousElementSibling.setAttribute('contenteditable', 'true');

    let nameProduct = lineWithNumber.previousElementSibling.textContent;
    findElement(nameProduct).remove();

    createProductUp(nameProduct, amountProduct);
    changeStatusInStorage(nameProduct);
}

function  moveToAdded(target){
    target.classList.add('blocked');
    target.nextElementSibling.classList.add('blocked');
    target.nextElementSibling.nextElementSibling.classList.remove('blocked');
    let lineWithNumber = target.parentElement.previousElementSibling;
    lineWithNumber.firstElementChild.classList.add('hidden');
    lineWithNumber.lastElementChild.classList.add('hidden');
    lineWithNumber.previousElementSibling.classList.add('added');
    lineWithNumber.previousElementSibling.setAttribute('contenteditable', 'false');
    let nameProduct = lineWithNumber.previousElementSibling.textContent;
    findElement(nameProduct).remove();

    createProductDown(nameProduct, lineWithNumber.firstElementChild.nextElementSibling.textContent);
    changeStatusInStorage(nameProduct);
}

function deleteFromList(target){
    let nameForDelete = target.parentElement.parentElement.firstElementChild.textContent;
    let forDelete = target.parentElement.parentElement;
    findElement(nameForDelete).remove();
    forDelete.previousElementSibling.remove();
    forDelete.remove();
    console.log(products);
    removeFromStorage(nameForDelete);
    console.log(products);
}

function createProductAdded(name, amount){
    return `
                <span class="product-item-to-add added">${name}</span>
                <div class="amount-number">
                    <button type="button" class="minus disabled hidden" data-tooltip="Зменшити">−</button>
                    <span class="amount-to-add">${amount}</span>
                    <button type="button" class="plus hidden" data-tooltip="Збільшити">+</button>
                </div>
                <div class="button">
                    <button type="button" class="add-to-list blocked" data-tooltip="Придбати">Куплено</button>
                    <button type="button" class="delete blocked" data-tooltip="Видалити">×</button>
                    <button type="button" class="add-to-list" id="not-bought" data-tooltip="Прибрати з кошика">Не куплено</button>
                </div>
            `
}

function createProductOnlyOne(name){
    return `
                <span class="product-item-to-add" contenteditable="true">${name}</span>
                <div class="amount-number">
                    <button type="button" class="minus disabled" data-tooltip="Зменшити">−</button>
                    <span class="amount-to-add">1</span>
                    <button type="button" class="plus" data-tooltip="Збільшити">+</button>
			    </div>
                <div class="button">
                    <button type="button" class="add-to-list" data-tooltip="Придбати">Куплено</button>
                    <button type="button" class="delete" data-tooltip="Видалити">×</button>
                    <button type="button" class="add-to-list blocked" id="not-bought" data-tooltip="Прибрати з кошика">Не куплено</button>
                </div>
            `
}

function createProduct(name, amount){
    return`
            <span class="product-item-to-add" contenteditable="true">${name}</span>
			<div class="amount-number">
				<button type="button" class="minus" data-tooltip="Зменшити">−</button>
				<span class="amount-to-add">${amount}</span>
				<button type="button" class="plus" data-tooltip="Збільшити">+</button>
			</div>
			<div class="button">
				<button type="button" class="add-to-list" data-tooltip="Придбати">Куплено</button>
				<button type="button" class="delete" data-tooltip="Видалити">×</button>
				<button type="button" class="add-to-list blocked" id="not-bought" data-tooltip="Прибрати з кошика">Не куплено</button>
			</div>
            `
}

function createProductUp(name, amount){
    const listItem = document.createElement('span');
    listItem.classList.add('product-item');
    listItem.textContent = name;

    const amountSpan = document.createElement('span');
    amountSpan.classList.add('amount');
    amountSpan.textContent = amount;

    listItem.appendChild(amountSpan);
    document.querySelector('.list').appendChild(listItem);
}

function createProductDown(name, amount){
    const listItem = document.createElement('span');
    listItem.classList.add('product-item');
    listItem.classList.add('added');
    listItem.textContent = name;

    const amountSpan = document.createElement('span');
    amountSpan.classList.add('amount');
    amountSpan.classList.add('added');
    amountSpan.textContent = amount;

    listItem.appendChild(amountSpan);
    document.querySelector('.already-bought').appendChild(listItem);
}

function changeAmountInStorage(name, newAmount) {
    for (let i = 0; i < allProducts.length; i++) {
        if (allProducts[i].name === name) {
            allProducts[i].amount = newAmount;
            localStorage.setItem("product", JSON.stringify(allProducts));
            break;
        }
    }
}
function removeFromStorage(name) {
    for (let i = 0; i < allProducts.length; i++) {
        if (allProducts[i].name === name) {
            allProducts.splice(i,1);
            break;
        }
    }
    for (let i = 0; i < products.length; i++) {
        if (products[i] === name.toUpperCase()) {
            products.splice(i,1);
            break;
        }
    }
    localStorage.setItem("product", JSON.stringify(allProducts));
}

function changeStatusInStorage(name) {
    for (let i = 0; i < allProducts.length; i++) {
        if (allProducts[i].name === name) {
            allProducts[i].added = !allProducts[i].added;
            break;
        }
    }
    localStorage.setItem("product", JSON.stringify(allProducts));
}

function changeNameInStorage(newName) {
    newName = newName.charAt(0).toUpperCase() + newName.slice(1).toLowerCase();

    for (let i = 0; i < allProducts.length; i++) {
        if (allProducts[i].name === oldName) {
            allProducts[i].name = newName;
            break;
        }
        for (let i = 0; i < products.length; i++) {
            if (products[i] === oldName.toUpperCase()) {
                products[i] = newName.toUpperCase();
                break;
            }
        }
    }
    localStorage.setItem("product", JSON.stringify(allProducts));
}

function addProductInStorage(name) {
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    let obj = {
        name,
        amount: '1',
        added: false,
    };
    allProducts.push(obj);
    localStorage.setItem("product", JSON.stringify(allProducts));
}


