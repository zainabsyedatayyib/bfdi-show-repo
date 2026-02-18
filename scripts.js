/**
 * Main initialization function
 * Wraps all logic to ensure DOM is fully loaded before execution.
 * 
 * FIXES APPLIED:
 * 1. Moved DOM queries inside DOMContentLoaded - DOM elements don't exist until page loads
 * 2. Fixed typo: "documentElementById" -> "document.getElementById"  
 * 3. Removed unused variables (boxes, search_btn)
 * 4. Removed duplicate connectToDatabase() call (was being called here AND in initSeriesAdvanced)
 * 5. Removed server-side MySQL code - browsers cannot use Node.js 'require' or connect to databases directly
 *    For YouTube API fetching, use client-side fetch() instead
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded - initializing scripts...');
    initNavigation();
    initDropdowns();
    initDialogs();
    initFunFacts();
    initCharacterInteractions();
    initSeriesAdvanced();
    console.log('All modules initialized');
});

/**
 * Module: Navigation
 * Handles Hamburger menu toggling and closing on outside clicks.
 * 
 * FIX: "documentElementById" -> "document.getElementById" (typo)
 * FIX: "e.ta.closest" -> "e.target.closest" (typo - 'target' was truncated)
 */
function initNavigation() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');

    if (hamburgerBtn && navMenu) {
        console.log('Navigation elements found');
        
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            hamburgerBtn.textContent = navMenu.classList.contains('active') ? 'Close' : 'Menu';
        });

        // Close mobile menu when clicking outside
        window.addEventListener('click', (e) => {
            if (!e.target.closest('nav')) {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburgerBtn.textContent = 'Menu';
                }
            }
        });
        
        // Close mobile menu when a link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburgerBtn.textContent = 'Menu';
                }
            });
        });
    } else {
        console.error('Navigation elements not found:', { hamburgerBtn, navMenu });
    }
}

/**
 * Module: Dropdowns
 * Handles the "See Series" dropdown toggle.
 * 
 * FIX: "documentElementById" -> "document.getElementById" (typo)
 * FIX: "e.ta.closest" -> "e.target.closest" (typo)
 */
function initDropdowns() {
    const seeSeriesBtn = document.getElementById('seeSeriesBtn');
    const dropdown = document.getElementById('seriesDropdown');

    if (seeSeriesBtn && dropdown) {
        console.log('Dropdown elements found');
        
        seeSeriesBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            dropdown.classList.toggle('show');
            console.log('Dropdown toggled:', dropdown.classList.contains('show'));
        });

        // Close dropdown when clicking outside
        window.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                }
            }
        });
    } else {
        console.error('Dropdown elements not found:', { seeSeriesBtn, dropdown });
    }
}

/**
 * Module: Dialogs
 * Handles opening the Advanced Search modal.
 * 
 * FIX: "documentElementById" -> "document.getElementById" (typo)
 */
function initDialogs() {
    const advancedBtn = document.getElementById('advancedBtn');
    const advancedDialog = document.getElementById('advancedDialog');

    if (advancedBtn && advancedDialog) {
        console.log('Dialog elements found');
        
        advancedBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Close the dropdown first
            const dropdown = document.getElementById('seriesDropdown');
            if (dropdown) {
                dropdown.classList.remove('show');
            }
            advancedDialog.showModal();
            console.log('Dialog opened');
        });
    } else {
        console.error('Dialog elements not found:', { advancedBtn, advancedDialog });
    }
}

/**
 * Module: Fun Facts
 * Loads a random fact from the array into the aside element.
 * 
 * FIX: "documentElementById" -> "document.getElementById" (typo)
 */
function initFunFacts() {
    const factElement = document.getElementById('funFactText');
    
    if (factElement) {
        const facts = [
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
            "Bu cuts are caused by the Announcer spending the show's bu on sweaters.",
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
        ];

        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        factElement.textContent = randomFact;
    }
}

