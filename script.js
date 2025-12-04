// Shopping Cart Data
let cart = []

// Mobile Menu Toggle
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("navMenu")

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active")
  hamburger.classList.toggle("active")
})

// Close menu when clicking on a link
document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active")
    hamburger.classList.remove("active")
  })
})

function toggleCart() {
  const cartSidebar = document.getElementById("cartSidebar")
  const cartOverlay = document.getElementById("cartOverlay")

  cartSidebar.classList.toggle("active")
  cartOverlay.classList.toggle("active")

  // Prevent body scroll when cart is open
  if (cartSidebar.classList.contains("active")) {
    document.body.style.overflow = "hidden"
  } else {
    document.body.style.overflow = ""
  }
}

function increaseQuantity(button, menuName, price) {
  const quantitySpan = button.previousElementSibling
  let currentQty = Number.parseInt(quantitySpan.textContent)
  currentQty++
  quantitySpan.textContent = currentQty

  // Update cart
  updateCart(menuName, price, 1)
}

function decreaseQuantity(button) {
  const quantitySpan = button.nextElementSibling
  let currentQty = Number.parseInt(quantitySpan.textContent)

  if (currentQty > 0) {
    currentQty--
    quantitySpan.textContent = currentQty

    // Get menu info from the increase button
    const increaseBtn = button.nextElementSibling.nextElementSibling
    const menuName = increaseBtn.getAttribute("onclick").match(/'([^']+)'/)[1]

    // Update cart
    updateCart(menuName, 0, -1)
  }
}

function updateCart(menuName, price, change) {
  const existingItem = cart.find((item) => item.name === menuName)

  if (existingItem) {
    existingItem.quantity += change
    if (existingItem.quantity <= 0) {
      cart = cart.filter((item) => item.name !== menuName)
    }
  } else if (change > 0) {
    cart.push({
      name: menuName,
      price: price,
      quantity: change,
    })
  }

  renderCart()
  updateCartCount()
}

function renderCart() {
  const cartItemsContainer = document.getElementById("cartItems")
  const checkoutBtn = document.getElementById("checkoutBtn")

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-basket"></i>
        <p>Keranjang belanja Anda masih kosong</p>
        <small>Yuk, pilih menu favorit Anda!</small>
      </div>
    `
    checkoutBtn.disabled = true
    updateTotal()
    return
  }

  checkoutBtn.disabled = false

  let cartHTML = ""
  cart.forEach((item) => {
    const formattedPrice = new Intl.NumberFormat("id-ID").format(item.price)
    const itemTotal = new Intl.NumberFormat("id-ID").format(item.price * item.quantity)

    cartHTML += `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">Rp ${formattedPrice} × ${item.quantity} = Rp ${itemTotal}</div>
        </div>
        <div class="cart-item-actions">
          <div class="cart-item-qty">
            <button class="cart-qty-btn" onclick="changeCartQuantity('${item.name}', -1)">-</button>
            <span>${item.quantity}</span>
            <button class="cart-qty-btn" onclick="changeCartQuantity('${item.name}', 1)">+</button>
          </div>
          <button class="remove-item" onclick="removeFromCart('${item.name}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `
  })

  cartItemsContainer.innerHTML = cartHTML
  updateTotal()
}

function changeCartQuantity(menuName, change) {
  const item = cart.find((item) => item.name === menuName)
  if (item) {
    item.quantity += change
    if (item.quantity <= 0) {
      removeFromCart(menuName)
      return
    }

    // Update the quantity display in menu section
    updateMenuQuantity(menuName, item.quantity)
    renderCart()
    updateCartCount()
  }
}

function removeFromCart(menuName) {
  cart = cart.filter((item) => item.name !== menuName)

  // Reset quantity display in menu section
  updateMenuQuantity(menuName, 0)
  renderCart()
  updateCartCount()
}

function updateMenuQuantity(menuName, quantity) {
  const menuCards = document.querySelectorAll(".menu-card, .additional-item")

  menuCards.forEach((card) => {
    const cardText = card.textContent
    if (cardText.includes(menuName)) {
      const quantitySpan = card.querySelector(".quantity")
      if (quantitySpan) {
        quantitySpan.textContent = quantity
      }
    }
  })
}

function updateCartCount() {
  const cartCount = document.getElementById("cartCount")
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  cartCount.textContent = totalItems

  if (totalItems > 0) {
    cartCount.style.display = "flex"
  } else {
    cartCount.style.display = "flex"
  }
}

function updateTotal() {
  const totalPrice = document.getElementById("totalPrice")
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const formattedTotal = new Intl.NumberFormat("id-ID").format(total)
  totalPrice.textContent = `Rp ${formattedTotal}`
}

function checkoutWhatsApp() {
  if (cart.length === 0) return

  let message = `Halo Bebek Cak Kholiq! 🦆\n\nSaya ingin memesan:\n\n`

  cart.forEach((item, index) => {
    const itemTotal = new Intl.NumberFormat("id-ID").format(item.price * item.quantity)
    message += `${index + 1}. ${item.name}\n   ${item.quantity}x @ Rp ${new Intl.NumberFormat("id-ID").format(item.price)} = Rp ${itemTotal}\n\n`
  })

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const formattedTotal = new Intl.NumberFormat("id-ID").format(total)

  message += `💰 *Total: Rp ${formattedTotal}*\n\nMohon info untuk pengiriman/pengambilan. Terima kasih!`

  const encodedMessage = encodeURIComponent(message)
  const phoneNumber = "62895347540761"

  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank")

  // Optional: Clear cart after order
  // cart = []
  // renderCart()
  // updateCartCount()
  // resetAllQuantities()
}

function resetAllQuantities() {
  document.querySelectorAll(".quantity").forEach((span) => {
    span.textContent = "0"
  })
}

// Smooth Scroll Enhancement
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const offset = 80
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      })
    }
  })
})

// Navbar Scroll Effect
let lastScroll = 0
const navbar = document.querySelector(".navbar")

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset

  if (currentScroll > 100) {
    navbar.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)"
  } else {
    navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)"
  }

  lastScroll = currentScroll
})

// Scroll Reveal Animation
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

// Observe elements
document.querySelectorAll(".menu-card, .outlet-card, .specialty-card").forEach((el) => {
  el.style.opacity = "0"
  el.style.transform = "translateY(30px)"
  el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  observer.observe(el)
})

// Loading animation for images
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("load", function () {
    this.style.opacity = "1"
  })

  img.addEventListener("error", function () {
    this.style.opacity = "0.5"
  })
})

// Add active class to current nav item based on scroll position
window.addEventListener("scroll", () => {
  let current = ""
  const sections = document.querySelectorAll("section[id]")

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.clientHeight
    if (pageYOffset >= sectionTop - 100) {
      current = section.getAttribute("id")
    }
  })

  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active")
    }
  })
})

console.log("Bebek Cak Kholiq Website with Shopping Cart - Ready! 🦆🛒")
