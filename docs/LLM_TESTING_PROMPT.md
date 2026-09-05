# 🤖 LLM Testing Prompt for AgriFlow UI

Copy and paste this complete prompt to an LLM to perform comprehensive UI testing of the AgriFlow platform.

---

## 📋 PROMPT START

You are a professional QA engineer testing the **AgriFlow AI Agricultural Logistics Platform**. Your task is to comprehensively test all UI features and provide a detailed report.

### **CONTEXT:**
- **Platform:** AgriFlow - AI-powered direct farmer-to-buyer marketplace
- **Tech Stack:** React frontend, FastAPI backend, ML service
- **URLs:**
  - Frontend: http://localhost:5173
  - Backend API: http://localhost:8000/docs
  - ML Service: http://localhost:8001/docs

### **YOUR MISSION:**
Test every feature systematically and document what works and what doesn't. Be thorough and objective.

---

## 🎯 TESTING CHECKLIST

### **PHASE 1: Landing Page & Authentication**

#### **1.1 Landing Page (http://localhost:5173)**
- [ ] Page loads without errors
- [ ] Hero carousel displays and auto-rotates
- [ ] All navigation links are clickable
- [ ] "Features" section displays correctly
- [ ] "How It Works" section is visible
- [ ] Statistics/impact metrics display
- [ ] Footer contains proper links
- [ ] Language toggle (EN/HI) works
- [ ] Mobile responsiveness (resize browser)
- [ ] No console errors

**Test Actions:**
1. Open http://localhost:5173
2. Wait for page to fully load
3. Check browser console (F12) for errors
4. Click through all navigation items
5. Toggle language switcher
6. Scroll through entire page
7. Resize browser window to mobile size

**Document:**
- Any broken images
- Missing translations
- Console errors
- Layout issues
- Performance problems

---

#### **1.2 Login/Authentication**
- [ ] Login page accessible
- [ ] Login form displays correctly
- [ ] "Login as Farmer" button works
- [ ] "Login as Buyer" button works
- [ ] Form validation works (empty fields)
- [ ] Successful login redirects correctly
- [ ] User role is preserved
- [ ] Logout functionality works

**Test Actions:**
1. Navigate to login page
2. Try submitting empty form
3. Login as Farmer (use any credentials)
4. Check redirect to Farmer Dashboard
5. Logout
6. Login as Buyer
7. Check redirect to Buyer Dashboard
8. Logout

**Document:**
- Login flow issues
- Redirect problems
- Session management issues
- Error messages (are they clear?)

---

### **PHASE 2: Farmer Features**

#### **2.1 Farmer Dashboard**
- [ ] Dashboard loads after farmer login
- [ ] Welcome message displays farmer name
- [ ] Statistics cards show correct data
- [ ] Recent orders list displays
- [ ] Charts/graphs render correctly
- [ ] Quick action buttons are clickable
- [ ] Navigation sidebar works
- [ ] Global AI Assistant is accessible

**Test Actions:**
1. Login as Farmer
2. Observe dashboard layout
3. Check all statistics
4. Verify recent orders list
5. Click each quick action button
6. Test sidebar navigation
7. Try AI Assistant button

**Document:**
- Missing data
- Broken charts
- Navigation issues
- UI alignment problems

---

#### **2.2 Farmer Produce Management**
- [ ] "My Produce" page loads
- [ ] List of products displays
- [ ] "Add New Produce" button works
- [ ] Add produce form displays
- [ ] Form has all required fields:
  - [ ] Crop name/type
  - [ ] Quantity
  - [ ] Price per unit
  - [ ] Quality grade
  - [ ] Harvest date
  - [ ] Location/region
  - [ ] Description/notes
- [ ] Form validation works
- [ ] Submit creates new produce
- [ ] Edit produce functionality works
- [ ] Delete produce works (with confirmation)
- [ ] Search/filter produces works
- [ ] Pagination works (if applicable)

