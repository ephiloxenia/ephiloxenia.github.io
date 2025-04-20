// Δημιουργία νέου αρχείου
document.addEventListener('DOMContentLoaded', function() {
    // Αρχικοποίηση της γλώσσας από τα cookies ή ορισμός προεπιλογής στα Ελληνικά
    const savedLang = getCookie('app_language') || 'el';
    setLanguage(savedLang);
    
    // Προσθήκη event listener για τις επιλογές γλώσσας
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
            
            // Απενεργοποίηση όλων των επιλογών και ενεργοποίηση της τρέχουσας
            languageOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Κλείσιμο του dropdown μετά την επιλογή
            const dropdownMenu = this.closest('.dropdown-menu');
            if (dropdownMenu) {
                const dropdown = bootstrap.Dropdown.getInstance(document.getElementById('languageSelector'));
                if (dropdown) dropdown.hide();
            }
        });
    });

    // Συνάρτηση που ορίζει τη γλώσσα σε όλη την εφαρμογή
    function setLanguage(lang) {
        // Αποθήκευση της προτίμησης σε cookie
        setCookie('app_language', lang, 365);
        
        // Ενημέρωση της ένδειξης τρέχουσας γλώσσας
        const currentLangElement = document.querySelector('.current-language');
        if (currentLangElement) {
            currentLangElement.textContent = lang === 'el' ? 'ΕΛ' : 'EN';
        }
        
        // Εφαρμογή των μεταφράσεων από τη βιβλιοθήκη μεταφράσεων
        applyTranslations(lang);
    }

    // Συνάρτηση εφαρμογής μεταφράσεων
    function applyTranslations(lang) {
        // Αναζήτηση όλων των στοιχείων με data-i18n ιδιότητα
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                // Αν είναι input ή textarea, ενημερώνουμε το placeholder
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    if (element.getAttribute('placeholder')) {
                        element.setAttribute('placeholder', translations[lang][key]);
                    } else {
                        element.value = translations[lang][key];
                    }
                } else {
                    // Διαφορετικά, ενημερώνουμε το περιεχόμενο
                    element.textContent = translations[lang][key];
                }
            }
        });
        
        // Ενημερώνουμε και το chat input placeholder
        const chatInput = document.getElementById('global-chat-input');
        if (chatInput) {
            chatInput.placeholder = lang === 'el' ? 'Ρωτήστε με οτιδήποτε...' : 'Ask me anything...';
        }
        
        // Ενημερώνουμε τις προτάσεις συζήτησης
        updateSuggestionButtons(lang);
    }
    
    // Συνάρτηση ενημέρωσης κουμπιών προτάσεων
    function updateSuggestionButtons(lang) {
        const suggestionBtns = document.querySelectorAll('.suggestion-btn');
        const suggestions = {
            el: [
                'Προτάσεις εστιατορίων',
                'Ραντεβού στο spa',
                'Τοπικές δραστηριότητες',
                'Υπηρεσία δωματίου',
                'Πρόγνωση καιρού',
                'Πληροφορίες αναχώρησης'
            ],
            en: [
                'Restaurant recommendations',
                'Spa appointments',
                'Local activities',
                'Room service',
                'Weather forecast',
                'Checkout information'
            ]
        };
        
        suggestionBtns.forEach((btn, index) => {
            if (suggestions[lang] && suggestions[lang][index]) {
                btn.textContent = suggestions[lang][index];
            }
        });
    }

    // Βοηθητικές συναρτήσεις για cookies
    function setCookie(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + value + expires + '; path=/';
    }

    function getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
});

