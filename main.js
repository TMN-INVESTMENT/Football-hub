// ==================== FIREBASE CONFIGURATION ====================
const firebaseConfig = {
    apiKey: "AIzaSyA8joQ-Pkamw4hIrAPM_l8x-0F9i3PoDhg",
    authDomain: "football-canvas-hub.firebaseapp.com",
    projectId: "football-canvas-hub",
    storageBucket: "football-canvas-hub.firebasestorage.app",
    messagingSenderId: "204217889930",
    appId: "1:204217889930:web:cffd81bfa434fb470b6973",
    measurementId: "G-8H7HNB83XN"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const analytics = firebase.analytics();

// 🔐 NO PERSISTENCE – user must sign in on every page load
auth.setPersistence(firebase.auth.Auth.Persistence.NONE)
    .catch(error => console.error("Persistence error:", error));

console.log("🚀 Firebase services initialized successfully!");

// ==================== FIRESTORE PERSISTENCE (OFFLINE CACHE) ====================
function enableFirestorePersistence() {
    if (!db || typeof db.enablePersistence !== 'function') {
        console.warn("⚠️ Firestore persistence not available.");
        return;
    }
    db.enablePersistence({ synchronizeTabs: false })
        .then(() => console.log("✅ Firestore persistence enabled (offline cache)"))
        .catch(err => {
            if (err.code === 'failed-precondition') {
                console.log("⚠️ Multiple tabs open – persistence only in one tab.");
            } else if (err.code === 'unimplemented') {
                console.log("⚠️ Browser does not support persistence.");
            } else {
                console.log("⚠️ Persistence error:", err.message);
            }
        });
}
enableFirestorePersistence();

// ==================== COUNTRY AND TEAM DATA ====================
const countries = [
    {code: "AF", name: "Afghanistan"}, {code: "AL", name: "Albania"}, {code: "DZ", name: "Algeria"},
    {code: "AD", name: "Andorra"}, {code: "AO", name: "Angola"}, {code: "AG", name: "Antigua and Barbuda"},
    {code: "AR", name: "Argentina"}, {code: "AM", name: "Armenia"}, {code: "AU", name: "Australia"},
    {code: "AT", name: "Austria"}, {code: "AZ", name: "Azerbaijan"}, {code: "BS", name: "Bahamas"},
    {code: "BH", name: "Bahrain"}, {code: "BD", name: "Bangladesh"}, {code: "BB", name: "Barbados"},
    {code: "BY", name: "Belarus"}, {code: "BE", name: "Belgium"}, {code: "BZ", name: "Belize"},
    {code: "BJ", name: "Benin"}, {code: "BT", name: "Bhutan"}, {code: "BO", name: "Bolivia"},
    {code: "BA", name: "Bosnia and Herzegovina"}, {code: "BW", name: "Botswana"}, {code: "BR", name: "Brazil"},
    {code: "BN", name: "Brunei"}, {code: "BG", name: "Bulgaria"}, {code: "BF", name: "Burkina Faso"},
    {code: "BI", name: "Burundi"}, {code: "CV", name: "Cabo Verde"}, {code: "KH", name: "Cambodia"},
    {code: "CM", name: "Cameroon"}, {code: "CA", name: "Canada"}, {code: "CF", name: "Central African Republic"},
    {code: "TD", name: "Chad"}, {code: "CL", name: "Chile"}, {code: "CN", name: "China"},
    {code: "CO", name: "Colombia"}, {code: "KM", name: "Comoros"}, {code: "CG", name: "Congo"},
    {code: "CR", name: "Costa Rica"}, {code: "HR", name: "Croatia"}, {code: "CU", name: "Cuba"},
    {code: "CY", name: "Cyprus"}, {code: "CZ", name: "Czech Republic"}, {code: "DK", name: "Denmark"},
    {code: "DJ", name: "Djibouti"}, {code: "DM", name: "Dominica"}, {code: "DO", name: "Dominican Republic"},
    {code: "EC", name: "Ecuador"}, {code: "EG", name: "Egypt"}, {code: "SV", name: "El Salvador"},
    {code: "GQ", name: "Equatorial Guinea"}, {code: "ER", name: "Eritrea"}, {code: "EE", name: "Estonia"},
    {code: "SZ", name: "Eswatini"}, {code: "ET", name: "Ethiopia"}, {code: "FJ", name: "Fiji"},
    {code: "FI", name: "Finland"}, {code: "FR", name: "France"}, {code: "GA", name: "Gabon"},
    {code: "GM", name: "Gambia"}, {code: "GE", name: "Georgia"}, {code: "DE", name: "Germany"},
    {code: "GH", name: "Ghana"}, {code: "GR", name: "Greece"}, {code: "GD", name: "Grenada"},
    {code: "GT", name: "Guatemala"}, {code: "GN", name: "Guinea"}, {code: "GW", name: "Guinea-Bissau"},
    {code: "GY", name: "Guyana"}, {code: "HT", name: "Haiti"}, {code: "HN", name: "Honduras"},
    {code: "HU", name: "Hungary"}, {code: "IS", name: "Iceland"}, {code: "IN", name: "India"},
    {code: "ID", name: "Indonesia"}, {code: "IR", name: "Iran"}, {code: "IQ", name: "Iraq"},
    {code: "IE", name: "Ireland"}, {code: "IL", name: "Israel"}, {code: "IT", name: "Italy"},
    {code: "JM", name: "Jamaica"}, {code: "JP", name: "Japan"}, {code: "JO", name: "Jordan"},
    {code: "KZ", name: "Kazakhstan"}, {code: "KE", name: "Kenya"}, {code: "KI", name: "Kiribati"},
    {code: "KP", name: "North Korea"}, {code: "KR", name: "South Korea"}, {code: "KW", name: "Kuwait"},
    {code: "KG", name: "Kyrgyzstan"}, {code: "LA", name: "Laos"}, {code: "LV", name: "Latvia"},
    {code: "LB", name: "Lebanon"}, {code: "LS", name: "Lesotho"}, {code: "LR", name: "Liberia"},
    {code: "LY", name: "Libya"}, {code: "LI", name: "Liechtenstein"}, {code: "LT", name: "Lithuania"},
    {code: "LU", name: "Luxembourg"}, {code: "MG", name: "Madagascar"}, {code: "MW", name: "Malawi"},
    {code: "MY", name: "Malaysia"}, {code: "MV", name: "Maldives"}, {code: "ML", name: "Mali"},
    {code: "MT", name: "Malta"}, {code: "MH", name: "Marshall Islands"}, {code: "MR", name: "Mauritania"},
    {code: "MU", name: "Mauritius"}, {code: "MX", name: "Mexico"}, {code: "FM", name: "Micronesia"},
    {code: "MD", name: "Moldova"}, {code: "MC", name: "Monaco"}, {code: "MN", name: "Mongolia"},
    {code: "ME", name: "Montenegro"}, {code: "MA", name: "Morocco"}, {code: "MZ", name: "Mozambique"},
    {code: "MM", name: "Myanmar"}, {code: "NA", name: "Namibia"}, {code: "NR", name: "Nauru"},
    {code: "NP", name: "Nepal"}, {code: "NL", name: "Netherlands"}, {code: "NZ", name: "New Zealand"},
    {code: "NI", name: "Nicaragua"}, {code: "NE", name: "Niger"}, {code: "NG", name: "Nigeria"},
    {code: "MK", name: "North Macedonia"}, {code: "NO", name: "Norway"}, {code: "OM", name: "Oman"},
    {code: "PK", name: "Pakistan"}, {code: "PW", name: "Palau"}, {code: "PS", name: "Palestine"},
    {code: "PA", name: "Panama"}, {code: "PG", name: "Papua New Guinea"}, {code: "PY", name: "Paraguay"},
    {code: "PE", name: "Peru"}, {code: "PH", name: "Philippines"}, {code: "PL", name: "Poland"},
    {code: "PT", name: "Portugal"}, {code: "QA", name: "Qatar"}, {code: "RO", name: "Romania"},
    {code: "RU", name: "Russia"}, {code: "RW", name: "Rwanda"}, {code: "KN", name: "Saint Kitts and Nevis"},
    {code: "LC", name: "Saint Lucia"}, {code: "VC", name: "Saint Vincent and the Grenadines"},
    {code: "WS", name: "Samoa"}, {code: "SM", name: "San Marino"}, {code: "ST", name: "Sao Tome and Principe"},
    {code: "SA", name: "Saudi Arabia"}, {code: "SN", name: "Senegal"}, {code: "RS", name: "Serbia"},
    {code: "SC", name: "Seychelles"}, {code: "SL", name: "Sierra Leone"}, {code: "SG", name: "Singapore"},
    {code: "SK", name: "Slovakia"}, {code: "SI", name: "Slovenia"}, {code: "SB", name: "Solomon Islands"},
    {code: "SO", name: "Somalia"}, {code: "ZA", name: "South Africa"}, {code: "SS", name: "South Sudan"},
    {code: "ES", name: "Spain"}, {code: "LK", name: "Sri Lanka"}, {code: "SD", name: "Sudan"},
    {code: "SR", name: "Suriname"}, {code: "SE", name: "Sweden"}, {code: "CH", name: "Switzerland"},
    {code: "SY", name: "Syria"}, {code: "TW", name: "Taiwan"}, {code: "TJ", name: "Tajikistan"},
    {code: "TZ", name: "Tanzania"}, {code: "TH", name: "Thailand"}, {code: "TL", name: "Timor-Leste"},
    {code: "TG", name: "Togo"}, {code: "TO", name: "Tonga"}, {code: "TT", name: "Trinidad and Tobago"},
    {code: "TN", name: "Tunisia"}, {code: "TR", name: "Turkey"}, {code: "TM", name: "Turkmenistan"},
    {code: "TV", name: "Tuvalu"}, {code: "UG", name: "Uganda"}, {code: "UA", name: "Ukraine"},
    {code: "AE", name: "United Arab Emirates"}, {code: "GB", name: "United Kingdom"},
    {code: "US", name: "United States"}, {code: "UY", name: "Uruguay"}, {code: "UZ", name: "Uzbekistan"},
    {code: "VU", name: "Vanuatu"}, {code: "VA", name: "Vatican City"}, {code: "VE", name: "Venezuela"},
    {code: "VN", name: "Vietnam"}, {code: "YE", name: "Yemen"}, {code: "ZM", name: "Zambia"},
    {code: "ZW", name: "Zimbabwe"}
];

const footballTeams = [
    // European Clubs
    { id: "real-madrid", name: "Real Madrid" }, { id: "barcelona", name: "FC Barcelona" },
    { id: "man-united", name: "Manchester United" }, { id: "man-city", name: "Manchester City" },
    { id: "liverpool", name: "Liverpool" }, { id: "chelsea", name: "Chelsea" },
    { id: "arsenal", name: "Arsenal" }, { id: "tottenham", name: "Tottenham Hotspur" },
    { id: "bayern", name: "Bayern Munich" }, { id: "dortmund", name: "Borussia Dortmund" },
    { id: "psg", name: "Paris Saint-Germain" }, { id: "juventus", name: "Juventus" },
    { id: "ac-milan", name: "AC Milan" }, { id: "inter", name: "Inter Milan" },
    { id: "roma", name: "AS Roma" }, { id: "napoli", name: "Napoli" },
    { id: "ajax", name: "Ajax" }, { id: "benfica", name: "Benfica" },
    { id: "porto", name: "FC Porto" }, { id: "celtic", name: "Celtic" },
    
    // South American Clubs
    { id: "boca-juniors", name: "Boca Juniors" }, { id: "river-plate", name: "River Plate" },
    { id: "flamengo", name: "Flamengo" }, { id: "palmeiras", name: "Palmeiras" },
    { id: "santos", name: "Santos" }, { id: "corinthians", name: "Corinthians" },
    { id: "penarol", name: "Peñarol" }, { id: "nacional", name: "Nacional" },
    
    // Tanzanian and East African Clubs
    { id: "young-africans", name: "Young Africans (Yanga SC)" }, { id: "simba-sc", name: "Simba SC" },
    { id: "azam-fc", name: "Azam FC" }, { id: "coastal-union", name: "Coastal Union" },
    { id: "kmkm", name: "KMKM" }, { id: "namungo", name: "Namungo FC" },
    { id: "geita-gold", name: "Geita Gold FC" }, { id: "kagera-sugar", name: "Kagera Sugar" },
    { id: "gor-mahia", name: "Gor Mahia (Kenya)" }, { id: "afc-leopards", name: "AFC Leopards (Kenya)" },
    { id: "vipers-sc", name: "Vipers SC (Uganda)" }, { id: "kcca", name: "KCCA FC (Uganda)" },
    
    // Other African Clubs
    { id: "al-ahly", name: "Al Ahly (Egypt)" }, { id: "zamalek", name: "Zamalek SC (Egypt)" },
    { id: "mamelodi-sundowns", name: "Mamelodi Sundowns (South Africa)" }, { id: "kaizer-chiefs", name: "Kaizer Chiefs (South Africa)" },
    { id: "orlando-pirates", name: "Orlando Pirates (South Africa)" }, { id: "tp-mazembe", name: "TP Mazembe (DR Congo)" },
    { id: "es-sahel", name: "Étoile du Sahel (Tunisia)" }, { id: "esperance", name: "Espérance de Tunis (Tunisia)" },
    { id: "wydad", name: "Wydad AC (Morocco)" }, { id: "raja-casablanca", name: "Raja Casablanca (Morocco)" },
    { id: "asunso-kotoko", name: "Asante Kotoko (Ghana)" }, { id: "hearts-of-oak", name: "Hearts of Oak (Ghana)" },
    { id: "enugu-rangers", name: "Enugu Rangers (Nigeria)" }, { id: "es-setif", name: "ES Sétif (Algeria)" },
    
    // Asian Clubs
    { id: "al-hilal", name: "Al Hilal (Saudi Arabia)" }, { id: "al-nassr", name: "Al Nassr (Saudi Arabia)" },
    { id: "al-ain", name: "Al Ain FC (UAE)" }, { id: "al-sadd", name: "Al Sadd SC (Qatar)" },
    { id: "persepolis", name: "Persepolis FC (Iran)" }, { id: "jubilo-iwata", name: "Júbilo Iwata (Japan)" },
    { id: "kashima-antlers", name: "Kashima Antlers (Japan)" }, { id: "jeonbuk-hyundai", name: "Jeonbuk Hyundai Motors (South Korea)" },
    { id: "suwon-bluewings", name: "Suwon Samsung Bluewings (South Korea)" }, { id: "shanghai-shenhua", name: "Shanghai Shenhua (China)" },
    { id: "guangzhou-fc", name: "Guangzhou FC (China)" },
    
    // North American Clubs
    { id: "cruz-azul", name: "Cruz Azul (Mexico)" }, { id: "america", name: "Club América (Mexico)" },
    { id: "chivas", name: "Guadalajara (Mexico)" }, { id: "monterrey", name: "CF Monterrey (Mexico)" },
    { id: "la-galaxy", name: "LA Galaxy (USA)" }, { id: "la-fc", name: "Los Angeles FC (USA)" },
    { id: "seattle-sounders", name: "Seattle Sounders FC (USA)" }, { id: "toronto-fc", name: "Toronto FC (Canada)" },
    { id: "montreal-impact", name: "CF Montréal (Canada)" },
    
    // National Teams
    { id: "brazil-nt", name: "Brazil National Team" }, { id: "argentina-nt", name: "Argentina National Team" },
    { id: "germany-nt", name: "Germany National Team" }, { id: "france-nt", name: "France National Team" },
    { id: "spain-nt", name: "Spain National Team" }, { id: "italy-nt", name: "Italy National Team" },
    { id: "england-nt", name: "England National Team" }, { id: "portugal-nt", name: "Portugal National Team" },
    { id: "netherlands-nt", name: "Netherlands National Team" }, { id: "belgium-nt", name: "Belgium National Team" },
    { id: "tanzania-nt", name: "Tanzania National Team" }, { id: "kenya-nt", name: "Kenya National Team" },
    { id: "uganda-nt", name: "Uganda National Team" }, { id: "ghana-nt", name: "Ghana National Team" },
    { id: "nigeria-nt", name: "Nigeria National Team" }, { id: "egypt-nt", name: "Egypt National Team" },
    { id: "morocco-nt", name: "Morocco National Team" }, { id: "senegal-nt", name: "Senegal National Team" },
    { id: "cameroon-nt", name: "Cameroon National Team" }, { id: "south-africa-nt", name: "South Africa National Team" },
    { id: "usa-nt", name: "United States National Team" }, { id: "mexico-nt", name: "Mexico National Team" },
    { id: "japan-nt", name: "Japan National Team" }, { id: "south-korea-nt", name: "South Korea National Team" },
    { id: "saudi-arabia-nt", name: "Saudi Arabia National Team" }, { id: "australia-nt", name: "Australia National Team" },
    
    // Other Popular European Teams
    { id: "atletico-madrid", name: "Atlético Madrid" }, { id: "sevilla", name: "Sevilla" },
    { id: "valencia", name: "Valencia" }, { id: "lyon", name: "Olympique Lyonnais" },
    { id: "marseille", name: "Olympique de Marseille" }, { id: "monaco", name: "AS Monaco" },
    { id: "lazio", name: "Lazio" }, { id: "atalanta", name: "Atalanta" },
    { id: "leverkusen", name: "Bayer Leverkusen" }, { id: "leipzig", name: "RB Leipzig" },
    { id: "schalke", name: "Schalke 04" }, { id: "everton", name: "Everton" },
    { id: "leicester", name: "Leicester City" }, { id: "westham", name: "West Ham United" },
    { id: "newcastle", name: "Newcastle United" }, { id: "aston-villa", name: "Aston Villa" }
];

// ==================== AUTH MANAGER ====================
class AuthManager {
    constructor(auth, db, storage) {
        this.auth = auth;
        this.db = db;
        this.storage = storage;
        this.user = null;
        this.userData = null;
        this.adminEmails = ['kingharuni420@gmail.com', 'harunihilson@gmail.com'];
        this.superAdminEmail = 'kingharuni420@gmail.com'; // unchanged
        this.adminPassword = 'Kalinga@25';
        this.unsubscribe = null;
    }
    
    async init() {
        console.log("🔐 AuthManager initializing...");
        try { await this.auth.signOut(); } catch(e) {}
        
        return new Promise((resolve) => {
            const timeout = setTimeout(() => {
                console.warn("⚠️ Auth state timeout – resolving with null");
                resolve(null);
            }, 5000);
            
            this.unsubscribe = this.auth.onAuthStateChanged(async (user) => {
                clearTimeout(timeout);
                if (user) {
                    this.user = user;
                    await this.loadUserData(user.uid);
                    this.checkAdminStatus(user);
                    if (window.chatSystem) {
                        window.chatSystem.cleanup(); // remove old listeners
                        window.chatSystem = new ChatSystem();
                        window.chatSystem.init();
                    }
                    showWelcomeAnimation()
                    this.showAppropriateDashboard();
                    updateUserBalanceDisplay();
                    // After authManager.init() and user data loaded
                    window.chatSystem = new ChatSystem();
                    window.chatSystem.init();

                    
                    resolve(user);
                } else {
                    this.user = null;
                    this.userData = null;
                    this.showAuthPage();
                    resolve(null);
                }
            });
        });
    }
    
    async loadUserData(uid) {
        try {
            const userDoc = await this.db.collection('users').doc(uid).get();
            if (userDoc.exists) {
                this.userData = userDoc.data();
                this.userData.uid = uid;
                // Ensure balance field exists
                if (this.userData.balance === undefined) this.userData.balance = 0;
                loadUserProfile();
                loadProfileStats();
                setTimeout(() => loadProfileStats(), 500);
                console.log("✅ User data loaded");
                updateHamburgerMenu();
                updateUserBalanceDisplay();
                if (window.bettingSystem) window.bettingSystem.init();
                return this.userData;
            }
            return null;
        } catch (error) {
            console.error("Error loading user data:", error);
            return null;
        }
    }
 
    // Add this method to your AuthManager class
loadUserProfile() {
    if (!this.userData) return;
    
    // Profile full name
    const profileFullName = document.getElementById('profileFullName');
    if (profileFullName) {
        profileFullName.textContent = this.userData.fullName || 'Not Set';
    }

    // Profile role badge
    const profileRoleBadge = document.getElementById('profileRoleBadge');
    if (profileRoleBadge) {
        const role = this.userData.role || 'user';
        let badgeClass = 'badge-user';
        let badgeText = 'Member';
        
        if (role === 'admin') {
            badgeClass = 'badge-admin';
            badgeText = 'Admin';
        } else if (role === 'superadmin') {
            badgeClass = 'badge-superadmin';
            badgeText = 'Super Admin';
        } else if (role === 'vip') {
            badgeClass = 'badge-vip';
            badgeText = 'VIP Member';
        }
        
        profileRoleBadge.innerHTML = `<span class="${badgeClass}">${badgeText}</span>`;
    }

    // Email
    const profileEmail = document.getElementById('profileEmail');
    if (profileEmail) {
        profileEmail.textContent = this.userData.email || 'Not provided';
    }

    // Phone
    const profilePhone = document.getElementById('profilePhone');
    if (profilePhone) {
        profilePhone.textContent = this.userData.phone || 'Not provided';
    }

    // Country
    const profileCountry = document.getElementById('profileCountry');
    if (profileCountry) {
        let countryName = this.userData.country || 'Not selected';
        
        if (typeof countries !== 'undefined' && this.userData.country) {
            const country = countries.find(c => c.code === this.userData.country);
            if (country) {
                countryName = country.name;
            }
        }
        
        profileCountry.textContent = countryName;
    }

    // Favorite team
    const profileFavoriteTeam = document.getElementById('profileFavoriteTeam');
    if (profileFavoriteTeam) {
        let teamName = this.userData.favoriteTeam || 'Not selected';
        
        if (typeof footballTeams !== 'undefined' && this.userData.favoriteTeam) {
            const team = footballTeams.find(t => t.id === this.userData.favoriteTeam);
            if (team) {
                teamName = team.name;
            }
        }
        
        profileFavoriteTeam.textContent = teamName;
    }

    // Join date
    const profileJoinDate = document.getElementById('profileJoinDate');
    if (profileJoinDate && this.userData.createdAt) {
        let joinDate;
        if (this.userData.createdAt.toDate) {
            joinDate = this.userData.createdAt.toDate();
        } else if (this.userData.createdAt instanceof Date) {
            joinDate = this.userData.createdAt;
        } else {
            joinDate = new Date(this.userData.createdAt);
        }
        
        const formattedDate = joinDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        profileJoinDate.textContent = formattedDate;
    }
}
    
    checkAdminStatus(user) {
        if (window.formHandler && typeof window.formHandler.handleAdminEmailDetection === 'function') {
            window.formHandler.handleAdminEmailDetection(user?.email);
        }
    }
    
    showAppropriateDashboard() {
        console.log('Showing appropriate dashboard for role:', this.userData?.role || 'user');
        const authContainer = document.getElementById('authContainer');
        if (authContainer) authContainer.style.display = 'none';
        this.updateUserUI();
        
  if (window.chatSystem) {
    window.chatSystem.cleanup();
    window.chatSystem = new ChatSystem();
    window.chatSystem.init();
  }
  
  // Inside AuthManager.init(), after loading user data
if (window.chatSystem) {
    window.chatSystem.cleanup();
}
window.chatSystem = new ChatSystem();
window.chatSystem.init();
        
        if (this.userData?.role === 'superadmin') {
            this.showSuperAdminDashboard();
        } else if (this.userData?.role === 'admin') {
            this.showAdminDashboard();
        } else {
            this.showUserDashboard();
        }
    }
    
    updateUserUI() {
        if (!this.userData) return;
        const firstName = this.userData.fullName ? this.userData.fullName.split(' ')[0] : 'User';
        const initials = this.userData.fullName ? this.userData.fullName.charAt(0).toUpperCase() : 'U';
        this.updateUserDashboardUI(firstName, initials);
        this.updateAdminDashboardUI(firstName, initials);
        this.updateSuperAdminDashboardUI(firstName, initials);
    }
    
    updateUserDashboardUI(firstName, initials) {
        const welcomeName = document.getElementById('welcomeName');
        if (welcomeName) welcomeName.textContent = firstName;
        const userName = document.getElementById('userName');
        if (userName) userName.textContent = this.userData.fullName || this.userData.email;
        const userAvatar = document.getElementById('userAvatar');
        if (userAvatar) {
            userAvatar.textContent = initials;
            userAvatar.style.background = this.userData.avatarColor || this.getRandomColor();
        }
        const userRole = document.getElementById('userRoleBadge');
        if (userRole) userRole.textContent = this.userData.role || 'User';
        const userReferralCode = document.getElementById('userReferralCode');
        if (userReferralCode && this.userData.referralCode) {
            userReferralCode.textContent = this.userData.referralCode;
        }
        const referralCount = document.getElementById('referralCount');
        if (referralCount) {
            referralCount.textContent = this.userData.referralCount || 0;
        
    
    // Update dropdown elements
    const dropdownAvatar = document.getElementById('dropdownAvatar');
    if (dropdownAvatar) {
        dropdownAvatar.textContent = initials;
        dropdownAvatar.style.background = this.userData.avatarColor || this.getRandomColor();
    }
    
    const dropdownUserName = document.getElementById('dropdownUserName');
    if (dropdownUserName) dropdownUserName.textContent = this.userData.fullName || this.userData.email;
    
    const dropdownUserEmail = document.getElementById('dropdownUserEmail');
    if (dropdownUserEmail) dropdownUserEmail.textContent = this.userData.email || '';
    
    const dropdownBalance = document.getElementById('dropdownBalance');
    if (dropdownBalance) dropdownBalance.textContent = `TZS ${(this.userData.balance || 0).toFixed(2)}`;
    
    const dropdownReferralCount = document.getElementById('dropdownReferralCount');
    if (dropdownReferralCount) dropdownReferralCount.textContent = this.userData.referralCount || 0;
    
    const referralBadge = document.getElementById('referralBadge');
    if (referralBadge) referralBadge.textContent = this.userData.referralCount || 0;
}
    }
    
    updateAdminDashboardUI(firstName, initials) {
        const adminUserName = document.getElementById('adminUserName');
        if (adminUserName) adminUserName.textContent = this.userData.fullName || this.userData.email;
        const adminAvatar = document.getElementById('adminAvatar');
        if (adminAvatar) {
            adminAvatar.textContent = initials;
            adminAvatar.style.background = this.userData.avatarColor || this.getRandomColor();
        }
        const adminRoleBadge = document.getElementById('adminRoleBadge');
        if (adminRoleBadge) adminRoleBadge.textContent = this.userData.role || 'Admin';
        document.getElementById('adminChatList')
    }
    
    updateSuperAdminDashboardUI(firstName, initials) {
        const superAdminUserName = document.getElementById('superAdminUserName');
        if (superAdminUserName) superAdminUserName.textContent = this.userData.fullName || this.userData.email;
        const superAdminAvatar = document.getElementById('superAdminAvatar');
        if (superAdminAvatar) {
            superAdminAvatar.textContent = initials;
            superAdminAvatar.style.background = this.userData.avatarColor || this.getRandomColor();
        }
        const superAdminRoleBadge = document.getElementById('superAdminRoleBadge');
        if (superAdminRoleBadge) superAdminRoleBadge.textContent = this.userData.role || 'Super Admin';
    }
    
    showUserDashboard() {
        const userDashboard = document.getElementById('user-dashboard');
        const authContainer = document.getElementById('authContainer');
        if (userDashboard) userDashboard.style.display = 'block';
        if (authContainer) authContainer.style.display = 'none';
        this.setupDashboardNavigation('user-dashboard');
        this.setupLogoutButton('userLogoutBtn');

    setTimeout(() => {
        initHamburgerMenu();
        updateHamburgerMenu();
    }, 500);
}
    
    
showAdminDashboard() {
    const adminDashboard = document.getElementById('admin-dashboard');
    const authContainer = document.getElementById('authContainer');
    if (adminDashboard) adminDashboard.style.display = 'block';
    if (authContainer) authContainer.style.display = 'none';
    this.setupDashboardNavigation('admin-dashboard');
    this.setupLogoutButton('adminLogoutBtn');
    // 👇 Show chat section by default
    if (window.sectionManager) {
        window.sectionManager.showSection('adminChatSection', 'admin-dashboard');
    }
}

showSuperAdminDashboard() {
    const superAdminDashboard = document.getElementById('super-admin-dashboard');
    const authContainer = document.getElementById('authContainer');
    if (superAdminDashboard) superAdminDashboard.style.display = 'block';
    if (authContainer) authContainer.style.display = 'none';
    this.setupDashboardNavigation('super-admin-dashboard');
    this.setupLogoutButton('superAdminLogoutBtn');
    // 👇 Show chat section by default
    if (window.sectionManager) {
        window.sectionManager.showSection('adminChatSection', 'super-admin-dashboard');
    }
}
    
    showAuthPage() {
        const authContainer = document.getElementById('authContainer');
        const userDashboard = document.getElementById('user-dashboard');
        const adminDashboard = document.getElementById('admin-dashboard');
        const superAdminDashboard = document.getElementById('super-admin-dashboard');
        if (authContainer) authContainer.style.display = 'flex';
        if (userDashboard) userDashboard.style.display = 'none';
        if (adminDashboard) adminDashboard.style.display = 'none';
        if (superAdminDashboard) superAdminDashboard.style.display = 'none';
    }
    
    setupDashboardNavigation(dashboardId) {
        const dashboard = document.getElementById(dashboardId);
        if (!dashboard) return;
        const navItems = dashboard.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = item.getAttribute('data-section');
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                const contentSections = dashboard.querySelectorAll('.content-section');
                contentSections.forEach(section => section.classList.remove('active'));
                const targetSection = document.getElementById(sectionId);
                if (targetSection) targetSection.classList.add('active');
            });
        });
    }
    
    setupLogoutButton(buttonId) {
        const logoutBtn = document.getElementById(buttonId);
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                try {
                    await this.auth.signOut();
                } catch (error) {
                    console.error('Logout error:', error);
                    showNotification('Logout failed. Please try again.', 'error');
                }
            });
        }
    }
    
    getRandomColor() {
        const colors = ['#4A6FA5', '#16697A', '#FFA62B', '#2E8B57', '#DC143C', '#6A5ACD', '#20B2AA', '#FF6347', '#4682B4', '#32CD32'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// Profile dropdown toggle
function initProfileMenu() {
    const trigger = document.getElementById('profileMenuTrigger');
    const dropdown = document.getElementById('profileDropdown');
    
    if (trigger && dropdown) {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            trigger.setAttribute('aria-expanded', !isExpanded);
            dropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
                trigger.setAttribute('aria-expanded', 'false');
                dropdown.classList.remove('show');
            }
        });
    }
}

// Call this after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...
    initProfileMenu();
});

// ==================== FORM HANDLER CLASS ====================
// ==================== FORM HANDLER CLASS (UPDATED WITH VERIFICATION NUMBER) ====================
class FormHandler {
    constructor(authManager) {
        this.authManager = authManager;
        // 🆕 Verification number system
        this.verificationNumber = null;
    }
    
    init() {
    this.setupFormSwitching();
    this.setupPasswordToggles();
    this.setupFormSubmissions();
    this.setupForgotPassword(); // ← ADD THIS LINE
    this.populateCountries();
    this.populateTeams();
    this.setupAdminEmailDetection();
    this.setupVerificationField();
    this.generateVerificationNumber();
    console.log("✅ FormHandler initialized with verification number");
}

setupForgotPassword() {
    const forgotPassword = document.getElementById('forgotPassword');
    if (forgotPassword) {
        // Remove any existing listeners to avoid duplicates
        const newLink = forgotPassword.cloneNode(true);
        forgotPassword.parentNode.replaceChild(newLink, forgotPassword);
        newLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });
    }
}

handleForgotPassword() {
    const emailInput = document.getElementById('resetEmail');
    if (emailInput) emailInput.value = '';
    openModal('forgotPasswordModal');
}

    // ========== 🆕 VERIFICATION NUMBER METHODS ==========
    setupVerificationField() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;
        
        // Avoid duplicate insertion
        if (document.getElementById('verificationGroup')) return;
        
        // Create the verification field group
        const verificationHTML = `
            <div id="verificationGroup" class="input-group" style="margin-bottom: 1rem;">
                <label for="verificationInput">
                    <i class="fas fa-shield-alt"></i> Verification Number
                </label>
                <div style="display: flex; gap: 0.75rem; align-items: center;">
                    <div id="verificationDisplay" style="
                        background: linear-gradient(135deg, var(--accent-color), #FF8C00);
                        color: white;
                        font-weight: bold;
                        font-size: 1.5rem;
                        padding: 0.5rem 1rem;
                        border-radius: 8px;
                        letter-spacing: 4px;
                        text-align: center;
                        min-width: 100px;
                    ">----</div>
                    <div class="password-wrapper" style="flex: 1;">
                        <input type="text" id="verificationInput" 
                               placeholder="Enter the number above" 
                               required
                               autocomplete="off"
                               style="width: 100%;">
                        <button type="button" class="toggle-password" onclick="document.getElementById('verificationInput').value = ''; return false;">
                            <i class="fas fa-undo-alt"></i>
                        </button>
                    </div>
                </div>
                <p id="verificationHint" style="font-size: 0.8rem; color: var(--gray-color); margin-top: 0.25rem;">
                    <i class="fas fa-info-circle"></i> Enter the displayed 4-digit code
                </p>
            </div>
        `;
        
        // Insert before the submit button (assumes last button in form)
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.insertAdjacentHTML('beforebegin', verificationHTML);
        } else {
            loginForm.insertAdjacentHTML('beforeend', verificationHTML);
        }
        
        // Add input listener to clear error styling on type
        const verificationInput = document.getElementById('verificationInput');
        if (verificationInput) {
            verificationInput.addEventListener('input', () => {
                verificationInput.style.borderColor = '';
            });
        }
    }
    
    generateVerificationNumber() {
        // Generate random 4-digit number (1000-9999)
        this.verificationNumber = Math.floor(1000 + Math.random() * 9000).toString();
        const displayEl = document.getElementById('verificationDisplay');
        if (displayEl) {
            displayEl.textContent = this.verificationNumber;
            displayEl.style.background = ' var(--secondary-color)';
        }
        console.log(`🆕 Verification number generated: ${this.verificationNumber}`);
        return this.verificationNumber;
    }
    
    validateVerificationNumber() {
        const input = document.getElementById('verificationInput');
        if (!input) return true; // fallback – field not present, allow login
        
        const entered = input.value.trim();
        const isValid = entered === this.verificationNumber;
        
        if (!isValid) {
            // Show error state
            input.style.borderColor = 'var(--danger-color)';
            input.style.backgroundColor = 'rgba(220, 20, 60, 0.1)';
            
            // Generate new number automatically
            this.generateVerificationNumber();
            
            // Clear the input field
            input.value = '';
            
            showNotification('❌ Incorrect verification number. A new code has been generated.', 'error');
            return false;
        }
        
        // Valid – reset styling
        input.style.borderColor = '';
        input.style.backgroundColor = '';
        return true;
    }
    
    populateCountries() {
        const countrySelect = document.getElementById('country');
        if (!countrySelect) return;
        const sorted = [...countries].sort((a, b) => a.name.localeCompare(b.name));
        const options = ['<option value="">Select Country</option>'];
        for (const c of sorted) {
            options.push(`<option value="${c.code}">${c.name}</option>`);
        }
        countrySelect.innerHTML = options.join('');
    }
    
    populateTeams() {
        const teamSelect = document.getElementById('favoriteTeam');
        if (!teamSelect) return;
        const sorted = [...footballTeams].sort((a, b) => a.name.localeCompare(b.name));
        const options = ['<option value="">Select Favorite Team</option>'];
        for (const t of sorted) {
            options.push(`<option value="${t.id}">${t.name}</option>`);
        }
        teamSelect.innerHTML = options.join('');
    }
    
    handleForgotPassword() {
    // Clear previous input
    const emailInput = document.getElementById('resetEmail');
    if (emailInput) emailInput.value = '';
    
    // Open the modal
    openModal('forgotPasswordModal');
}
    
    setupAdminEmailDetection() {
        const loginEmailInput = document.getElementById('loginEmail');
        if (!loginEmailInput) return;
        let debounceTimer;
        loginEmailInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                const email = e.target.value.trim().toLowerCase();
                this.handleAdminEmailDetection(email);
            }, 300);
        });
    }
    
    handleAdminEmailDetection(email) {
        const container = document.getElementById('adminFeaturesContainer') || document.getElementById('adminPasswordContainer');
        if (!container) return;
        const isAdmin = this.authManager.adminEmails.includes(email);
        if (isAdmin && email) {
            container.style.display = 'block';
            const isSuperAdmin = email === this.authManager.superAdminEmail;
            container.innerHTML = `
                <div class="input-group">
                    <label for="adminPassword">
                        <i class="fas ${isSuperAdmin ? 'fa-crown' : 'fa-user-shield'}"></i>
                        ${isSuperAdmin ? 'Super Admin' : 'Admin'} Password
                    </label>
                    <div class="password-wrapper">
                        <input type="password" id="adminPassword" 
                               placeholder="Enter ${isSuperAdmin ? 'super admin' : 'admin'} password" 
                               required>
                        <button type="button" class="toggle-password">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                    <p class="admin-notice ${isSuperAdmin ? 'super-admin' : 'regular-admin'}">
                        <i class="fas ${isSuperAdmin ? 'fa-shield-alt' : 'fa-user-tie'}"></i>
                        ${isSuperAdmin ? 'Super Admin' : 'Admin'} access detected
                    </p>
                </div>
            `;
            const toggleBtn = container.querySelector('.toggle-password');
            if (toggleBtn) {
                toggleBtn.addEventListener('click', function() {
                    const input = this.parentElement.querySelector('input');
                    const icon = this.querySelector('i');
                    if (input.type === 'password') {
                        input.type = 'text';
                        icon.classList.remove('fa-eye');
                        icon.classList.add('fa-eye-slash');
                    } else {
                        input.type = 'password';
                        icon.classList.remove('fa-eye-slash');
                        icon.classList.add('fa-eye');
                    }
                });
            }
        } else {
            container.style.display = 'none';
            container.innerHTML = '';
        }
    }
    
    setupFormSwitching() {
        const loginSwitch = document.getElementById('login');
        const signupSwitch = document.getElementById('signupSwitch');
        if (loginSwitch) loginSwitch.addEventListener('click', () => this.switchForm('login'));
        if (signupSwitch) signupSwitch.addEventListener('click', () => this.switchForm('signup'));
        document.querySelectorAll('.switch-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const formType = e.target.getAttribute('data-form');
                this.switchForm(formType);
            });
        });
    }
    
    switchForm(formType) {
        const loginSwitch = document.getElementById('login');
        const signupSwitch = document.getElementById('signupSwitch');
        const formSlider = document.getElementById('formSlider');
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        if (formType === 'login') {
            if (loginSwitch) loginSwitch.classList.add('active');
            if (signupSwitch) signupSwitch.classList.remove('active');
            if (formSlider) formSlider.classList.remove('signup-active');
            if (loginForm) loginForm.classList.add('active');
            if (signupForm) signupForm.classList.remove('active');
        } else {
            if (signupSwitch) signupSwitch.classList.add('active');
            if (loginSwitch) loginSwitch.classList.remove('active');
            if (formSlider) formSlider.classList.add('signup-active');
            if (signupForm) signupForm.classList.add('active');
            if (loginForm) loginForm.classList.remove('active');
        }
        const adminPasswordContainer = document.getElementById('adminPasswordContainer') || document.getElementById('adminFeaturesContainer');
        if (adminPasswordContainer) {
            adminPasswordContainer.style.display = 'none';
            adminPasswordContainer.innerHTML = '';
        }
    }
    
    setupPasswordToggles() {
        document.querySelectorAll('.toggle-password').forEach(button => {
            button.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                const icon = this.querySelector('i');
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    }
    
    setupFormSubmissions() {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }
    }
    

    
    // ========== MODIFIED LOGIN HANDLER ==========
    async handleLogin() {
        // 🆕 Verification check – if fails, stop login and refresh number
        if (!this.validateVerificationNumber()) {
            return;
        }
        
        const email = document.getElementById('loginEmail')?.value.trim().toLowerCase() || '';
        const password = document.getElementById('loginPassword')?.value || '';
        const adminPassword = document.getElementById('adminPassword')?.value || '';
        
        if (!email || !password) {
            showNotification('Please enter both email and password', 'error');
            return;
        }
        
        showLoading('Signing in...');
        
        try {
            // ---------- ADMIN LOGIN FLOW ----------
            if (this.authManager.adminEmails.includes(email)) {
                console.log('👑 Admin email detected:', email);
                
                if (!adminPassword || adminPassword !== this.authManager.adminPassword) {
                    showNotification('Invalid admin password', 'error');
                    hideLoading();
                    // 🆕 Generate new verification number after failed attempt
                    this.generateVerificationNumber();
                    return;
                }
                
                try {
                    const userCredential = await auth.signInWithEmailAndPassword(email, password);
                    console.log('✅ Admin login successful');
                    
                    const userDoc = await db.collection('users').doc(userCredential.user.uid).get();
                    if (!userDoc.exists) {
                        await this.createAdminUserDocument(
                            userCredential.user.uid,
                            email,
                            email === this.authManager.superAdminEmail ? 'superadmin' : 'admin'
                        );
                    }
 
                    await this.authManager.loadUserData(userCredential.user.uid);
                    this.authManager.showAppropriateDashboard();
                    hideLoading();
                    return;
                    
                } catch (error) {
                    if (error.code === 'auth/user-not-found') {
                        console.log('📝 Admin not found, creating account...');
                        await this.createAdminUser(
                            email,
                            password,
                            email === this.authManager.superAdminEmail ? 'superadmin' : 'admin'
                        );
                        showNotification(
                            'Admin account created. Please check your email for verification, then log in.',
                            'success'
                        );
                        this.switchForm('login');
                        hideLoading();
                        return;
                    }
                    throw error;
                }
            }
            
            // ---------- REGULAR USER LOGIN ----------
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            
            const userDoc = await db.collection('users').doc(userCredential.user.uid).get();
            if (userDoc.exists && userDoc.data().status === 'blocked') {
                await auth.signOut();
                throw new Error('Your account has been blocked. Please contact support.');
            }
            
            await this.authManager.loadUserData(userCredential.user.uid);
            this.authManager.showAppropriateDashboard();
            console.log('✅ User login successful');
            hideLoading();
            
        } catch (error) {
            hideLoading();
            // 🆕 Generate new verification number on any login error
            this.generateVerificationNumber();
            this.handleAuthError(error, 'login');
        }
    }
    
    
    async createAdminUser(email, password, role) {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            console.log(`${role} created in Firebase Auth`);
            await this.createAdminUserDocument(userCredential.user.uid, email, role);
            await userCredential.user.sendEmailVerification();
            await auth.signOut();
            console.log(`${role} account created and signed out successfully`);
        } catch (error) {
            console.error(`Error creating ${role}:`, error);
            throw error;
        }
    }
    
    async createAdminUserDocument(uid, email, role) {
        const fullName = role === 'superadmin' ? 'Super Admin' : 'Administrator';
        const username = email.split('@')[0];
        const userData = {
            uid, email, fullName, username,
            phone: '+1234567890', country: 'US', favoriteTeam: 'real-madrid',
            referralCode: this.generateReferralCode(fullName),
            referredBy: null, role,
            avatarColor: this.getRandomColor(),
            balance: 50000, // TZS starting balance
            points: 1000, predictions: 0, correctPredictions: 0, totalMatches: 0, winRate: 0,
            status: 'active', isVerified: true, emailVerified: true, referralCount: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            adminPermissions: role === 'superadmin' ? ['all'] : ['user_management', 'content_management']
        };
        await db.collection('users').doc(uid).set(userData);
        console.log(`${role} document created in Firestore`);
        return userData;
    }
    
    async handleSignup() {
        const formData = {
            fullName: document.getElementById('fullName')?.value.trim() || '',
            username: document.getElementById('username')?.value.trim().toLowerCase() || '',
            phone: document.getElementById('phone')?.value.trim() || '',
            email: document.getElementById('email')?.value.trim().toLowerCase() || '',
            password: document.getElementById('password')?.value || '',
            confirmPassword: document.getElementById('confirmPassword')?.value || '',
            country: document.getElementById('country')?.value || '',
            favoriteTeam: document.getElementById('favoriteTeam')?.value || '',
            terms: document.getElementById('terms')?.checked || false,
            referralCode: document.getElementById('referralCodeInput')?.value.trim() || ''
        };
        
        if (!this.validateSignupForm(formData)) return;
        
        showLoading('Creating account...');
        
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(formData.email, formData.password);
            const user = userCredential.user;
            
            await user.sendEmailVerification();
            await this.createUserDocument(user.uid, formData);
            
            await this.authManager.loadUserData(user.uid);
            this.authManager.showAppropriateDashboard();
            
            showNotification(
                'Account created successfully! You are now logged in. Please verify your email.',
                'success'
            );
            
            document.getElementById('signupForm')?.reset();
            
        } catch (error) {
            this.handleAuthError(error, 'signup');
        } finally {
            hideLoading();
        }
    }
    
    validateSignupForm(formData) {
        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
            showNotification('Please fill in all required fields', 'error');
            return false;
        }
        if (formData.password.length < 6) {
            showNotification('Password must be at least 6 characters long', 'error');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return false;
        }
        if (!formData.terms) {
            showNotification('You must agree to the terms and conditions', 'error');
            return false;
        }
        return true;
    }
    
    async createUserDocument(uid, formData) {
        const userData = {
            uid,
            email: formData.email,
            fullName: formData.fullName,
            username: formData.username,
            phone: formData.phone,
            country: formData.country,
            favoriteTeam: formData.favoriteTeam,
            role: 'user',
            balance: 0, // TZS starting balance for betting
            points: 0,
            status: 'active',
            referralCode: this.generateReferralCode(formData.fullName),
            referredBy: null,
            referralCount: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (formData.referralCode) {
            try {
                const referrerSnapshot = await db
                    .collection('users')
                    .where('referralCode', '==', formData.referralCode)
                    .limit(1)
                    .get();

                if (!referrerSnapshot.empty) {
                    const referrerId = referrerSnapshot.docs[0].id;
                    userData.referredBy = referrerId;

                    await db.runTransaction(async (transaction) => {
                        const referrerRef = db.collection('users').doc(referrerId);
                        const referrerSnap = await transaction.get(referrerRef);
                        if (referrerSnap.exists) {
                            const currentCount = referrerSnap.data().referralCount || 0;
                            transaction.update(referrerRef, { referralCount: currentCount + 1 });
                        }
                    });
                    console.log(`✅ Referral applied: ${formData.referralCode} → user ${uid}`);
                } else {
                    console.log(`⚠️ Referral code not found: ${formData.referralCode}`);
                }
            } catch (error) {
                console.error("Error processing referral code:", error);
            }
        }

        await db.collection('users').doc(uid).set(userData);
        console.log("✅ User document created in Firestore");
        return userData;
    }
    

    handleAuthError(error, context) {
        let errorMessage = 'An error occurred. Please try again.';
        switch (error.code) {
            case 'auth/user-not-found': errorMessage = 'No account found with this email.'; break;
            case 'auth/wrong-password': errorMessage = 'Incorrect password.'; break;
            case 'auth/email-already-in-use': errorMessage = 'Email already in use.'; break;
            case 'auth/weak-password': errorMessage = 'Password is too weak.'; break;
            default: errorMessage = error.message || errorMessage;
        }
        if (context === 'signup') {
            showNotification('signupError: ' + errorMessage, 'error');
        } else if (context === 'forgotPassword') {
            alert(`Error: ${errorMessage}`);
        } else {
            showNotification('loginError: ' + errorMessage, 'error');
        }
        console.error(`${context} error:`, error);
    }
    
    generateReferralCode(fullName) {
        let namePart = fullName.split(' ')[0].toUpperCase().substring(0, 3);
        if (namePart.length < 3) namePart = namePart.padEnd(3, 'X');
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        return `${namePart}${randomDigits}`;
    }
    
    getRandomColor() {
        const colors = ['#4A6FA5', '#16697A', '#FFA62B', '#2E8B57', '#DC143C', '#6A5ACD', '#20B2AA', '#FF6347', '#4682B4', '#32CD32'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// ==================== BANK CARDS MODAL LOADER ====================
window.loadBankCardsData = async function() {
    const userId = window.authManager?.user?.uid;
    if (!userId) {
        showNotification('Please login first', 'error');
        return;
    }
    
    const container = document.getElementById('bankCardsGrid');
    if (!container) {
        console.error('Bank cards grid not found');
        return;
    }
    
    container.innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i> Loading cards...</div>';
    
    try {
        // Attempt indexed query first
        let snapshot;
        try {
            snapshot = await db.collection('userBankAccounts')
                .where('userId', '==', userId)
                .orderBy('isDefault', 'desc')
                .get();
        } catch (indexError) {
            // Index missing – fallback to simple query + in‑memory sort
            console.warn('Index missing, falling back to in‑memory sort');
            const fallback = await db.collection('userBankAccounts')
                .where('userId', '==', userId)
                .get();
            
            const docs = [];
            fallback.forEach(doc => docs.push({ id: doc.id, ...doc.data() }));
            
            // Sort by isDefault (true first) then by date
            docs.sort((a, b) => {
                if (a.isDefault && !b.isDefault) return -1;
                if (!a.isDefault && b.isDefault) return 1;
                const aTime = a.createdAt?.toDate?.() || new Date(0);
                const bTime = b.createdAt?.toDate?.() || new Date(0);
                return bTime - aTime;
            });
            
            // Create a fake snapshot that can be iterated
            snapshot = {
                forEach: (cb) => docs.forEach(d => cb({ id: d.id, data: () => d }))
            };
        }
        
        if (!snapshot || snapshot.forEach.length === 0) {
            container.innerHTML = '<div class="no-cards">No bank cards added yet.</div>';
            return;
        }
        
        let html = '';
        snapshot.forEach(doc => {
            const card = doc.data ? doc.data() : doc;
            const isDefault = card.isDefault ? 'default' : '';
            const lastFour = card.accountNumber.slice(-4);
            
            html += `
                <div class="bank-card ${isDefault}">
                    ${isDefault ? '<span class="default-badge">Default</span>' : ''}
                    <div class="card-chip"></div>
                    <div class="card-type">${card.type === 'mobile' ? 'Mobile' : 'Bank'}</div>
                    <div class="card-number">•••• •••• •••• ${lastFour}</div>
                    <div class="card-details">
                        <span class="card-name">${card.accountName}</span>
                        <span class="card-expiry">${card.provider}</span>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading bank cards:', error);
        container.innerHTML = '<div class="error">Failed to load cards. Please try again.</div>';
    }
};

// ==================== SECTION MANAGER ====================
class SectionManager {
    constructor() {
        this.currentSection = null;
        this.currentDashboard = null;
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupBottomNav();
    }
    
    getDefaultSection(dashboardType) {
    if (dashboardType === 'admin' || dashboardType === 'super-admin') {
        return 'adminChatSection';
    }
    return 'userSection'; // or whatever
}

    setupNavigation() {
        // Use a bound method to avoid duplicate listeners
        if (this._navigationHandler) return;
        this._navigationHandler = (e) => {
            // Handle sidebar items
            const sidebarItem = e.target.closest('.sidebar-item');
            if (sidebarItem) {
                const sectionId = sidebarItem.getAttribute('data-section');
                const dashboard = sidebarItem.closest('.dashboard')?.id;
                this.showSection(sectionId, dashboard);
                e.preventDefault();
                return;
            }
            
            // Handle bottom nav items
            const navItem = e.target.closest('.nav-item');
            if (navItem) {
                const sectionId = navItem.getAttribute('data-section');
                const dashboard = navItem.closest('.dashboard')?.id;
                this.showSection(sectionId, dashboard);
                e.preventDefault();
                return;
            }
            
            // Handle action buttons (deposit, withdraw, etc.)
            const actionMappings = {
                '#depositActionBtn': 'depositSection',
                '#withdrawActionBtn': 'withdrawalSection',
                '#historyActionBtn': 'transactionsHistory',
                '#accountActionBtn': 'bankAccounts',
                '#viewAllTransactions': 'transactionsHistory',
                '#quickDepositBtn': 'walletSection', // added for your new wallet
                '#quickWithdrawBtn': 'walletSection' // opens wallet tab (handled separately)
            };
            
            for (const [selector, section] of Object.entries(actionMappings)) {
                if (e.target.closest(selector)) {
                    const dashboard = e.target.closest('.dashboard')?.id;
                    this.showSection(section, dashboard);
                    e.preventDefault();
                    return;
                }
            }
        };
        
        document.addEventListener('click', this._navigationHandler);
    }
    
    setupBottomNav() {
        // This is now handled in the global click listener, but keep for active class management
        // No need to add duplicate click events
    }
    
    // In your SectionManager class, update showSection method:
showSection(sectionId, dashboard = null) {
    if (!dashboard) dashboard = this.currentDashboard;
    
    if (!dashboard) {
        const visibleDashboard = document.querySelector('.dashboard[style*="display: block"], .dashboard:not([style*="display: none"])');
        if (visibleDashboard) {
            dashboard = visibleDashboard.id;
        } else {
            console.error('No dashboard found');
            return;
        }
    }
    
    const dashboardElement = document.getElementById(dashboard);
    if (!dashboardElement) {
        console.error(`Dashboard not found: ${dashboard}`);
        return;
    }
    
    // Hide all sections in this dashboard
    dashboardElement.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });
    
    // Show the target section
    const targetSection = dashboardElement.querySelector(`#${sectionId}`);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('active');
        this.currentSection = sectionId;
        this.currentDashboard = dashboard;
        this.updateActiveNav(sectionId, dashboard);
        document.dispatchEvent(new CustomEvent('sectionChanged', { detail: { sectionId, dashboard } }));
        console.log(`✅ Section "${sectionId}" shown in dashboard "${dashboard}"`);
    } else {
        console.error(`❌ Section not found: #${sectionId} in dashboard: ${dashboard}`);
        
        // Try to find any section to show as fallback
        const firstSection = dashboardElement.querySelector('.content-section');
        if (firstSection) {
            firstSection.style.display = 'block';
            firstSection.classList.add('active');
            this.currentSection = firstSection.id;
            console.log(`⚠️ Showing fallback section: ${firstSection.id}`);
        }
    }
}

    
    updateActiveNav(sectionId, dashboard) {
        const dashboardElement = document.getElementById(dashboard);
        if (dashboardElement) {
            dashboardElement.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-section') === sectionId) {
                    item.classList.add('active');
                }
            });
        }
        
        // Also handle sidebar if present (for admin/superadmin)
        document.querySelectorAll('.sidebar-item').forEach(item => {
            item.classList.remove('active');
            const itemSection = item.getAttribute('data-section');
            if (itemSection && sectionId.includes(itemSection)) {
                item.classList.add('active');
            }
        });
    }
    
    showDashboard(dashboardType) {
        // Hide all dashboards
        document.querySelectorAll('.dashboard').forEach(d => d.style.display = 'none');
        
        const dashboardId = `${dashboardType}-dashboard`;
        const dashboardElement = document.getElementById(dashboardId);
        if (dashboardElement) {
            dashboardElement.style.display = 'block';
            this.currentDashboard = dashboardId;
            const defaultSection = this.getDefaultSection(dashboardType);
            this.showSection(defaultSection, dashboardId);
            console.log(`Dashboard "${dashboardType}" shown with section "${defaultSection}"`);
        } else {
            console.error(`Dashboard not found: ${dashboardId}`);
        }
    }
    
    getDefaultSection(dashboardType) {
        const map = {
            'user': 'userSection',
            'admin': 'adminSection',
            'super-admin': 'superAdminSection'
        };
        return map[dashboardType] || 'userSection';
    }
    
    getCurrentSection() { return this.currentSection; }
    getCurrentDashboard() { return this.currentDashboard; }
}

// ==================== BETTING SYSTEM ====================
// Global variables used by betting functions (will be bound to authManager)
let selectedMatch = null;
let selectedOdd = null;
let isPlacingBet = false;
let multiBetSelections = []; // VIP multi-bet selections across all matches
let vipLimits = {
    vip1: 50000,
    vip2: 100000,
    vip3: 500000,
    vvip: 1000000
};

// Betting System Object - all functions will be attached to this
const bettingSystem = {
    init() {
        // Called when user data is loaded
        if (window.authManager?.userData) {
            this.updateVIPStatus();
            this.updateBalanceDisplay();
            this.loadMatches();
            this.loadMyBets();
            if (window.authManager.userData.role === 'admin' || window.authManager.userData.role === 'superadmin') {
                this.loadAdminMatches();
            }
            this.loadRefundMatches();
        }
    },

    // Get current user data from AuthManager
    getUserData() {
        return window.authManager?.userData || null;
    },

    getUserId() {
        return window.authManager?.user?.uid || null;
    },

    // VIP Tier functions
    getUserVIPTier(balance) {
        if (balance >= vipLimits.vvip) return 'vvip';
        if (balance >= vipLimits.vip3) return 'vip3';
        if (balance >= vipLimits.vip2) return 'vip2';
        if (balance >= vipLimits.vip1) return 'vip1';
        return 'regular';
    },

    getMaxSelectionsForTier(tier) {
        switch(tier) {
            case 'vvip': return Infinity;
            case 'vip3': return 10;
            case 'vip2': return 5;
            case 'vip1': return 2;
            default: return 1;
        }
    },

    updateVIPStatus() {
        const userData = this.getUserData();
        if (!userData) return;
        
        const tier = this.getUserVIPTier(userData.balance);
        const maxSelections = this.getMaxSelectionsForTier(tier);
        
        let badgeHTML = '';
        let badgeClass = '';
        let badgeIcon = '';
        
        switch(tier) {
            case 'vvip':
                badgeClass = 'vvip';
                badgeIcon = 'fa-gem';
                badgeHTML = 'VVIP';
                break;
            case 'vip3':
                badgeClass = 'vip3';
                badgeIcon = 'fa-crown';
                badgeHTML = 'VIP 3';
                break;
            case 'vip2':
                badgeClass = 'vip2';
                badgeIcon = 'fa-medal';
                badgeHTML = 'VIP 2';
                break;
            case 'vip1':
                badgeClass = 'vip1';
                badgeIcon = 'fa-star';
                badgeHTML = 'VIP 1';
                break;
            default:
                badgeClass = 'regular';
                badgeIcon = 'fa-user';
                badgeHTML = 'Regular';
        }
        
        const badgeContainer = document.getElementById('vipBadgeContainer');
        if (badgeContainer) {
            badgeContainer.innerHTML = `
                <div class="vip-badge ${badgeClass}">
                    <i class="fas ${badgeIcon}"></i>
                    ${badgeHTML}
                    <span style="margin-left: 0.5rem;">Max: ${maxSelections === Infinity ? '∞' : maxSelections}</span>
                </div>
            `;
        }
    },

    updateBalanceDisplay() {
        const userData = this.getUserData();
        if (!userData) return;
        
        const balanceElements = document.querySelectorAll('#userBalance, #modalBalance, #walletBalance #withdrawCurrentBalance');
        balanceElements.forEach(el => {
            if (el) el.textContent = `TZS ${(userData.balance || 0).toFixed(2)}`;
        });
    },

    // Load matches
    async loadMatches() {
        try {
            const container = document.getElementById('matchesContainer');
            if (!container) return;
            
            const matchesRef = db.collection('matches');
            const snapshot = await matchesRef
                .where('status', '==', 'upcoming')
                .orderBy('date', 'asc')
                .get();
            
            if (snapshot.empty) {
                container.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--gray-color);">
                        <i class="fas fa-futbol" style="font-size: 4rem; opacity: 0.5;"></i>
                        <h3 style="margin-top: 1rem; color: white;">No matches available</h3>
                        <p style="margin-top: 0.5rem;">Check back later for upcoming matches</p>
                    </div>
                `;
                return;
            }
            
            const matches = [];
            snapshot.forEach(doc => {
                matches.push({ id: doc.id, ...doc.data() });
            });
            
            this.displayMatches(matches, container);
            this.updateVIPBetSlip();
            
        } catch (error) {
            console.error("Error loading matches:", error);
            const container = document.getElementById('matchesContainer');
            if (container) {
                container.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--danger-color);">
                        <i class="fas fa-exclamation-triangle" style="font-size: 4rem;"></i>
                        <h3 style="margin-top: 1rem; color: white;">Error loading matches</h3>
                        <p style="margin-top: 0.5rem;">${error.message}</p>
                    </div>
                `;
            }
        }
    },

    displayMatches(matches, container) {
        const userData = this.getUserData();
        const tier = userData ? this.getUserVIPTier(userData.balance) : 'regular';
        const isVIP = tier !== 'regular';
        
        container.innerHTML = matches.map(match => this.createMatchCard(match, isVIP)).join('');
    },

createMatchCard(match, isVIP = false) {
    let matchDate;
    let dateStr = "Date not set";
    let timeStr = "Time not set";
    
    if (match.date && match.date.toDate) {
        matchDate = match.date.toDate();
        dateStr = matchDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
        timeStr = matchDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Determine if this match is already in the VIP multi-bet
    const isSelectedInVIP = multiBetSelections.some(s => s.matchId === match.id);
    
    return `
        <div class="match-row ${isSelectedInVIP ? 'selected-for-vip' : ''}" 
             data-match-id="${match.id}"
             onclick="bettingSystem.openMatchDetails('${match.id}')">
            <!-- Left: competition + date/time -->
            <div class="match-info-compact">
                <span class="match-competition">${match.competition}</span>
                <span class="match-datetime">
                    <i class="far fa-calendar"></i> ${dateStr} • ${timeStr}
                </span>
                <span class="match-venue">
                    <i class="fas fa-map-marker-alt"></i> ${match.venue}
                </span>
            </div>
            <!-- Middle: teams (abbreviated) -->
            <div class="match-teams-compact">
                <div class="team-compact home">
                    <span class="team-abbr">${match.homeTeam.substring(0, 2).toUpperCase()}</span>
                    <span class="team-name">${match.homeTeam}</span>
                </div>
                <span class="vs-compact">VS</span>
                <div class="team-compact away">
                    <span class="team-abbr">${match.awayTeam.substring(0, 2).toUpperCase()}</span>
                    <span class="team-name">${match.awayTeam}</span>
                </div>
            </div>
            <!-- Optional indicator for VIP selected matches -->
            ${isSelectedInVIP ? '<span class="vip-indicator"><i class="fas fa-crown"></i></span>' : ''}
        </div>
    `;
},

    // Toggle Multi-Bet Selection (VIP)
    toggleMultiBet(matchId, type, teamName, percentage, matchTitle, competition) {
        const userData = this.getUserData();
        if (!userData) {
            showNotification("Please login first", "error");
            return;
        }
        
        const tier = this.getUserVIPTier(userData.balance);
        const maxSelections = this.getMaxSelectionsForTier(tier);
        
        const existingIndex = multiBetSelections.findIndex(s => 
            s.matchId === matchId && s.type === type
        );
        
        if (existingIndex !== -1) {
            multiBetSelections.splice(existingIndex, 1);
            showNotification(`Removed from VIP multi-bet`, "info");
        } else {
            if (multiBetSelections.length >= maxSelections) {
                showNotification(`Your VIP tier (${tier}) allows maximum ${maxSelections === Infinity ? 'unlimited' : maxSelections} selections`, "warning");
                return;
            }
            
            multiBetSelections.push({
                matchId,
                type,
                teamName,
                percentage,
                matchTitle,
                competition,
                timestamp: Date.now()
            });
            
            showNotification(`Added to VIP multi-bet (${multiBetSelections.length}/${maxSelections === Infinity ? '∞' : maxSelections})`, "vip");
        }
        
        this.updateVIPBetSlip();
        this.loadMatches();
    },

    updateVIPBetSlip() {
        const container = document.getElementById('vipBetSlipContainer');
        const userData = this.getUserData();
        const tier = userData ? this.getUserVIPTier(userData.balance) : 'regular';
        const maxSelections = this.getMaxSelectionsForTier(tier);
        
        if (multiBetSelections.length === 0 || tier === 'regular') {
            if (container) container.innerHTML = '';
            return;
        }
        
        let totalPercentage = 1;
        multiBetSelections.forEach(s => {
            totalPercentage *= (s.percentage / 100 + 1);
        });
        
        const combinedOdds = (totalPercentage * 100).toFixed(2);
        
        container.innerHTML = `
            <div class="vip-bet-slip">
                <div class="vip-bet-header">
                    <div class="vip-bet-title">
                        <i class="fas fa-crown"></i>
                        <div>
                            <h3 style="color: var(--vip-gold);">VIP Multi-Bet</h3>
                            <p style="color: var(--gray-color);">${multiBetSelections.length} / ${maxSelections === Infinity ? '∞' : maxSelections} selections</p>
                        </div>
                    </div>
                    <button class="close-modal" onclick="bettingSystem.clearMultiBets()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="selected-bets-grid">
                    ${multiBetSelections.map((s, index) => `
                        <div class="selected-bet-item">
                            <button class="remove-bet" onclick="bettingSystem.removeFromMultiBet('${s.matchId}', '${s.type}')">
                                <i class="fas fa-times-circle"></i>
                            </button>
                            <div style="font-weight: bold; color: var(--vip-gold); margin-bottom: 0.5rem;">
                                ${index + 1}. ${s.matchTitle}
                            </div>
                            <div style="color: white; font-size: 0.9rem;">
                                Against: <span style="color: var(--secondary-color);">${s.teamName}</span>
                            </div>
                            <div style="color: var(--gray-color); font-size: 0.85rem;">
                                ${s.competition} • ${s.percentage}% win
                            </div>
                            <div style="margin-top: 0.5rem; color: var(--vip-gold); font-weight: bold;">
                                Odds: ${(s.percentage / 100 + 1).toFixed(2)}x
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="display: flex; gap: 1rem; align-items: flex-end; margin-top: 1rem;">
                    <div style="flex: 1;">
                        <label class="form-label">Stake Amount (TZS)</label>
<input type="number" id="multiStakeAmount" class="form-input" 
       min="10000" max="${userData?.balance || 0}" value="10000" 
       oninput="bettingSystem.calculateMultiProfit()">
                        <div style="color: var(--gray-color); font-size: 0.85rem; margin-top: 0.25rem;">
                            Available: TZS ${(userData?.balance || 0).toFixed(2)}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="color: var(--gray-color);">Combined Odds</div>
                        <div style="font-size: 1.5rem; font-weight: bold; color: var(--vip-gold);">
                            ${combinedOdds}%
                        </div>
                        <div style="color: var(--gray-color);">(${(totalPercentage).toFixed(2)}x)</div>
                    </div>
                </div>
                
                <div style="background: rgba(255, 215, 0, 0.1); border-radius: 10px; padding: 1rem; margin-top: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Total Stake:</span>
                        <span id="multiTotalStake">TZS 1,000.00</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 1.1rem;">
                        <span style="font-weight: bold;">Potential Return:</span>
                        <span style="color: var(--success-color); font-weight: bold;" id="multiTotalReturn">
                            TZS ${(1000 * totalPercentage).toFixed(2)}
                        </span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; color: var(--gray-color);">
                        <span>Profit:</span>
                        <span id="multiProfit">TZS ${(1000 * totalPercentage - 1000).toFixed(2)}</span>
                    </div>
                </div>
                
                <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="bettingSystem.placeMultiBet()" id="placeMultiBetBtn">
                    <i class="fas fa-coins"></i> Place VIP Multi-Bet (${multiBetSelections.length} selections)
                </button>
            </div>
        `;
        
        this.calculateMultiProfit();
    },

    calculateMultiProfit() {
        const stake = parseFloat(document.getElementById('multiStakeAmount')?.value) || 0;
        let totalPercentage = 1;
        multiBetSelections.forEach(s => {
            totalPercentage *= (s.percentage / 100 + 1);
        });
        
        const totalReturn = stake * totalPercentage;
        const profit = totalReturn - stake;
        
        const stakeEl = document.getElementById('multiTotalStake');
        const returnEl = document.getElementById('multiTotalReturn');
        const profitEl = document.getElementById('multiProfit');
        if (stakeEl) stakeEl.textContent = `TZS ${stake.toFixed(2)}`;
        if (returnEl) returnEl.textContent = `TZS ${totalReturn.toFixed(2)}`;
        if (profitEl) profitEl.textContent = `TZS ${profit.toFixed(2)}`;
    },

    removeFromMultiBet(matchId, type) {
        const index = multiBetSelections.findIndex(s => s.matchId === matchId && s.type === type);
        if (index !== -1) {
            multiBetSelections.splice(index, 1);
            this.updateVIPBetSlip();
            this.loadMatches();
            showNotification("Removed from VIP multi-bet", "info");
        }
    },

    clearMultiBets() {
        multiBetSelections = [];
        this.updateVIPBetSlip();
        this.loadMatches();
        showNotification("VIP multi-bet cleared", "info");
    },

    async placeMultiBet() {
        if (isPlacingBet) return;
        
        if (multiBetSelections.length === 0) {
            showNotification("No selections in VIP multi-bet", "error");
            return;
        }
        
        const stake = parseFloat(document.getElementById('multiStakeAmount')?.value) || 0;
        const userData = this.getUserData();
        
        if (stake <= 0) {
            showNotification("Please enter a valid stake amount", "error");
            return;
        }
        
        if (stake > userData.balance) {
            showNotification("Insufficient balance!", "error");
            return;
        }
        
        if (stake < 10000) {
    showNotification('Minimum stake is TZS 10,000', 'error');
    const placeBtn = document.getElementById('placeMultiBetBtn');
    if (placeBtn) {
        placeBtn.disabled = false;
        placeBtn.innerHTML = '<i class="fas fa-coins"></i> Place VIP Multi-Bet';
    }
    isPlacingBet = false;
    return;
}
        
        isPlacingBet = true;
        const placeBtn = document.getElementById('placeMultiBetBtn');
        if (placeBtn) {
            placeBtn.disabled = true;
            placeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        }
        
        try {
            let totalPercentage = 1;
            multiBetSelections.forEach(s => {
                totalPercentage *= (s.percentage / 100 + 1);
            });
            
            const totalReturn = stake * totalPercentage;
            
            const multiBet = {
                userId: this.getUserId(),
                selections: multiBetSelections.map(s => ({
                    matchId: s.matchId,
                    betType: s.type,
                    betAgainst: s.teamName,
                    percentage: s.percentage,
                    matchTitle: s.matchTitle,
                    competition: s.competition
                })),
                stake: stake,
                totalPercentage: totalPercentage,
                potentialReturn: totalReturn,
                status: 'pending',
                type: 'multi',
                selectionCount: multiBetSelections.length,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            const batch = db.batch();
            
            const betRef = db.collection('bets').doc();
            batch.set(betRef, multiBet);
            
            const userRef = db.collection('users').doc(this.getUserId());
            batch.update(userRef, {
                balance: firebase.firestore.FieldValue.increment(-stake),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            const transactionRef = db.collection('transactions').doc();
            batch.set(transactionRef, {
                userId: this.getUserId(),
                type: 'bet',
                amount: -stake,
                description: `VIP Multi-Bet with ${multiBetSelections.length} selections`,
                date: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            await batch.commit();
            
            // Update local user data balance
            if (window.authManager.userData) {
                window.authManager.userData.balance -= stake;
            }
            this.updateBalanceDisplay();
            this.updateVIPStatus();
            
            showNotification(`VIP Multi-Bet placed! Potential return: TZS ${totalReturn.toFixed(2)}`, "vip");
            
            multiBetSelections = [];
            this.updateVIPBetSlip();
            this.loadMatches();
            this.loadMyBets();
            
        } catch (error) {
            console.error("Error placing multi-bet:", error);
            showNotification(`Error: ${error.message}`, "error");
        } finally {
            isPlacingBet = false;
            if (placeBtn) {
                placeBtn.disabled = false;
                placeBtn.innerHTML = '<i class="fas fa-coins"></i> Place VIP Multi-Bet';
            }
        }
    },
    
    // Add to bettingSystem object - Edit Match Functions
async openEditMatchModal(matchId) {
        try {
            const matchDoc = await db.collection('matches').doc(matchId).get();
            if (!matchDoc.exists) {
                showNotification("Match not found", "error");
                return;
            }
            
            const match = { id: matchId, ...matchDoc.data() };
            
            // Format date for input
            let dateStr = '';
            if (match.date && match.date.toDate) {
                const d = match.date.toDate();
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                const hours = String(d.getHours()).padStart(2, '0');
                const minutes = String(d.getMinutes()).padStart(2, '0');
                dateStr = `${year}-${month}-${day}T${hours}:${minutes}`;
            }
            
            const odds = match.odds || { home: 45, draw: 30, away: 25 };
            
            document.getElementById('editMatchId').value = matchId;
            document.getElementById('editHomeTeam').value = match.homeTeam || '';
            document.getElementById('editAwayTeam').value = match.awayTeam || '';
            document.getElementById('editCompetition').value = match.competition || '';
            document.getElementById('editMatchDate').value = dateStr;
            document.getElementById('editVenue').value = match.venue || '';
            document.getElementById('editMatchStatus').value = match.status || 'upcoming';
            document.getElementById('editHomePercentage').value = odds.home || 45;
            document.getElementById('editDrawPercentage').value = odds.draw || 30;
            document.getElementById('editAwayPercentage').value = odds.away || 25;
            
            // Update odds total display
            validateEditOdds();
            
            openModal('editMatchModal');
            
        } catch (error) {
            console.error("Error opening edit match modal:", error);
            showNotification(`Error: ${error.message}`, "error");
        }
    },
    
    async saveEditedMatch(e) {
        e.preventDefault();
        
        if (!validateEditOdds()) {
            showNotification("Please check odds values", "error");
            return;
        }
        
        const matchId = document.getElementById('editMatchId').value;
        const homeTeam = document.getElementById('editHomeTeam').value;
        const awayTeam = document.getElementById('editAwayTeam').value;
        const competition = document.getElementById('editCompetition').value;
        const matchDate = document.getElementById('editMatchDate').value;
        const venue = document.getElementById('editVenue').value;
        const status = document.getElementById('editMatchStatus').value;
        
        const homePercentage = parseInt(document.getElementById('editHomePercentage').value);
        const drawPercentage = parseInt(document.getElementById('editDrawPercentage').value);
        const awayPercentage = parseInt(document.getElementById('editAwayPercentage').value);
        
        const matchData = {
            homeTeam,
            awayTeam,
            competition,
            date: new Date(matchDate),
            venue,
            status,
            odds: {
                home: homePercentage,
                draw: drawPercentage,
                away: awayPercentage
            },
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        try {
            showLoading('Updating match...');
            
            await db.collection('matches').doc(matchId).update(matchData);
            
            showNotification('Match updated successfully!', 'success');
            closeModal('editMatchModal');
            
            // Refresh match displays
            this.loadMatches();
            this.loadAdminMatches();
            
        } catch (error) {
            console.error("Error updating match:", error);
            showNotification(`Error: ${error.message}`, 'error');
        } finally {
            hideLoading();
        }
    },
    
// Add this method to your bettingSystem object
async openMatchDetails(matchId) {
    try {
        const matchDoc = await db.collection('matches').doc(matchId).get();
        if (!matchDoc.exists) {
            showNotification('Match not found', 'error');
            return;
        }
        const match = { id: matchDoc.id, ...matchDoc.data() };

        const userData = this.getUserData();
        const isVIP = userData ? this.getUserVIPTier(userData.balance) !== 'regular' : false;

        // Format date nicely
        let dateStr = '', timeStr = '';
        if (match.date && match.date.toDate) {
            const d = match.date.toDate();
            dateStr = d.toLocaleDateString();
            timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        const odds = match.odds || { home: 45, draw: 30, away: 25 };

        let oddsHtml = '';
        if (isVIP) {
            // VIP: each odd has "Add to Multi-Bet" button
            oddsHtml = `
                <div class="odds-grid">
                    <div class="odds-box" data-type="home">
                        <span class="odds-type">HOME</span>
                        <span class="odds-value">${odds.home}%</span>
                        <button class="btn-add-multi" onclick="bettingSystem.addToMultiBet('${match.id}', 'home', '${match.homeTeam}', ${odds.home}, '${match.homeTeam} vs ${match.awayTeam}', '${match.competition}')">
                            <i class="fas fa-plus-circle"></i> Add to Multi
                        </button>
                    </div>
                    <div class="odds-box" data-type="draw">
                        <span class="odds-type">DRAW</span>
                        <span class="odds-value">${odds.draw}%</span>
                        <button class="btn-add-multi" onclick="bettingSystem.addToMultiBet('${match.id}', 'draw', 'Draw', ${odds.draw}, '${match.homeTeam} vs ${match.awayTeam}', '${match.competition}')">
                            <i class="fas fa-plus-circle"></i> Add to Multi
                        </button>
                    </div>
                    <div class="odds-box" data-type="away">
                        <span class="odds-type">AWAY</span>
                        <span class="odds-value">${odds.away}%</span>
                        <button class="btn-add-multi" onclick="bettingSystem.addToMultiBet('${match.id}', 'away', '${match.awayTeam}', ${odds.away}, '${match.homeTeam} vs ${match.awayTeam}', '${match.competition}')">
                            <i class="fas fa-plus-circle"></i> Add to Multi
                        </button>
                    </div>
                </div>
                <p class="multi-note">Added selections will appear in the VIP slip below.</p>
            `;
        } else {
            // Regular user: select an odd first
            oddsHtml = `
                <div class="odds-grid">
                    <div class="odds-box selectable" onclick="bettingSystem.selectOddForDetails(this, '${match.id}', 'home', '${match.homeTeam}')">
                        <span class="odds-type">HOME</span>
                        <span class="odds-value">${odds.home}%</span>
                    </div>
                    <div class="odds-box selectable" onclick="bettingSystem.selectOddForDetails(this, '${match.id}', 'draw', 'Draw')">
                        <span class="odds-type">DRAW</span>
                        <span class="odds-value">${odds.draw}%</span>
                    </div>
                    <div class="odds-box selectable" onclick="bettingSystem.selectOddForDetails(this, '${match.id}', 'away', '${match.awayTeam}')">
                        <span class="odds-type">AWAY</span>
                        <span class="odds-value">${odds.away}%</span>
                    </div>
                </div>
                <button class="btn btn-primary" id="placeBetFromDetails" disabled onclick="bettingSystem.placeBetFromDetails()">
                    <i class="fas fa-coins"></i> Place Bet
                </button>
            `;
        }
        
        // Create or get match details modal
        let modal = document.getElementById('matchDetailsModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'matchDetailsModal';
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-container" style="max-width: 500px;">
                    <div class="modal-header">
                        <h3><i class="fas fa-futbol"></i> Match Details</h3>
                        <button class="close-modal" onclick="closeModal('matchDetailsModal')">&times;</button>
                    </div>
                    <div class="modal-body" id="matchDetailsContent"></div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        const content = `
            <div class="match-details">
                <h4>${match.homeTeam} vs ${match.awayTeam}</h4>
                <p class="match-meta">${match.competition || 'Friendly'} • ${dateStr} ${timeStr} • ${match.venue || 'TBD'}</p>
                <div class="odds-container">
                    ${oddsHtml}
                </div>
            </div>
        `;

        document.getElementById('matchDetailsContent').innerHTML = content;
        modal.classList.add('active');

        // For regular users, store match data temporarily
        if (!isVIP) {
            window._currentMatch = match;
        }

    } catch (error) {
        console.error('Error opening match details:', error);
        showNotification('Could not load match details', 'error');
    }
},

// Add selectOddForDetails method
selectOddForDetails(element, matchId, type, teamName) {
    // Remove selected class from all odds boxes
    document.querySelectorAll('#matchDetailsModal .odds-box').forEach(box => {
        box.classList.remove('selected');
    });
    // Add selected class to the clicked element
    element.classList.add('selected');
    
    // Store selection
    window._selectedOdds = { matchId, type, teamName };
    
    // Enable the place bet button
    const btn = document.getElementById('placeBetFromDetails');
    if (btn) btn.disabled = false;
},

// Add placeBetFromDetails method
placeBetFromDetails() {
    if (!window._currentMatch || !window._selectedOdds) {
        showNotification('Please select an outcome first', 'error');
        return;
    }

    // Use existing single bet flow
    selectedMatch = window._currentMatch;
    selectedOdd = window._selectedOdds;

    // Open the bet slip modal
    this.openBetSlip(window._currentMatch.id);

    // Close details modal
    closeModal('matchDetailsModal');
},

// Add addToMultiBet method
addToMultiBet(matchId, type, teamName, percentage, matchTitle, competition) {
    this.toggleMultiBet(matchId, type, teamName, percentage, matchTitle, competition);
    // Optionally close the details modal after adding
    closeModal('matchDetailsModal');
},

// Called when regular user clicks an odds box inside the details modal
selectOddForDetails(element, matchId, type, teamName) {
    // Remove selected class from all odds boxes
    document.querySelectorAll('#matchDetailsModal .odds-box').forEach(box => {
        box.classList.remove('selected');
    });
    // Add selected class to the clicked element
    element.classList.add('selected');
    
    // Store selection
    window._selectedOdds = { matchId, type, teamName };
    
    // Enable the place bet button
    const btn = document.getElementById('placeBetFromDetails');
    if (btn) btn.disabled = false;
},

// Called when regular user clicks "Place Bet" inside the details modal
placeBetFromDetails() {
    if (!window._currentMatch || !window._selectedOdds) {
        showNotification('Please select an outcome first', 'error');
        return;
    }

    // Use existing single bet flow
    selectedMatch = window._currentMatch;
    selectedOdd = window._selectedOdds;

    // Open the bet slip modal
    this.openBetSlip(window._currentMatch.id);

    // Close details modal
    closeModal('matchDetailsModal');
},

// Called when regular user clicks "Place Bet" inside the details modal
placeBetFromDetails() {
    if (!window._currentMatch || !window._selectedOdds) {
        showNotification('Please select an outcome first', 'error');
        return;
    }

    // Use existing single bet flow
    selectedMatch = window._currentMatch;
    selectedOdd = window._selectedOdds;

    // Open the bet slip modal
    this.openBetSlip(window._currentMatch.id);

    // Close details modal
    closeModal('matchDetailsModal');
},

// For VIP: add to multi-bet (wrapper around toggleMultiBet)
addToMultiBet(matchId, type, teamName, percentage, matchTitle, competition) {
    this.toggleMultiBet(matchId, type, teamName, percentage, matchTitle, competition);
    // Optionally close the details modal after adding
    closeModal('matchDetailsModal');
},

    // Single bet functions
    async selectOdd(matchId, type, teamName) {
        try {
            document.querySelectorAll('.odds-box').forEach(box => {
                box.classList.remove('selected');
            });
            
            event.target.classList.add('selected');
            
            const matchDoc = await db.collection('matches').doc(matchId).get();
            if (matchDoc.exists) {
                selectedMatch = { id: matchId, ...matchDoc.data() };
                selectedOdd = { type, teamName };
                showNotification(`Selected: Bet against ${teamName}`, "success");
            }
        } catch (error) {
            console.error("Error selecting odd:", error);
        }
    },


    async openBetSlip(matchId) {
        if (isPlacingBet) return;
        
        if (!selectedMatch || selectedMatch.id !== matchId) {
            showNotification("Please select an outcome first!", "error");
            return;
        }
        
        const odds = selectedMatch.odds || { home: 45, draw: 30, away: 25 };
        let percentage = 45;
        
        if (selectedOdd.type === 'home') percentage = odds.home;
        else if (selectedOdd.type === 'draw') percentage = odds.draw;
        else if (selectedOdd.type === 'away') percentage = odds.away;
        
        document.getElementById('betSlipContent').innerHTML = `
            <div class="bet-slip-content">
                <div class="bet-match-info">
                    <div class="bet-match-title">${selectedMatch.homeTeam} vs ${selectedMatch.awayTeam}</div>
                    <div class="bet-match-details">
                        ${selectedMatch.competition}
                    </div>
                </div>
                
                <div class="bet-selection">
                    <div class="bet-selection-title">Your Selection</div>
                    <div class="bet-selection-value">Against ${selectedOdd.teamName}</div>
                    <div style="color: var(--gray-color); font-size: 0.9rem; margin-top: 0.5rem;">
                        Win ${percentage}% of stake
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Stake Amount (TZS)</label>
<input type="number" id="stakeAmount" class="form-input" min="10000" 
       max="${this.getUserData()?.balance || 0}" value="10000" oninput="bettingSystem.calculateSingleProfit(${percentage})">
                    <div style="color: var(--gray-color); font-size: 0.85rem; margin-top: 0.5rem;">
                        Available: TZS ${(this.getUserData()?.balance || 0).toFixed(2)}
                    </div>
                </div>
                
                <div class="profit-calc">
                    <div class="calc-row">
                        <span>Stake:</span>
                        <span id="stakeDisplay">TZS 10,000.00</span>
                    </div>
                    <div class="calc-row">
                        <span>Win Percentage:</span>
                        <span style="color: var(--accent-color); font-weight: bold;">${percentage}%</span>
                    </div>
                    <div class="calc-row">
                        <span>Potential Profit:</span>
                        <span style="color: var(--success-color); font-weight: bold;" id="profitDisplay">TZS ${(10000 * percentage / 100).toFixed(2)}</span>
                    </div>
                    <div class="calc-row total">
                        <span>Total Return:</span>
                        <span id="totalReturnDisplay">TZS ${(10000 + (10000 * percentage / 100)).toFixed(2)}</span>
                    </div>
                </div>
                
                <button class="btn btn-primary" style="width: 100%;" onclick="bettingSystem.placeSingleBet(${percentage})" id="confirmBetBtn">
                    <i class="fas fa-check-circle"></i> Place Single Bet
                </button>
            </div>
        `;
        
        openModal('betSlipModal');
    },

    calculateSingleProfit(percentage) {
        const stake = parseFloat(document.getElementById('stakeAmount').value) || 0;
        const profit = stake * percentage / 100;
        const totalReturn = stake + profit;
        
        const stakeEl = document.getElementById('stakeDisplay');
        const profitEl = document.getElementById('profitDisplay');
        const returnEl = document.getElementById('totalReturnDisplay');
        if (stakeEl) stakeEl.textContent = `TZS ${stake.toFixed(2)}`;
        if (profitEl) profitEl.textContent = `TZS ${profit.toFixed(2)}`;
        if (returnEl) returnEl.textContent = `TZS ${totalReturn.toFixed(2)}`;
    },

    async placeSingleBet(percentage) {
        if (isPlacingBet) return;
        
        const stake = parseFloat(document.getElementById('stakeAmount').value) || 0;
        const userData = this.getUserData();
        
        if (stake <= 0) {
            showNotification("Please enter a valid stake amount!", "error");
            return;
        }
        if (stake < 10000) {
    showNotification('Minimum stake is TZS 10,000', 'error');
    const confirmBtn = document.getElementById('confirmBetBtn');
    if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<i class="fas fa-check-circle"></i> Place Single Bet';
    }
    isPlacingBet = false;
    return;
}
        
        if (stake > userData.balance) {
            showNotification("Insufficient balance!", "error");
            return;
        }
        
        isPlacingBet = true;
        const confirmBtn = document.getElementById('confirmBetBtn');
        if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        }
        
        try {
            const profit = stake * percentage / 100;
            const totalReturn = stake + profit;
            
            const bet = {
                userId: this.getUserId(),
                matchId: selectedMatch.id,
                match: `${selectedMatch.homeTeam} vs ${selectedMatch.awayTeam}`,
                betType: selectedOdd.type,
                betAgainst: selectedOdd.teamName,
                stake: stake,
                percentage: percentage,
                potentialProfit: profit,
                potentialReturn: totalReturn,
                status: 'pending',
                type: 'single',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                matchDate: selectedMatch.date
            };
            
            const batch = db.batch();
            
            const betRef = db.collection('bets').doc();
            batch.set(betRef, bet);
            
            const userRef = db.collection('users').doc(this.getUserId());
            batch.update(userRef, {
                balance: firebase.firestore.FieldValue.increment(-stake),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            const transactionRef = db.collection('transactions').doc();
            batch.set(transactionRef, {
                userId: this.getUserId(),
                type: 'bet',
                amount: -stake,
                description: `Single bet against ${selectedOdd.teamName}`,
                date: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            await batch.commit();
            
            if (window.authManager.userData) {
                window.authManager.userData.balance -= stake;
            }
            this.updateBalanceDisplay();
            this.updateVIPStatus();
            
            showNotification(`Bet placed! Potential return: TZS ${totalReturn.toFixed(2)}`, "success");
            
            setTimeout(() => {
                closeModal('betSlipModal');
                isPlacingBet = false;
                selectedMatch = null;
                selectedOdd = null;
                this.loadMyBets();
            }, 1000);
            
        } catch (error) {
            console.error("Error placing bet:", error);
            showNotification(`Error: ${error.message}`, "error");
            if (confirmBtn) {
                confirmBtn.disabled = false;
                confirmBtn.innerHTML = '<i class="fas fa-check-circle"></i> Place Single Bet';
            }
            isPlacingBet = false;
        }
    },

    // Load My Bets
    async loadMyBets() {
        try {
            const tableBody = document.getElementById('myBetsTable');
            if (!tableBody) return;
            
            const userId = this.getUserId();
            if (!userId) return;
            
            const betsRef = db.collection('bets');
            const snapshot = await betsRef
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();
            
            if (snapshot.empty) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 3rem; color: var(--gray-color);">
                            <i class="fas fa-history" style="font-size: 2rem; opacity: 0.5;"></i>
                            <div style="margin-top: 1rem; color: white;">No bets placed yet</div>
                        </td>
                    </tr>
                `;
                return;
            }
            
            let html = '';
            snapshot.forEach(doc => {
                const bet = doc.data();
                let betDate = bet.createdAt?.toDate ? bet.createdAt.toDate() : new Date();
                
                let statusClass = 'status-pending';
                let statusText = 'PENDING';
                let statusDetails = '';
                
                if (bet.status === 'won') {
                    statusClass = 'status-won';
                    statusText = 'WON';
                } else if (bet.status === 'lost') {
                    statusClass = 'status-lost';
                    statusText = 'LOST';
                } else if (bet.status === 'refunded') {
                    statusClass = 'status-refunded';
                    statusText = 'REFUNDED';
                }
                
                if (bet.type === 'multi') {
                    const selections = bet.selections || [];
                    const resolvedSelections = selections.filter(s => s.status === 'won' || s.status === 'lost').length;
                    const wonSelections = selections.filter(s => s.status === 'won').length;
                    const lostSelections = selections.filter(s => s.status === 'lost').length;
                    
                    const matchList = selections.map((s, idx) => 
                        `${idx + 1}. ${s.matchTitle || 'Unknown match'}: ${s.betAgainst || s.teamName} (${s.percentage || 0}%)${s.status ? ` - ${s.status.toUpperCase()}` : ''}`
                    ).join('<br>');
                    
                    if (bet.status === 'pending') {
                        statusDetails = ` (${resolvedSelections}/${selections.length} settled)`;
                        if (resolvedSelections > 0) {
                            statusDetails += ` - ✅ ${wonSelections} won, ❌ ${lostSelections} lost`;
                        }
                    } else if (bet.status === 'won') {
                        statusDetails = ` - All ${selections.length} selections won! 🎉`;
                    } else if (bet.status === 'lost') {
                        statusDetails = ` - Lost on ${lostSelections} selection${lostSelections > 1 ? 's' : ''}`;
                    }
                    
                    const profit = bet.status === 'won' 
                        ? (bet.potentialReturn - bet.stake) 
                        : (bet.status === 'lost' ? -bet.stake : (bet.potentialReturn - bet.stake || 0));
                    
                    html += `
                        <tr>
                            <td>
                                <span style="color: var(--vip-gold); font-weight: bold;">
                                    <i class="fas fa-crown"></i> VIP Multi-Bet
                                </span>
                                <div style="color: var(--gray-color); font-size: 0.8rem; cursor: help;" 
                                     title="${matchList.replace(/<br>/g, '\n')}">
                                    ${selections.length} selections
                                    <i class="fas fa-info-circle" style="margin-left: 0.25rem;"></i>
                                </div>
                            </td>
                            <td>
                                <div>${selections.length} matches</div>
                                <div style="color: var(--gray-color); font-size: 0.75rem;">
                                    ${wonSelections} won, ${lostSelections} lost
                                </div>
                            </td>
                            <td>TZS ${bet.stake.toFixed(2)}</td>
                            <td>${(bet.totalPercentage * 100).toFixed(2)}%</td>
                            <td style="color: ${profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};">
                                ${profit >= 0 ? '+' : ''}TZS ${profit.toFixed(2)}
                            </td>
                            <td>
                                <span class="status-badge ${statusClass}">${statusText}${statusDetails}</span>
                            </td>
                            <td>${betDate.toLocaleDateString()}</td>
                        </tr>
                    `;
                } else {
                    const profit = bet.status === 'won' 
                        ? (bet.potentialReturn - bet.stake) 
                        : (bet.status === 'lost' ? -bet.stake : (bet.potentialReturn - bet.stake || 0));
                    
                    html += `
                        <tr>
                            <td>${bet.match || 'Unknown match'}</td>
                            <td>Against ${bet.betAgainst || 'unknown'}</td>
                            <td>TZS ${bet.stake.toFixed(2)}</td>
                            <td>${bet.percentage || 0}%</td>
                            <td style="color: ${profit >= 0 ? 'var(--success-color)' : 'var(--danger-color)'};">
                                ${profit >= 0 ? '+' : ''}TZS ${profit.toFixed(2)}
                            </td>
                            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                            <td>${betDate.toLocaleDateString()}</td>
                        </tr>
                    `;
                }
            });
            
            tableBody.innerHTML = html;
            
        } catch (error) {
            console.error("Error loading bets:", error);
            const tableBody = document.getElementById('myBetsTable');
            if (tableBody) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 3rem; color: var(--danger-color);">
                            <i class="fas fa-exclamation-triangle" style="font-size: 2rem;"></i>
                            <div style="margin-top: 1rem;">Error loading bets</div>
                        </td>
                    </tr>
                `;
            }
        }
    },

    // Admin functions
    async loadAdminMatches() {
        try {
            const container = document.getElementById('adminMatchesContainer');
            if (!container) return;
            
            const matchesRef = db.collection('matches');
            const snapshot = await matchesRef
                .where('status', 'in', ['upcoming', 'live'])
                .orderBy('date', 'asc')
                .get();
            
            if (snapshot.empty) {
                container.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--gray-color);">
                        <i class="fas fa-futbol" style="font-size: 4rem; opacity: 0.5;"></i>
                        <h3 style="margin-top: 1rem; color: white;">No matches to manage</h3>
                    </div>
                `;
                return;
            }
            
            let html = '';
            snapshot.forEach(doc => {
                const match = { id: doc.id, ...doc.data() };
                let matchDate = match.date?.toDate ? match.date.toDate() : null;
                const odds = match.odds || { home: 45, draw: 30, away: 25 };
                
html += `
    <div class="admin-card">
        <h4 style="color: white; margin-bottom: 1rem;">${match.homeTeam} vs ${match.awayTeam}</h4>
        <div style="color: var(--gray-color); font-size: 0.9rem; margin-bottom: 0.5rem;">
            ${match.competition} • ${matchDate ? matchDate.toLocaleDateString() : ''}
        </div>
        <div style="color: var(--gray-color); font-size: 0.9rem; margin-bottom: 0.5rem;">
            Odds: H:${odds.home}% D:${odds.draw}% A:${odds.away}%
        </div>
        <div style="color: var(--gray-color); font-size: 0.9rem; margin-bottom: 1rem;">
            <i class="fas fa-map-marker-alt"></i> ${match.venue}
        </div>
        
        <!-- BUTTON GROUP WITH 3 BUTTONS -->
        <div style="display: flex; gap: 0.5rem;">
            <!-- Edit Button (new) -->
            <button class="btn btn-secondary" style="flex: 1;" 
                    onclick="bettingSystem.openEditMatchModal('${match.id}')">
                <i class="fas fa-edit"></i> Edit
            </button>
            
            <!-- Set Result Button (existing) -->
            <button class="btn btn-primary" style="flex: 1;" 
                    onclick="bettingSystem.openSetResultModal('${match.id}')">
                <i class="fas fa-clipboard-check"></i> Result
            </button>
            
            <!-- Delete Button (new) - This is where you add it -->
            <button class="btn btn-danger" style="flex: 0 0 auto;" 
                    onclick="bettingSystem.deleteMatch('${match.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    </div>
`;
            });
            
            container.innerHTML = html;
            
        } catch (error) {
            console.error("Error loading admin matches:", error);
            const container = document.getElementById('adminMatchesContainer');
            if (container) {
                if (error.code === 'failed-precondition') {
                    container.innerHTML = `
                        <div class="error-container" style="grid-column: 1 / -1;">
                            <i class="fas fa-database" style="font-size: 3rem; color: var(--accent-color);"></i>
                            <h3 style="margin: 1rem 0; color: white;">Firestore Index Required</h3>
                            <p style="color: var(--gray-color); margin-bottom: 1rem;">
                                To filter matches by status (upcoming/live) and order by date, a composite index is needed.
                            </p>
                            <a href="https://console.firebase.google.com/v1/r/project/football-canvas-hub/firestore/indexes?create_composite=CgttYXRjaGVzX2lkchgLGiQKBnN0YXR1cxABGg0KB3VwY29taW5nEAFqBHVwY29taW5nGiQKBmRhdGUYAxIEGgIIARoECAIQASoKCALwAQgBEAAiAwoBMA" 
                               target="_blank" class="btn btn-primary" style="display: inline-block; text-decoration: none;">
                                <i class="fas fa-external-link-alt"></i> Create Index
                            </a>
                            <p style="color: var(--gray-color); margin-top: 1rem; font-size: 0.85rem;">
                                After creating the index, wait 1-2 minutes and refresh the page.
                            </p>
                        </div>
                    `;
                } else {
                    container.innerHTML = `
                        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--danger-color);">
                            <i class="fas fa-exclamation-triangle" style="font-size: 4rem;"></i>
                            <h3 style="margin-top: 1rem; color: white;">Error loading matches</h3>
                            <p style="margin-top: 0.5rem;">${error.message}</p>
                        </div>
                    `;
                }
            }
        }
    },

    async openSetResultModal(matchId) {
        try {
            const matchDoc = await db.collection('matches').doc(matchId).get();
            if (!matchDoc.exists) {
                showNotification("Match not found", "error");
                return;
            }
            
            const match = { id: matchId, ...matchDoc.data() };
            selectedMatch = match;
            
            document.getElementById('setResultContent').innerHTML = `
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <div style="font-size: 1.25rem; font-weight: bold; color: white;">
                        ${match.homeTeam} vs ${match.awayTeam}
                    </div>
                    <div style="color: var(--gray-color);">${match.competition}</div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Final Score</label>
                    <div style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
                        <input type="number" id="homeScore" class="form-input" min="0" max="20" 
                               value="0" style="width: 80px; text-align: center;">
                        <span style="font-size: 1.5rem; font-weight: bold; color: white;">:</span>
                        <input type="number" id="awayScore" class="form-input" min="0" max="20" 
                               value="0" style="width: 80px; text-align: center;">
                    </div>
                </div>
                
                <div class="odds-percentage" style="background: rgba(255, 166, 43, 0.1);">
                    <div style="color: var(--accent-color); font-weight: bold;">Custom Odds for this Match</div>
                    <div style="display: flex; justify-content: center; gap: 2rem; margin-top: 0.5rem;">
                        <div>Home: ${match.odds?.home || 45}%</div>
                        <div>Draw: ${match.odds?.draw || 30}%</div>
                        <div>Away: ${match.odds?.away || 25}%</div>
                    </div>
                </div>
                
                <div style="background: rgba(255, 166, 43, 0.1); border: 1px solid rgba(255, 166, 43, 0.3); 
                     border-radius: 10px; padding: 1rem; margin: 1.5rem 0;">
                    <div style="color: var(--accent-color); font-weight: bold; margin-bottom: 0.5rem;">
                        <i class="fas fa-info-circle"></i> Betting Rules
                    </div>
                    <div style="color: var(--gray-color); font-size: 0.85rem;">
                        • Users win when result is OPPOSITE of their bet<br>
                        • Users lose when result matches their bet<br>
                        • Win amount: Based on match's custom odds percentages
                    </div>
                </div>
                
                <button class="btn btn-primary" style="width: 100%;" onclick="bettingSystem.setMatchResult('${matchId}')" id="setResultBtn">
                    <i class="fas fa-save"></i> Save Result & Settle Bets
                </button>
            `;
            
            openModal('setResultModal');
            
        } catch (error) {
            console.error("Error opening set result modal:", error);
            showNotification(`Error: ${error.message}`, "error");
        }
    },

    async setMatchResult(matchId) {
        const homeScore = parseInt(document.getElementById('homeScore').value) || 0;
        const awayScore = parseInt(document.getElementById('awayScore').value) || 0;
        
        const setResultBtn = document.getElementById('setResultBtn');
        if (setResultBtn) {
            setResultBtn.disabled = true;
            setResultBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        }
        
        try {
            let result = 'draw';
            if (homeScore > awayScore) result = 'home';
            else if (awayScore > homeScore) result = 'away';
            
            console.log(`🔵 Match ${matchId} result: ${result} (${homeScore}-${awayScore})`);
            
            await db.collection('matches').doc(matchId).update({
                result: { home: homeScore, away: awayScore },
                status: 'finished',
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Settle single bets
            const singleBetsSnapshot = await db.collection('bets')
                .where('matchId', '==', matchId)
                .where('status', '==', 'pending')
                .where('type', '==', 'single')
                .get();
            
            // Settle multi bets
            const multiBetsSnapshot = await db.collection('bets')
                .where('status', '==', 'pending')
                .where('type', '==', 'multi')
                .get();
            
            const affectedMultiBets = [];
            multiBetsSnapshot.forEach(doc => {
                const bet = { id: doc.id, ...doc.data() };
                if (bet.selections && Array.isArray(bet.selections)) {
                    const hasThisMatch = bet.selections.some(s => s.matchId === matchId);
                    if (hasThisMatch) {
                        affectedMultiBets.push(bet);
                    }
                }
            });
            
            console.log(`📊 Found ${singleBetsSnapshot.size} single bets, ${affectedMultiBets.length} multi-bets`);
            
            const batch = db.batch();
            const userWinnings = {};
            
            // Process single bets
            if (!singleBetsSnapshot.empty) {
                singleBetsSnapshot.forEach(doc => {
                    const bet = doc.data();
                    const betRef = db.collection('bets').doc(doc.id);
                    const isWinner = (bet.betType !== result);
                    
                    if (isWinner) {
                        batch.update(betRef, {
                            status: 'won',
                            actualWin: bet.potentialReturn,
                            result: result,
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                        
                        if (!userWinnings[bet.userId]) userWinnings[bet.userId] = 0;
                        userWinnings[bet.userId] += bet.potentialReturn;
                        console.log(`✅ Single bet WIN: ${bet.userId} - Return: ${bet.potentialReturn}`);
                    } else {
                        batch.update(betRef, {
                            status: 'lost',
                            actualWin: 0,
                            result: result,
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                        console.log(`❌ Single bet LOSS: ${bet.userId}`);
                    }
                });
            }
            
            // Process multi bets
            for (const bet of affectedMultiBets) {
                const betRef = db.collection('bets').doc(bet.id);
                let updatedSelections = [...bet.selections];
                let matchFound = false;
                
                for (let i = 0; i < updatedSelections.length; i++) {
                    const selection = updatedSelections[i];
                    if (selection.matchId === matchId) {
                        matchFound = true;
                        const isWinner = (selection.betType !== result);
                        selection.status = isWinner ? 'won' : 'lost';
                        selection.result = result;
                        selection.actualScore = `${homeScore}-${awayScore}`;
                        selection.resolvedAt = new Date().toISOString();
                        console.log(`🎯 Multi selection: ${bet.id} - ${selection.matchTitle} - ${isWinner ? 'WIN' : 'LOSS'}`);
                    }
                }
                
                if (!matchFound) continue;
                
                const allSelectionsResolved = updatedSelections.every(s => s.status === 'won' || s.status === 'lost');
                const hasLostSelection = updatedSelections.some(s => s.status === 'lost');
                
                let betStatus = 'pending';
                let actualReturn = 0;
                
                if (allSelectionsResolved) {
                    if (hasLostSelection) {
                        betStatus = 'lost';
                        actualReturn = 0;
                        console.log(`💔 Multi-bet LOST: ${bet.id}`);
                    } else {
                        betStatus = 'won';
                        actualReturn = bet.potentialReturn || (bet.stake * bet.totalPercentage);
                        console.log(`🎉 Multi-bet WON: ${bet.id} - Return: ${actualReturn}`);
                        if (!userWinnings[bet.userId]) userWinnings[bet.userId] = 0;
                        userWinnings[bet.userId] += actualReturn;
                    }
                }
                
                batch.update(betRef, {
                    selections: updatedSelections,
                    status: betStatus,
                    ...(betStatus !== 'pending' && { 
                        actualReturn: actualReturn,
                        resolvedAt: firebase.firestore.FieldValue.serverTimestamp()
                    }),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
            // Update user balances
            for (const [userId, amount] of Object.entries(userWinnings)) {
                const userRef = db.collection('users').doc(userId);
                batch.update(userRef, {
                    balance: firebase.firestore.FieldValue.increment(amount),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                const transactionRef = db.collection('transactions').doc();
                batch.set(transactionRef, {
                    userId: userId,
                    type: 'win',
                    amount: amount,
                    description: `Bet win from match result`,
                    matchId: matchId,
                    date: firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log(`💰 Added TZS ${amount.toFixed(2)} to user ${userId.substring(0,8)}`);
            }
            
            await batch.commit();
            
            const totalSingleBets = singleBetsSnapshot.size;
            const totalMultiBets = affectedMultiBets.length;
            const winners = Object.keys(userWinnings).length;
            
            showNotification(
                `✅ Result saved! ${totalSingleBets} single bets, ${totalMultiBets} multi-bets settled. ${winners} winners.`, 
                'success'
            );
            
            setTimeout(() => {
                closeModal('setResultModal');
                this.loadMatches();
                this.loadAdminMatches();
                this.loadMyBets();
                this.loadRefundMatches();
                if (window.authManager?.userData) {
                    this.updateBalanceDisplay();
                    this.updateVIPStatus();
                }
            }, 1500);
            
        } catch (error) {
            console.error("❌ Error setting result:", error);
            showNotification(`Error: ${error.message}`, "error");
            if (setResultBtn) {
                setResultBtn.disabled = false;
                setResultBtn.innerHTML = '<i class="fas fa-save"></i> Save Result & Settle Bets';
            }
        }
    },

    async loadRefundHistory() {
        try {
            const container = document.getElementById('refundHistoryContainer');
            if (!container) return;
            
            const refundsRef = db.collection('transactions');
            const snapshot = await refundsRef
                .where('type', '==', 'refund')
                .orderBy('date', 'desc')
                .limit(20)
                .get();
            
            if (snapshot.empty) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: var(--gray-color);">
                        <i class="fas fa-history" style="font-size: 3rem; opacity: 0.5;"></i>
                        <div style="margin-top: 1rem;">No refund history</div>
                    </div>
                `;
                return;
            }
            
            let html = '<table class="my-bets-table"><thead><tr><th>Match</th><th>User</th><th>Amount</th><th>Date</th></tr></thead><tbody>';
            
            snapshot.forEach(doc => {
                const refund = doc.data();
                const refundDate = refund.date?.toDate ? refund.date.toDate() : new Date();
                html += `
                    <tr>
                        <td>${refund.description?.replace('Refund for match: ', '') || 'Match refund'}</td>
                        <td>${refund.userId.substring(0, 8)}...</td>
                        <td style="color: var(--success-color); font-weight: bold;">TZS ${refund.amount.toFixed(2)}</td>
                        <td>${refundDate.toLocaleDateString()}</td>
                    </tr>
                `;
            });
            
            html += '</tbody></table>';
            container.innerHTML = html;
            
        } catch (error) {
            console.error("Error loading refund history:", error);
            const container = document.getElementById('refundHistoryContainer');
            if (container) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: var(--danger-color);">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem;"></i>
                        <div style="margin-top: 1rem;">Error loading refund history</div>
                    </div>
                `;
            }
        }
    },

    // Add Funds
    async addFunds() {
        const amount = parseFloat(document.getElementById('fundsAmount').value);
        if (amount < 1000) {
            showNotification('Minimum deposit is TZS 1,000', 'error');
            return;
        }
        if (amount > 10000000) {
            showNotification('Maximum deposit is TZS 10,000,000', 'error');
            return;
        }
        
        try {
            await db.collection('users').doc(this.getUserId()).update({
                balance: firebase.firestore.FieldValue.increment(amount),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            await db.collection('transactions').add({
                userId: this.getUserId(),
                type: 'deposit',
                amount: amount,
                description: 'Added funds',
                date: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            if (window.authManager.userData) {
                window.authManager.userData.balance += amount;
            }
            
            showNotification(`Successfully added TZS ${amount.toFixed(2)} to your account`, 'success');
            closeModal('addFundsModal');
            
            this.updateBalanceDisplay();
            this.updateVIPStatus();
            
            if (multiBetSelections.length > 0) {
                this.updateVIPBetSlip();
            }
            
        } catch (error) {
            console.error("Error adding funds:", error);
            showNotification(`Error: ${error.message}`, "error");
        }
    },
    
    // Add to bettingSystem object if you want delete functionality
async deleteMatch(matchId) {
    if (!confirm('Are you sure you want to delete this match? This action cannot be undone.')) {
        return;
    }
    
    showLoading('Deleting match...');
    try {
        await db.collection('matches').doc(matchId).delete();
        showNotification('Match deleted successfully', 'success');
        this.loadMatches();
        this.loadAdminMatches();
    } catch (error) {
        console.error("Error deleting match:", error);
        showNotification(`Error: ${error.message}`, 'error');
    } finally {
        hideLoading();
    }
}
};



// ==================== UTILITY FUNCTIONS ====================
// Validate odds (no 100% requirement)
function validateOdds() {
    const home = parseInt(document.getElementById('homePercentage').value) || 0;
    const draw = parseInt(document.getElementById('drawPercentage').value) || 0;
    const away = parseInt(document.getElementById('awayPercentage').value) || 0;
    const total = home + draw + away;
    
    const oddsTotal = document.getElementById('oddsTotal');
    if (oddsTotal) {
        oddsTotal.innerHTML = `Total: ${total}%`;
        oddsTotal.style.color = 'var(--gray-color)';
    }
    return true;
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

// ==================== AJIRA‑STYLE NOTIFICATION SYSTEM ====================
const NotificationManager = {
    container: null,
    defaultDuration: 5000, // 5 seconds
    defaultPosition: 'top-right',
    activeNotifications: new Map(),
    
    getContainer(position) {
        const containerId = `notification-container-${position}`;
        let container = document.getElementById(containerId);
        if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            container.className = `notification-container ${position}`;
            document.body.appendChild(container);
        }
        return container;
    },
    
    generateId() {
        return 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    },
    
    remove(id) {
        const notif = this.activeNotifications.get(id);
        if (notif) {
            const element = notif.element;
            element.classList.add('exit');
            setTimeout(() => {
                if (element.parentNode) element.parentNode.removeChild(element);
                this.activeNotifications.delete(id);
            }, 300);
        }
    },
    
    pause(id) {
        const notif = this.activeNotifications.get(id);
        if (notif && notif.timer) {
            clearTimeout(notif.timer);
            notif.remaining = notif.endTime - Date.now();
            notif.timer = null;
        }
    },
    
    resume(id) {
        const notif = this.activeNotifications.get(id);
        if (notif && notif.remaining > 0) {
            notif.endTime = Date.now() + notif.remaining;
            notif.timer = setTimeout(() => this.remove(id), notif.remaining);
            notif.remaining = null;
        }
    },
    
    show(message, type = 'success', options = {}) {
        const {
            duration = this.defaultDuration,
                position = this.defaultPosition,
                showProgress = true,
                clickToClose = true,
                pauseOnHover = true
        } = options;
        
        const id = this.generateId();
        const container = this.getContainer(position);
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.dataset.id = id;
        
        // Icon mapping – Ajira style uses clean Font Awesome icons
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        else if (type === 'error') icon = 'exclamation-circle';
        else if (type === 'warning') icon = 'exclamation-triangle';
        else if (type === 'vip') icon = 'crown';
        else if (type === 'info') icon = 'info-circle';
        
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <i class="fas fa-${icon}"></i>
                </div>
                <div class="notification-message">${message}</div>
                ${clickToClose ? `
                    <button class="notification-close" aria-label="Close">
                        <i class="fas fa-times"></i>
                    </button>
                ` : ''}
            </div>
            ${showProgress ? `<div class="notification-progress"><div class="progress-bar" style="animation-duration: ${duration}ms;"></div></div>` : ''}
        `;
        
        container.appendChild(notification);
        
        const notifData = {
            element: notification,
            timer: null,
            endTime: Date.now() + duration,
            remaining: null
        };
        this.activeNotifications.set(id, notifData);
        
        if (duration > 0) {
            notifData.timer = setTimeout(() => this.remove(id), duration);
        }
        
        if (pauseOnHover) {
            notification.addEventListener('mouseenter', () => this.pause(id));
            notification.addEventListener('mouseleave', () => this.resume(id));
        }
        
        if (clickToClose) {
            const closeBtn = notification.querySelector('.notification-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.remove(id);
                });
            }
        }
        
        return id;
    }
};

// Backward compatibility – keeps all your existing code working
function showNotification(message, type = 'success', options = {}) {
    return NotificationManager.show(message, type, options);
}

// Loading overlay
function showLoading(message = 'Loading...') {
    let loadingOverlay = document.getElementById('loadingOverlay');
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loadingOverlay';
        loadingOverlay.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            ">
                <div style="
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    text-align: center;
                    min-width: 200px;
                ">
                    <div style="
                        width: 50px;
                        height: 50px;
                        border: 5px solid #f3f3f3;
                        border-top: 5px solid #3498db;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 15px;
                    "></div>
                    <div>${message}</div>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(loadingOverlay);
    } else {
        loadingOverlay.style.display = 'flex';
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) loadingOverlay.style.display = 'none';
}

// Validate edit odds (no 100% requirement)
function validateEditOdds() {
    const home = parseInt(document.getElementById('editHomePercentage').value) || 0;
    const draw = parseInt(document.getElementById('editDrawPercentage').value) || 0;
    const away = parseInt(document.getElementById('editAwayPercentage').value) || 0;
    const total = home + draw + away;
    
    const oddsTotal = document.getElementById('editOddsTotal');
    if (oddsTotal) {
        oddsTotal.innerHTML = `Total: ${total}%`;
        oddsTotal.style.color = total === 100 ? 'var(--success-color)' : 'var(--gray-color)';
    }
    return true;
}

// Add this to your DOMContentLoaded event listener or initialization code
['editHomePercentage', 'editDrawPercentage', 'editAwayPercentage'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', validateEditOdds);
});

// ==================== MAIN INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Football Canvas Hub - Initializing...');
    
    // Make bettingSystem globally accessible
    window.bettingSystem = bettingSystem;
    
    // Initialize AuthManager
    const authManager = new AuthManager(auth, db, storage);
    window.authManager = authManager;
    
    // Initialize FormHandler
    const formHandler = new FormHandler(authManager);
    window.formHandler = formHandler;
    formHandler.init();
    
    if (window.chatSystem) {
  window.chatSystem.cleanup();
}
window.chatSystem = new ChatSystem();
window.chatSystem.init();

    // Initialize SectionManager
    window.sectionManager = new SectionManager();
    
    const checkUserAccountManager = setInterval(() => {
    if (window.authManager && window.authManager.user) {
        clearInterval(checkUserAccountManager);
        window.userAccountManager = new UserAccountManager();
    }
}, 500);

    setTimeout(() => {
        initHamburgerMenu();
    }, 1000);


    // Add Match Form submit handler (single registration)
    const addMatchForm = document.getElementById('addMatchForm');
    if (addMatchForm) {
        // Remove any existing listeners to avoid duplicates
        const newForm = addMatchForm.cloneNode(true);
        addMatchForm.parentNode.replaceChild(newForm, addMatchForm);
        newForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateOdds()) {
                showNotification("Please check odds values", "error");
                return;
            }
            
            const homeTeam = document.getElementById('homeTeam').value;
            const awayTeam = document.getElementById('awayTeam').value;
            const competition = document.getElementById('competition').value;
            const matchDate = document.getElementById('matchDate').value;
            const venue = document.getElementById('venue').value;
            const status = document.getElementById('matchStatus').value;
            
            const homePercentage = parseInt(document.getElementById('homePercentage').value);
            const drawPercentage = parseInt(document.getElementById('drawPercentage').value);
            const awayPercentage = parseInt(document.getElementById('awayPercentage').value);
            
            const matchData = {
                homeTeam,
                awayTeam,
                competition,
                date: new Date(matchDate),
                venue,
                status,
                odds: {
                    home: homePercentage,
                    draw: drawPercentage,
                    away: awayPercentage
                },
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            try {
                await db.collection('matches').add(matchData);
                showNotification('Match added successfully with custom odds!', 'success');
                this.reset();
                
                document.getElementById('homePercentage').value = 45;
                document.getElementById('drawPercentage').value = 30;
                document.getElementById('awayPercentage').value = 25;
                
                bettingSystem.loadMatches();
                bettingSystem.loadAdminMatches();
                
            } catch (error) {
                console.error("Error adding match:", error);
                showNotification(`Error: ${error.message}`, 'error');
            }
        });
    }
    
    // Add odds validation listeners
    ['homePercentage', 'drawPercentage', 'awayPercentage'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', validateOdds);
    });
    
    // Initialize Auth (this will set up the auth state listener)
    await authManager.init();
    
    // Set up modal close on escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
    
    // Close modal on overlay click
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // Initialize date field for match form
    const matchDateInput = document.getElementById('matchDate');
    if (matchDateInput) {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const year = tomorrow.getFullYear();
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const day = String(tomorrow.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        matchDateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    
    // Make betting functions globally accessible for inline onclick
    window.bettingSystem = bettingSystem;
    
    console.log('✅ Football Canvas Hub loaded successfully');
});


function showSection(sectionId) {
    // All possible section IDs (matches, my-bets, admin, refund)
    const sections = ['matches', 'my-bets', 'admin', 'refund'];
    
    // 1. Hide all sections
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    
    // 2. Show the selected section
    const activeSection = document.getElementById(sectionId);
    if (activeSection) activeSection.style.display = 'block';
    
    // 3. Update active state on every .tab‑btn (works across both nav-tabs blocks)
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        const onclickAttr = btn.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`'${sectionId}'`)) {
            btn.classList.add('active');
        }
    });
}

// Initialize: show the default section and set the active tab
document.addEventListener('DOMContentLoaded', function() {
    // Find the tab that already has class 'active' (default: 'All Matches')
    const defaultTab = document.querySelector('.tab-btn.active');
     if (typeof initLanguage === 'function') {
        setTimeout(initLanguage, 500);
    }
    if (defaultTab) {
        // Extract the section ID from its onclick attribute
        const onclickAttr = defaultTab.getAttribute('onclick');
        const match = onclickAttr && onclickAttr.match(/'([^']+)'/);
        if (match) {
            showSection(match[1]);
        } else {
            // Fallback to 'matches'
            showSection('matches');
        }
    } else {
        // No active tab found – default to 'matches'
        showSection('matches');
        // Also add 'active' class to the first tab
        const firstTab = document.querySelector('.tab-btn');
        if (firstTab) firstTab.classList.add('active');
    }
});

// ==================== UPDATED BANKING SYSTEM ====================
class BankingSystem {
    constructor() {
        this.currentPaymentMethod = null;
        this.pendingTransaction = null;
        this.bankAccounts = [];
        this.feeSettings = {
            withdrawalFee: 15,
            minDeposit: 1000,
            minWithdrawal: 5000
        };
        this.init();
    }
    
    getProviderLogo(provider) {
    const logos = {
        // Mobile money providers
        vodacom: 'https://www.google.com/s2/favicons?domain=vodacom.co.tz&sz=64',
        airtel: 'https://i1.sndcdn.com/artworks-000057339143-xnv3wk-t500x500.jpg',
        halotel: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmXoZyMQ8upMoN3BgSod5iWI0djvDtRc1Y-kh9VrWdzA&s=10',
        halopesa: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmXoZyMQ8upMoN3BgSod5iWI0djvDtRc1Y-kh9VrWdzA&s=10', // same as halotel
        lipa: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2LCGO5BlMC8soIRayVXFKmuQNq2_K2f-V8hzqAxXfrvtFJr_W1iT2jCYC&s=10',
        pesa: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfvBPfTF6yYdrmgtQ8aC4OUMgt7xOa-j8inMtIz27uzuxCsX8nVgrcWWg&s=10',
        yas: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Yas_Tanzania.svg',

        // Bank providers
        crdb: 'https://images.africanfinancials.com/tz-crdb-logo.png',
        nmb: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Nmb_logo.jpg',
        kcb: 'https://logo.clearbit.com/kcbgroup.com',
        dtb: 'https://logo.clearbit.com/dtbbank.com',
        exim: 'https://logo.clearbit.com/eximbank.com',
        barclays: 'https://logo.clearbit.com/barclays.co.tz'
    };

    // Fallback to a placeholder with the first letter if provider not found
    return logos[provider] || `https://via.placeholder.com/60?text=${provider.charAt(0).toUpperCase()}`;
}

async init() {
    console.log("🏦 Initializing Banking System...");
    await this.loadBankAccounts();
    await this.loadFeeSettings();
    this.setupEventListeners();
    this.updateBalanceDisplay();
    
    // Load pending approvals if admin
    if (window.authManager?.userData?.role === 'admin' || window.authManager?.userData?.role === 'superadmin') {
        this.loadPendingApprovals();
        this.loadPendingApprovalsCount();
        this.loadAnalytics();
    }
}

updateBalanceDisplay() {
    updateUserBalanceDisplay();
}

    setupEventListeners() {
        // Listen for auth changes to update balance
        document.addEventListener('sectionChanged', (e) => {
            if (e.detail.sectionId === 'walletSection') {
                this.updateBalanceDisplay();
                this.loadTransactionHistory();
            }
            if (e.detail.sectionId === 'bankingAdminSection') {
                this.loadPendingApprovals();
                this.loadPendingApprovalsCount();
                this.loadAnalytics();
            }
        });
    }
    
    async populateWithdrawalDropdown() {
    const select = document.getElementById('withdrawBank');
    if (!select) return;
    
    const user = window.authManager?.user;
    if (!user) {
        select.innerHTML = '<option value="">Please login</option>';
        return;
    }
    
    try {
        // Try indexed query first, fallback to simple query
        let snapshot;
        try {
            snapshot = await db.collection('userBankAccounts')
                .where('userId', '==', user.uid)
                .orderBy('isDefault', 'desc')
                .get();
        } catch (indexError) {
            console.warn("Index missing, using fallback");
            const fallback = await db.collection('userBankAccounts')
                .where('userId', '==', user.uid)
                .get();
            const docs = [];
            fallback.forEach(doc => docs.push({ id: doc.id, ...doc.data() }));
            docs.sort((a, b) => {
                if (a.isDefault && !b.isDefault) return -1;
                if (!a.isDefault && b.isDefault) return 1;
                return 0;
            });
            snapshot = { forEach: (cb) => docs.forEach(d => cb({ id: d.id, data: () => d })) };
        }
        
        select.innerHTML = '<option value="">Select Your Account</option>';
        
        if (!snapshot || snapshot.forEach.length === 0) {
            select.innerHTML += '<option value="" disabled>No accounts. Please add one in Accounts section.</option>';
            return;
        }
        
        let hasDefault = false;
        snapshot.forEach(doc => {
            const account = doc.data ? doc.data() : doc;
            const option = document.createElement('option');
            option.value = doc.id;
            option.setAttribute('data-name', account.accountName);
            option.setAttribute('data-number', account.accountNumber);
            option.setAttribute('data-provider', account.provider);
            
            const providerDisplay = this.formatProvider(account.provider);
            option.textContent = `${account.accountName} (${providerDisplay}) - ${account.accountNumber}${account.isDefault ? ' (Default)' : ''}`;
            
            if (account.isDefault) {
                option.selected = true;
                hasDefault = true;
            }
            select.appendChild(option);
        });
        
        // Auto-fill if default exists
        if (hasDefault) {
            updateWithdrawAccountDetails();
        }
        
    } catch (error) {
        console.error("Error loading accounts:", error);
        select.innerHTML = '<option value="">Error loading accounts</option>';
    }
}

    // Add this method inside the BankingSystem class
async loadUserBankAccounts() {
    try {
        await loadWithdrawalBankAccounts();
    } catch (error) {
        console.error("Error loading user bank accounts:", error);
    }
}

    // ========== BANK ACCOUNT MANAGEMENT ==========
async loadBankAccounts() {
    try {
        const snapshot = await db.collection('bankAccounts')
            .orderBy('createdAt', 'desc')
            .get();

        this.bankAccounts = [];
        snapshot.forEach(doc => {
            this.bankAccounts.push({ id: doc.id, ...doc.data() });
        });

        console.log("Bank accounts loaded:", this.bankAccounts);
        this.updatePaymentMethods(); // refresh UI
        return this.bankAccounts;
    } catch (error) {
        console.error("Error loading bank accounts:", error);
        throw error;
    }
}


    showAddAccountForm(type) {
        document.getElementById('accountType').value = type;
        document.getElementById('addAccountForm').reset();
        
        // Reset form validation
        document.querySelectorAll('#addAccountForm .form-input').forEach(input => {
            input.classList.remove('error');
        });
        
        openModal('addAccountModal');
        
        // Add form submit handler if not already added
        const form = document.getElementById('addAccountForm');
        form.onsubmit = (e) => this.saveAccount(e);
    }

    async saveAccount(event) {
        event.preventDefault();
        
        const accountData = {
            type: document.getElementById('accountType').value,
            accountName: document.getElementById('accountName').value,
            accountNumber: document.getElementById('accountNumber').value,
            provider: document.getElementById('accountProvider').value,
            instructions: document.getElementById('accountInstructions').value || 'Send payment to the above number',
            active: true,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        // Validate
        if (!accountData.accountName || !accountData.accountNumber || !accountData.provider) {
            showNotification('Please fill all required fields', 'error');
            return;
        }

        try {
            await db.collection('bankAccounts').add(accountData);
            showNotification('Account added successfully!', 'success');
            closeModal('addAccountModal');
            await this.loadBankAccounts();
        } catch (error) {
            console.error("Error adding account:", error);
            showNotification('Error adding account: ' + error.message, 'error');
        }
    }

    async editAccount(accountId) {
        const account = this.bankAccounts.find(a => a.id === accountId);
        if (!account) return;
        
        document.getElementById('accountType').value = account.type;
        document.getElementById('accountName').value = account.accountName;
        document.getElementById('accountNumber').value = account.accountNumber;
        document.getElementById('accountProvider').value = account.provider;
        document.getElementById('accountInstructions').value = account.instructions || '';
        
        openModal('addAccountModal');
        
        const form = document.getElementById('addAccountForm');
        form.onsubmit = async (e) => {
            e.preventDefault();
            
            const updatedData = {
                accountName: document.getElementById('accountName').value,
                accountNumber: document.getElementById('accountNumber').value,
                provider: document.getElementById('accountProvider').value,
                instructions: document.getElementById('accountInstructions').value,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            try {
                await db.collection('bankAccounts').doc(accountId).update(updatedData);
                showNotification('Account updated successfully!', 'success');
                closeModal('addAccountModal');
                await this.loadBankAccounts();
            } catch (error) {
                console.error("Error updating account:", error);
                showNotification('Error updating account', 'error');
            }
        };
    }

    async toggleAccountStatus(accountId) {
        const account = this.bankAccounts.find(a => a.id === accountId);
        if (!account) return;
        
        try {
            await db.collection('bankAccounts').doc(accountId).update({
                active: !account.active,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            showNotification(`Account ${account.active ? 'disabled' : 'enabled'}`, 'success');
            await this.loadBankAccounts();
        } catch (error) {
            console.error("Error toggling account status:", error);
            showNotification('Error updating account', 'error');
        }
    }

    async deleteAccount(accountId) {
        if (!confirm('Are you sure you want to delete this account?')) return;
        
        try {
            await db.collection('bankAccounts').doc(accountId).delete();
            showNotification('Account deleted successfully', 'success');
            await this.loadBankAccounts();
        } catch (error) {
            console.error("Error deleting account:", error);
            showNotification('Error deleting account', 'error');
        }
    }

updatePaymentMethods() {
    const methodsGrid = document.querySelector('.payment-methods-grid');
    if (!methodsGrid) return;
    
    const mobileAccounts = this.bankAccounts.filter(a => a.type === 'mobile' && a.active !== false);
    
    console.log("Mobile accounts for payment:", mobileAccounts);
    
    if (mobileAccounts.length === 0) {
        methodsGrid.innerHTML = `
            <div class="no-methods">
                <i class="fas fa-exclamation-circle"></i>
                <h4>No Payment Methods Available</h4>
                <p>Please contact support or try again later.</p>
            </div>
        `;
        return;
    }
    
    methodsGrid.innerHTML = mobileAccounts.map(account => {
        const provider = account.provider.toLowerCase();
        const logoUrl = this.getProviderLogo(provider);
        
        return `
            <div class="payment-method" onclick="bankingSystem.selectPaymentMethod('${provider}')">
                <img src="${logoUrl}" alt="${account.provider}" 
                     onerror="this.src='https://via.placeholder.com/60?text=${provider.charAt(0).toUpperCase()}'">
                <span class="method-name">${account.accountName}</span>
                <span class="account-number">${account.accountNumber}</span>
                <small class="provider">${account.provider.toUpperCase()}</small>
            </div>
        `;
    }).join('');
}

    // ========== FEE SETTINGS ==========
    async loadFeeSettings() {
        try {
            const doc = await db.collection('settings').doc('banking').get();
            if (doc.exists) {
                this.feeSettings = doc.data();
                this.populateFeeSettings();
            }
        } catch (error) {
            console.error("Error loading fee settings:", error);
        }
    }

    populateFeeSettings() {
        const feeInput = document.getElementById('withdrawalFee');
        const minDeposit = document.getElementById('minDeposit');
        const minWithdrawal = document.getElementById('minWithdrawal');
        
        if (feeInput) feeInput.value = this.feeSettings.withdrawalFee;
        if (minDeposit) minDeposit.value = this.feeSettings.minDeposit;
        if (minWithdrawal) minWithdrawal.value = this.feeSettings.minWithdrawal;
    }

    async saveFeeSettings() {
        const settings = {
            withdrawalFee: parseInt(document.getElementById('withdrawalFee').value) || 15,
            minDeposit: parseInt(document.getElementById('minDeposit').value) || 1000,
            minWithdrawal: parseInt(document.getElementById('minWithdrawal').value) || 5000,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            await db.collection('settings').doc('banking').set(settings, { merge: true });
            this.feeSettings = settings;
            showNotification('Settings saved successfully!', 'success');
        } catch (error) {
            console.error("Error saving settings:", error);
            showNotification('Error saving settings', 'error');
        }
    }

    // ========== DEPOSIT FUNCTIONS ==========
    selectPaymentMethod(method) {
        this.currentPaymentMethod = method;
        
        // Update UI
        document.querySelectorAll('.payment-method').forEach(el => {
            el.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');
        
        // Move to step 2
        document.getElementById('depositStep1').classList.remove('active');
        document.getElementById('depositStep2').classList.add('active');
        
        document.querySelectorAll('.step')[0].classList.remove('active');
        document.querySelectorAll('.step')[1].classList.add('active');
    }

    goToDepositStep3() {
        const fullName = document.getElementById('depositFullName').value;
        const mobile = document.getElementById('depositMobile').value;
        const amount = parseFloat(document.getElementById('depositAmount').value);
        
        if (!fullName || !mobile || !amount) {
            showNotification('Please fill all fields', 'error');
            return;
        }
        
        if (amount < this.feeSettings.minDeposit) {
            showNotification(`Minimum deposit is TZS ${this.feeSettings.minDeposit}`, 'error');
            return;
        }
        
        // Save pending transaction data
        this.pendingTransaction = {
            fullName,
            mobile,
            amount,
            method: this.currentPaymentMethod
        };
        
        // Display bank details
        this.displayBankDetails();
        
        // Move to step 3
        document.getElementById('depositStep2').classList.remove('active');
        document.getElementById('depositStep3').classList.add('active');
        
        document.querySelectorAll('.step')[1].classList.remove('active');
        document.querySelectorAll('.step')[2].classList.add('active');
    }

    displayBankDetails() {
    // Find account by provider (case-insensitive)
    const account = this.bankAccounts.find(a =>
        a.provider && a.provider.toLowerCase() === this.currentPaymentMethod?.toLowerCase()
    );
    
    if (!account) {
        console.log("Available accounts:", this.bankAccounts);
        console.log("Looking for provider:", this.currentPaymentMethod);
        
        document.getElementById('bankDetails').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <h4>No account found for this payment method</h4>
                <p>Please contact support or try another payment method.</p>
                <button class="btn btn-secondary" onclick="resetDepositSteps()">
                    <i class="fas fa-arrow-left"></i> Go Back
                </button>
            </div>
        `;
        return;
    }
    
    const details = document.getElementById('bankDetails');
    details.innerHTML = `
        <div class="bank-detail-card">
            <div class="bank-header">
                <i class="fas fa-university"></i>
                <h4>${account.accountName}</h4>
            </div>
            <div class="bank-info">
                <p><strong>Account Number:</strong> <span class="account-number">${account.accountNumber}</span></p>
                <p><strong>Instructions:</strong> ${account.instructions}</p>
                <p><strong>Amount to Send:</strong> <span class="amount">TZS ${this.pendingTransaction.amount.toFixed(2)}</span></p>
            </div>
            <div class="warning-note">
                <i class="fas fa-exclamation-triangle"></i>
                Send exactly <strong>TZS ${this.pendingTransaction.amount.toFixed(2)}</strong> to this account number and keep your transaction ID
            </div>
        </div>
    `;
}

async submitDepositRequest() {
    const transactionId = document.getElementById('transactionId').value;
    const screenshot = document.getElementById('paymentScreenshot').files[0];
    
    if (!transactionId) {
        showNotification('Please enter transaction ID', 'error');
        return;
    }
    
    const userData = window.authManager?.userData;
    if (!userData) {
        showNotification('Please login first', 'error');
        return;
    }
    
    if (!this.pendingTransaction) {
        showNotification('Please complete the deposit steps first', 'error');
        resetDepositSteps();
        return;
    }
    
    try {
        showLoading('Submitting deposit request...');
        
        let screenshotUrl = null;
        if (screenshot) {
            showNotification('Uploading screenshot...', 'info');
            
            const storageRef = firebase.storage().ref();
            const screenshotRef = storageRef.child(`deposits/${userData.uid}/${Date.now()}_${screenshot.name}`);
            await screenshotRef.put(screenshot);
            screenshotUrl = await screenshotRef.getDownloadURL();
        }
        
        const depositData = {
            userId: userData.uid,
            userEmail: userData.email,
            userFullName: userData.fullName || this.pendingTransaction.fullName,
            mobile: this.pendingTransaction.mobile,
            amount: this.pendingTransaction.amount,
            paymentMethod: this.pendingTransaction.method,
            transactionId: transactionId,
            screenshot: screenshotUrl,
            status: 'pending',
            type: 'deposit',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        await db.collection('transactions').add(depositData);
        
        // Clear form and reset
        this.resetDepositForm();
        
        hideLoading();
        showNotification('Deposit request submitted for approval!', 'success');
        
        // Show receipt with safe date handling
        this.showReceipt({
            ...depositData,
            type: 'deposit',
            status: 'pending',
            createdAt: { toDate: () => new Date() } // Add safe toDate method
        });
        
    } catch (error) {
        hideLoading();
        console.error("Error submitting deposit:", error);
        showNotification('Error submitting request: ' + error.message, 'error');
    }
}

    resetDepositForm() {
        document.getElementById('depositStep1').classList.add('active');
        document.getElementById('depositStep2').classList.remove('active');
        document.getElementById('depositStep3').classList.remove('active');
        
        document.querySelectorAll('.step')[0].classList.add('active');
        document.querySelectorAll('.step')[1].classList.remove('active');
        document.querySelectorAll('.step')[2].classList.remove('active');
        
        document.getElementById('depositFullName').value = '';
        document.getElementById('depositMobile').value = '';
        document.getElementById('depositAmount').value = '';
        document.getElementById('transactionId').value = '';
        document.getElementById('paymentScreenshot').value = '';
        
        this.pendingTransaction = null;
    }
    
    // ========== DEPOSIT HELPER FUNCTIONS ==========


    // ========== WITHDRAWAL FUNCTIONS ==========
    calculateWithdrawalDeduction() {
        const amount = parseFloat(document.getElementById('withdrawAmount').value) || 0;
        const fee = amount * (this.feeSettings.withdrawalFee / 100);
        const netAmount = amount - fee;
        
        document.getElementById('calcWithdrawAmount').textContent = `TZS ${amount.toFixed(2)}`;
        document.getElementById('calcFee').textContent = `TZS ${fee.toFixed(2)}`;
        document.getElementById('calcNetAmount').textContent = `TZS ${netAmount.toFixed(2)}`;
    }

    updateBankDetails() {
        const select = document.getElementById('withdrawBank');
        const selectedOption = select.options[select.selectedIndex];
        
        if (selectedOption && selectedOption.value) {
            document.getElementById('withdrawAccountName').value = selectedOption.dataset.name || '';
            document.getElementById('withdrawAccountNumber').value = selectedOption.dataset.number || '';
        }
    }

    async submitWithdrawalRequest() {
        const userData = window.authManager?.userData;
        if (!userData) {
            showNotification('Please login first', 'error');
            return;
        }
        
        const amount = parseFloat(document.getElementById('withdrawAmount').value);
        const bankId = document.getElementById('withdrawBank').value;
        const accountName = document.getElementById('withdrawAccountName').value;
        const accountNumber = document.getElementById('withdrawAccountNumber').value;
        const mobile = document.getElementById('withdrawMobile').value;
        
        if (!amount || !bankId || !accountName || !accountNumber || !mobile) {
            showNotification('Please fill all fields', 'error');
            return;
        }
        
        if (amount < this.feeSettings.minWithdrawal) {
            showNotification(`Minimum withdrawal is TZS ${this.feeSettings.minWithdrawal}`, 'error');
            return;
        }
        
        if (amount > userData.balance) {
            showNotification('Insufficient balance', 'error');
            return;
        }
        
        const fee = amount * (this.feeSettings.withdrawalFee / 100);
        const netAmount = amount - fee;
        
        try {
            // Get bank account details
            const bankAccount = this.bankAccounts.find(a => a.id === bankId);
            
            // Create withdrawal request
            const withdrawalData = {
                userId: userData.uid,
                userEmail: userData.email,
                userName: userData.fullName,
                amount: amount,
                fee: fee,
                netAmount: netAmount,
                bankId: bankId,
                bankName: bankAccount?.accountName || 'Bank Account',
                bankProvider: bankAccount?.provider || 'Unknown',
                accountName: accountName,
                accountNumber: accountNumber,
                mobile: mobile,
                status: 'pending',
                type: 'withdrawal',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            // Run in transaction to ensure data consistency
            await db.runTransaction(async (transaction) => {
                // Check current balance
                const userRef = db.collection('users').doc(userData.uid);
                const userDoc = await transaction.get(userRef);
                
                if (!userDoc.exists) {
                    throw new Error('User not found');
                }
                
                const currentBalance = userDoc.data().balance || 0;
                if (currentBalance < amount) {
                    throw new Error('Insufficient balance');
                }
                
                // Deduct amount immediately
                transaction.update(userRef, {
                    balance: firebase.firestore.FieldValue.increment(-amount),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                
                // Save withdrawal request
                const transRef = db.collection('transactions').doc();
                transaction.set(transRef, withdrawalData);
            });
            
            // Update local balance
            if (window.authManager.userData) {
                window.authManager.userData.balance -= amount;
            }
            
            // Reset form
            document.getElementById('withdrawAmount').value = '';
            document.getElementById('withdrawBank').value = '';
            document.getElementById('withdrawAccountName').value = '';
            document.getElementById('withdrawAccountNumber').value = '';
            document.getElementById('withdrawMobile').value = '';
            
            this.updateBalanceDisplay();
            
            showNotification('Withdrawal request submitted for approval!', 'success');
            
            // Show receipt
            this.showReceipt({
                ...withdrawalData,
                type: 'withdrawal',
                status: 'pending'
            });
            
        } catch (error) {
            console.error("Error submitting withdrawal:", error);
            showNotification('Error submitting request: ' + error.message, 'error');
        }
    }

    // ========== ADMIN APPROVAL FUNCTIONS ==========
// ========== COMPLETE ADMIN APPROVAL FUNCTIONS ==========
async loadPendingApprovals() {
    const filter = document.getElementById('approvalFilter')?.value || 'pending';
    const container = document.getElementById('approvalsList');
    
    if (!container) return;
    
    try {
        showLoading('Loading approvals...');
        
        let query;
        
        // Build query based on filter
        if (filter === 'pending') {
            // For pending, show both deposit and withdrawal that are pending
            query = db.collection('transactions')
                .where('status', '==', 'pending')
                .orderBy('createdAt', 'desc');
        } else {
            // For approved/rejected, filter by type and status
            query = db.collection('transactions')
                .where('type', 'in', ['deposit', 'withdrawal'])
                .where('status', '==', filter)
                .orderBy('createdAt', 'desc');
        }
        
        const snapshot = await query.get();
        
        if (snapshot.empty) {
            container.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-inbox" style="font-size: 3rem; opacity: 0.5;"></i>
                    <h3 style="margin-top: 1rem; color: white;">No ${filter} transactions</h3>
                    <p style="color: var(--gray-color);">There are no ${filter} transactions to display</p>
                </div>
            `;
            hideLoading();
            return;
        }
        
        let html = '';
        let pendingCount = 0;
        
        snapshot.forEach(doc => {
            const transaction = { id: doc.id, ...doc.data() };
            if (transaction.status === 'pending') pendingCount++;
            html += this.createApprovalCard(transaction);
        });
        
        container.innerHTML = html;
        
        // Update pending count badge
        const badge = document.getElementById('pendingApprovalBadge');
        if (badge) {
            badge.textContent = pendingCount;
            badge.style.display = pendingCount > 0 ? 'inline-flex' : 'none';
        }
        
        hideLoading();
        
    } catch (error) {
        hideLoading();
        console.error("Error loading approvals:", error);
        
        // Show user-friendly error
        container.innerHTML = `
            <div class="error-container">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--danger-color);"></i>
                <h3 style="margin: 1rem 0; color: white;">Error Loading Approvals</h3>
                <p style="color: var(--gray-color); margin-bottom: 1rem;">${error.message}</p>
                <button class="btn btn-primary" onclick="bankingSystem.loadPendingApprovals()">
                    <i class="fas fa-sync-alt"></i> Retry
                </button>
            </div>
        `;
    }
}

// Create approval card with better design
createApprovalCard(transaction) {
    const date = transaction.createdAt?.toDate() || new Date();
    const isDeposit = transaction.type === 'deposit';
    
    // Format date nicely
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    return `
        <div class="approval-card ${transaction.status}" data-id="${transaction.id}">
            <div class="approval-header">
                <div class="transaction-type-badge ${transaction.type}">
                    <i class="fas ${isDeposit ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
                    ${transaction.type.toUpperCase()}
                </div>
                <div class="transaction-status-badge ${transaction.status}">
                    ${transaction.status.toUpperCase()}
                </div>
            </div>
            
            <div class="approval-body">
                <div class="user-info-section">
                    <div class="info-row">
                        <i class="fas fa-user"></i>
                        <span><strong>User:</strong> ${transaction.userEmail || transaction.userId.substring(0, 8) + '...'}</span>
                    </div>
                    <div class="info-row">
                        <i class="fas fa-tag"></i>
                        <span><strong>Name:</strong> ${transaction.userFullName || transaction.userName || 'N/A'}</span>
                    </div>
                    ${transaction.mobile ? `
                    <div class="info-row">
                        <i class="fas fa-phone"></i>
                        <span><strong>Mobile:</strong> ${transaction.mobile}</span>
                    </div>
                    ` : ''}
                </div>
                
                <div class="transaction-details-section">
                    <div class="amount-row ${isDeposit ? 'deposit' : 'withdrawal'}">
                        <span>Amount:</span>
                        <strong>TZS ${transaction.amount.toFixed(2)}</strong>
                    </div>
                    
                    ${transaction.fee ? `
                    <div class="info-row">
                        <i class="fas fa-percentage"></i>
                        <span><strong>Fee:</strong> TZS ${transaction.fee.toFixed(2)}</span>
                    </div>
                    ` : ''}
                    
                    ${transaction.netAmount ? `
                    <div class="info-row highlight">
                        <i class="fas fa-wallet"></i>
                        <span><strong>Net Amount:</strong> TZS ${transaction.netAmount.toFixed(2)}</span>
                    </div>
                    ` : ''}
                    
                    ${transaction.paymentMethod ? `
                    <div class="info-row">
                        <i class="fas fa-mobile-alt"></i>
                        <span><strong>Payment Method:</strong> ${transaction.paymentMethod.toUpperCase()}</span>
                    </div>
                    ` : ''}
                    
                    ${transaction.transactionId ? `
                    <div class="info-row">
                        <i class="fas fa-hashtag"></i>
                        <span><strong>Transaction ID:</strong> ${transaction.transactionId}</span>
                    </div>
                    ` : ''}
                    
                    ${transaction.bankProvider ? `
                    <div class="info-row">
                        <i class="fas fa-university"></i>
                        <span><strong>Bank:</strong> ${transaction.bankProvider}</span>
                    </div>
                    ` : ''}
                </div>
                
                <div class="time-section">
                    <i class="far fa-clock"></i>
                    <span>${formattedDate}</span>
                </div>
            </div>
            
            ${transaction.screenshot ? `
            <div class="screenshot-section">
                <div class="screenshot-preview" onclick="bankingSystem.viewScreenshot('${transaction.screenshot}')">
                    <img src="${transaction.screenshot}" alt="Payment Screenshot">
                    <div class="screenshot-overlay">
                        <i class="fas fa-search-plus"></i> Click to view
                    </div>
                </div>
            </div>
            ` : ''}
            
            ${transaction.status === 'pending' ? `
            <div class="approval-actions">
                <button class="btn-approve" onclick="bankingSystem.approveTransaction('${transaction.id}')">
                    <i class="fas fa-check-circle"></i> Approve
                </button>
                <button class="btn-reject" onclick="bankingSystem.showRejectModal('${transaction.id}')">
                    <i class="fas fa-times-circle"></i> Reject
                </button>
            </div>
            ` : ''}
            
            ${transaction.rejectionReason ? `
            <div class="rejection-reason">
                <i class="fas fa-exclamation-circle"></i>
                <strong>Rejection Reason:</strong> ${transaction.rejectionReason}
            </div>
            ` : ''}
        </div>
    `;
}

// View screenshot in full size
viewScreenshot(url) {
    window.open(url, '_blank');
}

// Load pending approvals count for badge
async loadPendingApprovalsCount() {
    try {
        const snapshot = await db.collection('transactions')
            .where('status', '==', 'pending')
            .where('type', 'in', ['deposit', 'withdrawal'])
            .get();
        
        const badge = document.getElementById('pendingApprovalBadge');
        if (badge) {
            const count = snapshot.size;
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline-flex' : 'none';
        }
        
        return snapshot.size;
    } catch (error) {
        console.error("Error loading pending count:", error);
        return 0;
    }
}

// Approve transaction with full processing
async approveTransaction(transactionId) {
    try {
        showLoading('Processing approval...');
        
        const transactionDoc = await db.collection('transactions').doc(transactionId).get();
        if (!transactionDoc.exists) {
            hideLoading();
            showNotification('Transaction not found', 'error');
            return;
        }
        
        const transaction = transactionDoc.data();
        const batch = db.batch();
        
        if (transaction.type === 'deposit') {
            // Check if this is user's first approved deposit
            const previousDeposits = await db.collection('transactions')
                .where('userId', '==', transaction.userId)
                .where('type', '==', 'deposit')
                .where('status', '==', 'approved')
                .get();
            
            const isFirstDeposit = previousDeposits.size === 0;
            
            // Add deposit amount to user balance
            const userRef = db.collection('users').doc(transaction.userId);
            batch.update(userRef, {
                balance: firebase.firestore.FieldValue.increment(transaction.amount),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // If this is first deposit, process referral commission
            if (isFirstDeposit) {
                const userDoc = await userRef.get();
                const userData = userDoc.data();
                
                if (userData.referredBy) {
                    const commission = transaction.amount * 0.1; // 10% commission
                    
                    // Add commission to referrer's balance
                    const referrerRef = db.collection('users').doc(userData.referredBy);
                    batch.update(referrerRef, {
                        balance: firebase.firestore.FieldValue.increment(commission),
                        totalReferralEarnings: firebase.firestore.FieldValue.increment(commission),
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    
                    // Create referral earning record
                    const earningRef = db.collection('referralEarnings').doc();
                    batch.set(earningRef, {
                        referrerId: userData.referredBy,
                        referredUserId: transaction.userId,
                        referredUserName: userData.fullName || userData.username || 'User',
                        amount: commission,
                        depositAmount: transaction.amount,
                        status: 'paid',
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        paidAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    
                    // Create transaction record for commission
                    const commissionTransRef = db.collection('transactions').doc();
                    batch.set(commissionTransRef, {
                        userId: userData.referredBy,
                        type: 'referral_bonus',
                        amount: commission,
                        description: `10% commission from ${userData.fullName || userData.username}'s first deposit`,
                        date: firebase.firestore.FieldValue.serverTimestamp(),
                        relatedUserId: transaction.userId
                    });
                }
            }
            
            // Create notification for user
            const notificationRef = db.collection('notifications').doc();
            batch.set(notificationRef, {
                userId: transaction.userId,
                title: 'Deposit Approved ✅',
                message: `Your deposit of TZS ${transaction.amount.toFixed(2)} has been approved and added to your balance.`,
                type: 'success',
                read: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
        } else if (transaction.type === 'withdrawal') {
            // Fee goes to admin stats
            if (transaction.fee > 0) {
                const adminStatsRef = db.collection('adminStats').doc('fees');
                const adminStats = await adminStatsRef.get();
                
                if (!adminStats.exists) {
                    batch.set(adminStatsRef, {
                        totalFees: transaction.fee,
                        totalWithdrawals: 1,
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                } else {
                    batch.update(adminStatsRef, {
                        totalFees: firebase.firestore.FieldValue.increment(transaction.fee),
                        totalWithdrawals: firebase.firestore.FieldValue.increment(1),
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
            }
            
            // Create notification for user
            const notificationRef = db.collection('notifications').doc();
            batch.set(notificationRef, {
                userId: transaction.userId,
                title: 'Withdrawal Approved 💰',
                message: `Your withdrawal request of TZS ${transaction.amount.toFixed(2)} has been approved.`,
                type: 'success',
                read: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Update transaction status
        const transRef = db.collection('transactions').doc(transactionId);
        batch.update(transRef, {
            status: 'approved',
            approvedAt: firebase.firestore.FieldValue.serverTimestamp(),
            approvedBy: window.authManager?.user?.uid || 'system'
        });
        
        await batch.commit();
        
        hideLoading();
        showNotification('Transaction approved successfully!', 'success');
        
        // Refresh approvals and analytics
        if (typeof this.loadPendingApprovals === 'function') {
            await this.loadPendingApprovals();
            await this.loadPendingApprovalsCount();
            await this.loadAnalytics();
        }
        
        // Show receipt
        this.showReceipt({
            ...transaction,
            status: 'approved',
            approvedAt: new Date()
        });
        
    } catch (error) {
        hideLoading();
        console.error("Error approving transaction:", error);
        showNotification('Error approving transaction: ' + error.message, 'error');
    }
}

// Show reject modal with reason
showRejectModal(transactionId) {
    this.pendingTransaction = transactionId;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.id = 'rejectModal';
    modal.innerHTML = `
        <div class="modal-container" style="max-width: 500px;">
            <div class="modal-header">
                <h3><i class="fas fa-times-circle" style="color: var(--danger-color);"></i> Reject Transaction</h3>
                <button class="close-modal" onclick="this.closest('.modal-overlay').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="rejectionReason">Reason for Rejection <span style="color: var(--danger-color);">*</span></label>
                    <textarea id="rejectionReason" class="form-input" rows="4" 
                              placeholder="Please provide the reason for rejecting this transaction (e.g., Invalid payment, Wrong amount, etc.)"
                              required></textarea>
                </div>
                <div class="form-group">
                    <label for="rejectionNotes">Additional Notes (Optional)</label>
                    <input type="text" id="rejectionNotes" class="form-input" 
                           placeholder="Any additional information">
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn btn-danger" onclick="bankingSystem.rejectTransaction()" style="flex: 1;">
                        <i class="fas fa-check-circle"></i> Confirm Rejection
                    </button>
                    <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()" style="flex: 1;">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Focus on textarea
    setTimeout(() => {
        document.getElementById('rejectionReason').focus();
    }, 100);
}

// Reject transaction with reason
async rejectTransaction() {
    const reason = document.getElementById('rejectionReason').value;
    const notes = document.getElementById('rejectionNotes')?.value || '';
    
    if (!reason) {
        showNotification('Please provide a reason for rejection', 'error');
        document.getElementById('rejectionReason').style.borderColor = 'var(--danger-color)';
        return;
    }
    
    try {
        showLoading('Processing rejection...');
        
        const transactionDoc = await db.collection('transactions').doc(this.pendingTransaction).get();
        if (!transactionDoc.exists) {
            hideLoading();
            showNotification('Transaction not found', 'error');
            return;
        }
        
        const transaction = transactionDoc.data();
        const batch = db.batch();
        
        if (transaction.type === 'withdrawal') {
            // Refund withdrawal amount to user
            const userRef = db.collection('users').doc(transaction.userId);
            batch.update(userRef, {
                balance: firebase.firestore.FieldValue.increment(transaction.amount),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Create notification for user
            const notificationRef = db.collection('notifications').doc();
            batch.set(notificationRef, {
                userId: transaction.userId,
                title: 'Withdrawal Rejected ❌',
                message: `Your withdrawal request of TZS ${transaction.amount.toFixed(2)} has been rejected.\nReason: ${reason}`,
                type: 'error',
                read: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
        } else if (transaction.type === 'deposit') {
            // Create notification for user
            const notificationRef = db.collection('notifications').doc();
            batch.set(notificationRef, {
                userId: transaction.userId,
                title: 'Deposit Rejected ❌',
                message: `Your deposit request of TZS ${transaction.amount.toFixed(2)} has been rejected.\nReason: ${reason}`,
                type: 'error',
                read: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Update transaction status
        const transRef = db.collection('transactions').doc(this.pendingTransaction);
        batch.update(transRef, {
            status: 'rejected',
            rejectionReason: reason + (notes ? `\nNotes: ${notes}` : ''),
            rejectedAt: firebase.firestore.FieldValue.serverTimestamp(),
            rejectedBy: window.authManager?.user?.uid || 'system'
        });
        
        await batch.commit();
        
        hideLoading();
        
        // Remove reject modal
        document.getElementById('rejectModal')?.remove();
        
        showNotification('Transaction rejected successfully', 'warning');
        
        // Refresh approvals and analytics
        await this.loadPendingApprovals();
        await this.loadPendingApprovalsCount();
        await this.loadAnalytics();
        
    } catch (error) {
        hideLoading();
        console.error("Error rejecting transaction:", error);
        showNotification('Error rejecting transaction: ' + error.message, 'error');
    }
}

    // ========== TRANSACTION HISTORY ==========
    async loadTransactionHistory() {
        const filter = document.getElementById('transactionFilter')?.value || 'all';
        const userData = window.authManager?.userData;
        
        if (!userData) return;
        
        try {
            let query = db.collection('transactions')
                .where('userId', '==', userData.uid)
                .orderBy('createdAt', 'desc')
                .limit(50);
            
            if (filter !== 'all') {
                query = query.where('type', '==', filter);
            }
            
            const snapshot = await query.get();
            
            const container = document.getElementById('transactionHistory');
            if (!container) return;
            
            if (snapshot.empty) {
                container.innerHTML = '<div class="no-transactions">No transactions found</div>';
                return;
            }
            
            let html = '';
            snapshot.forEach(doc => {
                const trans = { id: doc.id, ...doc.data() };
                html += this.createTransactionItem(trans);
            });
            
            container.innerHTML = html;
            
        } catch (error) {
            console.error("Error loading transactions:", error);
            const container = document.getElementById('transactionHistory');
            if (container) {
                container.innerHTML = '<div class="error">Error loading transactions</div>';
            }
        }
    }

    createTransactionItem(transaction) {
        const date = transaction.createdAt?.toDate() || new Date();
        const isPositive = transaction.type === 'deposit' || transaction.type === 'win' || transaction.type === 'refund';
        const amount = transaction.type === 'withdrawal' && transaction.status === 'pending' 
            ? -transaction.amount 
            : (isPositive ? transaction.amount : -transaction.amount);
        
        let statusClass = '';
        let statusText = transaction.status;
        
        if (transaction.status === 'approved') statusClass = 'status-success';
        else if (transaction.status === 'pending') statusClass = 'status-pending';
        else if (transaction.status === 'rejected') statusClass = 'status-danger';
        
        return `
            <div class="transaction-item" onclick="bankingSystem.showTransactionDetails('${transaction.id}')">
                <div class="transaction-icon ${transaction.type}">
                    <i class="fas ${this.getTransactionIcon(transaction.type)}"></i>
                </div>
                <div class="transaction-info">
                    <div class="transaction-title">
                        ${this.getTransactionTitle(transaction)}
                    </div>
                    <div class="transaction-date">
                        ${date.toLocaleDateString()} ${date.toLocaleTimeString()}
                    </div>
                </div>
                <div class="transaction-amount ${amount >= 0 ? 'positive' : 'negative'}">
                    ${amount >= 0 ? '+' : ''}TZS ${Math.abs(amount).toFixed(2)}
                </div>
                <div class="transaction-status ${statusClass}">
                    ${statusText}
                </div>
            </div>
        `;
    }

    getTransactionIcon(type) {
        const icons = {
            'deposit': 'fa-arrow-down',
            'withdrawal': 'fa-arrow-up',
            'bet': 'fa-futbol',
            'win': 'fa-trophy',
            'refund': 'fa-undo-alt',
            'fee': 'fa-percentage'
        };
        return icons[type] || 'fa-exchange-alt';
    }

    getTransactionTitle(transaction) {
        if (transaction.type === 'deposit') {
            return `Deposit via ${transaction.paymentMethod || 'Mobile Money'}`;
        } else if (transaction.type === 'withdrawal') {
            return `Withdrawal to ${transaction.bankName || 'Bank Account'}`;
        } else if (transaction.type === 'bet') {
            return transaction.description || 'Bet placed';
        } else if (transaction.type === 'win') {
            return 'Bet winnings';
        } else if (transaction.type === 'refund') {
            return transaction.description || 'Refund';
        }
        return 'Transaction';
    }

    async showTransactionDetails(transactionId) {
        try {
            const doc = await db.collection('transactions').doc(transactionId).get();
            if (doc.exists) {
                this.showReceipt({ id: transactionId, ...doc.data() });
            }
        } catch (error) {
            console.error("Error loading transaction details:", error);
        }
    }

    // ========== RECEIPT FUNCTIONS ==========
    showReceipt(transaction) {
    // Safely handle date conversion
    let date = new Date();
    try {
        if (transaction.createdAt) {
            if (typeof transaction.createdAt.toDate === 'function') {
                date = transaction.createdAt.toDate();
            } else if (transaction.createdAt instanceof Date) {
                date = transaction.createdAt;
            } else if (transaction.createdAt.seconds) {
                date = new Date(transaction.createdAt.seconds * 1000);
            }
        }
    } catch (e) {
        console.log("Date conversion error, using current date");
        date = new Date();
    }
    
    let approvedDate = null;
    try {
        if (transaction.approvedAt) {
            if (typeof transaction.approvedAt.toDate === 'function') {
                approvedDate = transaction.approvedAt.toDate();
            } else if (transaction.approvedAt instanceof Date) {
                approvedDate = transaction.approvedAt;
            } else if (transaction.approvedAt.seconds) {
                approvedDate = new Date(transaction.approvedAt.seconds * 1000);
            }
        }
    } catch (e) {
        approvedDate = null;
    }
    
    const receiptId = 'RCP-' + Date.now().toString(36).toUpperCase();
    
    const content = document.getElementById('receiptContent');
    content.innerHTML = `
        <div class="receipt">
            <div class="receipt-header">
                <h2>Transaction Receipt</h2>
                <div class="receipt-id">#${receiptId}</div>
            </div>
            
            <div class="receipt-status ${transaction.status}">
                Status: ${transaction.status.toUpperCase()}
                ${transaction.rejectionReason ? `<br><small>Reason: ${transaction.rejectionReason}</small>` : ''}
            </div>
            
            <div class="receipt-details">
                <div class="receipt-row">
                    <span>Transaction Type:</span>
                    <strong>${transaction.type?.toUpperCase() || 'N/A'}</strong>
                </div>
                <div class="receipt-row">
                    <span>Amount:</span>
                    <strong>TZS ${(transaction.amount || 0).toFixed(2)}</strong>
                </div>
                ${transaction.fee ? `
                <div class="receipt-row">
                    <span>Service Fee:</span>
                    <strong>TZS ${transaction.fee.toFixed(2)}</strong>
                </div>
                ` : ''}
                ${transaction.netAmount ? `
                <div class="receipt-row total">
                    <span>Net Amount:</span>
                    <strong>TZS ${transaction.netAmount.toFixed(2)}</strong>
                </div>
                ` : ''}
                <div class="receipt-row">
                    <span>Date:</span>
                    <strong>${date.toLocaleString()}</strong>
                </div>
                ${approvedDate ? `
                <div class="receipt-row">
                    <span>Approved Date:</span>
                    <strong>${approvedDate.toLocaleString()}</strong>
                </div>
                ` : ''}
                ${transaction.transactionId ? `
                <div class="receipt-row">
                    <span>Reference:</span>
                    <strong>${transaction.transactionId}</strong>
                </div>
                ` : ''}
                ${transaction.paymentMethod ? `
                <div class="receipt-row">
                    <span>Payment Method:</span>
                    <strong>${transaction.paymentMethod}</strong>
                </div>
                ` : ''}
            </div>
            
            <div class="receipt-footer">
                <p>Thank you for using Football Canvas Hub</p>
                <small>This is a computer generated receipt</small>
            </div>
        </div>
    `;
    
    // Store receipt data for download
    this.currentReceipt = {
        id: receiptId,
        transaction: transaction,
        html: content.innerHTML
    };
    
    openModal('receiptModal');
}

    downloadReceipt(format) {
        if (!this.currentReceipt) return;
        
        const { transaction, id } = this.currentReceipt;
        const date = new Date().toISOString().split('T')[0];
        const filename = `receipt_${transaction.type}_${date}_${id}.${format === 'pdf' ? 'pdf' : 'png'}`;
        
        if (format === 'pdf') {
            this.generatePDF(filename);
        } else {
            this.generateImage(filename);
        }
    }

    generatePDF(filename) {
        const element = document.getElementById('receiptContent').cloneNode(true);
        
        // Add print-specific styles
        element.style.backgroundColor = 'white';
        element.style.color = 'black';
        element.style.padding = '20px';
        
        const opt = {
            margin: 0.5,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, backgroundColor: '#FFFFFF' },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        
        // Use html2pdf library if available
        if (window.html2pdf) {
            html2pdf().set(opt).from(element).save();
        } else {
            // Fallback: try to load the library dynamically
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
            script.onload = () => {
                html2pdf().set(opt).from(element).save();
            };
            document.head.appendChild(script);
        }
    }

    generateImage(filename) {
        const element = document.getElementById('receiptContent');
        
        if (window.html2canvas) {
            html2canvas(element, {
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = filename;
                link.href = canvas.toDataURL('image/png');
                link.click();
            });
        } else {
            // Load html2canvas dynamically
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            script.onload = () => {
                html2canvas(element, {
                    scale: 2,
                    backgroundColor: '#ffffff'
                }).then(canvas => {
                    const link = document.createElement('a');
                    link.download = filename;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                });
            };
            document.head.appendChild(script);
        }
    }

    printReceipt() {
        const content = document.getElementById('receiptContent').innerHTML;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Transaction Receipt</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .receipt { max-width: 500px; margin: 0 auto; background: white; padding: 30px; }
                        .receipt-header { text-align: center; margin-bottom: 20px; }
                        .receipt-id { color: #666; font-size: 0.9rem; margin-top: 5px; }
                        .receipt-status { text-align: center; padding: 10px; margin-bottom: 20px; border-radius: 5px; }
                        .receipt-status.pending { background: #fff3cd; color: #856404; }
                        .receipt-status.approved { background: #d4edda; color: #155724; }
                        .receipt-status.rejected { background: #f8d7da; color: #721c24; }
                        .receipt-details { border-top: 2px dashed #ccc; border-bottom: 2px dashed #ccc; padding: 15px 0; }
                        .receipt-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                        .receipt-footer { text-align: center; margin-top: 20px; color: #666; }
                    </style>
                </head>
                <body>
                    ${content}
                </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        // Wait for content to load then print
        setTimeout(() => {
            printWindow.print();
        }, 500);
    }

    // ========== ANALYTICS ==========
    async loadAnalytics() {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const snapshot = await db.collection('transactions')
                .where('createdAt', '>=', thirtyDaysAgo)
                .get();
            
            let totals = {
                deposits: 0,
                withdrawals: 0,
                fees: 0,
                pending: 0,
                approved: 0,
                rejected: 0
            };
            
            snapshot.forEach(doc => {
                const trans = doc.data();
                if (trans.type === 'deposit' && trans.status === 'approved') {
                    totals.deposits += trans.amount;
                } else if (trans.type === 'withdrawal' && trans.status === 'approved') {
                    totals.withdrawals += trans.amount;
                    if (trans.fee) totals.fees += trans.fee;
                } else if (trans.status === 'pending') {
                    totals.pending++;
                } else if (trans.status === 'approved') {
                    totals.approved++;
                } else if (trans.status === 'rejected') {
                    totals.rejected++;
                }
            });
            
            // Update analytics display
            const depositsEl = document.getElementById('totalDeposits');
            const withdrawalsEl = document.getElementById('totalWithdrawals');
            const feesEl = document.getElementById('totalFees');
            const pendingEl = document.getElementById('pendingCount');
            
            if (depositsEl) depositsEl.textContent = `TZS ${totals.deposits.toFixed(2)}`;
            if (withdrawalsEl) withdrawalsEl.textContent = `TZS ${totals.withdrawals.toFixed(2)}`;
            if (feesEl) feesEl.textContent = `TZS ${totals.fees.toFixed(2)}`;
            if (pendingEl) pendingEl.textContent = totals.pending;
            
            this.renderChart(totals);
            
        } catch (error) {
            console.error("Error loading analytics:", error);
        }
    }

    renderChart(totals) {
        const ctx = document.getElementById('transactionChart')?.getContext('2d');
        if (!ctx) return;
        
        // Destroy existing chart if it exists
        if (this.chart) {
            this.chart.destroy();
        }
        
        // Check if Chart.js is loaded
        if (typeof Chart === 'undefined') {
            // Load Chart.js dynamically
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
            script.onload = () => this.createChart(ctx, totals);
            document.head.appendChild(script);
        } else {
            this.createChart(ctx, totals);
        }
    }

    createChart(ctx, totals) {
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Deposits', 'Withdrawals', 'Fees Collected'],
                datasets: [{
                    label: 'Amount (TZS)',
                    data: [totals.deposits, totals.withdrawals, totals.fees],
                    backgroundColor: ['#2E8B57', '#DC143C', '#FFA62B'],
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'TZS ' + context.raw.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'TZS ' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(255,255,255,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

// ========== ADMIN TRANSACTION HISTORY ==========
// ========== ADMIN TRANSACTION HISTORY ==========
async loadAdminTransactionHistory() {
    const searchTerm = document.getElementById('searchUser')?.value || '';
    const type = document.getElementById('historyType')?.value || 'all';
    const container = document.getElementById('adminTransactionHistory');
    
    if (!container) {
        console.warn('Admin transaction history container not found');
        return;
    }
    
    try {
        showLoading('Loading transaction history...');
        
        // Base query – newest first
        let query = db.collection('transactions')
            .orderBy('createdAt', 'desc')
            .limit(100);
        
        const snapshot = await query.get();
        
        // Start building the table
        let html = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>User</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        let rowCount = 0;
        
        snapshot.forEach(doc => {
            const trans = { id: doc.id, ...doc.data() };
            const date = trans.createdAt?.toDate ? trans.createdAt.toDate() : new Date();
            
            // Apply type filter
            if (type !== 'all' && trans.type !== type) return;
            
            // Apply user search filter (case‑insensitive)
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const userIdMatch = trans.userId?.toLowerCase().includes(term);
                const userEmailMatch = trans.userEmail?.toLowerCase().includes(term);
                if (!userIdMatch && !userEmailMatch) return;
            }
            
            rowCount++;
            
            html += `
                <tr>
                    <td>${date.toLocaleDateString()} ${date.toLocaleTimeString()}</td>
                    <td>${trans.userEmail || trans.userId?.substring(0, 8) + '…' || 'N/A'}</td>
                    <td><span class="badge ${trans.type}">${trans.type || 'unknown'}</span></td>
                    <td>TZS ${(trans.amount || 0).toFixed(2)}</td>
                    <td><span class="badge ${trans.status || 'pending'}">${trans.status || 'pending'}</span></td>
                    <td>
                        <button class="btn-icon" onclick="bankingSystem.showTransactionDetails('${trans.id}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${trans.screenshot ? `
                        <button class="btn-icon" onclick="window.open('${trans.screenshot}')" title="View Screenshot">
                            <i class="fas fa-image"></i>
                        </button>
                        ` : ''}
                    </td>
                </tr>
            `;
        });
        
        if (rowCount === 0) {
            html += `
                <tr>
                    <td colspan="6" class="no-data">No transactions found</td>
                </tr>
            `;
        }
        
        html += '</tbody></table>';
        container.innerHTML = html;
        
        hideLoading();
        
    } catch (error) {
        hideLoading();
        console.error('Error loading admin transaction history:', error);
        
        // Check for Firestore index error
        if (error.code === 'failed-precondition' || error.message?.includes('index')) {
            container.innerHTML = `
                <div class="error-container">
                    <i class="fas fa-database" style="font-size: 3rem; color: var(--accent-color);"></i>
                    <h3 style="margin: 1rem 0; color: white;">Firestore Index Required</h3>
                    <p style="color: var(--gray-color); margin-bottom: 1rem;">
                        To sort transactions by date, a composite index is needed.
                    </p>
                    <a href="https://console.firebase.google.com/v1/r/project/football-canvas-hub/firestore/indexes" 
                       target="_blank" class="btn btn-primary" style="display: inline-block; text-decoration: none;">
                        <i class="fas fa-external-link-alt"></i> Create Index
                    </a>
                </div>
            `;
        } else {
            container.innerHTML = `<div class="error">Error loading transactions: ${error.message}</div>`;
        }
    }
}

    // Helper function to create required indexes
    createRequiredIndex() {
        window.open('https://console.firebase.google.com/v1/r/project/football-canvas-hub/firestore/indexes', '_blank');
    }
}

function renderMatchesGroupedByLeague(matches) {
  const container = document.getElementById('matchesContainer');
  container.innerHTML = ''; // clear old grid

  // Group matches by competition
  const groups = matches.reduce((acc, match) => {
    const league = match.competition;
    if (!acc[league]) acc[league] = [];
    acc[league].push(match);
    return acc;
  }, {});

  // Create HTML for each league group
  let html = '<div class="match-list-container">';
  for (const [league, leagueMatches] of Object.entries(groups)) {
    html += `
      <div class="league-group">
        <div class="league-header">
          <h3><i class="fas fa-trophy"></i> ${league}</h3>
          <span class="match-count">${leagueMatches.length} match${leagueMatches.length > 1 ? 'es' : ''}</span>
        </div>
        <div class="league-matches">
    `;
    leagueMatches.forEach(match => {
      // Generate match row using your template function
      html += generateMatchRow(match); // your existing function that returns the row HTML
    });
    html += '</div></div>';
  }
  html += '</div>';
  container.innerHTML = html;
}

// ========== UI FUNCTIONS ==========
function switchWalletTab(tab) {
    document.querySelectorAll('.wallet-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.wallet-tab-content').forEach(c => c.classList.remove('active'));
    
    event.currentTarget.classList.add('active');
    document.getElementById(tab + 'Section').classList.add('active');
    
    if (tab === 'history' && window.bankingSystem) {
        window.bankingSystem.loadTransactionHistory();
    }
    if (tab === 'withdraw' && window.userBankManager) {
        // Short delay to ensure DOM is ready
        setTimeout(() => {
            window.userBankManager.populateWithdrawDropdown();
        }, 100);
    }
    if (tab === 'Accounts' && window.userBankManager) {
        window.userBankManager.loadAccounts();
    }
    if (tab === 'deposit' && window.bankingSystem) {
        // Refresh bank accounts (admin accounts) and update payment methods
        window.bankingSystem.loadBankAccounts().then(() => {
            window.bankingSystem.updatePaymentMethods();
        });
    }
}

function switchAdminBankingTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
    
    event.currentTarget.classList.add('active');
    document.getElementById(tab + 'Tab').classList.add('active');
    
    if (!window.bankingSystem) return;
    
    if (tab === 'approvals') {
        window.bankingSystem.loadPendingApprovals();
    } else if (tab === 'history') {
        window.bankingSystem.loadAdminTransactionHistory(); // <-- This line
    } else if (tab === 'analytics') {
        window.bankingSystem.loadAnalytics();
    }
}

document.addEventListener('sectionChanged', (e) => {
    if (e.detail.sectionId === 'bankingAdminSection') {
        // Check which tab is active and load accordingly
        const activeTab = document.querySelector('.admin-tab.active');
        if (activeTab) {
            const tab = activeTab.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
            if (tab === 'history') {
                window.bankingSystem.loadAdminTransactionHistory();
            } else if (tab === 'approvals') {
                window.bankingSystem.loadPendingApprovals();
            } else if (tab === 'analytics') {
                window.bankingSystem.loadAnalytics();
            }
        }
    }
});

function selectPaymentMethod(method) {
    if (window.bankingSystem) {
        window.bankingSystem.selectPaymentMethod(method);
    }
}

function goToDepositStep3() {
    if (window.bankingSystem) {
        window.bankingSystem.goToDepositStep3();
    }
}

function submitDepositRequest() {
    if (window.bankingSystem) {
        window.bankingSystem.submitDepositRequest();
    }
}

function submitWithdrawalRequest() {
    if (window.bankingSystem) {
        window.bankingSystem.submitWithdrawalRequest();
    }
}

function calculateWithdrawalDeduction() {
    if (window.bankingSystem) {
        window.bankingSystem.calculateWithdrawalDeduction();
    }
}

function updateBankDetails() {
    if (window.bankingSystem) {
        window.bankingSystem.updateBankDetails();
    }
}

function downloadReceipt(format) {
    if (window.bankingSystem) {
        window.bankingSystem.downloadReceipt(format);
    }
}

function printReceipt() {
    if (window.bankingSystem) {
        window.bankingSystem.printReceipt();
    }
}

// Initialize banking system after auth is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait for auth to be ready
    const checkAuth = setInterval(() => {
        if (window.authManager && window.authManager.user) {
            clearInterval(checkAuth);
            window.bankingSystem = new BankingSystem();
        }
    }, 500);
});

// Add these CSS styles for the new elements
const additionalStyles = `
    .screenshot-preview {
        margin: 10px 0;
        text-align: center;
    }
    
    .screenshot-preview img {
        max-width: 200px;
        max-height: 150px;
        border-radius: 5px;
        cursor: pointer;
        border: 2px solid var(--accent-color);
    }
    
    .error-container {
        text-align: center;
        padding: 40px;
        background: var(--secondary-color);
        border-radius: 10px;
    }
    
    .error-container i {
        font-size: 3rem;
        color: var(--accent-color);
        margin-bottom: 15px;
    }
    
    .error-container h3 {
        color: white;
        margin-bottom: 10px;
    }
    
    .error-container p {
        color: var(--gray-color);
        margin-bottom: 20px;
    }
    
    .no-data {
        text-align: center;
        padding: 40px;
        color: var(--gray-color);
        font-size: 1.1rem;
    }
    
    .badge.deposit, .badge.withdrawal, .badge.pending, .badge.approved, .badge.rejected {
        display: inline-block;
        padding: 3px 8px;
        border-radius: 3px;
        font-size: 0.8rem;
        font-weight: bold;
    }
`;

// Add the styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// ========== WITHDRAWAL FUNCTIONS ==========

// Calculate withdrawal deduction (15% fee)
function calculateWithdrawalDeduction() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value) || 0;
    const fee = amount * 0.15; // 15% fee
    const netAmount = amount - fee;
    
    document.getElementById('calcWithdrawAmount').textContent = `TZS ${amount.toFixed(2)}`;
    document.getElementById('calcFee').textContent = `TZS ${fee.toFixed(2)}`;
    document.getElementById('calcNetAmount').textContent = `TZS ${netAmount.toFixed(2)}`;
}

// Update bank details when selecting from dropdown
function updateBankDetails() {
    const select = document.getElementById('withdrawBank');
    const selectedOption = select.options[select.selectedIndex];
    
    if (selectedOption && selectedOption.value) {
        const accountName = selectedOption.getAttribute('data-name');
        const accountNumber = selectedOption.getAttribute('data-number');
        
        document.getElementById('withdrawAccountName').value = accountName || '';
        document.getElementById('withdrawAccountNumber').value = accountNumber || '';
    } else {
        document.getElementById('withdrawAccountName').value = '';
        document.getElementById('withdrawAccountNumber').value = '';
    }
}

// Submit withdrawal request
async function submitWithdrawalRequest() {
    const userData = window.authManager?.userData;
    if (!userData) {
        showNotification('Please login first', 'error');
        return;
    }
    
    // Get form values
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const bankId = document.getElementById('withdrawBank').value;
    const accountName = document.getElementById('withdrawAccountName').value.trim();
    const accountNumber = document.getElementById('withdrawAccountNumber').value.trim();
    const mobile = document.getElementById('withdrawMobile').value.trim();
    
    // Validate inputs
    if (!amount || amount < 5000) {
        showNotification('Minimum withdrawal amount is TZS 5,000', 'error');
        return;
    }
    
    if (amount > userData.balance) {
        showNotification('Insufficient balance', 'error');
        return;
    }
    
    if (!bankId) {
        showNotification('Please select an account', 'error');
        return;
    }
    
    if (!accountName || !accountNumber || !mobile) {
        showNotification('Please fill all fields', 'error');
        return;
    }
    
    // Calculate fees
    const fee = amount * 0.15;
    const netAmount = amount - fee;
    
    try {
        showLoading('Processing withdrawal request...');
        
        // Get provider from selected option (no extra query)
        const select = document.getElementById('withdrawBank');
        const selectedOption = select.options[select.selectedIndex];
        const provider = selectedOption.getAttribute('data-provider') || 'Unknown';
        
        // Determine account type based on provider (for record)
        const mobileProviders = ['vodacom', 'airtel', 'lipa', 'halotel', 'yas', 'pesa'];
        const accountType = mobileProviders.includes(provider) ? 'mobile' : 'bank';
        
        // Create withdrawal request data
        const withdrawalData = {
            userId: userData.uid,
            userEmail: userData.email,
            userName: userData.fullName || userData.username,
            amount: amount,
            fee: fee,
            netAmount: netAmount,
            bankId: bankId, // Reference to user's account document
            bankName: accountName,
            bankProvider: provider,
            bankType: accountType,
            accountName: accountName,
            accountNumber: accountNumber,
            mobile: mobile,
            status: 'pending',
            type: 'withdrawal',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Use transaction to ensure data consistency
        await db.runTransaction(async (transaction) => {
            // Verify user still has sufficient balance
            const userRef = db.collection('users').doc(userData.uid);
            const userDoc = await transaction.get(userRef);
            
            if (!userDoc.exists) {
                throw new Error('User not found');
            }
            
            const currentBalance = userDoc.data().balance || 0;
            if (currentBalance < amount) {
                throw new Error('Insufficient balance');
            }
            
            // Deduct amount immediately
            transaction.update(userRef, {
                balance: firebase.firestore.FieldValue.increment(-amount),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Save withdrawal request
            const transRef = db.collection('transactions').doc();
            transaction.set(transRef, withdrawalData);
        });
        
        // Update local balance
        if (window.authManager.userData) {
            window.authManager.userData.balance -= amount;
        }
        
        // Clear form
        document.getElementById('withdrawAmount').value = '';
        document.getElementById('withdrawBank').value = '';
        document.getElementById('withdrawAccountName').value = '';
        document.getElementById('withdrawAccountNumber').value = '';
        document.getElementById('withdrawMobile').value = '';
        
        // Reset calculator displays
        document.getElementById('calcWithdrawAmount').textContent = 'TZS 0';
        document.getElementById('calcFee').textContent = 'TZS 0';
        document.getElementById('calcNetAmount').textContent = 'TZS 0';
        
        // Update balance display
        if (window.bankingSystem) {
            window.bankingSystem.updateBalanceDisplay();
        }
        
        hideLoading();
        showNotification('Withdrawal request submitted for approval!', 'success');
        
        // Show receipt
        if (window.bankingSystem) {
            window.bankingSystem.showReceipt({
                ...withdrawalData,
                type: 'withdrawal',
                status: 'pending'
            });
        }
        
    } catch (error) {
        hideLoading();
        console.error("Error submitting withdrawal:", error);
        showNotification('Error: ' + error.message, 'error');
    }
}

function formatProviderName(provider) {
    const names = {
        'vodacom': 'Vodacom M-PESA',
        'airtel': 'Airtel Money',
        'lipa': 'Lipa kwa Simu',
        'halotel': 'Halopesa',
        'yas': 'YAS Mixx',
        'pesa': 'T-PESA',
        'crdb': 'CRDB Bank',
        'nmb': 'NMB Bank',
        'kcb': 'KCB Bank',
        'dtb': 'DTB Bank',
        'exim': 'Exim Bank',
        'barclays': 'Barclays Bank'
    };
    return names[provider] || provider.toUpperCase();
}

// Update your existing section change handler or add this
document.addEventListener('sectionChanged', function(e) {
    if (e.detail.sectionId === 'walletSection') {
        // Load bank accounts for withdrawal dropdown
        loadWithdrawalBankAccounts();
        
        // Update balance display
        if (window.bankingSystem) {
            window.bankingSystem.updateBalanceDisplay();
        }
    }
});

class UserAccountManager {
    constructor() {
        this.accounts = [];
        this.init();
    }

    async init() {
        await this.loadAccounts();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Listen for section changes
        document.addEventListener('sectionChanged', (e) => {
            if (e.detail.sectionId === 'userAccountsSection') {
                this.loadAccounts();
            }
            if (e.detail.sectionId === 'walletSection') {
                this.populateWithdrawalDropdown();
            }
        });

        // Account type change to toggle provider groups
        const typeSelect = document.getElementById('userAccountType');
        if (typeSelect) {
            typeSelect.addEventListener('change', () => this.toggleProviderGroups());
        }

        // Form submission
        const form = document.getElementById('userAddAccountForm');
        if (form) {
            form.addEventListener('submit', (e) => this.saveAccount(e));
        }
    }

    toggleProviderGroups() {
        const type = document.getElementById('userAccountType').value;
        const mobileGroup = document.getElementById('mobileProviderGroup');
        const bankGroup = document.getElementById('bankProviderGroup');
        const mobileSelect = document.getElementById('userMobileProvider');
        const bankSelect = document.getElementById('userBankProvider');
        
        // Hide both groups initially
        mobileGroup.style.display = 'none';
        bankGroup.style.display = 'none';
        mobileSelect.required = false;
        bankSelect.required = false;
        
        if (type === 'mobile') {
            mobileGroup.style.display = 'block';
            mobileSelect.required = true;
        } else if (type === 'bank') {
            bankGroup.style.display = 'block';
            bankSelect.required = true;
        }
    }

async loadAccounts() {
    const user = window.authManager?.user;
    if (!user) {
        console.warn("No user logged in");
        this.accounts = [];
        return false;
    }
    
    console.log("Loading accounts for user:", user.uid);
    
    const container = document.getElementById('userAccountsContainer');
    if (container) {
        container.innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i> Loading accounts...</div>';
    }
    
    try {
        // First try to get accounts
        const snapshot = await db.collection('userBankAccounts')
            .where('userId', '==', user.uid)
            .get();
        
        console.log(`Found ${snapshot.size} accounts`);
        
        this.accounts = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            console.log("Account data:", data);
            this.accounts.push({ id: doc.id, ...data });
        });
        
        // Sort in memory: default first, then by date
        this.accounts.sort((a, b) => {
            if (a.isDefault && !b.isDefault) return -1;
            if (!a.isDefault && b.isDefault) return 1;
            const aTime = a.createdAt?.toDate?.() || new Date(0);
            const bTime = b.createdAt?.toDate?.() || new Date(0);
            return bTime - aTime;
        });
        
        this.displayAccounts();
        return true;
    } catch (error) {
        console.error("Error loading accounts:", error);
        this.accounts = [];
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error loading accounts: ${error.message}</p>
                    <button class="btn btn-secondary" onclick="userAccountManager.loadAccounts()">
                        <i class="fas fa-sync-alt"></i> Retry
                    </button>
                </div>
            `;
        }
        return false;
    }
}

async populateWithdrawalDropdown() {
    const select = document.getElementById('withdrawBank');
    if (!select) return;
    
    const user = window.authManager?.user;
    if (!user) {
        select.innerHTML = '<option value="">Please login</option>';
        return;
    }
    
    console.log("Populating withdrawal dropdown for user:", user.uid);
    
    // Reload accounts to ensure fresh data
    await this.loadAccounts();
    
    select.innerHTML = '<option value="">Select Your Account</option>';
    
    if (this.accounts.length === 0) {
        select.innerHTML += '<option value="" disabled>No accounts. Please add one in Accounts section.</option>';
        return;
    }
    
    let hasDefault = false;
    this.accounts.forEach(account => {
        const option = document.createElement('option');
        option.value = account.id;
        option.setAttribute('data-name', account.accountName);
        option.setAttribute('data-number', account.accountNumber);
        option.setAttribute('data-provider', account.provider);
        
        const providerDisplay = this.formatProvider(account.provider);
        option.textContent = `${account.accountName} (${providerDisplay}) - ${account.accountNumber}${account.isDefault ? ' (Default)' : ''}`;
        
        if (account.isDefault) {
            option.selected = true;
            hasDefault = true;
        }
        select.appendChild(option);
    });
    
    console.log(`Populated dropdown with ${this.accounts.length} accounts, default: ${hasDefault}`);
    
    // Auto-fill if default exists
    if (hasDefault && typeof updateWithdrawAccountDetails === 'function') {
        updateWithdrawAccountDetails();
    }
}

    displayAccounts() {
        const container = document.getElementById('userAccountsContainer');
        if (!container) return;

        if (this.accounts.length === 0) {
            container.innerHTML = `
                <div class="no-accounts">
                    <i class="fas fa-university"></i>
                    <p>You haven't added any withdrawal accounts yet.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.accounts.map(account => `
            <div class="account-item ${account.isDefault ? 'default' : ''}" data-id="${account.id}">
                <div class="account-icon">
                    <i class="fas ${account.type === 'mobile' ? 'fa-mobile-alt' : 'fa-university'}"></i>
                </div>
                <div class="account-details">
                    <div class="account-name">${account.accountName}</div>
                    <div class="account-number">${account.accountNumber}</div>
                    <div class="account-provider">${this.formatProvider(account.provider)}</div>
                </div>
                <div class="account-badge">
                    ${account.isDefault ? '<span class="default-badge">Default</span>' : ''}
                </div>
                <div class="account-actions">
                    <button class="btn-icon" onclick="userAccountManager.setDefault('${account.id}')" title="Set as default">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="btn-icon" onclick="userAccountManager.deleteAccount('${account.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    formatProvider(provider) {
        const providers = {
            'vodacom': 'Vodacom M-PESA',
            'airtel': 'Airtel Money',
            'lipa': 'Lipa kwa Simu',
            'halotel': 'Halopesa',
            'yas': 'YAS Mixx',
            'pesa': 'T-PESA',
            'crdb': 'CRDB Bank',
            'nmb': 'NMB Bank',
            'kcb': 'KCB Bank',
            'dtb': 'DTB Bank',
            'exim': 'Exim Bank',
            'barclays': 'Barclays Bank'
        };
        return providers[provider] || provider;
    }

async saveAccount(e) {
    e.preventDefault();
    
    const user = window.authManager?.user;
    if (!user) {
        showNotification('Please login first', 'error');
        return;
    }
    
    const type = document.getElementById('userAccountType').value;
    let provider;
    
    if (type === 'mobile') {
        provider = document.getElementById('userMobileProvider').value;
    } else if (type === 'bank') {
        provider = document.getElementById('userBankProvider').value;
    } else {
        showNotification('Please select account type', 'error');
        return;
    }
    
    const accountName = document.getElementById('userAccountName').value.trim();
    const accountNumber = document.getElementById('userAccountNumber').value.trim();
    const isDefault = document.getElementById('userAccountDefault').checked;
    
    if (!provider) {
        showNotification('Please select a provider', 'error');
        return;
    }
    if (!accountName || !accountNumber) {
        showNotification('Please fill all fields', 'error');
        return;
    }
    
    try {
        showLoading('Saving account...');
        
        // If setting as default, remove default from others
        if (isDefault) {
            const batch = db.batch();
            const defaultQuery = await db.collection('userBankAccounts')
                .where('userId', '==', user.uid)
                .where('isDefault', '==', true)
                .get();
            
            defaultQuery.forEach(doc => {
                batch.update(doc.ref, { isDefault: false });
            });
            
            // Add new account
            const newAccountRef = db.collection('userBankAccounts').doc();
            batch.set(newAccountRef, {
                userId: user.uid,
                type,
                provider,
                accountName,
                accountNumber,
                isDefault: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            await batch.commit();
        } else {
            // Just add new account
            await db.collection('userBankAccounts').add({
                userId: user.uid,
                type,
                provider,
                accountName,
                accountNumber,
                isDefault: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        // Reset form
        document.getElementById('userAddAccountForm').reset();
        document.getElementById('mobileProviderGroup').style.display = 'none';
        document.getElementById('bankProviderGroup').style.display = 'none';
        
        hideLoading();
        showNotification('Account added successfully!', 'success');
        
        // Reload accounts
        await this.loadAccounts();
        await this.populateWithdrawalDropdown();
        
    } catch (error) {
        hideLoading();
        console.error("Error saving account:", error);
        showNotification('Error saving account: ' + error.message, 'error');
    }
}

    async setDefault(accountId) {
        const user = window.authManager?.user;
        if (!user) return;

        try {
            showLoading('Setting as default...');
            
            const batch = db.batch();
            
            // Remove default from all user accounts
            const defaultQuery = await db.collection('userBankAccounts')
                .where('userId', '==', user.uid)
                .where('isDefault', '==', true)
                .get();
            
            defaultQuery.forEach(doc => {
                batch.update(doc.ref, { isDefault: false });
            });
            
            // Set new default
            const accountRef = db.collection('userBankAccounts').doc(accountId);
            batch.update(accountRef, { isDefault: true });
            
            await batch.commit();
            
            hideLoading();
            showNotification('Default account updated', 'success');
            
            await this.loadAccounts();
            
        } catch (error) {
            hideLoading();
            console.error("Error setting default:", error);
            showNotification('Error updating default', 'error');
        }
    }

    async deleteAccount(accountId) {
        if (!confirm('Are you sure you want to delete this account?')) return;

        try {
            showLoading('Deleting account...');
            
            await db.collection('userBankAccounts').doc(accountId).delete();
            
            hideLoading();
            showNotification('Account deleted', 'success');
            
            await this.loadAccounts();
            
        } catch (error) {
            hideLoading();
            console.error("Error deleting account:", error);
            showNotification('Error deleting account', 'error');
        }
    }

    // Populate withdrawal dropdown with user's accounts
}

function updateWithdrawAccountDetails() {
    const select = document.getElementById('withdrawBank');
    const selectedOption = select.options[select.selectedIndex];
    
    if (selectedOption && selectedOption.value) {
        const accountName = selectedOption.getAttribute('data-name');
        const accountNumber = selectedOption.getAttribute('data-number');
        
        document.getElementById('withdrawAccountName').value = accountName || '';
        document.getElementById('withdrawAccountNumber').value = accountNumber || '';
    } else {
        document.getElementById('withdrawAccountName').value = '';
        document.getElementById('withdrawAccountNumber').value = '';
    }
}

// ========== GLOBAL BALANCE UPDATE ==========
function updateUserBalanceDisplay() {
    const userData = window.authManager?.userData;
    if (!userData) return;
    
    const balance = userData.balance || 0;
    const balanceFormatted = `TZS ${balance.toFixed(2)}`;
    
    // Update all balance display elements
    const elements = [
        'userBalance', // Top nav
        'walletBalance', // Wallet header
        'withdrawCurrentBalance' // Withdrawal section
    ];
    
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = balanceFormatted;
    });
    
    // Update any modal balance if present
    const modalBalance = document.getElementById('modalBalance');
    if (modalBalance) modalBalance.textContent = balanceFormatted;
    
    console.log("Balance updated:", balanceFormatted);
}

// ==================== USER WITHDRAWAL ACCOUNTS MANAGER ====================
// Uses collection: 'userBankAccounts' - for user's own withdrawal accounts
class UserBankManager {
    constructor() {
        this.accounts = [];
        this.init();
    }

    async init() {
        await this.loadAccounts();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Account type change to toggle provider groups
        const typeSelect = document.getElementById('userAccountType');
        if (typeSelect) {
            typeSelect.addEventListener('change', () => this.toggleProviderGroups());
        }

        // Form submission
        const form = document.getElementById('userAddAccountForm');
        if (form) {
            form.addEventListener('submit', (e) => this.saveAccount(e));
        }

        // Listen for section changes
        document.addEventListener('sectionChanged', (e) => {
            if (e.detail.sectionId === 'AccountsSection') {
                this.loadAccounts();
            }
            if (e.detail.sectionId === 'withdrawSection') {
                this.populateWithdrawDropdown();
            }
        });
    }

    toggleProviderGroups() {
        const type = document.getElementById('userAccountType').value;
        const mobileGroup = document.getElementById('mobileProviderGroup');
        const bankGroup = document.getElementById('bankProviderGroup');
        const mobileSelect = document.getElementById('userMobileProvider');
        const bankSelect = document.getElementById('userBankProvider');

        mobileGroup.style.display = 'none';
        bankGroup.style.display = 'none';
        mobileSelect.required = false;
        bankSelect.required = false;

        if (type === 'mobile') {
            mobileGroup.style.display = 'block';
            mobileSelect.required = true;
        } else if (type === 'bank') {
            bankGroup.style.display = 'block';
            bankSelect.required = true;
        }
    }

    async loadAccounts() {
        const user = window.authManager?.user;
        if (!user) {
            this.accounts = [];
            return false;
        }

        const container = document.getElementById('userAccountsContainer');
        if (container) {
            container.innerHTML = '<div class="loading-state"><i class="fas fa-spinner fa-spin"></i> Loading accounts...</div>';
        }

        try {
            const snapshot = await db.collection('userBankAccounts')
                .where('userId', '==', user.uid)
                .get();

            this.accounts = [];
            snapshot.forEach(doc => {
                this.accounts.push({ id: doc.id, ...doc.data() });
            });

            // Sort: default first, then by date
            this.accounts.sort((a, b) => {
                if (a.isDefault && !b.isDefault) return -1;
                if (!a.isDefault && b.isDefault) return 1;
                const aTime = a.createdAt?.toDate?.() || new Date(0);
                const bTime = b.createdAt?.toDate?.() || new Date(0);
                return bTime - aTime;
            });

            this.displayAccounts();
            return true;
        } catch (error) {
            console.error("Error loading user accounts:", error);
            this.accounts = [];
            if (container) {
                container.innerHTML = `
                    <div class="error-state">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Error loading accounts: ${error.message}</p>
                        <button class="btn btn-secondary" onclick="window.userBankManager.loadAccounts()">
                            <i class="fas fa-sync-alt"></i> Retry
                        </button>
                    </div>
                `;
            }
            return false;
        }
    }

    displayAccounts() {
        const container = document.getElementById('userAccountsContainer');
        if (!container) return;

        if (this.accounts.length === 0) {
            container.innerHTML = `
                <div class="no-accounts">
                    <i class="fas fa-university"></i>
                    <p>You haven't added any withdrawal accounts yet.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.accounts.map(account => `
            <div class="account-item ${account.isDefault ? 'default' : ''}" data-id="${account.id}">
                <div class="account-icon">
                    <i class="fas ${account.type === 'mobile' ? 'fa-mobile-alt' : 'fa-university'}"></i>
                </div>
                <div class="account-details">
                    <div class="account-name">${account.accountName}</div>
                    <div class="account-number">${account.accountNumber}</div>
                    <div class="account-provider">${this.formatProvider(account.provider)}</div>
                </div>
                <div class="account-badge">
                    ${account.isDefault ? '<span class="default-badge">Default</span>' : ''}
                </div>
                <div class="account-actions">
                    <button class="btn-icon" onclick="window.userBankManager.setDefault('${account.id}')" title="Set as default">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="btn-icon" onclick="window.userBankManager.deleteAccount('${account.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    formatProvider(provider) {
        const providers = {
            'vodacom': 'Vodacom M-PESA',
            'airtel': 'Airtel Money',
            'lipa': 'Lipa kwa Simu',
            'halotel': 'Halopesa',
            'yas': 'YAS Mixx',
            'pesa': 'T-PESA',
            'crdb': 'CRDB Bank',
            'nmb': 'NMB Bank',
            'kcb': 'KCB Bank',
            'dtb': 'DTB Bank',
            'exim': 'Exim Bank',
            'barclays': 'Barclays Bank'
        };
        return providers[provider] || provider;
    }

    async saveAccount(e) {
        e.preventDefault();

        const user = window.authManager?.user;
        if (!user) {
            showNotification('Please login first', 'error');
            return;
        }

        const type = document.getElementById('userAccountType').value;
        let provider;

        if (type === 'mobile') {
            provider = document.getElementById('userMobileProvider').value;
        } else if (type === 'bank') {
            provider = document.getElementById('userBankProvider').value;
        } else {
            showNotification('Please select account type', 'error');
            return;
        }

        const accountName = document.getElementById('userAccountName').value.trim();
        const accountNumber = document.getElementById('userAccountNumber').value.trim();
        const isDefault = document.getElementById('userAccountDefault').checked;

        if (!provider) {
            showNotification('Please select a provider', 'error');
            return;
        }
        if (!accountName || !accountNumber) {
            showNotification('Please fill all fields', 'error');
            return;
        }

        try {
            showLoading('Saving account...');

            if (isDefault) {
                const batch = db.batch();
                const defaultQuery = await db.collection('userBankAccounts')
                    .where('userId', '==', user.uid)
                    .where('isDefault', '==', true)
                    .get();

                defaultQuery.forEach(doc => {
                    batch.update(doc.ref, { isDefault: false });
                });

                const newAccountRef = db.collection('userBankAccounts').doc();
                batch.set(newAccountRef, {
                    userId: user.uid,
                    type,
                    provider,
                    accountName,
                    accountNumber,
                    isDefault: true,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                await batch.commit();
            } else {
                await db.collection('userBankAccounts').add({
                    userId: user.uid,
                    type,
                    provider,
                    accountName,
                    accountNumber,
                    isDefault: false,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            // Reset form
            document.getElementById('userAddAccountForm').reset();
            document.getElementById('mobileProviderGroup').style.display = 'none';
            document.getElementById('bankProviderGroup').style.display = 'none';

            hideLoading();
            showNotification('Account added successfully!', 'success');

            await this.loadAccounts();
            await this.populateWithdrawDropdown();

        } catch (error) {
            hideLoading();
            console.error("Error saving account:", error);
            showNotification('Error saving account: ' + error.message, 'error');
        }
    }

    async setDefault(accountId) {
        const user = window.authManager?.user;
        if (!user) return;

        try {
            showLoading('Setting as default...');

            const batch = db.batch();
            const defaultQuery = await db.collection('userBankAccounts')
                .where('userId', '==', user.uid)
                .where('isDefault', '==', true)
                .get();

            defaultQuery.forEach(doc => {
                batch.update(doc.ref, { isDefault: false });
            });

            const accountRef = db.collection('userBankAccounts').doc(accountId);
            batch.update(accountRef, { isDefault: true });

            await batch.commit();

            hideLoading();
            showNotification('Default account updated', 'success');

            await this.loadAccounts();
            await this.populateWithdrawDropdown();

        } catch (error) {
            hideLoading();
            console.error("Error setting default:", error);
            showNotification('Error updating default', 'error');
        }
    }

    async deleteAccount(accountId) {
        if (!confirm('Are you sure you want to delete this account?')) return;

        try {
            showLoading('Deleting account...');
            await db.collection('userBankAccounts').doc(accountId).delete();
            hideLoading();
            showNotification('Account deleted', 'success');
            await this.loadAccounts();
            await this.populateWithdrawDropdown();
        } catch (error) {
            hideLoading();
            console.error("Error deleting account:", error);
            showNotification('Error deleting account', 'error');
        }
    }

    async populateWithdrawDropdown() {
        const select = document.getElementById('withdrawBank');
        if (!select) return;

        const user = window.authManager?.user;
        if (!user) {
            select.innerHTML = '<option value="">Please login</option>';
            return;
        }

        // Ensure accounts are loaded
        if (this.accounts.length === 0) {
            await this.loadAccounts();
        }

        select.innerHTML = '<option value="">Select Your Account</option>';

        if (this.accounts.length === 0) {
            select.innerHTML += '<option value="" disabled>No accounts. Please add one in Accounts section.</option>';
            return;
        }

        let hasDefault = false;
        this.accounts.forEach(account => {
            const option = document.createElement('option');
            option.value = account.id;
            option.setAttribute('data-name', account.accountName);
            option.setAttribute('data-number', account.accountNumber);
            option.setAttribute('data-provider', account.provider);

            const providerDisplay = this.formatProvider(account.provider);
            option.textContent = `${account.accountName} (${providerDisplay}) - ${account.accountNumber}${account.isDefault ? ' (Default)' : ''}`;

            if (account.isDefault) {
                option.selected = true;
                hasDefault = true;
            }
            select.appendChild(option);
        });

        if (hasDefault && typeof window.updateWithdrawAccountDetails === 'function') {
            window.updateWithdrawAccountDetails();
        }
    }
}

// ==================== ADMIN BANK ACCOUNTS MANAGER ====================
// Uses collection: 'bankAccounts' - for admin deposit instructions
class AdminBankManager {
    constructor() {
        this.accounts = [];
        this.init();
    }

    async init() {
        await this.loadAccounts();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const typeSelect = document.getElementById('accountType');
        if (typeSelect) {
            typeSelect.addEventListener('change', () => this.onTypeChange());
        }

        const form = document.getElementById('addAccountForm');
        if (form) {
            form.addEventListener('submit', (e) => this.saveAccount(e));
        }

        document.addEventListener('sectionChanged', (e) => {
            if (e.detail.sectionId === 'adminBankingSettings') {
                this.loadAccounts();
            }
        });
    }

    async loadAccounts() {
        try {
            const snapshot = await db.collection('bankAccounts')
                .orderBy('createdAt', 'desc')
                .get();

            this.accounts = [];
            snapshot.forEach(doc => {
                this.accounts.push({ id: doc.id, ...doc.data() });
            });

            this.displayAccounts();
            this.updateStats();
        } catch (error) {
            console.error("Error loading admin accounts:", error);
        }
    }

    displayAccounts() {
        const mobileList = document.getElementById('mobileAccountsList');
        const bankList = document.getElementById('bankAccountsList');

        const mobileAccounts = this.accounts.filter(a => a.type === 'mobile');
        const bankAccounts = this.accounts.filter(a => a.type === 'bank');

        if (mobileList) {
            if (mobileAccounts.length === 0) {
                mobileList.innerHTML = '<div class="empty-state">No mobile money accounts added</div>';
            } else {
                mobileList.innerHTML = mobileAccounts.map(acc => this.createCard(acc)).join('');
            }
        }

        if (bankList) {
            if (bankAccounts.length === 0) {
                bankList.innerHTML = '<div class="empty-state">No bank accounts added</div>';
            } else {
                bankList.innerHTML = bankAccounts.map(acc => this.createCard(acc)).join('');
            }
        }
    }

    createCard(account) {
        const isActive = account.active !== false;
        const statusIcon = isActive ? 'fa-check-circle' : 'fa-times-circle';
        const statusColor = isActive ? 'var(--success-color)' : 'var(--danger-color)';
        const statusClass = isActive ? 'active' : 'inactive';

        return `
            <div class="admin-account-card ${statusClass}" data-id="${account.id}">
                <div class="admin-card-header">
                    <div class="admin-type-badge ${account.type}">
                        <i class="fas ${account.type === 'mobile' ? 'fa-mobile-alt' : 'fa-university'}"></i>
                        ${account.type === 'mobile' ? 'Mobile Money' : 'Bank Account'}
                    </div>
                    <div class="admin-status" style="color: ${statusColor}">
                        <i class="fas ${statusIcon}"></i>
                        ${isActive ? 'Active' : 'Inactive'}
                    </div>
                </div>
                <div class="admin-card-body">
                    <div class="admin-provider">
                        <img src="${this.getLogo(account.provider)}" onerror="this.src='https://via.placeholder.com/40'">
                        <span>${this.formatName(account.provider)}</span>
                    </div>
                    <div class="admin-detail">
                        <strong>Account:</strong> ${account.accountName}<br>
                        <strong>Number:</strong> ${account.accountNumber}
                    </div>
                    ${account.instructions ? `<div class="admin-instructions">${account.instructions}</div>` : ''}
                </div>
                <div class="admin-card-footer">
                    <button class="btn-icon" onclick="window.adminBankManager.edit('${account.id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon" onclick="window.adminBankManager.toggle('${account.id}')"><i class="fas ${isActive ? 'fa-eye-slash' : 'fa-eye'}"></i></button>
                    <button class="btn-icon delete" onclick="window.adminBankManager.delete('${account.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    }

    getLogo(provider) {
        const logos = {
            vodacom: 'https://trendsnafrica.com/wp-content/uploads/2024/08/M-Pesa-600x300.jpg',
            airtel: 'https://logo.clearbit.com/airtel.co.tz',
            lipa: 'https://logo.clearbit.com/lipa.co.tz',
            halotel: 'https://logo.clearbit.com/halotel.co.tz',
            yas: 'https://logo.clearbit.com/yas.co.tz',
            pesa: 'https://logo.clearbit.com/pesa.co.tz',
            crdb: 'https://logo.clearbit.com/crdbbank.co.tz',
            nmb: 'https://logo.clearbit.com/nmbbank.co.tz',
            kcb: 'https://logo.clearbit.com/kcbgroup.com',
            dtb: 'https://logo.clearbit.com/dtbbank.com',
            exim: 'https://logo.clearbit.com/eximbank.com',
            barclays: 'https://logo.clearbit.com/barclays.co.tz'
        };
        return logos[provider] || `https://via.placeholder.com/40?text=${provider[0]}`;
    }

    formatName(provider) {
        const names = {
            vodacom: 'Vodacom M-PESA',
            airtel: 'Airtel Money',
            lipa: 'Lipa kwa Simu',
            halotel: 'Halopesa',
            yas: 'YAS Mixx',
            pesa: 'T-PESA',
            crdb: 'CRDB Bank',
            nmb: 'NMB Bank',
            kcb: 'KCB Bank',
            dtb: 'DTB Bank',
            exim: 'Exim Bank',
            barclays: 'Barclays Bank'
        };
        return names[provider] || provider.toUpperCase();
    }

    onTypeChange() {
        const type = document.getElementById('accountType').value;
        const providerSelect = document.getElementById('accountProvider');
        let options = '<option value="">Select Provider</option>';
        if (type === 'mobile') {
            options += `
                <option value="vodacom">Vodacom M-PESA</option>
                <option value="airtel">Airtel Money</option>
                <option value="lipa">Lipa kwa Simu</option>
                <option value="halotel">Halopesa</option>
                <option value="yas">YAS Mixx</option>
                <option value="pesa">T-PESA</option>
            `;
        } else if (type === 'bank') {
            options += `
                <option value="crdb">CRDB Bank</option>
                <option value="nmb">NMB Bank</option>
                <option value="kcb">KCB Bank</option>
                <option value="dtb">DTB Bank</option>
                <option value="exim">Exim Bank</option>
                <option value="barclays">Barclays Bank</option>
            `;
        }
        providerSelect.innerHTML = options;
    }

    async saveAccount(e) {
        e.preventDefault();
        const accountId = document.getElementById('accountId')?.value;
        const isEdit = !!accountId;

        const data = {
            type: document.getElementById('accountType').value,
            accountName: document.getElementById('accountName').value,
            accountNumber: document.getElementById('accountNumber').value,
            provider: document.getElementById('accountProvider').value,
            instructions: document.getElementById('accountInstructions').value,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        if (!data.type || !data.accountName || !data.accountNumber || !data.provider) {
            showNotification('Please fill all fields', 'error');
            return;
        }

        try {
            showLoading(isEdit ? 'Updating...' : 'Adding...');
            if (isEdit) {
                await db.collection('bankAccounts').doc(accountId).update(data);
                showNotification('Account updated', 'success');
            } else {
                data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                data.active = true;
                await db.collection('bankAccounts').add(data);
                showNotification('Account added', 'success');
            }
            document.getElementById('addAccountForm').reset();
            document.getElementById('accountId').value = '';
            hideLoading();
            await this.loadAccounts();
        } catch (error) {
            hideLoading();
            console.error('Error saving account:', error);
            showNotification('Error: ' + error.message, 'error');
        }
    }

    async edit(accountId) {
        const acc = this.accounts.find(a => a.id === accountId);
        if (!acc) return;
        document.getElementById('accountType').value = acc.type;
        this.onTypeChange();
        document.getElementById('accountName').value = acc.accountName;
        document.getElementById('accountNumber').value = acc.accountNumber;
        document.getElementById('accountProvider').value = acc.provider;
        document.getElementById('accountInstructions').value = acc.instructions || '';
        document.getElementById('accountId').value = acc.id;
    }

    async toggle(accountId) {
        const acc = this.accounts.find(a => a.id === accountId);
        if (!acc) return;
        const newStatus = !acc.active;
        try {
            await db.collection('bankAccounts').doc(accountId).update({ active: newStatus });
            showNotification(`Account ${newStatus ? 'enabled' : 'disabled'}`, 'success');
            await this.loadAccounts();
        } catch (error) {
            console.error('Error toggling status:', error);
            showNotification('Error updating status', 'error');
        }
    }

async delete(accountId) {
    if (!confirm('Delete this account?')) return;
    try {
        await db.collection('bankAccounts').doc(accountId).delete();
        showNotification('Account deleted', 'success');
        await this.loadAccounts();
        // Refresh banking system if it exists
        if (window.bankingSystem) {
            window.bankingSystem.loadBankAccounts();
        }
    } catch (error) {
        console.error('Error deleting:', error);
        showNotification('Error deleting account', 'error');
    }
}

    updateStats() {
        const total = this.accounts.length;
        const active = this.accounts.filter(a => a.active !== false).length;
        const mobileCount = this.accounts.filter(a => a.type === 'mobile').length;
        const bankCount = this.accounts.filter(a => a.type === 'bank').length;
        document.getElementById('totalAccountsCount').textContent = total;
        document.getElementById('activeAccountsCount').textContent = active;
        document.getElementById('mobileCount').textContent = mobileCount;
        document.getElementById('bankCount').textContent = bankCount;
    }
}

// ==================== WITHDRAWAL HELPER FUNCTIONS ====================
window.calculateWithdrawalDeduction = function() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value) || 0;
    const fee = amount * 0.15;
    const net = amount - fee;
    document.getElementById('calcWithdrawAmount').textContent = `TZS ${amount.toFixed(2)}`;
    document.getElementById('calcFee').textContent = `TZS ${fee.toFixed(2)}`;
    document.getElementById('calcNetAmount').textContent = `TZS ${net.toFixed(2)}`;
};

window.updateWithdrawAccountDetails = function() {
    const select = document.getElementById('withdrawBank');
    const opt = select.options[select.selectedIndex];
    if (opt && opt.value) {
        document.getElementById('withdrawAccountName').value = opt.getAttribute('data-name') || '';
        document.getElementById('withdrawAccountNumber').value = opt.getAttribute('data-number') || '';
    } else {
        document.getElementById('withdrawAccountName').value = '';
        document.getElementById('withdrawAccountNumber').value = '';
    }
};

window.submitWithdrawalRequest = async function() {
    const userData = window.authManager?.userData;
    if (!userData) return showNotification('Please login', 'error');

    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const bankId = document.getElementById('withdrawBank').value;
    const accountName = document.getElementById('withdrawAccountName').value.trim();
    const accountNumber = document.getElementById('withdrawAccountNumber').value.trim();
    const mobile = document.getElementById('withdrawMobile').value.trim();

    if (!amount || amount < 5000) return showNotification('Minimum withdrawal TZS 5,000', 'error');
    if (amount > userData.balance) return showNotification('Insufficient balance', 'error');
    if (!bankId || !accountName || !accountNumber || !mobile) return showNotification('All fields required', 'error');

    const fee = amount * 0.15;
    const net = amount - fee;

    try {
        showLoading('Submitting withdrawal...');
        const select = document.getElementById('withdrawBank');
        const opt = select.options[select.selectedIndex];
        const provider = opt.getAttribute('data-provider') || 'Unknown';
        const mobileProviders = ['vodacom','airtel','lipa','halotel','yas','pesa'];
        const type = mobileProviders.includes(provider) ? 'mobile' : 'bank';

        const withdrawalData = {
            userId: userData.uid,
            userEmail: userData.email,
            userName: userData.fullName || userData.username,
            amount,
            fee,
            netAmount: net,
            bankId,
            bankName: accountName,
            bankProvider: provider,
            bankType: type,
            accountName,
            accountNumber,
            mobile,
            status: 'pending',
            type: 'withdrawal',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        await db.runTransaction(async (tx) => {
            const userRef = db.collection('users').doc(userData.uid);
            const userDoc = await tx.get(userRef);
            if (!userDoc.exists) throw new Error('User not found');
            if ((userDoc.data().balance || 0) < amount) throw new Error('Insufficient balance');

            tx.update(userRef, {
                balance: firebase.firestore.FieldValue.increment(-amount),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            const transRef = db.collection('transactions').doc();
            tx.set(transRef, withdrawalData);
        });

        // Update local balance
        if (window.authManager.userData) {
            window.authManager.userData.balance -= amount;
        }

        // Clear form
        document.getElementById('withdrawAmount').value = '';
        document.getElementById('withdrawBank').value = '';
        document.getElementById('withdrawAccountName').value = '';
        document.getElementById('withdrawAccountNumber').value = '';
        document.getElementById('withdrawMobile').value = '';
        window.calculateWithdrawalDeduction();

        if (window.bankingSystem) window.bankingSystem.updateBalanceDisplay();

        hideLoading();
        showNotification('Withdrawal request submitted!', 'success');

        if (window.bankingSystem) {
            window.bankingSystem.showReceipt({ ...withdrawalData, status: 'pending' });
        }
    } catch (error) {
        hideLoading();
        showNotification('Error: ' + error.message, 'error');
    }
};

// ==================== INITIALIZATION ====================
// Replace the old initialization intervals with these:
const initUserBankManager = setInterval(() => {
    if (window.authManager && window.authManager.user) {
        clearInterval(initUserBankManager);
        window.userBankManager = new UserBankManager();
        console.log('UserBankManager initialized');
    }
}, 500);

const initAdminBankManager = setInterval(() => {
    if (window.authManager && window.authManager.user && 
        (window.authManager.userData?.role === 'admin' || window.authManager.userData?.role === 'superadmin')) {
        clearInterval(initAdminBankManager);
        window.adminBankManager = new AdminBankManager();
        console.log('AdminBankManager initialized');
    }
}, 500);

function resetDepositSteps() {
    // Show step 1, hide steps 2 and 3
    document.getElementById('depositStep1').classList.add('active');
    document.getElementById('depositStep2').classList.remove('active');
    document.getElementById('depositStep3').classList.remove('active');
    
    // Update step indicators
    document.querySelectorAll('.step')[0].classList.add('active');
    document.querySelectorAll('.step')[1].classList.remove('active');
    document.querySelectorAll('.step')[2].classList.remove('active');
    
    // Clear any pending transaction data in bankingSystem
    if (window.bankingSystem) {
        window.bankingSystem.currentPaymentMethod = null;
        window.bankingSystem.pendingTransaction = null;
    }
    
    // Optional: Clear input fields (uncomment if desired)
    // document.getElementById('depositFullName').value = '';
    // document.getElementById('depositMobile').value = '';
    // document.getElementById('depositAmount').value = '';
    // document.getElementById('transactionId').value = '';
    // document.getElementById('paymentScreenshot').value = '';
}

// ==================== CHAT SYSTEM ====================
class ChatSystem {
    constructor() {
        this.currentChatUserId = null;
        this.unsubscribeMessages = null;
        this.unsubscribeAdminChats = null;
    }
    
    // Call this after authentication is ready
init() {
  const user = window.authManager?.user;
  const userData = window.authManager?.userData;
  if (!user || !userData) return;  // wait until fully authenticated

  if (userData.role === 'admin' || userData.role === 'superadmin') {
    this.initAdmin();
  } else {
    this.initUser();
  }
}

    
    // ---------- USER SIDE ----------
    async initUser() {
        const userId = window.authManager.user.uid;
        await this.createUserChatIfNeeded(userId);
        this.listenForUserMessages(userId);
        this.setupUserSendButton();
        this.setupQuickQuestions();
    }
    
    async createUserChatIfNeeded(userId) {
        const chatRef = db.collection('chats').doc(userId);
        const chatDoc = await chatRef.get();
        if (!chatDoc.exists) {
            // Create chat document
            await chatRef.set({
                userId: userId,
                userName: window.authManager.userData.fullName || 'User',
                lastMessage: 'Welcome to Football Hub Support!',
                lastTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
                unreadByAdmin: true
            });
            // Add welcome message
            await chatRef.collection('messages').add({
                senderId: 'admin',
                text: 'Welcome to Football Hub Support! How can we help you today?',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
    }
    
    listenForUserMessages(userId) {
        const messagesRef = db.collection('chats').doc(userId)
            .collection('messages')
            .orderBy('timestamp');
        this.unsubscribeMessages = messagesRef.onSnapshot(snapshot => {
            this.displayUserMessages(snapshot);
        });
    }
    
    displayUserMessages(snapshot) {
        const container = document.getElementById('userChatMessages');
        if (!container) return;
        let html = '';
        snapshot.forEach(doc => {
            const msg = doc.data();
            const isAdmin = msg.senderId === 'admin';
            const time = msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleTimeString() : '';
            html += `
        <div class="chat-message ${isAdmin ? 'admin' : 'user'}">
          <div class="message-content">${this.escapeHtml(msg.text)}</div>
          <div class="message-time">${time}</div>
        </div>
      `;
        });
        container.innerHTML = html;
        container.scrollTop = container.scrollHeight;
    }
    
    setupUserSendButton() {
        const sendBtn = document.getElementById('userChatSend');
        const input = document.getElementById('userChatInput');
        if (sendBtn) sendBtn.addEventListener('click', () => this.sendUserMessage());
        if (input) input.addEventListener('keypress', e => {
            if (e.key === 'Enter') this.sendUserMessage();
        });
    }
    
    async sendUserMessage() {
        const input = document.getElementById('userChatInput');
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        
        const userId = window.authManager.user.uid;
        const chatRef = db.collection('chats').doc(userId);
        
        // Save user message
        await chatRef.collection('messages').add({
            senderId: userId,
            text: text,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Update chat metadata
        await chatRef.update({
            lastMessage: text,
            lastTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
            unreadByAdmin: true
        });
        
        // Check for automated responses
        this.checkAutomatedResponse(text);
    }
    
    async fetchTodaysMatches() {
    try {
        // Get start and end of today (local time)
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        
        const matchesRef = db.collection('matches');
        const snapshot = await matchesRef
            .where('date', '>=', startOfDay)
            .where('date', '<', endOfDay)
            .orderBy('date', 'asc')
            .get();
        
        if (snapshot.empty) {
            await this.sendAutomatedMessage('No matches scheduled for today.');
            return;
        }
        
        let reply = '📅 Today\'s matches:\n';
        snapshot.forEach(doc => {
            const m = doc.data();
            const time = m.date.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            reply += `${m.homeTeam} vs ${m.awayTeam} at ${time} (${m.competition})\n`;
        });
        await this.sendAutomatedMessage(reply);
    } catch (error) {
        console.error('Error fetching today\'s matches:', error);
        await this.sendAutomatedMessage('Sorry, I could not fetch today\'s matches right now.');
    }
}

checkAutomatedResponse(text) {
    const lower = text.toLowerCase();
     if (lower.includes('how to deposit') || (lower.includes('deposit') && !lower.includes('withdraw'))) {
        this.sendAutomatedMessage('To deposit, go to the Wallet section, choose Deposit, select a payment method, enter the amount, and follow the instructions. You\'ll receive a transaction ID after payment, which you need to submit for approval, The minimum deposit amount is TZS 10,000. Maximum per transaction is TZS 10,000,000.');
    }
    // How to withdraw
    else if (lower.includes('how to withdraw') || (lower.includes('withdraw') && !lower.includes('deposit'))) {
        this.sendAutomatedMessage('To withdraw, go to the Wallet section, choose Withdraw, select your bank account, enter the amount, and confirm. Withdrawals are processed after admin approval, The minimum withdrawal amount is TZS 5,000. Maximum per transaction is TZS 10,000,000. A 15% fee applies.');
    }

    // How to stake a bet
    else if (lower.includes('how to stake') || lower.includes('stake bet') || lower.includes('place bet')) {
        this.sendAutomatedMessage('To place a bet, go to the Matches section, select a match, choose an outcome (Home Win, Draw, or Away Win), enter your stake, and confirm. Your bet will be placed instantly. For VIP multi-bets, you can combine multiple selections.');
    }
    // Today's matches (new)
    else if ((lower.includes('today') && (lower.includes('match') || lower.includes('fixture'))) || lower.includes('today\'s matches')) {
        this.fetchTodaysMatches();
    }
    // Existing match results
    else if (lower.includes('result') || lower.includes('score')) {
        this.fetchMatchResults();
    }
}
    
    async fetchMatchResults() {
        try {
            const matchesRef = db.collection('matches')
                .where('status', '==', 'finished')
                .orderBy('date', 'desc')
                .limit(3);
            const snapshot = await matchesRef.get();
            if (snapshot.empty) {
                await this.sendAutomatedMessage('No recent match results available.');
            } else {
                let reply = 'Recent results:\n';
                snapshot.forEach(doc => {
                    const m = doc.data();
                    const home = m.result?.home ?? '?';
                    const away = m.result?.away ?? '?';
                    reply += `[${m.homeTeam} ${home} ~VS~ ${m.awayTeam} ${away}],\n`;
                });
                await this.sendAutomatedMessage(reply);
            }
        } catch (error) {
            console.error('Error fetching match results:', error);
            await this.sendAutomatedMessage('Sorry, I could not fetch results right now.');
        }
    }
    
    async sendAutomatedMessage(text) {
        const userId = window.authManager.user.uid;
        const chatRef = db.collection('chats').doc(userId);
        await chatRef.collection('messages').add({
            senderId: 'admin',
            text: text,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        await chatRef.update({
            lastMessage: text,
            lastTimestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
    
    // Quick question buttons for users
setupQuickQuestions() {
    const buttons = document.querySelectorAll('.quick-question');
    // Remove any previously attached listeners (to avoid duplicates)
    buttons.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
    
    // Now attach fresh listeners to the new buttons
    document.querySelectorAll('.quick-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const q = btn.getAttribute('data-question');
            document.getElementById('userChatInput').value = q;
            this.sendUserMessage();
        });
    });
}
    
    // ---------- ADMIN SIDE ----------
    initAdmin() {
    // No separate load – we set up the real‑time listener directly
    this.setupAdminSendButton();
    this.unsubscribeAdminChats = db.collection('chats')
        .orderBy('lastTimestamp', 'desc')
        .onSnapshot(snapshot => this.renderAdminChatList(snapshot));
}

renderAdminChatList(snapshot) {
    this.lastSnapshot = snapshot; // store for retry
    
    const container = document.getElementById('adminChatList');
    if (!container) {
        console.log('adminChatList not ready – retrying in 500ms');
        setTimeout(() => this.renderAdminChatList(snapshot), 500);
        return;
    }
    
    if (snapshot.empty) {
        container.innerHTML = '<div class="no-chats">No conversations yet</div>';
        return;
    }
    
    let html = '';
    snapshot.forEach(doc => {
        const chat = doc.data();
        const userId = doc.id;
        const userName = chat.userName || 'Unknown User';
        const lastMessage = chat.lastMessage || '';
        const unreadClass = chat.unreadByAdmin ? 'unread' : '';
        const time = chat.lastTimestamp ?
            new Date(chat.lastTimestamp.toDate()).toLocaleString() :
            '';
        
        // Generate initials from username
        const initials = userName
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
        
        html += `
            <div class="admin-chat-item ${unreadClass}" data-userid="${userId}" onclick="chatSystem.selectAdminChat('${userId}')">
                <div class="chat-avatar">${this.escapeHtml(initials)}</div>
                <div class="chat-info">
                    <div class="chat-user-row">
                        <span class="chat-user-name">${this.escapeHtml(userName)}</span>
                        <span class="chat-user-id">${userId}</span>
                    </div>
                    <div class="chat-last-msg">${this.escapeHtml(lastMessage)}</div>
                </div>
                <div class="chat-meta">
                    <div class="chat-time">${time}</div>
                    ${chat.unreadByAdmin ? '<span class="unread-badge"></span>' : ''}
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}
    
    


async selectAdminChat(userId) {
    this.currentChatUserId = userId;
    
    await db.collection('chats').doc(userId).update({ unreadByAdmin: false });
    
    if (this.unsubscribeMessages) this.unsubscribeMessages();
    
    const messagesRef = db.collection('chats').doc(userId)
        .collection('messages')
        .orderBy('timestamp');
    this.unsubscribeMessages = messagesRef.onSnapshot(snapshot => {
        this.displayAdminMessages(snapshot);
    });
    
    // Enable input and send button
    const input = document.getElementById('adminChatInput');
    const sendBtn = document.getElementById('adminChatSend');
    if (input) {
        input.disabled = false;
        input.value = '';
        input.focus();
    }
    if (sendBtn) sendBtn.disabled = false;
}
    
    displayAdminMessages(snapshot) {
        const container = document.getElementById('adminChatMessages');
        if (!container) return;
        let html = '';
        snapshot.forEach(doc => {
            const msg = doc.data();
            const isAdmin = msg.senderId === 'admin';
            const time = msg.timestamp ? new Date(msg.timestamp.toDate()).toLocaleTimeString() : '';
            html += `
        <div class="chat-message ${isAdmin ? 'admin' : 'user'}">
          <div class="message-content">${this.escapeHtml(msg.text)}</div>
          <div class="message-time">${time}</div>
        </div>
      `;
        });
        container.innerHTML = html;
        container.scrollTop = container.scrollHeight;
    }
    
setupAdminSendButton() {
    const sendBtn = document.getElementById('adminChatSend');
    const input = document.getElementById('adminChatInput');
    if (!sendBtn || !input) return;
    
    // Remove all previous listeners by cloning and replacing
    const newSendBtn = sendBtn.cloneNode(true);
    sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);
    
    const newInput = input.cloneNode(true);
    input.parentNode.replaceChild(newInput, input);
    
    // Attach fresh listeners to the new elements
    newSendBtn.addEventListener('click', () => this.sendAdminMessage());
    newInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendAdminMessage();
    });
}
    
    async sendAdminMessage() {
        if (!this.currentChatUserId) {
            alert('Select a user chat first.');
            return;
        }
        const input = document.getElementById('adminChatInput');
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        const chatRef = db.collection('chats').doc(this.currentChatUserId);
        await chatRef.collection('messages').add({
            senderId: 'admin',
            text: text,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        await chatRef.update({
            lastMessage: text,
            lastTimestamp: firebase.firestore.FieldValue.serverTimestamp()
            // unreadByAdmin remains false because admin is sending
        });
    }
    
    // Helper to escape HTML (prevent XSS)
    escapeHtml(unsafe) {
    const str = unsafe == null ? '' : String(unsafe);
    return str.replace(/[&<>"]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        if (m === '"') return '&quot;';
        return m;
    });
}
    
    // Cleanup listeners (optional)
    cleanup() {
        if (this.unsubscribeMessages) this.unsubscribeMessages();
        if (this.unsubscribeAdminChats) this.unsubscribeAdminChats();
    }
}

async function handleForgotPasswordSubmit() {
    const email = document.getElementById('resetEmail').value.trim();
    if (!email) {
        showNotification('Please enter your email address', 'error');
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    showLoading('Sending reset email...');
    try {
        await auth.sendPasswordResetEmail(email); // compat syntax
        showNotification('Password reset email sent! Please check your inbox.', 'success');
        closeModal('forgotPasswordModal');
    } catch (error) {
        console.error('Password reset error:', error);
        let errorMessage = 'Failed to send reset email. ';
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage += 'No account found with this email.';
                break;
            case 'auth/invalid-email':
                errorMessage += 'Invalid email address.';
                break;
            case 'auth/too-many-requests':
                errorMessage += 'Too many attempts. Please try again later.';
                break;
            default:
                errorMessage += error.message;
        }
        showNotification(errorMessage, 'error');
    } finally {
        hideLoading();
    }
}

// ==================== HAMBURGER MENU ====================
// ==================== HAMBURGER MENU ====================
// ==================== MODAL FUNCTIONS FOR HAMBURGER MENU ====================

// Update hamburger menu click handler to open modals
function initHamburgerMenu() {
    const trigger = document.getElementById('hamburgerTrigger');
    const menu = document.getElementById('hamburgerMenu');
    const overlay = document.getElementById('menuOverlay');
    const closeBtn = document.getElementById('menuClose');
    const menuItems = document.querySelectorAll('.menu-item[data-modal]');
    const logoutBtn = document.getElementById('menuLogoutBtn');
    
    if (!trigger || !menu || !overlay) {
        console.warn('Hamburger menu elements not found');
        return;
    }
 
    window.loadTransactionHistory = function() {
    if (window.bankingSystem) {
        window.bankingSystem.loadTransactionHistory();
    }
};
    function closeMenu() {
        menu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function openMenu() {
        menu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Trigger click
    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        openMenu();
    });
    
    // Close button click
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }
    
    // Overlay click
    overlay.addEventListener('click', closeMenu);
    
    // Menu items click - open corresponding modal
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = item.getAttribute('data-modal');
            
            console.log('Opening modal:', modalId);
            
            // Close the hamburger menu
            closeMenu();
            
            // Open the corresponding modal
            if (modalId) {
                openModal(modalId);
                
                // Load data based on modal type
                if (modalId === 'referralsModal') loadReferralsData();
                if (modalId === 'bankCardsModal') loadBankCardsData();
                if (modalId === 'accountSettingsModal') loadUserSettingsData();
                if (modalId === 'historyModal' && window.bankingSystem) {
            window.bankingSystem.loadTransactionHistory();

        }
            }
        });
    });

    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            closeMenu();
            
            if (window.authManager) {
                try {
                    await window.authManager.auth.signOut();
                } catch (error) {
                    console.error('Logout error:', error);
                    if (typeof showNotification === 'function') {
                        showNotification('Logout failed', 'error');
                    }
                }
            }
        });
    }
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
            // Close any open modals
            document.querySelectorAll('.modal-overlay.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
}


// ==================== MODAL HELPER FUNCTIONS ====================

function copyReferralCode() {
    const codeInput = document.getElementById('modalReferralCode');
    codeInput.select();
    navigator.clipboard.writeText(codeInput.value);
    showNotification('Referral code copied!', 'success');
}

function toggleCardProviderFields() {
    const type = document.getElementById('cardType').value;
    const mobileField = document.getElementById('mobileProviderField');
    const bankField = document.getElementById('bankProviderField');
    
    if (type === 'mobile') {
        mobileField.style.display = 'block';
        bankField.style.display = 'none';
    } else {
        mobileField.style.display = 'none';
        bankField.style.display = 'block';
    }
}

function saveNewCard() {
    // Validate fields
    const type = document.getElementById('cardType').value;
    const provider = type === 'mobile' ?
        document.getElementById('mobileProvider').value :
        document.getElementById('bankProvider').value;
    const accountName = document.getElementById('cardAccountName').value;
    const accountNumber = document.getElementById('cardAccountNumber').value;
    
    if (!accountName || !accountNumber) {
        showNotification('Please fill all fields', 'error');
        return;
    }
    
    // In a real app, save to Firestore here
    showNotification('Card added successfully!', 'success');
    
    // Close add card modal and open bank cards modal
    closeModal('addBankCardModal');
    openModal('bankCardsModal');
    loadBankCardsData(); // Reload cards
}

function switchSettingsTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.settings-tab').forEach(btn => {
        btn.style.background = 'none';
        btn.style.color = 'var(--gray-color)';
    });
    event.currentTarget.style.background = 'var(--accent-color)';
    event.currentTarget.style.color = 'white';
    
    // Update tab content
    document.querySelectorAll('.settings-tab-content').forEach(content => {
        content.style.display = 'none';
    });
    document.getElementById(tabName + 'Tab').style.display = 'block';
}

function saveProfile() {
    const fullName = document.getElementById('modalFullName').value;
    const phone = document.getElementById('modalPhone').value;
    
    // In a real app, save to Firestore here
    showNotification('Profile updated successfully!', 'success');
    closeModal('accountSettingsModal');
}

function changeAvatar() {
    showNotification('Avatar change feature coming soon!', 'info');
}

function changePassword() {
    showNotification('Password updated successfully!', 'success');
    closeModal('accountSettingsModal');
}

function savePreferences() {
    showNotification('Preferences saved!', 'success');
    closeModal('accountSettingsModal');
}

function sendModalMessage() {
    const input = document.getElementById('modalChatInput');
    const message = input.value.trim();
    if (!message) return;
    
    const messagesDiv = document.getElementById('modalChatMessages');
    messagesDiv.innerHTML += `
        <div style="max-width: 80%; align-self: flex-end;">
            <div style="background: var(--accent-color); padding: 0.5rem 1rem; border-radius: 18px; color: white;">${message}</div>
            <div style="font-size: 0.6rem; color: var(--gray-color); margin-top: 0.25rem; text-align: right;">Just now</div>
        </div>
    `;
    input.value = '';
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    // Simulate auto-reply after 1 second
    setTimeout(() => {
        messagesDiv.innerHTML += `
            <div style="max-width: 80%; align-self: flex-start;">
                <div style="background: rgba(255,255,255,0.1); padding: 0.5rem 1rem; border-radius: 18px; color: white;">Thank you for your message. A support agent will respond shortly.</div>
                <div style="font-size: 0.6rem; color: var(--gray-color); margin-top: 0.25rem; margin-left: 0.5rem;">Just now</div>
            </div>
        `;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 1000);
}

function quickQuestion(question) {
    document.getElementById('modalChatInput').value = question;
    sendModalMessage();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize hamburger menu after a short delay
    setTimeout(initHamburgerMenu, 1000);
});
// Update menu with user data
function updateHamburgerMenu() {
    const userData = window.authManager?.userData;
    if (!userData) return;
    
    const menuAvatar = document.getElementById('menuAvatar');
    const menuUserName = document.getElementById('menuUserName');
    const menuUserEmail = document.getElementById('menuUserEmail');
    const menuBalance = document.getElementById('menuBalance');
    const menuReferralCount = document.getElementById('menuReferralCount');
    const menuReferralBadge = document.getElementById('menuReferralBadge');
    
    if (menuAvatar) {
        const initials = userData.fullName ? userData.fullName.charAt(0).toUpperCase() : 'U';
        menuAvatar.textContent = initials;
        menuAvatar.style.background = userData.avatarColor || getRandomColor();
    }
    
    if (menuUserName) menuUserName.textContent = userData.fullName || userData.email;
    if (menuUserEmail) menuUserEmail.textContent = userData.email || '';
    if (menuBalance) menuBalance.textContent = `TZS ${(userData.balance || 0).toFixed(2)}`;
    
    const referralCount = userData.referralCount || 0;
    if (menuReferralCount) menuReferralCount.textContent = referralCount;
    if (menuReferralBadge) {
        menuReferralBadge.textContent = referralCount;
        menuReferralBadge.style.display = referralCount > 0 ? 'inline-block' : 'none';
    }
}

// Helper function for random colors
function getRandomColor() {
    const colors = ['#4A6FA5', '#16697A', '#FFA62B', '#2E8B57', '#DC143C', '#6A5ACD'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ==================== REFERRALS FUNCTIONS ====================
async function loadReferrals() {
    const filter = document.getElementById('referralFilter')?.value || 'all';
    const userId = window.authManager?.user?.uid;
    if (!userId) {
        console.error('No user logged in');
        return;
    }
    
    try {
        // Get all users referred by this user
        const referredUsersSnapshot = await db.collection('users')
            .where('referredBy', '==', userId)
            .get();
        
        // Get all referral earnings for this user
        const earningsSnapshot = await db.collection('referralEarnings')
            .where('referrerId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();
        
        // Create a map of earnings by referred user ID
        const earningsMap = new Map();
        let totalEarnings = 0;
        
        earningsSnapshot.forEach(doc => {
            const earning = doc.data();
            earningsMap.set(earning.referredUserId, {
                amount: earning.amount,
                depositAmount: earning.depositAmount,
                date: earning.createdAt?.toDate?.() || new Date(),
                status: 'paid'
            });
            totalEarnings += earning.amount;
        });
        
        const tbody = document.getElementById('referralsTableBody');
        if (!tbody) return;
        
        if (referredUsersSnapshot.empty && earningsSnapshot.empty) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="no-data">
                        <i class="fas fa-users" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem; display: block;"></i>
                        <p>No referrals yet</p>
                        <small>Share your code to earn 10% commission on their first deposit!</small>
                    </td>
                </tr>
            `;
            
            // Update stats
            document.getElementById('referralTotalCount').textContent = '0';
            document.getElementById('referralActiveCount').textContent = '0';
            document.getElementById('referralEarnings').textContent = 'TZS 0';
            return;
        }
        
        let html = '';
        let activeCount = 0;
        let displayedCount = 0;
        
        // First, show users who have already earned commission
        earningsSnapshot.forEach(doc => {
            const earning = doc.data();
            const date = earning.createdAt?.toDate?.() || new Date();
            const formattedDate = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
            
            // Only include based on filter
            if (filter === 'all' || filter === 'active') {
                displayedCount++;
                activeCount++;
                
                html += `
                    <tr style="background: rgba(46, 204, 113, 0.05);">
                        <td>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-check-circle" style="color: #2ecc71; font-size: 1rem;"></i>
                                <span style="color: white; font-weight: 500;">${earning.referredUserName || 'User'}</span>
                            </div>
                        </td>
                        <td>${formattedDate}</td>
                        <td><span class="status-badge active" style="background: rgba(46,204,113,0.2); color: #2ecc71; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem;">Earned</span></td>
                        <td style="color: #2ecc71; font-weight: bold;">TZS ${earning.amount.toFixed(2)}</td>
                    </tr>
                `;
            }
        });
        
        // Then show users who signed up but haven't deposited yet
        referredUsersSnapshot.forEach(doc => {
            const user = doc.data();
            const userId = doc.id;
            
            // Skip if already shown in earnings
            if (earningsMap.has(userId)) return;
            
            const date = user.createdAt?.toDate?.() || new Date();
            const formattedDate = date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
            
            // Only include based on filter
            if (filter === 'all' || filter === 'pending') {
                displayedCount++;
                
                html += `
                    <tr style="opacity: 0.8;">
                        <td>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-hourglass-half" style="color: #f39c12; font-size: 1rem;"></i>
                                <span style="color: white;">${user.fullName || user.username || 'User'}</span>
                            </div>
                        </td>
                        <td>${formattedDate}</td>
                        <td><span class="status-badge pending" style="background: rgba(243,156,18,0.2); color: #f39c12; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem;">Pending Deposit</span></td>
                        <td style="color: var(--gray-color);">—</td>
                    </tr>
                `;
            }
        });
        
        if (displayedCount === 0) {
            html = `
                <tr>
                    <td colspan="4" class="no-data">No ${filter} referrals found</td>
                </tr>
            `;
        }
        
        tbody.innerHTML = html;
        
        // Update stats
        document.getElementById('referralTotalCount').textContent = referredUsersSnapshot.size;
        document.getElementById('referralActiveCount').textContent = earningsSnapshot.size;
        document.getElementById('referralEarnings').textContent = `TZS ${totalEarnings.toFixed(2)}`;
        
    } catch (error) {
        console.error('Error loading referrals:', error);
        const tbody = document.getElementById('referralsTableBody');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="no-data" style="color: #e74c3c;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 0.5rem; display: block;"></i>
                        <p>Error loading referrals</p>
                        <small>${error.message}</small>
                    </td>
                </tr>
            `;
        }
    }
}

function copyReferralCode() {
    const code = document.getElementById('userReferralCode').textContent;
    navigator.clipboard.writeText(code);
    showNotification('Referral code copied!', 'success');
}

function copyReferralLink() {
    const link = document.getElementById('referralLink');
    navigator.clipboard.writeText(link.value);
    showNotification('Referral link copied!', 'success');
}

// ==================== BANK CARDS FUNCTIONS ====================
async function loadUserBankCards() {
    const userId = window.authManager?.user?.uid;
    if (!userId) return;
    
    const container = document.getElementById('userBankCards');
    if (!container) return;
    
    try {
        const snapshot = await db.collection('userBankAccounts')
            .where('userId', '==', userId)
            .orderBy('isDefault', 'desc')
            .get();
        
        if (snapshot.empty) {
            container.innerHTML = `
                <div class="no-cards">
                    <i class="fas fa-credit-card"></i>
                    <p>No cards added yet</p>
                    <small>Click "Add New Card" to get started</small>
                </div>
            `;
            return;
        }
        
        let html = '';
        snapshot.forEach(doc => {
            const card = doc.data();
            const isDefault = card.isDefault ? 'default' : '';
            const lastFour = card.accountNumber.slice(-4);
            
            html += `
                <div class="bank-card ${isDefault}" data-id="${doc.id}">
                    ${isDefault ? '<span class="default-badge">Default</span>' : ''}
                    <div class="card-chip"></div>
                    <div class="card-type">${card.type === 'mobile' ? 'Mobile' : 'Bank'}</div>
                    <div class="card-number">•••• •••• •••• ${lastFour}</div>
                    <div class="card-details">
                        <span class="card-name">${card.accountName}</span>
                        <span class="card-expiry">${card.provider}</span>
                    </div>
                    <div class="card-actions">
                        <button class="card-action-btn" onclick="setDefaultCard('${doc.id}')" title="Set as default">
                            <i class="fas fa-star"></i>
                        </button>
                        <button class="card-action-btn" onclick="deleteCard('${doc.id}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading cards:', error);
    }
}

async function calculateTotalReferralEarnings(userId) {
    try {
        const earningsSnapshot = await db.collection('referralEarnings')
            .where('referrerId', '==', userId)
            .get();
        
        let total = 0;
        earningsSnapshot.forEach(doc => {
            total += doc.data().amount;
        });
        
        return total;
    } catch (error) {
        console.error('Error calculating total earnings:', error);
        return 0;
    }
}

async function saveBankCard(e) {
    e.preventDefault();
    
    const userId = window.authManager?.user?.uid;
    if (!userId) {
        showNotification('Please login first', 'error');
        return;
    }
    
    const type = document.getElementById('cardAccountType').value;
    let provider;
    
    if (type === 'mobile') {
        provider = document.getElementById('cardMobileProvider').value;
    } else {
        provider = document.getElementById('cardBankProvider').value;
    }
    
    const accountName = document.getElementById('cardAccountName').value.trim();
    const accountNumber = document.getElementById('cardAccountNumber').value.trim();
    const isDefault = document.getElementById('cardSetDefault').checked;
    
    if (!type || !provider || !accountName || !accountNumber) {
        showNotification('Please fill all fields', 'error');
        return;
    }
    
    showLoading('Saving card...');
    
    try {
        if (isDefault) {
            const batch = db.batch();
            const defaultQuery = await db.collection('userBankAccounts')
                .where('userId', '==', userId)
                .where('isDefault', '==', true)
                .get();
            
            defaultQuery.forEach(doc => {
                batch.update(doc.ref, { isDefault: false });
            });
            
            const newCardRef = db.collection('userBankAccounts').doc();
            batch.set(newCardRef, {
                userId,
                type,
                provider,
                accountName,
                accountNumber,
                isDefault: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            await batch.commit();
        } else {
            await db.collection('userBankAccounts').add({
                userId,
                type,
                provider,
                accountName,
                accountNumber,
                isDefault: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }
        
        hideLoading();
        showNotification('Card added successfully!', 'success');
        closeModal('addBankCardModal');
        document.getElementById('addBankCardForm').reset();
        document.getElementById('mobileProviderGroup').style.display = 'none';
        document.getElementById('bankProviderGroup').style.display = 'none';
        loadUserBankCards();
        
    } catch (error) {
        hideLoading();
        console.error('Error saving card:', error);
        showNotification('Error saving card', 'error');
    }
}

async function setDefaultCard(cardId) {
    const userId = window.authManager?.user?.uid;
    if (!userId) return;
    
    try {
        const batch = db.batch();
        
        const defaultQuery = await db.collection('userBankAccounts')
            .where('userId', '==', userId)
            .where('isDefault', '==', true)
            .get();
        
        defaultQuery.forEach(doc => {
            batch.update(doc.ref, { isDefault: false });
        });
        
        const cardRef = db.collection('userBankAccounts').doc(cardId);
        batch.update(cardRef, { isDefault: true });
        
        await batch.commit();
        showNotification('Default card updated', 'success');
        loadUserBankCards();
        
    } catch (error) {
        console.error('Error setting default:', error);
        showNotification('Error updating default', 'error');
    }
}

async function deleteCard(cardId) {
    if (!confirm('Are you sure you want to delete this card?')) return;
    
    try {
        await db.collection('userBankAccounts').doc(cardId).delete();
        showNotification('Card deleted', 'success');
        loadUserBankCards();
    } catch (error) {
        console.error('Error deleting card:', error);
        showNotification('Error deleting card', 'error');
    }
}

// ==================== ACCOUNT SETTINGS FUNCTIONS ====================
function switchSettingsTab(tab) {
    document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
    
    event.currentTarget.classList.add('active');
    document.getElementById(tab + 'Settings').classList.add('active');
}

async function saveProfileSettings(e) {
    e.preventDefault();
    
    const userId = window.authManager?.user?.uid;
    if (!userId) return;
    
    const fullName = document.getElementById('settingsFullName').value.trim();
    const username = document.getElementById('settingsUsername').value.trim();
    const phone = document.getElementById('settingsPhone').value.trim();
    const country = document.getElementById('settingsCountry').value;
    const favoriteTeam = document.getElementById('settingsFavoriteTeam').value;
    
    showLoading('Saving changes...');
    
    try {
        await db.collection('users').doc(userId).update({
            fullName,
            username,
            phone,
            country,
            favoriteTeam,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        if (window.authManager.userData) {
            window.authManager.userData.fullName = fullName;
            window.authManager.userData.username = username;
            window.authManager.userData.phone = phone;
            window.authManager.userData.country = country;
            window.authManager.userData.favoriteTeam = favoriteTeam;
        }
        
        hideLoading();
        showNotification('Profile updated successfully!', 'success');
        
        // Update UI
        document.getElementById('userName').textContent = fullName;
        document.getElementById('welcomeName').textContent = fullName.split(' ')[0];
        document.getElementById('welcomeName1').textContent = fullName.split(' ')[0];
        
    } catch (error) {
        hideLoading();
        console.error('Error saving profile:', error);
        showNotification('Error saving profile', 'error');
    }
}

function uploadAvatar() {
    // Implement avatar upload
    showNotification('Avatar upload coming soon!', 'info');
}

function removeAvatar() {
    // Implement avatar removal
    showNotification('Avatar removal coming soon!', 'info');
}

function changePassword(e) {
    e.preventDefault();
    // Implement password change
    showNotification('Password change coming soon!', 'info');
}

function enable2FA() {
    // Implement 2FA
    showNotification('2FA coming soon!', 'info');
}

function savePreference(key, value) {
    // Save preference
    console.log('Saving preference:', key, value);
    showNotification('Preference saved!', 'success');
}

function saveNotificationSettings() {
    // Save notification settings
    showNotification('Notification settings saved!', 'success');
}

// ==================== INITIALIZATION ====================
// Load data when sections are shown
document.addEventListener('sectionChanged', (e) => {
    if (e.detail.sectionId === 'referralsSection') {
        loadReferrals();
    }
    if (e.detail.sectionId === 'bankCardsSection') {
        loadUserBankCards();
    }
    if (e.detail.sectionId === 'accountSettingsSection') {
        // Populate settings form with user data
        const userData = window.authManager?.userData;
        if (userData) {
            document.getElementById('settingsFullName').value = userData.fullName || '';
            document.getElementById('settingsUsername').value = userData.username || '';
            document.getElementById('settingsEmail').value = userData.email || '';
            document.getElementById('settingsPhone').value = userData.phone || '';
            document.getElementById('settingsCountry').value = userData.country || '';
            document.getElementById('settingsFavoriteTeam').value = userData.favoriteTeam || '';
            
            const initials = userData.fullName ? userData.fullName.charAt(0).toUpperCase() : 'U';
            document.getElementById('profileAvatarInitials').textContent = initials;
        }
    }
});

// Global close menu function
function closeHamburgerMenu() {
    const menu = document.getElementById('hamburgerMenu');
    const overlay = document.getElementById('menuOverlay');
    
    if (menu && overlay) {
        menu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ==================== REFERRALS MODAL FUNCTIONS ====================

// Load referral data when modal opens
async function loadReferralsData() {
    const userId = window.authManager?.user?.uid;
    if (!userId) {
        showNotification('Please login first', 'error');
        return;
    }
    
    // Show loading state
    document.getElementById('referralsLoading').style.display = 'block';
    document.getElementById('referralsTableBody').innerHTML = '';
    
    try {
        // Get user's referral code
        const userDoc = await db.collection('users').doc(userId).get();
        const userData = userDoc.data();
        const referralCode = userData.referralCode || 'N/A';
        
        // Update referral code display
        document.getElementById('modalReferralCode').value = referralCode;
        
        // Generate and display referral link
        const baseUrl = window.location.origin + window.location.pathname;
        const referralLink = `${baseUrl}?ref=${referralCode}`;
        document.getElementById('modalReferralLink').value = referralLink;
        
        // Get all users referred by this user
        const referredUsersSnapshot = await db.collection('users')
            .where('referredBy', '==', userId)
            .get();
        
        // Get all referral earnings for this user
        const earningsSnapshot = await db.collection('referralEarnings')
            .where('referrerId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();
        
        // Calculate stats
        const totalReferrals = referredUsersSnapshot.size;
        const activeReferrals = earningsSnapshot.size;
        
        let totalEarnings = 0;
        const earningsMap = new Map();
        
        earningsSnapshot.forEach(doc => {
            const earning = doc.data();
            totalEarnings += earning.amount;
            earningsMap.set(earning.referredUserId, {
                amount: earning.amount,
                depositAmount: earning.depositAmount,
                date: earning.createdAt?.toDate?.() || new Date()
            });
        });
        
        // Update stats display
        document.getElementById('modalTotalReferrals').textContent = totalReferrals;
        document.getElementById('modalActiveReferrals').textContent = activeReferrals;
        document.getElementById('modalTotalEarnings').textContent = `TZS ${totalEarnings.toFixed(2)}`;
        
        // Load referrals into table
        await loadReferralsTable(referredUsersSnapshot, earningsMap);
        
    } catch (error) {
        console.error('Error loading referral data:', error);
        
        // Check if it's an index error
        if (error.message?.includes('index')) {
            document.getElementById('referralsTableBody').innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 2rem;">
                        <i class="fas fa-database" style="font-size: 3rem; color: var(--accent-color); margin-bottom: 1rem; display: block;"></i>
                        <p style="color: white;">Firestore index required</p>
                        <p style="color: var(--gray-color); font-size: 0.85rem; margin-bottom: 1rem;">Please create the required index for referralEarnings collection</p>
                        <a href="https://console.firebase.google.com/v1/r/project/football-canvas-hub/firestore/indexes?create_composite=Clxwcm9qZWN0cy9mb290YmFsbC1jYW52YXMtaHViL2RhdGFiYXNlcy8oZGVmYXVsdCkvY29sbGVjdGlvbkdyb3Vwcy9yZWZlcnJhbEVhcm5pbmdzL2luZGV4ZXMvXxABGg4K" 
                           target="_blank" class="btn-primary" style="display: inline-block; padding: 0.5rem 1rem; border-radius: 5px; text-decoration: none;">
                            <i class="fas fa-external-link-alt"></i> Create Index
                        </a>
                    </td>
                </tr>
            `;
        } else {
            showNotification('Error loading referrals: ' + error.message, 'error');
        }
    } finally {
        document.getElementById('referralsLoading').style.display = 'none';
    }
}

// Load referrals table with filter
async function loadReferralsTable(referredUsersSnapshot, earningsMap) {
    const filter = document.getElementById('referralFilter')?.value || 'all';
    const tbody = document.getElementById('referralsTableBody');
    
    if (referredUsersSnapshot.empty && earningsMap.size === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 2rem; color: var(--gray-color);">
                    <i class="fas fa-users" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem; display: block;"></i>
                    <p>No referrals yet</p>
                    <small>Share your code to start earning 10% commission!</small>
                </td>
            </tr>
        `;
        return;
    }
    
    let html = '';
    let hasResults = false;
    
    // Process users who have earned commission
    for (const [referredUserId, earning] of earningsMap.entries()) {
        if (filter === 'all' || filter === 'active') {
            hasResults = true;
            
            // Get user details
            const userDoc = await db.collection('users').doc(referredUserId).get();
            const userData = userDoc.data();
            const userName = userData?.fullName || userData?.username || 'User';
            const joinDate = userData?.createdAt?.toDate?.() || earning.date;
            const formattedDate = joinDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            html += `
                <tr>
                    <td style="padding: 0.75rem 0.5rem; color: white;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-check-circle" style="color: #2ecc71; font-size: 0.9rem;"></i>
                            ${userName}
                        </div>
                    </td>
                    <td style="padding: 0.75rem 0.5rem; color: var(--gray-color); font-size: 0.9rem;">${formattedDate}</td>
                    <td style="padding: 0.75rem 0.5rem;"><span class="status-badge active">Earned</span></td>
                    <td style="padding: 0.75rem 0.5rem; text-align: right; color: #2ecc71; font-weight: bold;">TZS ${earning.amount.toFixed(2)}</td>
                </tr>
            `;
        }
    }
    
    // Process users who signed up but haven't deposited
    referredUsersSnapshot.forEach(doc => {
        const user = doc.data();
        const referredUserId = doc.id;
        
        // Skip if already shown in earnings
        if (earningsMap.has(referredUserId)) return;
        
        if (filter === 'all' || filter === 'pending') {
            hasResults = true;
            
            const joinDate = user.createdAt?.toDate?.() || new Date();
            const formattedDate = joinDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            const userName = user.fullName || user.username || 'User';
            
            html += `
                <tr>
                    <td style="padding: 0.75rem 0.5rem; color: white;">
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-hourglass-half" style="color: #f39c12; font-size: 0.9rem;"></i>
                            ${userName}
                        </div>
                    </td>
                    <td style="padding: 0.75rem 0.5rem; color: var(--gray-color); font-size: 0.9rem;">${formattedDate}</td>
                    <td style="padding: 0.75rem 0.5rem;"><span class="status-badge pending">Pending Deposit</span></td>
                    <td style="padding: 0.75rem 0.5rem; text-align: right; color: var(--gray-color);">—</td>
                </tr>
            `;
        }
    });
    
    if (!hasResults) {
        html = `
            <tr>
                <td colspan="4" style="text-align: center; padding: 2rem; color: var(--gray-color);">
                    No ${filter} referrals found
                </td>
            </tr>
        `;
    }
    
    tbody.innerHTML = html;
}

// Filter referrals when dropdown changes
async function filterReferrals() {
    const userId = window.authManager?.user?.uid;
    if (!userId) return;
    
    // Get data again
    const referredUsersSnapshot = await db.collection('users')
        .where('referredBy', '==', userId)
        .get();
    
    const earningsSnapshot = await db.collection('referralEarnings')
        .where('referrerId', '==', userId)
        .get();
    
    const earningsMap = new Map();
    earningsSnapshot.forEach(doc => {
        const earning = doc.data();
        earningsMap.set(earning.referredUserId, {
            amount: earning.amount,
            depositAmount: earning.depositAmount,
            date: earning.createdAt?.toDate?.() || new Date()
        });
    });
    
    await loadReferralsTable(referredUsersSnapshot, earningsMap);
}

// Copy referral code to clipboard
function copyReferralCode() {
    const codeInput = document.getElementById('modalReferralCode');
    codeInput.select();
    codeInput.setSelectionRange(0, 99999); // For mobile devices
    
    navigator.clipboard.writeText(codeInput.value).then(() => {
        showNotification('✅ Referral code copied! Share it with friends.', 'success');
    }).catch(() => {
        // Fallback
        document.execCommand('copy');
        showNotification('✅ Referral code copied! Share it with friends.', 'success');
    });
}

// Copy referral link to clipboard
function copyReferralLink() {
    const linkInput = document.getElementById('modalReferralLink');
    linkInput.select();
    linkInput.setSelectionRange(0, 99999);
    
    navigator.clipboard.writeText(linkInput.value).then(() => {
        showNotification('✅ Referral link copied! Share it with friends.', 'success');
    }).catch(() => {
        document.execCommand('copy');
        showNotification('✅ Referral link copied! Share it with friends.', 'success');
    });
}

// Share referral link via social media
function shareReferralLink(platform) {
    const userData = window.authManager?.userData;
    if (!userData || !userData.referralCode) {
        showNotification('Please login to get your referral link', 'error');
        return;
    }
    
    const baseUrl = window.location.origin + window.location.pathname;
    const link = `${baseUrl}?ref=${userData.referralCode}`;
    const message = `Join me on Football Canvas Hub! Use my referral code ${userData.referralCode} or click this link to get started: ${link}`;
    
    let shareUrl = '';
    
    switch (platform) {
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
            break;
        case 'telegram':
            shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent('Join me on Football Canvas Hub!')}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&quote=${encodeURIComponent(message)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${encodeURIComponent('Join me on Football Canvas Hub')}&body=${encodeURIComponent(message)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// ==================== PROFILE DISPLAY FUNCTIONS ====================

// Function to load and display user profile information
function loadUserProfile() {
    const userData = window.authManager?.userData;
    if (!userData) {
        console.log('No user data available');
        return;
    }
    
    console.log('Loading profile data for user:', userData.email);
    
    // Update profile full name
    const profileFullName = document.getElementById('profileFullName');
    if (profileFullName) {
        profileFullName.textContent = userData.fullName || 'Not Set';
    }
    
    // Update profile role badge
    const profileRoleBadge = document.getElementById('profileRoleBadge');
    if (profileRoleBadge) {
        const role = userData.role || 'user';
        let badgeClass = 'badge-user';
        let badgeText = 'Member';
        
        if (role === 'admin') {
            badgeClass = 'badge-admin';
            badgeText = 'Admin';
        } else if (role === 'superadmin') {
            badgeClass = 'badge-superadmin';
            badgeText = 'Super Admin';
        } else if (role === 'vip') {
            badgeClass = 'badge-vip';
            badgeText = 'VIP Member';
        }
        
        profileRoleBadge.innerHTML = `<span class="${badgeClass}">${badgeText}</span>`;
    }
    
    // Update email
    const profileEmail = document.getElementById('profileEmail');
    if (profileEmail) {
        profileEmail.textContent = userData.email || 'Not provided';
    }
    
    // Update phone
    const profilePhone = document.getElementById('profilePhone');
    if (profilePhone) {
        profilePhone.textContent = userData.phone || 'Not provided';
    }
    
    // Update country
    const profileCountry = document.getElementById('profileCountry');
    if (profileCountry) {
        // Find country name from code if needed
        let countryName = userData.country || 'Not selected';
        
        // If you have a countries array, you can convert country code to name
        if (typeof countries !== 'undefined' && userData.country) {
            const country = countries.find(c => c.code === userData.country);
            if (country) {
                countryName = country.name;
            }
        }
        
        profileCountry.textContent = countryName;
    }
    
    // Update favorite team
    const profileFavoriteTeam = document.getElementById('profileFavoriteTeam');
    if (profileFavoriteTeam) {
        let teamName = userData.favoriteTeam || 'Not selected';
        
        // If you have footballTeams array, convert team ID to name
        if (typeof footballTeams !== 'undefined' && userData.favoriteTeam) {
            const team = footballTeams.find(t => t.id === userData.favoriteTeam);
            if (team) {
                teamName = team.name;
            }
        }
        
        profileFavoriteTeam.textContent = teamName;
    }
    
    // Update join date
    const profileJoinDate = document.getElementById('profileJoinDate');
    if (profileJoinDate) {
        if (userData.createdAt) {
            // Handle Firestore timestamp
            let joinDate;
            if (userData.createdAt.toDate) {
                joinDate = userData.createdAt.toDate();
            } else if (userData.createdAt instanceof Date) {
                joinDate = userData.createdAt;
            } else {
                joinDate = new Date(userData.createdAt);
            }
            
            // Format date nicely
            const formattedDate = joinDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            profileJoinDate.textContent = formattedDate;
        } else {
            profileJoinDate.textContent = 'Not available';
        }
    }
}

// Function to update profile when user data changes
function updateProfileOnAuthChange() {
    // Listen for auth state changes
    if (window.authManager) {
        // Check if user is logged in
        const checkInterval = setInterval(() => {
            if (window.authManager.userData) {
                clearInterval(checkInterval);
                loadUserProfile();
            }
        }, 500);
    }
}

// Also update profile when section changes to profile section
document.addEventListener('sectionChanged', (e) => {
    if (e.detail.sectionId === 'profileSection' ||
        e.detail.sectionId === 'accountSettingsSection') {
        // Small delay to ensure DOM is ready
        setTimeout(loadUserProfile, 100);
    }
});

// ==================== SUPER ADMIN MANAGEMENT ====================

let currentUsersPage = 1;
const USERS_PER_PAGE = 20;
let totalUsers = 0;
let usersData = [];
let currentEditUserId = null;

// Tab switching
function switchSuperTab(tab) {
    document.querySelectorAll('.super-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.super-tab-content').forEach(c => c.classList.remove('active'));
    event.currentTarget.classList.add('active');
    document.getElementById(`super${tab.charAt(0).toUpperCase() + tab.slice(1)}Tab`).classList.add('active');
    
    if (tab === 'users') loadUsers();
    if (tab === 'admins') loadAdmins();
    if (tab === 'top') loadTopUsers();
}

// Load users with filters and pagination
async function loadUsers(page = 1) {
    currentUsersPage = page;
    const roleFilter = document.getElementById('userRoleFilter')?.value || 'all';
    const statusFilter = document.getElementById('userStatusFilter')?.value || 'all';
    const searchTerm = document.getElementById('userSearch')?.value.toLowerCase() || '';
    
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '<tr><td colspan="7" class="loading">Loading users...</td></tr>';
    
    try {
        let query = db.collection('users').orderBy('createdAt', 'desc');
        let snapshot = await query.get();
        
        let users = [];
        snapshot.forEach(doc => users.push({ id: doc.id, ...doc.data() }));
        
        // Apply filters
        if (roleFilter !== 'all') {
            users = users.filter(u => u.role === roleFilter);
        }
        if (statusFilter !== 'all') {
            users = users.filter(u => u.status === statusFilter);
        }
        if (searchTerm) {
            users = users.filter(u => 
                (u.fullName && u.fullName.toLowerCase().includes(searchTerm)) ||
                (u.email && u.email.toLowerCase().includes(searchTerm))
            );
        }
        
        totalUsers = users.length;
        const start = (page - 1) * USERS_PER_PAGE;
        const paginatedUsers = users.slice(start, start + USERS_PER_PAGE);
        usersData = paginatedUsers;
        
        renderUsersTable(paginatedUsers);
        renderUsersPagination();
    } catch (error) {
        console.error('Error loading users:', error);
        tbody.innerHTML = `<tr><td colspan="7" class="error">Error loading users: ${error.message}</td></tr>`;
    }
}

function renderUsersTable(users) {
    const tbody = document.getElementById('usersTableBody');
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">No users found</td></tr>';
        return;
    }
    
    let html = '';
    users.forEach(user => {
        const joinDate = user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'N/A';
        const statusClass = user.status === 'active' ? 'active' : 'blocked';
        const role = user.role || 'user';
        
        html += `
            <tr>
                <td>${user.fullName || user.username || 'N/A'}</td>
                <td>${user.email || 'N/A'}</td>
                <td>TZS ${(user.balance || 0).toFixed(2)}</td>
                <td><span class="badge-${role}">${role}</span></td>
                <td><span class="status-badge ${statusClass}">${user.status || 'active'}</span></td>
                <td>${joinDate}</td>
                <td>
                    <button class="action-btn" onclick="viewUserDetails('${user.id}')" title="View Details"><i class="fas fa-eye"></i></button>
                    <button class="action-btn" onclick="openEditUserModal('${user.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn" onclick="openAdjustBalanceModal('${user.id}', ${user.balance || 0})" title="Adjust Balance"><i class="fas fa-coins"></i></button>
                    <button class="action-btn" onclick="openResetPasswordModal('${user.id}', '${user.email}')" title="Reset Password"><i class="fas fa-key"></i></button>
                    <button class="action-btn" onclick="toggleUserStatus('${user.id}', '${user.status}')" title="${user.status === 'active' ? 'Block' : 'Activate'}">
                        <i class="fas ${user.status === 'active' ? 'fa-ban' : 'fa-check-circle'}"></i>
                    </button>
                    <button class="action-btn" onclick="viewBetHistory('${user.id}', '${user.fullName || user.email}')" title="Bet History"><i class="fas fa-history"></i></button>
                    <button class="action-btn" onclick="viewTransactionHistory('${user.id}', '${user.fullName || user.email}')" title="Transaction History"><i class="fas fa-exchange-alt"></i></button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function renderUsersPagination() {
    const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);
    let paginationHtml = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `<button class="${i === currentUsersPage ? 'active' : ''}" onclick="loadUsers(${i})">${i}</button>`;
    }
    document.getElementById('usersPagination').innerHTML = paginationHtml;
}

// Search users (debounced)
let searchTimeout;
function searchUsers() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => loadUsers(1), 500);
}

// Load admins
async function loadAdmins() {
    const tbody = document.getElementById('adminsTableBody');
    tbody.innerHTML = '<tr><td colspan="5" class="loading">Loading admins...</td></tr>';
    
    try {
        const snapshot = await db.collection('users')
            .where('role', 'in', ['admin', 'superadmin'])
            .orderBy('createdAt', 'desc')
            .get();
        
        if (snapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="5" class="no-data">No admins found</td></tr>';
            return;
        }
        
        let html = '';
        snapshot.forEach(doc => {
            const admin = doc.data();
            const lastLogin = admin.lastLogin?.toDate ? admin.lastLogin.toDate().toLocaleString() : 'Never';
            html += `
                <tr>
                    <td>${admin.fullName || admin.username || 'N/A'}</td>
                    <td>${admin.email}</td>
                    <td><span class="badge-${admin.role}">${admin.role}</span></td>
                    <td>${lastLogin}</td>
                    <td>
                        <button class="action-btn" onclick="openEditUserModal('${doc.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                        ${admin.role !== 'superadmin' ? `<button class="action-btn delete" onclick="demoteAdmin('${doc.id}')" title="Remove Admin"><i class="fas fa-user-minus"></i></button>` : ''}
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    } catch (error) {
        console.error('Error loading admins:', error);
        tbody.innerHTML = `<tr><td colspan="5" class="error">Error: ${error.message}</td></tr>`;
    }
}

// View user details modal
async function viewUserDetails(userId) {
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            showNotification('User not found', 'error');
            return;
        }
        const user = userDoc.data();
        const joinDate = user.createdAt?.toDate ? user.createdAt.toDate().toLocaleString() : 'N/A';
        const lastLogin = user.lastLogin?.toDate ? user.lastLogin.toDate().toLocaleString() : 'Never';
        
        const content = `
            <div class="user-details">
                <p><strong>Full Name:</strong> ${user.fullName || 'N/A'}</p>
                <p><strong>Username:</strong> ${user.username || 'N/A'}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone || 'N/A'}</p>
                <p><strong>Country:</strong> ${user.country || 'N/A'}</p>
                <p><strong>Favorite Team:</strong> ${user.favoriteTeam || 'N/A'}</p>
                <p><strong>Role:</strong> ${user.role || 'user'}</p>
                <p><strong>Status:</strong> ${user.status || 'active'}</p>
                <p><strong>Balance:</strong> TZS ${(user.balance || 0).toFixed(2)}</p>
                <p><strong>Referral Code:</strong> ${user.referralCode || 'N/A'}</p>
                <p><strong>Referred By:</strong> ${user.referredBy || 'N/A'}</p>
                <p><strong>Referral Count:</strong> ${user.referralCount || 0}</p>
                <p><strong>Joined:</strong> ${joinDate}</p>
                <p><strong>Last Login:</strong> ${lastLogin}</p>
            </div>
        `;
        document.getElementById('userDetailsContent').innerHTML = content;
        openModal('userDetailsModal');
    } catch (error) {
        console.error('Error loading user details:', error);
        showNotification('Error loading details', 'error');
    }
}

// Open edit user modal and populate data
async function openEditUserModal(userId) {
    currentEditUserId = userId;
    try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            showNotification('User not found', 'error');
            return;
        }
        const user = userDoc.data();
        
        document.getElementById('editUserId').value = userId;
        document.getElementById('editFullName').value = user.fullName || '';
        document.getElementById('editUsername').value = user.username || '';
        document.getElementById('editEmail').value = user.email || '';
        document.getElementById('editPhone').value = user.phone || '';
        document.getElementById('editRole').value = user.role || 'user';
        document.getElementById('editStatus').value = user.status || 'active';
        
        // Populate country dropdown (use existing countries array)
        const countrySelect = document.getElementById('editCountry');
        countrySelect.innerHTML = '<option value="">Select Country</option>';
        countries.forEach(c => {
            countrySelect.innerHTML += `<option value="${c.code}" ${c.code === user.country ? 'selected' : ''}>${c.name}</option>`;
        });
        
        // Populate teams dropdown
        const teamSelect = document.getElementById('editFavoriteTeam');
        teamSelect.innerHTML = '<option value="">Select Team</option>';
        footballTeams.forEach(t => {
            teamSelect.innerHTML += `<option value="${t.id}" ${t.id === user.favoriteTeam ? 'selected' : ''}>${t.name}</option>`;
        });
        
        openModal('editUserModal');
    } catch (error) {
        console.error('Error loading user for edit:', error);
        showNotification('Error loading user', 'error');
    }
}

// Save edited user
async function saveUserEdit(e) {
    e.preventDefault();
    const userId = document.getElementById('editUserId').value;
    const updatedData = {
        fullName: document.getElementById('editFullName').value,
        username: document.getElementById('editUsername').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value,
        country: document.getElementById('editCountry').value,
        favoriteTeam: document.getElementById('editFavoriteTeam').value,
        role: document.getElementById('editRole').value,
        status: document.getElementById('editStatus').value,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    showLoading('Updating user...');
    try {
        await db.collection('users').doc(userId).update(updatedData);
        showNotification('User updated successfully', 'success');
        closeModal('editUserModal');
        loadUsers(currentUsersPage);
        loadAdmins(); // in case role changed
    } catch (error) {
        console.error('Error updating user:', error);
        showNotification('Error updating user', 'error');
    } finally {
        hideLoading();
    }
}

// Toggle user status (activate/block)
async function toggleUserStatus(userId, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'block';
    
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    
    showLoading(`${action}ing user...`);
    try {
        await db.collection('users').doc(userId).update({
            status: newStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        showNotification(`User ${action}d successfully`, 'success');
        loadUsers(currentUsersPage);
    } catch (error) {
        console.error('Error updating status:', error);
        showNotification('Error updating status', 'error');
    } finally {
        hideLoading();
    }
}

// Open adjust balance modal
function openAdjustBalanceModal(userId, currentBalance) {
    document.getElementById('balanceUserId').value = userId;
    document.getElementById('currentBalanceDisplay').textContent = `TZS ${currentBalance.toFixed(2)}`;
    document.getElementById('balanceAmount').value = '';
    document.getElementById('balanceReason').value = '';
    openModal('adjustBalanceModal');
}

// Adjust balance
async function adjustUserBalance(e) {
    e.preventDefault();
    const userId = document.getElementById('balanceUserId').value;
    const action = document.getElementById('balanceAction').value;
    const amount = parseFloat(document.getElementById('balanceAmount').value);
    const reason = document.getElementById('balanceReason').value || 'Admin adjustment';
    
    if (isNaN(amount) || amount <= 0) {
        showNotification('Please enter a valid amount', 'error');
        return;
    }
    
    showLoading('Updating balance...');
    try {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();
        const currentBalance = userDoc.data().balance || 0;
        
        let newBalance;
        if (action === 'add') newBalance = currentBalance + amount;
        else if (action === 'subtract') newBalance = currentBalance - amount;
        else newBalance = amount; // set exact
        
        if (newBalance < 0) {
            showNotification('Balance cannot go negative', 'error');
            hideLoading();
            return;
        }
        
        await db.runTransaction(async (transaction) => {
            transaction.update(userRef, {
                balance: newBalance,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Log transaction
            const transRef = db.collection('transactions').doc();
            transaction.set(transRef, {
                userId: userId,
                type: 'admin_adjustment',
                amount: action === 'subtract' ? -amount : (action === 'add' ? amount : newBalance - currentBalance),
                description: `Admin ${action}: ${reason}`,
                date: firebase.firestore.FieldValue.serverTimestamp(),
                adminId: window.authManager.user.uid
            });
        });
        
        showNotification('Balance updated successfully', 'success');
        closeModal('adjustBalanceModal');
        loadUsers(currentUsersPage);
    } catch (error) {
        console.error('Error adjusting balance:', error);
        showNotification('Error updating balance', 'error');
    } finally {
        hideLoading();
    }
}

// Reset password (send reset email)
function openResetPasswordModal(userId, email) {
    document.getElementById('resetUserEmail').textContent = email;
    document.getElementById('resetPasswordModal').dataset.userId = userId;
    openModal('resetPasswordModal');
}

async function confirmResetPassword() {
    const userId = document.getElementById('resetPasswordModal').dataset.userId;
    const userDoc = await db.collection('users').doc(userId).get();
    const email = userDoc.data().email;
    
    showLoading('Sending reset email...');
    try {
        await auth.sendPasswordResetEmail(email);
        showNotification('Password reset email sent', 'success');
        closeModal('resetPasswordModal');
    } catch (error) {
        console.error('Error sending reset email:', error);
        showNotification('Error sending reset email', 'error');
    } finally {
        hideLoading();
    }
}

// View bet history
async function viewBetHistory(userId, userName) {
    document.getElementById('betHistoryUserName').textContent = userName;
    const tbody = document.getElementById('betHistoryBody');
    tbody.innerHTML = '<tr><td colspan="7" class="loading">Loading bets...</td></tr>';
    openModal('betHistoryModal');
    
    try {
        const betsSnapshot = await db.collection('bets')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get();
        
        if (betsSnapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="7" class="no-data">No bets found</td></tr>';
            return;
        }
        
        let html = '';
        betsSnapshot.forEach(doc => {
            const bet = doc.data();
            const date = bet.createdAt?.toDate ? bet.createdAt.toDate().toLocaleString() : 'N/A';
            const profit = bet.status === 'won' ? (bet.potentialReturn - bet.stake) : (bet.status === 'lost' ? -bet.stake : 0);
            html += `
                <tr>
                    <td>${bet.match || 'Multi-bet'}</td>
                    <td>${bet.betAgainst || 'N/A'}</td>
                    <td>TZS ${bet.stake.toFixed(2)}</td>
                    <td>${bet.percentage || bet.totalPercentage ? ((bet.percentage || bet.totalPercentage*100).toFixed(2))+'%' : 'N/A'}</td>
                    <td style="color: ${profit >= 0 ? '#2ecc71' : '#e74c3c'};">${profit >= 0 ? '+' : ''}TZS ${profit.toFixed(2)}</td>
                    <td><span class="status-badge ${bet.status}">${bet.status}</span></td>
                    <td>${date}</td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    } catch (error) {
        console.error('Error loading bet history:', error);
        tbody.innerHTML = `<tr><td colspan="7" class="error">Error: ${error.message}</td></tr>`;
    }
}

// View transaction history
async function viewTransactionHistory(userId, userName) {
    document.getElementById('transactionHistoryUserName').textContent = userName;
    const tbody = document.getElementById('transactionHistoryBody');
    tbody.innerHTML = '<tr><td colspan="5" class="loading">Loading transactions...</td></tr>';
    openModal('transactionHistoryModal');
    
    try {
        const transSnapshot = await db.collection('transactions')
            .where('userId', '==', userId)
            .orderBy('date', 'desc')
            .limit(50)
            .get();
        
        if (transSnapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="5" class="no-data">No transactions found</td></tr>';
            return;
        }
        
        let html = '';
        transSnapshot.forEach(doc => {
            const trans = doc.data();
            const date = trans.date?.toDate ? trans.date.toDate().toLocaleString() : 'N/A';
            const amount = trans.type === 'withdrawal' ? -trans.amount : trans.amount;
            html += `
                <tr>
                    <td>${trans.type}</td>
                    <td style="color: ${amount >= 0 ? '#2ecc71' : '#e74c3c'};">${amount >= 0 ? '+' : ''}TZS ${Math.abs(trans.amount).toFixed(2)}</td>
                    <td>${trans.description || ''}</td>
                    <td><span class="status-badge ${trans.status || 'pending'}">${trans.status || 'pending'}</span></td>
                    <td>${date}</td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    } catch (error) {
        console.error('Error loading transaction history:', error);
        tbody.innerHTML = `<tr><td colspan="5" class="error">Error: ${error.message}</td></tr>`;
    }
}

// Demote admin to user
async function demoteAdmin(userId) {
    if (!confirm('Are you sure you want to remove admin privileges from this user?')) return;
    
    showLoading('Demoting user...');
    try {
        await db.collection('users').doc(userId).update({
            role: 'user',
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        showNotification('User demoted to regular user', 'success');
        loadAdmins();
        loadUsers();
    } catch (error) {
        console.error('Error demoting user:', error);
        showNotification('Error demoting user', 'error');
    } finally {
        hideLoading();
    }
}

// Add new user (by super admin)
async function addNewUser(e) {
    e.preventDefault();
    const fullName = document.getElementById('addFullName').value;
    const username = document.getElementById('addUsername').value;
    const email = document.getElementById('addEmail').value;
    const password = document.getElementById('addPassword').value;
    const phone = document.getElementById('addPhone').value;
    const country = document.getElementById('addCountry').value;
    const favoriteTeam = document.getElementById('addFavoriteTeam').value;
    const role = document.getElementById('addRole').value;
    const initialBalance = parseFloat(document.getElementById('addBalance').value) || 0;
    
    showLoading('Creating user...');
    try {
        // Create Firebase Auth user
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Create user document
        await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            fullName,
            username,
            email,
            phone,
            country,
            favoriteTeam,
            role,
            balance: initialBalance,
            status: 'active',
            referralCode: generateReferralCode(fullName),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showNotification('User created successfully', 'success');
        closeModal('addUserModal');
        document.getElementById('addUserForm').reset();
        loadUsers();
    } catch (error) {
        console.error('Error creating user:', error);
        showNotification('Error creating user: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Add new admin
async function addNewAdmin(e) {
    e.preventDefault();
    const fullName = document.getElementById('adminFullName').value;
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    const role = document.getElementById('adminRole').value;
    
    showLoading('Creating admin...');
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            fullName,
            email,
            role,
            balance: 0,
            status: 'active',
            referralCode: generateReferralCode(fullName),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showNotification('Admin created successfully', 'success');
        closeModal('addAdminModal');
        document.getElementById('addAdminForm').reset();
        loadAdmins();
    } catch (error) {
        console.error('Error creating admin:', error);
        showNotification('Error creating admin: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

// Open add user modal (populate dropdowns)
function openAddUserModal() {
    // Populate country dropdown
    const countrySelect = document.getElementById('addCountry');
    countrySelect.innerHTML = '<option value="">Select Country</option>';
    countries.forEach(c => {
        countrySelect.innerHTML += `<option value="${c.code}">${c.name}</option>`;
    });
    
    // Populate teams dropdown
    const teamSelect = document.getElementById('addFavoriteTeam');
    teamSelect.innerHTML = '<option value="">Select Team</option>';
    footballTeams.forEach(t => {
        teamSelect.innerHTML += `<option value="${t.id}">${t.name}</option>`;
    });
    
    openModal('addUserModal');
}

function openAddAdminModal() {
    openModal('addAdminModal');
}

// Top users by balance and total bet stake
async function loadTopUsers() {
    const container = document.getElementById('topUsersContainer');
    container.innerHTML = '<div class="loading">Loading top users...</div>';
    
    try {
        // Get users sorted by balance
        const balanceSnapshot = await db.collection('users')
            .orderBy('balance', 'desc')
            .limit(10)
            .get();
        
        const topByBalance = [];
        balanceSnapshot.forEach(doc => topByBalance.push({ id: doc.id, ...doc.data() }));
        
        // Get total bet stakes per user (sum of stakes from bets collection)
        const betsSnapshot = await db.collection('bets').get();
        const stakeMap = new Map();
        betsSnapshot.forEach(doc => {
            const bet = doc.data();
            const userId = bet.userId;
            if (userId) {
                stakeMap.set(userId, (stakeMap.get(userId) || 0) + (bet.stake || 0));
            }
        });
        
        // Combine and sort by stake
        const usersWithStake = [];
        for (let [userId, totalStake] of stakeMap.entries()) {
            const userDoc = await db.collection('users').doc(userId).get();
            if (userDoc.exists) {
                usersWithStake.push({ id: userId, ...userDoc.data(), totalStake });
            }
        }
        usersWithStake.sort((a, b) => (b.totalStake || 0) - (a.totalStake || 0));
        const topByStake = usersWithStake.slice(0, 10);
        
        // Render
        let html = '<h4>Top 10 by Balance</h4><div class="top-users-grid">';
        topByBalance.forEach((user, index) => {
            html += `
                <div class="top-user-card">
                    <div class="rank">#${index+1}</div>
                    <div class="user-name">${user.fullName || user.username || user.email}</div>
                    <div class="stats">
                        <span>Balance</span>
                        <span class="value">TZS ${(user.balance || 0).toFixed(2)}</span>
                    </div>
                </div>
            `;
        });
        html += '</div><h4>Top 10 by Total Bet Stake</h4><div class="top-users-grid">';
        topByStake.forEach((user, index) => {
            html += `
                <div class="top-user-card">
                    <div class="rank">#${index+1}</div>
                    <div class="user-name">${user.fullName || user.username || user.email}</div>
                    <div class="stats">
                        <span>Total Stake</span>
                        <span class="value">TZS ${(user.totalStake || 0).toFixed(2)}</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading top users:', error);
        container.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
}

// Generate referral code (reuse from FormHandler)
function generateReferralCode(fullName) {
    let namePart = fullName.split(' ')[0].toUpperCase().substring(0, 3);
    if (namePart.length < 3) namePart = namePart.padEnd(3, 'X');
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `${namePart}${randomDigits}`;
}

// Initialize super admin section when dashboard shows
document.addEventListener('sectionChanged', (e) => {
    if (e.detail.dashboard === 'super-admin-dashboard') {
        // Default to users tab
        setTimeout(() => {
            loadUsers();
            loadAdmins();
        }, 200);
    }
});

        (function() {
            const tabs = document.querySelectorAll('.tab');
            const panels = document.querySelectorAll('.tab-panel');
            
            function deactivateAll() {
                tabs.forEach(tab => {
                    tab.classList.remove('active');
                    tab.setAttribute('aria-selected', 'false');
                });
                panels.forEach(panel => {
                    panel.classList.remove('active-panel');
                });
            }
            
            function activateTab(targetTab) {
                if (!targetTab) return;
                const targetId = targetTab.getAttribute('aria-controls'); // expects panel-1 etc
                const targetPanel = document.getElementById(targetId);
                
                deactivateAll();
                
                targetTab.classList.add('active');
                targetTab.setAttribute('aria-selected', 'true');
                if (targetPanel) {
                    targetPanel.classList.add('active-panel');
                }
            }
            
            // click event
            tabs.forEach(tab => {
                tab.addEventListener('click', (e) => {
                    activateTab(tab);
                });
                
                // basic keyboard support (Enter/Space)
                tab.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        activateTab(tab);
                    }
                });
            });
            
            // optional: if you want to set first tab active by default (already active in html)
            // but we ensure that everything matches the initially active tab (id=tab-1)
            // just in case someone modifies html, we sync on load
            window.addEventListener('load', function() {
                const activeTab = document.querySelector('.tab.active');
                if (!activeTab) {
                    // fallback: activate first tab
                    const firstTab = document.querySelector('.tab');
                    if (firstTab) activateTab(firstTab);
                } else {
                    // ensure corresponding panel is active (if html mismatched)
                    const activeTabId = activeTab.getAttribute('aria-controls');
                    const activePanel = document.getElementById(activeTabId);
                    panels.forEach(p => p.classList.remove('active-panel'));
                    if (activePanel) activePanel.classList.add('active-panel');
                }
            });
        })();

    // ========== SLIDESHOW MANAGEMENT (announcements only) ==========
    const slidesContainer = document.getElementById('slides');
    const prevButton = document.getElementById('prevBtn');
    const nextButton = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('dotsContainer');
    
    let currentIndex = 0;
    let autoInterval = null;
    const AUTO_SPEED = 4000;
    let totalSlides = 0;

    // Helper to get first letter for fallback
    function getInitial(str) {
        return str && str.length > 0 ? str.charAt(0).toUpperCase() : '?';
    }

// Build slides from active announcements (if any), otherwise show placeholder
// Build slides from active announcements (if any), otherwise show placeholder
function buildSlides(announcements) {
    let slidesHtml = '';
    
    if (announcements.length === 0) {
        // Placeholder slide when no active announcements
        slidesHtml = `<div class="slide placeholder-slide"><span>📢 No announcements yet</span><span style="font-size:1.2rem;">Add one in the admin panel</span></div>`;
        totalSlides = 1;
    } else {
        // Build announcement slides
        announcements.forEach(ann => {
            const data = ann.data;
            const type = data.type;
            let innerHtml = '';
            
            if (type === 'text') {
                innerHtml = `
                    <div class="type-badge">📄 text announcement</div>
                    <div class="title">${escapeHtml(data.title || '')}</div>
                    <div class="desc">${escapeHtml(data.description || '')}</div>
                `;
            } else if (type === 'other' && data.mediaUrl) {
                // For slideshow, use isSlideshow = true
                innerHtml = `
                    <div class="type-badge">🖼️ media</div>
                    <div class="title">${escapeHtml(data.title || '')}</div>
                    <div class="desc">${escapeHtml(data.description || '')}</div>
                    ${renderMedia(data.mediaUrl, null, true)}
                `;
            } else if (type === 'match') {
                const homeTeam = escapeHtml(data.homeTeam || 'Home');
                const awayTeam = escapeHtml(data.awayTeam || 'Away');
                const homeLogo = data.homeLogo ? escapeHtml(data.homeLogo) : null;
                const awayLogo = data.awayLogo ? escapeHtml(data.awayLogo) : null;
                
                // Build team logos with fixed fallback - using separate container to prevent duplication
                const homeLogoHtml = homeLogo ?
                    `<div class="logo-container" style="position: relative;">
                        <img src="${homeLogo}" alt="${homeTeam}" 
                             onerror="this.style.display='none'; this.parentElement.querySelector('.fallback-logo').style.display='flex';">
                        <div class="fallback-logo no-logo" style="display: none;">${getInitial(homeTeam)}</div>
                       </div>` :
                    `<div class="no-logo">${getInitial(homeTeam)}</div>`;
                
                const awayLogoHtml = awayLogo ?
                    `<div class="logo-container" style="position: relative;">
                        <img src="${awayLogo}" alt="${awayTeam}" 
                             onerror="this.style.display='none'; this.parentElement.querySelector('.fallback-logo').style.display='flex';">
                        <div class="fallback-logo no-logo" style="display: none;">${getInitial(awayTeam)}</div>
                       </div>` :
                    `<div class="no-logo">${getInitial(awayTeam)}</div>`;
                
                innerHtml = `
                    <div class="type-badge">⚽ match stake</div>
                    <div class="title">${escapeHtml(data.title || '')}</div>
                    <div class="match-teams">
                        <div class="team">${homeLogoHtml}<div>${homeTeam}</div></div>
                        <div class="vs">VS</div>
                        <div class="team">${awayLogoHtml}<div>${awayTeam}</div></div>
                    </div>
                    <div class="stake-box">⚖️ Stake: ${escapeHtml(data.stakeTeam || '?')}  | Odds: ${escapeHtml(data.odds || '?')}</div>
                    <div class="match-time">📅 ${data.matchDateTime ? new Date(data.matchDateTime).toLocaleString() : 'TBD'}</div>
                    <div class="desc">${escapeHtml(data.description || '')}</div>
                `;
            } else {
                // Fallback for unknown type (should not happen)
                innerHtml = `
                    <div class="type-badge">❓ unknown</div>
                    <div class="title">${escapeHtml(data.title || '')}</div>
                    <div class="desc">${escapeHtml(data.description || '')}</div>
                `;
            }
            
            slidesHtml += `<div class="slide announce-slide">${innerHtml}</div>`;
        });
        totalSlides = announcements.length;
    }
    
    slidesContainer.innerHTML = slidesHtml;
    if (currentIndex >= totalSlides) currentIndex = totalSlides - 1;
    if (currentIndex < 0) currentIndex = 0;
    updateSlidePosition();
    createDots();
}

function escapeHtml(unsafe) {
    // Convert to string, handling null/undefined
    const str = unsafe == null ? '' : String(unsafe);
    return str.replace(/[&<>"]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        if (m === '"') return '&quot;';
        return m;
    });
}

    function updateSlidePosition() {
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateActiveDot();
    }
    function updateActiveDot() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, idx) => dot.classList.toggle('active', idx === currentIndex));
    }
    function goToSlide(n) {
        if (totalSlides === 0) return;
        currentIndex = (n + totalSlides) % totalSlides;
        updateSlidePosition();
    }
    function changeSlide(direction) { goToSlide(currentIndex + direction); }

    function createDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.setAttribute('role', 'button');
            dot.addEventListener('click', () => { goToSlide(i); resetAutoPlay(); });
            dotsContainer.appendChild(dot);
        }
        updateActiveDot();
    }

    function startAutoPlay() { stopAutoPlay(); if (totalSlides > 1) autoInterval = setInterval(() => changeSlide(1), AUTO_SPEED); }
    function stopAutoPlay() { if (autoInterval) { clearInterval(autoInterval); autoInterval = null; } }
    function resetAutoPlay() { stopAutoPlay(); startAutoPlay(); }

    // Attach event listeners (once)
    if (prevButton) prevButton.addEventListener('click', () => { changeSlide(-1); resetAutoPlay(); });
    if (nextButton) nextButton.addEventListener('click', () => { changeSlide(1); resetAutoPlay(); });
    const container = document.getElementById('slideshowContainer');
    if (container) { container.addEventListener('mouseenter', stopAutoPlay); container.addEventListener('mouseleave', startAutoPlay); }
    window.addEventListener('keydown', (e) => {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            if (e.key === 'ArrowLeft') { e.preventDefault(); changeSlide(-1); resetAutoPlay(); }
            else if (e.key === 'ArrowRight') { e.preventDefault(); changeSlide(1); resetAutoPlay(); }
        }
    });

    // ========== FIRESTORE: realtime announcements ==========
    const announcementsRef = db.collection('announcements');
const q = announcementsRef.orderBy('createdAt', 'desc');
q.onSnapshot((snapshot) => { 
        const allAnnouncements = [];
        const activeAnnouncements = [];
        snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const docId = docSnap.id;
            allAnnouncements.push({ id: docId, data: { ...data, id: docId } });
            if (data.active !== false) { // active if not false
                activeAnnouncements.push({ id: docId, data });
            }
        });

        // 1. rebuild slideshow with active announcements (or placeholder)
        buildSlides(activeAnnouncements);

        // 2. render user cards (only active)
        let userHtml = '';
        activeAnnouncements.forEach(ann => {
            userHtml += renderUserCard(ann.data);
        });
        document.getElementById('announcementsContainer').innerHTML = userHtml || '<div style="color:white;">No active announcements</div>';

        // 3. render admin list (all announcements)
        // 3. render admin list (all announcements) with working actions
let adminHtml = '';
allAnnouncements.forEach(ann => {
    const data = ann.data;
    const activeBadge = data.active === false ? '<span class="inactive-badge">inactive</span>' : '<span class="active-badge">active</span>';
    
    adminHtml += `
        <div class="admin-item" data-id="${ann.id}">
            <div class="admin-item-info">
                <strong>${escapeHtml(data.title) || 'no title'}</strong> (${data.type}) ${activeBadge}<br>
                <small>${escapeHtml(data.description?.substring(0,50))}...</small>
            </div>
            <div class="admin-actions">
                <button class="btn-small btn" onclick="editAnnouncement('${ann.id}')">✏️ Edit</button>
                <button class="btn-small btn" onclick="toggleAnnouncement('${ann.id}')">${data.active ? '🔴 Deactivate' : '🟢 Activate'}</button>
                <button class="btn-small btn" onclick="deleteAnnouncement('${ann.id}')">🗑️ Delete</button>
            </div>
        </div>
    `;
});
document.getElementById('adminListContainer').innerHTML = adminHtml || '<div style="color:#ccc;">No announcements yet</div>';
        document.getElementById('adminListContainer').innerHTML = adminHtml || '<div style="color:#ccc;">No announcements yet</div>';

        // Attach admin listeners (edit, toggle, delete)
        document.querySelectorAll('[data-edit]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.edit;
                const ann = allAnnouncements.find(a => a.id === id);
                if (ann) fillFormForEdit(ann.data, id);
            });
        });
        document.querySelectorAll('[data-toggle]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.toggle;
                const ann = allAnnouncements.find(a => a.id === id);
                if (ann) {
                    await updateDoc(doc(db, 'announcements', id), { active: !ann.data.active });
                }
            });
        });
        document.querySelectorAll('[data-delete]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (confirm('Delete announcement?')) {
                    const id = e.target.dataset.delete;
                    await deleteDoc(doc(db, 'announcements', id));
                }
            });
        });
    });

    // Helper to render user card (match cards also use fallback, no placeholder)
// Helper to render user card (match cards also use fallback, no placeholder)
// Helper to render user card (match cards also use fallback, no placeholder)
function renderUserCard(data) {
    const type = data.type;
    let extra = '';
    
    if (type === 'other' && data.mediaUrl) {
        // For user cards, use isSlideshow = false
        extra = renderMedia(data.mediaUrl, null, false);
    } else if (type === 'match') {
        const homeTeam = escapeHtml(data.homeTeam || 'Home');
        const awayTeam = escapeHtml(data.awayTeam || 'Away');
        const homeLogo = data.homeLogo ? escapeHtml(data.homeLogo) : null;
        const awayLogo = data.awayLogo ? escapeHtml(data.awayLogo) : null;
        
        // Build team logos with fixed fallback - using separate container to prevent duplication
        const homeLogoHtml = homeLogo ?
            `<div class="logo-container" style="position: relative; display: inline-block;">
                <img src="${homeLogo}" alt="${homeTeam}" 
                     onerror="this.style.display='none'; this.parentElement.querySelector('.fallback-logo-small').style.display='flex';"
                     style="max-width: 45px; max-height: 45px;">
                <div class="fallback-logo-small no-logo-small" style="display: none; width:45px; height:45px; border-radius:50%; background:#113745; border:2px solid goldenrod; display:none; align-items:center; justify-content:center; font-size:1rem; font-weight:bold; color:white;">${getInitial(homeTeam)}</div>
               </div>` :
            `<div class="no-logo-small">${getInitial(homeTeam)}</div>`;
        
        const awayLogoHtml = awayLogo ?
            `<div class="logo-container" style="position: relative; display: inline-block;">
                <img src="${awayLogo}" alt="${awayTeam}" 
                     onerror="this.style.display='none'; this.parentElement.querySelector('.fallback-logo-small').style.display='flex';"
                     style="max-width: 45px; max-height: 45px;">
                <div class="fallback-logo-small no-logo-small" style="display: none; width:45px; height:45px; border-radius:50%; background:#113745; border:2px solid goldenrod; display:none; align-items:center; justify-content:center; font-size:1rem; font-weight:bold; color:white;">${getInitial(awayTeam)}</div>
               </div>` :
            `<div class="no-logo-small">${getInitial(awayTeam)}</div>`;
        
        extra = `
            <div class="match-teams">
                <div class="team">${homeLogoHtml}<div>${homeTeam}</div></div>
                <div class="vs">VS</div>
                <div class="team">${awayLogoHtml}<div>${awayTeam}</div></div>
            </div>
            <div class="stake-info">⚖️ Stake: ${escapeHtml(data.stakeTeam || '?')}  | Odds: ${escapeHtml(data.odds || '?')}</div>
            <div class="match-time">📅 ${data.matchDateTime ? new Date(data.matchDateTime).toLocaleString() : 'TBD'}</div>
        `;
    }
    
    return `
        <div class="announce-card">
            <span class="card-type">${escapeHtml(type)}</span>
            <div class="card-title">${escapeHtml(data.title || '')}</div>
            <div class="card-desc">${escapeHtml(data.description || '')}</div>
            ${extra}
        </div>
    `;
}
    
    

    // ========== ADMIN FORM (unchanged) ==========
    const announceType = document.getElementById('announceType');
    const titleInput = document.getElementById('titleInput');
    const descInput = document.getElementById('descInput');
    const mediaLinkGroup = document.getElementById('mediaLinkGroup');
    const mediaUrlInput = document.getElementById('mediaUrlInput');
    const matchFields = document.getElementById('matchFields');
    const homeTeam = document.getElementById('homeTeam');
    const awayTeam = document.getElementById('awayTeam');
    const homeLogo = document.getElementById('homeLogo');
    const awayLogo = document.getElementById('awayLogo');
    const stakeTeam = document.getElementById('stakeTeam');
    const odds = document.getElementById('odds');
    const matchDateTime = document.getElementById('matchDateTime');
    const addBtn = document.getElementById('addAnnouncementBtn');
    const editId = document.getElementById('editId');

    document.getElementById('adminToggle').addEventListener('click', () => {
        const content = document.getElementById('adminContent');
        const toggle = document.getElementById('toggleBtn');
        content.classList.toggle('hidden');
        toggle.innerText = content.classList.contains('hidden') ? '▶' : '▼';
    });

    function toggleFields() {
        const type = announceType.value;
        mediaLinkGroup.style.display = type === 'other' ? 'block' : 'none';
        matchFields.style.display = type === 'match' ? 'block' : 'none';
    }
    announceType.addEventListener('change', toggleFields);
    toggleFields();

    function resetForm() {
        editId.value = '';
        titleInput.value = ''; descInput.value = ''; mediaUrlInput.value = '';
        homeTeam.value = ''; awayTeam.value = ''; homeLogo.value = ''; awayLogo.value = ''; stakeTeam.value = ''; odds.value = ''; matchDateTime.value = '';
        announceType.value = 'text';
        toggleFields();
    }
    window.resetForm = resetForm;

    function fillFormForEdit(data, id) {
        editId.value = id;
        announceType.value = data.type || 'text';
        titleInput.value = data.title || '';
        descInput.value = data.description || '';
        if (data.type === 'other') {
            mediaUrlInput.value = data.mediaUrl || '';
        } else if (data.type === 'match') {
            homeTeam.value = data.homeTeam || '';
            awayTeam.value = data.awayTeam || '';
            homeLogo.value = data.homeLogo || '';
            awayLogo.value = data.awayLogo || '';
            stakeTeam.value = data.stakeTeam || '';
            odds.value = data.odds || '';
            matchDateTime.value = data.matchDateTime || '';
        }
        toggleFields();
    }

addBtn.addEventListener('click', async () => {
    const type = announceType.value;
    const baseData = {
        type,
        title: titleInput.value,
        description: descInput.value,
        active: true,
        createdAt: new Date().toISOString(),
    };

    if (type === 'other') {
        baseData.mediaUrl = mediaUrlInput.value;
    } else if (type === 'match') {
        baseData.homeTeam = homeTeam.value;
        baseData.awayTeam = awayTeam.value;
        baseData.homeLogo = homeLogo.value;
        baseData.awayLogo = awayLogo.value;
        baseData.stakeTeam = stakeTeam.value;
        baseData.odds = odds.value;
        baseData.matchDateTime = matchDateTime.value;
    }

    try {
        if (editId.value) {
            await db.collection('announcements').doc(editId.value).update(baseData);
        } else {
            await db.collection('announcements').add(baseData);
        }
        resetForm();
    } catch (error) {
        console.error('Error saving announcement:', error);
        alert('Error: ' + error.message);
    }
});
    
    
// ==================== ANNOUNCEMENT MANAGEMENT FUNCTIONS ====================

/**
 * Delete a single announcement by ID
 * @param {string} announcementId - The ID of the announcement to delete
 */
async function deleteAnnouncement(announcementId) {
    if (!announcementId) {
        showNotification('No announcement ID provided', 'error');
        return;
    }

    // Show confirmation dialog
    if (!confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
        return;
    }

    showLoading('Deleting announcement...');

    try {
        await db.collection('announcements').doc(announcementId).delete();
        showNotification('Announcement deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting announcement:', error);
        showNotification('Error deleting announcement: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

/**
 * Toggle announcement active status
 * @param {string} announcementId - The announcement ID
 */
async function toggleAnnouncement(announcementId) {
    if (!announcementId) return;

    showLoading('Updating status...');

    try {
        // Get current status first
        const doc = await db.collection('announcements').doc(announcementId).get();
        if (!doc.exists) {
            showNotification('Announcement not found', 'error');
            return;
        }

        const currentStatus = doc.data().active;
        const newStatus = !currentStatus;

        await db.collection('announcements').doc(announcementId).update({
            active: newStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        showNotification(`Announcement ${newStatus ? 'activated' : 'deactivated'} successfully!`, 'success');
    } catch (error) {
        console.error('Error toggling announcement status:', error);
        showNotification('Error updating status: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

/**
 * Edit announcement - populate form with existing data
 * @param {string} announcementId - The announcement ID to edit
 */
async function editAnnouncement(announcementId) {
    if (!announcementId) return;

    showLoading('Loading announcement...');

    try {
        const doc = await db.collection('announcements').doc(announcementId).get();
        if (!doc.exists) {
            showNotification('Announcement not found', 'error');
            return;
        }

        const data = doc.data();
        
        // Populate the form
        document.getElementById('announceType').value = data.type || 'text';
        document.getElementById('titleInput').value = data.title || '';
        document.getElementById('descInput').value = data.description || '';
        document.getElementById('editId').value = announcementId;

        // Show/hide appropriate fields based on type
        toggleFields();

        // Populate type-specific fields
        if (data.type === 'other') {
            document.getElementById('mediaUrlInput').value = data.mediaUrl || '';
        } else if (data.type === 'match') {
            document.getElementById('homeTeam').value = data.homeTeam || '';
            document.getElementById('awayTeam').value = data.awayTeam || '';
            document.getElementById('homeLogo').value = data.homeLogo || '';
            document.getElementById('awayLogo').value = data.awayLogo || '';
            document.getElementById('stakeTeam').value = data.stakeTeam || '';
            document.getElementById('odds').value = data.odds || '';
            document.getElementById('matchDateTime').value = data.matchDateTime || '';
        }

        // Scroll to form
        document.getElementById('adminContent').scrollIntoView({ behavior: 'smooth' });
        
        showNotification('Announcement loaded for editing', 'success');
    } catch (error) {
        console.error('Error loading announcement for edit:', error);
        showNotification('Error loading announcement: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

/**
 * Delete multiple announcements at once
 * @param {string[]} announcementIds - Array of announcement IDs to delete
 */
async function deleteMultipleAnnouncements(announcementIds) {
    if (!announcementIds || announcementIds.length === 0) {
        showNotification('No announcements selected', 'error');
        return;
    }

    if (!confirm(`Are you sure you want to delete ${announcementIds.length} announcement(s)? This action cannot be undone.`)) {
        return;
    }

    showLoading('Deleting announcements...');

    try {
        const batch = db.batch();
        announcementIds.forEach(id => {
            const ref = db.collection('announcements').doc(id);
            batch.delete(ref);
        });
        await batch.commit();
        showNotification(`${announcementIds.length} announcement(s) deleted successfully!`, 'success');
    } catch (error) {
        console.error('Error deleting multiple announcements:', error);
        showNotification('Error deleting announcements: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

/**
 * Delete all announcements (admin only)
 */
async function deleteAllAnnouncements() {
    // Check if user is admin
    const userData = window.authManager?.userData;
    if (!userData || (userData.role !== 'admin' && userData.role !== 'superadmin')) {
        showNotification('Admin access required', 'error');
        return;
    }

    if (!confirm('⚠️ WARNING: You are about to delete ALL announcements. This action cannot be undone. Are you absolutely sure?')) {
        return;
    }

    // Double confirmation for safety
    if (!confirm('Type "DELETE" to confirm:')) {
        return;
    }

    showLoading('Deleting all announcements...');

    try {
        const snapshot = await db.collection('announcements').get();
        
        if (snapshot.empty) {
            showNotification('No announcements to delete', 'info');
            hideLoading();
            return;
        }

        const batch = db.batch();
        snapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        showNotification(`Successfully deleted ${snapshot.size} announcement(s)`, 'success');
    } catch (error) {
        console.error('Error deleting all announcements:', error);
        showNotification('Error deleting announcements: ' + error.message, 'error');
    } finally {
        hideLoading();
    }
}

/**
 * Add bulk selection controls to admin panel
 */
function addBulkSelectionControls() {
    const adminListContainer = document.getElementById('adminListContainer');
    if (!adminListContainer) return;

    // Add select all checkbox and delete selected button if they don't exist
    if (!document.getElementById('bulkControls')) {
        const bulkControls = document.createElement('div');
        bulkControls.id = 'bulkControls';
        bulkControls.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding: 0.5rem;';
        bulkControls.innerHTML = `
            <div>
                <input type="checkbox" id="selectAllAnnouncements" style="margin-right: 0.5rem;">
                <label for="selectAllAnnouncements">Select All</label>
            </div>
            <button class="btn-small btn" id="deleteSelectedBtn" style="background: #dc3545;" disabled>
                <i class="fas fa-trash"></i> Delete Selected
            </button>
        `;
        
        // Insert before admin list
        const adminContent = document.getElementById('adminContent');
        if (adminContent) {
            adminContent.insertBefore(bulkControls, adminListContainer);
        }
    }

    // Add checkboxes to each admin item
    const adminItems = document.querySelectorAll('.admin-item');
    adminItems.forEach(item => {
        if (!item.querySelector('.announcement-select')) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'announcement-select';
            checkbox.value = item.dataset.id;
            checkbox.style.marginRight = '1rem';
            
            // Wrap existing content
            const infoDiv = item.querySelector('.admin-item-info');
            if (infoDiv) {
                const wrapper = document.createElement('div');
                wrapper.style.display = 'flex';
                wrapper.style.alignItems = 'center';
                wrapper.style.gap = '1rem';
                wrapper.style.flex = '1';
                
                item.insertBefore(wrapper, infoDiv);
                wrapper.appendChild(checkbox);
                wrapper.appendChild(infoDiv);
            }
        }
    });

    // Initialize bulk selection handlers
    initBulkSelectionHandlers();
}

/**
 * Initialize bulk selection handlers
 */
function initBulkSelectionHandlers() {
    const selectAllCheckbox = document.getElementById('selectAllAnnouncements');
    const itemCheckboxes = document.querySelectorAll('.announcement-select');
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');

    if (!selectAllCheckbox || itemCheckboxes.length === 0) return;

    // Remove existing listeners
    const newSelectAll = selectAllCheckbox.cloneNode(true);
    selectAllCheckbox.parentNode.replaceChild(newSelectAll, selectAllCheckbox);

    newSelectAll.addEventListener('change', (e) => {
        document.querySelectorAll('.announcement-select').forEach(cb => {
            cb.checked = e.target.checked;
        });
        updateDeleteSelectedButton();
    });

    // Update individual checkboxes
    document.querySelectorAll('.announcement-select').forEach(cb => {
        const newCb = cb.cloneNode(true);
        cb.parentNode.replaceChild(newCb, cb);
        
        newCb.addEventListener('change', () => {
            updateSelectAllCheckbox();
            updateDeleteSelectedButton();
        });
    });

    // Delete selected button
    if (deleteSelectedBtn) {
        const newDeleteBtn = deleteSelectedBtn.cloneNode(true);
        deleteSelectedBtn.parentNode.replaceChild(newDeleteBtn, deleteSelectedBtn);
        
        newDeleteBtn.addEventListener('click', async () => {
            const selectedIds = Array.from(document.querySelectorAll('.announcement-select'))
                .filter(cb => cb.checked)
                .map(cb => cb.value);

            if (selectedIds.length > 0) {
                await deleteMultipleAnnouncements(selectedIds);
            }
        });
    }

    function updateSelectAllCheckbox() {
        const allCheckboxes = document.querySelectorAll('.announcement-select');
        const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
        const someChecked = Array.from(allCheckboxes).some(cb => cb.checked);
        
        newSelectAll.checked = allChecked;
        newSelectAll.indeterminate = someChecked && !allChecked;
    }

    function updateDeleteSelectedButton() {
        const selectedCount = document.querySelectorAll('.announcement-select:checked').length;
        if (newDeleteBtn) {
            newDeleteBtn.disabled = selectedCount === 0;
            newDeleteBtn.innerHTML = selectedCount > 0 
                ? `<i class="fas fa-trash"></i> Delete Selected (${selectedCount})` 
                : `<i class="fas fa-trash"></i> Delete Selected`;
        }
    }
}

// ==================== SAFE MEDIA DETECTION HELPERS ====================
function isImageUrl(url) {
    if (url == null) return false;
    const urlStr = String(url);
    const imageExtensions = /\.(jpeg|jpg|gif|png|webp|bmp|svg)$/i;
    return imageExtensions.test(urlStr.split('?')[0]); // remove query params
}

function isVideoUrl(url) {
    if (url == null) return false;
    const urlStr = String(url);
    const videoExtensions = /\.(mp4|webm|ogg|mov|avi|wmv|flv)$/i;
    // Check direct video files
    if (videoExtensions.test(urlStr.split('?')[0])) return true;
    // Check YouTube
    if (urlStr.includes('youtube.com/watch') || urlStr.includes('youtu.be/') || urlStr.includes('youtube.com/embed')) return true;
    // Check Vimeo
    if (urlStr.includes('vimeo.com')) return true;
    return false;
}

function detectMediaType(url) {
    if (url == null) return null;
    const urlStr = String(url);
    // YouTube detection
    if (urlStr.includes('youtube.com') || urlStr.includes('youtu.be')) {
        return 'youtube';
    }
    // Direct video file extensions
    if (urlStr.match(/\.(mp4|webm|ogg|mov|avi|wmv|flv)$/i)) {
        return 'video';
    }
    // Image file extensions
    if (urlStr.match(/\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i)) {
        return 'image';
    }
    // Default to image (or you could treat as unknown)
    return 'image';
}

function extractYouTubeId(url) {
    if (url == null) return null;
    const urlStr = String(url);
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = urlStr.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function getYouTubeEmbedUrl(url) {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

function getVimeoEmbedUrl(url) {
    if (url == null) return null;
    const urlStr = String(url);
    const vimeoMatch = urlStr.match(/vimeo\.com\/(\d+)/);
    return vimeoMatch ? `https://player.vimeo.com/video/${vimeoMatch[1]}` : null;
}

function renderMedia(mediaUrl, mediaType = null, isSlideshow = false) {
    if (mediaUrl == null) return '';
    
    const type = mediaType || detectMediaType(mediaUrl);
    const escapedUrl = escapeHtml(String(mediaUrl));
    
    switch (type) {
        case 'youtube': {
            const videoId = extractYouTubeId(mediaUrl);
            if (!videoId) return '';
            
            // For slideshow, enable autoplay, mute, loop, and hide controls
            if (isSlideshow) {
                return `
                    <div class="slide-media">
                        <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}" 
                                frameborder="0" 
                                allow="autoplay; encrypted-media" 
                                allowfullscreen>
                        </iframe>
                    </div>
                `;
            } else {
                return `
                    <div class="announcement-media">
                        <iframe src="https://www.youtube.com/embed/${videoId}" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                        </iframe>
                    </div>
                `;
            }
        }
        
        case 'video': {
            // Direct video file (mp4, webm, etc.)
            if (isSlideshow) {
                return `
                    <div class="slide-media">
                        <video controls loop muted>
                            <source src="${escapedUrl}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                `;
            } else {
                return `
                    <div class="announcement-media">
                        <video controls>
                            <source src="${escapedUrl}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                `;
            }
        }
        
        case 'image':
        default: {
            if (isSlideshow) {
                return `<div class="slide-media"><img src="${escapedUrl}" alt="Announcement image"></div>`;
            } else {
                return `<div class="announcement-media"><img src="${escapedUrl}" alt="Announcement image"></div>`;
            }
        }
    }
}

document.getElementById('mediaUrlInput').addEventListener('input', function(e) {
    const url = e.target.value;
    const previewContainer = document.getElementById('mediaPreview');
    if (url) {
        previewContainer.innerHTML = renderMedia(url, null, false);
    } else {
        previewContainer.innerHTML = '';
    }
});

// ==================== COMPLETE LANGUAGE TRANSLATIONS ====================
const translations = {
    en: {
        // ===== APP NAME =====
        appName: "Football Canvas Hub",
        appNameShort: "FootballHub",
        appTitle: "Football Canvas Hub",
        
        // ===== AUTH SECTION =====
        signIn: "Sign In",
        signUp: "Sign Up",
        welcomeBack: "Welcome Back",
        signInToDashboard: "Sign in to access your dashboard",
        createAccount: "Create Account",
        joinCommunity: "Join our football community today",
        
        // Form fields
        emailAddress: "Email Address",
        password: "Password",
        confirmPassword: "Confirm Password",
        fullName: "Full Name",
        username: "Username",
        phone: "Phone",
        country: "Country",
        favoriteTeam: "Favorite Team",
        referralCode: "Referral Code (Optional)",
        enterEmail: "Enter your email",
        enterPassword: "Enter your password",
        enterFullName: "Enter your full name",
        chooseUsername: "Choose username",
        enterPhone: "Phone number",
        selectCountry: "Select your country",
        selectTeam: "Select favorite team",
        enterReferralCode: "Enter referral code from a friend",
        leaveBlank: "Leave blank if you don't have one",
        
        // Form options
        rememberMe: "Remember me",
        forgotPassword: "Forgot Password?",
        agreeToTerms: "I agree to the Terms & Conditions and Privacy Policy",
        termsAndConditions: "Terms & Conditions",
        privacyPolicy: "Privacy Policy",
        
        // Buttons
        signInBtn: "Sign In",
        createAccountBtn: "Create Account",
        signInInstead: "Sign In Instead",
        
        // Admin/Super Admin
        adminPassword: "Admin Password",
        superAdminPassword: "Super Admin Password",
        adminAccess: "Admin access detected",
        superAdminAccess: "Super Admin access detected",
        
        // Verification
        verificationNumber: "Verification Number",
        enterVerification: "Enter the number above",
        incorrectVerification: "Incorrect verification number. A new code has been generated.",
        
        // ===== DASHBOARD COMMON =====
        dashboard: "Dashboard",
        myWallet: "My Wallet",
        myBets: "My Bets",
        matches: "Matches",
        profile: "Profile",
        aboutUs: "About Us",
        logout: "Logout",
        loading: "Loading...",
        welcome: "Welcome",
        
        // ===== USER DASHBOARD =====
        manageWallet: "Manage your transaction and bank account",
        availableBalance: "Available Balance",
        deposit: "Deposit",
        withdraw: "Withdraw",
        account: "Account",
        
        // Deposit section
        choosePaymentMethod: "Choose Payment Method",
        fillDetails: "Fill Details",
        confirmTransaction: "Confirm Transaction",
        selectPaymentMethod: "Select Payment Method",
        vodacomMpesa: "Vodacom M-PESA",
        airtelMoney: "Airtel Money",
        halopesa: "Halopesa",
        lipaKwaSimu: "Lipa kwa Simu",
        crdb: "CRDB",
        nmb: "NMB",
        tpesa: "T-PESA",
        yasMixx: "YAS Mixx",
        
        enterYourDetails: "Enter Your Details",
        fullNameLabel: "Full Name",
        mobileNumber: "Mobile Number",
        amount: "Amount (TZS)",
        continue: "Continue",
        paymentInstructions: "Payment Instructions",
        transactionId: "Transaction ID / Reference Number",
        uploadScreenshot: "Upload Payment Screenshot (Optional)",
        submitForApproval: "Submit for Approval",
        
        // Withdrawal section
        requestWithdrawal: "Request Withdrawal",
        currentBalance: "Current Balance",
        amountToWithdraw: "Amount to Withdraw (TZS)",
        serviceFee: "Service Fee (15%)",
        youWillReceive: "You'll Receive",
        selectAccount: "Select Account",
        accountFullName: "Account Full Name",
        accountNumber: "Account Number",
        mobileNumberConfirm: "Mobile Number (for confirmation)",
        submitWithdrawalRequest: "Submit Withdrawal Request",
        
        // Account management
        myWithdrawalAccounts: "My Withdrawal Accounts",
        addManageAccounts: "Add and manage your bank/mobile money accounts for withdrawals",
        addNewAccount: "Add New Account",
        accountType: "Account Type",
        mobileMoney: "Mobile Money",
        bankAccount: "Bank Account",
        mobileProvider: "Mobile Provider",
        bankProvider: "Bank Provider",
        accountName: "Account Name",
        enterAccountName: "e.g., My Account",
        enterAccountNumber: "Account number",
        setAsDefault: "Set as default withdrawal account",
        saveAccount: "Save Account",
        yourAccounts: "Your Accounts",
        loadingAccounts: "Loading accounts...",
        noAccounts: "You haven't added any withdrawal accounts yet.",
        default: "Default",
        
        // ===== BETTING SECTION =====
        predictReverseBetting: "Predict reverse betting",
        availableMatches: "Available Matches",
        loadingMatches: "Loading matches...",
        noMatches: "No matches available",
        checkBackLater: "Check back later for upcoming matches",
        errorLoadingMatches: "Error loading matches",
        
        // Match card
        homeWin: "Home Win",
        draw: "Draw",
        awayWin: "Away Win",
        winPercent: "Win {0}%",
        singleBet: "Single Bet (TZS)",
        
        // VIP betting
        vipMultiBet: "VIP Multi-Bet",
        selections: "selections",
        combinedOdds: "Combined Odds",
        stakeAmount: "Stake Amount (TZS)",
        potentialReturn: "Potential Return",
        profit: "Profit",
        placeVipBet: "Place VIP Multi-Bet ({0} selections)",
        clearAll: "Clear All",
        removedFromMulti: "Removed from VIP multi-bet",
        addedToMulti: "Added to VIP multi-bet",
        vipTierLimit: "Your VIP tier ({0}) allows maximum {1} selections",
        
        // Bet slip
        placeYourBet: "Place Your Bet",
        yourSelection: "Your Selection",
        against: "Against {0}",
        winPercentage: "Win {0}% of stake",
        stake: "Stake",
        potentialProfit: "Potential Profit",
        totalReturn: "Total Return",
        placeSingleBet: "Place Single Bet",
        
        // My bets
        bettingRecords: "Betting Records",
        predictOutcomes: "Predict outcomes and earn points",
        myBettingHistory: "My Betting History",
        matchBet: "Match/Bet",
        type: "Type",
        stakeTzs: "Stake (TZS)",
        odds: "Odds",
        profit: "Profit",
        status: "Status",
        date: "Date",
        noBets: "No bets placed yet",
        
        // Bet status
        pending: "Pending",
        won: "WON",
        lost: "LOST",
        refunded: "REFUNDED",
        
        // ===== PROFILE SECTION =====
        myProfile: "My Profile",
        manageAccount: "Manage your account settings",
        memberSince: "Member Since",
        daysActive: "Days Active",
        correctPredictions: "Correct Predictions",
        totalPoints: "Total Points",
        winRate: "Win Rate",
        notSet: "Not Set",
        notProvided: "Not provided",
        notSelected: "Not selected",
        
        // ===== ABOUT SECTION =====
        whatWeDo: "What We Do",
        aboutService: "About our service",
        aboutUs: "About Us",
        faq: "FAQ's",
        privacyPolicy: "Privacy Policy",
        termsConditions: "Terms & Conditions",
        
        // About content
        welcomeToHub: "Welcome to Football Canvas Hub",
        aboutDescription: "Football Canvas Hub is a premier online community for football enthusiasts. We offer a unique platform where fans can predict match outcomes, compete with friends, and earn rewards – all while celebrating the beautiful game.",
        ourMission: "Our Mission",
        missionText: "To enhance the football experience by providing an interactive, transparent, and rewarding environment for fans worldwide. We believe every match is an opportunity to engage, learn, and win.",
        whatWeOffer: "What We Offer",
        livePredictions: "Live Match Predictions: Predict outcomes of upcoming matches and earn points.",
        vipMultiBets: "VIP Multi-Bets: Combine multiple selections for higher returns.",
        secureWallet: "Secure Wallet: Easy deposits and withdrawals with 15% fee on withdrawals.",
        referralProgram: "Referral Program: Earn 10% commission on your friends' first deposits.",
        support247: "24/7 Support: Real‑time chat with our support team.",
        ourValues: "Our Values",
        valuesText: "Transparency: Clear rules and instant payouts. Community: A place for fans to connect. Innovation: Continuously improving the platform.",
        ourTeam: "Our Team",
        teamText: "We are a group of football lovers and tech enthusiasts dedicated to building the ultimate fan experience. Based in Tanzania, we serve users across Africa and beyond.",
        joinUs: "Join us and turn your football knowledge into rewards!",
        
        // FAQ content
        faqTitle: "Frequently Asked Questions",
        faqDeposit: "How do I deposit money?",
        faqDepositAnswer: "Go to your Wallet, choose Deposit, select a payment method (Vodacom M-PESA, Airtel Money, etc.), enter the amount, and follow the instructions. You'll receive a transaction ID after payment. Submit it for approval – funds are added once confirmed.",
        faqWithdraw: "How do I withdraw my winnings?",
        faqWithdrawAnswer: "In the Wallet, choose Withdraw. Select your bank account, enter the amount (minimum TZS 5,000), and confirm. A 15% fee applies. Withdrawals are processed after admin approval (usually within 24 hours).",
        faqRules: "What are the betting rules?",
        faqRulesAnswer: "You bet on match outcomes (Home Win, Draw, Away Win). If the actual result is OPPOSITE to your selection, you win a percentage of your stake based on the match odds. If the result matches your bet, you lose the stake. Multi‑bets combine several selections – all must win to get the combined payout.",
        faqReferral: "How does the referral program work?",
        faqReferralAnswer: "Share your unique referral code or link. When a friend signs up and makes their FIRST deposit, you earn 10% of that deposit instantly. There's no limit on referrals – the more you refer, the more you earn.",
        faqPassword: "I forgot my password. What should I do?",
        faqPasswordAnswer: "Click 'Forgot Password?' on the login page. Enter your email, and we'll send a reset link. Follow the instructions to set a new password.",
        faqBlocked: "Why is my account blocked?",
        faqBlockedAnswer: "Accounts may be blocked for suspicious activity, violation of terms, or security reasons. Contact support via chat to resolve the issue.",
        faqWithdrawTime: "How long do withdrawals take?",
        faqWithdrawTimeAnswer: "Withdrawals are usually processed within 24 hours after admin approval. Once approved, the money is sent to your account (bank or mobile money) and may take additional time depending on the provider.",
        faqUpdateInfo: "Can I change my personal information?",
        faqUpdateInfoAnswer: "Yes, go to Profile → Account Settings. You can update your name, phone, country, and favorite team. Email cannot be changed for security reasons.",
        faqSecurity: "Is my information secure?",
        faqSecurityAnswer: "Absolutely. We use industry‑standard encryption and Firebase security. Your personal data is never shared with third parties without your consent.",
        
        // Privacy Policy
        privacyTitle: "Privacy Policy",
        privacyInfoCollect: "1. Information We Collect",
        privacyInfoCollectText: "We collect personal information you provide when registering, such as name, email, phone number, and payment details. We also collect usage data through cookies and analytics.",
        privacyHowUse: "2. How We Use Your Information",
        privacyHowUseText: "We use your information to provide services, process transactions, improve our Platform, and communicate with you. We may use your email for service-related announcements.",
        privacySharing: "3. Sharing of Information",
        privacySharingText: "We do not sell your personal information. We may share it with trusted third-party service providers (payment processors, analytics) who are bound by confidentiality. We may disclose information if required by law.",
        privacySecurity: "4. Data Security",
        privacySecurityText: "We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure. You are responsible for keeping your account credentials safe.",
        privacyCookies: "5. Cookies",
        privacyCookiesText: "We use cookies to enhance your experience, remember preferences, and analyze traffic. You can disable cookies in your browser, but some features may not function properly.",
        privacyThirdParty: "6. Third-Party Links",
        privacyThirdPartyText: "The Platform may contain links to external sites. We are not responsible for their privacy practices. We encourage you to review their policies.",
        privacyChildren: "7. Children's Privacy",
        privacyChildrenText: "Our services are not directed to individuals under 18. We do not knowingly collect information from minors. If you become aware that a minor has provided data, please contact us.",
        privacyChanges: "8. Changes to This Policy",
        privacyChangesText: "We may update this Privacy Policy. Changes will be posted here with an updated revision date. Your continued use signifies acceptance.",
        privacyRights: "9. Your Rights",
        privacyRightsText: "You have the right to access, correct, or delete your personal data. To exercise these rights, please contact us at privacy@footballcanvas.com.",
        lastUpdated: "Last updated: February 2026",
        
        // Terms & Conditions
        termsTitle: "Terms and Conditions",
        termsAcceptance: "1. Acceptance of Terms",
        termsAcceptanceText: "By accessing or using Football Canvas Hub ('the Platform'), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the Platform.",
        termsEligibility: "2. Eligibility",
        termsEligibilityText: "You must be at least 18 years old to use this Platform. By using the Platform, you represent and warrant that you are 18 or older.",
        termsAccount: "3. Account Registration",
        termsAccountText: "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use. You are liable for all activities under your account.",
        termsDeposits: "4. Deposits and Withdrawals",
        termsDepositsText: "All deposits are processed through third-party payment providers. Withdrawals are subject to a 15% processing fee and may take up to 3 business days. Minimum withdrawal amount is TZS 5,000.",
        termsBetting: "5. Betting Rules",
        termsBettingText: "Users win when the match result is opposite to their selected outcome. Payouts are based on the odds percentages set for each match. The Platform reserves the right to void any bet if fraud is suspected.",
        termsReferral: "6. Referral Program",
        termsReferralText: "Referrers earn 10% commission on the first deposit of referred users. Commission is credited instantly upon deposit approval. Abuse of the referral system may result in forfeiture of earnings.",
        termsProhibited: "7. Prohibited Activities",
        termsProhibitedText: "You may not use the Platform for any illegal activity, attempt to manipulate the system, or engage in any form of fraud. Violation may lead to account suspension and forfeiture of funds.",
        termsLiability: "8. Limitation of Liability",
        termsLiabilityText: "The Platform is provided 'as is' without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Platform.",
        termsChanges: "9. Changes to Terms",
        termsChangesText: "We may modify these Terms at any time. Continued use after changes constitutes acceptance. It is your responsibility to review the Terms periodically.",
        termsContact: "10. Contact Information",
        termsContactText: "For questions or concerns, please contact us at support@footballcanvas.com or through our support chat.",
        
        // ===== ANNOUNCEMENTS =====
        announcements: "Announcements",
        latestAnnouncements: "Latest announcements",
        noAnnouncements: "No active announcements",
        addAnnouncement: "Add announcement",
        
        // ===== CHAT =====
        support: "SUPPORT",
        supportChat: "Support Chat",
        typeMessage: "Type your message...",
        send: "Send",
        quickQuestions: "Quick Questions",
        howToDeposit: "How to deposit?",
        howToWithdraw: "How to withdraw?",
        howToStake: "How to stake bet?",
        recentResults: "Recent results",
        todaysMatches: "Today's matches",
        
        // Admin chat
        adminSupport: "Admin Support Conversations",
        manageUsers: "Manage users and platform content",
        addNewUser: "Add New User",
        activeChats: "Active Chats",
        selectUser: "Select a user to start chatting",
        standardReply: "Standard reply",
        escalate: "Escalate",
        needMoreInfo: "Need more info",
        
        // ===== ADMIN DASHBOARD =====
        adminDashboard: "Admin Dashboard",
        approvals: "Approvals",
        transactionHistory: "Transaction History",
        bankingSettings: "Banking Settings",
        manageAnnouncements: "Manage Announcements",
        
        // Admin banking
        pendingApprovals: "Pending Approvals",
        approved: "Approved",
        rejected: "Rejected",
        searchUser: "Search by User ID or Email",
        allTypes: "All Types",
        deposits: "Deposits",
        withdrawals: "Withdrawals",
        fees: "Fees",
        totalDeposits: "Total Deposits",
        totalWithdrawals: "Total Withdrawals",
        totalFees: "Fees Collected",
        pendingCount: "Pending Approvals",
        
        // Admin banking settings
        bankingAdministration: "Banking Administration",
        bankAccountManagement: "Bank Account Management",
        totalAccounts: "Total Accounts",
        active: "Active",
        addNewAccount: "Add New Account",
        accountType: "Account Type",
        provider: "Provider",
        accountName: "Account Name",
        accountNumber: "Account Number",
        paymentInstructions: "Payment Instructions",
        saveAccount: "Save Account",
        reset: "Reset",
        mobileMoneyAccounts: "Mobile Money Accounts",
        bankAccounts: "Bank Accounts",
        noAccounts: "No accounts",
        edit: "Edit",
        delete: "Delete",
        deactivate: "Deactivate",
        activate: "Activate",
        
        // Admin matches
        upcomingMatches: "Upcoming Matches",
        matchesManagement: "Matches Management",
        refundSystem: "Refund System",
        addNewMatch: "Add New Match with Custom Odds",
        homeTeam: "Home Team",
        awayTeam: "Away Team",
        competition: "Competition",
        winPercentages: "Win Percentages (%)",
        homeWinPercent: "Home Win %",
        drawPercent: "Draw %",
        awayWinPercent: "Away Win %",
        dateTime: "Date & Time",
        venue: "Venue",
        matchStatus: "Match Status",
        upcoming: "Upcoming",
        live: "Live",
        addMatch: "Add Match",
        setMatchResults: "Set Match Results",
        noMatchesManage: "No matches to manage",
        
        // Refund system
        refundSystemTitle: "Refund System - Grouped by Match",
        refundHistory: "Refund History",
        finalScore: "Final Score",
        bettingRules: "Betting Rules",
        saveResult: "Save Result & Settle Bets",
        lostBets: "Lost Bets",
        refundAll: "Refund All",
        noLostBets: "No lost bets to refund",
        
        // ===== SUPER ADMIN =====
        superAdminDashboard: "Super Admin Dashboard",
        fullSystemControl: "Full system control and administration",
        userManagement: "User Management",
        adminManagement: "Admin Management",
        topUsers: "Top Users",
        allUsers: "All Users",
        searchByName: "Search by name/email...",
        allRoles: "All Roles",
        users: "Users",
        admins: "Admins",
        superAdmins: "Super Admins",
        allStatus: "All Status",
        user: "User",
        balance: "Balance (TZS)",
        role: "Role",
        joined: "Joined",
        actions: "Actions",
        administrators: "Administrators",
        lastLogin: "Last Login",
        topUsersByBalance: "Top Users by Balance & Bet Stake",
        refresh: "Refresh",
        
        // User actions
        viewDetails: "View Details",
        edit: "Edit",
        adjustBalance: "Adjust Balance",
        resetPassword: "Reset Password",
        block: "Block",
        activate: "Activate",
        betHistory: "Bet History",
        transactionHistory: "Transaction History",
        removeAdmin: "Remove Admin",
        
        // Modals
        betHistoryFor: "Bet History - {0}",
        transactionHistoryFor: "Transaction History - {0}",
        makeDeposit: "Make a Deposit",
        bankTransfer: "Bank Transfer",
        transactionReference: "Transaction Reference (Optional)",
        cancel: "Cancel",
        requestDeposit: "Request Deposit",
        withdrawTo: "Withdraw To",
        addBankAccount: "+ Add new bank account",
        accountHolderName: "Account Holder Name",
        bankName: "Bank Name",
        branch: "Branch (Optional)",
        saveAccount: "Save Account",
        resetPassword: "Reset Password",
        sendResetEmail: "Send Reset Email",
        iUnderstand: "I Understand",
        close: "Close",
        
        // Referrals
        myReferrals: "My Referrals",
        earnCommission: "Earn 10% Commission!",
        referralDescription: "When someone signs up with your code and makes their FIRST deposit, you earn 10% of their deposit amount instantly!",
        totalReferrals: "Total Referrals",
        activeReferrals: "Active Referrals",
        totalEarnings: "Total Earnings",
        yourReferralCode: "YOUR REFERRAL CODE",
        yourReferralLink: "YOUR REFERRAL LINK",
        referralHistory: "Referral History",
        allReferrals: "All Referrals",
        activeEarned: "Active (Earned)",
        pendingDeposit: "Pending Deposit",
        userReferred: "User",
        dateJoined: "Date Joined",
        earnings: "Earnings",
        noReferrals: "No referrals yet",
        shareCode: "Share your code to start earning 10% commission!",
        earningsInfo: "Earnings are 10% of your referral's first deposit only. Additional deposits don't earn commission.",
        copied: "Copied!",
        
        // Bank cards
        myBankCards: "My Bank Cards",
        addNewCard: "Add New Card",
        cardNumber: "Card Number",
        cardName: "Card Name",
        expiry: "Expiry",
        
        // Notifications
        success: "Success",
        error: "Error",
        warning: "Warning",
        info: "Info",
        loginSuccess: "Login successful!",
        loginError: "Login failed. Please check your credentials.",
        signupSuccess: "Account created successfully!",
        signupError: "Signup failed. Please try again.",
        depositSubmitted: "Deposit request submitted for approval!",
        withdrawalSubmitted: "Withdrawal request submitted!",
        betPlaced: "Bet placed! Potential return: TZS {0}",
        insufficientBalance: "Insufficient balance!",
        minimumStake: "Minimum stake is TZS 10,000",
        minimumDeposit: "Minimum deposit is TZS 1,000",
        minimumWithdrawal: "Minimum withdrawal is TZS 5,000",
        pleaseLogin: "Please login first",
        allFieldsRequired: "Please fill all fields",
        transactionApproved: "Transaction approved successfully!",
        transactionRejected: "Transaction rejected",
        accountAdded: "Account added successfully!",
        accountUpdated: "Account updated successfully!",
        accountDeleted: "Account deleted successfully!",
        defaultAccountUpdated: "Default account updated",
        userUpdated: "User updated successfully",
        userBlocked: "User blocked successfully",
        userActivated: "User activated successfully",
        passwordResetSent: "Password reset email sent!",
        
        // Footer
        allRightsReserved: "All rights reserved",
        version: "v1.0",
        
        // Language
        switchToSwahili: "Kiswahili",
        switchToEnglish: "English",
        
        // Placeholders
        egMyAccount: "e.g., My Account",
        egAccountNumber: "e.g., 1234567890",
        eg0712345678: "e.g., 0712345678",
        
        // Months
        january: "January",
        february: "February",
        march: "March",
        april: "April",
        may: "May",
        june: "June",
        july: "July",
        august: "August",
        september: "September",
        october: "October",
        november: "November",
        december: "December",
        
        // Days
        monday: "Monday",
        tuesday: "Tuesday",
        wednesday: "Wednesday",
        thursday: "Thursday",
        friday: "Friday",
        saturday: "Saturday",
        sunday: "Sunday"
    },
    
    sw: {
        // ===== APP NAME =====
        appName: "Football Canvas Hub",
        appNameShort: "FootballHub",
        appTitle: "Football Canvas Hub",
        
        // ===== AUTH SECTION =====
        signIn: "Ingia",
        signUp: "Jisajili",
        welcomeBack: "Karibu Tena",
        signInToDashboard: "Ingia ili ufikie dashibodi yako",
        createAccount: "Fungua Akaunti",
        joinCommunity: "Jiunge na jumuiya yetu ya mpira leo",
        
        // Form fields
        emailAddress: "Barua pepe",
        password: "Nywila",
        confirmPassword: "Thibitisha Nywila",
        fullName: "Jina Kamili",
        username: "Jina la Mtumiaji",
        phone: "Namba ya Simu",
        country: "Nchi",
        favoriteTeam: "Timu Unayoipenda",
        referralCode: "Msimbo wa Rufaa (Si lazima)",
        enterEmail: "Weka barua pepe yako",
        enterPassword: "Weka nywila yako",
        enterFullName: "Weka jina lako kamili",
        chooseUsername: "Chagua jina la mtumiaji",
        enterPhone: "Namba ya simu",
        selectCountry: "Chagua nchi yako",
        selectTeam: "Chagua timu unayoipenda",
        enterReferralCode: "Weka msimbo wa rufaa kutoka kwa rafiki",
        leaveBlank: "Acha wazi kama huna",
        
        // Form options
        rememberMe: "Nikumbuke",
        forgotPassword: "Umesahau nywila?",
        agreeToTerms: "Ninakubali na Sheria na Masharti na Sera ya Faragha",
        termsAndConditions: "Sheria na Masharti",
        privacyPolicy: "Sera ya Faragha",
        
        // Buttons
        signInBtn: "Ingia",
        createAccountBtn: "Fungua Akaunti",
        signInInstead: "Ingia Badala Yake",
        
        // Admin/Super Admin
        adminPassword: "Nywila ya Msimamizi",
        superAdminPassword: "Nywila ya Msimamizi Mkuu",
        adminAccess: "Msimamizi amegunduliwa",
        superAdminAccess: "Msimamizi Mkuu amegunduliwa",
        
        // Verification
        verificationNumber: "Namba ya Uthibitisho",
        enterVerification: "Weka namba iliyo juu",
        incorrectVerification: "Namba ya uthibitisho si sahihi. Namba mpya imetolewa.",
        
        // ===== DASHBOARD COMMON =====
        dashboard: "Dashibodi",
        myWallet: "Pochi Yangu",
        myBets: "Dau Zangu",
        matches: "Mechi",
        profile: "Wasifu",
        aboutUs: "Kuhusu Sisi",
        logout: "Toka",
        loading: "Inapakia...",
        welcome: "Karibu",
        
        // ===== USER DASHBOARD =====
        manageWallet: "Dhibiti muamala wako na akaunti ya benki",
        availableBalance: "Salio Linalopatikana",
        deposit: "Weka Pesa",
        withdraw: "Toa Pesa",
        account: "Akaunti",
        
        // Deposit section
        choosePaymentMethod: "Chagua Njia ya Malipo",
        fillDetails: "Jaza Maelezo",
        confirmTransaction: "Thibitisha Muamala",
        selectPaymentMethod: "Chagua Njia ya Malipo",
        vodacomMpesa: "Vodacom M-PESA",
        airtelMoney: "Airtel Money",
        halopesa: "Halopesa",
        lipaKwaSimu: "Lipa kwa Simu",
        crdb: "CRDB",
        nmb: "NMB",
        tpesa: "T-PESA",
        yasMixx: "YAS Mixx",
        
        enterYourDetails: "Jaza Maelezo Yako",
        fullNameLabel: "Jina Kamili",
        mobileNumber: "Namba ya Simu",
        amount: "Kiasi (TZS)",
        continue: "Endelea",
        paymentInstructions: "Maagizo ya Malipo",
        transactionId: "Namba ya Muamala",
        uploadScreenshot: "Pakia Picha ya Malipo (Si lazima)",
        submitForApproval: "Tuma kwa Idhini",
        
        // Withdrawal section
        requestWithdrawal: "Omba Utoaji Pesa",
        currentBalance: "Salio la Sasa",
        amountToWithdraw: "Kiasi cha Kutoa (TZS)",
        serviceFee: "Ada ya Huduma (15%)",
        youWillReceive: "Utapokea",
        selectAccount: "Chagua Akaunti",
        accountFullName: "Jina Kamili la Akaunti",
        accountNumber: "Namba ya Akaunti",
        mobileNumberConfirm: "Namba ya Simu (kwa uthibitisho)",
        submitWithdrawalRequest: "Tuma Ombi la Utoaji",
        
        // Account management
        myWithdrawalAccounts: "Akaunti Zangu za Utoaji",
        addManageAccounts: "Ongeza na dhibiti akaunti zako za benki/mobile money kwa ajili ya utoaji",
        addNewAccount: "Ongeza Akaunti Mpya",
        accountType: "Aina ya Akaunti",
        mobileMoney: "Mobile Money",
        bankAccount: "Akaunti ya Benki",
        mobileProvider: "Kampuni ya Simu",
        bankProvider: "Benki",
        accountName: "Jina la Akaunti",
        enterAccountName: "mfano, Akaunti Yangu",
        enterAccountNumber: "Namba ya akaunti",
        setAsDefault: "Weka kama akaunti ya msingi ya utoaji",
        saveAccount: "Hifadhi Akaunti",
        yourAccounts: "Akaunti Zako",
        loadingAccounts: "Inapakia akaunti...",
        noAccounts: "Hujajali kuongeza akaunti za utoaji bado.",
        default: "Msingi",
        
        // ===== BETTING SECTION =====
        predictReverseBetting: "Tabiri dau la kinyume",
        availableMatches: "Mechi Zinazopatikana",
        loadingMatches: "Inapakia mechi...",
        noMatches: "Hakuna mechi zinazopatikana",
        checkBackLater: "Angalia baadaye kwa mechi zijazo",
        errorLoadingMatches: "Hitilafu kupakia mechi",
        
        // Match card
        homeWin: "Washinde Nyumbani",
        draw: "Sare",
        awayWin: "Washinde Ugenini",
        winPercent: "Shinda {0}%",
        singleBet: "Dau Moja (TZS)",
        
        // VIP betting
        vipMultiBet: "Dau la VIP la Mechi Nyingi",
        selections: "uteuzi",
        combinedOdds: "Uwezekano wa Kushinda",
        stakeAmount: "Kiasi cha Dau (TZS)",
        potentialReturn: "Mapato Yanayowezekana",
        profit: "Faida",
        placeVipBet: "Weka Dau la VIP ({0} uteuzi)",
        clearAll: "Futa Yote",
        removedFromMulti: "Imeondolewa kwenye dau la VIP",
        addedToMulti: "Imeongezwa kwenye dau la VIP",
        vipTierLimit: "Kiwango chako cha VIP ({0}) kinaruhusu uteuzi {1}",
        
        // Bet slip
        placeYourBet: "Weka Dau Lako",
        yourSelection: "Uteuzi Wako",
        against: "Dhidi ya {0}",
        winPercentage: "Shinda {0}% ya dau",
        stake: "Dau",
        potentialProfit: "Faida Inayowezekana",
        totalReturn: "Jumla ya Marejesho",
        placeSingleBet: "Weka Dau Moja",
        
        // My bets
        bettingRecords: "Rekodi za Dau",
        predictOutcomes: "Tabiri matokeo na upate pointi",
        myBettingHistory: "Historia Yangu ya Dau",
        matchBet: "Mechi/Dau",
        type: "Aina",
        stakeTzs: "Dau (TZS)",
        odds: "Uwezekano",
        profit: "Faida",
        status: "Hali",
        date: "Tarehe",
        noBets: "Hujajali kuweka dau bado",
        
        // Bet status
        pending: "Inasubiri",
        won: "UMESHINDA",
        lost: "UMEPOTEZA",
        refunded: "IMERUDISHWA",
        
        // ===== PROFILE SECTION =====
        myProfile: "Wasifu Wangu",
        manageAccount: "Dhibiti mipangilio ya akaunti yako",
        memberSince: "Mwanachama Tangu",
        daysActive: "Siku za Kuwa hai",
        correctPredictions: "Utabiri Sahihi",
        totalPoints: "Jumla ya Alama",
        winRate: "Kiwango cha Kushinda",
        notSet: "Haujawekwa",
        notProvided: "Haujatolewa",
        notSelected: "Haujachaguliwa",
        
        // ===== ABOUT SECTION =====
        whatWeDo: "Tunachofanya",
        aboutService: "Kuhusu huduma yetu",
        aboutUs: "Kuhusu Sisi",
        faq: "Maswali Yanayoulizwa Mara kwa Mara",
        privacyPolicy: "Sera ya Faragha",
        termsConditions: "Sheria na Masharti",
        
        // About content
        welcomeToHub: "Karibu kwenye Football Canvas Hub",
        aboutDescription: "Football Canvas Hub ni jumuiya kuu ya mtandaoni kwa wapenzi wa mpira wa miguu. Tunatoa jukwaa la kipekee ambapo mashabiki wanaweza kutabiri matokeo ya mechi, kushindana na marafiki, na kupata zawadi - wakati wote wakisherehekea mchezo mzuri.",
        ourMission: "Dhamira Yetu",
        missionText: "Kuimarisha uzoefu wa mpira wa miguu kwa kutoa mazingira shirikishi, ya uwazi, na yenye malipo kwa mashabiki duniani kote. Tunaamini kila mechi ni fursa ya kushiriki, kujifunza, na kushinda.",
        whatWeOffer: "Tunachotoa",
        livePredictions: "Utabiri wa Mechi za Moja kwa Moja: Tabiri matokeo ya mechi zijazo na upate pointi.",
        vipMultiBets: "Dau za VIP za Mechi Nyingi: Changanya uteuzi mwingi kwa faida kubwa.",
        secureWallet: "Pochi Salama: Weka na toa pesa kwa urahisi na ada ya 15% kwa utoaji.",
        referralProgram: "Mpango wa Rufaa: Pata 10% ya amana ya kwanza ya marafiki zako.",
        support247: "Msaada wa 24/7: Mazungumzo ya moja kwa moja na timu yetu ya usaidizi.",
        ourValues: "Maadili Yetu",
        valuesText: "Uwazi: Sheria wazi na malipo ya haraka. Jumuiya: Mahali pa mashabiki kuungana. Ubunifu: Kuendelea kuboresha jukwaa.",
        ourTeam: "Timu Yetu",
        teamText: "Sisi ni kundi la wapenzi wa mpira wa miguu na wataalamu wa teknolojia waliojitolea kujenga uzoefu bora wa mashabiki. Tukio based Tanzania, tunawahudumia watumiaji kote Afrika na nje yake.",
        joinUs: "Jiunge nasi na ugeuze ujuzi wako wa mpira kuwa zawadi!",
        
        // FAQ content
        faqTitle: "Maswali Yanayoulizwa Mara kwa Mara",
        faqDeposit: "Ninawezaje kuweka pesa?",
        faqDepositAnswer: "Nenda kwenye Pochi yako, chagua Weka Pesa, chagua njia ya malipo (Vodacom M-PESA, Airtel Money, n.k.), weka kiasi, na ufuate maagizo. Utapokea namba ya muamala baada ya malipo. Wasilisha kwa idhini - pesa zitaongezwa mara tu zitakapothibitishwa.",
        faqWithdraw: "Ninawezaje kutoa ushindi wangu?",
        faqWithdrawAnswer: "Kwenye Pochi, chagua Toa Pesa. Chagua akaunti yako ya benki, weka kiasi (chini TZS 5,000), na uthibitishe. Ada ya 15% inatumika. Utoaji huchakatwa baada ya idhini ya msimamizi (kawaida ndani ya masaa 24).",
        faqRules: "Sheria za dau ni zipi?",
        faqRulesAnswer: "Unaweka dau kwenye matokeo ya mechi (Washinde Nyumbani, Sare, Washinde Ugenini). Ikiwa matokeo halisi ni KINYUME cha uteuzi wako, unashinda asilimia ya dau lako kulingana na uwezekano wa mechi. Ikiwa matokeo yanalingana na dau lako, unapoteza dau. Dau za mechi nyingi zinachanganya uteuzi kadhaa - zote lazima zishinde ili kupata malipo yaliyounganishwa.",
        faqReferral: "Mpango wa rufaa unafanyaje kazi?",
        faqReferralAnswer: "Shiriki msimbo wako wa kipekee wa rufaa au kiungo. Rafiki anapojisajili na kufanya amana yao YA KWANZA, unapata 10% ya amana hiyo mara moja. Hakuna kikomo cha rufaa - kadri unavyorejelea wengi, ndivyo unavyopata zaidi.",
        faqPassword: "Nimesahau nywila yangu. Nifanye nini?",
        faqPasswordAnswer: "Bonyeza 'Umesahau nywila?' kwenye ukurasa wa kuingia. Weka barua pepe yako, na tutakutumia kiungo cha kuweka upya. Fuata maagizo kuweka nywila mpya.",
        faqBlocked: "Kwa nini akaunti yangu imefungwa?",
        faqBlockedAnswer: "Akaunti zinaweza kufungwa kwa shughuli za kutiliwa shaka, ukiukaji wa sheria, au sababu za kiusalama. Wasiliana na usaidizi kupitia gumzo ili kutatua tatizo.",
        faqWithdrawTime: "Utoaji huchukua muda gani?",
        faqWithdrawTimeAnswer: "Utoaji kawaida huchakatwa ndani ya masaa 24 baada ya idhini ya msimamizi. Mara tu unapoidhinishwa, pesa hutumwa kwa akaunti yako (benki au mobile money) na inaweza kuchukua muda wa ziada kulingana na mtoa huduma.",
        faqUpdateInfo: "Naweza kubadilisha taarifa zangu za kibinafsi?",
        faqUpdateInfoAnswer: "Ndiyo, nenda kwenye Wasifu → Mipangilio ya Akaunti. Unaweza kusasisha jina lako, simu, nchi, na timu unayoipenda. Barua pepe haiwezi kubadilishwa kwa sababu za kiusalama.",
        faqSecurity: "Taarifa zangu ziko salama?",
        faqSecurityAnswer: "Kabisa. Tunatumia usimbaji fiche wa kiwango cha sekta na usalama wa Firebase. Taarifa zako za kibinafsi hazishirikiwi kamwe na watu wengine bila idhini yako.",
        
        // Privacy Policy
        privacyTitle: "Sera ya Faragha",
        privacyInfoCollect: "1. Taarifa Tunazokusanya",
        privacyInfoCollectText: "Tunakusanya taarifa za kibinafsi unazotoa unapojisajili, kama vile jina, barua pepe, namba ya simu, na maelezo ya malipo. Pia tunakusanya data ya matumizi kupitia vidakuzi na uchambuzi.",
        privacyHowUse: "2. Jinsi Tunavyotumia Taarifa Zako",
        privacyHowUseText: "Tunatumia taarifa zako kutoa huduma, kuchakata miamala, kuboresha Jukwaa letu, na kuwasiliana nawe. Tunaweza kutumia barua pepe yako kwa matangazo yanayohusiana na huduma.",
        privacySharing: "3. Kushiriki Taarifa",
        privacySharingText: "Hatuziuza taarifa zako za kibinafsi. Tunaweza kuzishiriki na watoa huduma wengine wanaoaminika (wachakataji malipo, uchambuzi) ambao wamefungwa na usiri. Tunaweza kufichua taarifa ikiwa inahitajika na sheria.",
        privacySecurity: "4. Usalama wa Data",
        privacySecurityText: "Tunatekeleza hatua za usalama za kiwango cha sekta kulinda data yako. Hata hivyo, hakuna njia ya maambukizi kwenye mtandao iliyo salama 100%. Wewe unawajibika kwa kuweka hati zako za akaunti salama.",
        privacyCookies: "5. Vidakuzi",
        privacyCookiesText: "Tunatumia vidakuzi kuongeza uzoefu wako, kukumbuka mapendeleo, na kuchambua trafiki. Unaweza kuzima vidakuzi kwenye kivinjari chako, lakini baadhi ya vipengele vinaweza visifanye kazi vizuri.",
        privacyThirdParty: "6. Viungo vya Watu Wengine",
        privacyThirdPartyText: "Jukwaa linaweza kuwa na viungo vya tovuti za nje. Hatutawajibika kwa sera zao za faragha. Tunakuhimiza ukague sera zao.",
        privacyChildren: "7. Faragha ya Watoto",
        privacyChildrenText: "Huduma zetu hazielekezwi kwa watu walio chini ya umri wa miaka 18. Hatukusanyi kwa makusudi taarifa kutoka kwa watoto. Ikiwa utagundua kuwa mtoto ametoa data, tafadhali wasiliana nasi.",
        privacyChanges: "8. Mabadiliko ya Sera Hii",
        privacyChangesText: "Tunaweza kusasisha Sera hii ya Faragha. Mabadiliko yatachapishwa hapa na tarehe ya marekebisho iliyosasishwa. Matumizi yako ya kuendelea yanamaanisha kukubali.",
        privacyRights: "9. Haki Zako",
        privacyRightsText: "Una haki ya kupata, kurekebisha, au kufuta data yako ya kibinafsi. Ili kutumia haki hizi, tafadhali wasiliana nasi kwenye privacy@footballcanvas.com.",
        lastUpdated: "Ilisasishwa mwisho: Februari 2026",
        
        // Terms & Conditions
        termsTitle: "Sheria na Masharti",
        termsAcceptance: "1. Kukubali Sheria",
        termsAcceptanceText: "Kwa kufikia au kutumia Football Canvas Hub ('Jukwaa'), unakubali kufungwa na Sheria na Masharti haya. Ikiwa hukubali, tafadhali usitumie Jukwaa.",
        termsEligibility: "2. Sifa",
        termsEligibilityText: "Lazima uwe na umri wa angalau miaka 18 kutumia Jukwaa hili. Kwa kutumia Jukwaa, unawakilisha na kuthibitisha kuwa una miaka 18 au zaidi.",
        termsAccount: "3. Usajili wa Akaunti",
        termsAccountText: "Wewe unawajibika kwa kudumisha usiri wa hati zako za akaunti. Unakubali kutuarifu mara moja kuhusu matumizi yoyote yasiyoidhinishwa. Unawajibika kwa shughuli zote chini ya akaunti yako.",
        termsDeposits: "4. Amana na Utoaji",
        termsDepositsText: "Amana zote huchakatwa kupitia watoa huduma wa malipo wa watu wengine. Utoaji unategemea ada ya usindikaji ya 15% na unaweza kuchukua hadi siku 3 za kazi. Kiwango cha chini cha utoaji ni TZS 5,000.",
        termsBetting: "5. Sheria za Dau",
        termsBettingText: "Watumiaji hushinda wakati matokeo ya mechi ni kinyume cha uteuzi wao. Malipo yanategemea asilimia za uwezekano zilizowekwa kwa kila mechi. Jukwaa linahifadhi haki ya kubatilisha dau lolote ikiwa utapeli unashukiwa.",
        termsReferral: "6. Mpango wa Rufaa",
        termsReferralText: "Warejeleaji hupata 10% ya amana ya kwanza ya watumiaji waliojelewa. Komisheni huongezwa mara moja baada ya idhini ya amana. Matumizi mabaya ya mfumo wa rufaa yanaweza kusababisha kunyang'anywa mapato.",
        termsProhibited: "7. Shughuli Zilizokatazwa",
        termsProhibitedText: "Huwezi kutumia Jukwaa kwa shughuli yoyote haramu, kujaribu kudanganya mfumo, au kushiriki katika aina yoyote ya ulaghai. Ukiukaji unaweza kusababisha kusimamishwa kwa akaunti na kunyang'anywa fedha.",
        termsLiability: "8. Kikomo cha Dhima",
        termsLiabilityText: "Jukwaa linatolewa 'kama lilivyo' bila dhamana za aina yoyote. Hatutawajibika kwa uharibifu wowote usio wa moja kwa moja, wa bahati mbaya, au unaotokana na matumizi yako ya Jukwaa.",
        termsChanges: "9. Mabadiliko ya Masharti",
        termsChangesText: "Tunaweza kurekebisha Masharti haya wakati wowote. Matumizi ya kuendelea baada ya mabadiliko yanamaanisha kukubali. Ni jukumu lako kukagua Masharti mara kwa mara.",
        termsContact: "10. Maelezo ya Mawasiliano",
        termsContactText: "Kwa maswali au wasiwasi, tafadhali wasiliana nasi kwenye support@footballcanvas.com au kupitia gumzo letu la usaidizi.",
        
        // ===== ANNOUNCEMENTS =====
        announcements: "Matangazo",
        latestAnnouncements: "Matangazo ya hivi karibuni",
        noAnnouncements: "Hakuna matangazo yanayotumika",
        addAnnouncement: "Ongeza tangazo",
        
        // ===== CHAT =====
        support: "USAIDIZI",
        supportChat: "Gumzo la Usaidizi",
        typeMessage: "Andika ujumbe wako...",
        send: "Tuma",
        quickQuestions: "Maswali ya Haraka",
        howToDeposit: "Jinsi ya kuweka pesa?",
        howToWithdraw: "Jinsi ya kutoa pesa?",
        howToStake: "Jinsi ya kuweka dau?",
        recentResults: "Matokeo ya hivi karibuni",
        todaysMatches: "Mechi za leo",
        
        // Admin chat
        adminSupport: "Mazungumzo ya Usaidizi ya Msimamizi",
        manageUsers: "Dhibiti watumiaji na maudhui ya jukwaa",
        addNewUser: "Ongeza Mtumiaji Mpya",
        activeChats: "Mazungumzo Yanayoendelea",
        selectUser: "Chagua mtumiaji kuanza kuzungumza",
        standardReply: "Jibu la kawaida",
        escalate: "Peleka juu",
        needMoreInfo: "Haja ya maelezo zaidi",
        
        // ===== ADMIN DASHBOARD =====
        adminDashboard: "Dashibodi ya Msimamizi",
        approvals: "Idhini",
        transactionHistory: "Historia ya Miamala",
        bankingSettings: "Mipangilio ya Benki",
        manageAnnouncements: "Dhibiti Matangazo",
        
        // Admin banking
        pendingApprovals: "Idhini Zinazosubiri",
        approved: "Zimeidhinishwa",
        rejected: "Zimekataliwa",
        searchUser: "Tafuta kwa Kitambulisho cha Mtumiaji au Barua pepe",
        allTypes: "Aina Zote",
        deposits: "Amana",
        withdrawals: "Utoaji",
        fees: "Ada",
        totalDeposits: "Jumla ya Amana",
        totalWithdrawals: "Jumla ya Utoaji",
        totalFees: "Ada Zilizokusanywa",
        pendingCount: "Idhini Zinazosubiri",
        
        // Admin banking settings
        bankingAdministration: "Usimamizi wa Benki",
        bankAccountManagement: "Usimamizi wa Akaunti za Benki",
        totalAccounts: "Jumla ya Akaunti",
        active: "Inayotumika",
        addNewAccount: "Ongeza Akaunti Mpya",
        accountType: "Aina ya Akaunti",
        provider: "Mtoa Huduma",
        accountName: "Jina la Akaunti",
        accountNumber: "Namba ya Akaunti",
        paymentInstructions: "Maagizo ya Malipo",
        saveAccount: "Hifadhi Akaunti",
        reset: "Weka upya",
        mobileMoneyAccounts: "Akaunti za Mobile Money",
        bankAccounts: "Akaunti za Benki",
        noAccounts: "Hakuna akaunti",
        edit: "Hariri",
        delete: "Futa",
        deactivate: "Zima",
        activate: "Washa",
        
        // Admin matches
        upcomingMatches: "Mechi Zijazo",
        matchesManagement: "Usimamizi wa Mechi",
        refundSystem: "Mfumo wa Marejesho",
        addNewMatch: "Ongeza Mechi Mpya na Uwezekano Maalum",
        homeTeam: "Timu ya Nyumbani",
        awayTeam: "Timu ya Ugenini",
        competition: "Mashindano",
        winPercentages: "Asilimia ya Ushindi (%)",
        homeWinPercent: "% ya Ushindi Nyumbani",
        drawPercent: "% ya Sare",
        awayWinPercent: "% ya Ushindi Ugenini",
        dateTime: "Tarehe na Muda",
        venue: "Uwanja",
        matchStatus: "Hali ya Mechi",
        upcoming: "Inakuja",
        live: "Moja kwa Moja",
        addMatch: "Ongeza Mechi",
        setMatchResults: "Weka Matokeo ya Mechi",
        noMatchesManage: "Hakuna mechi za kudhibiti",
        
        // Refund system
        refundSystemTitle: "Mfumo wa Marejesho - Umeunganishwa kwa Mechi",
        refundHistory: "Historia ya Marejesho",
        finalScore: "Matokeo ya Mwisho",
        bettingRules: "Sheria za Dau",
        saveResult: "Hifadhi Matokeo na Suluhisha Dau",
        lostBets: "Dau Zilizopotea",
        refundAll: "Rudisha Zote",
        noLostBets: "Hakuna dau zilizopotea za kurejesha",
        
        // ===== SUPER ADMIN =====
        superAdminDashboard: "Dashibodi ya Msimamizi Mkuu",
        fullSystemControl: "Udhibiti kamili wa mfumo na usimamizi",
        userManagement: "Usimamizi wa Watumiaji",
        adminManagement: "Usimamizi wa Wasimamizi",
        topUsers: "Watumiaji Bora",
        allUsers: "Watumiaji Wote",
        searchByName: "Tafuta kwa jina/barua pepe...",
        allRoles: "Majukumu Yote",
        users: "Watumiaji",
        admins: "Wasimamizi",
        superAdmins: "Wasimamizi Wakuu",
        allStatus: "Hali Zote",
        user: "Mtumiaji",
        balance: "Salio (TZS)",
        role: "Jukumu",
        joined: "Alijiunga",
        actions: "Vitendo",
        administrators: "Wasimamizi",
        lastLogin: "Kuingia kwa Mwisho",
        topUsersByBalance: "Watumiaji Bora kwa Salio na Dau",
        refresh: "Onyesha upya",
        
        // User actions
        viewDetails: "Angalia Maelezo",
        edit: "Hariri",
        adjustBalance: "Rekebisha Salio",
        resetPassword: "Weka upya Nywila",
        block: "Funga",
        activate: "Washa",
        betHistory: "Historia ya Dau",
        transactionHistory: "Historia ya Miamala",
        removeAdmin: "Ondoa Msimamizi",
        
        // Modals
        betHistoryFor: "Historia ya Dau - {0}",
        transactionHistoryFor: "Historia ya Miamala - {0}",
        makeDeposit: "Weka Amana",
        bankTransfer: "Uhamisho wa Benki",
        transactionReference: "Kumbukumbu ya Muamala (Si lazima)",
        cancel: "Ghairi",
        requestDeposit: "Omba Amana",
        withdrawTo: "Toa kwa",
        addBankAccount: "+ Ongeza akaunti mpya ya benki",
        accountHolderName: "Jina la Mmiliki wa Akaunti",
        bankName: "Jina la Benki",
        branch: "Tawi (Si lazima)",
        saveAccount: "Hifadhi Akaunti",
        resetPassword: "Weka upya Nywila",
        sendResetEmail: "Tuma Barua pepe ya Kuweka upya",
        iUnderstand: "Naelewa",
        close: "Funga",
        
        // Referrals
        myReferrals: "Rufaa Zangu",
        earnCommission: "Pata 10% ya Komisheni!",
        referralDescription: "Mtu anapojisajili kwa msimbo wako na kufanya amana yao YA KWANZA, unapata 10% ya amana yao mara moja!",
        totalReferrals: "Jumla ya Rufaa",
        activeReferrals: "Rufaa Zinazotumika",
        totalEarnings: "Jumla ya Mapato",
        yourReferralCode: "MSIMBO WAKO WA RUFAA",
        yourReferralLink: "KIUNGO CHAKO CHA RUFAA",
        referralHistory: "Historia ya Rufaa",
        allReferrals: "Rufaa Zote",
        activeEarned: "Zinazotumika (Zilizopata)",
        pendingDeposit: "Zinasubiri Amana",
        userReferred: "Mtumiaji",
        dateJoined: "Tarehe ya Kujiunga",
        earnings: "Mapato",
        noReferrals: "Hakuna rufaa bado",
        shareCode: "Shiriki msimbo wako kuanza kupata 10% ya komisheni!",
        earningsInfo: "Mapato ni 10% ya amana ya kwanza ya mtu uliyemrejelea tu. Amana za ziada hazileti komisheni.",
        copied: "Imenakiliwa!",
        
        // Bank cards
        myBankCards: "Kadi Zangu za Benki",
        addNewCard: "Ongeza Kadi Mpya",
        cardNumber: "Namba ya Kadi",
        cardName: "Jina la Kadi",
        expiry: "Mwisho wa Matumizi",
        
        // Notifications
        success: "Imefaulu",
        error: "Hitilafu",
        warning: "Tahadhari",
        info: "Taarifa",
        loginSuccess: "Umeingia kwa mafanikio!",
        loginError: "Kuingia hakukufaulu. Tafadhali angalia hati zako.",
        signupSuccess: "Akaunti imefunguliwa kwa mafanikio!",
        signupError: "Usajili haukufaulu. Tafadhali jaribu tena.",
        depositSubmitted: "Ombi la kuweka pesa limetumwa kwa idhini!",
        withdrawalSubmitted: "Ombi la kutoa pesa limetumwa!",
        betPlaced: "Dau limewekwa! Marejesho yanayowezekana: TZS {0}",
        insufficientBalance: "Salio lako halitoshi!",
        minimumStake: "Dau la chini ni TZS 10,000",
        minimumDeposit: "Amana ya chini ni TZS 1,000",
        minimumWithdrawal: "Utoaji wa chini ni TZS 5,000",
        pleaseLogin: "Tafadhali ingia kwanza",
        allFieldsRequired: "Tafadhali jaza sehemu zote",
        transactionApproved: "Muamala umeidhinishwa kwa mafanikio!",
        transactionRejected: "Muamala umekataliwa",
        accountAdded: "Akaunti imeongezwa kwa mafanikio!",
        accountUpdated: "Akaunti imesasishwa kwa mafanikio!",
        accountDeleted: "Akaunti imefutwa kwa mafanikio!",
        defaultAccountUpdated: "Akaunti ya msingi imesasishwa",
        userUpdated: "Mtumiaji amesasishwa kwa mafanikio",
        userBlocked: "Mtumiaji amefungwa kwa mafanikio",
        userActivated: "Mtumiaji amewashwa kwa mafanikio",
        passwordResetSent: "Barua pepe ya kuweka upya nywila imetumwa!",
        
        // Footer
        allRightsReserved: "Haki zote zimehifadhiwa",
        version: "v1.0",
        
        // Language
        switchToSwahili: "Kiswahili",
        switchToEnglish: "English",
        
        // Placeholders
        egMyAccount: "mfano, Akaunti Yangu",
        egAccountNumber: "mfano, 1234567890",
        eg0712345678: "mfano, 0712345678",
        
        // Months
        january: "Januari",
        february: "Februari",
        march: "Machi",
        april: "Aprili",
        may: "Mei",
        june: "Juni",
        july: "Julai",
        august: "Agosti",
        september: "Septemba",
        october: "Oktoba",
        november: "Novemba",
        december: "Desemba",
        
        // Days
        monday: "Jumatatu",
        tuesday: "Jumanne",
        wednesday: "Jumatano",
        thursday: "Alhamisi",
        friday: "Ijumaa",
        saturday: "Jumamosi",
        sunday: "Jumapili"
    }
};

// Current language (default: English)
let currentLanguage = 'en';

// Store the MutationObserver instance
let languageObserver = null;

// ==================== MAIN LANGUAGE FUNCTIONS ====================

// Function to toggle language
function toggleLanguage() {
    // Add transition effect
    document.body.classList.add('language-changing');
    
    // Toggle language
    currentLanguage = currentLanguage === 'en' ? 'sw' : 'en';
    
    // Save to localStorage
    localStorage.setItem('preferredLanguage', currentLanguage);
    
    console.log(`🔄 Switching language to: ${currentLanguage === 'en' ? 'English' : 'Kiswahili'}`);
    
    // Update all text elements
    translateAllContent();
    
    // Refresh all dynamic content
    refreshAllDynamicContent();
    
    // Update button text
    updateLanguageButtons();
    
    // Remove transition effect
    setTimeout(() => {
        document.body.classList.remove('language-changing');
    }, 200);
    
    // Show notification
    if (window.NotificationManager) {
        NotificationManager.show(
            currentLanguage === 'en' ? 'Language switched to English' : 'Lugha imebadilishwa kwenda Kiswahili',
            'info',
            { duration: 2000 }
        );
    }
}

// Get current language
function getCurrentLanguage() {
    return currentLanguage;
}

// Get translation with optional parameters
function t(key, ...args) {
    if (!key) return '';
    
    // Try to get translation, fallback to English, then return the key itself
    const translation = translations[currentLanguage]?.[key] || translations.en?.[key] || key;
    
    // Replace placeholders like {0}, {1} with provided arguments
    if (args && args.length > 0) {
        return translation.replace(/{(\d+)}/g, (match, index) => {
            return typeof args[index] !== 'undefined' ? args[index] : match;
        });
    }
    
    return translation;
}

// ==================== MUTATION OBSERVER FOR DYNAMIC CONTENT ====================

// Start observing DOM changes
function startLanguageObserver() {
    if (languageObserver) return;
    
    console.log('👀 Starting language observer...');
    
    languageObserver = new MutationObserver((mutations) => {
        // Only translate if we're not in the middle of a language change
        if (!document.body.classList.contains('language-changing')) {
            // Check if new nodes were added
            let shouldTranslate = false;
            
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if added nodes contain text elements
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // If the added element has text content or is a container
                            if (node.textContent && node.textContent.trim().length > 0) {
                                shouldTranslate = true;
                                break;
                            }
                        }
                    }
                }
                if (shouldTranslate) break;
            }
            
            if (shouldTranslate) {
                // Small delay to ensure DOM is updated
                setTimeout(() => {
                    translateDynamicContent();
                }, 50);
            }
        }
    });
    
    // Observe the entire document for changes
    languageObserver.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: false
    });
}

// Stop observing
function stopLanguageObserver() {
    if (languageObserver) {
        languageObserver.disconnect();
        languageObserver = null;
        console.log('🛑 Language observer stopped');
    }
}

// ==================== COMPREHENSIVE TRANSLATION FUNCTIONS ====================

// Main function to translate all content
function translateAllContent() {
    console.log('🔄 Translating all content...');
    
    // Translate all static elements with data attributes
    translateStaticElements();
    
    // Translate all dynamic sections
    translateAuthSection();
    translateUserDashboard();
    translateAdminDashboard();
    translateSuperAdminDashboard();
    translateAllModals();
    translateNavigation();
    translateWalletSection();
    translateBettingSection();
    translateProfileSection();
    translateAboutSection();
    translateAnnouncements();
    translateChatSection();
    translateFooter();
    
    // Special handling for tables and lists
    translateTables();
    
    // Special handling for buttons
    translateButtons();
    
    // Special handling for placeholders
    translatePlaceholders();
    
    console.log('✅ Translation complete');
}

// Translate static elements with data attributes
function translateStaticElements() {
    // Elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (key) {
            const translation = t(key);
            if (translation && translation !== key) {
                // Preserve any child elements (like icons)
                const icon = element.querySelector('i');
                if (icon) {
                    const iconHTML = icon.outerHTML;
                    element.innerHTML = iconHTML + ' ' + translation;
                } else {
                    element.textContent = translation;
                }
            }
        }
    });
    
    // Elements with data-translate-html attribute (for HTML content)
    document.querySelectorAll('[data-translate-html]').forEach(element => {
        const key = element.getAttribute('data-translate-html');
        if (key) {
            const translation = t(key);
            if (translation && translation !== key) {
                element.innerHTML = translation;
            }
        }
    });
    
    // Elements with data-translate-title attribute
    document.querySelectorAll('[data-translate-title]').forEach(element => {
        const key = element.getAttribute('data-translate-title');
        if (key) {
            element.title = t(key);
        }
    });
    
    // Elements with data-translate-placeholder attribute
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (key) {
            element.placeholder = t(key);
        }
    });
    
    // Elements with data-translate-aria-label attribute
    document.querySelectorAll('[data-translate-aria]').forEach(element => {
        const key = element.getAttribute('data-translate-aria');
        if (key) {
            element.setAttribute('aria-label', t(key));
        }
    });
    
    // Labels with for attribute
    document.querySelectorAll('label[data-translate-for]').forEach(label => {
        const key = label.getAttribute('data-translate-for');
        if (key) {
            const icon = label.querySelector('i');
            if (icon) {
                const iconHTML = icon.outerHTML;
                label.innerHTML = iconHTML + ' ' + t(key);
            } else {
                label.textContent = t(key);
            }
        }
    });
}

// Translate dynamic content (called by MutationObserver)
function translateDynamicContent() {
    // Only translate newly added elements
    translateStaticElements();
    
    // Check specific sections that might have been added
    if (document.querySelector('.match-card')) {
        translateMatchCards();
    }
    
    if (document.querySelector('.my-bets-table')) {
        translateBetsTable();
    }
    
    if (document.querySelector('.admin-chat-item')) {
        translateAdminChat();
    }
    
    if (document.querySelector('.modal-overlay.active')) {
        translateActiveModals();
    }
}

// ==================== SECTION-SPECIFIC TRANSLATION FUNCTIONS ====================

// Translate auth section
function translateAuthSection() {
    const authContainer = document.getElementById('authContainer');
    if (!authContainer || authContainer.style.display === 'none') return;
    
    // Form switcher
    const loginBtn = document.getElementById('login');
    const signupBtn = document.getElementById('signupSwitch');
    
    if (loginBtn) {
        const span = loginBtn.querySelector('span') || loginBtn;
        span.textContent = t('signIn');
    }
    
    if (signupBtn) {
        const span = signupBtn.querySelector('span') || signupBtn;
        span.textContent = t('signUp');
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const headers = loginForm.querySelectorAll('.form-header h2, .form-header p');
        if (headers[0]) headers[0].textContent = t('welcomeBack');
        if (headers[1]) headers[1].textContent = t('signInToDashboard');
        
        // Labels
        const emailLabel = loginForm.querySelector('label[for="loginEmail"]');
        if (emailLabel) {
            const icon = emailLabel.querySelector('i');
            if (icon) emailLabel.innerHTML = icon.outerHTML + ' ' + t('emailAddress');
        }
        
        const passwordLabel = loginForm.querySelector('label[for="loginPassword"]');
        if (passwordLabel) {
            const icon = passwordLabel.querySelector('i');
            if (icon) passwordLabel.innerHTML = icon.outerHTML + ' ' + t('password');
        }
        
        // Placeholders
        const emailInput = document.getElementById('loginEmail');
        if (emailInput) emailInput.placeholder = t('enterEmail');
        
        const passwordInput = document.getElementById('loginPassword');
        if (passwordInput) passwordInput.placeholder = t('enterPassword');
        
        // Remember me and forgot password
        const rememberMe = loginForm.querySelector('.remember-me span');
        if (rememberMe) rememberMe.textContent = t('rememberMe');
        
        const forgotPassword = document.getElementById('forgotPassword');
        if (forgotPassword) forgotPassword.textContent = t('forgotPassword');
        
        // Submit button
        const submitBtn = loginForm.querySelector('button[type="submit"] span');
        if (submitBtn) submitBtn.textContent = t('signInBtn');
        
        // Footer link
        const footerLink = loginForm.querySelector('.form-footer a');
        if (footerLink) footerLink.textContent = t('createAccount');
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        const headers = signupForm.querySelectorAll('.form-header h2, .form-header p');
        if (headers[0]) headers[0].textContent = t('createAccount');
        if (headers[1]) headers[1].textContent = t('joinCommunity');
        
        // Translate all labels
        const labelMappings = {
            'fullName': 'fullName',
            'username': 'username',
            'phone': 'phone',
            'email': 'emailAddress',
            'password': 'password',
            'confirmPassword': 'confirmPassword',
            'country': 'country',
            'favoriteTeam': 'favoriteTeam',
            'referralCodeInput': 'referralCode'
        };
        
        Object.entries(labelMappings).forEach(([inputId, key]) => {
            const label = signupForm.querySelector(`label[for="${inputId}"]`);
            if (label) {
                const icon = label.querySelector('i');
                if (icon) label.innerHTML = icon.outerHTML + ' ' + t(key);
            }
        });
        
        // Placeholders
        document.getElementById('fullName')?.setAttribute('placeholder', t('enterFullName'));
        document.getElementById('username')?.setAttribute('placeholder', t('chooseUsername'));
        document.getElementById('phone')?.setAttribute('placeholder', t('enterPhone'));
        document.getElementById('email')?.setAttribute('placeholder', t('enterEmail'));
        document.getElementById('password')?.setAttribute('placeholder', t('enterPassword'));
        document.getElementById('confirmPassword')?.setAttribute('placeholder', t('enterPassword'));
        document.getElementById('referralCodeInput')?.setAttribute('placeholder', t('enterReferralCode'));
        
        // Terms
        const termsText = signupForm.querySelector('.terms-container span');
        if (termsText) {
            termsText.innerHTML = t('agreeToTerms')
                .replace('Terms & Conditions', `<a href="#" onclick="openModal('termsModal'); return false;">${t('termsAndConditions')}</a>`)
                .replace('Privacy Policy', `<a href="#" onclick="openModal('privacyModal'); return false;">${t('privacyPolicy')}</a>`);
        }
        
        // Buttons
        const createBtn = signupForm.querySelector('button[type="submit"] span');
        if (createBtn) createBtn.textContent = t('createAccountBtn');
        
        const signinBtn = signupForm.querySelector('.btn-secondary span');
        if (signinBtn) signinBtn.textContent = t('signInInstead');
    }
}

// Translate user dashboard
function translateUserDashboard() {
    const dashboard = document.getElementById('user-dashboard');
    if (!dashboard || dashboard.style.display === 'none') return;
    
    // Welcome message
    const welcomeName = document.getElementById('welcomeName');
    if (welcomeName) {
        const userName = window.authManager?.userData?.fullName?.split(' ')[0] || '';
        welcomeName.textContent = userName;
    }
    
    const welcomeName1 = document.getElementById('welcomeName1');
    if (welcomeName1) {
        const userName = window.authManager?.userData?.fullName?.split(' ')[0] || '';
        welcomeName1.textContent = userName;
    }
    
    // Balance displays
    const balanceElements = document.querySelectorAll('#userBalance, #walletBalance, #withdrawCurrentBalance');
    balanceElements.forEach(el => {
        if (el && !el.id.includes('userBalance') && !el.classList.contains('balance-amount')) {
            // These are labels, not the actual balance values
            if (el.id === 'userBalance' && el.parentElement?.classList.contains('user-balance')) {
                // Skip - this is the balance value
            } else if (el.classList.contains('balance-label')) {
                el.textContent = t('availableBalance');
            }
        }
    });
    
    // Wallet header
    const walletHeader = document.querySelector('#walletSection .dashboard-header h2');
    if (walletHeader) walletHeader.innerHTML = `<i class="fas fa-wallet"></i> ${t('myWallet')}`;
    
    const walletSubheader = document.querySelector('#walletSection .dashboard-header p');
    if (walletSubheader) walletSubheader.textContent = t('manageWallet');
    
    // My bets header
    const betsHeader = document.querySelector('#mybetSection .dashboard-header h2');
    if (betsHeader) betsHeader.innerHTML = `<i class="fas fa-history"></i> ${t('myBets')}`;
    
    const betsSubheader = document.querySelector('#mybetSection .dashboard-header p');
    if (betsSubheader) betsSubheader.textContent = t('predictOutcomes');
    
    // Matches header
    const matchesHeader = document.querySelector('#matchesSection .dashboard-header h2');
    if (matchesHeader) {
        const icon = matchesHeader.querySelector('i');
        if (icon) matchesHeader.innerHTML = icon.outerHTML + ' ' + t('matches');
    }
    
    // Profile header
    const profileHeader = document.querySelector('#profileSection .dashboard-header h2');
    if (profileHeader) profileHeader.innerHTML = `<i class="fas fa-user-circle"></i> ${t('myProfile')}`;
    
    const profileSubheader = document.querySelector('#profileSection .dashboard-header p');
    if (profileSubheader) profileSubheader.textContent = t('manageAccount');
    
    // About header
    const aboutHeader = document.querySelector('#aboutsection .dashboard-header h2');
    if (aboutHeader) aboutHeader.innerHTML = `<i class="fas fa-edit"></i> ${t('whatWeDo')}`;
    
    const aboutSubheader = document.querySelector('#aboutsection .dashboard-header p');
    if (aboutSubheader) aboutSubheader.textContent = t('aboutService');
}

// Translate admin dashboard
function translateAdminDashboard() {
    const dashboard = document.getElementById('admin-dashboard');
    if (!dashboard || dashboard.style.display === 'none') return;
    
    // Admin chat header
    const chatHeader = document.querySelector('#adminChatSection .dashboard-header h2');
    if (chatHeader) chatHeader.innerHTML = `<i class="fas fa-user-comments"></i> ${t('adminSupport')}`;
    
    const chatSubheader = document.querySelector('#adminChatSection .dashboard-header p');
    if (chatSubheader) chatSubheader.textContent = t('manageUsers');
    
    // Add new user button
    const createUserBtn = document.getElementById('createUserBtn');
    if (createUserBtn) {
        const span = createUserBtn.querySelector('span') || createUserBtn;
        span.textContent = t('addNewUser');
    }
    
    // Admin tabs
    const adminTabs = document.querySelectorAll('.admin-tab');
    adminTabs.forEach(tab => {
        const icon = tab.querySelector('i');
        const span = tab.querySelector('span');
        const onclick = tab.getAttribute('onclick');
        
        if (icon && span) {
            if (onclick?.includes('approvals')) {
                span.textContent = t('approvals');
            } else if (onclick?.includes('history')) {
                span.textContent = t('transactionHistory');
            }
        }
    });
    
    // Approval filters
    const filterSelect = document.getElementById('approvalFilter');
    if (filterSelect) {
        const options = filterSelect.querySelectorAll('option');
        if (options[0]) options[0].textContent = t('pending');
        if (options[1]) options[1].textContent = t('approved');
        if (options[2]) options[2].textContent = t('rejected');
    }
    
    // Banking settings
    const bankingHeader = document.querySelector('#adminBankingSettings h2');
    if (bankingHeader) bankingHeader.innerHTML = `<i class="fas fa-cog"></i> ${t('bankingAdministration')}`;
}

// Translate super admin dashboard
function translateSuperAdminDashboard() {
    const dashboard = document.getElementById('super-admin-dashboard');
    if (!dashboard || dashboard.style.display === 'none') return;
    
    const header = document.querySelector('#superAdminSection .dashboard-header h2');
    if (header) header.innerHTML = `<i class="fas fa-crown"></i> ${t('superAdminDashboard')}`;
    
    const subheader = document.querySelector('#superAdminSection .dashboard-header p');
    if (subheader) subheader.textContent = t('fullSystemControl');
    
    // Super admin tabs
    const superTabs = document.querySelectorAll('.super-tab');
    superTabs.forEach(tab => {
        const icon = tab.querySelector('i');
        const span = tab.querySelector('span');
        const onclick = tab.getAttribute('onclick');
        
        if (icon && span) {
            if (onclick?.includes('users')) {
                span.textContent = t('userManagement');
            } else if (onclick?.includes('admins')) {
                span.textContent = t('adminManagement');
            } else if (onclick?.includes('top')) {
                span.textContent = t('topUsers');
            }
        }
    });
}

// Translate navigation
function translateNavigation() {
    // Bottom navigation
    document.querySelectorAll('.nav-item[data-section]').forEach(item => {
        const label = item.querySelector('.nav-label');
        const section = item.getAttribute('data-section');
        
        if (label && section) {
            const mapping = {
                'walletSection': 'myWallet',
                'mybetSection': 'myBets',
                'matchesSection': 'matches',
                'profileSection': 'profile',
                'aboutsection': 'aboutUs',
                'adminChatSection': 'support',
                'adminTransactionApproval': 'approvals',
                'adminmatchesSection': 'matches',
                'adminBankingSettings': 'bankingSettings',
                'announcementAdminSection': 'manageAnnouncements'
            };
            
            if (mapping[section]) {
                label.textContent = t(mapping[section]);
            }
        }
    });
    
    // Logout buttons
    const logoutButtons = ['userLogoutBtn', 'adminLogoutBtn', 'superAdminLogoutBtn'];
    logoutButtons.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            const span = btn.querySelector('span') || btn;
            span.textContent = t('logout');
        }
    });
}

// Translate wallet section
function translateWalletSection() {
    // Wallet tabs
    const walletTabs = document.querySelectorAll('.wallet-tab');
    walletTabs.forEach(tab => {
        const icon = tab.querySelector('i');
        const span = tab.querySelector('span');
        const onclick = tab.getAttribute('onclick');
        
        if (icon && span) {
            if (onclick?.includes('deposit')) {
                span.textContent = t('deposit');
            } else if (onclick?.includes('withdraw')) {
                span.textContent = t('withdraw');
            } else if (onclick?.includes('Accounts')) {
                span.textContent = t('account');
            }
        }
    });
    
    // Deposit steps
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        const title = step.querySelector('.step-title');
        if (title) {
            if (index === 0) title.textContent = t('choosePaymentMethod');
            else if (index === 1) title.textContent = t('fillDetails');
            else if (index === 2) title.textContent = t('confirmTransaction');
        }
    });
    
    // Deposit step 1
    const step1Title = document.querySelector('#depositStep1 h3');
    if (step1Title) step1Title.textContent = t('selectPaymentMethod');
    
    // Deposit step 2
    const step2Title = document.querySelector('#depositStep2 h3');
    if (step2Title) step2Title.textContent = t('enterYourDetails');
    
    const nameLabel = document.querySelector('label[for="depositFullName"]');
    if (nameLabel) {
        const icon = nameLabel.querySelector('i');
        if (icon) nameLabel.innerHTML = icon.outerHTML + ' ' + t('fullNameLabel');
    }
    
    const mobileLabel = document.querySelector('label[for="depositMobile"]');
    if (mobileLabel) {
        const icon = mobileLabel.querySelector('i');
        if (icon) mobileLabel.innerHTML = icon.outerHTML + ' ' + t('mobileNumber');
    }
    
    const amountLabel = document.querySelector('label[for="depositAmount"]');
    if (amountLabel) {
        const icon = amountLabel.querySelector('i');
        if (icon) amountLabel.innerHTML = icon.outerHTML + ' ' + t('amount');
    }
    
    const continueBtn = document.querySelector('#depositStep2 .btn-primary');
    if (continueBtn) {
        const span = continueBtn.querySelector('span') || continueBtn;
        span.textContent = t('continue');
    }
    
    // Deposit step 3
    const step3Title = document.querySelector('#depositStep3 h3');
    if (step3Title) step3Title.textContent = t('paymentInstructions');
    
    const transLabel = document.querySelector('label[for="transactionId"]');
    if (transLabel) {
        const icon = transLabel.querySelector('i');
        if (icon) transLabel.innerHTML = icon.outerHTML + ' ' + t('transactionId');
    }
    
    const screenshotLabel = document.querySelector('label[for="paymentScreenshot"]');
    if (screenshotLabel) {
        const icon = screenshotLabel.querySelector('i');
        if (icon) screenshotLabel.innerHTML = icon.outerHTML + ' ' + t('uploadScreenshot');
    }
    
    const submitBtn = document.querySelector('#depositStep3 .btn-success');
    if (submitBtn) {
        const span = submitBtn.querySelector('span') || submitBtn;
        span.textContent = t('submitForApproval');
    }
    
    // Withdrawal section
    const withdrawTitle = document.querySelector('#withdrawSection h3');
    if (withdrawTitle) withdrawTitle.textContent = t('requestWithdrawal');
    
    const balanceInfo = document.querySelector('.current-balance-info');
    if (balanceInfo) {
        const span = balanceInfo.querySelector('span');
        if (span) {
            balanceInfo.innerHTML = t('currentBalance') + ': <span id="withdrawCurrentBalance">TZS 0.00</span>';
        }
    }
    
    const amountWithdrawLabel = document.querySelector('label[for="withdrawAmount"]');
    if (amountWithdrawLabel) {
        const icon = amountWithdrawLabel.querySelector('i');
        if (icon) amountWithdrawLabel.innerHTML = icon.outerHTML + ' ' + t('amountToWithdraw');
    }
    
    const accountSelectLabel = document.querySelector('label[for="withdrawBank"]');
    if (accountSelectLabel) {
        const icon = accountSelectLabel.querySelector('i');
        if (icon) accountSelectLabel.innerHTML = icon.outerHTML + ' ' + t('selectAccount');
    }
    
    const nameDisplayLabel = document.querySelector('label[for="withdrawAccountName"]');
    if (nameDisplayLabel) {
        const icon = nameDisplayLabel.querySelector('i');
        if (icon) nameDisplayLabel.innerHTML = icon.outerHTML + ' ' + t('accountFullName');
    }
    
    const numberDisplayLabel = document.querySelector('label[for="withdrawAccountNumber"]');
    if (numberDisplayLabel) {
        const icon = numberDisplayLabel.querySelector('i');
        if (icon) numberDisplayLabel.innerHTML = icon.outerHTML + ' ' + t('accountNumber');
    }
    
    const mobileConfirmLabel = document.querySelector('label[for="withdrawMobile"]');
    if (mobileConfirmLabel) {
        const icon = mobileConfirmLabel.querySelector('i');
        if (icon) mobileConfirmLabel.innerHTML = icon.outerHTML + ' ' + t('mobileNumberConfirm');
    }
    
    const withdrawSubmitBtn = document.querySelector('#withdrawSection .btn-primary');
    if (withdrawSubmitBtn) {
        const span = withdrawSubmitBtn.querySelector('span') || withdrawSubmitBtn;
        span.textContent = t('submitWithdrawalRequest');
    }
}

// Translate betting section
function translateBettingSection() {
    const matchesContainer = document.getElementById('matchesContainer');
    if (!matchesContainer) return;
    
    translateMatchCards();
    
    // VIP bet slip
    const vipSlip = document.getElementById('vipBetSlipContainer');
    if (vipSlip && vipSlip.children.length > 0) {
        const header = vipSlip.querySelector('.vip-bet-title h3');
        if (header) header.textContent = t('vipMultiBet');
        
        const selectionsText = vipSlip.querySelector('.vip-bet-title p');
        if (selectionsText) {
            const count = vipSlip.querySelectorAll('.selected-bet-item').length;
            selectionsText.textContent = `${count} / ∞ ${t('selections')}`;
        }
        
        const stakeLabel = vipSlip.querySelector('label[for="multiStakeAmount"]');
        if (stakeLabel) stakeLabel.textContent = t('stakeAmount');
        
        const oddsLabel = vipSlip.querySelector('.vip-bet-header + div > div:last-child .vip-gold');
        if (oddsLabel) {
            const parent = oddsLabel.closest('div');
            if (parent) {
                const label = parent.previousElementSibling;
                if (label) label.textContent = t('combinedOdds');
            }
        }
        
        const totalStakeLabel = vipSlip.querySelector('.vip-bet-slip > div:nth-last-child(3) span:first-child');
        if (totalStakeLabel) totalStakeLabel.textContent = t('stake') + ':';
        
        const returnLabel = vipSlip.querySelector('.vip-bet-slip > div:nth-last-child(3) span:first-child + div');
        if (returnLabel) {
            const parent = returnLabel.closest('div');
            if (parent) {
                const label = parent.querySelector('span:first-child');
                if (label) label.textContent = t('potentialReturn') + ':';
            }
        }
        
        const profitLabel = vipSlip.querySelector('.vip-bet-slip > div:last-child span:first-child');
        if (profitLabel) profitLabel.textContent = t('profit') + ':';
        
        const placeBtn = document.getElementById('placeMultiBetBtn');
        if (placeBtn) {
            const count = vipSlip.querySelectorAll('.selected-bet-item').length;
            placeBtn.innerHTML = `<i class="fas fa-coins"></i> ${t('placeVipBet', count)}`;
        }
    }
}

// Translate match cards
function translateMatchCards() {
    document.querySelectorAll('.match-card').forEach(card => {
        // Odds types
        const oddsTypes = card.querySelectorAll('.odds-type');
        oddsTypes.forEach(el => {
            const text = el.textContent.trim();
            if (text.includes('Home')) el.textContent = t('homeWin');
            else if (text.includes('Draw')) el.textContent = t('draw');
            else if (text.includes('Away')) el.textContent = t('awayWin');
        });
        
        // Odds percentages (keep numbers, translate text)
        const oddsPercents = card.querySelectorAll('.odds-percent');
        oddsPercents.forEach(el => {
            const percent = el.textContent.match(/\d+/)?.[0] || '';
            if (percent) {
                el.textContent = t('winPercent', percent);
            }
        });
        
        // Place bet button
        const placeBtn = card.querySelector('.place-bet-btn');
        if (placeBtn) {
            const icon = placeBtn.querySelector('i');
            if (icon) {
                placeBtn.innerHTML = icon.outerHTML + ' ' + t('singleBet');
            } else {
                placeBtn.textContent = t('singleBet');
            }
        }
    });
}

// Translate bets table
function translateBetsTable() {
    const table = document.querySelector('.my-bets-table');
    if (!table) return;
    
    const headers = table.querySelectorAll('thead th');
    if (headers.length >= 7) {
        headers[0].textContent = t('matchBet');
        headers[1].textContent = t('type');
        headers[2].textContent = t('stakeTzs');
        headers[3].textContent = t('odds');
        headers[4].textContent = t('profit');
        headers[5].textContent = t('status');
        headers[6].textContent = t('date');
    }
    
    // Translate status badges
    table.querySelectorAll('.status-badge').forEach(badge => {
        const status = badge.classList[1] || '';
        if (status.includes('pending')) badge.textContent = t('pending');
        else if (status.includes('won')) badge.textContent = t('won');
        else if (status.includes('lost')) badge.textContent = t('lost');
        else if (status.includes('refunded')) badge.textContent = t('refunded');
    });
}

// Translate profile section
function translateProfileSection() {
    const statBoxes = document.querySelectorAll('.stat-box');
    statBoxes.forEach((box, index) => {
        const label = box.querySelector('.stat-label');
        if (label) {
            if (index === 0) label.textContent = t('daysActive');
            else if (index === 1) label.textContent = t('correctPredictions');
            else if (index === 2) label.textContent = t('totalPoints');
            else if (index === 3) label.textContent = t('winRate');
        }
    });
    
    const joinDateLabel = document.querySelector('.profile-details p:nth-child(5) i + span');
    if (joinDateLabel) {
        const parent = joinDateLabel.closest('p');
        if (parent) {
            const icon = parent.querySelector('i');
            if (icon) {
                parent.innerHTML = icon.outerHTML + ' ' + t('memberSince') + ': <span id="profileJoinDate">' + (document.getElementById('profileJoinDate')?.textContent || '') + '</span>';
            }
        }
    }
}

// Translate about section
function translateAboutSection() {
    const aboutSection = document.getElementById('aboutsection');
    if (!aboutSection) return;
    
    const tabs = aboutSection.querySelectorAll('.tab-list .tab');
    if (tabs.length >= 4) {
        tabs[0].textContent = t('aboutUs');
        tabs[1].textContent = t('faq');
        tabs[2].textContent = t('privacyPolicy');
        tabs[3].textContent = t('termsConditions');
    }
    
    // Panel 1 (About Us)
    const panel1 = document.getElementById('panel-1');
    if (panel1) {
        const headings = panel1.querySelectorAll('h3, h4');
        if (headings[0]) headings[0].innerHTML = `📋 ${t('welcomeToHub')}`;
        if (headings[1]) headings[1].textContent = t('ourMission');
        if (headings[2]) headings[2].textContent = t('whatWeOffer');
        if (headings[3]) headings[3].textContent = t('ourValues');
        if (headings[4]) headings[4].textContent = t('ourTeam');
        
        const paragraphs = panel1.querySelectorAll('p');
        if (paragraphs[0]) paragraphs[0].textContent = t('aboutDescription');
        if (paragraphs[1]) paragraphs[1].textContent = t('missionText');
        if (paragraphs[2]) paragraphs[2].textContent = t('valuesText');
        if (paragraphs[3]) paragraphs[3].textContent = t('teamText');
        
        const list = panel1.querySelector('ul');
        if (list) {
            const items = list.querySelectorAll('li');
            if (items[0]) items[0].innerHTML = `<strong>${t('livePredictions')}</strong>`;
            if (items[1]) items[1].innerHTML = `<strong>${t('vipMultiBets')}</strong>`;
            if (items[2]) items[2].innerHTML = `<strong>${t('secureWallet')}</strong>`;
            if (items[3]) items[3].innerHTML = `<strong>${t('referralProgram')}</strong>`;
            if (items[4]) items[4].innerHTML = `<strong>${t('support247')}</strong>`;
        }
        
        const badges = panel1.querySelectorAll('.badge');
        if (badges[0]) badges[0].textContent = t('ourMission');
        if (badges[1]) badges[1].textContent = t('ourValues');
        if (badges[2]) badges[2].textContent = t('ourTeam');
    }
    
    // Panel 2 (FAQ)
    const panel2 = document.getElementById('panel-2');
    if (panel2) {
        const heading = panel2.querySelector('h3');
        if (heading) heading.textContent = `🔥 ${t('faqTitle')}`;
    }
}

// Translate announcements
function translateAnnouncements() {
    const sectionTitle = document.querySelector('.announcement-grid .section-title');
    if (sectionTitle) sectionTitle.textContent = `📢 ${t('latestAnnouncements')}`;
    
    const slideshowTitle = document.querySelector('.slideshow-card h1 span');
    if (slideshowTitle) slideshowTitle.textContent = `⚽ ${t('announcements').toUpperCase()} ⚽`;
    
    const footnote = document.querySelector('.footnote');
    if (footnote) footnote.textContent = `📢 ${t('announcements')}`;
}

// Translate chat section
function translateChatSection() {
    const chatButton = document.querySelector('#chat-button .chat-tooltip');
    if (chatButton) chatButton.textContent = t('supportChat');
    
    const chatModal = document.getElementById('userChatModal');
    if (chatModal) {
        const header = chatModal.querySelector('.modal-header h2');
        if (header) header.innerHTML = `<i class="fas fa-headset"></i> ${t('supportChat')}`;
    }
    
    const chatInput = document.getElementById('userChatInput');
    if (chatInput) chatInput.placeholder = t('typeMessage');
    
    const sendBtn = document.getElementById('userChatSend');
    if (sendBtn) sendBtn.textContent = t('send');
    
    const quickQuestions = document.querySelectorAll('.quick-question');
    quickQuestions.forEach(btn => {
        const question = btn.getAttribute('data-question');
        if (question === 'How to deposit?') btn.textContent = t('howToDeposit');
        else if (question === 'How to withdraw?') btn.textContent = t('howToWithdraw');
        else if (question === 'How to stake bet?') btn.textContent = t('howToStake');
        else if (question === 'Show recent results') btn.textContent = t('recentResults');
        else if (question === "today's matches") btn.textContent = t('todaysMatches');
    });
}

// Translate admin chat
function translateAdminChat() {
    const sidebarHeader = document.querySelector('.chat-sidebar .sidebar-header h3');
    if (sidebarHeader) sidebarHeader.innerHTML = `<i class="fas fa-comments"></i> ${t('activeChats')}`;
    
    const noChatSelected = document.querySelector('.no-chat-selected p');
    if (noChatSelected) noChatSelected.textContent = t('selectUser');
    
    const quickResponses = document.querySelectorAll('.quick-response');
    if (quickResponses.length >= 3) {
        quickResponses[0].textContent = t('standardReply');
        quickResponses[1].textContent = t('escalate');
        quickResponses[2].textContent = t('needMoreInfo');
    }
    
    const adminInput = document.getElementById('adminChatInput');
    if (adminInput) adminInput.placeholder = t('typeMessage');
    
    const adminSend = document.getElementById('adminChatSend');
    if (adminSend) adminSend.innerHTML = `<i class="fas fa-paper-plane"></i> ${t('send')}`;
}

// Translate tables
function translateTables() {
    // Admin transaction table
    const adminTable = document.querySelector('.admin-table');
    if (adminTable) {
        const headers = adminTable.querySelectorAll('thead th');
        if (headers.length >= 6) {
            headers[0].textContent = t('date');
            headers[1].textContent = t('user');
            headers[2].textContent = t('type');
            headers[3].textContent = t('amount');
            headers[4].textContent = t('status');
            headers[5].textContent = t('actions');
        }
    }
    
    // Super admin tables
    const superTable = document.querySelector('.super-table');
    if (superTable) {
        const headers = superTable.querySelectorAll('thead th');
        if (headers.length >= 7) {
            headers[0].textContent = t('user');
            headers[1].textContent = t('emailAddress');
            headers[2].textContent = t('balance');
            headers[3].textContent = t('role');
            headers[4].textContent = t('status');
            headers[5].textContent = t('joined');
            headers[6].textContent = t('actions');
        }
    }
}

// Translate buttons
function translateButtons() {
    // General buttons
    document.querySelectorAll('.btn-primary, .btn-secondary, .btn-success, .btn-danger').forEach(btn => {
        // Skip buttons that have been handled elsewhere
        if (btn.closest('.wallet-tab')) return;
        if (btn.closest('.nav-item')) return;
        
        const span = btn.querySelector('span');
        const icon = btn.querySelector('i');
        const text = btn.textContent.trim().toLowerCase();
        
        // Try to match common button texts
        if (text.includes('save')) {
            if (span) span.textContent = t('saveAccount');
            else if (icon) btn.innerHTML = icon.outerHTML + ' ' + t('saveAccount');
        } else if (text.includes('cancel')) {
            if (span) span.textContent = t('cancel');
            else if (icon) btn.innerHTML = icon.outerHTML + ' ' + t('cancel');
        } else if (text.includes('close')) {
            if (span) span.textContent = t('close');
            else if (icon) btn.innerHTML = icon.outerHTML + ' ' + t('close');
        } else if (text.includes('reset')) {
            if (span) span.textContent = t('reset');
            else if (icon) btn.innerHTML = icon.outerHTML + ' ' + t('reset');
        }
    });
}

// Translate placeholders
function translatePlaceholders() {
    // Common placeholders
    const placeholderMappings = {
        'searchUser': 'searchUser',
        'depositAmount': 'amount',
        'withdrawAmount': 'amount',
        'transactionId': 'transactionId',
        'withdrawMobile': 'eg0712345678'
    };
    
    Object.entries(placeholderMappings).forEach(([id, key]) => {
        const input = document.getElementById(id);
        if (input) input.placeholder = t(key);
    });
}

// Translate all modals
function translateAllModals() {
    const modals = [
        'depositModal', 'withdrawalModal', 'bankAccountModal', 'betSlipModal',
        'setResultModal', 'addAccountModal', 'receiptModal', 'forgotPasswordModal',
        'termsModal', 'privacyModal', 'aboutModal', 'faqModal', 'announcementModal',
        'userChatModal', 'referralsModal', 'historyModal', 'bankCardsModal',
        'userDetailsModal', 'editUserModal', 'adjustBalanceModal', 'resetPasswordModal',
        'addUserModal', 'addAdminModal'
    ];
    
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            translateModal(modalId);
        }
    });
    
    translateActiveModals();
}

// Translate specific modal by ID
function translateModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    const header = modal.querySelector('.modal-header h2, .modal-header h3');
    if (!header) return;
    
    const icon = header.querySelector('i');
    const mapping = {
        'depositModal': { icon: 'fa-arrow-down', key: 'makeDeposit' },
        'withdrawalModal': { icon: 'fa-arrow-up', key: 'requestWithdrawal' },
        'bankAccountModal': { icon: 'fa-university', key: 'addBankAccount' },
        'betSlipModal': { icon: null, key: 'placeYourBet' },
        'setResultModal': { icon: 'fa-clipboard-check', key: 'setMatchResults' },
        'addAccountModal': { icon: 'fa-plus-circle', key: 'addNewAccount' },
        'forgotPasswordModal': { icon: 'fa-key', key: 'resetPassword' },
        'termsModal': { icon: 'fa-file-contract', key: 'termsAndConditions' },
        'privacyModal': { icon: 'fa-shield-alt', key: 'privacyPolicy' },
        'aboutModal': { icon: 'fa-info-circle', key: 'aboutUs' },
        'faqModal': { icon: 'fa-question-circle', key: 'faq' },
        'userChatModal': { icon: 'fa-headset', key: 'supportChat' },
        'referralsModal': { icon: 'fa-users', key: 'myReferrals' },
        'historyModal': { icon: 'fa-history', key: 'transactionHistory' },
        'bankCardsModal': { icon: 'fa-credit-card', key: 'myBankCards' },
        'editUserModal': { icon: 'fa-edit', key: 'edit' },
        'adjustBalanceModal': { icon: 'fa-coins', key: 'adjustBalance' },
        'resetPasswordModal': { icon: 'fa-key', key: 'resetPassword' },
        'addUserModal': { icon: 'fa-user-plus', key: 'addNewUser' },
        'addAdminModal': { icon: 'fa-user-shield', key: 'addNewUser' }
    };
    
    if (mapping[modalId]) {
        const { icon: iconClass, key } = mapping[modalId];
        if (iconClass && icon) {
            header.innerHTML = `<i class="fas ${iconClass}"></i> ${t(key)}`;
        } else {
            header.textContent = t(key);
        }
    }
    
    // Translate modal buttons
    modal.querySelectorAll('.btn-primary, .btn-secondary, .btn-success, .btn-danger').forEach(btn => {
        const span = btn.querySelector('span');
        const btnIcon = btn.querySelector('i');
        const text = btn.textContent.trim().toLowerCase();
        
        if (text.includes('cancel') || btn.classList.contains('btn-secondary')) {
            if (span) span.textContent = t('cancel');
            else if (btnIcon) btn.innerHTML = btnIcon.outerHTML + ' ' + t('cancel');
        } else if (text.includes('save')) {
            if (span) span.textContent = t('saveAccount');
            else if (btnIcon) btn.innerHTML = btnIcon.outerHTML + ' ' + t('saveAccount');
        } else if (text.includes('submit') || text.includes('request')) {
            if (span) span.textContent = t('submitForApproval');
            else if (btnIcon) btn.innerHTML = btnIcon.outerHTML + ' ' + t('submitForApproval');
        }
    });
}

// Translate active modals
function translateActiveModals() {
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        const modalId = modal.id;
        if (modalId) {
            translateModal(modalId);
        }
    });
}

// Translate referrals modal
function translateReferralsModal() {
    const modal = document.getElementById('referralsModal');
    if (!modal) return;
    
    const infoBanner = modal.querySelector('.modal-body > div:first-child');
    if (infoBanner) {
        const title = infoBanner.querySelector('h4');
        const desc = infoBanner.querySelector('p');
        if (title) title.textContent = t('earnCommission');
        if (desc) desc.textContent = t('referralDescription');
    }
    
    const statLabels = modal.querySelectorAll('.stat-item .stat-label');
    if (statLabels.length >= 3) {
        statLabels[0].textContent = t('totalReferrals').toUpperCase();
        statLabels[1].textContent = t('activeReferrals').toUpperCase();
        statLabels[2].textContent = t('totalEarnings').toUpperCase();
    }
    
    const codeLabel = modal.querySelector('.modal-body label[for="modalReferralCode"]');
    if (codeLabel) codeLabel.textContent = t('yourReferralCode');
    
    const linkLabel = modal.querySelector('.modal-body label[for="modalReferralLink"]');
    if (linkLabel) linkLabel.textContent = t('yourReferralLink');
    
    const historyHeader = modal.querySelector('.modal-body h4');
    if (historyHeader) historyHeader.innerHTML = `<i class="fas fa-list"></i> ${t('referralHistory')}`;
    
    const filterSelect = document.getElementById('referralFilter');
    if (filterSelect) {
        const options = filterSelect.querySelectorAll('option');
        if (options[0]) options[0].textContent = t('allReferrals');
        if (options[1]) options[1].textContent = t('activeEarned');
        if (options[2]) options[2].textContent = t('pendingDeposit');
    }
    
    const tableHeaders = modal.querySelectorAll('#referralsTable thead th');
    if (tableHeaders.length >= 4) {
        tableHeaders[0].textContent = t('userReferred');
        tableHeaders[1].textContent = t('dateJoined');
        tableHeaders[2].textContent = t('status');
        tableHeaders[3].textContent = t('earnings');
    }
    
    const infoFooter = modal.querySelector('.modal-body .info-row, .modal-body .referral-info-box');
    if (infoFooter) {
        const text = infoFooter.querySelector('span') || infoFooter;
        text.textContent = t('earningsInfo');
    }
}

// Translate bank cards modal
function translateBankCardsModal() {
    const modal = document.getElementById('bankCardsModal');
    if (!modal) return;
    
    const addBtn = modal.querySelector('.add-card-btn');
    if (addBtn) {
        const icon = addBtn.querySelector('i');
        const span = addBtn.querySelector('span');
        if (icon && span) {
            span.textContent = t('addNewCard');
        } else {
            addBtn.innerHTML = `<i class="fas fa-plus-circle"></i> ${t('addNewCard')}`;
        }
    }
}

// Translate footer
function translateFooter() {
    const footer = document.querySelector('.menu-footer p');
    if (footer) {
        footer.textContent = `Football Canvas Hub ${t('version')}`;
    }
}

// ==================== DYNAMIC CONTENT REFRESH ====================

// Refresh all dynamic content
function refreshAllDynamicContent() {
    console.log('🔄 Refreshing dynamic content...');
    
    // Refresh matches
    if (window.bettingSystem && typeof window.bettingSystem.loadMatches === 'function') {
        window.bettingSystem.loadMatches();
    }
    
    // Refresh my bets
    if (window.bettingSystem && typeof window.bettingSystem.loadMyBets === 'function') {
        window.bettingSystem.loadMyBets();
    }
    
    // Refresh admin matches
    if (window.bettingSystem && typeof window.bettingSystem.loadAdminMatches === 'function') {
        window.bettingSystem.loadAdminMatches();
    }
    
    // Refresh refund matches
    if (window.bettingSystem && typeof window.bettingSystem.loadRefundMatches === 'function') {
        window.bettingSystem.loadRefundMatches();
    }
    
    // Refresh transaction history
    if (window.bankingSystem && typeof window.bankingSystem.loadTransactionHistory === 'function') {
        window.bankingSystem.loadTransactionHistory();
    }
    
    // Refresh admin transaction history
    if (window.bankingSystem && typeof window.bankingSystem.loadAdminTransactionHistory === 'function') {
        window.bankingSystem.loadAdminTransactionHistory();
    }
    
    // Refresh pending approvals
    if (window.bankingSystem && typeof window.bankingSystem.loadPendingApprovals === 'function') {
        window.bankingSystem.loadPendingApprovals();
    }
    
    // Refresh user accounts
    if (window.userBankManager && typeof window.userBankManager.loadAccounts === 'function') {
        window.userBankManager.loadAccounts();
    }
    
    // Refresh admin accounts
    if (window.adminBankManager && typeof window.adminBankManager.loadAccounts === 'function') {
        window.adminBankManager.loadAccounts();
    }
    
    // Refresh VIP bet slip
    if (typeof updateVIPBetSlip === 'function') {
        updateVIPBetSlip();
    }
    
    // Refresh referrals if modal is open
    if (document.getElementById('referralsModal')?.classList.contains('active')) {
        if (typeof loadReferralsData === 'function') {
            loadReferralsData();
        }
    }
    
    // Refresh bank cards if modal is open
    if (document.getElementById('bankCardsModal')?.classList.contains('active')) {
        if (typeof loadBankCardsData === 'function') {
            loadBankCardsData();
        }
    }
}

// ==================== UTILITY FUNCTIONS ====================

// Format number based on locale
function formatNumber(number, options = {}) {
    return new Intl.NumberFormat(currentLanguage === 'en' ? 'en-US' : 'sw-TZ', options).format(number);
}

// Format currency
function formatCurrency(amount) {
    return `TZS ${formatNumber(amount, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Format date
function formatDate(date, options = {}) {
    const locale = currentLanguage === 'en' ? 'en-US' : 'sw-TZ';
    return new Intl.DateTimeFormat(locale, options).format(date);
}

// Update language buttons
function updateLanguageButtons() {
    const langText = document.getElementById('langText');
    const dashboardLangText = document.getElementById('dashboardLangText');
    
    if (langText) {
        langText.textContent = currentLanguage === 'en' ? 'Kiswahili' : 'English';
    }
    
    if (dashboardLangText) {
        dashboardLangText.textContent = currentLanguage === 'en' ? 'Kiswahili' : 'English';
    }
}

// Initialize language from localStorage
function initLanguage() {
    console.log('🚀 Initializing language system...');
    
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && (savedLang === 'en' || savedLang === 'sw')) {
        currentLanguage = savedLang;
    }
    
    // Start observing DOM changes
    startLanguageObserver();
    
    // Translate all content
    translateAllContent();
    
    // Update buttons
    updateLanguageButtons();
    
    console.log(`✅ Language initialized: ${currentLanguage === 'en' ? 'English' : 'Kiswahili'}`);
}

// ==================== EVENT LISTENERS ====================

// Listen for DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all elements are loaded
    setTimeout(initLanguage, 500);
});

// Listen for section changes
document.addEventListener('sectionChanged', function(e) {
    setTimeout(() => {
        translateAllContent();
        
        // If the new section is about section, ensure tabs are translated
        if (e.detail?.sectionId === 'aboutsection') {
            translateAboutSection();
        }
        
        // If the new section is wallet section
        if (e.detail?.sectionId === 'walletSection') {
            translateWalletSection();
        }
        
        // If the new section is admin section
        if (e.detail?.dashboard?.includes('admin')) {
            translateAdminDashboard();
            translateAdminChat();
        }
        
        // If the new section is super admin section
        if (e.detail?.dashboard?.includes('super-admin')) {
            translateSuperAdminDashboard();
        }
    }, 100);
});

// Listen for matches loaded
document.addEventListener('matchesLoaded', function() {
    setTimeout(() => {
        translateBettingSection();
    }, 100);
});

// Listen for bets loaded
document.addEventListener('betsLoaded', function() {
    setTimeout(() => {
        translateBetsTable();
    }, 100);
});

// Listen for transactions loaded
document.addEventListener('transactionsLoaded', function() {
    setTimeout(() => {
        translateTables();
    }, 100);
});

// Listen for modal opened
document.addEventListener('modalOpened', function(e) {
    setTimeout(() => {
        if (e.detail?.modalId) {
            translateModal(e.detail.modalId);
        } else {
            translateActiveModals();
        }
    }, 100);
});

// Override openModal function to dispatch event
const originalOpenModal = window.openModal;
if (originalOpenModal) {
    window.openModal = function(modalId) {
        originalOpenModal(modalId);
        document.dispatchEvent(new CustomEvent('modalOpened', { detail: { modalId } }));
    };
}

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    stopLanguageObserver();
});

// ==================== WELCOME ANIMATION ====================
function showWelcomeAnimation() {
    const overlay = document.getElementById('welcomeOverlay');
    if (!overlay) return;

    // Show overlay
    overlay.classList.add('active');

    // Hide after animation duration (logo 1.5s + text delay 1.2s ≈ 2.7s, plus some margin)
    setTimeout(() => {
        overlay.classList.remove('active');
    }, 3000); // 3 seconds total
}

// ==================== PROFILE STATS FUNCTIONALITY ====================

/**
 * Load and display user profile statistics
 * - Days Active: Time since account creation
 * - Correct Predictions: Number of won bets
 * - Total Points: Sum of points from user data
 * - Win Rate: Percentage of won bets out of total bets
 */
async function loadProfileStats() {
    const userData = window.authManager?.userData;
    const userId = window.authManager?.user?.uid;
    
    if (!userData || !userId) {
        console.log('No user data available for stats');
        return;
    }

    // Get DOM elements
    const daysEl = document.getElementById('profileDaysActive');
    const correctEl = document.getElementById('profileCorrectPredictions');
    const pointsEl = document.getElementById('profileTotalPoints');
    const winRateEl = document.getElementById('profileWinRate');

    // Check if elements exist
    if (!daysEl || !correctEl || !pointsEl || !winRateEl) {
        console.error('Profile stats elements not found in DOM');
        return;
    }

    try {
        // 1. Calculate Days Active
        if (userData.createdAt) {
            let createdDate;
            if (userData.createdAt.toDate) {
                createdDate = userData.createdAt.toDate(); // Firestore timestamp
            } else if (userData.createdAt instanceof Date) {
                createdDate = userData.createdAt;
            } else {
                createdDate = new Date(userData.createdAt);
            }

            const now = new Date();
            const diffTime = Math.abs(now - createdDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            daysEl.textContent = diffDays;
        } else {
            daysEl.textContent = 'N/A';
        }

        // 2. Fetch bets to calculate correct predictions and total bets
        const betsSnapshot = await db.collection('bets')
            .where('userId', '==', userId)
            .get();

        let totalBets = 0;
        let correctBets = 0;

        betsSnapshot.forEach(doc => {
            const bet = doc.data();
            totalBets++;
            if (bet.status === 'won') {
                correctBets++;
            }
        });

        // Update correct predictions
        correctEl.textContent = correctBets;

        // 3. Total Points – from user data
        const points = userData.points || 0;
        pointsEl.textContent = points;

        // 4. Calculate Win Rate
        const winRate = totalBets > 0 ? ((correctBets / totalBets) * 100).toFixed(1) : 0;
        winRateEl.textContent = winRate + '%';

        console.log('Profile stats updated:', {
            daysActive: diffDays,
            correctPredictions: correctBets,
            totalPoints: points,
            winRate: winRate + '%'
        });

    } catch (error) {
        console.error('Error loading profile stats:', error);
        
        // Set error state
        daysEl.textContent = 'Error';
        correctEl.textContent = 'Error';
        pointsEl.textContent = 'Error';
        winRateEl.textContent = 'Error';
    }
}

/**
 * Alternative implementation if you have points stored per bet
 * This version calculates total points from all won bets
 */
async function loadProfileStatsWithPoints() {
    const userData = window.authManager?.userData;
    const userId = window.authManager?.user?.uid;
    
    if (!userData || !userId) return;

    // Get DOM elements
    const daysEl = document.getElementById('profileDaysActive');
    const correctEl = document.getElementById('profileCorrectPredictions');
    const pointsEl = document.getElementById('profileTotalPoints');
    const winRateEl = document.getElementById('profileWinRate');

    try {
        // Days Active
        if (userData.createdAt) {
            const createdDate = userData.createdAt.toDate ? 
                userData.createdAt.toDate() : new Date(userData.createdAt);
            const diffDays = Math.ceil(Math.abs(new Date() - createdDate) / (1000 * 60 * 60 * 24));
            daysEl.textContent = diffDays;
        }

        // Fetch all bets
        const betsSnapshot = await db.collection('bets')
            .where('userId', '==', userId)
            .get();

        let totalBets = 0;
        let correctBets = 0;
        let totalPoints = 0;

        betsSnapshot.forEach(doc => {
            const bet = doc.data();
            totalBets++;
            
            if (bet.status === 'won') {
                correctBets++;
                // Add points from this bet if you store them
                totalPoints += bet.pointsEarned || 0;
            }
        });

        correctEl.textContent = correctBets;
        pointsEl.textContent = totalPoints || userData.points || 0;
        
        const winRate = totalBets > 0 ? ((correctBets / totalBets) * 100).toFixed(1) : 0;
        winRateEl.textContent = winRate + '%';

    } catch (error) {
        console.error('Error loading profile stats:', error);
    }
}

/**
 * Reset profile stats (useful for testing or when user logs out)
 */
function resetProfileStats() {
    const daysEl = document.getElementById('profileDaysActive');
    const correctEl = document.getElementById('profileCorrectPredictions');
    const pointsEl = document.getElementById('profileTotalPoints');
    const winRateEl = document.getElementById('profileWinRate');

    if (daysEl) daysEl.textContent = '0';
    if (correctEl) correctEl.textContent = '0';
    if (pointsEl) pointsEl.textContent = '0';
    if (winRateEl) winRateEl.textContent = '0%';
}

/**
 * Initialize profile stats (call this when user logs in)
 */
function initProfileStats() {
    // Check if user is logged in
    if (window.authManager?.userData) {
        loadProfileStats();
    } else {
        resetProfileStats();
    }
}

// ---------- Event Listeners ----------

// Listen for auth changes
document.addEventListener('authStateChanged', (e) => {
    if (e.detail.user) {
        loadProfileStats();
    } else {
        resetProfileStats();
    }
});

// Listen for section changes (load stats when profile section becomes active)
document.addEventListener('sectionChanged', (e) => {
    if (e.detail.sectionId === 'profileSection' || 
        e.detail.sectionId === 'accountSettingsSection') {
        setTimeout(() => loadProfileStats(), 100); // Small delay to ensure DOM is ready
    }
});

// Also load stats when user data changes (e.g., after a bet is placed)
document.addEventListener('userDataUpdated', () => {
    loadProfileStats();
});

// If you don't have custom events, you can manually call initProfileStats()
// from your AuthManager after loading user data

// After a bet is placed, you can trigger a stats refresh
function onBetPlaced() {
    loadProfileStats();
    
    // Also dispatch a custom event if other parts need to know
    document.dispatchEvent(new CustomEvent('userDataUpdated'));
}

async function loadProfileStatsWithLoading() {
    // Show loading state
    document.querySelectorAll('.stat-value').forEach(el => {
        el.classList.add('loading');
        el.textContent = '...';
    });

    await loadProfileStats();

    // Remove loading state
    document.querySelectorAll('.stat-value').forEach(el => {
        el.classList.remove('loading');
    });
}

async function loadProfileStats() {
    try {
        const userData = window.authManager?.userData;
        const userId = window.authManager?.user?.uid;
        
        if (!userData || !userId) {
            console.log('No user data available');
            return;
        }

        // Get DOM elements with fallback values
        const daysEl = document.getElementById('profileDaysActive');
        const correctEl = document.getElementById('profileCorrectPredictions');
        const pointsEl = document.getElementById('profileTotalPoints');
        const winRateEl = document.getElementById('profileWinRate');

        // If elements don't exist, exit silently (they might be on a different page)
        if (!daysEl || !correctEl || !pointsEl || !winRateEl) {
            console.log('Profile stats elements not in current view');
            return;
        }

        // 1. Days Active
        if (userData.createdAt) {
            try {
                const createdDate = userData.createdAt.toDate ? 
                    userData.createdAt.toDate() : new Date(userData.createdAt);
                const days = Math.ceil((Date.now() - createdDate) / (1000 * 60 * 60 * 24));
                daysEl.textContent = Math.max(1, days); // At least 1 day
            } catch (e) {
                daysEl.textContent = '1';
            }
        } else {
            daysEl.textContent = '1';
        }

        // 2. Fetch bets with error handling
        let correctBets = 0;
        let totalBets = 0;

        try {
            const betsSnapshot = await db.collection('bets')
                .where('userId', '==', userId)
                .get();

            betsSnapshot.forEach(doc => {
                const bet = doc.data();
                totalBets++;
                // Check multiple possible status fields
                if (bet.status === 'won' || bet.result === 'won' || bet.outcome === 'won') {
                    correctBets++;
                }
            });
        } catch (error) {
            console.error('Error fetching bets:', error);
            // If index missing, show a friendly message
            if (error.code === 'failed-precondition') {
                correctEl.textContent = '0';
                winRateEl.textContent = '0%';
            }
        }

        correctEl.textContent = correctBets;

        // 3. Points
        pointsEl.textContent = userData.points || 0;

        // 4. Win Rate
        const winRate = totalBets > 0 ? ((correctBets / totalBets) * 100).toFixed(1) : 0;
        winRateEl.textContent = winRate + '%';

    } catch (error) {
        console.error('Profile stats error:', error);
        // Don't show "Error" in UI – keep existing values or use defaults
    }
}

document.addEventListener('sectionChanged', (e) => {
    if (e.detail.sectionId === 'profileSection') {
        loadProfileStats();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const table = document.querySelector('.my-bets-table');
    if (table) {
        const checkScrollable = () => {
            if (table.scrollWidth > table.clientWidth) {
                table.classList.add('scrollable');
            } else {
                table.classList.remove('scrollable');
            }
        };
        
        checkScrollable();
        window.addEventListener('resize', checkScrollable);
    }
});

// ==================== MATCH SEARCH AND FILTER FUNCTIONALITY ====================

// Store all matches for filtering
let allMatches = [];

// Override the bettingSystem.loadMatches to store all matches
const originalLoadMatches = bettingSystem.loadMatches;
bettingSystem.loadMatches = async function() {
    try {
        const container = document.getElementById('matchesContainer');
        if (!container) return;
        
        const matchesRef = db.collection('matches');
        const snapshot = await matchesRef
            .where('status', '==', 'upcoming')
            .orderBy('date', 'asc')
            .get();
        
        if (snapshot.empty) {
            allMatches = [];
            updateMatchesDisplay([]);
            return;
        }
        
        allMatches = [];
        snapshot.forEach(doc => {
            allMatches.push({ id: doc.id, ...doc.data() });
        });
        
        // Populate filter dropdowns
        populateFilterDropdowns(allMatches);
        
        // Apply any existing filters
        filterMatches();
        
    } catch (error) {
        console.error("Error loading matches:", error);
        const container = document.getElementById('matchesContainer');
        if (container) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--danger-color);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 4rem;"></i>
                    <h3 style="margin-top: 1rem; color: white;">Error loading matches</h3>
                    <p style="margin-top: 0.5rem;">${error.message}</p>
                </div>
            `;
        }
    }
};

// Populate filter dropdowns with unique values
function populateFilterDropdowns(matches) {
    // Get unique venues
    const venues = [...new Set(matches.map(m => m.venue).filter(Boolean))];
    const venueSelect = document.getElementById('venueFilter');
    if (venueSelect) {
        venueSelect.innerHTML = '<option value="all">All Venues</option>' + 
            venues.sort().map(v => `<option value="${v}">${v}</option>`).join('');
    }
    
    // Get unique teams
    const teams = [...new Set(matches.flatMap(m => [m.homeTeam, m.awayTeam]).filter(Boolean))];
    const teamSelect = document.getElementById('teamFilter');
    if (teamSelect) {
        teamSelect.innerHTML = '<option value="all">All Teams</option>' + 
            teams.sort().map(t => `<option value="${t}">${t}</option>`).join('');
    }
    
    // Get unique leagues
    const leagues = [...new Set(matches.map(m => m.competition).filter(Boolean))];
    const leagueSelect = document.getElementById('leagueFilter');
    if (leagueSelect) {
        // Preserve the first "All Leagues" option and add dynamic ones
        const currentOptions = leagueSelect.innerHTML;
        const newOptions = leagues.sort().map(l => `<option value="${l}">${l}</option>`).join('');
        leagueSelect.innerHTML = '<option value="all">All Leagues</option>' + newOptions;
    }
}

// Filter matches based on all criteria
function filterMatches() {
    const searchTerm = document.getElementById('matchSearchInput')?.value.toLowerCase() || '';
    const league = document.getElementById('leagueFilter')?.value || 'all';
    const venue = document.getElementById('venueFilter')?.value || 'all';
    const team = document.getElementById('teamFilter')?.value || 'all';
    const dateFilter = document.getElementById('dateFilter')?.value || 'all';
    
    let filteredMatches = [...allMatches];
    const activeFilters = [];
    
    // Apply text search
    if (searchTerm) {
        filteredMatches = filteredMatches.filter(match => 
            (match.homeTeam && match.homeTeam.toLowerCase().includes(searchTerm)) ||
            (match.awayTeam && match.awayTeam.toLowerCase().includes(searchTerm)) ||
            (match.competition && match.competition.toLowerCase().includes(searchTerm)) ||
            (match.venue && match.venue.toLowerCase().includes(searchTerm))
        );
        if (filteredMatches.length !== allMatches.length) {
            activeFilters.push(`Search: "${searchTerm}"`);
        }
    }
    
    // Apply league filter
    if (league !== 'all') {
        filteredMatches = filteredMatches.filter(match => match.competition === league);
        activeFilters.push(`League: ${league}`);
    }
    
    // Apply venue filter
    if (venue !== 'all') {
        filteredMatches = filteredMatches.filter(match => match.venue === venue);
        activeFilters.push(`Venue: ${venue}`);
    }
    
    // Apply team filter
    if (team !== 'all') {
        filteredMatches = filteredMatches.filter(match => 
            match.homeTeam === team || match.awayTeam === team
        );
        activeFilters.push(`Team: ${team}`);
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        filteredMatches = filteredMatches.filter(match => {
            if (!match.date || !match.date.toDate) return true;
            const matchDate = match.date.toDate();
            const matchDay = new Date(matchDate.getFullYear(), matchDate.getMonth(), matchDate.getDate());
            
            switch(dateFilter) {
                case 'today':
                    return matchDay.getTime() === today.getTime();
                case 'tomorrow':
                    return matchDay.getTime() === tomorrow.getTime();
                case 'week':
                    // Current week (Monday to Sunday)
                    const startOfWeek = new Date(today);
                    startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);
                    return matchDay >= startOfWeek && matchDay <= endOfWeek;
                case 'weekend':
                    // Saturday and Sunday
                    return matchDay.getDay() === 0 || matchDay.getDay() === 6;
                case 'next7':
                    return matchDay >= today && matchDay <= nextWeek;
                default:
                    return true;
            }
        });
        
        let dateText = '';
        switch(dateFilter) {
            case 'today': dateText = 'Today'; break;
            case 'tomorrow': dateText = 'Tomorrow'; break;
            case 'week': dateText = 'This Week'; break;
            case 'weekend': dateText = 'This Weekend'; break;
            case 'next7': dateText = 'Next 7 Days'; break;
        }
        if (dateText) activeFilters.push(`Date: ${dateText}`);
    }
    
    // Update active filters display
    updateActiveFilters(activeFilters);
    
    // Update matches count
    document.getElementById('matchesCount').innerHTML = 
        `<i class="fas fa-futbol"></i> Found ${filteredMatches.length} match${filteredMatches.length !== 1 ? 'es' : ''}`;
    
    // Display matches
    displayFilteredMatches(filteredMatches);
}

// Display filtered matches using the betting system's display method
function displayFilteredMatches(matches) {
    const container = document.getElementById('matchesContainer');
    if (!container) return;
    
    if (matches.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: var(--gray-color); background: rgba(255,255,255,0.05); border-radius: 30px;">
                <i class="fas fa-search" style="font-size: 5rem; opacity: 0.3; margin-bottom: 1.5rem;"></i>
                <h3 style="color: white; margin-bottom: 0.5rem;">No matches found</h3>
                <p style="margin-bottom: 1.5rem;">Try adjusting your filters or search terms</p>
                <button class="btn btn-primary" onclick="clearFilters()">
                    <i class="fas fa-times"></i> Clear All Filters
                </button>
            </div>
        `;
        return;
    }
    
    const userData = window.authManager?.userData;
    const tier = userData ? bettingSystem.getUserVIPTier(userData.balance) : 'regular';
    const isVIP = tier !== 'regular';
    
    // Group matches by competition
    const groups = matches.reduce((acc, match) => {
        const league = match.competition || 'Other';
        if (!acc[league]) acc[league] = [];
        acc[league].push(match);
        return acc;
    }, {});
    
    let html = '<div class="match-list-container">';
    
    for (const [league, leagueMatches] of Object.entries(groups)) {
        html += `
            <div class="league-group">
                <div class="league-header">
                    <h3><i class="fas fa-trophy"></i> ${league}</h3>
                    <span class="match-count">${leagueMatches.length} match${leagueMatches.length !== 1 ? 'es' : ''}</span>
                </div>
                <div class="league-matches">
        `;
        
        leagueMatches.forEach(match => {
            html += createMatchRow(match, isVIP);
        });
        
        html += '</div></div>';
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// Create a match row (extracted from bettingSystem.displayMatches)
function createMatchRow(match, isVIP = false) {
    let matchDate;
    let dateStr = "Date not set";
    let timeStr = "Time not set";
    
    if (match.date && match.date.toDate) {
        matchDate = match.date.toDate();
        dateStr = matchDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
        timeStr = matchDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    const isSelectedInVIP = multiBetSelections.some(s => s.matchId === match.id);
    const odds = match.odds || { home: 45, draw: 30, away: 25 };
    
    return `
        <div class="match-row ${isSelectedInVIP ? 'selected-for-vip' : ''}" 
             data-match-id="${match.id}"
             onclick="bettingSystem.openMatchDetails('${match.id}')">
            <div class="match-info-compact">
                <span class="match-competition">${match.competition}</span>
                <span class="match-datetime">
                    <i class="far fa-calendar"></i> ${dateStr} • ${timeStr}
                </span>
                <span class="match-venue">
                    <i class="fas fa-map-marker-alt"></i> ${match.venue || 'TBD'}
                </span>
            </div>
            <div class="match-teams-compact">
                <div class="team-compact home">
                    <span class="team-abbr">${match.homeTeam.substring(0, 2).toUpperCase()}</span>
                    <span class="team-name">${match.homeTeam}</span>
                </div>
                <span class="vs-compact">VS</span>
                <div class="team-compact away">
                    <span class="team-abbr">${match.awayTeam.substring(0, 2).toUpperCase()}</span>
                    <span class="team-name">${match.awayTeam}</span>
                </div>
            </div>
            <div class="match-odds-compact">
                <div class="odds-group-compact">
                    <div class="odds-box-compact" data-type="home">
                        <span class="odds-label">H</span>
                        <span class="odds-value">${odds.home}%</span>
                    </div>
                    <div class="odds-box-compact" data-type="draw">
                        <span class="odds-label">D</span>
                        <span class="odds-value">${odds.draw}%</span>
                    </div>
                    <div class="odds-box-compact" data-type="away">
                        <span class="odds-label">A</span>
                        <span class="odds-value">${odds.away}%</span>
                    </div>
                </div>
            </div>
            ${isSelectedInVIP ? '<span class="vip-indicator"><i class="fas fa-crown"></i></span>' : ''}
        </div>
    `;
}

// Update active filters display
function updateActiveFilters(filters) {
    const container = document.getElementById('activeFilters');
    if (!container) return;
    
    if (filters.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = filters.map(filter => `
        <span style="background: var(--accent-color); color: white; padding: 0.25rem 1rem; border-radius: 30px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-filter"></i> ${filter}
        </span>
    `).join('');
}

// Clear all filters
function clearFilters() {
    // Reset inputs
    document.getElementById('matchSearchInput').value = '';
    document.getElementById('leagueFilter').value = 'all';
    document.getElementById('venueFilter').value = 'all';
    document.getElementById('teamFilter').value = 'all';
    document.getElementById('dateFilter').value = 'all';
    
    // Clear active filters display
    document.getElementById('activeFilters').innerHTML = '';
    
    // Reset count
    document.getElementById('matchesCount').innerHTML = `<i class="fas fa-futbol"></i> Showing all ${allMatches.length} matches`;
    
    // Show all matches
    displayFilteredMatches(allMatches);
}

// Search as you type with debounce - REMOVE THE SECOND DECLARATION
// Just use this event listener setup without redeclaring searchTimeout
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('matchSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(filterMatches, 300);
        });
    }
    
    // Initialize date filter with some options
    const dateSelect = document.getElementById('dateFilter');
    if (dateSelect) {
        dateSelect.innerHTML = `
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="week">This Week</option>
            <option value="weekend">This Weekend</option>
            <option value="next7">Next 7 Days</option>
        `;
    }
});

// Mobile Menu Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const userMenu = document.getElementById('userMenuWrapper');
    
    if (mobileToggle && userMenu) {
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            userMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (userMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 767) {
                if (!userMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                    userMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 767) {
                userMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
                
                // Reset display style
                userMenu.style.display = '';
            } else {
                // On mobile, ensure menu is hidden by default
                userMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    }
    
    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (window.innerWidth <= 767 && userMenu?.classList.contains('active')) {
                userMenu.classList.remove('active');
                mobileToggle?.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
});

// Mobile Menu Toggle - Preserves all original functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    const desktopLogoutBtn = document.getElementById('userLogoutBtn');
    const mobileAvatar = document.getElementById('mobileUserAvatar');
    const desktopAvatar = document.getElementById('userAvatar');
    
    // Toggle mobile menu
    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (mobileMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 767) {
                if (!mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                    mobileMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 767) {
                mobileMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Handle logout for both buttons
    if (desktopLogoutBtn) {
        desktopLogoutBtn.addEventListener('click', function() {
            if (window.authManager) {
                window.authManager.auth.signOut();
            }
        });
    }
    
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', function() {
            if (window.authManager) {
                window.authManager.auth.signOut();
            }
        });
    }
    
    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (window.innerWidth <= 767 && mobileMenu?.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                mobileToggle?.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
});

// Update all user data elements - Preserves original behavior
function updateAllUserData() {
    const userData = window.authManager?.userData;
    if (!userData) return;
    
    const firstName = userData.fullName ? userData.fullName.split(' ')[0] : 'User';
    const initials = userData.fullName ? userData.fullName.charAt(0).toUpperCase() : 'U';
    
    // Update desktop elements
    const desktopUserName = document.getElementById('userName');
    const desktopUserRole = document.getElementById('userRoleBadge');
    const desktopUserBalance = document.getElementById('userBalance');
    const desktopUserAvatar = document.getElementById('userAvatar');
    
    if (desktopUserName) desktopUserName.textContent = firstName;
    if (desktopUserRole) desktopUserRole.textContent = userData.role || 'User';
    if (desktopUserBalance) desktopUserBalance.textContent = `Tsh ${(userData.balance || 0).toFixed(2)}`;
    if (desktopUserAvatar) {
        desktopUserAvatar.textContent = initials;
        desktopUserAvatar.style.background = userData.avatarColor || getRandomColor();
    }
    
    // Update mobile elements
    const mobileUserName = document.getElementById('mobileUserName');
    const mobileUserRole = document.getElementById('mobileUserRoleBadge');
    const mobileUserBalance = document.getElementById('mobileUserBalance');
    const mobileUserAvatar = document.getElementById('mobileUserAvatar');
    const mobileLangText = document.getElementById('mobileLangText');
    const dashboardLangText = document.getElementById('dashboardLangText');
    
    if (mobileUserName) mobileUserName.textContent = firstName;
    if (mobileUserRole) mobileUserRole.textContent = userData.role || 'User';
    if (mobileUserBalance) mobileUserBalance.textContent = `Tsh ${(userData.balance || 0).toFixed(2)}`;
    if (mobileUserAvatar) {
        mobileUserAvatar.textContent = initials;
        mobileUserAvatar.style.background = userData.avatarColor || getRandomColor();
    }
    
    // Update language text
    if (mobileLangText) {
        mobileLangText.textContent = window.currentLanguage === 'en' ? 'Kiswahili' : 'English';
    }
    if (dashboardLangText) {
        dashboardLangText.textContent = window.currentLanguage === 'en' ? 'Kiswahili' : 'English';
    }
}

// Helper function for random colors
function getRandomColor() {
    const colors = ['#4A6FA5', '#16697A', '#FFA62B', '#2E8B57', '#DC143C', '#6A5ACD', '#20B2AA', '#FF6347', '#4682B4', '#32CD32'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Call update function when user data loads
document.addEventListener('userDataLoaded', updateAllUserData);
document.addEventListener('authStateChanged', function(e) {
    if (e.detail.user) {
        setTimeout(updateAllUserData, 100);
    }
});

// ==================== UPDATE BALANCE ON HAMBURGER OPEN ====================

// Function to update all balance displays (desktop and mobile)
function updateAllBalanceDisplays() {
    const userData = window.authManager?.userData;
    if (!userData) return;
    
    const balance = userData.balance || 0;
    const balanceFormatted = `Tsh ${balance.toFixed(2)}`;
    
    // Update desktop balance
    const desktopBalance = document.getElementById('userBalance');
    if (desktopBalance) {
        desktopBalance.textContent = balanceFormatted;
    }
    
    // Update mobile balance in hamburger menu
    const mobileBalance = document.getElementById('mobileUserBalance');
    if (mobileBalance) {
        mobileBalance.textContent = balanceFormatted;
    }
    
    // Update any other balance displays
    const walletBalance = document.getElementById('walletBalance');
    if (walletBalance) {
        walletBalance.textContent = balanceFormatted;
    }
    
    const withdrawBalance = document.getElementById('withdrawCurrentBalance');
    if (withdrawBalance) {
        withdrawBalance.textContent = balanceFormatted;
    }
    
    console.log("💰 All balances updated:", balanceFormatted);
}

// Enhanced mobile menu toggle with balance update
function initMobileMenuWithBalance() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileToggle && mobileMenu) {
        // Remove any existing listeners to avoid duplicates
        const newToggle = mobileToggle.cloneNode(true);
        mobileToggle.parentNode.replaceChild(newToggle, mobileToggle);
        
        newToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            // UPDATE BALANCE WHEN MENU OPENS
            if (mobileMenu.classList.contains('active')) {
                updateAllBalanceDisplays(); // Update balance on open
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 767) {
                if (!mobileMenu.contains(e.target) && !newToggle.contains(e.target)) {
                    mobileMenu.classList.remove('active');
                    newToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 767) {
                mobileMenu.classList.remove('active');
                newToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Alternative: Update balance when any modal or menu opens
function setupBalanceUpdateOnOpen() {
    // Watch for hamburger menu open
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                const menu = document.getElementById('mobileMenu');
                if (menu && menu.classList.contains('active')) {
                    updateAllBalanceDisplays();
                }
            }
        });
    });
    
    const menu = document.getElementById('mobileMenu');
    if (menu) {
        observer.observe(menu, { attributes: true });
    }
}

// Update balance when any modal opens
function setupModalBalanceUpdate() {
    const originalOpenModal = window.openModal;
    if (originalOpenModal) {
        window.openModal = function(modalId) {
            originalOpenModal(modalId);
            // Update balance when certain modals open
            const balanceModals = ['walletModal', 'depositModal', 'withdrawalModal', 'bankCardsModal'];
            if (balanceModals.includes(modalId)) {
                setTimeout(updateAllBalanceDisplays, 100);
            }
        };
    }
}

// Real-time balance updates
function setupRealtimeBalanceUpdates() {
    // Update every 30 seconds as a fallback
    setInterval(updateAllBalanceDisplays, 30000);
    
    // Update on focus (when user returns to tab)
    window.addEventListener('focus', updateAllBalanceDisplays);
    
    // Update on visibility change
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            updateAllBalanceDisplays();
        }
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu with balance update
    setTimeout(() => {
        initMobileMenuWithBalance();
        setupBalanceUpdateOnOpen();
        setupModalBalanceUpdate();
        setupRealtimeBalanceUpdates();
    }, 1000);
});

// Override the original updateUserBalanceDisplay function
window.updateUserBalanceDisplay = function() {
    updateAllBalanceDisplays();
};

// Listen for auth state changes
document.addEventListener('authStateChanged', function(e) {
    if (e.detail.user) {
        setTimeout(updateAllBalanceDisplays, 500);
    }
});

// Listen for user data updates
document.addEventListener('userDataUpdated', updateAllBalanceDisplays);

// Listen for transactions
document.addEventListener('transactionCompleted', updateAllBalanceDisplays);

// Manual trigger function (can be called from anywhere)
function refreshBalance() {
    updateAllBalanceDisplays();
    if (typeof showNotification === 'function') {
        showNotification('Balance updated', 'info');
    }
}

// Make it globally available
window.refreshBalance = refreshBalance;

// ==================== UPDATE MOBILE DISPLAY ELEMENTS ====================

// Function to update all mobile display elements
function updateMobileDisplay() {
    const userData = window.authManager?.userData;
    if (!userData) {
        console.log("No user data available for mobile display");
        return;
    }
    
    console.log("Updating mobile display with user data:", userData);
    
    // 1. Update Mobile User Name
    const mobileUserName = document.getElementById('mobileUserName');
    if (mobileUserName) {
        // Display full name or email or fallback
        const displayName = userData.fullName || userData.username || userData.email || 'User';
        mobileUserName.textContent = displayName;
        console.log("Mobile user name updated:", displayName);
    } else {
        console.warn("mobileUserName element not found");
    }
    
    // 2. Update Mobile User Email
    const mobileUserEmail = document.getElementById('mobileUserEmail');
    if (mobileUserEmail) {
        mobileUserEmail.textContent = userData.email || 'No email';
    }
    
    // 3. Update Mobile User Avatar
    const mobileUserAvatar = document.getElementById('mobileUserAvatar');
    if (mobileUserAvatar) {
        // Get initials from full name
        let initials = 'U';
        if (userData.fullName) {
            const nameParts = userData.fullName.split(' ');
            if (nameParts.length >= 2) {
                initials = (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase();
            } else {
                initials = userData.fullName.charAt(0).toUpperCase();
            }
        } else if (userData.username) {
            initials = userData.username.charAt(0).toUpperCase();
        } else if (userData.email) {
            initials = userData.email.charAt(0).toUpperCase();
        }
        
        mobileUserAvatar.textContent = initials;
        
        // Set background color (use stored color or generate random)
        const colors = ['#4A6FA5', '#16697A', '#FFA62B', '#2E8B57', '#DC143C', '#6A5ACD', '#20B2AA', '#FF6347'];
        mobileUserAvatar.style.background = userData.avatarColor || colors[Math.floor(Math.random() * colors.length)];
        
        console.log("Mobile avatar updated with initials:", initials);
    }
    
    // 4. Update Mobile User Balance
    const mobileUserBalance = document.getElementById('mobileUserBalance');
    if (mobileUserBalance) {
        const balance = userData.balance || 0;
        const formattedBalance = `TZS ${balance.toFixed(2)}`;
        mobileUserBalance.textContent = formattedBalance;
        
        // Add animation class
        mobileUserBalance.classList.add('balance-updated');
        setTimeout(() => {
            mobileUserBalance.classList.remove('balance-updated');
        }, 500);
        
        console.log("Mobile balance updated:", formattedBalance);
    }
    
    // 5. Update Referral Count
    const menuReferralCount = document.getElementById('menuReferralCount');
    const menuReferralBadge = document.getElementById('menuReferralBadge');
    const referralCount = userData.referralCount || 0;
    
    if (menuReferralCount) {
        menuReferralCount.textContent = referralCount;
    }
    
    if (menuReferralBadge) {
        menuReferralBadge.textContent = referralCount;
        menuReferralBadge.style.display = referralCount > 0 ? 'inline-block' : 'none';
    }
}

// Function to update mobile display when hamburger opens
function setupMobileDisplayOnHamburgerOpen() {
    const hamburgerTrigger = document.getElementById('hamburgerTrigger');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    
    if (hamburgerTrigger && hamburgerMenu) {
        hamburgerTrigger.addEventListener('click', function() {
            // Update mobile display when hamburger menu is about to open
            setTimeout(() => {
                updateMobileDisplay();
            }, 100); // Small delay to ensure menu is visible
        });
    }
}

// Function to update mobile display on auth change
function setupAuthListenerForMobile() {
    // Listen for auth state changes
    if (window.authManager) {
        // Check every 500ms until user data is available
        const checkInterval = setInterval(() => {
            if (window.authManager.userData) {
                clearInterval(checkInterval);
                updateMobileDisplay();
            }
        }, 500);
    }
}

// Function to refresh mobile display manually
function refreshMobileDisplay() {
    updateMobileDisplay();
    if (typeof showNotification === 'function') {
        showNotification('Display updated', 'success');
    }
}

// Initialize all mobile display functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log("Initializing mobile display system...");
    
    // Initial update
    setTimeout(updateMobileDisplay, 1000);
    
    // Setup hamburger open listener
    setupMobileDisplayOnHamburgerOpen();
    
    // Setup auth listener
    setupAuthListenerForMobile();
    
    // Update on focus (when user returns to tab)
    window.addEventListener('focus', updateMobileDisplay);
    
    // Update on visibility change
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            updateMobileDisplay();
        }
    });
    
    // Listen for custom events
    document.addEventListener('userDataUpdated', updateMobileDisplay);
    document.addEventListener('authStateChanged', function(e) {
        if (e.detail.user) {
            setTimeout(updateMobileDisplay, 500);
        }
    });
    document.addEventListener('balanceUpdated', updateMobileDisplay);
    
    console.log("Mobile display system initialized");
});

// Make functions globally available
window.updateMobileDisplay = updateMobileDisplay;
window.refreshMobileDisplay = refreshMobileDisplay;

// Override the original updateHamburgerMenu function
const originalUpdateHamburgerMenu = window.updateHamburgerMenu;
window.updateHamburgerMenu = function() {
    if (originalUpdateHamburgerMenu) {
        originalUpdateHamburgerMenu();
    }
    updateMobileDisplay();
};

// ==================== REFUND TAB LOADING ====================
// Load refund data when refund tab is opened

// Method 1: Using the existing showSection function
// Modify your existing showSection function or add this check
function showSection(sectionId) {
    // All possible section IDs (matches, my-bets, admin, refund)
    const sections = ['matches', 'my-bets', 'admin', 'refund'];
    
    // 1. Hide all sections
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });
    
    // 2. Show the selected section
    const activeSection = document.getElementById(sectionId);
    if (activeSection) activeSection.style.display = 'block';
    
    // 3. Update active state on every .tab‑btn (works across both nav-tabs blocks)
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        const onclickAttr = btn.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes(`'${sectionId}'`)) {
            btn.classList.add('active');
        }
    });
    
    // 4. Load refund data if refund section is shown
    if (sectionId === 'refund' && window.bettingSystem && typeof window.bettingSystem.loadRefundMatches === 'function') {
        console.log('🔄 Loading refund data...');
        window.bettingSystem.loadRefundMatches();
    }
}

// Method 2: Event listener for section changes (more reliable)
// Add this to your existing event listeners
document.addEventListener('sectionChanged', (e) => {
    const { sectionId, dashboard } = e.detail;
    
    // Load refund data when refund section becomes active
    if (sectionId === 'refund' || sectionId === 'refundSection') {
        console.log('🔄 Refund tab opened - loading refund data');
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            if (window.bettingSystem && typeof window.bettingSystem.loadRefundMatches === 'function') {
                window.bettingSystem.loadRefundMatches();
            }
            
            // Also load refund history
            if (window.bettingSystem && typeof window.bettingSystem.loadRefundHistory === 'function') {
                window.bettingSystem.loadRefundHistory();
            }
        }, 200);
    }
    
    // Load refund data when admin matches section with refund tab is opened
    if (sectionId === 'adminmatchesSection' || sectionId === 'adminMatchesSection') {
        // Check if refund tab is active within the admin matches section
        setTimeout(() => {
            const refundSection = document.getElementById('refund');
            if (refundSection && refundSection.style.display !== 'none') {
                console.log('🔄 Admin refund tab opened - loading refund data');
                if (window.bettingSystem && typeof window.bettingSystem.loadRefundMatches === 'function') {
                    window.bettingSystem.loadRefundMatches();
                }
                if (window.bettingSystem && typeof window.bettingSystem.loadRefundHistory === 'function') {
                    window.bettingSystem.loadRefundHistory();
                }
            }
        }, 200);
    }
});

// Method 3: Direct click handler for refund tab buttons
// Add this after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Find all refund tab buttons and attach click handlers
    const refundTabButtons = document.querySelectorAll('[onclick*="showSection(\'refund\'"]');
    refundTabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('🔄 Refund tab clicked - loading refund data');
            setTimeout(() => {
                if (window.bettingSystem && typeof window.bettingSystem.loadRefundMatches === 'function') {
                    window.bettingSystem.loadRefundMatches();
                }
                if (window.bettingSystem && typeof window.bettingSystem.loadRefundHistory === 'function') {
                    window.bettingSystem.loadRefundHistory();
                }
            }, 300);
        });
    });
    
    // Also handle any other refund-related buttons
    const refundNavItems = document.querySelectorAll('.nav-item[data-section="refund"], .nav-item[data-section="refundSection"]');
    refundNavItems.forEach(item => {
        item.addEventListener('click', function() {
            console.log('🔄 Refund navigation clicked - loading refund data');
            setTimeout(() => {
                if (window.bettingSystem && typeof window.bettingSystem.loadRefundMatches === 'function') {
                    window.bettingSystem.loadRefundMatches();
                }
                if (window.bettingSystem && typeof window.bettingSystem.loadRefundHistory === 'function') {
                    window.bettingSystem.loadRefundHistory();
                }
            }, 300);
        });
    });
});

// Method 4: For the admin panel's refund tab specifically
// Add to your existing tab switching function for admin
function switchAdminTab(tabName) {
    // Your existing tab switching code...
    
    // If switching to refund tab, load refund data
    if (tabName === 'refund') {
        setTimeout(() => {
            if (window.bettingSystem && typeof window.bettingSystem.loadRefundMatches === 'function') {
                console.log('🔄 Admin refund tab activated - loading refund data');
                window.bettingSystem.loadRefundMatches();
            }
            if (window.bettingSystem && typeof window.bettingSystem.loadRefundHistory === 'function') {
                window.bettingSystem.loadRefundHistory();
            }
        }, 200);
    }
}

// Method 5: Manual refresh function for refund data
// This can be called from anywhere
function refreshRefundData() {
    console.log('🔄 Manually refreshing refund data');
    if (window.bettingSystem && typeof window.bettingSystem.loadRefundMatches === 'function') {
        window.bettingSystem.loadRefundMatches();
    }
    if (window.bettingSystem && typeof window.bettingSystem.loadRefundHistory === 'function') {
        window.bettingSystem.loadRefundHistory();
    }
}

// Make refresh function globally available
window.refreshRefundData = refreshRefundData;

// Method 6: For the nav-tabs buttons specifically
// Add this to handle clicks on the refund tab in admin panel
document.addEventListener('click', function(e) {
    // Check if clicked element is a tab button that activates refund
    if (e.target.closest('.tab-btn') && e.target.closest('.tab-btn').textContent.includes('Refund')) {
        console.log('🔄 Refund tab button clicked via delegation');
        setTimeout(() => {
            if (window.bettingSystem && typeof window.bettingSystem.loadRefundMatches === 'function') {
                window.bettingSystem.loadRefundMatches();
            }
        }, 300);
    }
    
    // Check for refund navigation items
    if (e.target.closest('[data-section="refund"]') || e.target.closest('[data-section="refundSection"]')) {
        console.log('🔄 Refund navigation clicked via delegation');
        setTimeout(() => {
            if (window.bettingSystem && typeof window.bettingSystem.loadRefundMatches === 'function') {
                window.bettingSystem.loadRefundMatches();
            }
        }, 300);
    }
});

// Also load refund data when user data changes (e.g., after a bet is settled)
document.addEventListener('userDataUpdated', function() {
    // Check if refund section is currently visible
    const refundSection = document.getElementById('refund');
    const adminRefundSection = document.getElementById('refund') || document.querySelector('.refund-tab.active');
    
    if (refundSection && refundSection.style.display !== 'none') {
        console.log('🔄 User data updated - refreshing refund data');
        setTimeout(() => {
            if (window.bettingSystem && typeof window.bettingSystem.loadRefundMatches === 'function') {
                window.bettingSystem.loadRefundMatches();
            }
        }, 500);
    }
});

console.log('✅ Refund tab loader initialized');

// ==================== COMPLETE REFUND SYSTEM WITH DELETE & CANCEL ====================

class RefundSystem {
    constructor() {
        this.currentMatchRefunds = [];
        this.deletedRefunds = [];
        this.cancelledRefunds = [];
        this.isLoading = false;
        this.autoRefreshInterval = null;
        this.init();
    }

    async init() {
        console.log("🔄 Initializing Complete Refund System with Delete & Cancel...");
        await this.loadDeletedRefunds();
        await this.loadCancelledRefunds();
        this.setupEventListeners();
        this.setupAutoRefresh();
    }

    setupEventListeners() {
        // Listen for section changes
        document.addEventListener('sectionChanged', (e) => {
            if (e.detail.sectionId === 'refund') {
                console.log('📢 Refund section opened');
                this.loadRefundMatches();
                this.loadRefundHistory();
            }
        });

        // Listen for manual refresh button
        const refreshBtn = document.getElementById('refreshRefundBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.quickRefresh();
            });
        }

        // Listen for keyboard shortcut (Ctrl+R) when in refund section
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'r') {
                const refundSection = document.getElementById('refund');
                if (refundSection && refundSection.classList.contains('active')) {
                    e.preventDefault();
                    this.quickRefresh();
                }
            }
        });
    }

    setupAutoRefresh() {
        // Auto refresh every 30 seconds if refund section is active
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }

        this.autoRefreshInterval = setInterval(() => {
            const refundSection = document.getElementById('refund');
            if (refundSection && refundSection.classList.contains('active') && !this.isLoading) {
                console.log('🔄 Auto-refreshing refund data...');
                this.loadRefundMatches(false);
            }
        }, 30000); // 30 seconds
    }

    // ========== QUICK REFRESH ==========
    async quickRefresh() {
        console.log('⚡ Quick refresh triggered');
        
        // Show visual feedback
        const refreshBtn = document.getElementById('refreshRefundBtn');
        if (refreshBtn) {
            refreshBtn.classList.add('refreshing');
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        }

        await this.loadRefundMatches(true);
        await this.loadRefundHistory();

        // Show success message
        showNotification('Refund data refreshed successfully', 'success');

        // Reset button
        if (refreshBtn) {
            setTimeout(() => {
                refreshBtn.classList.remove('refreshing');
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> <span>Refresh Data</span>';
            }, 500);
        }
    }

    // ========== LOAD REFUND MATCHES ==========
    async loadRefundMatches(showLoading = true) {
        if (this.isLoading) {
            console.log('⏳ Already loading...');
            return;
        }

        this.isLoading = true;
        
        const container = document.getElementById('refundMatchesContainer');
        const lastUpdatedEl = document.getElementById('refundLastUpdated');
        
        if (!container) {
            console.error('Refund container not found');
            this.isLoading = false;
            return;
        }

        if (showLoading) {
            container.innerHTML = `
                <div class="loading-state">
                    <i class="fas fa-spinner fa-pulse"></i>
                    <p>Loading refund data...</p>
                    <small>Fetching matches and calculating lost bets...</small>
                </div>
            `;
        }

        try {
            // Get all finished matches
            const matchesSnapshot = await db.collection('matches')
                .where('status', '==', 'finished')
                .orderBy('date', 'desc')
                .get();

            console.log(`📊 Found ${matchesSnapshot.size} finished matches`);

            if (matchesSnapshot.empty) {
                container.innerHTML = this.getEmptyStateHTML();
                this.updateSummaryStats(0, 0, 0, 0, 0, 0, 0);
                this.updateLastUpdated();
                this.isLoading = false;
                return;
            }

            let html = '';
            let hasAnyRefundable = false;
            let totalStats = {
                matches: 0,
                lostBets: 0,
                users: new Set(),
                stake: 0,
                refundedMatches: 0,
                pendingRefunds: 0,
                cancelledRefunds: 0
            };

            // Process each match in parallel for better performance
            const matchPromises = [];
            matchesSnapshot.docs.forEach(matchDoc => {
                matchPromises.push(this.processMatchForRefund(matchDoc));
            });

            const matchResults = await Promise.all(matchPromises);

            // Sort matches: pending first, then refunded, then cancelled
            matchResults.sort((a, b) => {
                if (a.status === 'pending' && b.status !== 'pending') return -1;
                if (a.status !== 'pending' && b.status === 'pending') return 1;
                if (a.status === 'refunded' && b.status === 'cancelled') return -1;
                if (a.status === 'cancelled' && b.status === 'refunded') return 1;
                return 0;
            });

            matchResults.forEach(result => {
                if (result.hasData) {
                    hasAnyRefundable = true;
                    totalStats.matches++;
                    totalStats.lostBets += result.lostData.totalLostBets;
                    totalStats.stake += result.lostData.totalLostStake;
                    
                    if (result.status === 'refunded') {
                        totalStats.refundedMatches++;
                    } else if (result.status === 'cancelled') {
                        totalStats.cancelledRefunds++;
                    } else {
                        totalStats.pendingRefunds++;
                    }
                    
                    Object.keys(result.lostData.userLostBets).forEach(userId => {
                        totalStats.users.add(userId);
                    });
                    
                    html += result.cardHtml;
                }
            });

            // Update summary stats
            this.updateSummaryStats(
                totalStats.matches,
                totalStats.lostBets,
                totalStats.users.size,
                totalStats.stake,
                totalStats.refundedMatches,
                totalStats.pendingRefunds,
                totalStats.cancelledRefunds
            );

            if (!hasAnyRefundable) {
                container.innerHTML = this.getEmptyStateHTML();
            } else {
                container.innerHTML = `
                    <div class="refund-filters">
                        <button class="filter-btn active" data-filter="all">All (${totalStats.matches})</button>
                        <button class="filter-btn" data-filter="pending">Pending (${totalStats.pendingRefunds})</button>
                        <button class="filter-btn" data-filter="refunded">Refunded (${totalStats.refundedMatches})</button>
                        <button class="filter-btn" data-filter="cancelled">Cancelled (${totalStats.cancelledRefunds})</button>
                    </div>
                    <div class="refund-matches-grid">
                        ${html}
                    </div>
                `;

                // Add filter functionality
                this.setupFilterButtons();
            }

            this.updateLastUpdated();
            console.log(`✅ Refund data loaded: ${totalStats.matches} matches`);

        } catch (error) {
            console.error("Error loading refund matches:", error);
            container.innerHTML = this.getErrorStateHTML(error);
        } finally {
            this.isLoading = false;
        }
    }

    async processMatchForRefund(matchDoc) {
        const match = { id: matchDoc.id, ...matchDoc.data() };
        
        // Get lost bets for this match
        const lostData = await this.getLostBetsForMatch(match.id);
        
        // Check refund status
        const refundStatus = await this.getMatchRefundStatus(match.id);
        const hasRefunds = refundStatus.hasRefunds;
        const isCancelled = refundStatus.isCancelled;
        const refundDetails = refundStatus.details;
        
        let status = 'pending';
        if (hasRefunds) status = 'refunded';
        else if (isCancelled) status = 'cancelled';
        
        if (lostData.totalLostStake > 0 || hasRefunds || isCancelled) {
            const cardHtml = this.createRefundMatchCard(match, lostData, status, refundDetails);
            return { hasData: true, lostData, cardHtml, status };
        }
        
        return { hasData: false };
    }

    // ========== CHECK MATCH REFUND STATUS ==========
    async getMatchRefundStatus(matchId) {
        try {
            const refundTransactions = await db.collection('transactions')
                .where('matchId', '==', matchId)
                .where('type', '==', 'refund')
                .get();

            const hasRefunds = !refundTransactions.empty;
            
            const details = {
                totalRefunded: 0,
                usersRefunded: new Set(),
                transactions: [],
                refundDate: null
            };

            refundTransactions.forEach(doc => {
                const trans = doc.data();
                details.totalRefunded += trans.amount || 0;
                details.usersRefunded.add(trans.userId);
                details.transactions.push({
                    id: doc.id,
                    ...trans
                });
                if (trans.date && !details.refundDate) {
                    details.refundDate = trans.date;
                }
            });

            // Check if refund was cancelled
            const cancelledCheck = await db.collection('cancelledRefunds')
                .where('matchId', '==', matchId)
                .get();

            const isCancelled = !cancelledCheck.empty;

            // Check if refund was deleted
            const deletedCheck = await db.collection('deletedRefunds')
                .where('matchId', '==', matchId)
                .get();

            const isDeleted = !deletedCheck.empty;

            return {
                hasRefunds,
                isCancelled,
                isDeleted,
                details: {
                    ...details,
                    usersCount: details.usersRefunded.size,
                    cancelledAt: isCancelled ? cancelledCheck.docs[0]?.data().cancelledAt : null,
                    deletedAt: isDeleted ? deletedCheck.docs[0]?.data().deletedAt : null
                }
            };

        } catch (error) {
            console.error("Error checking refund status:", error);
            return { hasRefunds: false, isCancelled: false, isDeleted: false, details: null };
        }
    }

    // ========== GET LOST BETS FOR A MATCH ==========
    async getLostBetsForMatch(matchId) {
        try {
            // Get lost single bets
            const lostSingleSnapshot = await db.collection('bets')
                .where('matchId', '==', matchId)
                .where('status', '==', 'lost')
                .where('type', '==', 'single')
                .get();

            // Get lost multi-bets (filter in memory)
            const lostMultiSnapshot = await db.collection('bets')
                .where('status', '==', 'lost')
                .where('type', '==', 'multi')
                .get();

            const affectedMultiBets = [];
            const userLostBets = {};
            let totalLostStake = 0;

            // Process single bets
            lostSingleSnapshot.forEach(doc => {
                const bet = doc.data();
                const userId = bet.userId;
                
                if (!userLostBets[userId]) {
                    userLostBets[userId] = { totalStake: 0, bets: [] };
                }
                
                userLostBets[userId].totalStake += bet.stake || 0;
                userLostBets[userId].bets.push({
                    id: doc.id,
                    ...bet,
                    type: 'single'
                });
                totalLostStake += bet.stake || 0;
            });

            // Process multi bets
            lostMultiSnapshot.forEach(doc => {
                const bet = { id: doc.id, ...doc.data() };
                if (bet.selections && Array.isArray(bet.selections)) {
                    const hasThisMatch = bet.selections.some(s => s.matchId === matchId);
                    if (hasThisMatch) {
                        affectedMultiBets.push(bet);
                        
                        const userId = bet.userId;
                        if (!userLostBets[userId]) {
                            userLostBets[userId] = { totalStake: 0, bets: [] };
                        }
                        
                        const proportionalStake = (bet.stake || 0) / bet.selections.length;
                        userLostBets[userId].totalStake += proportionalStake;
                        userLostBets[userId].bets.push({
                            ...bet,
                            type: 'multi',
                            proportionalStake
                        });
                        totalLostStake += proportionalStake;
                    }
                }
            });

            return {
                lostSingleCount: lostSingleSnapshot.size,
                lostMultiCount: affectedMultiBets.length,
                totalLostBets: lostSingleSnapshot.size + affectedMultiBets.length,
                totalLostStake,
                userLostBets,
                affectedMultiBets
            };

        } catch (error) {
            console.error("Error getting lost bets:", error);
            return {
                lostSingleCount: 0,
                lostMultiCount: 0,
                totalLostBets: 0,
                totalLostStake: 0,
                userLostBets: {},
                affectedMultiBets: []
            };
        }
    }

    // ========== CREATE REFUND MATCH CARD ==========
    createRefundMatchCard(match, lostData, status, refundDetails) {
        const matchDate = match.date?.toDate ? match.date.toDate() : new Date();
        const formattedDate = matchDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const resultText = match.result ? 
            `${match.homeTeam || 'Home'} ${match.result.home || 0} - ${match.result.away || 0} ${match.awayTeam || 'Away'}` : 
            'No result set';

        const userCount = Object.keys(lostData.userLostBets).length;
        const refundedAmount = refundDetails?.totalRefunded || 0;
        const refundedUsers = refundDetails?.usersCount || 0;
        const refundDate = refundDetails?.refundDate?.toDate ? 
            refundDetails.refundDate.toDate().toLocaleString() : '';
        const cancelledDate = refundDetails?.cancelledAt?.toDate ? 
            refundDetails.cancelledAt.toDate().toLocaleString() : '';

        const statusClass = status;
        let statusIcon = 'fa-clock';
        let statusText = 'Pending Refund';
        
        if (status === 'refunded') {
            statusIcon = 'fa-check-circle';
            statusText = 'Refunded';
        } else if (status === 'cancelled') {
            statusIcon = 'fa-times-circle';
            statusText = 'Cancelled';
        }

        return `
            <div class="refund-match-card ${statusClass}" data-match-id="${match.id}" data-status="${status}">
                <div class="refund-match-header">
                    <div class="match-info">
                        <div class="match-title">
                            <h4><i class="fas fa-futbol"></i> ${match.homeTeam || 'Home'} vs ${match.awayTeam || 'Away'}</h4>
                            <span class="status-badge ${statusClass}">
                                <i class="fas ${statusIcon}"></i>
                                ${statusText}
                            </span>
                        </div>
                        <div class="match-meta">
                            <span><i class="far fa-calendar"></i> ${formattedDate}</span>
                            <span><i class="fas fa-trophy"></i> ${match.competition || 'Friendly'}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${match.venue || 'TBD'}</span>
                        </div>
                        <div class="match-result">
                            <i class="fas fa-flag-checkered"></i> Result: ${resultText}
                        </div>
                    </div>
                    
                    <div class="match-stats">
                        <div class="stat-badge lost">
                            <span class="stat-label">Lost Bets</span>
                            <span class="stat-value">${lostData.totalLostBets}</span>
                        </div>
                        <div class="stat-badge users">
                            <span class="stat-label">Affected Users</span>
                            <span class="stat-value">${userCount}</span>
                        </div>
                        <div class="stat-badge amount">
                            <span class="stat-label">Total Stake</span>
                            <span class="stat-value">TZS ${lostData.totalLostStake.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div class="refund-details">
                    <div class="bets-breakdown">
                        <div class="breakdown-item">
                            <i class="fas fa-ticket-alt"></i>
                            <span>Single Bets: ${lostData.lostSingleCount}</span>
                        </div>
                        <div class="breakdown-item">
                            <i class="fas fa-layer-group"></i>
                            <span>Multi-Bets: ${lostData.lostMultiCount}</span>
                        </div>
                    </div>

                    ${userCount > 0 ? `
                        <div class="users-list-preview">
                            <h5>Affected Users:</h5>
                            <div class="user-preview-items">
                                ${Object.entries(lostData.userLostBets).slice(0, 3).map(([userId, data]) => `
                                    <div class="user-preview-item">
                                        <i class="fas fa-user-circle"></i>
                                        <span>${userId.substring(0, 8)}... - TZS ${data.totalStake.toFixed(2)}</span>
                                    </div>
                                `).join('')}
                                ${userCount > 3 ? `<div class="more-users">+${userCount - 3} more users</div>` : ''}
                            </div>
                        </div>
                    ` : ''}

                    ${status === 'refunded' ? `
                        <div class="refund-summary">
                            <h5><i class="fas fa-check-circle"></i> Refund Summary</h5>
                            <div class="summary-details">
                                <div class="summary-item">
                                    <span>Amount Refunded:</span>
                                    <strong class="positive">TZS ${refundedAmount.toFixed(2)}</strong>
                                </div>
                                <div class="summary-item">
                                    <span>Users Refunded:</span>
                                    <strong>${refundedUsers}</strong>
                                </div>
                                ${refundDate ? `
                                <div class="summary-item">
                                    <span>Refund Date:</span>
                                    <strong>${refundDate}</strong>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    ` : ''}

                    ${status === 'cancelled' ? `
                        <div class="cancelled-summary">
                            <h5><i class="fas fa-times-circle"></i> Refund Cancelled</h5>
                            <div class="summary-details">
                                ${cancelledDate ? `
                                <div class="summary-item">
                                    <span>Cancelled Date:</span>
                                    <strong>${cancelledDate}</strong>
                                </div>
                                ` : ''}
                                <div class="summary-item">
                                    <span>Status:</span>
                                    <strong class="cancelled">Cancelled</strong>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>

                <div class="refund-actions">
                    ${status === 'pending' ? `
                        <button class="btn-refund" onclick="refundSystem.processRefund('${match.id}')" 
                                ${lostData.totalLostStake === 0 ? 'disabled' : ''}>
                            <i class="fas fa-hand-holding-usd"></i>
                            Process Refund (TZS ${lostData.totalLostStake.toFixed(2)})
                        </button>
                        <button class="btn-cancel" onclick="refundSystem.cancelRefund('${match.id}')">
                            <i class="fas fa-times-circle"></i>
                            Cancel Refund
                        </button>
                    ` : status === 'refunded' ? `
                        <button class="btn-delete" onclick="refundSystem.deleteRefund('${match.id}')">
                            <i class="fas fa-trash-alt"></i>
                            Delete Refund
                        </button>
                    ` : status === 'cancelled' ? `
                        <button class="btn-reinstate" onclick="refundSystem.reinstateRefund('${match.id}')">
                            <i class="fas fa-undo-alt"></i>
                            Reinstate Refund
                        </button>
                        <button class="btn-delete" onclick="refundSystem.deleteRefund('${match.id}')">
                            <i class="fas fa-trash-alt"></i>
                            Delete Permanently
                        </button>
                    ` : ''}
                    
                    <button class="btn-details" onclick="refundSystem.viewRefundDetails('${match.id}')">
                        <i class="fas fa-eye"></i>
                        View Details
                    </button>
                </div>

                ${status === 'refunded' ? `
                    <div class="refund-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        <span>Refund has been processed. Click "Delete Refund" to remove this record.</span>
                    </div>
                ` : status === 'cancelled' ? `
                    <div class="cancelled-warning">
                        <i class="fas fa-info-circle"></i>
                        <span>This refund was cancelled. Click "Reinstate" to make it available again or "Delete" to remove permanently.</span>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // ========== PROCESS REFUND ==========
    async processRefund(matchId) {
        if (!confirm('Are you sure you want to process refunds for all lost bets in this match?')) {
            return;
        }

        const btn = event.currentTarget;
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        try {
            const matchDoc = await db.collection('matches').doc(matchId).get();
            if (!matchDoc.exists) {
                throw new Error('Match not found');
            }
            const match = matchDoc.data();

            const lostData = await this.getLostBetsForMatch(matchId);
            
            if (lostData.totalLostStake === 0) {
                showNotification('No lost bets found for this match', 'warning');
                btn.disabled = false;
                btn.innerHTML = originalText;
                return;
            }

            const batch = db.batch();
            const userRefunds = {};
            const refundRecords = [];

            // Process single bets
            for (const [userId, data] of Object.entries(lostData.userLostBets)) {
                for (const bet of data.bets) {
                    if (bet.type === 'single') {
                        const betRef = db.collection('bets').doc(bet.id);
                        batch.update(betRef, {
                            status: 'refunded',
                            refundedAt: firebase.firestore.FieldValue.serverTimestamp(),
                            refundAmount: bet.stake,
                            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                        });

                        if (!userRefunds[userId]) userRefunds[userId] = 0;
                        userRefunds[userId] += bet.stake || 0;

                        refundRecords.push({
                            userId,
                            betId: bet.id,
                            amount: bet.stake,
                            type: 'single'
                        });
                    }
                }
            }

            // Process multi bets
            for (const bet of lostData.affectedMultiBets) {
                const betRef = db.collection('bets').doc(bet.id);
                const updatedSelections = (bet.selections || []).map(s => {
                    if (s.matchId === matchId) {
                        return { ...s, status: 'refunded', refundedAt: new Date().toISOString() };
                    }
                    return s;
                });

                batch.update(betRef, {
                    selections: updatedSelections,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                const proportionalRefund = (bet.stake || 0) / (bet.selections?.length || 1);
                if (!userRefunds[bet.userId]) userRefunds[bet.userId] = 0;
                userRefunds[bet.userId] += proportionalRefund;

                refundRecords.push({
                    userId: bet.userId,
                    betId: bet.id,
                    amount: proportionalRefund,
                    type: 'multi'
                });
            }

            // Update user balances and create transactions
            for (const [userId, amount] of Object.entries(userRefunds)) {
                const userRef = db.collection('users').doc(userId);
                batch.update(userRef, {
                    balance: firebase.firestore.FieldValue.increment(amount),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                const transRef = db.collection('transactions').doc();
                batch.set(transRef, {
                    userId: userId,
                    type: 'refund',
                    amount: amount,
                    description: `Refund for match: ${match.homeTeam || 'Home'} vs ${match.awayTeam || 'Away'}`,
                    matchId: matchId,
                    date: firebase.firestore.FieldValue.serverTimestamp(),
                    processedBy: window.authManager?.user?.uid || 'system',
                    refundDetails: refundRecords.filter(r => r.userId === userId)
                });
            }

            // Add audit log
            const auditRef = db.collection('auditLogs').doc();
            batch.set(auditRef, {
                action: 'process_refund',
                matchId: matchId,
                matchName: `${match.homeTeam || 'Home'} vs ${match.awayTeam || 'Away'}`,
                totalAmount: lostData.totalLostStake,
                usersAffected: Object.keys(userRefunds).length,
                betsAffected: lostData.totalLostBets,
                processedBy: window.authManager?.user?.uid || 'system',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            await batch.commit();

            showNotification(
                `✅ Successfully refunded TZS ${lostData.totalLostStake.toFixed(2)} to ${Object.keys(userRefunds).length} users`,
                'success'
            );

            await this.loadRefundMatches();
            await this.loadRefundHistory();

        } catch (error) {
            console.error("Error processing refund:", error);
            showNotification(`Error: ${error.message}`, 'error');
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }

    // ========== CANCEL REFUND ==========
    async cancelRefund(matchId) {
        if (!confirm('⚠️ Are you sure you want to cancel this refund? No refunds have been processed yet.')) {
            return;
        }

        const btn = event.currentTarget;
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cancelling...';

        try {
            const matchDoc = await db.collection('matches').doc(matchId).get();
            if (!matchDoc.exists) {
                throw new Error('Match not found');
            }
            const match = matchDoc.data();

            // Record the cancellation
            const cancelledRefundRef = db.collection('cancelledRefunds').doc();
            await cancelledRefundRef.set({
                matchId: matchId,
                matchName: `${match.homeTeam || 'Home'} vs ${match.awayTeam || 'Away'}`,
                cancelledAt: firebase.firestore.FieldValue.serverTimestamp(),
                cancelledBy: window.authManager?.user?.uid || 'system'
            });

            // Add audit log
            const auditRef = db.collection('auditLogs').doc();
            await auditRef.set({
                action: 'cancel_refund',
                matchId: matchId,
                matchName: `${match.homeTeam || 'Home'} vs ${match.awayTeam || 'Away'}`,
                cancelledBy: window.authManager?.user?.uid || 'system',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            showNotification('Refund cancelled successfully', 'success');
            
            await this.loadCancelledRefunds();
            await this.loadRefundMatches();
            await this.loadRefundHistory();

        } catch (error) {
            console.error("Error cancelling refund:", error);
            showNotification(`Error: ${error.message}`, 'error');
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }

    // ========== REINSTATE REFUND ==========
    async reinstateRefund(matchId) {
        if (!confirm('Are you sure you want to reinstate this refund? It will become available for processing again.')) {
            return;
        }

        const btn = event.currentTarget;
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Reinstating...';

        try {
            // Find and delete the cancelled record
            const cancelledSnapshot = await db.collection('cancelledRefunds')
                .where('matchId', '==', matchId)
                .get();

            const batch = db.batch();
            
            cancelledSnapshot.forEach(doc => {
                batch.delete(doc.ref);
            });

            // Add audit log
            const auditRef = db.collection('auditLogs').doc();
            batch.set(auditRef, {
                action: 'reinstate_refund',
                matchId: matchId,
                reinstatedBy: window.authManager?.user?.uid || 'system',
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            await batch.commit();

            showNotification('Refund reinstated successfully', 'success');
            
            await this.loadCancelledRefunds();
            await this.loadRefundMatches();
            await this.loadRefundHistory();

        } catch (error) {
            console.error("Error reinstating refund:", error);
            showNotification(`Error: ${error.message}`, 'error');
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }

    // ========== DELETE REFUND ==========
    async deleteRefund(matchId) {
        if (!confirm('⚠️ WARNING: This will permanently delete this refund record. This action cannot be undone!')) {
            return;
        }

        // Double confirmation
        const secondConfirm = prompt('Type "DELETE" to confirm permanent deletion:');
        if (secondConfirm !== 'DELETE') {
            showNotification('Deletion cancelled', 'info');
            return;
        }

        const btn = event.currentTarget;
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';

        try {
            const matchDoc = await db.collection('matches').doc(matchId).get();
            const match = matchDoc.data();

            // Get all refund transactions for this match
            const refundTransactions = await db.collection('transactions')
                .where('matchId', '==', matchId)
                .where('type', '==', 'refund')
                .get();

            // Get cancelled records for this match
            const cancelledRecords = await db.collection('cancelledRefunds')
                .where('matchId', '==', matchId)
                .get();

            const batch = db.batch();
            let totalDeleted = 0;

            // Delete all refund transactions
            refundTransactions.forEach(doc => {
                totalDeleted += doc.data().amount || 0;
                batch.delete(doc.ref);
            });

            // Delete cancelled records
            cancelledRecords.forEach(doc => {
                batch.delete(doc.ref);
            });

            // Record the deletion
            const deletedRefundRef = db.collection('deletedRefunds').doc();
            batch.set(deletedRefundRef, {
                matchId: matchId,
                matchName: `${match.homeTeam || 'Home'} vs ${match.awayTeam || 'Away'}`,
                totalAmount: totalDeleted,
                deletedAt: firebase.firestore.FieldValue.serverTimestamp(),
                deletedBy: window.authManager?.user?.uid || 'system'
            });

            await batch.commit();

            showNotification('Refund record deleted successfully', 'success');
            
            await this.loadDeletedRefunds();
            await this.loadRefundMatches();
            await this.loadRefundHistory();

        } catch (error) {
            console.error("Error deleting refund:", error);
            showNotification(`Error: ${error.message}`, 'error');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }

    // ========== LOAD CANCELLED REFUNDS ==========
    async loadCancelledRefunds() {
        try {
            const snapshot = await db.collection('cancelledRefunds')
                .orderBy('cancelledAt', 'desc')
                .limit(50)
                .get();
            
            this.cancelledRefunds = [];
            snapshot.forEach(doc => {
                this.cancelledRefunds.push({ id: doc.id, ...doc.data() });
            });
            
            return this.cancelledRefunds;
        } catch (error) {
            console.error("Error loading cancelled refunds:", error);
            return [];
        }
    }

    // ========== VIEW REFUND DETAILS ==========
    async viewRefundDetails(matchId) {
        try {
            const matchDoc = await db.collection('matches').doc(matchId).get();
            if (!matchDoc.exists) {
                showNotification('Match not found', 'error');
                return;
            }
            const match = matchDoc.data();

            const refundTransactions = await db.collection('transactions')
                .where('matchId', '==', matchId)
                .where('type', '==', 'refund')
                .get();

            const cancelledInfo = await db.collection('cancelledRefunds')
                .where('matchId', '==', matchId)
                .get();

            const refundedBets = await db.collection('bets')
                .where('refundedAt', '>', new Date(0))
                .get();

            const matchRefundedBets = [];
            refundedBets.forEach(doc => {
                const bet = doc.data();
                if (bet.matchId === matchId || 
                    (bet.selections && bet.selections.some(s => s.matchId === matchId && s.status === 'refunded'))) {
                    matchRefundedBets.push({ id: doc.id, ...bet });
                }
            });

            const isCancelled = !cancelledInfo.empty;
            const cancelledDate = isCancelled ? cancelledInfo.docs[0]?.data().cancelledAt?.toDate() : null;

            // Create modal content
            const modalContent = `
                <div class="refund-details-modal">
                    <h3>Refund Details - ${match.homeTeam || 'Home'} vs ${match.awayTeam || 'Away'}</h3>
                    
                    ${isCancelled ? `
                        <div class="cancelled-banner">
                            <i class="fas fa-times-circle"></i>
                            <span>This refund was cancelled on ${cancelledDate ? cancelledDate.toLocaleString() : 'Unknown date'}</span>
                        </div>
                    ` : ''}
                    
                    <div class="details-section">
                        <h4>Transaction Summary</h4>
                        <table class="details-table">
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${refundTransactions.docs.map(doc => {
                                    const trans = doc.data();
                                    const date = trans.date?.toDate ? trans.date.toDate().toLocaleString() : 'N/A';
                                    return `
                                        <tr>
                                            <td>${trans.userId?.substring(0, 8)}...</td>
                                            <td class="positive">TZS ${(trans.amount || 0).toFixed(2)}</td>
                                            <td>${date}</td>
                                        </tr>
                                    `;
                                }).join('')}
                                ${refundTransactions.empty ? '<tr><td colspan="3" class="no-data">No transactions found</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>

                    <div class="details-section">
                        <h4>Refunded Bets</h4>
                        <table class="details-table">
                            <thead>
                                <tr>
                                    <th>Bet ID</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${matchRefundedBets.map(bet => {
                                    const amount = bet.type === 'multi' ? 
                                        ((bet.stake || 0) / (bet.selections?.length || 1)) : (bet.stake || 0);
                                    return `
                                        <tr>
                                            <td>${bet.id?.substring(0, 8)}...</td>
                                            <td>${bet.type}</td>
                                            <td class="positive">TZS ${amount.toFixed(2)}</td>
                                        </tr>
                                    `;
                                }).join('')}
                                ${matchRefundedBets.length === 0 ? '<tr><td colspan="3" class="no-data">No refunded bets found</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>

                    <div class="modal-actions">
                        <button class="btn-secondary" onclick="closeModal('refundDetailsModal')">Close</button>
                        <button class="btn-primary" onclick="refundSystem.exportRefundDetails('${matchId}')">
                            <i class="fas fa-download"></i> Export CSV
                        </button>
                    </div>
                </div>
            `;

            this.showDetailsModal(modalContent);

        } catch (error) {
            console.error("Error viewing refund details:", error);
            showNotification('Error loading refund details', 'error');
        }
    }

    showDetailsModal(content) {
        let modal = document.getElementById('refundDetailsModal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'refundDetailsModal';
            modal.className = 'modal-overlay';
            modal.innerHTML = `
                <div class="modal-container" style="max-width: 800px;">
                    <div class="modal-header">
                        <h3><i class="fas fa-receipt"></i> Refund Details</h3>
                        <button class="close-modal" onclick="closeModal('refundDetailsModal')">&times;</button>
                    </div>
                    <div class="modal-body" id="refundDetailsModalBody"></div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        document.getElementById('refundDetailsModalBody').innerHTML = content;
        modal.classList.add('active');
    }

    // ========== EXPORT REFUND DETAILS ==========
    async exportRefundDetails(matchId) {
        try {
            const matchDoc = await db.collection('matches').doc(matchId).get();
            const match = matchDoc.data();
            
            const refundTransactions = await db.collection('transactions')
                .where('matchId', '==', matchId)
                .where('type', '==', 'refund')
                .get();

            let csvContent = "User ID,Amount,Date,Transaction ID\n";
            
            refundTransactions.forEach(doc => {
                const trans = doc.data();
                const date = trans.date?.toDate ? trans.date.toDate().toISOString() : 'N/A';
                csvContent += `${trans.userId || 'N/A'},${trans.amount || 0},${date},${doc.id}\n`;
            });

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `refund_${match.homeTeam || 'Home'}_vs_${match.awayTeam || 'Away'}_${Date.now()}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);

            showNotification('Refund details exported successfully', 'success');

        } catch (error) {
            console.error("Error exporting refund details:", error);
            showNotification('Error exporting details', 'error');
        }
    }

    // ========== LOAD REFUND HISTORY ==========
    async loadRefundHistory() {
        const container = document.getElementById('refundHistoryContainer');
        if (!container) return;

        try {
            const snapshot = await db.collection('transactions')
                .where('type', '==', 'refund')
                .orderBy('date', 'desc')
                .limit(50)
                .get();

            if (snapshot.empty) {
                container.innerHTML = `
                    <div class="no-data">
                        <i class="fas fa-history"></i>
                        <p>No refund history available</p>
                    </div>
                `;
                return;
            }

            let html = `
                <div class="refund-history-table">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Match</th>
                                <th>User</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            snapshot.forEach(doc => {
                const refund = doc.data();
                const date = refund.date?.toDate ? refund.date.toDate() : new Date();
                
                // Check if this refund was deleted or cancelled
                const isDeleted = this.deletedRefunds.some(d => d.matchId === refund.matchId);
                const isCancelled = this.cancelledRefunds.some(c => c.matchId === refund.matchId);
                
                let status = 'completed';
                let statusText = 'Completed';
                
                if (isDeleted) {
                    status = 'deleted';
                    statusText = 'Deleted';
                } else if (isCancelled) {
                    status = 'cancelled';
                    statusText = 'Cancelled';
                }
                
                html += `
                    <tr class="${status}-row">
                        <td>${date.toLocaleDateString()} ${date.toLocaleTimeString()}</td>
                        <td>${refund.description?.replace('Refund for match: ', '') || 'Match refund'}</td>
                        <td>${refund.userId?.substring(0, 8)}...</td>
                        <td class="positive">TZS ${(refund.amount || 0).toFixed(2)}</td>
                        <td>
                            <span class="status-badge ${status}">
                                ${statusText}
                            </span>
                        </td>
                        <td>
                            <button class="btn-icon" onclick="refundSystem.viewRefundDetails('${refund.matchId}')" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });

            html += '</tbody></table></div>';
            container.innerHTML = html;

        } catch (error) {
            console.error("Error loading refund history:", error);
            container.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error loading refund history: ${error.message}</p>
                </div>
            `;
        }
    }

    // ========== LOAD DELETED REFUNDS ==========
    async loadDeletedRefunds() {
        try {
            const snapshot = await db.collection('deletedRefunds')
                .orderBy('deletedAt', 'desc')
                .limit(50)
                .get();
            
            this.deletedRefunds = [];
            snapshot.forEach(doc => {
                this.deletedRefunds.push({ id: doc.id, ...doc.data() });
            });
            
            return this.deletedRefunds;
        } catch (error) {
            console.error("Error loading deleted refunds:", error);
            return [];
        }
    }

    // ========== SETUP FILTER BUTTONS ==========
    setupFilterButtons() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Filter matches
                const matchCards = document.querySelectorAll('.refund-match-card');
                matchCards.forEach(card => {
                    const status = card.dataset.status;
                    if (filter === 'all' || status === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // ========== UPDATE SUMMARY STATS ==========
    updateSummaryStats(matches, lostBets, users, stake, refundedMatches = 0, pendingRefunds = 0, cancelledRefunds = 0) {
        const matchesEl = document.getElementById('totalMatchesCount');
        const lostBetsEl = document.getElementById('totalLostBetsCount');
        const usersEl = document.getElementById('totalUsersCount');
        const stakeEl = document.getElementById('totalStakeAmount');
        const refundedEl = document.getElementById('refundedMatchesCount');
        const pendingEl = document.getElementById('pendingRefundsCount');
        const cancelledEl = document.getElementById('cancelledRefundsCount');
        
        if (matchesEl) matchesEl.textContent = matches;
        if (lostBetsEl) lostBetsEl.textContent = lostBets;
        if (usersEl) usersEl.textContent = users;
        if (stakeEl) stakeEl.textContent = `TZS ${stake.toFixed(2)}`;
        if (refundedEl) refundedEl.textContent = refundedMatches;
        if (pendingEl) pendingEl.textContent = pendingRefunds;
        if (cancelledEl) cancelledEl.textContent = cancelledRefunds;
    }

    // ========== UPDATE LAST UPDATED ==========
    updateLastUpdated() {
        const lastUpdatedEl = document.getElementById('refundLastUpdated');
        if (lastUpdatedEl) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            const dateString = now.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
            lastUpdatedEl.innerHTML = `
                <i class="far fa-clock"></i>
                <span>Last updated: ${dateString} ${timeString}</span>
            `;
        }
    }

    // ========== GET EMPTY STATE HTML ==========
    getEmptyStateHTML() {
        return `
            <div class="no-data">
                <i class="fas fa-check-circle" style="font-size: 4rem; color: var(--success-color);"></i>
                <h3>No Refunds Available</h3>
                <p>All bets have been settled with no lost stakes requiring refund.</p>
                <button class="btn-refresh" onclick="refundSystem.quickRefresh()" style="margin-top: 20px;">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
            </div>
        `;
    }

    // ========== GET ERROR STATE HTML ==========
    getErrorStateHTML(error) {
        return `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error Loading Refunds</h3>
                <p>${error.message || 'Unknown error'}</p>
                <button class="btn-refresh" onclick="refundSystem.quickRefresh()" style="margin-top: 20px;">
                    <i class="fas fa-sync-alt"></i> Try Again
                </button>
            </div>
        `;
    }

    // ========== CLEANUP ==========
    destroy() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
        }
    }
}

// ========== INITIALIZE REFUND SYSTEM ==========
let refundSystem;
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Complete Refund System...');
    
    setTimeout(() => {
        refundSystem = new RefundSystem();
        window.refundSystem = refundSystem;
        console.log('✅ Refund System initialized');
    }, 1500);
});

// ========== GLOBAL REFRESH FUNCTION ==========
window.refreshRefundData = function() {
    if (window.refundSystem) {
        window.refundSystem.quickRefresh();
    } else {
        console.error('Refund system not initialized');
        showNotification('Refund system not ready', 'error');
    }
};

// ==================== NOTIFICATION SYSTEM ====================
class NotificationService {
    constructor() {
        this.permission = null;
        this.swRegistration = null;
        this.notificationCheckInterval = null;
        this.sentNotifications = new Set(); // Track sent notifications to avoid duplicates
        this.init();
    }

    async init() {
        console.log("🔔 Initializing Notification Service...");
        
        // Check if browser supports notifications
        if (!('Notification' in window)) {
            console.log("This browser does not support notifications");
            return;
        }

        // Check current permission
        this.permission = Notification.permission;
        
        // If permission not granted, show request button
        if (this.permission !== 'granted') {
            this.showPermissionRequest();
        } else {
            console.log("✅ Notifications already enabled");
            this.startNotificationChecks();
        }

        // Listen for auth state changes
        document.addEventListener('authStateChanged', (e) => {
            if (e.detail.user) {
                this.registerUserForNotifications();
            }
        });
    }

    showPermissionRequest() {
        // Check if we already have a permission banner
        if (document.getElementById('notification-permission-banner')) return;

        const banner = document.createElement('div');
        banner.id = 'notification-permission-banner';
        banner.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--secondary-color), #1e3a5f);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 1.5rem;
            max-width: 400px;
            animation: slideIn 0.3s ease;
            border-left: 4px solid var(--accent-color);
        `;

        banner.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="background: var(--accent-color); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-bell" style="color: white; font-size: 1.2rem;"></i>
                </div>
                <div>
                    <h4 style="margin: 0 0 0.25rem 0; color: white;">Enable Notifications</h4>
                    <p style="margin: 0; font-size: 0.9rem; opacity: 0.9;">Get notified about matches, announcements, and admin messages</p>
                </div>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button id="allow-notifications" style="background: var(--accent-color); border: none; color: white; padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer; font-weight: bold;">
                    Allow
                </button>
                <button id="dismiss-notifications" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer;">
                    Later
                </button>
            </div>
        `;

        document.body.appendChild(banner);

        document.getElementById('allow-notifications').addEventListener('click', async () => {
            await this.requestPermission();
            banner.remove();
        });

        document.getElementById('dismiss-notifications').addEventListener('click', () => {
            banner.remove();
            // Show again after 7 days
            localStorage.setItem('notificationDismissed', Date.now() + 7 * 24 * 60 * 60 * 1000);
        });

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    async requestPermission() {
        try {
            this.permission = await Notification.requestPermission();
            
            if (this.permission === 'granted') {
                console.log("✅ Notification permission granted");
                this.showNotification(
                    'Notifications Enabled',
                    'You will now receive updates about matches, announcements, and admin messages.',
                    'info'
                );
                this.startNotificationChecks();
                this.registerUserForNotifications();
            } else {
                console.log("❌ Notification permission denied");
            }
        } catch (error) {
            console.error("Error requesting notification permission:", error);
        }
    }

    // ========== SHOW NOTIFICATION ==========
    showNotification(title, body, type = 'info', options = {}) {
        if (this.permission !== 'granted') {
            console.log("Notifications not permitted");
            return;
        }

        // Create a unique ID for this notification to avoid duplicates
        const notificationId = `${title}-${body}-${Date.now()}`;
        if (this.sentNotifications.has(notificationId)) return;
        this.sentNotifications.add(notificationId);

        // Limit set size to prevent memory leaks
        if (this.sentNotifications.size > 100) {
            const array = Array.from(this.sentNotifications);
            this.sentNotifications = new Set(array.slice(-50));
        }

        const icon = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
            match: '⚽',
            announcement: '📢',
            message: '💬',
            bet: '💰'
        }[type] || '🔔';

        try {
            // Show browser notification
            const notification = new Notification(title, {
                body: body,
                icon: '/favicon.ico', // Make sure you have a favicon
                badge: '/favicon.ico',
                tag: notificationId,
                requireInteraction: type === 'message' || type === 'announcement',
                silent: false,
                ...options
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
                
                // Handle click based on type
                if (type === 'message') {
                    // Open chat
                    if (window.chatSystem) {
                        document.getElementById('chat-button')?.click();
                    }
                } else if (type === 'match') {
                    // Open matches section
                    if (window.sectionManager) {
                        window.sectionManager.showSection('matchesSection', 'user-dashboard');
                    }
                } else if (type === 'announcement') {
                    // Scroll to announcements
                    document.querySelector('.announcement-grid')?.scrollIntoView({ behavior: 'smooth' });
                }
            };
        } catch (error) {
            console.error("Error showing notification:", error);
        }

        // Also show in-app notification
        if (window.NotificationManager) {
            NotificationManager.show(body, type === 'message' ? 'vip' : type, {
                duration: 5000,
                clickToClose: true
            });
        }
    }

    // ========== START NOTIFICATION CHECKS ==========
    startNotificationChecks() {
        if (this.notificationCheckInterval) {
            clearInterval(this.notificationCheckInterval);
        }

        // Check every minute for match reminders
        this.notificationCheckInterval = setInterval(() => {
            this.checkUpcomingMatches();
        }, 60000); // Every minute

        // Initial check
        this.checkUpcomingMatches();

        // Listen for announcements
        this.listenForAnnouncements();

        // Listen for admin messages
        this.listenForAdminMessages();

        // Listen for bet settlements
        this.listenForBetSettlements();
    }

    // ========== CHECK UPCOMING MATCHES ==========
    async checkUpcomingMatches() {
        try {
            const now = new Date();
            const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000);
            const tenMinutesFromNow = new Date(now.getTime() + 10 * 60000);

            const matchesRef = db.collection('matches');
            const snapshot = await matchesRef
                .where('status', '==', 'upcoming')
                .where('date', '>=', now)
                .where('date', '<=', tenMinutesFromNow)
                .get();

            if (snapshot.empty) return;

            snapshot.forEach(doc => {
                const match = doc.data();
                const matchDate = match.date.toDate();
                const timeUntilMatch = matchDate - now;
                const minutesUntilMatch = Math.round(timeUntilMatch / 60000);

                // Check if 5 minutes away
                if (minutesUntilMatch === 5 || minutesUntilMatch === 4 || minutesUntilMatch === 3) {
                    const notificationKey = `match-${doc.id}-${minutesUntilMatch}`;
                    
                    // Check if we've already sent this notification
                    const lastSent = localStorage.getItem(notificationKey);
                    if (lastSent && (Date.now() - parseInt(lastSent)) < 300000) return;

                    this.showNotification(
                        `⚽ Match Starting Soon!`,
                        `${match.homeTeam} vs ${match.awayTeam} starts in ${minutesUntilMatch} minutes!`,
                        'match',
                        { tag: notificationKey }
                    );

                    localStorage.setItem(notificationKey, Date.now());
                }
            });
        } catch (error) {
            console.error("Error checking upcoming matches:", error);
        }
    }

    // ========== LISTEN FOR ANNOUNCEMENTS ==========
    listenForAnnouncements() {
        // Listen for new announcements
        db.collection('announcements')
            .where('active', '==', true)
            .orderBy('createdAt', 'desc')
            .limit(1)
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        const announcement = change.doc.data();
                        const announcementId = change.doc.id;
                        
                        // Check if we've already notified about this announcement
                        const lastNotified = localStorage.getItem(`announcement-${announcementId}`);
                        if (lastNotified) return;

                        // Don't notify for very old announcements
                        const createdAt = announcement.createdAt?.toDate?.() || new Date(announcement.createdAt);
                        if ((Date.now() - createdAt) > 60000) return; // Older than 1 minute

                        let title = '📢 New Announcement';
                        let body = announcement.title || 'Check out the latest announcement';

                        if (announcement.type === 'match') {
                            title = '⚽ Match Announcement';
                            body = `${announcement.title || 'New match announced!'} - ${announcement.homeTeam || ''} vs ${announcement.awayTeam || ''}`;
                        } else if (announcement.type === 'other' && announcement.mediaUrl) {
                            title = '🖼️ New Media Announcement';
                        }

                        this.showNotification(
                            title,
                            body,
                            'announcement',
                            { requireInteraction: true, tag: `announcement-${announcementId}` }
                        );

                        localStorage.setItem(`announcement-${announcementId}`, Date.now());
                    }
                });
            });
    }

    // ========== LISTEN FOR ADMIN MESSAGES ==========
    listenForAdminMessages() {
        const userId = window.authManager?.user?.uid;
        if (!userId) return;

        // Listen for new messages in user's chat
        db.collection('chats').doc(userId)
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .limit(1)
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        const message = change.doc.data();
                        const messageId = change.doc.id;
                        
                        // Only notify for admin messages
                        if (message.senderId !== 'admin') return;

                        // Check if we've already notified about this message
                        const lastNotified = localStorage.getItem(`message-${messageId}`);
                        if (lastNotified) return;

                        // Don't notify for very old messages
                        const timestamp = message.timestamp?.toDate?.();
                        if (timestamp && (Date.now() - timestamp) > 10000) return; // Older than 10 seconds

                        this.showNotification(
                            '💬 New Message from Admin',
                            message.text.length > 100 ? message.text.substring(0, 100) + '...' : message.text,
                            'message',
                            { requireInteraction: true, tag: `message-${messageId}` }
                        );

                        localStorage.setItem(`message-${messageId}`, Date.now());
                    }
                });
            });
    }

    // ========== LISTEN FOR BET SETTLEMENTS ==========
    listenForBetSettlements() {
        const userId = window.authManager?.user?.uid;
        if (!userId) return;

        // Listen for bet status changes
        db.collection('bets')
            .where('userId', '==', userId)
            .where('status', 'in', ['won', 'lost', 'refunded'])
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'modified') {
                        const bet = change.doc.data();
                        const betId = change.doc.id;
                        
                        // Check if we've already notified about this bet
                        const lastNotified = localStorage.getItem(`bet-${betId}`);
                        if (lastNotified) return;

                        let title, body, type;
                        
                        if (bet.status === 'won') {
                            title = '🎉 You Won!';
                            const profit = (bet.potentialReturn - bet.stake).toFixed(2);
                            body = bet.type === 'multi' 
                                ? `Your multi-bet won! Profit: TZS ${profit}`
                                : `Bet on ${bet.match || 'match'} won! Profit: TZS ${profit}`;
                            type = 'success';
                        } else if (bet.status === 'lost') {
                            title = '❌ Bet Lost';
                            body = bet.type === 'multi'
                                ? `Your multi-bet was lost. Better luck next time!`
                                : `Bet on ${bet.match || 'match'} lost.`;
                            type = 'error';
                        } else if (bet.status === 'refunded') {
                            title = '💰 Bet Refunded';
                            body = `Your stake of TZS ${bet.stake.toFixed(2)} has been refunded.`;
                            type = 'warning';
                        }

                        this.showNotification(title, body, type, { tag: `bet-${betId}` });
                        localStorage.setItem(`bet-${betId}`, Date.now());
                    }
                });
            });
    }

    // ========== REGISTER USER FOR NOTIFICATIONS ==========
    async registerUserForNotifications() {
        const userId = window.authManager?.user?.uid;
        if (!userId || this.permission !== 'granted') return;

        try {
            // Generate a unique device ID
            const deviceId = this.getDeviceId();
            
            // Register this device for push notifications
            await db.collection('userDevices').doc(`${userId}_${deviceId}`).set({
                userId: userId,
                deviceId: deviceId,
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                registeredAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastActive: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            console.log("📱 Device registered for notifications");
        } catch (error) {
            console.error("Error registering device:", error);
        }
    }

    // ========== GET DEVICE ID ==========
    getDeviceId() {
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('deviceId', deviceId);
        }
        return deviceId;
    }

    // ========== CLEANUP ==========
    destroy() {
        if (this.notificationCheckInterval) {
            clearInterval(this.notificationCheckInterval);
        }
    }
}

// ========== INITIALIZE NOTIFICATION SERVICE ==========
let notificationService;
document.addEventListener('DOMContentLoaded', function() {
    // Initialize after a short delay
    setTimeout(() => {
        notificationService = new NotificationService();
        window.notificationService = notificationService;
        console.log("🔔 Notification Service initialized");
    }, 2000);
});

// ========== MANUAL NOTIFICATION FUNCTIONS ==========

// Function to send match reminder (can be called by admin)
async function sendMatchReminder(matchId) {
    if (!notificationService || notificationService.permission !== 'granted') {
        showNotification('Please enable notifications first', 'warning');
        return;
    }

    try {
        const matchDoc = await db.collection('matches').doc(matchId).get();
        if (!matchDoc.exists) {
            showNotification('Match not found', 'error');
            return;
        }

        const match = matchDoc.data();
        const matchDate = match.date.toDate();
        const timeUntilMatch = Math.round((matchDate - Date.now()) / 60000);

        notificationService.showNotification(
            `⚽ Match Reminder`,
            `${match.homeTeam} vs ${match.awayTeam} starts in ${timeUntilMatch} minutes!`,
            'match',
            { requireInteraction: true }
        );

        showNotification('Reminder sent!', 'success');
    } catch (error) {
        console.error("Error sending match reminder:", error);
        showNotification('Error sending reminder', 'error');
    }
}

// Function to test notifications
function testNotification() {
    if (!notificationService) {
        showNotification('Notification service not ready', 'error');
        return;
    }

    notificationService.showNotification(
        '🔔 Test Notification',
        'If you see this, notifications are working!',
        'success',
        { requireInteraction: true }
    );
}

// Make functions globally available
window.sendMatchReminder = sendMatchReminder;
window.testNotification = testNotification;

// ========== ADD NOTIFICATION BUTTON TO UI ==========
// This will add a notification bell to the top bar
function addNotificationBell() {
    // Check if bell already exists
    if (document.getElementById('notificationBell')) return;

    const topBar = document.querySelector('.top-bar .right-section');
    if (!topBar) return;

    const bell = document.createElement('div');
    bell.id = 'notificationBell';
    bell.style.cssText = `
        position: relative;
        margin-right: 1rem;
        cursor: pointer;
        font-size: 1.2rem;
        color: var(--gray-color);
        transition: color 0.3s;
    `;
    bell.innerHTML = `
        <i class="fas fa-bell"></i>
        <span id="notificationBadge" style="
            position: absolute;
            top: -5px;
            right: -5px;
            background: var(--accent-color);
            color: white;
            font-size: 0.7rem;
            padding: 0.2rem 0.4rem;
            border-radius: 10px;
            min-width: 18px;
            text-align: center;
            display: none;
        ">0</span>
    `;

    bell.addEventListener('click', () => {
        if (!notificationService || notificationService.permission !== 'granted') {
            notificationService?.showPermissionRequest();
        } else {
            // Open notification settings or show recent notifications
            testNotification();
        }
    });

    topBar.insertBefore(bell, topBar.firstChild);

    // Update badge based on permission
    if (notificationService?.permission === 'granted') {
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            badge.textContent = '✓';
            badge.style.background = 'var(--success-color)';
            badge.style.display = 'inline-block';
            
            setTimeout(() => {
                badge.style.display = 'none';
            }, 3000);
        }
    }
}

// Add bell after auth is ready
document.addEventListener('authStateChanged', (e) => {
    if (e.detail.user) {
        setTimeout(addNotificationBell, 500);
    }
});

// Also add to mobile menu
function addMobileNotificationOption() {
    const mobileMenuItems = document.querySelector('.mobile-menu-items');
    if (!mobileMenuItems) return;

    const notificationItem = document.createElement('div');
    notificationItem.className = 'mobile-menu-item';
    notificationItem.style.cssText = `
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        cursor: pointer;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    `;
    notificationItem.innerHTML = `
        <i class="fas fa-bell"></i>
        <span>Notifications</span>
        <span id="mobileNotificationStatus" style="margin-left: auto; font-size: 0.8rem; color: var(--gray-color);">
            ${notificationService?.permission === 'granted' ? 'Enabled' : 'Off'}
        </span>
    `;

    notificationItem.addEventListener('click', () => {
        if (!notificationService || notificationService.permission !== 'granted') {
            notificationService?.showPermissionRequest();
        } else {
            testNotification();
        }
    });

    // Insert before logout
    const logoutItem = mobileMenuItems.querySelector('[data-action="logout"]');
    if (logoutItem) {
        mobileMenuItems.insertBefore(notificationItem, logoutItem);
    } else {
        mobileMenuItems.appendChild(notificationItem);
    }
}

// Listen for section changes to update mobile menu
document.addEventListener('sectionChanged', () => {
    setTimeout(addMobileNotificationOption, 500);
});