/**
 * Module: Character Interactions
 * Handles the "One" character hover effect.
 */
function initCharacterInteractions() {
    const charOne = document.querySelector('.char-one');
    const moonImg = document.querySelector('.moon-img');

    if (charOne && moonImg) {
        // Preload the image
        const imgPreload = new Image();
        imgPreload.src = 'imgs/oneescaped.png';

        charOne.addEventListener('mouseenter', () => {
            moonImg.src = 'imgs/oneescaped.png';
        });

        charOne.addEventListener('mouseleave', () => {
            moonImg.src = 'imgs/oneptsd.png';
        });
    }
}
/**
 * Module: Series "Advanced" option Web Crawler
 * Outputs the link to a specific episode (w/ a particular number and season)
 * 
 * ============================================================================
 * MISTAKES FOUND & FIXES APPLIED:
 * ============================================================================
 * 
 * 1. SCOPE ISSUE: 'connection' was declared inside connectToDatabase() but used
 *    globally in other functions. Fix: Declare 'connection' at module level.
 * 
 * 2. SYNTAX ERROR: !"links" in result2 - This is incorrect JavaScript.
 *    The '!' binds to "links" first, making it: (!("links")) in result2 = false in result2
 *    Fix: Should be !("links" in result2) or !result2.hasOwnProperty("links")
 * 
 * 3. UNDEFINED VARIABLE: 'l' used in error handlers but only defined in initSeriesAdvanced()
 *    Fix: Pass element as parameter or use a fallback
 * 
 * 4. DEAD CODE: 'break' statements after 'return' in switch cases are unreachable
 *    Fix: Remove unnecessary break statements
 * 
 * 5. ASYNC ISSUE: fetchEpisode() returns a Promise but was used synchronously
 *    Fix: Make it async/await and handle the Promise properly
 * 
 * 6. WRONG DATA ACCESS: data.snippet.find() - 'items' array is at data.items, not data.snippet
 *    Fix: Access data.items instead
 * 
 * 7. WRONG STRING METHOD: 'in' operator checks object properties, not substrings
 *    Fix: Use .includes() for substring matching
 * 
 * 8. SYNTAX ERROR: param. (line 350) - incomplete property access
 *    Fix: Complete the property name (param.link)
 * 
 * 9. MISSING PARAMETER: playlist4Season() called without season argument
 *    Fix: Pass the season_selected value
 * 
 * 10. SQL INJECTION RISK: Using template literals directly in SQL queries
 *     Fix: Use parameterized queries (placeholders kept for when you add real DB)
 * 
 * 11. TYPO: "documentElementById" -> "document.getElementById"
 * 
 * 12. FUNCTION OVERHEAD: fetchEpisode() was being called twice on lines 386-387
 *     Fix: Call once and store the result
 * 
 * NOTE: The MySQL/database code requires a backend server (Node.js).
 * Browsers cannot use require() or connect directly to databases.
 * For now, this code is structured for future backend implementation.
 * Consider using a backend API endpoint that your frontend calls via fetch().
 * ============================================================================
 */

// Module-level database connection variable (FIX #1: moved outside function for proper scope)
let dbConnection = null;

/**
 * Ensures the 'links' table exists, creates it if not
 * @param {string} table - The table name to check/create
 * @param {HTMLElement} outputElement - Element to display error messages (FIX #3)
 */