**Test Actions:**
1. Navigate to "My Produce" page
2. Click "Add New Produce"
3. Fill form with test data:
   - Crop: Tomato
   - Quantity: 500 kg
   - Price: ₹25/kg
   - Quality: A Grade
   - Region: Noida
4. Submit form
5. Verify produce appears in list
6. Edit the produce
7. Try to delete it
8. Test search functionality
9. Test filtering (if available)

**Document:**
- Form validation errors
- Submit/save issues
- Data display problems
- Edit/delete functionality

---

#### **2.3 Farmer Orders Page**
- [ ] Orders page loads
- [ ] List of orders displays
- [ ] Order details show:
  - [ ] Order ID
  - [ ] Buyer name
  - [ ] Product name
  - [ ] Quantity
  - [ ] Price
  - [ ] Status
  - [ ] Date
- [ ] Order status badges display correctly
- [ ] "View Details" button works
- [ ] Order detail modal/page shows full info
- [ ] Status update options available
- [ ] Filter by status works
- [ ] Search orders works

**Test Actions:**
1. Navigate to Orders page
2. Count number of orders
3. Click on each order
4. View full order details
5. Try to update order status
6. Filter by different statuses
7. Search for specific order
8. Check if pagination works

**Document:**
- Missing order data
- Status update issues
- Filter/search problems
- Detail view issues

---

#### **2.4 Farmer Demand Intelligence**
- [ ] Demand page loads
- [ ] Crop selection dropdown works
- [ ] Region selection dropdown works
- [ ] "Get Forecast" button works
- [ ] ML prediction displays
- [ ] Confidence score shows (should be 95%+)
- [ ] `ml_service_status: "active"` shows
- [ ] Predicted demand displays
- [ ] Recommended price shows
- [ ] Weather impact shown
- [ ] Festival signals displayed
- [ ] Market trends chart/graph
- [ ] Historical data comparison

**Test Actions:**
1. Navigate to Demand Intelligence
2. Select: Crop = "Tomato"
3. Select: Region = "Noida"
4. Click "Get Forecast"
5. **IMPORTANT:** Check these specific values:
   - ml_service_status = "active"
   - confidence_score >= 95%
   - predicted_demand has a number
   - recommended_price has a value
6. Try different crop/region combinations
7. Check if charts render
8. Verify data makes sense

**⭐ CRITICAL TEST - ML INTEGRATION:**
This is the STAR feature. Document:
- Is ML service status "active" or "fallback"?
- Are predictions real or mock data?
- Does confidence score match expectations?
- Are recommendations actionable?

**Document:**
- ML service connectivity
- Data accuracy
- UI responsiveness
- Error handling
- Fallback behavior

---

### **PHASE 3: Buyer Features**

#### **3.1 Buyer Dashboard**
- [ ] Dashboard loads after buyer login
- [ ] Welcome message shows buyer name
- [ ] Statistics display correctly
- [ ] Active requests list shows
- [ ] Matched farmers display
- [ ] Charts/metrics render
- [ ] Quick actions work
- [ ] Navigation is functional

**Test Actions:**
1. Logout from farmer account
2. Login as Buyer
3. Check dashboard loads
4. Verify all statistics
5. Check active requests
6. Test navigation links
7. Try quick action buttons

**Document:**
- Dashboard issues
- Missing data
- Navigation problems

---

#### **3.2 Procurement Request**
- [ ] "New Request" page loads
- [ ] Request form displays all fields:
  - [ ] Crop type
  - [ ] Quantity needed
  - [ ] Quality requirements
  - [ ] Budget/price range
  - [ ] Delivery location
  - [ ] Deadline date
  - [ ] Special requirements
- [ ] Form validation works
- [ ] Submit creates request
- [ ] Success message displays
- [ ] Request appears in list
- [ ] Edit request works
- [ ] Delete request works

**Test Actions:**
1. Navigate to "New Procurement Request"
2. Fill form with test data:
   - Crop: Tomato
   - Quantity: 1000 kg
   - Budget: ₹30/kg
   - Location: Delhi
   - Deadline: (future date)
