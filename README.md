# 🔔 SocialProofNotification.js

A lightweight, framework-agnostic JavaScript library for displaying social proof notifications on your website. Works seamlessly with vanilla JavaScript, Bootstrap, Tailwind CSS, and other CSS frameworks.

## Features

- ✅ **Framework Agnostic** - Works with vanilla JS, Bootstrap, Tailwind, or any CSS framework
- 🎨 **Multiple Themes** - Default, Bootstrap, and Tailwind themes included
- 📍 **Flexible Positioning** - 6 position options (corners and centers)
- 🎭 **Smooth Animations** - Slide, fade, bounce, or no animation
- 🔌 **Data Sources** - Local data arrays or API endpoints
- 💾 **Smart Caching** - LocalStorage-based frequency control
- 📱 **Responsive** - Mobile-friendly and adaptive
- ⚡ **Lightweight** - Minimal footprint, no dependencies
- 🎯 **Easy Integration** - Simple script tag inclusion

## Installation

### CDN (Recommended for quick start)

```html
<script src="https://cdn.jsdelivr.net/gh/yourusername/social-proof-notification/social-proof-notification.min.js"></script>
```

### Download

Download `social-proof-notification.min.js` and include it in your project:

```html
<script src="path/to/social-proof-notification.min.js"></script>
```

### NPM

```bash
npm install social-proof-notification
```

## Quick Start

### Vanilla JavaScript (Default Theme)

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Site</title>
</head>
<body>
  <h1>Welcome to my site!</h1>
  
  <script src="social-proof-notification.min.js"></script>
  <script>
    const notifier = SocialProofNotification.create({
      position: 'bottom-right',
      autoClose: true,
      autoCloseTimeout: 8000
    });
    
    notifier.init();
  </script>
</body>
</html>
```

### Bootstrap 5

```html
<!DOCTYPE html>
<html>
<head>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
</head>
<body>
  <h1>Welcome!</h1>
  
  <script src="social-proof-notification.min.js"></script>
  <script>
    const notifier = SocialProofNotification.create({
      theme: 'bootstrap',
      position: 'bottom-right'
    });
    
    notifier.init();
  </script>
</body>
</html>
```

### Tailwind CSS

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <h1>Welcome!</h1>
  
  <script src="social-proof-notification.min.js"></script>
  <script>
    const notifier = SocialProofNotification.create({
      theme: 'tailwind',
      position: 'bottom-right'
    });
    
    notifier.init();
  </script>
</body>
</html>
```

## Configuration Options

```javascript
SocialProofNotification.create({
  // Position
  position: 'bottom-right',  // 'top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center'
  
  // Auto-close behavior
  autoClose: true,           // true or false
  autoCloseTimeout: 8000,    // milliseconds
  
  // Initial delay before showing first notification
  initialDelay: 10000,       // milliseconds
  
  // Data source
  dataSource: 'local',       // 'local' or 'api'
  apiUrl: null,              // URL for API data source
  localData: [],             // Array of notification objects
  
  // Caching and frequency
  saveToStorage: true,       // Persist last shown time to localStorage
  minTimeBetween: 9,         // Minimum hours between notifications
  
  // Appearance
  theme: 'default',          // 'default', 'bootstrap', or 'tailwind'
  showIcon: true,            // Show/hide icon
  iconType: 'checkmark',     // 'checkmark', 'fire', or 'star'
  
  // Animation
  animation: 'slide',        // 'slide', 'fade', 'bounce', or 'none'
  animationDuration: 300,    // milliseconds
  
  // Interaction
  closeButton: true,         // Show close button
  pauseOnHover: false,       // Pause auto-close on hover
  maxNotifications: 1,       // Max notifications per session
  
  // Message customization
  messageFormat: '{count} people {action} {timeframe}!'  // Template for generated messages
});
```

## Usage Examples

### Using Local Data

```javascript
const notifier = SocialProofNotification.create({
  dataSource: 'local',
  localData: [
    {
      message: '5 people bought this in the last hour!',
      timestamp: '2 minutes ago'
    },
    {
      message: 'John from New York just signed up!',
      timestamp: 'Just now'
    },
    {
      message: '10 people are viewing this right now',
      timestamp: '30 seconds ago'
    }
  ],
  position: 'bottom-right',
  autoClose: true,
  autoCloseTimeout: 8000
});

notifier.init();
```

### Using API Endpoint

```javascript
const notifier = SocialProofNotification.create({
  dataSource: 'api',
  apiUrl: 'https://api.yoursite.com/notifications',
  position: 'bottom-right',
  initialDelay: 5000,
  minTimeBetween: 6  // Show every 6 hours
});

notifier.init();
```

**API Response Format:**
```json
{
  "message": "Someone just purchased!",
  "timestamp": "Just now"
}
```

### Custom Message Format

```javascript
const notifier = SocialProofNotification.create({
  messageFormat: '🔥 {count} customers {action} {timeframe}',
  iconType: 'fire'
});

notifier.init();
```

Available placeholders:
- `{count}` - Random count (Two, Three, Four, etc.)
- `{action}` - Random action (bought this, joined, enrolled, etc.)
- `{timeframe}` - Random timeframe (recently, X minutes ago, etc.)

### Multiple Instances

```javascript
// Bottom right for purchases
const purchaseNotifier = SocialProofNotification.create({
  position: 'bottom-right',
  localData: [
    { message: 'Someone just purchased!', timestamp: 'Just now' }
  ]
});

// Top right for signups
const signupNotifier = SocialProofNotification.create({
  position: 'top-right',
  localData: [
    { message: 'New user signed up!', timestamp: 'Just now' }
  ]
});

purchaseNotifier.init();
signupNotifier.init();
```

## API Methods

```javascript
const notifier = SocialProofNotification.create(options);

// Initialize and show notification after initialDelay
notifier.init();

// Show notification immediately
notifier.show();

// Hide current notification
notifier.hide();

// Destroy instance and cleanup
notifier.destroy();
```

## Theme Customization

### Default Theme
Uses built-in CSS with no framework dependencies. Perfect for simple sites.

### Bootstrap Theme
Automatically uses Bootstrap's toast component classes. Requires Bootstrap 5+ and Bootstrap Icons.

### Tailwind Theme
Uses Tailwind's utility classes. Requires Tailwind CSS (CDN or build).

### Custom Theme
You can also pass a custom CSS class to integrate with any framework:

```javascript
const notifier = SocialProofNotification.create({
  theme: 'my-custom-theme'
});
```

Then define your CSS:
```css
.my-custom-theme {
  /* Your custom styles */
}
```

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - feel free to use in personal and commercial projects.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

## Examples

Check out the `examples/` folder for complete working examples:
- `example-vanilla.html` - Vanilla JavaScript with default theme
- `example-bootstrap.html` - Bootstrap 5 integration
- `example-tailwind.html` - Tailwind CSS integration