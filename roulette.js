/**
 * ========================================
 * FIREY'S ROULETTE - ANIMATION SYSTEM
 * ========================================
 * 
 * This script handles the "bottle flip" style throwing animation.
 * 
 * ANIMATION PHASES:
 * 1. WIND-UP: Hand pulls back with a slight skew (anticipation)
 * 2. THROW: Hand snaps forward, releasing Firey
 * 3. FLIGHT: Firey goes up, rotates like a bottle flip
 * 4. LANDING: Random outcome - perfect, upside down, or fallen
 * 5. RESET: Everything returns to starting position
 * 
 * BOTTLE FLIP PHYSICS:
 * - Real bottle flips rotate around 180-540 degrees
 * - The weight distribution determines landing
 * - We simulate this with randomized rotation + easing
 */

document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // ELEMENT REFERENCES
    // ========================================
    const f = document.querySelector(".f_asset");
    const hand = document.querySelector(".hand-img");
    const handWrapper = document.querySelector(".hand-wrapper");

    const ground = document.getElementById("ground");
    const throwBtn = document.getElementById("throwBtn");
    const fallCount = document.getElementById("fall-count");
    const pokeCount = document.getElementById("poke-count");
    const successCount = document.getElementById("success-count");

    // ========================================
    // GAME STATE
    // ========================================
    let isAnimating = false;
    let falls = 0;
    let pokes = 0;
    let successes = 0;

    // ========================================
    // STARTING POSITION STORAGE
    // ========================================
    // We need to store initial positions to reset after animation
    const initialState = {
        f: {
            bottom: f.style.bottom || '55%',
            right: f.style.right || '60%',
            rotation: 0,
            scale: 1
        }
    };

    // ========================================
    // LANDING OUTCOMES
    // ========================================
    /**
     * Each outcome has:
     * - rotation: Final rotation angle (degrees)
     * - probability: Chance of this outcome (should sum to 1)
     * - className: CSS class for visual indicator
     * - isSuccess: Whether this counts as a successful throw
     */
    const outcomes = [
        {
            name: 'perfect',
            rotation: 360,      // Full rotation, lands upright
            probability: 0.3,   // 30% chance
            className: 'landed-perfect',
            isSuccess: true
        },
        {
            name: 'upside-down',
            rotation: 540,      // 1.5 rotations, lands on head
            probability: 0.35,  // 35% chance
            className: 'landed-upside',
            isSuccess: false
        },
        {
            name: 'fallen',
            rotation: 450,      // Lands on side (90° from upright)
            probability: 0.35,  // 35% chance
            className: 'landed-fallen',
            isSuccess: false
        }
    ];

    // ========================================
    // HELPER FUNCTIONS
    // ========================================
    
    /**
     * Selects a random outcome based on probability weights
     * Uses weighted random selection algorithm
     */
    function getRandomOutcome() {
        const rand = Math.random();
        let cumulative = 0;
        
        for (const outcome of outcomes) {
            cumulative += outcome.probability;
            if (rand <= cumulative) {
                return outcome;
            }
        }
        return outcomes[0]; // Fallback
    }

    /**
     * Clears all landing state classes from Firey
     */
    function clearLandingClasses() {
        f.classList.remove('landed-perfect', 'landed-upside', 'landed-fallen');
    }

    /**
     * Updates the score display
     */
    function updateScores() {
        fallCount.textContent = falls;
        pokeCount.textContent = pokes;
        successCount.textContent = successes;
    }

    /**
     * Triggers the hurt flash effect on the hand
     */
    function triggerHurtEffect() {
        hand.classList.remove('hurt');
        // Force reflow to restart animation
        void hand.offsetWidth;
        hand.classList.add('hurt');
        
        // Remove class after animation completes
        setTimeout(() => {
            hand.classList.remove('hurt');
        }, 300);
    }

    // ========================================
    // POSITION CALCULATION HELPERS
    // ========================================
    
    /**
     * Calculates how far Firey needs to fall to reach the ground
     * This measures from Firey's current position to the bottom of the viewport
     */
    function calculateFallDistance() {
        const fireyRect = f.getBoundingClientRect();
        const groundRect = ground.getBoundingClientRect();
        // Distance from bottom of Firey to top of ground hitbox
        return groundRect.top - fireyRect.bottom + fireyRect.height;
    }

    /**
     * Gets the starting position of Firey relative to the hand
     * Used for respawning Firey back to the hand
     */
    function getSpawnPosition() {
        return { x: 0, y: 0 }; // Original position relative to hand-wrapper
    }

    // ========================================
    // MAIN ANIMATION FUNCTION
    // ========================================
    function performThrow() {
        if (isAnimating) return;
        
        isAnimating = true;
        throwBtn.disabled = true;
        clearLandingClasses();

        // Don't increment any counter here - wait for outcome

        const outcome = getRandomOutcome();
        
        const tl = gsap.timeline({
            onComplete: () => {
                showResult(outcome);
            }
        });

        // ========================================
        // PHASE 1: QUICK JOLT (Hand throws Firey up)
        // ========================================
        tl.to(hand, {
            duration: 0.15,
            skewX: 15,
            rotation: 8,
            ease: "power2.out"
        });

        tl.to(f, {
            duration: 0.15,
            rotation: -8,
            ease: "power2.out"
        }, "<");

        // ========================================
        // PHASE 2: FLIGHT (Firey goes up, spins)
        // ========================================
        const flightHeight = -150;
        const spinRotation = outcome.rotation + (Math.random() * 15 - 7);
        
        const horizontalDrift = outcome.name === 'fallen' 
            ? (Math.random() * 50 + 30) * (Math.random() > 0.5 ? 1 : -1)
            : (Math.random() * 15 - 7);

        // ASCENT
        tl.to(f, {
            duration: 0.3,
            y: flightHeight,
            x: horizontalDrift * 0.3,
            rotation: spinRotation * 0.5,
            scale: 1.1,
            ease: "power2.out"
        }, "-=0.05");

        // Hand returns to neutral
        tl.to(hand, {
            duration: 0.2,
            skewX: 0,
            rotation: 0,
            ease: "power2.out"
        }, "-=0.2");

        // ========================================
        // PHASE 3: DESCENT (Outcome-dependent)
        // ========================================
        
        if (outcome.name === 'perfect') {
            // PERFECT: Simple catch
            tl.to(f, {
                duration: 0.35,
                y: 0,
                x: 0,
                rotation: 360,
                scale: 1,
                ease: "power2.in"
            });

            // Small squash on landing
            tl.to(f, {
                duration: 0.1,
                scaleY: 0.9,
                scaleX: 1.08,
                ease: "power2.out"
            });

            tl.to(f, {
                duration: 0.15,
                scaleY: 1,
                scaleX: 1,
                ease: "power2.out"
            });

        } else if (outcome.name === 'upside-down') {
            // UPSIDE-DOWN: Lands higher, poking hand
            tl.to(f, {
                duration: 0.35,
                y: -40,
                x: 0,
                rotation: 540,
                scale: 1,
                ease: "power2.in",
                onComplete: () => {
                    triggerHurtEffect();  // Flash red on poke impact
                }
            });

            // Hand reacts - pushed down
            tl.to(hand, {
                duration: 0.12,
                y: 4,
                ease: "power2.out"
            }, "-=0.1");

            // Small wobble then settle
            tl.to(f, {
                duration: 0.15,
                rotation: 545,
                ease: "power1.out"
            });
            tl.to(f, {
                duration: 0.12,
                rotation: 540,
                ease: "power2.out"
            });

            // Hand settles
            tl.to(hand, {
                duration: 0.2,
                y: 0,
                ease: "power2.out"
            }, "-=0.15");

        } else {
            // FALLEN: Drops to ground
            const fallDistance = calculateFallDistance();

            // Firey falls to ground
            tl.to(f, {
                duration: 0.6,
                y: fallDistance,
                x: horizontalDrift,
                rotation: spinRotation + 90,
                scale: 1,
                ease: "power2.in"
            });

            // Impact squash
            tl.to(f, {
                duration: 0.08,
                scaleY: 0.7,
                scaleX: 1.2,
                ease: "power2.in"
            });

            // Settle
            tl.to(f, {
                duration: 0.15,
                scaleY: 1,
                scaleX: 1,
                x: horizontalDrift + 10,
                ease: "power2.out"
            });
        }

        return tl;
    }

    // ========================================
    // RESULT DISPLAY & RESET
    // ========================================
    function showResult(outcome) {
        f.classList.add(outcome.className);

        // Update appropriate counter based on outcome
        if (outcome.isSuccess) {
            successes++;
        } else if (outcome.name === 'upside-down') {
            pokes++;
        } else if (outcome.name === 'fallen') {
            falls++;
        }
        updateScores();

        setTimeout(() => {
            respawnToHand();
        }, 1200);
    }

    /**
     * Respawns Firey back to the hand position
     * Only does the full respawn animation if Firey fell to the ground
     * Otherwise just resets the rotation/scale
     */
    function respawnToHand() {
        clearLandingClasses();

        const respawnTl = gsap.timeline({
            onComplete: () => {
                isAnimating = false;
                throwBtn.disabled = false;
            }
        });

        // Check if Firey is on the ground (fallen) or in hand
        const currentY = gsap.getProperty(f, "y");
        const isOnGround = currentY > 100;  // If Y > 100, it's on the ground

        if (isOnGround) {
            // Full respawn animation for fallen Firey
            respawnTl.to(f, {
                duration: 0.25,
                opacity: 0,
                scale: 0.7,
                ease: "power2.in"
            });

            respawnTl.set(f, {
                x: 0,
                y: 0,
                rotation: 0,
                scale: 0.5
            });

            respawnTl.to(f, {
                duration: 0.35,
                opacity: 1,
                scale: 1.15,
                ease: "back.out(1.7)"
            });

            respawnTl.to(f, {
                duration: 0.15,
                scale: 1,
                ease: "power2.out"
            });
        } else {
            // Reset for caught outcomes (perfect or upside-down)
            // First reset rotation while keeping current position
            respawnTl.to(f, {
                duration: 0.2,
                rotation: 0,
                scaleX: 1,
                scaleY: 1,
                ease: "power2.out"
            });
            
            // Then animate back to origin position
            respawnTl.to(f, {
                duration: 0.25,
                x: 0,
                y: 0,
                ease: "power2.inOut"
            });
        }
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================
    throwBtn.addEventListener('click', performThrow);

    // Optional: Keyboard support (press Space to throw)
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !isAnimating) {
            e.preventDefault();
            performThrow();
        }
    });

    // ========================================
    // INITIALIZATION
    // ========================================
    console.log("🔥 Firey's Roulette loaded! Click 'Throw!' or press Space to play.");
});