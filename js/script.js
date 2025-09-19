let UserAuthenticationStatus = false;

function InitializeProductList() {
    const savedProducts = localStorage.getItem('ProductList');
    if (savedProducts) {
        return JSON.parse(savedProducts);
    } else {
        const defaultProducts = [
            {
                ProductId: 1,
                ProductName: "Rings",
                ProductPrice: 99.99,
                ProductImage: "images/ringss.jpg"
            },
            {
                ProductId: 2,
                ProductName: "Smart Watch",
                ProductPrice: 199.99,
                ProductImage: "images/smart watch.jpg"
            },
            {
                ProductId: 3,
                ProductName: "Necklace",
                ProductPrice: 29.99,
                ProductImage: "images/necklace.jpg"
            },
            {
                ProductId: 4,
                ProductName: "Carteer",
                ProductPrice: 79.99,
                ProductImage: "images/carteer.jpg"
            },
            {
                ProductId: 5,
                ProductName: "Bracelets",
                ProductPrice: 59.99,
                ProductImage: "images/braclets.jpg"
            },
            {
                ProductId: 6,
                ProductName: "Silver Rings",
                ProductPrice: 129.99,
                ProductImage: "images/silverring.jpg"
            },
            {
                ProductId: 7,
                ProductName: "Earrings",
                ProductPrice: 89.99,
                ProductImage: "images/ear2.jpg"
            },
            {
                ProductId: 8,
                ProductName: "Set Rings",
                ProductPrice: 49.99,
                ProductImage: "images/set rings.jpg"
            }
        ];
        localStorage.setItem('ProductList', JSON.stringify(defaultProducts));
        return defaultProducts;
    }
}

let ProductList = InitializeProductList();

function InitializeShoppingCart() {
    const savedCart = localStorage.getItem('ShoppingCart');
    if (savedCart) {
        return JSON.parse(savedCart);
    } else {
        return [];
    }
}

let ShoppingCart = InitializeShoppingCart();

document.addEventListener('DOMContentLoaded', function() {
    CheckUserAuthenticationStatus();
    UpdateShoppingCartDisplay();
    InitializePageComponents();
});

function CheckUserAuthenticationStatus() {
    const CurrentPageName = window.location.pathname.split('/').pop();
    
    if (CurrentPageName === 'index.html' || CurrentPageName === '') {
        if (localStorage.getItem('UserLoginStatus') === 'true') {
            window.location.href = 'Home.html';
        }
    } else {
        if (localStorage.getItem('UserLoginStatus') !== 'true') {
            window.location.href = 'index.html';
        } else {
            UserAuthenticationStatus = true;
        }
    }
}

function AuthenticateUser(EmailAddress, PasswordString) {
    if (EmailAddress && PasswordString && EmailAddress.trim() !== '' && PasswordString.trim() !== '') {
        localStorage.setItem('UserLoginStatus', 'true');
        localStorage.setItem('UserEmail', EmailAddress);
        UserAuthenticationStatus = true;
        return true;
    }
    return false;
}

function LogoutUser() {
    Swal.fire({
        title: 'Logout',
        text: 'Are you sure you want to logout?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, logout!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('UserLoginStatus');
            localStorage.removeItem('UserEmail');
            UserAuthenticationStatus = false;
            
            Swal.fire({
                title: 'Logged Out!',
                text: 'You have been successfully logged out.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = 'index.html';
            });
        }
    });
}

function GetCurrentUserEmail() {
    return localStorage.getItem('UserEmail') || 'User';
}

