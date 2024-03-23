// Import itens
const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartCounter = document.getElementById('cart-count');
const inputAddress = document.getElementById('address');
const addressWarn = document.getElementById('address-warn');

// Set Cart to empty
let cart = [];

// Open modal cart
cartBtn.addEventListener('click', () => {
    updateCartModal(); // Function for update modal cart
    cartModal.style.display = 'flex'; // Set display modal for flex
})

// Close modal cart
cartModal.addEventListener('click', (e) => { 
    if(e.target === cartModal || e.target === closeModalBtn){ // If target equal cart modal or button close cart modal:
       cartModal.style.display = 'none';  // : Set display modal for none
    }
})

// Add to cart
menu.addEventListener('click', (e) => {
    let parentButton = e.target.closest('.add-to-cart-btn'); // Set button parent for button add to cart
    if(parentButton){ // If parent button
        // Seting name and price of itens
        const name = parentButton.getAttribute('data-name');
        const price = parseFloat(parentButton.getAttribute('data-price'));

        //Add in the cart, name and price
        addToCart(name, price)
    }
})

// Function for add to cart
function addToCart(name, price){
    
    // Seting existing item
    const existingItem = cart.find(item => item.name === name)
    
    // If item already exist
    if(existingItem){
        // Quantity - 1
        existingItem.quantity++;
    }else { // Else, add name, price, and quantity + 1
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal() // Update modal

}

// Function for update modal
function updateCartModal(){
    // Cart itens container
    cartItemsContainer.innerHTML = '';
    // Set total to 0
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('flex','justify-between','mb-4','flex-col')

        //Cria a estrutura do Modal do carrinho
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between mt-2">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$${item.price.toFixed(2)}</p>
                </div>

                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        `

        total += item.price * item.quantity;   
        
        cartItemsContainer.appendChild(cartItemElement);

    })

    cartTotal.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    cartCounter.innerText = cart.length;

}

//Funcao para remover item do carrinho
cartItemsContainer.addEventListener('click', (e) => {
    if(e.target.classList.contains('remove-from-cart-btn')){
        const name = e.target.getAttribute('data-name');

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity--;
            updateCartModal();
            return;
        }
        
        cart.splice(index, 1);
        updateCartModal();
    }   
}

inputAddress.addEventListener('input', (e) => {
    let inputValue = e.target.value;

    if(inputValue !== ''){
        inputAddress.classList.remove('border-red-500');
        addressWarn.classList.add('hidden');
    }
})

// Finalizar
checkoutBtn.addEventListener('click', () => {

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "O restaurante está fechado no momento!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            background: "#ef4444",
            }
        }).showToast();

        return;
    }

    if(cart.length === 0) return;
    if(inputAddress.value === ''){
        addressWarn.classList.remove('hidden');
        inputAddress.classList.add('border-red-500');
        return;
    }

    // Enviar o pedido para a api wpp
    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("");

    const message = encodeURIComponent(cartItems);
    const phone = '15998888678'

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${inputAddress.value}`, '_blank');

    cart = [];
    updateCartModal();
})

// Verificar a hora e manipular o horario
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22; // Return true
}

const spanItem = document.getElementById('date-span');
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove('bg-red-500');
    spanItem.classList.add('bg-green-600');
} else{
    spanItem.classList.remove('bg-green-600');
    spanItem.classList.add('bg-red-500');
}




