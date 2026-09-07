# Overview: GyanSetu Registration Page (`register.html`)

## 1. File Purpose & Overview
This HTML file serves as the **prototype registration page** for **GyanSetu (SIH26101)**—a platform modeled for the **Ministry of Statistics & Programme Implementation (MoSPI)** and personnel within India's Official Statistical System. 

The page presents a **two-step registration flow** designed to verify official credentials and collect user account details.

---

## 2. Data Collected

The registration form captures user information across two steps:

### **Step 1: Organisation & Email Verification**
* **Organisation:** Selected from a dropdown list (`#organisation-select`).
* **Designation:** Selected from a dropdown list (`#designation-select`).
* **Government Employee Email:** Email input field (`#register-email`).
* **OTP Verification Code:** 6-digit numeric input field (`#email-otp`).

### **Step 2: Profile & Security Details**
* **Full Name:** User's full name (`#full-name`).
* **Employee / Personnel ID:** Official ID code (`#employee-id`).
* **Mobile Number:** 10-digit telephone number (`#mobile-number`).
* **Password:** Password field with a minimum length of 10 characters (`#register-password`).
* **Confirm Password:** Password confirmation field (`#confirm-password`).

---

## 3. Key Sections & UI Components Shown on the Page

The layout is split into two main sections: a **Guide/Story Section** (left side) and a **Form Section** (right side).

### **A. Header & Branding**
* **GyanSetu Brand Lockup:** Logo (`gyansetu-logo.svg`), brand name linking to `./index.html`.
* **Subtitle:** *"For India’s Official Statistical System"*.
* **Decorative Elements:** SVG flora graphics and decorative layout background ornaments.

### **B. Left Section: Registration Story & Guide**
* **Step 1 Visual Guide (`#register-story-step-one`):**
  * Displays a 4-stage breakdown:
    1. *Organisation Details*
    2. *Verify Email*
    3. *OTP Verification*
    4. *Complete Profile*
  * **Prototype Disclaimer Strip:** Clarifies that the SIH26101 prototype models a MoSPI path and does not connect to an official live government identity server.
* **Step 2 Visual Guide (`#register-story-step-two` - hidden initially):**
  * Shows a "You’re Almost There!" card with visual illustrations (profile card, road, bridge, book orb).
  * Lists three key platform benefits: **Secure Account**, **Personalized Experience**, and **Ready to Learn**.

### **C. Right Section: Registration Form & Controls**
* **Progress Stepper:** Visual step indicator showing current step (Step 1 vs. Step 2) with a dynamic progress bar (`#progress-fill`).
* **MoSPI Notice Box:** Informs the user that access is modeled specifically for official personnel.
* **Email Verification Box (`#email-verification-card`):**
  * Includes a **"Send OTP"** button.
  * Contains a **Demo OTP Panel** (`#demo-otp-panel`) that displays a generated demo OTP code and status (*Not verified*), along with an input field and **"Verify"** button.
* **Form Navigation Controls:**
  * **"Next"** button (disabled by default until Step 1 validation passes).
  * **"Back"** button (for Step 2).
  * **"Create Account"** submit button.
* **Security Box:** Advises users to set strong prototype passwords.
* **Live Status Message Container (`#register-status`):** ARIA-live container for accessibility feedback (errors/success notices).
* **Footer Link:** Sign-in redirect link (`./login.html`).

---

## 4. Technical & External Dependencies

* **Stylesheets:**
  * `./ui/gyansetu-components.css`
  * `./ui/gyansetu-auth.css`
* **Icons & Assets:**
  * SVG symbol set: `./ui/gyansetu-icons.svg`
  * Logo: `./ui/gyansetu-logo.svg`
* **JavaScript:**
  * `./register.js` (Handles the two-step form switching, OTP generation/validation, progress bar updates, and form submissions).
