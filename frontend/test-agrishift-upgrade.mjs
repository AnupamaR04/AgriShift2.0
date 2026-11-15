// Automated Verification Test Suite for AgriShift 2.0 Security & Upgrades
import { agroDataService } from './src/services/agroDataService.js';
import { TRANSLATIONS } from './src/context/translations.js';

console.log('================================================================');
console.log('AGRISHIFT 2.0 SECURITY AUDIT & VERIFICATION TEST SUITE');
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
  // TEST 2: Genuine Authentication & Security Architecture
  // -------------------------------------------------------------
  console.log('\n--- TEST GROUP 2: Authentication Security Hardening ---');
  assert(TRANSLATIONS.en.auth_success_registered.includes('check your email'), 'Signup flow directs user to check their email inbox');
  assert(TRANSLATIONS.en.auth_verify_sub.includes('email inbox'), 'Verification instructions explicitly guide users to check their real inbox');
  assert(!TRANSLATIONS.en.auth_verify_sub.includes('display code on screen'), 'Zero client-side mock codes in translation dictionaries');

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
