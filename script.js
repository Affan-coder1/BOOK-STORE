
// Book Information
let books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
        price: 1200,
        stock: 10
    },
    {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        genre: "Self Help",
        price: 1500,
        stock: 8
    },
    {
        id: 3,
        title: "Harry Potter",
        author: "J.K. Rowling",
        genre: "Fantasy",
        price: 1800,
        stock: 12
    },
    {
        id: 4,
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        genre: "Finance",
        price: 1300,
        stock: 7
    },
    {
        id: 5,
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Fiction",
        price: 1000,
        stock: 9
    },
    {
        id: 6,
        title: "Ikigai",
        author: "Hector Garcia",
        genre: "Self Help",
        price: 1100,
        stock: 6
    }
];

let cart = [];

let orders = [];

let nextOrderId = 1;


function displayBooks(bookArray = books) {

    let bookList = document.getElementById("book-list");

    bookList.innerHTML = "";

    if (bookArray.length === 0) {
        bookList.innerHTML = "<p>No books found.</p>";
        return;
    }

    for (let i = 0; i < bookArray.length; i++) {

        let book = bookArray[i];

        let card = `
            <div class="book-card">

                <h3>${book.title}</h3>

                <p>Author: ${book.author}</p>

                <p>Genre: ${book.genre}</p>

                <p>Price: Rs. ${book.price}</p>

                <p>Available Stock: ${book.stock}</p>

                <button
                    onclick="addToCart(${book.id})"
                    ${book.stock === 0 ? "disabled" : ""}>
                    ${book.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>

            </div>
        `;

        bookList.innerHTML += card;
    }
}


function searchBooks() {

    let searchValue = document
        .getElementById("search")
        .value.toLowerCase()
        .trim();

    let filteredBooks = [];

    for (let i = 0; i < books.length; i++) {

        if (
            books[i].title.toLowerCase().includes(searchValue) ||
            books[i].author.toLowerCase().includes(searchValue) ||
            books[i].genre.toLowerCase().includes(searchValue)
        ) {
            filteredBooks.push(books[i]);
        }
    }

    displayBooks(filteredBooks);
}


function addToCart(id) {

    let selectedBook = books.find(book => book.id === id);

    if (!selectedBook) {
        alert("Book not found.");
        return;
    }

    let cartItem = cart.find(item => item.id === id);

    let quantityInCart = cartItem ? cartItem.quantity : 0;

    if (quantityInCart >= selectedBook.stock) {
        alert("Sorry! Not enough stock available.");
        return;
    }

    if (cartItem) {

        cartItem.quantity++;

    } else {

        cart.push({
            id: selectedBook.id,
            title: selectedBook.title,
            price: selectedBook.price,
            quantity: 1
        });

    }

    displayCart();

    alert("Book added to cart!");
}


function displayCart() {

    let cartList = document.getElementById("cart-list");

    cartList.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        cartList.innerHTML = "<p>Your cart is empty.</p>";
    }

    for (let i = 0; i < cart.length; i++) {

        let item = cart[i];

        let subtotal = item.price * item.quantity;

        total += subtotal;

        cartList.innerHTML += `
            <div class="cart-item">

                <h3>${item.title}</h3>

                <p>Price: Rs. ${item.price}</p>

                <p>Quantity: ${item.quantity}</p>

                <p>Subtotal: Rs. ${subtotal}</p>

                <button onclick="changeQuantity(${item.id}, -1)">
                    -
                </button>

                <button onclick="changeQuantity(${item.id}, 1)">
                    +
                </button>

                <button onclick="removeFromCart(${item.id})">
                    Remove
                </button>

            </div>
        `;
    }

    document.getElementById("total").innerText =
        "Total: Rs. " + total;
}


function changeQuantity(id, amount) {

    let item = cart.find(item => item.id === id);

    let book = books.find(book => book.id === id);

    if (!item || !book) {
        return;
    }

    let newQuantity = item.quantity + amount;

    if (newQuantity > book.stock) {
        alert("Not enough stock available.");
        return;
    }

    if (newQuantity <= 0) {
        removeFromCart(id);
        return;
    }

    item.quantity = newQuantity;

    displayCart();
}


