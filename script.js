// Eco-Utility Hub JavaScript
document.addEventListener('DOMContentLoaded', function () {
    // --- AUTHENTICATION SYSTEM ---
    let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    let users = JSON.parse(localStorage.getItem('users') || '[]');

    // --- TAB NAVIGATION LOGIC ---
    const navLinks = document.querySelectorAll('.nav-link');
    const wasteTab = document.getElementById('waste-tab');
    const pickupTab = document.getElementById('pickup-tab');
    const leakTab = document.getElementById('leak-tab');
    const wasteHeader = document.getElementById('waste-header');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Always get the current user state
            const currentUserState = JSON.parse(localStorage.getItem('currentUser') || 'null');
            console.log('Tab clicked:', this.dataset.tab, 'Current user state:', currentUserState); // Debug log
            
            // Check if protected features require login
            if ((this.dataset.tab === 'pickup' || this.dataset.tab === 'leak') && !currentUserState) {
                console.log('Opening login modal for protected feature'); // Debug log
                openModal('login');
                return;
            }
            
            // Switch active tab styling
            navLinks.forEach(l => l.classList.remove('text-emerald-500', 'font-semibold'));
            this.classList.add('text-emerald-500', 'font-semibold');
            
            // Show/hide tab content
            if (this.dataset.tab === 'waste') {
                wasteTab.style.display = '';
                wasteHeader.style.display = '';
                pickupTab.style.display = 'none';
                leakTab.style.display = 'none';
            } else if (this.dataset.tab === 'pickup') {
                console.log('Showing pickup tab'); // Debug log
                wasteTab.style.display = 'none';
                wasteHeader.style.display = 'none';
                pickupTab.style.display = '';
                leakTab.style.display = 'none';
                setTimeout(initPickupPlanner, 100);
            } else if (this.dataset.tab === 'leak') {
                console.log('Showing leak tab'); // Debug log
                wasteTab.style.display = 'none';
                wasteHeader.style.display = 'none';
                pickupTab.style.display = 'none';
                leakTab.style.display = '';
                setTimeout(initLeakDetector, 100);
            }
        });
    });

    // Auth elements
    const authModal = document.getElementById('auth-modal');
    const modalTitle = document.getElementById('modal-title');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const userMenu = document.getElementById('user-menu');
    const authButtons = document.getElementById('auth-buttons');
    const userName = document.getElementById('user-name');

    // Auth buttons
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const closeModalBtn = document.getElementById('close-modal');
    
    // Form switches
    const switchToSignup = document.getElementById('switch-to-signup');
    const switchToLogin = document.getElementById('switch-to-login');
    
    // Form submits
    const loginSubmit = document.getElementById('login-submit');
    const signupSubmit = document.getElementById('signup-submit');

    // Check if user is already logged in
    function checkAuthStatus() {
        if (currentUser) {
            showUserMenu();
        } else {
            showAuthButtons();
        }
    }

    function showUserMenu() {
        userMenu.classList.remove('hidden');
        authButtons.classList.add('hidden');
        userName.textContent = `Welcome, ${currentUser.name}`;
        
        // Hide lock icons when logged in
        const lockIcons = document.querySelectorAll('.login-required-icon');
        lockIcons.forEach(icon => icon.style.display = 'none');
    }

    function showAuthButtons() {
        userMenu.classList.add('hidden');
        authButtons.classList.remove('hidden');
        
        // Show lock icons when not logged in
        const lockIcons = document.querySelectorAll('.login-required-icon');
        lockIcons.forEach(icon => icon.style.display = 'inline');
    }

    function openModal(mode = 'login') {
        authModal.classList.remove('hidden');
        if (mode === 'login') {
            showLoginForm();
        } else {
            showSignupForm();
        }
    }

    function closeModal() {
        authModal.classList.add('hidden');
        clearForms();
    }

    function showLoginForm() {
        modalTitle.textContent = 'Login';
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    }

    function showSignupForm() {
        modalTitle.textContent = 'Create Account';
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    }

    function clearForms() {
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
        document.getElementById('signup-name').value = '';
        document.getElementById('signup-email').value = '';
        document.getElementById('signup-phone').value = '';
        document.getElementById('signup-password').value = '';
        document.getElementById('signup-confirm-password').value = '';
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function handleLogin() {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Check if user exists and password matches
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            showUserMenu();
            closeModal();
            
            // Load user-specific data
            loadUserData();
            
            console.log('Login successful, currentUser:', currentUser); // Debug log
            console.log('User can now access protected features'); // Debug log
        } else {
            alert('Invalid email or password');
        }
    }

    function handleSignup() {
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const phone = document.getElementById('signup-phone').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        if (!name || !email || !phone || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        // Check if user already exists
        if (users.find(u => u.email === email)) {
            alert('An account with this email already exists');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            phone,
            password,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showUserMenu();
        closeModal();
        
        alert(`Account created successfully! Welcome, ${name}!`);
    }

    function handleLogout() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        showAuthButtons();
        
        // Clear user-specific data
        clearUserData();
        
        alert('You have been logged out successfully');
    }

    function loadUserData() {
        // Load user-specific meter readings and pickup requests
        const userKey = `user_${currentUser.id}`;
        meterReadings = JSON.parse(localStorage.getItem(`${userKey}_meterReadings`) || '[]');
        pickupRequests = JSON.parse(localStorage.getItem(`${userKey}_pickupRequests`) || '[]');
        
        // Update displays if on relevant tabs
        updateRecentReadings();
        updatePickupRequestsList();
    }

    function clearUserData() {
        // Clear displays but keep data in localStorage for when user logs back in
        meterReadings = [];
        pickupRequests = [];
        
        // Update displays
        updateRecentReadings();
        updatePickupRequestsList();
        updateUsageChart();
        updateAnomalyAlerts();
    }

    // Event listeners for auth system
    loginBtn.addEventListener('click', () => openModal('login'));
    signupBtn.addEventListener('click', () => openModal('signup'));
    logoutBtn.addEventListener('click', handleLogout);
    closeModalBtn.addEventListener('click', closeModal);
    
    switchToSignup.addEventListener('click', showSignupForm);
    switchToLogin.addEventListener('click', showLoginForm);
    
    loginSubmit.addEventListener('click', handleLogin);
    signupSubmit.addEventListener('click', handleSignup);

    // Close modal when clicking outside
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeModal();
        }
    });

    // Enable Enter key submission
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !authModal.classList.contains('hidden')) {
            if (!loginForm.classList.contains('hidden')) {
                handleLogin();
            } else if (!signupForm.classList.contains('hidden')) {
                handleSignup();
            }
        }
    });

    // Initialize auth status
    checkAuthStatus();

    // --- MOCK DATA ---
    const dropOffSites = [
        { id: 1, name: 'Kolkata E-Waste Center', type: 'e-waste', coords: [22.5726, 88.3639], hours: 'Mon-Fri 9am-5pm', materials_accepted: ['computers', 'phones', 'batteries'], isOpenNow: true, address: '1 Park Street, Kolkata, WB' },
        { id: 2, name: 'Apollo Medical Disposal', type: 'medical', coords: [22.5700, 88.3750], hours: '24/7', materials_accepted: ['sharps', 'medications'], isOpenNow: true, address: 'Apollo Hospital, Kolkata, WB' },
        { id: 3, name: 'EcoGreen Solutions', type: 'e-waste', coords: [22.5800, 88.3500], hours: 'Mon-Sat 10am-4pm', materials_accepted: ['computers', 'phones'], isOpenNow: false, address: 'Salt Lake, Kolkata, WB' },
        { id: 4, name: 'City Sharps Drop-off', type: 'medical', coords: [22.5850, 88.3700], hours: 'Mon-Fri 8am-6pm', materials_accepted: ['sharps'], isOpenNow: true, address: 'Sector V, Kolkata, WB' },
        { id: 5, name: 'Sunshine Electronics Recycling', type: 'e-waste', coords: [22.5600, 88.3900], hours: 'Tue-Sun 11am-7pm', materials_accepted: ['phones', 'batteries'], isOpenNow: true, address: 'Gariahat, Kolkata, WB' },
        { id: 6, name: 'Downtown Pharmacy Take-Back', type: 'medical', coords: [22.5650, 88.3550], hours: 'Mon-Sat 9am-8pm', materials_accepted: ['medications'], isOpenNow: true, address: 'Esplanade, Kolkata, WB' },
    ];

    // --- MAP INITIALIZATION ---
    const map = L.map('map', {
        scrollWheelZoom: false, // More user-friendly default
        zoomControl: true
    }).setView([22.5726, 88.3639], 13); // Kolkata coordinates
    
    // Use OpenStreetMap tiles (Google Maps style)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Improve scroll UX
    map.on('focus', () => map.scrollWheelZoom.enable());
    map.on('blur', () => map.scrollWheelZoom.disable());

    // Layer for markers
    let markersLayer = L.featureGroup().addTo(map);

    // User location markers
    let userMarker = null;
    let userAccuracyCircle = null;
    let userLatLng = null;

    // --- CUSTOM MAP ICONS ---
    function createCustomIcon(color) {
        const markerHtml = `<div style="background-color: ${color};" class="w-3 h-3 rounded-full border-2 border-slate-900 shadow-md"></div>`;
        return L.divIcon({
            html: `<div class="relative flex items-center justify-center w-6 h-6 bg-slate-700 rounded-full shadow-lg">${markerHtml}</div>`,
            className: 'bg-transparent',
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, -14]
        });
    }
    const eWasteIcon = createCustomIcon('#10b981'); // emerald-500
    const medicalIcon = createCustomIcon('#ec4899'); // pink-500
    const userIcon = L.divIcon({
        html: `<div class="relative flex items-center justify-center w-6 h-6 bg-emerald-600 rounded-full shadow-lg ring-2 ring-white/40"><div class="w-2 h-2 bg-white rounded-full"></div></div>`,
        className: 'bg-transparent',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });

    // --- DOM ELEMENT REFERENCES ---
    const locationList = document.getElementById('location-list');
    const noResultsDiv = document.getElementById('no-results');
    const resultsCount = document.getElementById('results-count');
    const filterType = document.getElementById('filter-type');
    const filterMaterial = document.getElementById('filter-material');
    const filterOpen = document.getElementById('filter-open');
    const geolocateBtn = document.getElementById('geolocate-btn');

    // Keep mapping of site id -> list element
    let listItemById = new Map();

    // --- HELPERS ---
    function haversineKm(a, b) {
      // Handle both array coordinates and Leaflet LatLng objects
      let lat1, lon1, lat2, lon2;
      
      if (Array.isArray(a)) {
        [lat1, lon1] = a;
      } else if (a && typeof a.lat === 'number' && typeof a.lng === 'number') {
        lat1 = a.lat;
        lon1 = a.lng;
      } else {
        return 0;
      }
      
      if (Array.isArray(b)) {
        [lat2, lon2] = b;
      } else if (b && typeof b.lat === 'number' && typeof b.lng === 'number') {
        lat2 = b.lat;
        lon2 = b.lng;
      } else {
        return 0;
      }
      
      const toRad = d => d * Math.PI / 180;
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const aVal = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
      const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
      return R * c;
    }

    function fmtDistance(km) {
      if (!km || km === 0) return '—';
      if (km >= 1) return `${km.toFixed(1)} km`;
      return `${Math.round(km * 1000)} m`;
    }

    function updateResultsCount(n) {
        const suffix = userLatLng ? ' • sorted by distance' : ' • enable location for distances';
        resultsCount.textContent = `${n} result${n !== 1 ? 's' : ''} found${n ? suffix : ''}`;
    }

    function fitMapToResults() {
        const bounds = L.latLngBounds([]);
        let hasMarkers = false;
        
        // Add all drop-off site markers to bounds
        markersLayer.eachLayer(layer => {
            if (layer.getLatLng) {
                bounds.extend(layer.getLatLng());
                hasMarkers = true;
            }
        });
        
        // Add user location to bounds if available
        if (userLatLng) {
            bounds.extend(userLatLng);
            hasMarkers = true;
        }
        
        if (hasMarkers && bounds.isValid()) {
            // Fit bounds with padding and ensure minimum zoom level
            map.fitBounds(bounds, {
                padding: [20, 20],
                maxZoom: 16
            });
        } else {
            // Fallback to Kolkata center if no markers
            map.setView([22.5726, 88.3639], 13);
        }
    }

    function setUserLocation(lat, lon, accuracy) {
        console.log('setUserLocation called with:', lat, lon, accuracy);
        userLatLng = L.latLng(lat, lon);
        console.log('userLatLng set to:', userLatLng);
        
        if (userMarker) {
            map.removeLayer(userMarker);
            userMarker = null;
        }
        if (userAccuracyCircle) {
            map.removeLayer(userAccuracyCircle);
            userAccuracyCircle = null;
        }
        userMarker = L.marker(userLatLng, { icon: userIcon }).addTo(map).bindTooltip('You are here', {direction: 'top', offset: [0, -12]});
        if (accuracy && accuracy > 10) {
            userAccuracyCircle = L.circle(userLatLng, { radius: accuracy, color: '#10b981', fillColor: '#10b981', fillOpacity: 0.1, weight: 1 }).addTo(map);
        }
        console.log('About to call applyFilters...');
        applyFilters(); // resort by distance
        fitMapToResults();
    }

    function getUserLocation() {
        console.log('getUserLocation called');
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }
        geolocateBtn.disabled = true;
        geolocateBtn.classList.add('opacity-70', 'cursor-not-allowed');
        geolocateBtn.textContent = 'Locating...';
        console.log('Starting geolocation request...');
        navigator.geolocation.getCurrentPosition(
            pos => {
                console.log('Geolocation success:', pos);
                const { latitude, longitude, accuracy } = pos.coords;
                console.log('Coordinates:', latitude, longitude, accuracy);
                setUserLocation(latitude, longitude, accuracy);
                geolocateBtn.textContent = 'Location set';
                geolocateBtn.disabled = false;
                geolocateBtn.classList.remove('opacity-70', 'cursor-not-allowed');
            },
            err => {
                console.error('Geolocation error:', err);
                alert(`Unable to fetch location: ${err.message}. Please allow location access and try again.`);
                geolocateBtn.disabled = false;
                geolocateBtn.classList.remove('opacity-70', 'cursor-not-allowed');
                geolocateBtn.textContent = 'Use my location';
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 }
        );
    }

    // --- FUNCTIONS ---

    /**
     * Renders a list of locations on the map and in the list view.
     * @param {Array} locations - The array of location objects to render.
     */
    function renderLocations(locations) {
        // Clear previous results
        locationList.innerHTML = '';
        listItemById.clear();
        markersLayer.clearLayers();
        updateResultsCount(locations.length);

        if (locations.length === 0) {
            locationList.appendChild(noResultsDiv);
            noResultsDiv.style.display = 'block';
            fitMapToResults(); // Ensure map fits even if no results
            return;
        }
        noResultsDiv.style.display = 'none';

        // Sort by distance if user location present
        let sorted = [...locations];
        console.log('renderLocations: userLatLng is', userLatLng);
        if (userLatLng) {
            console.log('Calculating distances for', sorted.length, 'sites');
            sorted.forEach(s => {
                s._distanceKm = haversineKm(userLatLng, s.coords);
                console.log(`Distance to ${s.name}:`, s._distanceKm, 'km');
            });
            sorted.sort((a, b) => a._distanceKm - b._distanceKm);
            console.log('Sorted sites by distance:', sorted.map(s => ({name: s.name, distance: s._distanceKm})));
        }

        sorted.forEach(site => {
            const openBadge = site.isOpenNow
                ? '<span class="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">Open</span>'
                : '<span class="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400">Closed</span>';
            const distancePill = (userLatLng && typeof site._distanceKm === 'number')
                ? `<span class="ml-2 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">${fmtDistance(site._distanceKm)}</span>`
                : '';

            // Add to list
            const listItem = document.createElement('div');
            listItem.className = 'p-4 hover:bg-slate-700/50 cursor-pointer transition-colors duration-200';
            listItem.setAttribute('role', 'button');
            listItem.setAttribute('tabindex', '0');
            listItem.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="flex-1 pr-4">
                        <p class="font-semibold text-slate-100 flex items-center">${site.name} ${openBadge} ${distancePill}</p>
                        <p class="text-sm text-slate-400">${site.address}</p>
                    </div>
                    <span class="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${site.type === 'e-waste' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-pink-500/10 text-pink-400'}">${site.type.replace('-', ' ')}</span>
                </div>
                <div class="mt-3 text-sm text-slate-400 space-y-1.5">
                    <p class="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> <strong>Hours:</strong>&nbsp;${site.hours}</p>
                    <p class="flex items-start"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-slate-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> <div><strong>Accepts:</strong>&nbsp;${site.materials_accepted.join(', ')}</div></p>
                </div>
            `;

            function selectListItem() {
                document.querySelectorAll('#location-list > div').forEach(child => {
                    child.classList.remove('bg-emerald-900/50', 'ring-2', 'ring-emerald-500/50');
                });
                listItem.classList.add('bg-emerald-900/50', 'ring-2', 'ring-emerald-500/50');
                listItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            listItem.addEventListener('click', () => {
                selectListItem();
                map.setView(site.coords, Math.max(map.getZoom(), 15), { animate: true, pan: { duration: 0.5 } });
                markersLayer.eachLayer(marker => {
                    if (marker.options.siteId === site.id) {
                        marker.openPopup();
                    }
                });
            });
            listItem.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    listItem.click();
                }
            });

            locationList.appendChild(listItem);
            listItemById.set(site.id, listItem);

            // Add to map
            const icon = site.type === 'e-waste' ? eWasteIcon : medicalIcon;
            const marker = L.marker(site.coords, { icon: icon, siteId: site.id })
              .addTo(markersLayer)
              .bindPopup(`
                <div>
                  <b class="text-slate-50">${site.name}</b><br/>
                  <div class="text-slate-400">${site.address}</div>
                  <div class="mt-1 text-xs">${site.isOpenNow ? 'Open now' : 'Closed now'}${(userLatLng && typeof site._distanceKm === 'number' && site._distanceKm > 0) ? ' • ' + fmtDistance(site._distanceKm) : ''}</div>
                </div>
              `)
              .bindTooltip(site.name, {
                permanent: false,
                direction: 'top',
                offset: [0, -12],
                opacity: 0.9
              })
              .on('click', () => {
                const li = listItemById.get(site.id);
                if (li) {
                  li.click();
                }
              });
        });

        // Fit map to visible results (and user location if available)
        fitMapToResults();
    }

    /**
     * Applies filters and re-renders the locations.
     */
    function applyFilters() {
        const type = filterType.value;
        const material = filterMaterial.value;
        const isOpen = filterOpen.checked;

        let filteredSites = dropOffSites.filter(site => {
            const typeMatch = type === 'all' || site.type === type;
            const materialMatch = material === 'all' || site.materials_accepted.includes(material);
            const openMatch = !isOpen || site.isOpenNow === true;
            return typeMatch && materialMatch && openMatch;
        });

        renderLocations(filteredSites);
    }

    // --- EVENT LISTENERS ---
    filterType.addEventListener('change', applyFilters);
    filterMaterial.addEventListener('change', applyFilters);
    filterOpen.addEventListener('change', applyFilters);
    geolocateBtn.addEventListener('click', getUserLocation);

    // --- INITIAL RENDER ---
    applyFilters();

    // --- LEAK DETECTOR FUNCTIONALITY ---
    let meterReadings = JSON.parse(localStorage.getItem('meterReadings') || '[]');
    let currentChart = null;

    // Initialize leak detector elements
    const utilityTypeSelect = document.getElementById('utility-type');
    const meterPhotoInput = document.getElementById('meter-photo');
    const meterReadingInput = document.getElementById('meter-reading');
    const submitReadingBtn = document.getElementById('submit-reading');
    const recentReadingsDiv = document.getElementById('recent-readings');
    const anomalyAlertsDiv = document.getElementById('anomaly-alerts');
    const usageChart = document.getElementById('usage-chart');

    function addMeterReading() {
        if (!currentUser) {
            alert('Please login to record meter readings');
            openModal('login');
            return;
        }

        const utilityType = utilityTypeSelect.value;
        const reading = parseFloat(meterReadingInput.value);
        const timestamp = new Date().toISOString();

        if (!reading || reading <= 0) {
            alert('Please enter a valid meter reading');
            return;
        }

        // Check for anomalies
        const recentReadings = meterReadings
            .filter(r => r.utilityType === utilityType)
            .slice(-10)
            .map(r => r.reading);

        let isAnomaly = false;
        if (recentReadings.length >= 3) {
            const avg = recentReadings.reduce((a, b) => a + b, 0) / recentReadings.length;
            const increase = reading - recentReadings[recentReadings.length - 1];
            const avgIncrease = avg / recentReadings.length;
            
            // Detect if current reading is significantly higher than expected
            if (increase > avgIncrease * 3) {
                isAnomaly = true;
            }
        }

        const newReading = {
            id: Date.now(),
            utilityType,
            reading,
            timestamp,
            isAnomaly,
            userId: currentUser.id
        };

        meterReadings.push(newReading);
        const userKey = `user_${currentUser.id}`;
        localStorage.setItem(`${userKey}_meterReadings`, JSON.stringify(meterReadings));

        if (isAnomaly) {
            showAnomalyAlert(newReading);
        }

        meterReadingInput.value = '';
        updateRecentReadings();
        updateUsageChart();
        updateAnomalyAlerts();
    }

    function showAnomalyAlert(reading) {
        alert(`⚠️ Potential ${reading.utilityType} leak detected!\n\nUnusually high reading: ${reading.reading}\nConsider checking for leaks.`);
    }

    function updateRecentReadings() {
        const utilityType = utilityTypeSelect.value;
        const recent = meterReadings
            .filter(r => r.utilityType === utilityType)
            .slice(-5)
            .reverse();

        recentReadingsDiv.innerHTML = recent.length > 0 
            ? recent.map(r => `
                <div class="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                    <div>
                        <p class="text-slate-200 font-medium">${r.reading} ${utilityType === 'water' ? 'L' : 'kWh'}</p>
                        <p class="text-xs text-slate-400">${new Date(r.timestamp).toLocaleDateString()}</p>
                    </div>
                    ${r.isAnomaly ? '<span class="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">Anomaly</span>' : ''}
                </div>
            `).join('')
            : '<p class="text-slate-400 text-center">No readings yet</p>';
    }

    function updateUsageChart() {
        const utilityType = utilityTypeSelect.value;
        const data = meterReadings
            .filter(r => r.utilityType === utilityType)
            .slice(-10);

        if (data.length === 0) return;

        const ctx = usageChart.getContext('2d');
        
        if (currentChart) {
            currentChart.destroy();
        }

        const labels = data.map(r => new Date(r.timestamp).toLocaleDateString());
        const readings = data.map(r => r.reading);

        currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${utilityType === 'water' ? 'Water Usage (L)' : 'Electricity Usage (kWh)'}`,
                    data: readings,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#cbd5e1' }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: '#475569' }
                    },
                    y: {
                        ticks: { color: '#94a3b8' },
                        grid: { color: '#475569' }
                    }
                }
            }
        });
    }

    function updateAnomalyAlerts() {
        const anomalies = meterReadings
            .filter(r => r.isAnomaly)
            .slice(-3)
            .reverse();

        anomalyAlertsDiv.innerHTML = anomalies.length > 0
            ? anomalies.map(r => `
                <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div class="flex items-center">
                        <svg class="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                        </svg>
                        <h4 class="text-red-400 font-medium">${r.utilityType.charAt(0).toUpperCase() + r.utilityType.slice(1)} Anomaly</h4>
                    </div>
                    <p class="text-slate-300 text-sm mt-1">High reading: ${r.reading} on ${new Date(r.timestamp).toLocaleDateString()}</p>
                </div>
            `).join('')
            : '<p class="text-slate-400 text-center">No recent anomalies detected</p>';
    }

    // Event listeners for leak detector
    if (submitReadingBtn) {
        submitReadingBtn.addEventListener('click', addMeterReading);
    }

    if (utilityTypeSelect) {
        utilityTypeSelect.addEventListener('change', () => {
            updateRecentReadings();
            updateUsageChart();
        });
    }

    if (meterReadingInput) {
        meterReadingInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addMeterReading();
            }
        });
    }

    // Initialize leak detector display
    function initLeakDetector() {
        updateRecentReadings();
        updateUsageChart();
        updateAnomalyAlerts();
    }

    // --- PICKUP PLANNER FUNCTIONALITY ---
    let pickupRequests = JSON.parse(localStorage.getItem('pickupRequests') || '[]');

    // Initialize pickup planner elements
    const pickupForm = {
        name: document.getElementById('pickup-name'),
        phone: document.getElementById('pickup-phone'),
        email: document.getElementById('pickup-email'),
        address: document.getElementById('pickup-address'),
        city: document.getElementById('pickup-city'),
        pincode: document.getElementById('pickup-pincode'),
        wasteType: document.getElementById('pickup-waste-type'),
        items: document.getElementById('pickup-items'),
        weight: document.getElementById('pickup-weight'),
        date: document.getElementById('pickup-date'),
        time: document.getElementById('pickup-time'),
        instructions: document.getElementById('pickup-instructions')
    };

    const submitPickupBtn = document.getElementById('submit-pickup-request');
    const pickupRequestsList = document.getElementById('pickup-requests-list');

    function submitPickupRequest() {
        if (!currentUser) {
            alert('Please login to submit pickup requests');
            openModal('login');
            return;
        }

        // Validate required fields
        const requiredFields = ['name', 'phone', 'address', 'pincode', 'wasteType', 'items', 'date', 'time'];
        const missingFields = [];

        requiredFields.forEach(field => {
            if (!pickupForm[field].value.trim()) {
                missingFields.push(field);
                pickupForm[field].classList.add('border-red-500');
            } else {
                pickupForm[field].classList.remove('border-red-500');
            }
        });

        if (missingFields.length > 0) {
            alert('Please fill in all required fields marked with *');
            return;
        }

        // Validate phone number
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
        if (!phoneRegex.test(pickupForm.phone.value)) {
            alert('Please enter a valid phone number');
            pickupForm.phone.classList.add('border-red-500');
            return;
        }

        // Validate pickup date (not in the past)
        const pickupDate = new Date(pickupForm.date.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (pickupDate < today) {
            alert('Please select a future date for pickup');
            pickupForm.date.classList.add('border-red-500');
            return;
        }

        // Create pickup request
        const newRequest = {
            id: Date.now(),
            name: pickupForm.name.value.trim(),
            phone: pickupForm.phone.value.trim(),
            email: pickupForm.email.value.trim(),
            address: `${pickupForm.address.value.trim()}, ${pickupForm.city.value.trim()}, ${pickupForm.pincode.value.trim()}`,
            wasteType: pickupForm.wasteType.value,
            items: pickupForm.items.value.trim(),
            weight: pickupForm.weight.value,
            date: pickupForm.date.value,
            time: pickupForm.time.value,
            instructions: pickupForm.instructions.value.trim(),
            status: 'pending',
            createdAt: new Date().toISOString(),
            userId: currentUser.id
        };

        pickupRequests.push(newRequest);
        const userKey = `user_${currentUser.id}`;
        localStorage.setItem(`${userKey}_pickupRequests`, JSON.stringify(pickupRequests));

        // Show success message
        alert(`✅ Pickup request submitted successfully!\n\nRequest ID: #${newRequest.id}\nYou will be contacted within 24 hours to confirm the pickup.`);

        // Clear form
        Object.values(pickupForm).forEach(field => {
            if (field.type === 'select-one') {
                field.selectedIndex = 0;
            } else {
                field.value = '';
            }
        });
        
        // Reset city to Kolkata
        pickupForm.city.value = 'Kolkata';
        
        // Set default date to tomorrow
        setDefaultDate();

        // Update requests list
        updatePickupRequestsList();
    }

    function updatePickupRequestsList() {
        if (!pickupRequestsList) return;

        const recentRequests = pickupRequests.slice(-5).reverse();

        pickupRequestsList.innerHTML = recentRequests.length > 0
            ? recentRequests.map(request => {
                const statusColors = {
                    pending: 'bg-yellow-500/20 text-yellow-400',
                    confirmed: 'bg-blue-500/20 text-blue-400',
                    completed: 'bg-green-500/20 text-green-400',
                    cancelled: 'bg-red-500/20 text-red-400'
                };

                return `
                    <div class="p-4 bg-slate-700 rounded-lg">
                        <div class="flex justify-between items-start mb-2">
                            <h4 class="font-medium text-slate-200">#${request.id}</h4>
                            <span class="text-xs px-2 py-1 rounded-full ${statusColors[request.status]}">${request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                        </div>
                        <p class="text-sm text-slate-300">${request.wasteType.charAt(0).toUpperCase() + request.wasteType.slice(1).replace('-', ' ')}</p>
                        <p class="text-xs text-slate-400">${new Date(request.date).toLocaleDateString()} • ${request.time.replace('-', ' ')}</p>
                        <p class="text-xs text-slate-400 mt-1">${request.items.substring(0, 50)}${request.items.length > 50 ? '...' : ''}</p>
                    </div>
                `;
            }).join('')
            : '<p class="text-slate-400 text-center text-sm">No pickup requests yet</p>';
    }

    function setDefaultDate() {
        if (pickupForm.date) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            pickupForm.date.value = tomorrow.toISOString().split('T')[0];
        }
    }

    function initPickupPlanner() {
        setDefaultDate();
        updatePickupRequestsList();
    }

    // Event listeners for pickup planner
    if (submitPickupBtn) {
        submitPickupBtn.addEventListener('click', submitPickupRequest);
    }

    // Form validation on input
    Object.values(pickupForm).forEach(field => {
        if (field) {
            field.addEventListener('input', () => {
                field.classList.remove('border-red-500');
            });
        }
    });
});