3. Submit request
4. Verify success message
5. Check request in list
6. Try editing request
7. Try deleting request

**Document:**
- Form validation issues
- Submission problems
- List display issues
- Edit/delete functionality

---

#### **3.3 Smart Matching**
- [ ] Smart Matching page loads
- [ ] Select procurement request dropdown works
- [ ] "Find Matches" button works
- [ ] Matched farmers list displays
- [ ] Match score/percentage shows
- [ ] Farmer details display:
  - [ ] Name
  - [ ] Location
  - [ ] Distance
  - [ ] Available quantity
  - [ ] Price
  - [ ] Quality grade
  - [ ] Match score
- [ ] Sort by match score works
- [ ] Filter options work
- [ ] "Select Farmer" button works
- [ ] Can create order from match

**Test Actions:**
1. Navigate to Smart Matching
2. Select a procurement request
3. Click "Find Matches"
4. Count matched farmers
5. Check match scores (should be % or 0-100)
6. Verify farmer details are complete
7. Try sorting options
8. Try filtering by criteria
9. Select a farmer
10. Create order from match

**⭐ CRITICAL TEST - MATCHING ALGORITHM:**
Document:
- Are match scores realistic?
- Are criteria clearly shown?
- Does sorting work correctly?
- Is the algorithm explanation visible?

**Document:**
- Matching algorithm performance
- Score accuracy
- Data completeness
- Selection process
- Order creation flow

---

#### **3.4 Marketplace**
- [ ] Marketplace page loads
- [ ] Product grid/list displays
- [ ] All products show:
  - [ ] Product image (or placeholder)
  - [ ] Crop name
  - [ ] Farmer name
  - [ ] Price
  - [ ] Quantity available
  - [ ] Quality grade
  - [ ] Location
- [ ] Search products works
- [ ] Filter by crop type works
- [ ] Filter by price range works
- [ ] Filter by location works
- [ ] Sort options work
- [ ] "View Details" opens product page
- [ ] "Add to Cart" or "Request Quote" works
- [ ] Pagination works

**Test Actions:**
1. Navigate to Marketplace
2. Count available products
3. Try search function
4. Filter by crop type
5. Filter by price range
6. Sort by price (low to high)
7. Click on a product
8. View full product details
9. Try to purchase/request
10. Navigate between pages

**Document:**
- Product display issues
- Search/filter accuracy
- Sorting functionality
- Detail page completeness
- Purchase flow

---

### **PHASE 4: Common Features**

#### **4.1 Order Tracking**
- [ ] Order Tracking page accessible
- [ ] Enter order ID field works
- [ ] "Track Order" button works
- [ ] Order timeline displays
- [ ] Status checkpoints show:
  - [ ] Order placed
  - [ ] Confirmed
  - [ ] Picked up
  - [ ] In transit
  - [ ] Delivered
- [ ] Current status is highlighted
- [ ] Estimated delivery shows
- [ ] Tracking map displays (if applicable)
- [ ] Driver/vehicle info shows
- [ ] Contact buttons work

**Test Actions:**
1. Navigate to Order Tracking
2. Use an order ID from Orders page
3. Click Track
4. Verify timeline displays
5. Check current status
6. View estimated delivery
7. Check map (if available)
8. Try contact buttons

**Document:**
- Tracking functionality
- Timeline accuracy
- Status updates
- Map integration
- Contact features

---

#### **4.2 Smart Logistics / Route Optimization**
- [ ] Logistics page loads
- [ ] Route map displays
- [ ] Select multiple orders checkbox works
- [ ] "Optimize Route" button works
- [ ] Optimized route displays on map
- [ ] Route details show:
  - [ ] Total distance
  - [ ] Estimated time
  - [ ] Fuel cost estimate
  - [ ] Cost savings
  - [ ] Stop sequence
- [ ] Turn-by-turn directions available
- [ ] Can export route
- [ ] Can assign to driver