const LoginFormElement = document.getElementById('loginForm');
if (LoginFormElement) {
    LoginFormElement.addEventListener('submit', (EventObject) => {
        EventObject.preventDefault();
        
        const EmailInputValue = document.getElementById('email').value.trim();
        const PasswordInputValue = document.getElementById('password').value.trim();
        
        if (EmailInputValue === '' || PasswordInputValue === '') {
        Swal.fire({
            title: 'Error',
                text: 'Please enter both email and password!',
            icon: 'error',
                confirmButtonText: 'OK'
        });
        return;
    }

        if (AuthenticateUser(EmailInputValue, PasswordInputValue)) {
            Swal.fire({
                title: 'Success',
                text: `Welcome, ${EmailInputValue}! Login successful!`,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = 'Home.html';
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Please enter both email and password!',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    });
}

function AddNewProduct(ProductName, ProductPrice, ProductImageUrl) {
    const NewProductObject = {
        ProductId: Date.now(),
        ProductName: ProductName,
        ProductPrice: parseFloat(ProductPrice),
        ProductImage: ProductImageUrl || "images/img.jpg"
    };
    ProductList.push(NewProductObject);
    
    localStorage.setItem('ProductList', JSON.stringify(ProductList));
    
    if (typeof LoadAllProducts === 'function') {
        LoadAllProducts();
    }
    
    if (typeof LoadFeaturedProducts === 'function') {
        LoadFeaturedProducts();
    }
    
    return NewProductObject;
}

function RemoveProductFromList(ProductIdToRemove) {
    const ProductIndex = ProductList.findIndex(ProductItem => ProductItem.ProductId === ProductIdToRemove);
    if (ProductIndex > -1) {
        ProductList.splice(ProductIndex, 1);
        localStorage.setItem('ProductList', JSON.stringify(ProductList));
        return true;
    }
    return false;
}

function AddProductToShoppingCart(ProductIdToAdd) {
    const ProductToAdd = ProductList.find(ProductItem => ProductItem.ProductId === ProductIdToAdd);
    if (ProductToAdd) {
        const ExistingCartItem = ShoppingCart.find(CartItem => CartItem.ProductId === ProductIdToAdd);
        if (ExistingCartItem) {
            ExistingCartItem.Quantity += 1;
        } else {
            ShoppingCart.push({...ProductToAdd, Quantity: 1});
        }
        
        localStorage.setItem('ShoppingCart', JSON.stringify(ShoppingCart));
        
        UpdateShoppingCartDisplay();
        
        console.log('Product added to cart:', ProductToAdd.ProductName);
        console.log('Updated ShoppingCart:', ShoppingCart);
        
        Swal.fire({
            title: 'Added to Cart!',
            text: `${ProductToAdd.ProductName} has been added to your cart.`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    }
}

function RemoveProductFromShoppingCart(ProductIdToRemove) {
    const CartItemIndex = ShoppingCart.findIndex(CartItem => CartItem.ProductId === ProductIdToRemove);
    if (CartItemIndex > -1) {
        ShoppingCart.splice(CartItemIndex, 1);
        localStorage.setItem('ShoppingCart', JSON.stringify(ShoppingCart));
        UpdateShoppingCartDisplay();
    }
}

function UpdateShoppingCartDisplay() {
    const CartCountElement = document.getElementById('cartCount');
    if (CartCountElement) {
        ShoppingCart = InitializeShoppingCart();
        const TotalCartItems = ShoppingCart.reduce((SumTotal, CartItem) => SumTotal + CartItem.Quantity, 0);
        CartCountElement.textContent = TotalCartItems;
    }
}

function CalculateShoppingCartTotal() {
    return ShoppingCart.reduce((TotalAmount, CartItem) => TotalAmount + (CartItem.ProductPrice * CartItem.Quantity), 0);
}

function InitializeSwiperSlider() {
    if (typeof Swiper !== 'undefined') {
        var SwiperInstance = new Swiper(".mySwiper", {
            spaceBetween: 30,
            centeredSlides: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });
    }
}

function LoadFeaturedProducts() {
    const FeaturedProductsContainer = document.getElementById('featuredProducts');
    if (!FeaturedProductsContainer) return;
    
    const FeaturedProductsList = ProductList.slice(0, 4);
    
    FeaturedProductsContainer.innerHTML = '';
    
    FeaturedProductsList.forEach(ProductItem => {
        const ProductCardElement = CreateProductCardElement(ProductItem, true);
        FeaturedProductsContainer.appendChild(ProductCardElement);
    });
}

function CreateProductCardElement(ProductData, IsFeaturedProduct = false) {
    const ColumnDivElement = document.createElement('div');
    ColumnDivElement.className = 'col-lg-3 col-md-6 mb-4';
    
    const CardDivElement = document.createElement('div');
    CardDivElement.className = IsFeaturedProduct ? 'card h-100 product-card-container' : 'card h-100 shadow-sm product-card-container';
    
    const ProductImageElement = document.createElement('img');
    ProductImageElement.src = ProductData.ProductImage;
    ProductImageElement.className = 'card-img-top';
    ProductImageElement.alt = ProductData.ProductName;
    
    const CardBodyElement = document.createElement('div');
    CardBodyElement.className = 'card-body d-flex flex-column';
    
    const ProductTitleElement = document.createElement('h5');
    ProductTitleElement.className = IsFeaturedProduct ? 'card-title' : 'card-title text-center';
    ProductTitleElement.textContent = ProductData.ProductName;
    
    const ProductPriceElement = document.createElement('p');
    ProductPriceElement.className = IsFeaturedProduct ? 'card-text text-primary fw-bold' : 'card-text text-muted fw-bold fs-4 text-center';
    ProductPriceElement.textContent = `$${ProductData.ProductPrice}`;
    
    const ButtonContainerElement = document.createElement('div');
    ButtonContainerElement.className = 'mt-auto';
    
    if (IsFeaturedProduct) {
        const AddToCartButton = document.createElement('button');
        AddToCartButton.className = 'btn btn-primary w-100 btn-cart-add';
        AddToCartButton.textContent = 'Add to Cart';
        AddToCartButton.onclick = () => AddProductToShoppingCart(ProductData.ProductId);
        ButtonContainerElement.appendChild(AddToCartButton);
    } else {
        const ButtonGroupElement = document.createElement('div');
        ButtonGroupElement.className = 'd-grid gap-2';
        
        const AddToCartButton = document.createElement('button');
        AddToCartButton.className = 'btn text-white btn-cart-add';
        AddToCartButton.innerHTML = '<i class="bi bi-cart-plus"></i> Add to Cart';
        AddToCartButton.onclick = () => AddProductToShoppingCart(ProductData.ProductId);
        
        const RemoveProductButton = document.createElement('button');
        RemoveProductButton.className = 'btn btn-outline-danger';
        RemoveProductButton.innerHTML = '<i class="bi bi-trash"></i> Remove';
        RemoveProductButton.onclick = () => ConfirmRemoveProduct(ProductData.ProductId);
        
        ButtonGroupElement.appendChild(AddToCartButton);
        ButtonGroupElement.appendChild(RemoveProductButton);
        ButtonContainerElement.appendChild(ButtonGroupElement);
    }
    
    CardBodyElement.appendChild(ProductTitleElement);
    CardBodyElement.appendChild(ProductPriceElement);
    CardBodyElement.appendChild(ButtonContainerElement);
    
    CardDivElement.appendChild(ProductImageElement);
    CardDivElement.appendChild(CardBodyElement);
    
    ColumnDivElement.appendChild(CardDivElement);
    
    return ColumnDivElement;
}

function loadNewestProducts() {
    const container = document.getElementById('newestProducts');
    if (!container) return;
    
    const newestProducts = products.slice(0, 3);
    
    container.innerHTML = '';
    
    newestProducts.forEach(product => {
        const productCard = createNewestProductCard(product);
        container.appendChild(productCard);
    });
}

function createNewestProductCard(product) {
    const colDiv = document.createElement('div');
    colDiv.className = 'col-lg-4 col-md-6 mb-4';
    
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card h-100 product-card-container';
    
    const img = document.createElement('img');
    img.src = product.image;
    img.className = 'card-img-top';
    img.alt = product.name;
    img.style.height = '250px';
    img.style.objectFit = 'cover';
    
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body text-center';
    
    const title = document.createElement('h5');
    title.className = 'card-title';
    title.textContent = product.name;
    
    const price = document.createElement('p');
    price.className = 'card-text text-primary fw-bold fs-5';
    price.textContent = `$${product.price}`;
    
    cardBody.appendChild(title);
    cardBody.appendChild(price);
    
    cardDiv.appendChild(img);
    cardDiv.appendChild(cardBody);
    
    colDiv.appendChild(cardDiv);
    
    return colDiv;
}

function LoadAllProducts() {
    const ProductsContainerElement = document.getElementById('productsContainer');
    const NoProductsMessageElement = document.getElementById('noProductsMessage');
    const ProductCountElement = document.getElementById('productCount');
    
    if (!ProductsContainerElement) {
        console.log('ProductsContainerElement not found');
        return;
    }
    
    ProductList = InitializeProductList();
    
    console.log('Loading products. ProductList length:', ProductList.length);
    console.log('ProductList:', ProductList);
    
    if (ProductCountElement) ProductCountElement.textContent = ProductList.length;
    
    if (ProductList.length === 0) {
        if (NoProductsMessageElement) NoProductsMessageElement.style.display = 'block';
        return;
    }
    
    if (NoProductsMessageElement) NoProductsMessageElement.style.display = 'none';
    
    ProductsContainerElement.innerHTML = '';
    
    ProductList.forEach(ProductItem => {
        const ProductCardElement = CreateProductCardElement(ProductItem, false);
        ProductsContainerElement.appendChild(ProductCardElement);
    });
    
    console.log('Products loaded successfully');
}

function ConfirmRemoveProduct(ProductIdToRemove) {
    const ProductToRemove = ProductList.find(ProductItem => ProductItem.ProductId === ProductIdToRemove);
    if (!ProductToRemove) return;
    
    Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to remove "${ProductToRemove.ProductName}" from the store?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'Cancel'
    }).then((ConfirmationResult) => {
        if (ConfirmationResult.isConfirmed) {
            if (RemoveProductFromList(ProductIdToRemove)) {
                Swal.fire({
                    title: 'Removed!',
                    text: 'Product has been removed successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    LoadAllProducts();
                    UpdateShoppingCartDisplay();
                });
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to remove product.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    });
}

function HandleProductFormSubmission(EventObject) {
    EventObject.preventDefault();
    
    const ProductNameValue = document.getElementById('productName').value.trim();
    const ProductPriceValue = parseFloat(document.getElementById('productPrice').value);
    const ProductImageValue = document.getElementById('productImage').value.trim();
    const ProductDescriptionValue = document.getElementById('productDescription').value.trim();
    
    ClearFormValidationErrors();
    
    let IsFormValid = true;
    
    if (ProductNameValue === '') {
        ShowValidationError('productName', 'Product name is required');
        IsFormValid = false;
    } else if (ProductNameValue.length < 2) {
        ShowValidationError('productName', 'Product name must be at least 2 characters');
        IsFormValid = false;
    }
    
    if (isNaN(ProductPriceValue) || ProductPriceValue <= 0) {
        ShowValidationError('productPrice', 'Please enter a valid price greater than 0');
        IsFormValid = false;
    }
    
    if (ProductImageValue !== '' && !IsValidUrl(ProductImageValue)) {
        ShowValidationError('productImage', 'Please enter a valid image URL');
        IsFormValid = false;
    }
    
    if (!IsFormValid) {
        Swal.fire({
            title: 'Validation Error',
            text: 'Please fix the errors in the form before submitting.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }
    
    const NewProductObject = AddNewProduct(ProductNameValue, ProductPriceValue, ProductImageValue);
    
    console.log('New product added:', NewProductObject);
    console.log('Updated ProductList:', ProductList);
    
    Swal.fire({
        title: 'Success!',
        text: `Product "${ProductNameValue}" has been added successfully!`,
        icon: 'success',
        confirmButtonText: 'OK'
    }).then(() => {
        ClearProductForm();
        window.location.href = 'products.html';
    });
}

function ClearProductForm() {
    const ProductFormElement = document.getElementById('addProductForm');
    if (ProductFormElement) {
        ProductFormElement.reset();
        ClearFormValidationErrors();
    }
}

function ClearFormValidationErrors() {
    const FormInputIds = ['productName', 'productPrice', 'productImage'];
    FormInputIds.forEach(InputId => {
        const InputElement = document.getElementById(InputId);
        if (InputElement) {
            InputElement.classList.remove('is-invalid');
        }
    });
}

function ShowValidationError(InputId, ErrorMessage) {
    const InputElement = document.getElementById(InputId);
    const ErrorDivElement = document.getElementById(InputId + 'Error');
    
    if (InputElement) InputElement.classList.add('is-invalid');
    if (ErrorDivElement) ErrorDivElement.textContent = ErrorMessage;
}

function IsValidUrl(UrlString) {
    try {
        new URL(UrlString);
        return true;
    } catch (_) {
        return false;
    }
}

function LoadShoppingCart() {
    const CartContentElement = document.getElementById('cartContent');
    const EmptyCartMessageElement = document.getElementById('emptyCartMessage');
    
    if (!CartContentElement) {
        console.log('CartContentElement not found');
        return;
    }
    
    ShoppingCart = InitializeShoppingCart();
    
    console.log('Loading cart. ShoppingCart length:', ShoppingCart.length);
    console.log('ShoppingCart:', ShoppingCart);
    
    if (ShoppingCart.length === 0) {
        CartContentElement.innerHTML = '';
        if (EmptyCartMessageElement) EmptyCartMessageElement.style.display = 'block';
        return;
    }
    
    if (EmptyCartMessageElement) EmptyCartMessageElement.style.display = 'none';
    
    CartContentElement.innerHTML = '';
    
    ShoppingCart.forEach(CartItem => {
        const CartItemElement = CreateShoppingCartItem(CartItem);
        CartContentElement.appendChild(CartItemElement);
    });
    
    const CartTotalSummaryElement = CreateShoppingCartTotalSummary();
    CartContentElement.appendChild(CartTotalSummaryElement);
    
    console.log('Cart loaded successfully');
}

function CreateShoppingCartItem(CartItemData) {
    const CartItemRowDiv = document.createElement('div');
    CartItemRowDiv.className = 'row mb-4';
    
    const CartItemColDiv = document.createElement('div');
    CartItemColDiv.className = 'col-12';
    
    const CartItemCardDiv = document.createElement('div');
    CartItemCardDiv.className = 'card';
    
    const CartItemCardBody = document.createElement('div');
    CartItemCardBody.className = 'card-body';
    
    const CartItemInnerRow = document.createElement('div');
    CartItemInnerRow.className = 'row align-items-center';
    
    const ProductImageCol = document.createElement('div');
    ProductImageCol.className = 'col-md-2';
    const ProductImageElement = document.createElement('img');
    ProductImageElement.src = CartItemData.ProductImage;
    ProductImageElement.className = 'img-fluid rounded cart-item-image';
    ProductImageElement.alt = CartItemData.ProductName;
    ProductImageCol.appendChild(ProductImageElement);
    
    const ProductInfoCol = document.createElement('div');
    ProductInfoCol.className = 'col-md-4';
    const ProductTitleElement = document.createElement('h5');
    ProductTitleElement.className = 'card-title mb-1';
    ProductTitleElement.textContent = CartItemData.ProductName;
    const ProductPriceElement = document.createElement('p');
    ProductPriceElement.className = 'text-muted mb-0';
    ProductPriceElement.textContent = `$${CartItemData.ProductPrice} each`;
    ProductInfoCol.appendChild(ProductTitleElement);
    ProductInfoCol.appendChild(ProductPriceElement);
    
    const QuantityControlCol = document.createElement('div');
    QuantityControlCol.className = 'col-md-2';
    const QuantityGroupElement = document.createElement('div');
    QuantityGroupElement.className = 'input-group quantity-controls';
    
    const MinusQuantityButton = document.createElement('button');
    MinusQuantityButton.className = 'btn btn-outline-secondary';
    MinusQuantityButton.type = 'button';
    MinusQuantityButton.textContent = '-';
    MinusQuantityButton.onclick = () => UpdateCartItemQuantity(CartItemData.ProductId, -1);
    
    const QuantityInputElement = document.createElement('input');
    QuantityInputElement.type = 'number';
    QuantityInputElement.className = 'form-control text-center';
    QuantityInputElement.value = CartItemData.Quantity;
    QuantityInputElement.min = '1';
    QuantityInputElement.readOnly = true;
    
    const PlusQuantityButton = document.createElement('button');
    PlusQuantityButton.className = 'btn btn-outline-secondary';
    PlusQuantityButton.type = 'button';
    PlusQuantityButton.textContent = '+';
    PlusQuantityButton.onclick = () => UpdateCartItemQuantity(CartItemData.ProductId, 1);
    
    QuantityGroupElement.appendChild(MinusQuantityButton);
    QuantityGroupElement.appendChild(QuantityInputElement);
    QuantityGroupElement.appendChild(PlusQuantityButton);
    QuantityControlCol.appendChild(QuantityGroupElement);
    
    const TotalPriceCol = document.createElement('div');
    TotalPriceCol.className = 'col-md-2';
    const TotalPriceElement = document.createElement('h5');
    TotalPriceElement.className = 'text-primary mb-0';
    TotalPriceElement.textContent = `$${(CartItemData.ProductPrice * CartItemData.Quantity).toFixed(2)}`;
    TotalPriceCol.appendChild(TotalPriceElement);
    
    const RemoveButtonCol = document.createElement('div');
    RemoveButtonCol.className = 'col-md-2 text-end';
    const RemoveButtonElement = document.createElement('button');
    RemoveButtonElement.className = 'btn btn-outline-danger';
    RemoveButtonElement.innerHTML = '<i class="bi bi-trash"></i> Remove';
    RemoveButtonElement.onclick = () => ConfirmRemoveFromShoppingCart(CartItemData.ProductId);
    RemoveButtonCol.appendChild(RemoveButtonElement);
    
    CartItemInnerRow.appendChild(ProductImageCol);
    CartItemInnerRow.appendChild(ProductInfoCol);
    CartItemInnerRow.appendChild(QuantityControlCol);
    CartItemInnerRow.appendChild(TotalPriceCol);
    CartItemInnerRow.appendChild(RemoveButtonCol);
    
    CartItemCardBody.appendChild(CartItemInnerRow);
    CartItemCardDiv.appendChild(CartItemCardBody);
    CartItemColDiv.appendChild(CartItemCardDiv);
    CartItemRowDiv.appendChild(CartItemColDiv);
    
    return CartItemRowDiv;
}

function CreateShoppingCartTotalSummary() {
    const CartTotalAmount = CalculateShoppingCartTotal();
    const TotalCartItems = ShoppingCart.reduce((SumTotal, CartItem) => SumTotal + CartItem.Quantity, 0);
    
    const CartTotalRowDiv = document.createElement('div');
    CartTotalRowDiv.className = 'row';
    
    const CartTotalColDiv = document.createElement('div');
    CartTotalColDiv.className = 'col-12';
    
    const CartTotalCardDiv = document.createElement('div');
    CartTotalCardDiv.className = 'card bg-light';
    
    const CartTotalCardBody = document.createElement('div');
    CartTotalCardBody.className = 'card-body';
    
    const CartTotalInfoRow = document.createElement('div');
    CartTotalInfoRow.className = 'row align-items-center';
    
    const TotalItemsCol = document.createElement('div');
    TotalItemsCol.className = 'col-md-6';
    const TotalItemsText = document.createElement('h4');
    TotalItemsText.className = 'mb-0';
    TotalItemsText.textContent = `Total Items: ${TotalCartItems}`;
    TotalItemsCol.appendChild(TotalItemsText);
    
    const CartTotalCol = document.createElement('div');
    CartTotalCol.className = 'col-md-6 text-md-end';
    const CartTotalText = document.createElement('h3');
    CartTotalText.className = 'text-primary mb-0';
    CartTotalText.textContent = `Total: $${CartTotalAmount.toFixed(2)}`;
    CartTotalCol.appendChild(CartTotalText);
    
    CartTotalInfoRow.appendChild(TotalItemsCol);
    CartTotalInfoRow.appendChild(CartTotalCol);
    
    const CartButtonsRow = document.createElement('div');
    CartButtonsRow.className = 'row mt-3';
    
    const CartButtonsCol = document.createElement('div');
    CartButtonsCol.className = 'col-12 text-center';
    
    const CheckoutButton = document.createElement('button');
    CheckoutButton.className = 'btn btn-success btn-lg me-2';
    CheckoutButton.innerHTML = '<i class="bi bi-credit-card"></i> Checkout';
    CheckoutButton.onclick = ProcessCheckout;
    
    const ClearCartButton = document.createElement('button');
    ClearCartButton.className = 'btn btn-outline-secondary btn-lg';
    ClearCartButton.innerHTML = '<i class="bi bi-trash"></i> Clear Cart';
    ClearCartButton.onclick = ClearShoppingCart;
    
    CartButtonsCol.appendChild(CheckoutButton);
    CartButtonsCol.appendChild(ClearCartButton);
    CartButtonsRow.appendChild(CartButtonsCol);
    
    CartTotalCardBody.appendChild(CartTotalInfoRow);
    CartTotalCardBody.appendChild(CartButtonsRow);
    CartTotalCardDiv.appendChild(CartTotalCardBody);
    CartTotalColDiv.appendChild(CartTotalCardDiv);
    CartTotalRowDiv.appendChild(CartTotalColDiv);
    
    return CartTotalRowDiv;
}

function UpdateCartItemQuantity(ProductIdToUpdate, QuantityChange) {
    const CartItemToUpdate = ShoppingCart.find(CartItem => CartItem.ProductId === ProductIdToUpdate);
    if (CartItemToUpdate) {
        CartItemToUpdate.Quantity += QuantityChange;
        if (CartItemToUpdate.Quantity <= 0) {
            RemoveProductFromShoppingCart(ProductIdToUpdate);
        } else {
            localStorage.setItem('ShoppingCart', JSON.stringify(ShoppingCart));
        }
        LoadShoppingCart();
        UpdateShoppingCartDisplay();
    }
}

function ConfirmRemoveFromShoppingCart(ProductIdToRemove) {
    const CartItemToRemove = ShoppingCart.find(CartItem => CartItem.ProductId === ProductIdToRemove);
    if (!CartItemToRemove) return;
    
    Swal.fire({
        title: 'Remove Item',
        text: `Remove "${CartItemToRemove.ProductName}" from cart?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'Cancel'
    }).then((ConfirmationResult) => {
        if (ConfirmationResult.isConfirmed) {
            RemoveProductFromShoppingCart(ProductIdToRemove);
            LoadShoppingCart();
        }
    });
}

function ClearShoppingCart() {
    Swal.fire({
        title: 'Clear Cart',
        text: 'Are you sure you want to remove all items from your cart?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, clear it!',
        cancelButtonText: 'Cancel'
    }).then((ConfirmationResult) => {
        if (ConfirmationResult.isConfirmed) {
            ShoppingCart = [];
            localStorage.setItem('ShoppingCart', JSON.stringify(ShoppingCart));
            LoadShoppingCart();
            UpdateShoppingCartDisplay();
            Swal.fire({
                title: 'Cleared!',
                text: 'Your cart has been cleared.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
        }
    });
}

function ProcessCheckout() {
    if (ShoppingCart.length === 0) {
        Swal.fire({
            title: 'Empty Cart',
            text: 'Your cart is empty. Add some products first!',
            icon: 'info',
            confirmButtonText: 'OK'
        });
        return;
    }
    
    const CheckoutTotalAmount = CalculateShoppingCartTotal();
    const CheckoutTotalItems = ShoppingCart.reduce((SumTotal, CartItem) => SumTotal + CartItem.Quantity, 0);
    
    Swal.fire({
        title: 'Checkout',
        html: `
            <div class="text-start">
                <p><strong>Total Items:</strong> ${CheckoutTotalItems}</p>
                <p><strong>Total Amount:</strong> $${CheckoutTotalAmount.toFixed(2)}</p>
                <hr>
                <p class="text-muted">This is a demo checkout. In a real application, you would proceed to payment processing.</p>
            </div>
        `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Proceed to Payment',
        cancelButtonText: 'Cancel'
    }).then((CheckoutResult) => {
        if (CheckoutResult.isConfirmed) {
            Swal.fire({
                title: 'Order Placed!',
                text: 'Thank you for your purchase! Your order has been placed successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                ShoppingCart = [];
                localStorage.setItem('ShoppingCart', JSON.stringify(ShoppingCart));
                LoadShoppingCart();
                UpdateShoppingCartDisplay();
        });
    }
});
}

function InitializePageComponents() {
    const CurrentPageName = window.location.pathname.split('/').pop();
    
    if (CurrentPageName === 'Home.html' || CurrentPageName === '') {
        InitializeSwiperSlider();
        LoadFeaturedProducts();
    }
    
    if (CurrentPageName === 'products.html') {
        LoadAllProducts();
        LoadNewestProducts();
    }
    
    if (CurrentPageName === 'add-product.html'){
        const ProductFormElement = document.getElementById('addProductForm');
        if (ProductFormElement) {
            ProductFormElement.addEventListener('submit', HandleProductFormSubmission);
        }
    }
    
    if (CurrentPageName === 'cart.html')  {
        LoadShoppingCart();
    }
}
