# How to Get Your User ID

## Method 1: From Browser (Easiest)
1. **Sign in** to your form builder app with `aryanbelle692@gmail.com`
2. **Open browser dev tools** (F12)
3. **Go to Application/Storage tab**
4. **Find localStorage**
5. **Look for 'user' key**
6. **Copy the $id value** - this is your User ID

## Method 2: From Appwrite Console
1. Go to your **Appwrite Console**
2. Navigate to **Auth → Users**
3. Find your user account (`aryanbelle692@gmail.com`)
4. **Copy the User ID** from the list

## Method 3: Quick JavaScript (in browser console)
```javascript
// Run this in browser console after signing in
const user = JSON.parse(localStorage.getItem('user') || '{}');
console.log('Your User ID:', user.$id);
```

## Then Use the Seeding Tool
1. Go to: `http://localhost:3000/seed`
2. **Enter your User ID**
3. **Click "Seed Sample Data"**
4. **Wait for completion**
5. **Go to dashboard** to see your new forms!

## What You'll Get
- **3 realistic forms**: Customer Survey, Employee Feedback, Product Feedback
- **45-105 total responses** (15-35 per form)
- **Realistic data**: Names, emails, ratings, feedback text
- **Time distribution**: Responses spread over 30 days
- **Perfect for testing**: Analytics charts, AI analysis, export features

## Sample Forms Created
1. **Customer Satisfaction Survey** - 6 fields including ratings and feedback
2. **Employee Feedback Form** - 6 fields with department, satisfaction, suggestions
3. **Product Feedback Survey** - 6 fields with product ratings and usage patterns

All forms will have realistic, varied responses perfect for testing your analytics and AI features! 🚀