// Βιβλιοθήκη μεταφράσεων
const translations = {
    el: {
        // Header
        'welcome': 'Καλώς ήρθατε,',
        'your_stay': 'Η διαμονή σας:',
        'room': 'Δωμάτιο',
        
        // Quick Actions
        'room_key': 'Κλειδί Δωματίου',
        'wifi': 'WiFi',
        'bill': 'Λογαριασμός',
        'help': 'Βοήθεια',
        'quick_actions': 'Γρήγορες Ενέργειες',
        
        // Room Services
        'towels': 'Πετσέτες',
        'pillows': 'Μαξιλάρια',
        'blankets': 'Κουβέρτες',
        'toiletries': 'Είδη Τουαλέτας',
        'bathrobes': 'Μπουρνούζια',
        'slippers': 'Παντόφλες',
        'more': 'Περισσότερα',
        
        // Room Controls
        'active_requests': 'Ενεργά Αιτήματα',
        'room_service_order': 'Παραγγελία Υπηρεσίας Δωματίου',
        'view_all_requests': 'Προβολή Όλων των Αιτημάτων',
        'temperature': 'Θερμοκρασία',
        'schedule': 'Προγραμματισμός',
        'lights': 'Φώτα',
        'relax': 'Χαλάρωση',
        'work': 'Εργασία',
        'movie': 'Ταινία',
        'sleep': 'Ύπνος',
        'curtains': 'Κουρτίνες',
        
        // AI Assistant
        'ai_assistant': 'AI Βοηθός',
        'virtual_concierge': '24/7 εικονική υπηρεσία concierge',
        'new_chat': 'Νέα Συζήτηση',
        'talk_to_human': 'Μιλήστε με έναν υπάλληλο',
        'return_to_ai': 'Επιστροφή στον AI βοηθό',
        
        // Bottom Navigation
        'home': 'Αρχική',
        'assistant': 'Βοηθός',
        'experiences': 'Εμπειρίες',
        
        // Modals
        'digital_room_key': 'Ψηφιακό Κλειδί Δωματίου',
        'present_code': 'Παρουσιάστε αυτόν τον κωδικό στην πόρτα για να ξεκλειδώσετε το δωμάτιό σας.',
        'available_offline': 'Διαθέσιμο Εκτός Σύνδεσης',
        'nfc_info': 'Μπορείτε επίσης να χρησιμοποιήσετε NFC αγγίζοντας το τηλέφωνό σας στην κλειδαριά της πόρτας',
        'close': 'Κλείσιμο',
        
        // WiFi Modal
        'wifi_access': 'Πρόσβαση WiFi',
        'network_name': 'Όνομα Δικτύου:',
        'password': 'Κωδικός:',
        'connect_automatically': 'Αυτόματη Σύνδεση',
        'premium_info': 'Για πρόσβαση υψηλής ταχύτητας, παρακαλούμε επικοινωνήστε με την υποδοχή ή χρησιμοποιήστε τους πόντους πιστότητάς σας.',
        
        // Bill Modal
        'your_current_bill': 'Ο Τρέχων Λογαριασμός σας',
        'room_charge': 'Χρέωση Δωματίου',
        'restaurant': 'Εστιατόριο',
        'room_service': 'Υπηρεσία Δωματίου',
        'spa_service': 'Υπηρεσία Spa',
        'subtotal': 'Μερικό Σύνολο:',
        'tax': 'Φόρος (10%):',
        'total': 'Σύνολο:',
        'download_pdf': 'Λήψη PDF',
        
        // Help Modal
        'help_support': 'Βοήθεια & Υποστήριξη',
        'urgent_help': 'Επείγουσα Βοήθεια',
        'call_reception': 'Καλέστε την υποδοχή για άμεση βοήθεια',
        'chat_with_concierge': 'Συνομιλία με Concierge',
        'ask_questions': 'Κάντε ερωτήσεις ή ζητήστε βοήθεια',
        'hotel_information': 'Πληροφορίες Ξενοδοχείου',
        'view_facilities': 'Δείτε πληροφορίες για τις εγκαταστάσεις και τις υπηρεσίες του ξενοδοχείου',
        'faq': 'Συχνές Ερωτήσεις',
        'find_answers': 'Βρείτε απαντήσεις σε συχνές ερωτήσεις',
        'hotel_map': 'Χάρτης Ξενοδοχείου',
        'navigate_facilities': 'Πλοηγηθείτε στις εγκαταστάσεις του ξενοδοχείου'
    },
    en: {
        // Header
        'welcome': 'Welcome,',
        'your_stay': 'Your stay:',
        'room': 'Room',
        
        // Quick Actions
        'room_key': 'Room Key',
        'wifi': 'WiFi',
        'bill': 'Bill',
        'help': 'Help',
        'quick_actions': 'Quick Actions',
        
        // Room Services
        'towels': 'Towels',
        'pillows': 'Pillows',
        'blankets': 'Blankets',
        'toiletries': 'Toiletries',
        'bathrobes': 'Bathrobes',
        'slippers': 'Slippers',
        'more': 'More',
        
        // Room Controls
        'active_requests': 'Active Requests',
        'room_service_order': 'Room Service Order',
        'view_all_requests': 'View All Requests',
        'temperature': 'Temperature',
        'schedule': 'Schedule',
        'lights': 'Lights',
        'relax': 'Relax',
        'work': 'Work',
        'movie': 'Movie',
        'sleep': 'Sleep',
        'curtains': 'Curtains',
        
        // AI Assistant
        'ai_assistant': 'AI Assistant',
        'virtual_concierge': '24/7 virtual concierge service',
        'new_chat': 'New Chat',
        'talk_to_human': 'Talk to a human concierge',
        'return_to_ai': 'Return to AI assistant',
        
        // Bottom Navigation
        'home': 'Home',
        'assistant': 'Assistant',
        'experiences': 'Experiences',
        
        // Modals
        'digital_room_key': 'Digital Room Key',
        'present_code': 'Present this code at the door to unlock your room.',
        'available_offline': 'Available Offline',
        'nfc_info': 'You can also use NFC by tapping your phone to the door lock',
        'close': 'Close',
        
        // WiFi Modal
        'wifi_access': 'WiFi Access',
        'network_name': 'Network Name:',
        'password': 'Password:',
        'connect_automatically': 'Connect Automatically',
        'premium_info': 'For premium high-speed access, please contact the reception or use your loyalty points.',
        
        // Bill Modal
        'your_current_bill': 'Your Current Bill',
        'room_charge': 'Room Charge',
        'restaurant': 'Restaurant',
        'room_service': 'Room Service',
        'spa_service': 'Spa Service',
        'subtotal': 'Subtotal:',
        'tax': 'Tax (10%):',
        'total': 'Total:',
        'download_pdf': 'Download PDF',
        
        // Help Modal
        'help_support': 'Help & Support',
        'urgent_help': 'Urgent Help',
        'call_reception': 'Call reception for immediate assistance',
        'chat_with_concierge': 'Chat with Concierge',
        'ask_questions': 'Ask questions or request assistance',
        'hotel_information': 'Hotel Information',
        'view_facilities': 'View hotel facilities and services information',
        'faq': 'FAQ',
        'find_answers': 'Find answers to common questions',
        'hotel_map': 'Hotel Map',
        'navigate_facilities': 'Navigate hotel facilities and amenities'
    }
}; 