**Test Actions:**
1. Navigate to Smart Logistics
2. Select multiple orders
3. Click "Optimize Route"
4. Wait for optimization
5. Check map updates
6. Verify route details
7. Check cost savings
8. Try export/share options

**⭐ CRITICAL TEST - ROUTE OPTIMIZATION:**
Document:
- Is optimization algorithm working?
- Are distances calculated?
- Are savings realistic?
- Is the route logical?

**Document:**
- Optimization performance
- Route accuracy
- Savings calculation
- Map functionality
- Export features

---

#### **4.3 Price Transparency**
- [ ] Price page loads
- [ ] Select crop dropdown works
- [ ] Select region dropdown works
- [ ] Historical price chart displays
- [ ] Current market price shows
- [ ] Price trends visible
- [ ] Comparison with mandi prices
- [ ] Prediction for future prices
- [ ] Multiple region comparison works
- [ ] Date range selector works
- [ ] Export data option works

**Test Actions:**
1. Navigate to Price Transparency
2. Select crop: Tomato
3. Select region: Noida
4. Verify chart displays
5. Check current price
6. View historical trends
7. Compare with other regions
8. Change date range
9. Try export feature

**Document:**
- Chart rendering
- Data accuracy
- Comparison functionality
- Export capability
- UI responsiveness

---

#### **4.4 Impact Dashboard**
- [ ] Impact page loads
- [ ] Key metrics display:
  - [ ] Farmers benefited
  - [ ] Farmer income increase %
  - [ ] Total transactions
  - [ ] Food waste reduced %
  - [ ] CO2 emissions saved
  - [ ] Buyer cost savings %
- [ ] Charts/visualizations render
- [ ] Impact stories/testimonials show
- [ ] Environmental impact section
- [ ] Economic impact section
- [ ] Social impact section
- [ ] Filter by date range works
- [ ] Export report works

**Test Actions:**
1. Navigate to Impact Dashboard
2. Check all metrics display
3. Verify percentages/numbers
4. Review visualizations
5. Read impact stories
6. Filter by date range
7. Try export report

**Document:**
- Metrics accuracy
- Visualization quality
- Story content
- Filter functionality
- Report generation

---

#### **4.5 Global AI Assistant**
- [ ] AI Assistant button visible on all pages
- [ ] Click opens chat panel
- [ ] Chat interface displays correctly
- [ ] Can type messages
- [ ] Send button works
- [ ] AI responds to queries
- [ ] Response time is reasonable
- [ ] Answers are relevant
- [ ] Can ask follow-up questions
- [ ] Chat history persists
- [ ] Can clear chat
- [ ] Can close panel
- [ ] Context-aware (knows current page)

**Test Questions to Ask AI:**
1. "What crops are in high demand right now?"
2. "How do I add new produce?"
3. "What is my match score?"
4. "Show me price trends for tomatoes"
5. "How can I optimize my delivery route?"
6. "What are the current market prices?"
7. "Help me create a procurement request"

**Test Actions:**
1. Open AI Assistant from dashboard
2. Ask each test question
3. Evaluate response quality
4. Try follow-up questions
5. Test on different pages
6. Check if context changes
7. Clear chat history
8. Close and reopen

**Document:**
- Response accuracy
- Response time
- Context awareness
- UI functionality
- Error handling

---

### **PHASE 5: Technical Testing**

#### **5.1 API Integration**
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Perform actions on UI
- [ ] Check API calls:
  - [ ] Backend API calls (port 8000)
  - [ ] ML service calls (port 8001)
  - [ ] Status codes (200, 201, etc.)
  - [ ] Response times
  - [ ] Error responses (if any)

**Test Actions:**
1. Open DevTools → Network tab
2. Clear network log
3. Perform key actions (forecast, matching, etc.)
4. Filter by "Fetch/XHR"
5. Check each API call
6. Look for failed requests (red)
7. Check response payloads

**Document:**
- Failed API calls
- Slow requests (>2 seconds)
- Error responses
- Missing endpoints
- CORS issues

---

