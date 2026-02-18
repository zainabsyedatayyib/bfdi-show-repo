/**
 * BFDI Website - Main Scripts
 * 
 * This file handles all client-side interactions including:
 * - Navigation (hamburger menu)
 * - Dropdowns (series dropdown)
 * - Dialogs (advanced search modal)
 * - Fun facts display
 * - Character interactions (hover effects)
 * - Series advanced search (YouTube API integration - in progress)
 * 
 * @author Zainab Syeda Tayyab
 */

'use strict';

/* ==========================================================================
   CONSTANTS & CONFIGURATION
   ========================================================================== */

/**
 * YouTube playlist IDs for each BFDI season.
 * Used by the advanced search feature to fetch episode links.
 */
const PLAYLIST_IDS = Object.freeze({
    1: 'PLbDP9HpqeU_OJlQc0ym7ELpgep5o648VF',  // BFDI
    2: 'PLbDP9HpqeU_Ntqqnfprn1RemanAZFn_v8',  // BFDIA
    3: 'PLbDP9HpqeU_MU2AT6S1ugGFVXXGiBIQBb',  // IDFB
    4: 'PLbDP9HpqeU_NPbkbT3gVkEGXzLvuFuOOi',  // BFB Pre-split
    5: 'PLbDP9HpqeU_Nma9d3RSfX2cZVG-W2VeOa',  // BFB Post-split
    6: 'PLbDP9HpqeU_OX4K6rmeVfocfbrZdt5rx0',  // TPOT
    7: 'PLbDP9HpqeU_OkHoOJctHuDv3ZytkAz1wN'   // BFDIE
});

/**
 * Fun facts about BFDI to display randomly.
 */
