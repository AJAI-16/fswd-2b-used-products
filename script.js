
/* Sample products for the website */
var defaultProducts = [
    {
        id: 1,
        name: "Used Smartphone",
        price: 5000,
        category: "Electronics",
        description: "Good condition smartphone.",
        seller: "Arun",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"
    },
    {
        id: 2,
        name: "Study Table",
        price: 2500,
        category: "Furniture",
        description: "Wooden study table in good condition.",
        seller: "Priya",
        image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?w=500"
    },
    {
        id: 3,
        name: "Used Books",
        price: 500,
        category: "Books",
        description: "Collection of educational books.",
        seller: "Kumar",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500"
    },
    {
        id: 4,
        name: "Used Bicycle",
        price: 3500,
        category: "Vehicles",
        description: "Bicycle in good working condition.",
        seller: "Ravi",
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500"
    }
];

/* Load saved products or show sample products */
var products = JSON.parse(localStorage.getItem("products"));

if (products === null) {
    products = defaultProducts;
    saveProducts();
}

var selectedProduct = null;

/* Save products in browser storage */
function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

/* Display products */
function displayProducts(productArray) {
    var productList = document.getElementById("productList");

    productList.innerHTML = "";

    if (productArray.length === 0) {
        productList.textContent = "No products found.";
        return;
    }

    productArray.forEach(function(product) {
        var card = document.createElement("div");
        card.className = "product-card";

        var image = document.createElement("img");
        image.src = product.image || "https://placehold.co/400x250?text=No+Image";
        image.alt = product.name;
        image.onerror = function() {
            this.onerror = null;
            this.src = "https://placehold.co/400x250?text=No+Image";
        };

        var name = document.createElement("h3");
        name.textContent = product.name;

        var price = document.createElement("p");
        price.className = "price";
        price.textContent = "₹" + product.price;

        var category = document.createElement("p");
        category.textContent = "Category: " + product.category;

        var description = document.createElement("p");
        description.textContent = product.description;

        var seller = document.createElement("p");
        seller.textContent = "Seller: " + product.seller;

        var buyButton = document.createElement("button");
        buyButton.textContent = "Buy Now";
        buyButton.onclick = function() {
            openCheckout(product.id);
        };

        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(price);
        card.appendChild(category);
        card.appendChild(description);
        card.appendChild(seller);
        card.appendChild(buyButton);

        productList.appendChild(card);
    });
}

/* Search products */
function searchProducts() {
    var searchText = document.getElementById("searchInput")
        .value.toLowerCase().trim();

    var category = document.getElementById("categoryFilter").value;

    var filteredProducts = products.filter(function(product) {
        var matchesName = product.name.toLowerCase()
            .includes(searchText);

        var matchesCategory = category === "All" ||
            product.category === category;

        return matchesName && matchesCategory;
    });

    displayProducts(filteredProducts);
}

/* Filter products by category */
function filterProducts() {
    searchProducts();
}

/* Add a new product */
document.getElementById("sellForm").addEventListener("submit",
    function(event) {
        event.preventDefault();

        var name = document.getElementById("productName").value.trim();
        var price = Number(document.getElementById("productPrice").value);
        var category = document.getElementById("productCategory").value;
        var description = document.getElementById("productDescription").value.trim();
        var seller = document.getElementById("sellerName").value.trim();
        var image = document.getElementById("productImage").value.trim();

        if (!name || !description || !seller || price <= 0) {
            alert("Please enter valid product details.");
            return;
        }

        var newProduct = {
            id: Date.now(),
            name: name,
            price: price,
            category: category,
            description: description,
            seller: seller,
            image: image || "https://placehold.co/400x250?text=Used+Product"
        };

        products.push(newProduct);

        saveProducts();
        displayProducts(products);

        document.getElementById("sellForm").reset();
        document.getElementById("sellMessage").textContent =
            "Product posted successfully!";

        document.getElementById("products").scrollIntoView();
    }
);

/* Open checkout popup */
function openCheckout(productId) {
    selectedProduct = products.find(function(product) {
        return product.id === productId;
    });

    if (!selectedProduct) {
        alert("This product is no longer available.");
        return;
    }

    document.getElementById("checkoutProduct").textContent =
        "Product: " + selectedProduct.name;

    document.getElementById("checkoutPrice").textContent =
        "Total: ₹" + selectedProduct.price;

    document.getElementById("orderMessage").textContent = "";
    document.getElementById("checkoutModal").style.display = "block";
}

/* Close checkout popup */
function closeCheckout() {
    document.getElementById("checkoutModal").style.display = "none";
}

/* Place an order */
document.getElementById("checkoutForm").addEventListener("submit",
    function(event) {
        event.preventDefault();

        if (!selectedProduct) {
            alert("Please select a product first.");
            return;
        }

        var buyerName = document.getElementById("buyerName").value.trim();
        var phone = document.getElementById("buyerPhone").value.trim();
        var address = document.getElementById("buyerAddress").value.trim();
        var payment = document.getElementById("paymentMethod").value;

        if (!buyerName || !address || !/^[0-9]{10}$/.test(phone)) {
            alert("Please enter valid buyer details.");
            return;
        }

        var order = {
            orderId: Date.now(),
            productName: selectedProduct.name,
            price: selectedProduct.price,
            buyer: buyerName,
            phone: phone,
            address: address,
            paymentMethod: payment,
            status: "Order placed"
        };

        /* Save demo order in browser storage */
        var orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));

        var message = "Order placed successfully! Payment: " + payment;

        if (payment === "UPI") {
            message += ". Demo only: no UPI payment was collected.";
        } else {
            message += ". Pay cash when the product is delivered.";
        }

        document.getElementById("orderMessage").textContent = message;

        /* Remove purchased product from the listings */
        products = products.filter(function(product) {
            return product.id !== selectedProduct.id;
        });

        saveProducts();
        displayProducts(products);

        document.getElementById("checkoutForm").reset();
        selectedProduct = null;
    }
);

/* Display all products when the page loads */
displayProducts(products);