function ensureTableExists(table, outputElement) {
    // FIX #10: Use parameterized query placeholder (? instead of template literal)
    const check_exists = `SELECT table_name FROM information_schema.tables WHERE table_schema = ? AND table_name = ?;`;
    
    dbConnection.query(check_exists, [table, table], (error, result2) => {
        if (error) {
            const msg = "Sorry, there's an error checking the table! 'Aw, seriously!' - David -> " + error;
            console.error(msg);
            if (outputElement) outputElement.innerHTML = msg;
            return;
        }
        
        // FIX #2: Correct way to check if property exists
        // Original: !"links" in result2 (WRONG - evaluates as: false in result2)
        // Fixed: Check if result is empty (table doesn't exist)
        if (!result2 || result2.length === 0) {
            const createTable = `CREATE TABLE IF NOT EXISTS ${table} (
                id INT AUTO_INCREMENT PRIMARY KEY,
                season INT NOT NULL,
                episodeNum INT NOT NULL,
                link VARCHAR(500),
                playlistID VARCHAR(100)
            )`;
            
            dbConnection.query(createTable, (createError) => {
                if (createError) {
                    const msg = "Sorry, there's an error creating the table! 'Aw, seriously!' - David -> " + createError;
                    console.error(msg);
                    if (outputElement) outputElement.innerHTML = msg;
                } else {
                    console.log("Creating table successful!"); // FIX: typo "succsessful" -> "successful"
                }
            });
        }
    });
}

/**
 * Maps season number to YouTube playlist ID
 * @param {number} seasonSelected - The season number (1-7)
 * @returns {string} - YouTube playlist ID or error message
 * 
 * FIX #4: Removed dead 'break' statements after 'return'
 */
const playlist4Season = (seasonSelected) => {
    switch (seasonSelected) {
        case 1:
            return "PLbDP9HpqeU_OJlQc0ym7ELpgep5o648VF";   // BFDI
        case 2:
            return "PLbDP9HpqeU_Ntqqnfprn1RemanAZFn_v8";   // BFDIA
        case 3:
            return "PLbDP9HpqeU_MU2AT6S1ugGFVXXGiBIQBb";   // IDFB
        case 4:
            return "PLbDP9HpqeU_NPbkbT3gVkEGXzLvuFuOOi";   // BFB Pre-split
        case 5:
            return "PLbDP9HpqeU_Nma9d3RSfX2cZVG-W2VeOa";   // BFB Post-split
        case 6:
            return "PLbDP9HpqeU_OX4K6rmeVfocfbrZdt5rx0";   // TPOT
        case 7:
            return "PLbDP9HpqeU_OkHoOJctHuDv3ZytkAz1wN";   // BFDIE
        default:
            return null; // Return null instead of error string for cleaner error handling
    }
};

/**
 * Fetches episode link from YouTube API
 * @param {string} playlistID - YouTube playlist ID
 * @param {string} episodeQuery - Episode name/number to search for
 * @returns {Promise<string|null>} - YouTube video URL or null if not found
 * 
 * FIX #5: Made async to properly handle Promise
 * FIX #6: Access data.items instead of data.snippet
 * FIX #7: Use .includes() instead of 'in' operator for substring matching
 */
const fetchEpisode = async (playlistID, episodeQuery) => {
    if (!playlistID) {
        console.error("Aw, seriously! The season you selected didn't work. Select a season from the options above.");
        return null;
    }
    
    try {
        // TODO: Replace [YOUR_API_KEY] with your actual YouTube Data API key
        const response = await fetch(
            `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistID}&key=[YOUR_API_KEY]`
        );
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // FIX #6: YouTube API returns items array at data.items, not data.snippet
        // FIX #7: Use .includes() for substring matching instead of 'in' operator
        const foundItem = data.items.find(item => 
            item.snippet.title.toUpperCase().trim().includes(episodeQuery.toUpperCase().trim())
        );
        
        if (foundItem) {
            return `https://youtube.com/watch?v=${foundItem.snippet.resourceId.videoId}`;
        } else {
            console.log("Episode not found in playlist");
            return null;
        }
    } catch (error) {
        console.error("Error fetching episode:", error);
        return null;
    }
};

