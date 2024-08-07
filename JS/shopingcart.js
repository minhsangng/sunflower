var shoppingCart = (function () {
    cart = [];

    // Constructor
    function Item(name, price, count, img) {
        this.name = name;
        this.price = price;
        this.count = count;
        this.img = img;
    }

    // Save cart
    function saveCart() {
        sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
    }

    // Load cart
    function loadCart() {
        cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
    }
    if (sessionStorage.getItem("shoppingCart") != null) {
        loadCart();
    }

    var obj = {};

    // Add to cart
    obj.addItemToCart = function (name, price, count, img) {
        for (var item in cart) {
            if (cart[item].name === name) {
                cart[item].count++;
                saveCart();
                return;
            }
        }
        var item = new Item(name, price, count, img);
        cart.push(item);
        saveCart();
    }
    // Set count from item
    obj.setCountForItem = function (name, count) {
        for (var i in cart) {
            if (cart[i].name === name) {
                cart[i].count = count;
                break;
            }
        }
    };
    // Remove item from cart
    obj.removeItemFromCart = function (name) {
        for (var item in cart) {
            if (cart[item].name === name) {
                cart[item].count--;
                if (cart[item].count === 0) {
                    cart.splice(item, 1);
                }
                break;
            }
        }
        saveCart();
    }

    // Remove all items from cart
    obj.removeItemFromCartAll = function (name) {
        for (var item in cart) {
            if (cart[item].name === name) {
                cart.splice(item, 1);
                break;
            }
        }
        saveCart();
    }

    // Clear cart
    obj.clearCart = function () {
        cart = [];
        saveCart();
    }

    // Count cart 
    obj.totalCount = function () {
        var totalCount = 0;
        for (var item in cart) {
            totalCount += cart[item].count;
        }
        return totalCount;
    }

    // Total cart
    obj.totalCart = function () {
        var totalCart = 0;
        for (var item in cart) {
            totalCart += cart[item].price * cart[item].count;
        }
        return Number(totalCart.toFixed(2));
    }

    // List cart
    obj.listCart = function () {
        var cartCopy = [];
        for (i in cart) {
            item = cart[i];
            itemCopy = {};
            for (p in item) {
                itemCopy[p] = item[p];

            }
            itemCopy.total = Number(item.price * item.count).toFixed(2);
            cartCopy.push(itemCopy)
        }
        return cartCopy;
    }
    return obj;
})();

$('.add-to-cart').click(function (event) {
    event.preventDefault();
    var img = $(this).data('img');
    var name = $(this).data('name');
    var price = Number($(this).data('price'));
    shoppingCart.addItemToCart(name, price, 1, img);
    displayCart();
});

// Clear items
$('.clear-cart').click(function () {
    var r = confirm("Bạn có chắc muốn xóa giỏ hàng?");
    if (r == true) {
        shoppingCart.clearCart();
        displayCart();
    }
    else
        return;
});

$('.clearOrder').click(function () {
    shoppingCart.clearCart();
    displayCart();

});

function displayCart() {
    var cartArray = shoppingCart.listCart();
    var output = "Giỏ hàng trống";
    var checkout = "";
    for (var i in cartArray) {
        output += "<tr>"
            + "<td><b>" + cartArray[i].name + "</b></td>"
            + "<td><b>" + cartArray[i].price + " VND" + "</b></td>"
            + "<td><div class='input-group'>"
            + "<input type='number' min='1' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
            + "</div></td>"
            + "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + "><i class='fa fa-trash' aria-hidden='true'></i></button></td>"
            + " = "
            + "<td><b>" + cartArray[i].total + " VND" + "</b></td>"
            + "</tr>";

        checkout += `<li class="list-group-item d-flex justify-content-between lh-condensed">
                <div>
                    <h6 class="my-0 show-cart-checkout" style="font-size: 1.8rem;"><b> ${cartArray[i].name}</b><br/>Giá:  ${cartArray[i].price}.000VND<br>Số lượng: ${cartArray[i].count} </h6>
                    <small class="text-muted" style="font-size: 1.7rem;">Thành tiền: ${cartArray[i].total}VND</small>
                </div>
                <span class="text-muted"></span>
            </li>`;
    }

    $('.show-cart-checkout').html(checkout);
    $('.show-cart').html(output);
    $('.total-cart').html(shoppingCart.totalCart() + ".000 VND");
    $('.count-cart').html(shoppingCart.totalCount());
    if (shoppingCart.totalCount() == 0) {
        $('span.count-cart').addClass('d-none');
    }
    else
        $('span.count-cart').removeClass('d-none');
}

// Delete item button

$('.show-cart').on("click", ".delete-item", function (event) {
    var name = $(this).data('name')
    shoppingCart.removeItemFromCartAll(name);
    displayCart();
})


// -1
$('.show-cart').on("click", ".minus-item", function (event) {
    var name = $(this).data('name')
    shoppingCart.removeItemFromCart(name);
    displayCart();
})
// +1
$('.show-cart').on("click", ".plus-item", function (event) {
    var name = $(this).data('name')
    shoppingCart.addItemToCart(name);
    displayCart();
})

// Item count input
$('.show-cart').on("change", ".item-count", function (event) {
    var name = $(this).data('name');
    var count = Number($(this).val());
    shoppingCart.setCountForItem(name, count);
    displayCart();
});

displayCart();


//Add to cart animation source code from code pen
$('.add-to-cart').on('click', function () {
    var cart = $('.shopping-cart');
    var imgtodrag = $(this).parents('.card').find("img").eq(0);
    if (imgtodrag) {
        var imgclone = imgtodrag.clone()
            .offset({
                top: imgtodrag.offset().top,
                left: imgtodrag.offset().left
            })
            .css({
                'opacity': '0.8',
                'position': 'absolute',
                'height': '125px',
                'width': '75px',
                'z-index': '100'
            })
            .appendTo($('body'))
            .animate({
                'top': cart.offset().top - 30,
                'left': cart.offset().left - 30,
                'width': '25px',
                'height': '50px'
            }, 400, 'easeInOutExpo');

        setTimeout(function () {
            cart.effect("shake", {
                times: 2
            }, 300);
        }, 500);

        imgclone.animate({
            'width': 0,
            'height': 0
        }, function () {
            $(this).detach()
        });
    }
});