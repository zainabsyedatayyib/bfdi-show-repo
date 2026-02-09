/**
 * Character Page JavaScript
 * Handles dynamic content and interactions for character profile cards
 */
// DOM Element References
const profileImage = document.getElementById('profileImage');
const profileName = document.getElementById('profileName');
const profileBadge = document.getElementById('profileBadge');
const profileDescription = document.getElementById('profileDescription');

import json_data from './searchdata.json' with {type: "json"};

// Character data object
const defaultObj = new Object ({
    name: "PROFILY UNKNOWNY",
    badge: undefined,
    desc: "A description was not set for this profile.",
    image: "imgs/profily.png",
}); 

// Store current character for go2link
let currentCharacter = defaultObj;

/**
 * Navigate to an external link (e.g., wiki page)
 */
function go2link() {
    window.open("https://battlefordreamisland.fandom.com/wiki/" + currentCharacter.name, '_blank');
}

// Make go2link available globally for onclick
window.go2link = go2link;

function setProfily(obj){
    currentCharacter = obj;
    profileName.innerHTML = obj.name;
    profileBadge.innerHTML = obj.badge || '';
    profileDescription.innerHTML = obj.desc;
    profileImage.setAttribute("src", obj.image);
    profileImage.setAttribute("alt", obj.name);
}

(()=>{
    // Get character from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const searchKey = urlParams.get('char') ? urlParams.get('char').toLowerCase() : null;
    const jsonKeys = Object.keys(json_data.things2search);
    
    if (searchKey && jsonKeys.includes(searchKey)) {
        setProfily(json_data.things2search[searchKey]);
    } else {
        // Redirect to whoopsie page with the search term
        window.location.href = `whoopsie.html?char=${encodeURIComponent(searchKey || 'unknown')}`;
    }
})();
