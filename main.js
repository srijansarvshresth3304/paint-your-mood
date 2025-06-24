// Canvas setup
const canvas = document.getElementById('mindCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const fromStartPage = document.referrer.includes("index.html");

if (fromStartPage) {
  document.body.classList.add("fade-in");
  setTimeout(() => {
    document.body.classList.remove("fade-in");
  }, 1000);
}
// DOM elements
const inputEl = document.getElementById('inputMood');
const detectedMoodEl = document.getElementById('detectedMood');
const visualDescriptionEl = document.getElementById('visualDescription');

let animationId = null;
let currentMood = "neutral";
let particles = [];
const particleCount = 150;

// Mood keyword map
const moodCategories = {
    angry: [
        "angry", "irritated", "frustrated", "annoyed", "outraged", "enraged", "furious",
        "bitter", "hostile", "resentful", "aggressive", "pissed", "offended", "mad",
        "vengeful", "grumpy", "cranky", "jealous"
    ],
    sad: [
        "sad", "depressed", "lonely", "heartbroken", "miserable", "gloomy", "hopeless",
        "tired", "weeping", "crying", "melancholic", "blue", "sorrowful", "grieving",
        "low", "down", "rejected", "drained", "empty"
    ],
    fearful: [
        "fearful", "scared", "insecure", "worried", "unsafe", "terrified", "anxious",
        "panicked", "suspicious", "helpless", "doubtful", "jealous"
    ],
    confused: [
        "confused", "anxious", "nervous", "uncertain", "panicked", "scared", "hesitant",
        "worried", "paranoid", "insecure", "overwhelmed", "startled", "disoriented",
        "unsure", "shy", "awkward", "jumpy"
    ],
    calm: [
        "calm", "peaceful", "relaxed", "chilled", "hopeful", "satisfied", "content",
        "patient", "stable", "dreamy", "thoughtful", "lighthearted", "zen", "meditative",
        "grounded", "quiet", "still"
    ],
    happy: [
        "happy", "excited", "joyful", "cheerful", "thrilled", "elated", "playful",
        "energetic", "enthusiastic", "giggly", "optimistic", "delighted", "euphoric",
        "sunny", "radiant", "bubbly", "fun-loving", "fantastic"
    ],
    neutral: [
        "neutral", "okay", "fine", "normal", "blank", "idle", "bored", "indifferent",
        "flat", "numb", "unfocused", "meh", "casual", "disconnected", "average", "detached"
    ],
    romantic: [
        "romantic", "loving", "passionate", "affectionate", "caring", "flirty", "intimate",
        "warm", "craving", "touched", "tender", "close", "emotional"
    ],
    thoughtful: [
        "thoughtful", "nostalgic", "reflective", "introspective", "pensive", "philosophical",
        "deep", "lost in thought", "spiritual", "curious", "observing"
    ],
    creative: [
        "inspired", "creative", "artistic", "innovative", "expressive", "imaginative",
        "open-minded", "visual", "productive"
    ],
    motivated: [
        "motivated", "determined", "focused", "ambitious", "disciplined", "empowered",
        "confident", "driven", "goal-oriented"
    ]
};

// Mood Preview Text
function getPreview(mood) {
    switch (mood) {
        case "angry": return "Fiery Explosions";
        case "sad": return "Blue Rain";
        case "fearful": return "Dark Tremors";
        case "confused": return "Chaotic Swirls";
        case "calm": return "Gentle Waves";
        case "happy": return "Colorful Celebration";
        case "neutral": return "Subtle Static";
        case "romantic": return "Floating Hearts";
        case "thoughtful": return "Deep Thoughts";
        case "creative": return "Creative Sparks";
        case "motivated": return "Rising Energy";
        default: return "Unknown";
    }
}

// Mood detection logic
function detectMood(userInput) {
    const words = userInput.toLowerCase().split(/\s+/);
    for (const word of words) {
        for (const category in moodCategories) {
            if (moodCategories[category].includes(word)) {
                return category;
            }
        }
    }
    return "neutral";
}

// Input Handler
inputEl.addEventListener('input', () => {
    const userInput = inputEl.value;
    const finalMood = detectMood(userInput);
    
    // Update display
    detectedMoodEl.textContent = finalMood.charAt(0).toUpperCase() + finalMood.slice(1);
    detectedMoodEl.className = "text-3xl font-bold mood-badge";
    
    // Set mood-specific color
    if (finalMood === "angry") {
        detectedMoodEl.classList.add("bg-red-500");
    } else if (finalMood === "sad") {
        detectedMoodEl.classList.add("bg-blue-500");
    } else if (finalMood === "fearful") {
        detectedMoodEl.classList.add("bg-purple-700");
    } else if (finalMood === "confused") {
        detectedMoodEl.classList.add("bg-purple-500");
    } else if (finalMood === "calm") {
        detectedMoodEl.classList.add("bg-teal-500");
    } else if (finalMood === "happy") {
        detectedMoodEl.classList.add("bg-yellow-400", "text-gray-900");
    } else if (finalMood === "romantic") {
        detectedMoodEl.classList.add("bg-pink-500");
    } else if (finalMood === "thoughtful") {
        detectedMoodEl.classList.add("bg-indigo-500");
    } else if (finalMood === "creative") {
        detectedMoodEl.classList.add("bg-amber-500");
    } else if (finalMood === "motivated") {
        detectedMoodEl.classList.add("bg-green-500");
    } else {
        detectedMoodEl.classList.add("bg-gray-500");
    }
    
    visualDescriptionEl.textContent = getPreview(finalMood);

    // Update animation if mood changed
    if (finalMood !== currentMood) {
        currentMood = finalMood;
        initParticles();
    }
});

// Canvas resize handler
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// Particle class
class Particle {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 10 + 2;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        
        // Mood-specific properties
        if (currentMood === "angry") {
            this.color = `hsl(${Math.random() * 20}, 100%, 50%)`;
            this.speedX = (Math.random() - 0.5) * 10;
            this.speedY = (Math.random() - 0.5) * 10;
            this.size = Math.random() * 15 + 5;
        } 
        else if (currentMood === "sad") {
            this.color = `hsl(240, 100%, ${Math.random() * 30 + 50}%)`;
            this.speedX = (Math.random() - 0.5) * 1;
            this.speedY = Math.random() * 2 + 1;
        } 
        else if (currentMood === "fearful") {
            this.color = `hsl(${Math.random() * 60 + 270}, 70%, 30%)`;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
        } 
        else if (currentMood === "confused") {
            this.color = `hsl(${Math.random() * 60 + 270}, 100%, 60%)`;
            this.speedX = (Math.random() - 0.5) * 3;
            this.speedY = (Math.random() - 0.5) * 3;
        } 
        else if (currentMood === "calm") {
            this.color = `hsl(190, 100%, ${Math.random() * 30 + 60}%)`;
            this.speedX = (Math.random() - 0.5) * 1.5;
            this.speedY = (Math.random() - 0.5) * 1.5;
        } 
        else if (currentMood === "happy") {
            this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
            this.speedX = (Math.random() - 0.5) * 4;
            this.speedY = (Math.random() - 0.5) * 4;
        } 
        else if (currentMood === "romantic") {
            this.color = `hsl(${Math.random() * 20 + 330}, 100%, 70%)`;
            this.speedX = (Math.random() - 0.5) * 1;
            this.speedY = Math.random() * -1 - 0.5;
            this.size = Math.random() * 15 + 5;
        } 
        else if (currentMood === "thoughtful") {
            this.color = `hsl(${Math.random() * 60 + 240}, 100%, 70%)`;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = (Math.random() - 0.5) * 0.8;
        } 
        else if (currentMood === "creative") {
            this.color = `hsl(${Math.random() * 60 + 40}, 100%, 60%)`;
            this.speedX = (Math.random() - 0.5) * 2;
            this.speedY = (Math.random() - 0.5) * 2;
        } 
        else if (currentMood === "motivated") {
            this.color = `hsl(${Math.random() * 60 + 100}, 100%, 50%)`;
            this.speedX = 0;
            this.speedY = Math.random() * -3 - 1;
            this.size = Math.random() * 8 + 3;
        } 
        else {
            this.color = `hsl(0, 0%, ${Math.random() * 30 + 60}%)`;
            this.speedX = (Math.random() - 0.5) * 1;
            this.speedY = (Math.random() - 0.5) * 1;
        }
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off walls
        if (this.x <= 0 || this.x >= canvas.width) this.speedX *= -1;
        if (this.y <= 0 || this.y >= canvas.height) this.speedY *= -1;
        
        // Mood-specific behaviors
        if (currentMood === "angry") {
            if (Math.random() < 0.05) {
                this.speedX = (Math.random() - 0.5) * 10;
                this.speedY = (Math.random() - 0.5) * 10;
            }
        } 
        else if (currentMood === "sad") {
            if (this.y > canvas.height) {
                this.y = 0;
                this.x = Math.random() * canvas.width;
            }
        } 
        else if (currentMood === "fearful") {
            if (Math.random() < 0.1) {
                this.speedX = (Math.random() - 0.5) * 2;
                this.speedY = (Math.random() - 0.5) * 2;
            }
        } 
        else if (currentMood === "confused") {
            if (Math.random() < 0.1) {
                this.speedX = (Math.random() - 0.5) * 4;
                this.speedY = (Math.random() - 0.5) * 4;
            }
        } 
        else if (currentMood === "calm") {
            if (Math.random() < 0.02) {
                this.speedX = (Math.random() - 0.5) * 2;
                this.speedY = (Math.random() - 0.5) * 2;
            }
        } 
        else if (currentMood === "happy") {
            if (Math.random() < 0.05) {
                this.speedX = (Math.random() - 0.5) * 6;
                this.speedY = (Math.random() - 0.5) * 6;
            }
        }
        else if (currentMood === "romantic") {
            if (this.y < -50) {
                this.y = canvas.height + 50;
                this.x = Math.random() * canvas.width;
            }
        }
        else if (currentMood === "motivated") {
            if (this.y < -20) {
                this.y = canvas.height + 20;
                this.x = Math.random() * canvas.width;
            }
        }
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Add glow effect for some moods
        if (currentMood === "happy" || currentMood === "angry" || currentMood === "romantic") {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = this.color.replace(')', ', 0.3)').replace('hsl', 'hsla');
            ctx.fill();
        }
        
        // Draw hearts for romantic mood
        if (currentMood === "romantic") {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(Math.PI/4);
            ctx.fillStyle = this.color;
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            for (let i = 0; i < Math.PI * 2; i += 0.01) {
                const x = this.size * 16 * Math.pow(Math.sin(i), 3);
                const y = -this.size * (13 * Math.cos(i) - 5 * Math.cos(2*i) - 2 * Math.cos(3*i) - Math.cos(4*i));
                ctx.lineTo(x, y);
            }
            ctx.fill();
            ctx.restore();
        }
    }
}

// Initialize particles
function initParticles() {
    particles = [];
    const count = currentMood === "angry" ? 200 : 
                 currentMood === "sad" ? 300 : 
                 currentMood === "happy" ? 150 : particleCount;
    
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

// Animation loop
function animate() {
    ctx.fillStyle = currentMood === "neutral" ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    // Add special effects for certain moods
    if (currentMood === "fearful") {
        ctx.strokeStyle = `rgba(150, 0, 0, ${Math.random() * 0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(
            Math.random() * canvas.width, 
            Math.random() * canvas.height, 
            50 + Math.random() * 100, 
            30 + Math.random() * 70
        );
        ctx.stroke();
    }
    else if (currentMood === "thoughtful") {
        ctx.strokeStyle = `rgba(100, 150, 255, 0.3)`;
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            const size = 50 + Math.random() * 100;
            ctx.beginPath();
            ctx.arc(
                canvas.width / 2 + (Math.random() - 0.5) * 200,
                canvas.height / 2 + (Math.random() - 0.5) * 200,
                size, 0, Math.PI * 2
            );
            ctx.stroke();
        }
    }
    
    animationId = requestAnimationFrame(animate);
}

// Start everything
initParticles();
animate();