#### **5.2 Console Errors**
- [ ] Open browser Console (F12)
- [ ] Navigate through entire app
- [ ] Look for errors (red text)
- [ ] Check warnings (yellow text)
- [ ] Note any React errors
- [ ] Check for missing dependencies

**Test Actions:**
1. Open DevTools → Console tab
2. Clear console
3. Navigate every page
4. Perform every action
5. Watch for errors
6. Screenshot any errors

**Document:**
- JavaScript errors
- React warnings
- Missing modules
- API errors
- Type errors

---

#### **5.3 Performance**
- [ ] Page load times (<3 seconds)
- [ ] API response times (<2 seconds)
- [ ] ML prediction time (<5 seconds)
- [ ] UI responsiveness (no lag)
- [ ] Smooth scrolling
- [ ] Smooth animations
- [ ] No memory leaks (long usage)

**Test Actions:**
1. Use DevTools → Performance tab
2. Record page load
3. Check load time
4. Test interactions
5. Measure API calls
6. Note any delays

**Document:**
- Slow pages
- Laggy interactions
- Long API calls
- Memory usage

---

#### **5.4 Mobile Responsiveness**
- [ ] Resize browser to mobile (375px width)
- [ ] Navigation menu adapts (hamburger)
- [ ] Forms are usable
- [ ] Tables scroll horizontally
- [ ] Charts resize properly
- [ ] Buttons are clickable
- [ ] Text is readable
- [ ] No horizontal scroll (unless intended)

**Test Actions:**
1. Resize browser to 375px wide
2. Navigate all pages
3. Test all forms
4. Check all tables
5. Verify charts
6. Test navigation

**Document:**
- Layout breaks
- Unusable forms
- Broken charts
- Navigation issues

---

#### **5.5 Cross-Browser Testing** (if possible)
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Edge
- [ ] Test in Safari (if Mac)

**Document:**
- Browser-specific issues
- Missing features
- CSS problems

---

### **PHASE 6: Edge Cases & Error Handling**

#### **6.1 Empty States**
- [ ] No produces listed (farmer)
- [ ] No orders yet
- [ ] No matched farmers found
- [ ] No search results
- [ ] Empty marketplace
- [ ] Proper "No data" messages display

**Test Actions:**
1. Try scenarios with no data
2. Check empty state messages
3. Verify helpful suggestions shown

**Document:**
- Missing empty states
- Confusing messages
- No guidance for users

---

#### **6.2 Invalid Inputs**
- [ ] Submit empty forms
- [ ] Enter invalid quantities (negative, zero)
- [ ] Enter invalid prices
- [ ] Select invalid dates (past dates)
- [ ] Enter special characters
- [ ] Enter very long text
- [ ] Proper validation messages show

**Test Actions:**
1. Try submitting forms with bad data
2. Check validation messages
3. Verify error highlighting
4. Test each field type

**Document:**
- Missing validations
- Unclear error messages
- Crashed forms

---

#### **6.3 Network Errors**
- [ ] Stop backend server
- [ ] Try using UI
- [ ] Check error messages
- [ ] Stop ML service
- [ ] Test demand forecast
- [ ] Check fallback behavior
- [ ] Restart servers
- [ ] Verify recovery

**Test Actions:**
1. Stop backend (Ctrl+C in terminal)
2. Try actions in UI
3. Document error messages
4. Stop ML service
5. Try forecast feature
6. Check fallback message
7. Restart servers

**Document:**
- Error handling
- Fallback mechanisms
- User feedback
- Recovery behavior

---

## 📊 FINAL REPORT TEMPLATE

After completing ALL tests, provide a comprehensive report in this format:

---

# 🔍 AgriFlow UI Testing Report

**Test Date:** [Current Date]  
**Tester:** [Your Name/AI]  
**Platform Version:** AgriFlow v1.0  
**Test Duration:** [Time taken]  

---

## ✅ EXECUTIVE SUMMARY

