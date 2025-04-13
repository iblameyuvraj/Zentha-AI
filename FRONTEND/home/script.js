document.addEventListener("DOMContentLoaded", () => {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById("navToggle")
    const navMenu = document.getElementById("navMenu")
  
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
    })
  
    // Close mobile menu when clicking outside
    document.addEventListener("click", (event) => {
      const isClickInsideNav = navMenu.contains(event.target)
      const isClickInsideToggle = navToggle.contains(event.target)
  
      if (!isClickInsideNav && !isClickInsideToggle && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active")
      }
    })
  
    // FAQ Accordion
    const faqItems = document.querySelectorAll(".faq-item")
  
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question")
  
      question.addEventListener("click", () => {
        // Close all other open FAQ items
        faqItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains("active")) {
            otherItem.classList.remove("active")
          }
        })
  
        // Toggle current FAQ item
        item.classList.toggle("active")
      })
    })
  
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav a[href^="#"]')
  
    navLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault()
  
        // Close mobile menu if open
        if (navMenu.classList.contains("active")) {
          navMenu.classList.remove("active")
        }
  
        const targetId = this.getAttribute("href")
        if (targetId === "#") return
  
        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          })
        }
      })
    })
  
      // Run animation on load and scroll
    window.addEventListener("load", animateOnScroll)
    window.addEventListener("scroll", animateOnScroll)
  })


  // mobile--
  function isMobileDevice() {
    return /iPhone|iPad|iPod|Android|Mobile/i.test(navigator.userAgent);
  }

  function closeModal() {
    document.getElementById("mobileWarningModal").style.display = "none";
  }

  window.onload = function () {
    if (isMobileDevice()) {
      const modal = document.getElementById("mobileWarningModal");
      modal.style.display = "flex";
    }
  };


 
  