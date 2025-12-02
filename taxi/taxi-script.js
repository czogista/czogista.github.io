// Taxi Calculator JavaScript using OpenStreetMap/Nominatim (no API key needed)
let debounceTimer;

// Language state
let currentLanguage = 'en'; // Default to English US

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupAddressAutocomplete();
    loadLanguagePreference();
    updateLanguage();
});

function goHome() {
    window.location.href = 'https://maleka.dev/';
}

// Language switching functionality
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'cs' : 'en';
    localStorage.setItem('preferredLanguage', currentLanguage);
    updateLanguage();
}

function loadLanguagePreference() {
    const saved = localStorage.getItem('preferredLanguage');
    if (saved && (saved === 'en' || saved === 'cs')) {
        currentLanguage = saved;
    }
}

function updateLanguage() {
    const elements = document.querySelectorAll('[data-en], [data-cs]');
    elements.forEach(element => {
        const text = element.getAttribute(`data-${currentLanguage}`);
        if (text) {
            element.textContent = text;
        }
        
        // Handle placeholders for input elements
        const placeholder = element.getAttribute(`data-${currentLanguage}-placeholder`);
        if (placeholder && element.tagName === 'INPUT') {
            element.placeholder = placeholder;
        }
    });
    
    // Update language toggle button
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        if (currentLanguage === 'en') {
            langToggle.textContent = '🇨🇿 Čeština';
        } else {
            langToggle.textContent = '🇺🇸 English';
        }
    }
    
    // Update HTML lang attribute and page title  
    document.documentElement.lang = currentLanguage === 'en' ? 'en-US' : 'cs';
    document.title = currentLanguage === 'en' 
        ? 'Private Taxi Calculator - Maleka DEV'
        : 'Kalkulačka soukromého taxi - Maleka DEV';
}

function setupAddressAutocomplete() {
    const startInput = document.getElementById('startAddress');
    const endInput = document.getElementById('endAddress');

    // Add event listeners for manual autocomplete
    startInput.addEventListener('input', function() {
        handleAddressInput(this, 'startSuggestions');
    });

    endInput.addEventListener('input', function() {
        handleAddressInput(this, 'endSuggestions');
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.input-group')) {
            hideSuggestions('startSuggestions');
            hideSuggestions('endSuggestions');
        }
    });
}

function handleAddressInput(input, suggestionsId) {
    const query = input.value.trim();
    
    if (query.length < 3) {
        hideSuggestions(suggestionsId);
        return;
    }

    // Debounce the API calls
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        searchAddresses(query, suggestionsId, input);
    }, 300);
}