const FUN_FACTS = Object.freeze([
    "The number 2,763 appears constantly because it's the distance in miles from Yoyleland to the Pillary Ruins.",
    "In BFDI 1a, the Announcer's UFO is actually a scaled-down asset from Cary's 'The Solar System' video.",
    "Leafy's asset is flipped horizontally in several episodes of Season 1 without explanation.",
    "David's 'Aw, Seriously?' voice clip is actually Cary Huang's voice pitched up significantly.",
    "Black Hole is the only contestant who has never physically touched the ground.",
    "Teardrop's silence is contractually obligated according to a joke in a subscriber special.",
    "The font used for the points display in BFDIA is 'Impact', while the main subtitles use 'Arial'.",
    "Firey is the only character to have slapped Coiny more than 50 times on screen.",
    "Bubble's 'Yoylecake' line was improvised during recording and became canon.",
    "The character 'Nonexisty' technically appears in every single frame of the show.",
    "In IDFB 1, the wall texture inside the museum is a photo of Michael Huang's actual bedroom wall.",
    "Gelatin's steakhouse has a 1-star rating on Yelp in the BFDI universe canon.",
    "Woody's scream is a stock sound effect mixed with Michael's voice.",
    "The 'Bleh' team name was chosen because the team couldn't decide on a name in time.",
    "Four's screech sound wave is actually a visual representation of the audio file in the animation.",
    "X's basket is made of woven Yoyleberry vines, which are native to Yoyleland.",
    "Donut's 'cherry' filling was originally going to be strawberry jam in early drafts.",
    "Barf Bag's 'molecules' inside her are just green circles with low opacity.",
    "The asset for 'Dream Island' is just a stock photo of an island with a filter applied.",
    "In BFB 13, you can see a single frame where Saw's handle detaches due to an animation error.",
    "Gaty's hinges are on the wrong side in her original asset compared to how she opens.",
    "Clock's hands actually move in real-time during some scenes in BFB, matching the video length.",
    "Fanny's fan blades spin counter-clockwise, which would actually push air backwards physically.",
    "Remote's batteries are brand 'Double A-A', a pun on the battery size AA.",
    "Tree's leaves are a single vector shape, not individual leaves, to save animation time.",
    "Liy's light switch actually works and turns off the sun in a deleted scene.",
    "Pillow's research notes are written in gibberish text that looks like handwriting.",
    "Pen's cap has been removed exactly 3 times in the entire series.",
    "Eraser's pink color code is exactly #FF66CC.",
    "Blocky's prank on Bubble in BFDI 2 used a real pin asset instead of a drawn one.",
    "Snowball's asset is just a white circle with a gradient, making him one of the simplest assets.",
    "Golf Ball's dimples were hand-drawn in every frame of the original season.",
    "Rocky's vomit is a green slime asset reused from a previous Carykh animation about chemistry.",
    "Needle's slap sound is the same stock sound effect used in 'Tom and Jerry'.",
    "Pin's point is sharp enough to pop Bubble from 5 feet away according to the BFDI Guidebook.",
    "Coiny's copper texture oxidizes slightly in BFDIA, turning slightly green.",
    "Firey's flame animation is a 4-frame loop that repeats constantly.",
    "Flower's petals would fall off if she shook her head too hard in early Flash animations.",
    "Book's definition of 'H' inside her pages is just the letter H repeated over and over.",
    "Yellow Face's ads are legally unskippable in the BFDI universe.",
    "Purple Face was hiding in the sidebar of the jacknjellify website for years before appearing.",
    "The 'Goiky' map is geographically impossible as the canal cuts through a mountain range.",
    "Yoyle City's population is officially 0, as everyone moved to the Pillary Ruins.",
    "The Evil Leafy maze game was actually playable on the old bfdi.tv website.",
    "The HPRC (Hand Powered Recovery Center) costs $1,000,000 in-universe currency.",
    "Budget cuts are caused by the Announcer spending the show's budget on sweaters.",
    "The TLC fits infinite people because it uses non-Euclidean geometry.",
    "Four's hand has 4 fingers, but sometimes 5 in error frames in BFB.",
    "Two's power comes from their British accent, according to a joke by the creators.",
    "The sun wears sunglasses because it's 'cool', not because of brightness.",
    "Gravity is 50% weaker in Yoyleland, allowing for higher jumps.",
    "The bugs in BFDIA are a reference to a coding bug in a game Cary made.",
    "Gelatin has exactly 10,000 forks in his supply.",
    "Coiny was originally going to be a penny, but was changed to a generic gold coin.",
    "Pen is a ballpoint pen, specifically a Bic Cristal reference.",
    "Blocky is made of wood, which is why he floats.",
    "Eraser tastes like rubber, which is why nobody eats him.",
    "Golf Ball is a Titleist brand ball, though the logo is removed.",
    "Tennis Ball is a Wilson brand ball, referenced by his fuzzy texture.",
    "Ruby is a corundum, which is the mineral species of ruby and sapphire.",
    "Ice Cube is made of tap water, not spring water.",
    "Leafy is a lemon leaf, which explains her shape.",
    "Teardrop is a saltwater tear, not freshwater.",
    "Rocky is a granite rock, common in the Goiky region.",
    "Spongy is a kitchen sponge, not a sea sponge.",
    "Flower is a daisy, despite looking like a generic flower.",
    "Woody is balsa wood, which is why he breaks so easily.",
    "Roboty speaks in Morse code, and his messages are often insults.",
    "Balloony is a latex balloon filled with helium.",
    "Loser is a cube of unknown material, possibly fool's gold.",
    "Cake is chocolate cake, confirmed by the crumbs.",
    "Eggy is a chicken egg, not a duck egg.",
    "Fanny is a desk fan, likely a Vornado model.",
    "Pie is blueberry, confirmed in a tweet by the creator.",
    "Remote is a universal TV remote.",
    "Tree is an oak tree, based on the leaf shape.",
    "Black Hole is a singularity with infinite density.",
    "Bottle is glass, making her very fragile.",
    "Liy is a light switch, specifically a toggle switch.",
    "Pillow is a bed pillow, filled with down feathers.",
    "The Announcer weighs 1000 pounds due to being made of dense metal.",
    "Four weighs 4 pounds, fitting his name.",
    "X weighs 7 pounds, fitting his value.",
    "Two weighs 2 pounds, fitting his name.",
    "Purple Face weighs 150 pounds, same as Yellow Face.",
    "Evil Leafy weighs 0 pounds because she is a ghost/demon.",
    "Dream Island weighs 1,000,000 tons.",
    "Yoylecake weighs 10 pounds per slice due to the metal content.",
    "The fish monster is named 'Fishy' in the project files.",
    "The dragon is named 'Draggy' in the project files.",
    "Yoyle Needy is exactly 2,763 feet tall.",
    "The Summit is the highest point in Goiky.",
    "The Cliff is where most eliminations happen.",
    "The Volcano is actually a dormant geyser that Firey activated.",
    "Cary can recite Pi to many digits, which inspired the number jokes.",
    "Michael is a programmer, which inspired the algorithmic challenges.",
    "BFDI is made in California, which explains the accents.",
    "The Huang twins were born in 1997.",
    "BFDI started when they were 12 years old.",
    "New episodes come out every few months due to the high animation quality.",
    "The animation quality has improved from 12fps to 24fps.",
    "The writing has matured from random humor to character-driven plots.",
    "The characters have developed complex relationships over 10 years.",
    "The lore has deepened to include ancient civilizations like Yoyle City.",
    "The mystery of the Announcer's origin was solved in BFB 28.",
    "Battle for Dream Island is the longest-running object show on YouTube."
]);