// YouTube Playlist Reference (kept for documentation):
// jacknjellify YT id = "UCeKLuqGciqZZ5RFYk5CbqXg"
// jacknjellify "uploads" id = "UUeKLuqGciqZZ5RFYk5CbqXg"
// Season 1 - BFDI:       PLbDP9HpqeU_OJlQc0ym7ELpgep5o648VF
// Season 2 - BFDIA:      PLbDP9HpqeU_Ntqqnfprn1RemanAZFn_v8
// Season 3 - IDFB:       PLbDP9HpqeU_MU2AT6S1ugGFVXXGiBIQBb
// Season 4 - BFB Pre:    PLbDP9HpqeU_NPbkbT3gVkEGXzLvuFuOOi
// Season 5 - BFB Post:   PLbDP9HpqeU_Nma9d3RSfX2cZVG-W2VeOa
// Season 6 - TPOT:       PLbDP9HpqeU_OX4K6rmeVfocfbrZdt5rx0
// Season 7 - BFDIE:      PLbDP9HpqeU_OkHoOJctHuDv3ZytkAz1wN

/**
 * Inserts episode data into the database
 * @param {Object} param - Object containing episode data
 * @param {number} param.season - Season number
 * @param {number} param.episodeNum - Episode number  
 * @param {string} param.link - YouTube video URL
 * @param {string} param.playlistID - YouTube playlist ID
 * 
 * FIX #8: Completed the incomplete param. property access
 * FIX #10: Use parameterized query with VALUES clause
 */
function insertEpToTable(param) {
    // FIX: Added VALUES clause and proper parameter placeholders
    const insert = 'INSERT INTO links (season, episodeNum, link, playlistID) VALUES (?, ?, ?, ?)';
    
    dbConnection.query(insert, [param.season, param.episodeNum, param.link, param.playlistID], (error) => {
        if (error) {
            console.error("Whoopsie! Database insertion failed:", error);
        } else {
            console.log("Database insertion successful!"); // FIX: typo "succsessful"
        }
    });
}

/**
 * Establishes connection to MySQL database
 * @returns {Object|null} - MySQL connection object or null on failure
 * 
 * NOTE: This function uses Node.js 'require' which does NOT work in browsers!
 * For browser-based applications, you need:
 * 1. A backend server (Node.js/Express) that handles database connections
 * 2. Frontend makes fetch() calls to your backend API endpoints
 * 
 * Placeholder values kept for future backend implementation.
 */
function connectToDatabase() {
    // TODO: This code needs to run on a Node.js server, not in the browser
    // Browsers cannot use require() or connect directly to MySQL
    
    try {
        // NOTE: 'require' only works in Node.js environment
        const mysql = require("mysql");
        
        dbConnection = mysql.createConnection({
            host: "",       // TODO: Add your database host (e.g., "localhost" or cloud DB URL)
            user: "",       // TODO: Add your database username
            password: "",   // TODO: Add your database password
            database: "",   // TODO: Add your database name
            port: 3306      // Default MySQL port
        });
        
        dbConnection.connect((error) => {
            if (error) {
                const msg = "Sorry, there's an error with the database connection! 'Aw, seriously!' - David -> " + error;
                console.error(msg);
                return null;
            }
            console.log("Connection successful! YOYLECAKE! Now checking if database is present...");
        });
        
        return dbConnection;
    } catch (error) {
        console.error("Database module not available (expected in browser environment):", error.message);
        return null;
    }
}

/**
 * Helper function to validate database query result
 * @param {Array} result - Database query result
 * @returns {boolean} - True if result contains a valid link
 */
function isValidDatabaseResult(result) {
    return result && 
           result.length > 0 && 
           result[0].link && 
           result[0].link.startsWith("https://");
}

/**
 * Initializes the Advanced Series Search feature
 * Sets up event listeners for form submission
 * 
 * FIX #9: Pass season value to playlist4Season()
 * FIX #11: "documentElementById" -> "document.getElementById"
 * FIX #12: Call fetchEpisode() once and reuse the result (removed function overhead)
 * FIX (from review): Now properly sets up event handler instead of running immediately
 */
