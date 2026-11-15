// Automated Verification Test Suite for AgriShift 2.0 Upgrades
import { agroDataService } from './src/services/agroDataService.js';
import { TRANSLATIONS } from './src/context/translations.js';
import { authService } from './src/services/authService.js';

// Polyfill localStorage for node environment if running directly
if (typeof localStorage === 'undefined') {
  const store = {};
  global.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
  };
}

console.log('================================================================');
console.log('AGRISHIFT 2.0 FULL STORY VERIFICATION & TEST SUITE');
console.log('================================================================\n');

let totalTests = 0;
let passedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    console.error(`  [FAIL] ${testName}`);
    if (details) console.error(`         Detail: ${details}`);
  }
}

async function runTests() {
  // -------------------------------------------------------------
  // TEST 1: Language System (English as Default & Malayalam Support)
  // -------------------------------------------------------------
  console.log('--- TEST GROUP 1: Language System (English Default & i18n) ---');
  assert(TRANSLATIONS.en !== undefined, 'English dictionary exists');
  assert(TRANSLATIONS.en.brand_name === 'AgriShift 2.0', 'English is default brand: AgriShift 2.0');
  assert(TRANSLATIONS.en.auth_error_not_found === 'Account not found. Please register first.', 'English exact auth rejection string matches requirement');
  assert(TRANSLATIONS.ml !== undefined, 'Malayalam dictionary exists');
  assert(TRANSLATIONS.ml.auth_error_not_found.includes('അക്കൗണ്ട് കണ്ടെത്തിയില്ല'), 'Malayalam auth rejection string present');
  assert(TRANSLATIONS.en.suitability_recs === 'Recommended Crops for this Region', 'English land suitability string exists');
  assert(TRANSLATIONS.ml.suitability_recs.includes('അനുയോജ്യമായ വിളകൾ'), 'Malayalam land suitability string exists');

  // -------------------------------------------------------------
  // TEST 2: Strict Authentication & Security Hardening
  // -------------------------------------------------------------
  console.log('\n--- TEST GROUP 2: Authentication & Security System ---');
  
  // 2A: Test login with unregistered email
  let unregisteredFailedCorrectly = false;
  let exactRejectionMessage = '';
  try {
    await authService.loginUser('random.unregistered.user@gmail.com', 'somePassword123');
  } catch (err) {
    unregisteredFailedCorrectly = true;
    exactRejectionMessage = err.message;
  }
  assert(
    unregisteredFailedCorrectly && exactRejectionMessage === 'Account not found. Please register first.',
    'Login with unregistered email fails with exact message: "Account not found. Please register first."',
    `Received: "${exactRejectionMessage}"`
  );

  // 2B: Test pre-seeded verified account login
  let preSeededSuccess = false;
  try {
    const session = await authService.loginUser('farmer@kerala.agri', 'admin');
    if (session && session.user && session.profile) {
      preSeededSuccess = true;
    }
  } catch (err) {
    preSeededSuccess = false;
  }
  assert(preSeededSuccess, 'Pre-seeded verified account (farmer@kerala.agri) logs in successfully');

  // 2C: Test registering a new user with OTP
  const testNewEmail = `test.farmer.${Date.now()}@agrishift.org`;
  const regResult = await authService.registerUser({
    email: testNewEmail,
    password: 'SecurePassword123',
    fullName: 'Jane Farmer',
    country: 'United States',
    district: 'Fresno',
    location: 'Fresno, California, USA',
    latitude: 36.7468,
    longitude: -119.7726,
  });

  assert(regResult.success === true, 'New user registration succeeded');
  assert(typeof regResult.otpCode === 'string' && regResult.otpCode.length === 6, '6-digit email OTP generated for new user');

  // 2D: Try to log in BEFORE OTP verification -> MUST FAIL
  let loginBeforeVerifyBlocked = false;
  try {
    await authService.loginUser(testNewEmail, 'SecurePassword123');
  } catch (err) {
    loginBeforeVerifyBlocked = err.code === 'EMAIL_NOT_VERIFIED' || err.message.includes('not verified');
  }
  assert(loginBeforeVerifyBlocked, 'Unverified new user is blocked from login until OTP verified');

  // 2E: Verify email with invalid OTP -> MUST FAIL
  let invalidOtpBlocked = false;
  try {
    authService.verifyEmailOtp(testNewEmail, '000000');
  } catch (err) {
    invalidOtpBlocked = true;
  }
  assert(invalidOtpBlocked, 'Invalid OTP code correctly rejected');

  // 2F: Verify email with correct OTP -> MUST SUCCEED
  const verifyResult = authService.verifyEmailOtp(testNewEmail, regResult.otpCode);
  assert(verifyResult.success === true, 'Email successfully verified with valid 6-digit OTP');

  // 2G: Log in now that account is verified -> MUST SUCCEED
  let verifiedLoginSuccess = false;
  try {
    const session = await authService.loginUser(testNewEmail, 'SecurePassword123');
    verifiedLoginSuccess = Boolean(session?.token && session?.user?.email === testNewEmail);
  } catch (err) {
    verifiedLoginSuccess = false;
  }
  assert(verifiedLoginSuccess, 'Verified new user successfully logs in and receives session token');

  // 2H: Password Reset Flow
  const resetReq = authService.requestPasswordReset(testNewEmail);
  assert(resetReq.success && resetReq.otpCode.length === 6, 'Password reset OTP generated');
  const resetSuccess = await authService.resetPasswordWithOtp(testNewEmail, resetReq.otpCode, 'NewStrongPassword456');
  assert(resetSuccess.success, 'Password successfully reset with OTP');

  // 2I: Verify logout
  authService.clearSession();
  assert(authService.getCurrentSession() === null, 'Logout successfully clears active session and sets session to null');

  // -------------------------------------------------------------
  // TEST 3: Worldwide Weather, Soil & Land Suitability
  // -------------------------------------------------------------
  console.log('\n--- TEST GROUP 3: Worldwide Weather, Soil & Land Suitability ---');

  const testLocations = [
    { name: 'Palakkad, Kerala, India', lat: 10.7867, lng: 76.6548, expectedZone: 'tropical' },
    { name: 'Valencia, Spain (Outside India)', lat: 39.4699, lng: -0.3763, expectedZone: 'mediterranean' },
    { name: 'Fresno, California, USA (Outside India)', lat: 36.7468, lng: -119.7726, expectedZone: 'mediterranean' },
    { name: 'Nairobi, Kenya (Outside India)', lat: -1.2921, lng: 36.8219, expectedZone: 'tropical' },
  ];

  for (const loc of testLocations) {
    console.log(`\n  * Testing location: ${loc.name} (${loc.lat}, ${loc.lng})`);
    
    // Test Live Weather
    const weather = await agroDataService.fetchLiveWeather(loc.lat, loc.lng);
    assert(
      weather.status === 'available' && weather.current?.temperature_2m != null,
      `Live weather retrieved for ${loc.name} (Temp: ${weather.current?.temperature_2m}°C, Condition: ${weather.current?.conditionLabel})`
    );

    // Test Soil Data
    const soil = await agroDataService.fetchSoilData(loc.lat, loc.lng);
    assert(
      soil.status === 'available' && soil.ph != null,
      `Soil telemetry retrieved for ${loc.name} (pH: ${soil.ph}, Texture: ${soil.texture}, Moisture: ${soil.moisture0to7cm} m³/m³)`
    );

    // Test Land Suitability Analysis
    const suitability = agroDataService.fetchLandSuitability(loc.lat, loc.lng, weather, soil, loc.name);
    assert(
      suitability.status === 'available' && suitability.suitabilityScore > 0,
      `Land suitability computed for ${loc.name} (Score: ${suitability.suitabilityScore}/100 - ${suitability.suitabilityRating})`
    );

    assert(
      Array.isArray(suitability.recommendedCrops) && suitability.recommendedCrops.length >= 4,
      `Recommended ${suitability.recommendedCrops.length} crops for ${loc.name}: ${suitability.recommendedCrops.map((c) => c.name.split(' ')[0]).join(', ')}`
    );

    assert(
      suitability.recommendedCrops.every((c) => c.reasons && c.reasons.length > 10),
      `Agronomic reasoning provided for all crops in ${loc.name}`
    );
  }

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`VERIFICATION SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
  if (passedTests === totalTests) {
    console.log('STATUS: ALL REQUIREMENTS VERIFIED AND PASSING SUCCESSFULLY!');
  } else {
    console.error(`STATUS: ${totalTests - passedTests} TESTS FAILED.`);
  }
  console.log('================================================================');
}

runTests().catch(console.error);
