/**
 * Dependency Verification Script
 * Verifies all required dependencies are installed
 */

const fs = require('fs');
const path = require('path');

const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
const nodeModulesPath = path.join(__dirname, '../node_modules');

const allDependencies = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

const missing = [];
const installed = [];

console.log('\n🔍 Verifying Dependencies...\n');

Object.keys(allDependencies).forEach(dep => {
  const depPath = path.join(nodeModulesPath, dep);
  if (fs.existsSync(depPath)) {
    installed.push(dep);
    console.log(`✅ ${dep}`);
  } else {
    missing.push(dep);
    console.log(`❌ ${dep} - MISSING`);
  }
});

console.log('\n📊 Summary:\n');
console.log(`Total Dependencies: ${Object.keys(allDependencies).length}`);
console.log(`✅ Installed: ${installed.length}`);
console.log(`❌ Missing: ${missing.length}`);

if (missing.length > 0) {
  console.log('\n⚠️  Missing Dependencies:');
  missing.forEach(dep => {
    console.log(`   - ${dep}`);
  });
  console.log('\n💡 Run: npm install\n');
  process.exit(1);
} else {
  console.log('\n✅ All dependencies are installed!\n');
  process.exit(0);
}