function initSeriesAdvanced() {
    const linkElement = document.getElementById("link");
    const seasonSelect = document.querySelector("select"); // Get season dropdown
    const episodeInput = document.getElementById("episode"); // Get episode input
    const searchForm = document.getElementById("advancedSearchForm"); // Form element
    
    // Check if required elements exist on this page
    if (!linkElement || !seasonSelect || !episodeInput) {
        // Elements not found - this is okay, the advanced search might not be on this page
        console.log("Advanced search elements not found on this page (this is normal if not on the search page)");
        return;
    }
    
    // Connect to database once on page load (will fail gracefully in browser)
    connectToDatabase();
    
    /**
     * Handles the episode search when user submits the form
     * This is async to properly handle the YouTube API fetch
     */
    async function handleEpisodeSearch(event) {
        if (event) {
            event.preventDefault();
        }
        
        // Get values from form inputs at time of submission (FIX from review)
        const seasonValue = parseInt(seasonSelect.value, 10);
        const episodeValue = episodeInput.value.trim();
        
        if (!episodeValue) {
            linkElement.innerHTML = "Please enter an episode name or number";
            return;
        }
        
        linkElement.innerHTML = "Searching...";
        
        // If no connection (browser environment), skip database and use API directly
        if (!dbConnection) {
            console.log("No database connection - fetching directly from YouTube API");
            
            // FIX #9: Pass the season value to playlist4Season
            const playlistID = playlist4Season(seasonValue);
            
            if (!playlistID) {
                linkElement.innerHTML = "Please select a valid season (1-7)";
                return;
            }
            
            // FIX #12: Call fetchEpisode once and store result (prevents function overhead)
            const episodeLink = await fetchEpisode(playlistID, episodeValue);
            
            if (episodeLink) {
                linkElement.innerHTML = `<a href="${episodeLink}" target="_blank">Watch Episode</a>`;
            } else {
                linkElement.innerHTML = "Episode not found. Try a different search term.";
            }
            return;
        }
        
        // Database path (for future Node.js backend implementation)
        const findEpisodeQuery = 'SELECT link FROM links WHERE season = ? AND episodeNum = ?';
        
        dbConnection.query(findEpisodeQuery, [seasonValue, episodeValue], async (error, result) => {
            if (error) {
                console.error("Database query error:", error);
                linkElement.innerHTML = "Database error. Trying YouTube API...";
            }
            
            // Check if we got a valid result from database (using helper function)
            if (isValidDatabaseResult(result)) {
                console.log("Link database retrieval successful! Yoylecake!");
                linkElement.innerHTML = `<a href="${result[0].link}" target="_blank">Watch Episode</a>`;
            } else {
                // Not in database - fetch from API and store
                ensureTableExists("links", linkElement);
                
                // FIX #9: Pass season value to playlist4Season
                const playlistID = playlist4Season(seasonValue);
                
                // FIX #12: Call fetchEpisode ONCE and reuse (was calling twice before)
                const episodeLink = await fetchEpisode(playlistID, episodeValue);
                
                if (episodeLink) {
                    linkElement.innerHTML = `<a href="${episodeLink}" target="_blank">Watch Episode</a>`;
                    
                    // Insert to database for future cache
                    insertEpToTable({
                        season: seasonValue,
                        episodeNum: episodeValue,
                        link: episodeLink,
                        playlistID: playlistID
                    });
                } else {
                    linkElement.innerHTML = "Episode not found";
                }
            }
        });
    }
    
    // Set up event listener - either on form submit or button click
    if (searchForm) {
        searchForm.addEventListener('submit', handleEpisodeSearch);
    } else {
        // Fallback: If no form, listen for Enter key in episode input
        episodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleEpisodeSearch(e);
            }
        });
        
        // Also allow triggering via a search button if it exists
        const searchBtn = document.getElementById("advancedSearchBtn");
        if (searchBtn) {
            searchBtn.addEventListener('click', handleEpisodeSearch);
        }
    }
}