async function searchAddresses(query, suggestionsId, input) {
    try {
        // Use Nominatim (OpenStreetMap) geocoding service - free and no API key needed
        // Added accept-language parameter to force English/Czech results instead of Polish
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=cz&accept-language=en,cs&q=${encodeURIComponent(query)}`;
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'TaxiCalculator/1.0 (https://maleka.dev)', // Required by Nominatim
                'Accept-Language': 'en-US,en;q=0.9,cs;q=0.8' // Prefer English, then Czech
            }
        });
        
        if (!response.ok) throw new Error('Search failed');
        
        const results = await response.json();
        
        if (results && results.length > 0) {
            const predictions = results.map(result => ({
                description: result.display_name,
                place_id: result.place_id,
                lat: parseFloat(result.lat),
                lon: parseFloat(result.lon)
            }));
            
            showSuggestions(predictions, suggestionsId, input);
        } else {
            hideSuggestions(suggestionsId);
        }
    } catch (error) {
        console.error('Address search error:', error);
        // Fallback to Czech cities
        showCzechCitiesFallback(query, suggestionsId, input);
    }
}

function showCzechCitiesFallback(query, suggestionsId, input) {
    const czechCities = [
        { name: 'Praha, Czech Republic', lat: 50.0755, lon: 14.4378 },
        { name: 'Brno, Czech Republic', lat: 49.1951, lon: 16.6068 },
        { name: 'Ostrava, Czech Republic', lat: 49.8209, lon: 18.2625 },
        { name: 'Plzeň, Czech Republic', lat: 49.7384, lon: 13.3736 },
        { name: 'Liberec, Czech Republic', lat: 50.7663, lon: 15.0543 },
        { name: 'Olomouc, Czech Republic', lat: 49.5938, lon: 17.2509 },
        { name: 'Ústí nad Labem, Czech Republic', lat: 50.6607, lon: 14.0322 },
        { name: 'České Budějovice, Czech Republic', lat: 48.9745, lon: 14.4743 },
        { name: 'Hradec Králové, Czech Republic', lat: 50.2093, lon: 15.8327 },
        { name: 'Pardubice, Czech Republic', lat: 50.0343, lon: 15.7812 }
    ];
    
    const filtered = czechCities.filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filtered.length > 0) {
        const predictions = filtered.map(city => ({
            description: city.name,
            place_id: city.name.replace(/\s+/g, '_'),
            lat: city.lat,
            lon: city.lon
        }));
        showSuggestions(predictions, suggestionsId, input);
    } else {
        hideSuggestions(suggestionsId);
    }
}

function showSuggestions(predictions, suggestionsId, input) {
    const suggestionsDiv = document.getElementById(suggestionsId);
    suggestionsDiv.innerHTML = '';
    
    predictions.slice(0, 5).forEach(prediction => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = prediction.description;
        item.addEventListener('click', function() {
            input.value = prediction.description;
            // Store coordinates for distance calculation
            input.dataset.lat = prediction.lat;
            input.dataset.lon = prediction.lon;
            hideSuggestions(suggestionsId);
        });
        suggestionsDiv.appendChild(item);
    });
    
    suggestionsDiv.style.display = 'block';
}

function hideSuggestions(suggestionsId) {
    const suggestionsDiv = document.getElementById(suggestionsId);
    suggestionsDiv.style.display = 'none';
}

async function calculatePrice() {
    const startInput = document.getElementById('startAddress');
    const endInput = document.getElementById('endAddress');
    const startAddress = startInput.value.trim();
    const endAddress = endInput.value.trim();
    
    // Hide previous results
    hideResults();
    hideError();
    
    if (!startAddress || !endAddress) {
        const errorMsg = currentLanguage === 'en' 
            ? 'Please enter both starting address and destination.'
            : 'Prosím zadejte jak výchozí, tak cílovou adresu.';
        showError(errorMsg);
        return;
    }
    
    showLoading();
    
    try {
        let startCoords, endCoords;
        
        // Check if we have coordinates from autocomplete selection
        if (startInput.dataset.lat && startInput.dataset.lon) {
            startCoords = { lat: parseFloat(startInput.dataset.lat), lon: parseFloat(startInput.dataset.lon) };
        } else {
            startCoords = await geocodeAddress(startAddress);
        }
        
        if (endInput.dataset.lat && endInput.dataset.lon) {
            endCoords = { lat: parseFloat(endInput.dataset.lat), lon: parseFloat(endInput.dataset.lon) };
        } else {
            endCoords = await geocodeAddress(endAddress);
        }
        
        if (!startCoords || !endCoords) {
            throw new Error('Could not find coordinates for one or both addresses');
        }
        
        // Try to get actual road distance using OSRM API first
        let roadDistance;
        try {
            roadDistance = await getOSRMDistance(startCoords, endCoords);
        } catch (osrmError) {
            console.warn('OSRM failed, falling back to Haversine:', osrmError);
            // Fallback: Calculate distance using Haversine formula with better multiplier
            const straightDistance = calculateHaversineDistance(startCoords, endCoords);
            // Use 35% multiplier for better road distance estimation
            roadDistance = straightDistance * 1.35;
        }
        
        hideLoading();
        displayResults(roadDistance);
        
    } catch (error) {
        console.error('Calculation error:', error);
        hideLoading();
        const errorMsg = currentLanguage === 'en' 
            ? 'Could not calculate the route. Please check the addresses and try again.'
            : 'Nelze spočítat trasu. Zkontrolujte prosím adresy a zkuste to znovu.';
        showError(errorMsg);
    }
}

async function geocodeAddress(address) {
    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=cz&accept-language=en,cs&q=${encodeURIComponent(address)}`;
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'TaxiCalculator/1.0 (https://maleka.dev)',
                'Accept-Language': 'en-US,en;q=0.9,cs;q=0.8'
            }
        });
        
        if (!response.ok) throw new Error('Geocoding failed');
        
        const results = await response.json();
        
        if (results && results.length > 0) {
            return {
                lat: parseFloat(results[0].lat),
                lon: parseFloat(results[0].lon)
            };
        }
        
        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

async function getOSRMDistance(startCoords, endCoords) {
    try {
        // Use OSRM (Open Source Routing Machine) for actual road distances
        const url = `https://router.project-osrm.org/route/v1/driving/${startCoords.lon},${startCoords.lat};${endCoords.lon},${endCoords.lat}?overview=false&alternatives=false&steps=false`;
        
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('OSRM request failed');
        
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
            // OSRM returns distance in meters, convert to kilometers
            const distanceKm = data.routes[0].distance / 1000;
            return distanceKm;
        } else {
            throw new Error('No route found');
        }
    } catch (error) {
        console.error('OSRM error:', error);
        throw error;
    }
}

function calculateHaversineDistance(coord1, coord2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLon = (coord2.lon - coord1.lon) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance;
}

// Remove the old fallback functions as we now use proper geocoding