**Overall Status:** [PASS / FAIL / PARTIAL]  
**Total Features Tested:** [Number]  
**Working Features:** [Number] ([Percentage]%)  
**Broken Features:** [Number] ([Percentage]%)  
**Critical Issues:** [Number]  

**Recommendation:** [Ready for demo / Needs fixes / Not ready]

---

## 📈 TEST RESULTS BY CATEGORY

### **Landing & Authentication**
- ✅ Working: [List working features]
- ❌ Broken: [List broken features]
- ⚠️ Issues: [List minor issues]

### **Farmer Features**
- ✅ Working: [List]
- ❌ Broken: [List]
- ⚠️ Issues: [List]

### **Buyer Features**
- ✅ Working: [List]
- ❌ Broken: [List]
- ⚠️ Issues: [List]

### **Common Features**
- ✅ Working: [List]
- ❌ Broken: [List]
- ⚠️ Issues: [List]

### **ML Integration** ⭐
- ML Service Status: [active / fallback / error]
- Confidence Score: [Percentage]
- Prediction Quality: [Excellent / Good / Poor / Broken]
- ✅ Working: [List]
- ❌ Broken: [List]

### **Technical Aspects**
- API Integration: [Status]
- Console Errors: [Count]
- Performance: [Good / Acceptable / Poor]
- Mobile Responsive: [Yes / Partial / No]

---

## 🐛 CRITICAL BUGS (Fix Before Demo)