/* ==========================================================================
   MAIN INITIALIZATION
   ========================================================================== */

/**
 * Initialize all modules when DOM is fully loaded.
 * This ensures all elements are available before attaching event listeners.
 */
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initDropdowns();
    initDialogs();
    initFunFacts();
    initCharacterInteractions();
    initSeriesAdvanced();
});

/* ==========================================================================
   MODULE: NAVIGATION
   ========================================================================== */

/**
 * Initializes the hamburger menu navigation.
 * Handles toggling the menu and closing it when clicking outside or on links.
 */
function initNavigation() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');

    if (!hamburgerBtn || !navMenu) {
        return;
    }

    /**
     * Updates the hamburger button text based on menu state.
     * @param {boolean} isActive - Whether the menu is currently active
     */
    const updateButtonText = (isActive) => {
        hamburgerBtn.textContent = isActive ? 'Close' : 'Menu';
    };

    /**
     * Closes the navigation menu.
     */
    const closeMenu = () => {
        navMenu.classList.remove('active');
        updateButtonText(false);
    };

    // Toggle menu on hamburger button click
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        updateButtonText(navMenu.classList.contains('active'));
    });

    // Close menu when clicking outside the nav
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

/* ==========================================================================
   MODULE: DROPDOWNS
   ========================================================================== */

/**
 * Initializes the "See Series" dropdown functionality.
 * Handles showing/hiding the dropdown and closing on outside clicks.
 */
function initDropdowns() {
    const seeSeriesBtn = document.getElementById('seeSeriesBtn');
    const dropdown = document.getElementById('seriesDropdown');

    if (!seeSeriesBtn || !dropdown) {
        return;
    }

    /**
     * Closes the dropdown menu.
     */
    const closeDropdown = () => {
        dropdown.classList.remove('show');
    };

    // Toggle dropdown on button click
    seeSeriesBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        dropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown') && dropdown.classList.contains('show')) {
            closeDropdown();
        }
    });
}

/* ==========================================================================
   MODULE: DIALOGS
   ========================================================================== */

/**
 * Initializes the advanced search dialog.
 * Opens a modal dialog when the advanced button is clicked.
 */
