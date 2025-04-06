// Navigation Menu Toggle
function showMenu() {
    document.getElementById("navLinks").style.right = "0"
  }
  
  function hideMenu() {
    document.getElementById("navLinks").style.right = "-200px"
  }
  
  // Smooth Scrolling for Navigation Links
  document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll("nav a")
  
    for (const link of links) {
      link.addEventListener("click", function (e) {
        e.preventDefault()
  
        const targetId = this.getAttribute("href")
        if (targetId === "#") return
  
        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 70,
            behavior: "smooth",
          })
  
          // Hide mobile menu after clicking
          hideMenu()
        }
      })
    }
  
    // Animate elements when they come into view
    const animateOnScroll = () => {
      const elements = document.querySelectorAll(".feature-card, .timeline li, .join-options > div")
  
      elements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top
        const screenPosition = window.innerHeight / 1.3
  
        if (elementPosition < screenPosition) {
          element.style.opacity = "1"
          element.style.transform = "translateY(0)"
        }
      })
    }
  
    // Set initial styles for animation
    const elementsToAnimate = document.querySelectorAll(".feature-card, .timeline li, .join-options > div")
    elementsToAnimate.forEach((element) => {
      element.style.opacity = "0"
      element.style.transform = "translateY(20px)"
      element.style.transition = "opacity 0.5s ease, transform 0.5s ease"
    })
  
    // Run animation on scroll
    window.addEventListener("scroll", animateOnScroll)
  
    // Run once on page load
    animateOnScroll()
  
    // Form submission
    const newsletterForm = document.querySelector(".newsletter-form")
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", function (e) {
        e.preventDefault()
        const emailInput = this.querySelector('input[type="email"]')
        if (emailInput.value) {
          alert("Thank you for subscribing to our newsletter!")
          emailInput.value = ""
        }
      })
    }
  })
  
  