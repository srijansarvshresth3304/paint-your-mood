document.body.addEventListener("click", () => {
  // Start fade out animation
  document.body.classList.remove("fade-in");
  document.body.classList.add("fade-out");
  
  // Wait for animation to complete before navigating
  setTimeout(() => {
    window.location.href = "main.html";
  }, 1000);
});

// Enter key support (start.js mein add karo)
document.body.addEventListener('keypress', (e) => {
  if(e.key === 'Enter') {
    document.body.click(); // Same as mouse click
  }
});