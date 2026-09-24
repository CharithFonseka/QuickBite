# QuickBite — Manual Test Cases

> **App:** QuickBite — Campus Food Ordering App  
> **Version:** 1.0.0  
> **Tested on:** Android Emulator / Expo Go  
> **Tester:** _______________  
> **Date:** _______________

---

## Test Suite

| Test ID | Feature | Steps | Expected Result | Pass / Fail |
|---------|---------|-------|-----------------|-------------|
| TC-01 | Navigation Flow | 1. Launch the app. <br> 2. Wait 1.5 seconds on Splash screen. | App automatically navigates to Login screen without any user action. Splash is removed from the navigation stack (pressing back does not return to Splash). | |
| TC-02 | Login — Input Validation | 1. Open Login screen. <br> 2. Leave both email and password fields blank. <br> 3. Tap "Sign In". | Error messages appear below each empty field ("Email is required", "Password is required"). The form card shakes left-right to indicate the error. User stays on Login screen. | |
| TC-03 | Guest Login | 1. Open Login screen. <br> 2. Tap "Continue as Guest". | App navigates to Home screen. Header greeting reads "Hello, Guest! 👋". Cart is empty. | |
| TC-04 | Add to Cart (from Home) | 1. Login or continue as guest. <br> 2. On the Home screen, find any menu item card. <br> 3. Tap the orange "+" button on the card. | The cart icon in the top-right corner shows a red badge with the number "1". The item is added to the cart at quantity 1. | |
| TC-05 | Cart Quantity Update | 1. Add the same item to the cart multiple times using the "+" button on the Home screen. <br> 2. Navigate to Cart. | The cart shows one row for that item with the correct cumulative quantity. The subtotal for that row (quantity × price) is accurate. | |
| TC-06 | Cart Total Calculation | 1. Add 2–3 different items with known prices to the cart. <br> 2. Navigate to the Cart screen. | The "Subtotal" line equals the sum of (price × quantity) for all items. "GST (5%)" equals 5% of the subtotal. "Total" equals Subtotal + GST. | |
| TC-07 | Remove Item from Cart | 1. Add an item to the cart. <br> 2. Open Cart screen. <br> 3. Tap the "🗑" / "−" button until quantity reaches 0, OR tap "✕" on the item row. | The item is removed from the cart. If the cart becomes empty, the empty-state UI (with "Browse Menu" button) is displayed. | |
| TC-08 | Checkout Flow | 1. Add at least one item to the cart. <br> 2. Navigate to Cart. <br> 3. Tap "Proceed to Checkout". <br> 4. Review the order summary on Checkout screen. <br> 5. Tap "Place Order". | A loading spinner appears briefly, then the app navigates to the Order Tracking screen showing a generated Order ID (format QB-XXXX) and an estimated pickup time (now + 15 min). The cart is cleared (cart badge disappears). | |
| TC-09 | Order Status Progression | 1. Place an order to reach the Order Tracking screen. <br> 2. Wait 4 seconds. <br> 3. Wait another 4 seconds. | Status auto-advances: "Order Placed" → "Preparing" → "Ready for Pickup". The progress indicator shows each step as completed (green checkmark). The status card emoji and description update. | |
| TC-10 | Manual Status Advance | 1. Reach the Order Tracking screen after placing an order. <br> 2. Tap the "⏭ Next Status (Demo)" button. | Status advances immediately to the next step without waiting for the 4-second timer. The button disappears when the final status "Ready for Pickup" is reached. | |
| TC-11 | Search Filter | 1. On the Home screen, type "chai" in the search bar. | Only items whose names contain "chai" (case-insensitive) are shown in the grid. Other items are hidden. Clearing the search bar restores all items. | |
| TC-12 | Category Filter | 1. On the Home screen, tap the "Beverages" category tab. | Only beverage items are displayed (4 items: Masala Chai, Cold Coffee, Mango Lassi, Lemon Soda). The selected tab turns white with orange text. | |
| TC-13 | Profile Name Edit | 1. Log in (not as guest) and navigate to Profile via the header button. <br> 2. Tap "✏️ Edit" next to the profile name. <br> 3. Clear the input and tap "Save". | An alert appears: "Name cannot be empty". Name is not saved. <br> Entering a valid name and tapping Save updates the displayed name and closes the edit field. | |
| TC-14 | Layout on Tablet | 1. Run the app on a tablet-sized emulator (e.g. 10-inch). <br> 2. Browse the Home screen and Cart screen. | The two-column card grid remains usable and cards are not stretched unusually wide. All text is readable and buttons are tappable. Layout uses flex-based sizing — no fixed pixel widths cause overflow. | |
| TC-15 | Back Navigation | 1. Navigate: Home → ItemDetail → Cart → back button. | Each back press returns to the previous screen correctly. Pressing back on the Home screen does not navigate to Login (since `replace` was used). | |

---

## Notes

- All tests are manual (no automated test runner).
- App uses **no real backend** — all data is local/mock.
- For TC-09 and TC-10, the status auto-advances every **4 seconds** by default.
- Prices in the app are in **Indian Rupees (₹)**.

---

*Test cases written for academic / coursework review purposes.*