function initDialogs() {
    const advancedBtn = document.getElementById('advancedBtn');
    const advancedDialog = document.getElementById('advancedDialog');

    if (!advancedBtn || !advancedDialog) {
        return;
    }

    advancedBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Close the dropdown first
        const dropdown = document.getElementById('seriesDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
        
        advancedDialog.showModal();
    });
}

/* ==========================================================================
   MODULE: FUN FACTS
   ========================================================================== */

/**
 * Displays a random fun fact in the designated element.
 */
function initFunFacts() {
    const factElement = document.getElementById('funFactText');
    
    if (!factElement) {
        return;
    }

    const randomIndex = Math.floor(Math.random() * FUN_FACTS.length);
    factElement.textContent = FUN_FACTS[randomIndex];
}

/* ==========================================================================
   MODULE: CHARACTER INTERACTIONS
   ========================================================================== */

/**
 * Initializes character hover interactions.
 * Currently handles the "One" character hover effect on the moon image.
 */
function initCharacterInteractions() {
    const charOne = document.querySelector('.char-one');
    const moonImg = document.querySelector('.moon-img');

    if (!charOne || !moonImg) {
        return;
    }

    // Preload the hover image to prevent flickering
    const imgPreload = new Image();
    imgPreload.src = 'imgs/oneescaped.png';

    charOne.addEventListener('mouseenter', () => {
        moonImg.src = 'imgs/oneescaped.png';
    });

    charOne.addEventListener('mouseleave', () => {
        moonImg.src = 'imgs/oneptsd.png';
    });
}

/* ==========================================================================
   MODULE: SERIES ADVANCED SEARCH
   ========================================================================== */

/**
 * Gets the YouTube playlist ID for a given season number.
 * @param {number} season - The season number (1-7)
 * @returns {string|null} The playlist ID or null if invalid season
 */
function getPlaylistIdForSeason(season) {
    const seasonNum = parseInt(season, 10);
    return PLAYLIST_IDS[seasonNum] || null;
}

/**
 * Sanitizes user input to prevent XSS attacks.
 * @param {string} input - The user input to sanitize
 * @returns {string} The sanitized input
 */
function sanitizeInput(input) {
    if (typeof input !== 'string') {
        return '';
    }
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

/**
 * Initializes the advanced series search feature.
 * Currently displays a placeholder message while the feature is in progress.
 * 
 * TODO: Implement YouTube API integration for episode lookup
 * TODO: Add database caching for episode links (requires backend)
 */
function initSeriesAdvanced() {
    const linkElement = document.getElementById('link');
    
    if (!linkElement) {
        return;
    }

    // Display placeholder message - feature is in progress
    linkElement.textContent = "Aw, seriously! It's currently in progress, and we're so very sorry. In the meantime, try clicking 'Normal'.";
}

/* ==========================================================================
   FUTURE: DATABASE INTEGRATION (Server-Side Only)
   ==========================================================================
   
   The following functionality requires a backend server and cannot run
   in the browser. When implementing the backend, consider:
   
   1. Use parameterized queries to prevent SQL injection
   2. Store API keys in environment variables, never in client code
   3. Implement proper error handling and logging
   4. Add rate limiting for API calls
   5. Cache responses to reduce API usage
   
   Database Configuration (to be set in environment variables):
   - DB_HOST: Database host
   - DB_USER: Database username
   - DB_PASSWORD: Database password
   - DB_NAME: Database name
   - DB_PORT: Database port
   - YOUTUBE_API_KEY: YouTube Data API key
   
   Example table schema for caching episode links:
   
   CREATE TABLE IF NOT EXISTS episode_links (
       id INT AUTO_INCREMENT PRIMARY KEY,
       season INT NOT NULL,
       episode_num INT NOT NULL,
       link VARCHAR(500) NOT NULL,
       playlist_id VARCHAR(100) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       UNIQUE KEY unique_episode (season, episode_num)
   );
   
   ========================================================================== */