### **Bug #1: [Title]**
- **Severity:** Critical / High / Medium / Low
- **Location:** [Page/Feature]
- **Description:** [What's broken]
- **Steps to Reproduce:**
  1. [Step 1]
  2. [Step 2]
  3. [Step 3]
- **Expected:** [What should happen]
- **Actual:** [What actually happens]
- **Impact:** [How it affects demo]
- **Fix Priority:** [Must fix / Should fix / Nice to fix]

[Repeat for each critical bug]

---

## ⚠️ MEDIUM PRIORITY ISSUES

[List issues that work but have problems]

---

## 💡 MINOR ISSUES / IMPROVEMENTS

[List cosmetic or minor usability issues]

---

## ✅ WORKING FEATURES (Highlight in Demo)

### **⭐ STAR FEATURES (Work perfectly)**
1. [Feature 1 with details]
2. [Feature 2 with details]
3. [Feature 3 with details]

### **✅ SOLID FEATURES (Work well)**
[List features that work without issues]

---

## 📊 FEATURE STATUS TABLE

| Feature | Status | Notes |
|---------|--------|-------|
| Landing Page | ✅ / ❌ / ⚠️ | [Notes] |
| Login/Auth | ✅ / ❌ / ⚠️ | [Notes] |
| Farmer Dashboard | ✅ / ❌ / ⚠️ | [Notes] |
| Produce Management | ✅ / ❌ / ⚠️ | [Notes] |
| Farmer Orders | ✅ / ❌ / ⚠️ | [Notes] |
| Demand Forecast ⭐ | ✅ / ❌ / ⚠️ | [Notes] |
| Buyer Dashboard | ✅ / ❌ / ⚠️ | [Notes] |
| Procurement | ✅ / ❌ / ⚠️ | [Notes] |
| Smart Matching ⭐ | ✅ / ❌ / ⚠️ | [Notes] |
| Marketplace | ✅ / ❌ / ⚠️ | [Notes] |
| Order Tracking | ✅ / ❌ / ⚠️ | [Notes] |
| Route Optimization ⭐ | ✅ / ❌ / ⚠️ | [Notes] |
| Price Transparency | ✅ / ❌ / ⚠️ | [Notes] |
| Impact Dashboard | ✅ / ❌ / ⚠️ | [Notes] |
| AI Assistant | ✅ / ❌ / ⚠️ | [Notes] |

---

## 🎯 ML INTEGRATION DEEP DIVE

**This is the MOST IMPORTANT section for judging.**

### **ML Service Connectivity**
- Status: [Active / Fallback / Error]
- Response Time: [Seconds]
- Reliability: [Consistent / Intermittent / Failed]

### **Prediction Quality**
- Confidence Score Range: [X% - Y%]
- Average Confidence: [Z%]
- Data Sources: [Real / Mock / Mixed]
- Accuracy Assessment: [Excellent / Good / Poor]

### **Feature Completeness**
- ✅ / ❌ Demand forecasting works
- ✅ / ❌ Confidence scores display
- ✅ / ❌ Weather impact shown
- ✅ / ❌ Festival signals displayed
- ✅ / ❌ Price recommendations
- ✅ / ❌ Historical comparison
- ✅ / ❌ Real-time updates

### **Fallback Behavior**
- ✅ / ❌ Graceful degradation when ML down
- ✅ / ❌ Clear status indication
- ✅ / ❌ User-friendly error messages

**Verdict:** [This will make or break your demo]

---

## 🔧 API TESTING RESULTS

### **Backend API (Port 8000)**
- Health Check: ✅ / ❌
- Total Endpoints Tested: [Number]
- Working Endpoints: [Number]
- Failed Endpoints: [List]
- Average Response Time: [ms]

### **ML Service API (Port 8001)**
- Health Check: ✅ / ❌
- Prediction Endpoint: ✅ / ❌
- Response Time: [ms]
- Error Rate: [%]

### **Failed API Calls**
[List any API calls that consistently fail]

---

## 📱 RESPONSIVE DESIGN

**Mobile (375px)**
- Navigation: ✅ / ❌
- Forms: ✅ / ❌
- Tables: ✅ / ❌
- Charts: ✅ / ❌
- Overall: [Pass / Fail]

**Tablet (768px)**
- Overall: [Pass / Fail]

**Desktop (1920px)**
- Overall: [Pass / Fail]

---

## ⚡ PERFORMANCE METRICS

- Average Page Load: [seconds]
- Slowest Page: [page name] - [seconds]
- Fastest API Call: [endpoint] - [ms]
- Slowest API Call: [endpoint] - [ms]
- ML Prediction Time: [seconds]

**Performance Grade:** [A / B / C / D / F]

---

## 🐞 CONSOLE ERRORS

**Total Console Errors:** [Number]

### **Critical Errors (Red)**
```
[Copy paste actual errors]
```

### **Warnings (Yellow)**
```
[Copy paste actual warnings]
```

---

## 🎭 USER EXPERIENCE ASSESSMENT

### **Ease of Use**
- Navigation: [Intuitive / Confusing]
- Forms: [Easy / Difficult]
- Visual Design: [Professional / Needs work]
- Error Messages: [Clear / Confusing]
- Loading States: [Good / Missing]

### **User Journey**
- Farmer Flow: [Smooth / Broken]
- Buyer Flow: [Smooth / Broken]
- Overall UX: [Excellent / Good / Poor]

---

## 🎯 DEMO READINESS ASSESSMENT

### **✅ SAFE TO DEMO (Highlight these)**
[List features that work perfectly and should be showcased]

### **⚠️ DEMO WITH CAUTION (Have backup)**
[List features that work but might have issues]

### **❌ SKIP IN DEMO (Will fail)**
[List features that are broken and should be avoided]

---

## 📋 PRE-DEMO CHECKLIST

Based on testing, here's what MUST work before demo:

- [ ] [Critical feature 1]
- [ ] [Critical feature 2]
- [ ] ML service status is "active"
- [ ] Confidence scores show 95%+
- [ ] No console errors on main features
- [ ] [Add more based on findings]

---

## 🔄 RECOMMENDED DEMO FLOW

**Based on test results, this is the safest demo path:**

1. **[Step 1]** - [Why this works]
2. **[Step 2]** - [Why this works]
3. **[Step 3]** - [Highlight ML here]
4. **[Step 4]** - [Show matching]
5. **[Step 5]** - [Show impact]

**Avoid:**
- [Feature X] - [Because it's broken]
- [Feature Y] - [Because it's slow]

---

## 🚨 BLOCKERS FOR HACKATHON

**MUST FIX before demo:**
1. [Blocker 1]
2. [Blocker 2]

**SHOULD FIX before demo:**
1. [Issue 1]
2. [Issue 2]

**CAN FIX later:**
1. [Nice-to-have 1]
2. [Nice-to-have 2]

---

## 💯 FINAL VERDICT

**Overall Platform Status:** [Choose one]
- 🟢 EXCELLENT - Demo ready, no critical issues
- 🟡 GOOD - Demo ready with minor issues
- 🟠 NEEDS WORK - Can demo but fix critical bugs first
- 🔴 NOT READY - Major features broken, do not demo

**ML Integration Status:** [Choose one]
- 🟢 FULLY FUNCTIONAL - Real ML, high confidence
- 🟡 PARTIALLY WORKING - Some features work
- 🟠 FALLBACK MODE - Using mock data
- 🔴 BROKEN - ML service not connected

**Recommendation:** [Your final recommendation for the hackathon team]

---

## 📈 SUCCESS METRICS

**Based on testing:**
- Feature Completion: [%]
- Working Features: [%]
- ML Integration: [%]
- Performance Score: [%]
- UX Quality: [%]

**Overall Score: [X/100]**

---

## 🎓 TESTING METHODOLOGY

**How I tested:**
- Manual UI testing: [Time]
- API testing: [Method]
- Performance testing: [Method]
- Browser: [Chrome/Firefox/etc]
- Screen sizes tested: [List]
- Test data used: [Describe]

**Test Completeness:** [% of features tested]

---

## 📞 NEXT STEPS

1. **Immediate Actions:**
   - [Action 1]
   - [Action 2]

2. **Before Demo:**
   - [Action 1]
   - [Action 2]

3. **Post-Hackathon:**
   - [Improvement 1]
   - [Improvement 2]

---

## 📝 ADDITIONAL NOTES

[Any other observations, suggestions, or comments]

---

**Report Generated By:** AI Tester  
**Report Date:** [Date]  
**Report Version:** 1.0

---

END OF REPORT

---

## 🎯 TESTING INSTRUCTIONS FOR YOU (LLM)

**How to execute this test:**

1. **Start all services first:**
   - Ensure ML service is running on port 8001
   - Ensure backend is running on port 8000
   - Ensure frontend is running on port 5173

2. **Follow the checklist systematically:**
   - Go through each phase in order
   - Check every checkbox
   - Document everything you observe

3. **Be thorough and honest:**
   - Don't skip steps
   - Report both successes and failures
   - Provide specific details, not generalities

4. **Focus on ML integration:**
   - This is the most critical feature
   - Test it extensively
   - Document the exact responses

5. **Provide actionable feedback:**
   - Specific bug descriptions
   - Steps to reproduce
   - Priority levels
   - Fix suggestions

6. **Generate the complete report:**
   - Use the template provided
   - Fill in all sections
   - Provide percentages and metrics
   - Give clear verdict

**Your goal:** Help the hackathon team understand exactly what works and what needs fixing before their demo.

Good luck with testing! 🚀

---

## 📋 PROMPT END

---

## 📌 HOW TO USE THIS PROMPT

1. **Start all three services** (ML, Backend, Frontend)
2. **Copy the entire prompt** from "PROMPT START" to "PROMPT END"
3. **Paste into an LLM** (Claude, ChatGPT, or any capable AI)
4. **Wait for comprehensive testing** (may take 15-20 minutes)
5. **Review the generated report**
6. **Fix critical issues** before demo
7. **Run test again** to verify fixes

---

## 🎯 EXPECTED OUTPUT

The LLM will provide:
- ✅ Detailed test results for every feature
- 🐛 List of bugs with reproduction steps
- 📊 Performance metrics
- 🎯 Demo readiness assessment
- 💡 Recommendations for fixes
- 📋 Pre-demo checklist
- 🔄 Recommended demo flow

---

**This prompt is designed to give you a professional QA report that will help you prepare for your hackathon demo! 🏆**
