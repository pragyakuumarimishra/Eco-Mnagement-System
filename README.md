# 🌱 Eco-Utility Hub

A comprehensive web application for sustainable waste management and utility monitoring. Find waste drop-off locations, schedule pickups, and detect potential utility leaks - all in one platform.

![Eco-Utility Hub](https://img.shields.io/badge/Status-Active-brightgreen) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)

## 🚀 Features

### 🗺️ **Waste Locator**
- **Interactive Map**: Find verified e-waste and medical waste drop-off locations in Kolkata
- **Distance Sorting**: Use geolocation to sort locations by proximity
- **Smart Filters**: Filter by waste type, accepted materials, and operating hours
- **Real-time Information**: View hours, contact details, and accepted materials

### 📦 **Pickup Planner** (Login Required)
- **Schedule Pickups**: Book convenient waste pickup for home or business
- **Multiple Waste Types**: E-waste, medical, household, bulk items, and hazardous waste
- **Pricing Guide**: Transparent pricing for different waste categories
- **Request Tracking**: Monitor your pickup requests and their status
- **Form Validation**: Comprehensive validation for all required fields

### 🔍 **Leak Detector** (Login Required)
- **Meter Readings**: Record water and electricity meter readings
- **Usage Trends**: Visualize consumption patterns with interactive charts
- **Anomaly Detection**: AI-powered detection of unusual usage spikes
- **Alert System**: Get notified of potential leaks or unusual consumption
- **Photo Upload**: Optionally upload meter photos for record keeping

### 🔐 **User Authentication**
- **Secure Login/Signup**: User account management with validation
- **Data Isolation**: Personal data separated by user accounts
- **Session Management**: Persistent login across browser sessions
- **Protected Features**: Pickup and leak detection require authentication

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: TailwindCSS for responsive design
- **Maps**: Leaflet.js with OpenStreetMap tiles
- **Charts**: Chart.js for usage visualization
- **Fonts**: Google Fonts (Inter)
- **Storage**: Browser localStorage for data persistence

## 📁 Project Structure

```
Eco-utility-hub/
├── index_clean.html     # Main HTML file (recommended)
├── index.html          # Original single-file version (backup)
├── styles.css          # Custom CSS styles
├── script.js           # JavaScript functionality
└── README.md           # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for CDN resources

### Installation

1. **Clone or Download** the project files
2. **Open** `index_clean.html` in your web browser
3. **Allow location access** when prompted for full functionality

### Local Development

```bash
# Navigate to project directory
cd Eco-utility-hub

# Serve with a local server (optional)
python -m http.server 8000
# or
npx serve .

# Open in browser
http://localhost:8000/index_clean.html
```

## 📱 Usage Guide

### Getting Started
1. **Open the application** in your web browser
2. **Use Waste Locator** immediately without registration
3. **Create an account** to access Pickup Planner and Leak Detector
4. **Enable location** for distance-based sorting

### Waste Locator
- Browse available drop-off locations on the map
- Use filters to find specific waste types or materials
- Click locations for details and directions
- Enable geolocation for distance sorting

### Pickup Planner (Login Required)
1. Fill out contact information and pickup address
2. Describe waste type and items for pickup
3. Select preferred date and time slot
4. Submit request and track status

### Leak Detector (Login Required)
1. Select utility type (water or electricity)
2. Enter current meter reading
3. Optionally upload meter photo
4. Monitor usage trends and anomaly alerts

## 🏗️ Architecture

### File Organization
- **index_clean.html**: Clean HTML structure with external references
- **styles.css**: Modular CSS with custom properties and Leaflet styling
- **script.js**: Organized JavaScript with feature modules

### Data Management
- **localStorage**: Browser-based persistence for user data
- **User Isolation**: Data separated by user ID for privacy
- **Session Management**: Automatic login state restoration

### Key Components
- **Authentication System**: Login/signup with validation
- **Tab Navigation**: Dynamic content switching with protection
- **Map Integration**: Leaflet.js with custom markers and popups
- **Form Validation**: Real-time validation with error handling
- **Chart Visualization**: Interactive usage trend charts

## 🔧 Configuration

### Map Settings
```javascript
// Default center: Kolkata, India
const DEFAULT_COORDS = [22.5726, 88.3639];
const DEFAULT_ZOOM = 13;
```

### Data Storage Keys
```javascript
// User authentication
currentUser: JSON
users: Array

// User-specific data
user_{userId}_meterReadings: Array
user_{userId}_pickupRequests: Array
```

## 🌍 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 80+     | ✅ Full Support |
| Firefox | 75+     | ✅ Full Support |
| Safari  | 13+     | ✅ Full Support |
| Edge    | 80+     | ✅ Full Support |

## 📊 Features Overview

| Feature | Description | Authentication |
|---------|-------------|----------------|
| Waste Locator | Find drop-off locations | ❌ Public |
| Interactive Map | Leaflet.js integration | ❌ Public |
| Geolocation | Distance-based sorting | ❌ Public |
| Pickup Planner | Schedule waste pickup | ✅ Required |
| Leak Detector | Monitor utility usage | ✅ Required |
| User Accounts | Login/signup system | ✅ Self-service |

## 🔒 Security & Privacy

- **Client-side Only**: No server-side data storage
- **Local Storage**: All data stored in browser localStorage
- **User Isolation**: Personal data separated by user accounts
- **No External APIs**: No data sent to third-party services
- **Password Storage**: Plain text (development only - use hashing in production)

## 🚀 Performance

- **Lazy Loading**: Charts and features load on demand
- **Efficient Rendering**: Optimized DOM manipulation
- **CDN Resources**: Fast loading of external libraries
- **Responsive Design**: Mobile-first approach with TailwindCSS

## 🐛 Known Issues

- **Password Security**: Currently uses plain text storage (development only)
- **Data Backup**: No server-side backup of user data
- **Offline Support**: Requires internet connection for maps and CDN resources

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Authors

- **Developer**: Built with ❤️ for sustainable waste management

## 🙏 Acknowledgments

- **Leaflet.js** - Interactive maps
- **Chart.js** - Beautiful charts
- **TailwindCSS** - Utility-first CSS
- **OpenStreetMap** - Map tiles and data
- **Google Fonts** - Inter font family

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

**Made with 🌱 for a sustainable future**