function displayResults(distanceKm) {
    const rate = 3.67; // CZK per km
    // Important: Double the distance for return journey (200% as mentioned)
    const actualDistance = distanceKm * 2;
    const price = actualDistance * rate;
    
    // Round price properly to 2 decimal places (standard currency format)
    const roundedPrice = Math.round(price * 100) / 100;
    
    // Calculate processing fee: 7 CZK + 1.25% of price
    const processingFeePercent = roundedPrice * 0.0125;
    const processingFeeTotal = 7 + processingFeePercent;
    const roundedProcessingFee = Math.round(processingFeeTotal * 100) / 100;
    
    // Calculate final total (price + processing fee)
    const finalTotal = roundedPrice + roundedProcessingFee;
    const roundedFinalTotal = Math.round(finalTotal * 100) / 100;
    
    // Store the final amount for payment
    window.paymentAmount = roundedFinalTotal;
    
    // Display results
    document.getElementById('distance').textContent = `${distanceKm.toFixed(2)} km`;
    document.getElementById('totalPrice').textContent = `${roundedPrice.toFixed(2)} CZK`;
    document.getElementById('processingFeeAmount').textContent = `${roundedProcessingFee.toFixed(2)} CZK`;
    document.getElementById('finalTotalAmount').textContent = `${roundedFinalTotal.toFixed(2)} CZK`;
    
    // Show all elements including payment
    showResults();
    document.getElementById('processingFee').style.display = 'flex';
    document.getElementById('finalTotal').style.display = 'flex';
    document.getElementById('paymentSection').style.display = 'block';
}

function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showResults() {
    document.getElementById('results').style.display = 'block';
}

function hideResults() {
    document.getElementById('results').style.display = 'none';
    // Also hide payment-related elements
    document.getElementById('processingFee').style.display = 'none';
    document.getElementById('finalTotal').style.display = 'none';
    document.getElementById('paymentSection').style.display = 'none';
}

function proceedToPayment() {
    if (!window.paymentAmount) {
        const errorMsg = currentLanguage === 'en' 
            ? 'Please calculate the price first before proceeding to payment.'
            : 'Prosím nejprve spočítejte cenu před přejitím k platbě.';
        showError(errorMsg);
        return;
    }
    
    // Generate route map link for payment identification
    const routeMapLink = generateRouteMapLink();
    
    // Show payment information modal
    showPaymentModal(window.paymentAmount, routeMapLink);
}

function generateRouteMapLink() {
    const startInput = document.getElementById('startAddress');
    const endInput = document.getElementById('endAddress');
    const startAddress = startInput.value.trim();
    const endAddress = endInput.value.trim();
    
    // Try to get coordinates if available from previous calculation
    let startCoords = null;
    let endCoords = null;
    
    if (startInput.dataset.lat && startInput.dataset.lon) {
        startCoords = { lat: parseFloat(startInput.dataset.lat), lon: parseFloat(startInput.dataset.lon) };
    }
    if (endInput.dataset.lat && endInput.dataset.lon) {
        endCoords = { lat: parseFloat(endInput.dataset.lat), lon: parseFloat(endInput.dataset.lon) };
    }
    
    // Generate OpenStreetMap link only
    const mapLink = generateOSMLink(startAddress, endAddress, startCoords, endCoords);
    const coordinates = startCoords && endCoords ? `${startCoords.lat},${startCoords.lon} → ${endCoords.lat},${endCoords.lon}` : null;
    
    // Store route data with map link
    const routeData = {
        from: startAddress,
        to: endAddress,
        distance: document.getElementById('distance').textContent,
        ridePrice: document.getElementById('totalPrice').textContent,
        processingFee: document.getElementById('processingFeeAmount').textContent,
        finalAmount: document.getElementById('finalTotalAmount').textContent,
        timestamp: new Date().toISOString(),
        mapLink: mapLink,
        coordinates: coordinates
    };
    
    // Store in localStorage for debugging
    const paymentId = Date.now().toString(36);
    localStorage.setItem(`payment_${paymentId}`, JSON.stringify(routeData));
    
    return { mapLink, coordinates };
}

function generateOSMLink(startAddress, endAddress, startCoords, endCoords) {
    if (startCoords && endCoords) {
        // Use coordinates for precise OpenStreetMap link
        return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${startCoords.lat}%2C${startCoords.lon}%3B${endCoords.lat}%2C${endCoords.lon}`;
    } else {
        // Fallback to address-based link
        const encodedStart = encodeURIComponent(startAddress);
        const encodedEnd = encodeURIComponent(endAddress);
        return `https://www.openstreetmap.org/search?query=${encodedStart}%20to%20${encodedEnd}`;
    }
}



