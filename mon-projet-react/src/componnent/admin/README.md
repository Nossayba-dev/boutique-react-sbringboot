# Admin Dashboard Navigation Interface

A professional, responsive admin dashboard built with **React.js** and **Bootstrap 5**.

## 📋 Overview

This admin dashboard provides a complete navigation interface with:
- **Collapsible Sidebar** - Dark theme sidebar with smooth animations
- **Top Navbar** - With search bar, notifications, and profile dropdown
- **Responsive Layout** - Fully responsive on all screen sizes
- **Bootstrap Icons** - Professional icons throughout
- **Modern Design** - Clean and professional appearance

## 📁 Components

### 1. **Sidebar.jsx**
- Responsive navigation menu with 8 items
- Collapsible sidebar on click
- Menu items:
  - Dashboard
  - Users
  - Products
  - Orders
  - Categories
  - Analytics
  - Settings
  - Logout
- Smooth transitions and hover effects

### 2. **Navbar.jsx**
- Search bar for quick navigation
- Notification dropdown with badge counter
- Messages button
- Profile dropdown with logout option
- Responsive design

### 3. **DashboardLayout.jsx**
- Main layout component combining Sidebar and Navbar
- Dashboard content with:
  - Page header with welcome message
  - 4 stat cards (Users, Products, Orders, Revenue)
  - Sales Overview section
  - Recent Activities panel
  - Recent Orders table with status badges

## 🎨 Design Features

- **Dark Sidebar**: Professional gradient background (#2c3e50 to #34495e)
- **Color Scheme**: Primary color #667eea with gradient accents
- **Smooth Animations**: All transitions use cubic-bezier for smooth feel
- **Bootstrap Integration**: Uses Bootstrap 5 grid and components
- **Bootstrap Icons**: All icons from bootstrap-icons library

## 📱 Responsive Breakpoints

- **Desktop (>768px)**: Full sidebar visible with collapsible toggle
- **Tablet (768px-576px)**: Collapsed sidebar with icons only
- **Mobile (<576px)**: Compact layout with simplified table view

## 🛠️ Usage

```jsx
import DashboardLayout from './componnent/admin/DashboardLayout';

export default function App() {
  return <DashboardLayout />;
}
```

## 🎯 Key Features

✅ **Collapsible Sidebar** - Toggle between expanded and collapsed states
✅ **Notifications System** - Dropdown with notification items
✅ **Profile Management** - Profile dropdown with settings and logout
✅ **Search Functionality** - Search bar in navbar
✅ **Statistics Cards** - Quick overview of key metrics
✅ **Recent Orders Table** - Sortable and filterable table
✅ **Activity Feed** - Recent activities with timestamps
✅ **Responsive Design** - Mobile-first approach
✅ **Dark Theme Sidebar** - Professional appearance
✅ **Bootstrap Icons** - Complete icon set included

## 📦 Dependencies

- `react` - Latest version
- `bootstrap` - v5.x
- `bootstrap-icons` - For icon library

## 🎨 Styling

All custom styling is in `AdminDashboard.css` with:
- CSS variables for easy customization
- Minimal custom CSS (mostly Bootstrap classes)
- Hover and focus states for accessibility
- Print-friendly styles

## 🔧 Customization

To customize colors, edit the CSS variables in `AdminDashboard.css`:

```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --dark-sidebar: #2c3e50;
  --light-bg: #f8f9fa;
}
```

## 📱 Mobile Features

- Sidebar collapses on small screens
- Menu text hidden, only icons shown
- Optimized table view for mobile
- Touch-friendly buttons and links

## 🚀 Future Enhancements

- Add routing for different pages
- Integrate with backend API
- Add user authentication
- Implement data persistence
- Add more charts and analytics
- Add export functionality for reports

---

**Created**: April 7, 2026  
**Version**: 1.0.0  
**Status**: Production Ready
