# SocialProofNotification.js - Quick Reference

## Basic Usage

```html
<script src="social-proof-notification.min.js"></script>
<script>
  SocialProofNotification.create({
    position: 'bottom-right'
  }).init();
</script>
```

## Configuration Cheat Sheet

| Property | Options | Default |
|----------|---------|---------|
| `position` | `top-left`, `top-right`, `top-center`, `bottom-left`, `bottom-right`, `bottom-center` | `bottom-right` |
| `theme` | `default`, `bootstrap`, `tailwind` | `default` |
| `dataSource` | `local`, `api` | `local` |
| `autoClose` | `true`, `false` | `true` |
| `autoCloseTimeout` | milliseconds | `8000` |
| `initialDelay` | milliseconds | `10000` |
| `animation` | `slide`, `fade`, `bounce`, `none` | `slide` |
| `iconType` | `checkmark`, `fire`, `star` | `checkmark` |
| `minTimeBetween` | hours | `9` |

## Theme Examples

### Vanilla JS (Default)
```javascript
SocialProofNotification.create({
  theme: 'default'
}).init();
```

### Bootstrap 5
```html
<!-- Add Bootstrap CSS + Icons first -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">

<script>
  SocialProofNotification.create({
    theme: 'bootstrap'
  }).init();
</script>
```

### Tailwind CSS
```html
<!-- Add Tailwind CSS first -->
<script src="https://cdn.tailwindcss.com"></script>

<script>
  SocialProofNotification.create({
    theme: 'tailwind'
  }).init();
</script>
```

## Data Source Examples

### Local Data
```javascript
SocialProofNotification.create({
  dataSource: 'local',
  localData: [
    { message: 'John just bought this!', timestamp: 'Just now' },
    { message: '5 people viewing', timestamp: '1 min ago' }
  ]
}).init();
```

### API
```javascript
SocialProofNotification.create({
  dataSource: 'api',
  apiUrl: 'https://api.example.com/notifications'
}).init();
```

API Response Format:
```json
{
  "message": "Someone just purchased!",
  "timestamp": "Just now"
}
```

## Common Patterns

### E-commerce Purchase Notifications
```javascript
SocialProofNotification.create({
  position: 'bottom-right',
  iconType: 'checkmark',
  localData: [
    { message: 'Someone purchased in New York', timestamp: '2 min ago' },
    { message: 'Product sold in California', timestamp: 'Just now' }
  ],
  autoCloseTimeout: 6000,
  minTimeBetween: 3  // Show every 3 hours
}).init();
```

### Sign-up Notifications
```javascript
SocialProofNotification.create({
  position: 'top-right',
  iconType: 'star',
  messageFormat: '{count} people {action} {timeframe}',
  autoCloseTimeout: 10000
}).init();
```

### Live Activity Feed
```javascript
SocialProofNotification.create({
  position: 'bottom-left',
  iconType: 'fire',
  dataSource: 'api',
  apiUrl: '/api/activity',
  initialDelay: 3000,
  pauseOnHover: true
}).init();
```

## Methods

```javascript
const notifier = SocialProofNotification.create(options);

notifier.init();      // Start showing notifications
notifier.show();      // Show immediately
notifier.hide();      // Hide current notification
notifier.destroy();   // Clean up and remove
```

## How Framework Integration Works

**The library detects your theme and applies the appropriate CSS classes:**

- **`default`**: Uses built-in CSS with minimal styling
- **`bootstrap`**: Uses Bootstrap's toast classes (`toast`, `toast-body`, `btn-close`, etc.)
- **`tailwind`**: Uses Tailwind utility classes (`bg-white`, `rounded-lg`, `shadow-lg`, etc.)

This means:
- ✅ No custom CSS needed when using frameworks
- ✅ Notifications match your site's existing design
- ✅ Easy to switch themes by changing one property
- ✅ Works with your framework's utilities (colors, spacing, etc.)

## Tips

1. **Test different positions** to see what works best for your layout
2. **Use API source** for real-time data from your backend
3. **Adjust minTimeBetween** to control notification frequency
4. **Set saveToStorage: false** during testing to see notifications immediately
5. **Use pauseOnHover** if notifications contain important info users should read
6. **Match iconType** to your notification context (checkmark for success, fire for trending)
7. **Customize messageFormat** to match your brand voice

## Troubleshooting

**Notification not showing?**
- Check `saveToStorage` and `minTimeBetween` settings
- Set `initialDelay` to a lower value for testing
- Check browser console for errors

**Styling looks wrong?**
- Verify you've included the correct framework CSS
- Check that `theme` matches your framework
- For Bootstrap, ensure Bootstrap Icons are loaded

**API notifications not working?**
- Verify API endpoint returns correct JSON format
- Check CORS settings if API is on different domain
- Check network tab in browser dev tools