function removeFromCart(id) {

    let index = cart.findIndex(item => item.id === id);

    if (index !== -1) {
        cart.splice(index, 1);
    }

    displayCart();
}

function clearCart() {

    if (cart.length === 0) {
        alert("Your cart is already empty.");
        return;
    }

    let confirmation = confirm(
        "Are you sure you want to clear the cart?"
    );

    if (confirmation) {

        cart = [];

        displayCart();
    }
}


function calculateBill() {

    let total = 0;

    for (let i = 0; i < cart.length; i++) {

        total += cart[i].price * cart[i].quantity;

    }

    return total;
}


function checkout() {

    let name = document.getElementById("name").value.trim();

    let address = document.getElementById("address").value.trim();

    let phone = document.getElementById("phone").value.trim();

    if (name === "" || address === "" || phone === "") {

        alert("Please fill all customer details.");

        return;
    }

    if (!/^[0-9+\-\s()]{7,20}$/.test(phone) ||
        phone.replace(/\D/g, "").length < 7) {

        alert("Please enter a valid phone number.");

        return;
    }

    if (cart.length === 0) {

        alert("Your shopping cart is empty.");

        return;
    }

    for (let i = 0; i < cart.length; i++) {

        let book = books.find(
            b => b.id === cart[i].id
        );

        if (!book || cart[i].quantity > book.stock) {

            alert("Some books are no longer available in the required quantity.");

            return;
        }
    }

    let bill = calculateBill();

    for (let i = 0; i < cart.length; i++) {

        let book = books.find(
            b => b.id === cart[i].id
        );

        book.stock -= cart[i].quantity;
    }

    let newOrder = {
        id: nextOrderId++,
        customer: name,
        address: address,
        phone: phone,
        items: cart.map(item => ({...item})),
        total: bill,
        status: "Pending"
    };

    orders.push(newOrder);

    alert(
        "Order placed successfully!\n" +
        "Your Bill: Rs. " + bill
    );

    cart = [];

    document.getElementById("name").value = "";

    document.getElementById("address").value = "";

    document.getElementById("phone").value = "";

    displayBooks();

    displayCart();

    displayOrders();
}


function displayOrders() {

    let orderList = document.getElementById("order-list");

    orderList.innerHTML = "";

    if (orders.length === 0) {

        orderList.innerHTML = "<p>No orders placed yet.</p>";

        return;
    }

    for (let i = 0; i < orders.length; i++) {

        let order = orders[i];

        let bookDetails = "";

        for (let j = 0; j < order.items.length; j++) {

            bookDetails += `
                <p>
                    ${order.items[j].title}
                    - Quantity: ${order.items[j].quantity}
                </p>
            `;
        }

        orderList.innerHTML += `
            <div class="order-card">

                <h3>Order #${order.id}</h3>

                <p>Customer: ${order.customer}</p>

                <p>Address: ${order.address}</p>

                <p>Phone: ${order.phone}</p>

                <h4>Books:</h4>

                ${bookDetails}

                <p>Total Bill: Rs. ${order.total}</p>

                <p>Status: ${order.status}</p>

                ${
                    order.status === "Pending"
                    ?
                    `<button onclick="cancelOrder(${order.id})">
                        Cancel Order
                    </button>`
                    :
                    ""
                }

            </div>
        `;
    }
}


function cancelOrder(id) {

    let order = orders.find(order => order.id === id);

    if (!order) {
        alert("Order not found.");
        return;
    }

    if (order.status !== "Pending") {

        alert("This order cannot be cancelled.");

        return;
    }

    let confirmation = confirm(
        "Are you sure you want to cancel this order?"
    );

    if (!confirmation) {
        return;
    }

    // Restore Book Stock
    for (let i = 0; i < order.items.length; i++) {

        let book = books.find(
            b => b.id === order.items[i].id
        );

        if (book) {
            book.stock += order.items[i].quantity;
        }
    }

    order.status = "Cancelled";

    alert("Order cancelled successfully!");

    displayBooks();

    displayOrders();
}


displayBooks();

displayCart();

displayOrders();