function showPaymentModal(amount, mapData) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'payment-modal-overlay';
    modal.innerHTML = `
        <div class="payment-modal">
            <div class="payment-modal-header">
                <h2>${currentLanguage === 'en' ? '💳 Payment for Ride' : '💳 Platba za jízdu'}</h2>
                <button class="modal-close" onclick="closePaymentModal()">&times;</button>
            </div>
            <div class="payment-modal-content">
                <div class="payment-amount-info">
                    <h3>${currentLanguage === 'en' ? '⚠️ IMPORTANT - Amount to Pay:' : '⚠️ DŮLEŽITÉ - Částka k platbě:'}</h3>
                    <div class="amount-highlight">${amount.toFixed(2)} CZK</div>
                    <p>${currentLanguage === 'en' ? 'Make sure you enter exactly this amount in the Revolut payment form!' : 'Ujistěte se, že zadáte přesně tuto částku ve formuláři platby Revolut!'}</p>
                </div>
                
                <div class="payment-route-info">
                    <h3>${currentLanguage === 'en' ? '🗺️ Route Link (enter in payment description):' : '🗺️ Odkaz na trasu (zadejte do popisu platby):'}</h3>
                    <div class="map-links">
                        <div class="map-link-item">
                            <label>${currentLanguage === 'en' ? 'OpenStreetMap (exact route):' : 'OpenStreetMap (přesná trasa):'}</label>
                            <div class="link-box">
                                <input type="text" id="osmMapLink" value="${mapData.mapLink}" readonly>
                                <button class="copy-btn" onclick="copyMapLink('osmMapLink')">${currentLanguage === 'en' ? '📋 Copy' : '📋 Kopírovat'}</button>
                            </div>
                        </div>
                        ${mapData.coordinates ? `
                        <div class="coordinates-info">
                            <small><strong>${currentLanguage === 'en' ? 'Coordinates:' : 'Souřadnice:'}</strong> ${mapData.coordinates}</small>
                        </div>
                        ` : ''}
                    </div>
                    <p class="link-instruction">${currentLanguage === 'en' ? 'Copy the link and paste it in the "description" or "note" field when making the Revolut payment. The link will help identify the ride route.' : 'Zkopírujte odkaz a vložte jej do pole "popis" nebo "poznámka" při platbě přes Revolut. Odkaz pomůže identifikovat trasu jízdy.'}</p>
                </div>
                
                <div class="route-summary">
                    <h4>${currentLanguage === 'en' ? '📍 Route Summary:' : '📍 Shrnutí trasy:'}</h4>
                    <p><strong>${currentLanguage === 'en' ? 'From:' : 'Z:'}</strong> ${document.getElementById('startAddress').value}</p>
                    <p><strong>${currentLanguage === 'en' ? 'To:' : 'Do:'}</strong> ${document.getElementById('endAddress').value}</p>
                    <p><strong>${currentLanguage === 'en' ? 'Distance:' : 'Vzdálenost:'}</strong> ${document.getElementById('distance').textContent}</p>
                </div>
                
                <div class="payment-buttons">
                    <button class="cancel-btn" onclick="closePaymentModal()">${currentLanguage === 'en' ? '❌ Cancel' : '❌ Zrušit'}</button>
                    <button class="proceed-btn" onclick="openRevolutPayment('${amount}')">
                        ${currentLanguage === 'en' ? '💳 Go to Revolut' : '💳 Přejít na Revolut'}
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function copyMapLink(inputId) {
    const linkInput = document.getElementById(inputId);
    linkInput.select();
    linkInput.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        // Show success feedback
        const copyBtn = linkInput.nextElementSibling;
        const originalText = copyBtn.textContent;
        copyBtn.textContent = currentLanguage === 'en' ? '✅ Copied!' : '✅ Zkopírováno!';
        copyBtn.style.background = '#4CAF50';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy map link:', err);
        const alertMsg = currentLanguage === 'en' 
            ? 'Failed to copy link. Please copy manually: ' + linkInput.value
            : 'Nepodařilo se zkopírovat odkaz. Prosím zkopírujte ručně: ' + linkInput.value;
        alert(alertMsg);
    }
}

function openRevolutPayment(amount) {
    // Revolut checkout link
    const revolutUrl = `https://checkout.revolut.com/pay/4b5b17a4-d467-4205-828d-879465e7c4af`;
    
    // Open Revolut payment in new tab
    window.open(revolutUrl, '_blank');
    
    // Optional: Log payment attempt for tracking
    console.log(`Payment initiated for ${amount} CZK with route map links`);
}

function closePaymentModal() {
    const modal = document.querySelector('.payment-modal-overlay');
    if (modal) {
        modal.remove();
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    const errorText = message.startsWith('❌') ? message : `❌ ${message}`;
    errorDiv.querySelector('p').textContent = errorText;
    errorDiv.style.display = 'block';
}

function hideError() {
    document.getElementById('error').style.display = 'none';
}

// Add enter key support for inputs
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        if (activeElement.id === 'startAddress' || activeElement.id === 'endAddress') {
            calculatePrice();
        }
    }
});