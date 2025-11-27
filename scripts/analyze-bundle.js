/**
 * Bundle Analysis Script
 * Analyzes React Native bundle size
 */

const fs = require('fs');
const path = require('path');

function analyzeBundle() {
  const bundlePath = process.argv[2] || '/tmp/bundle.js';
  const mapPath = process.argv[3] || '/tmp/bundle.map';

  if (!fs.existsSync(bundlePath)) {
    console.error('Bundle file not found. Run: npm run bundle:analyze');
    process.exit(1);
  }

  const bundleContent = fs.readFileSync(bundlePath, 'utf8');
  const bundleSize = Buffer.byteLength(bundleContent, 'utf8');
  const bundleSizeKB = (bundleSize / 1024).toFixed(2);
  const bundleSizeMB = (bundleSize / (1024 * 1024)).toFixed(2);

  console.log('\n📦 Bundle Analysis\n');
  console.log(`Total Size: ${bundleSizeKB} KB (${bundleSizeMB} MB)`);
  console.log(`Lines of Code: ${bundleContent.split('\n').length}`);

  // Analyze imports
  const importRegex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
  const imports = [];
  let match;

  while ((match = importRegex.exec(bundleContent)) !== null) {
    imports.push(match[1]);
  }

  // Count imports by package
  const packageCounts = {};
  imports.forEach(imp => {
    const packageName = imp.split('/')[0];
    packageCounts[packageName] = (packageCounts[packageName] || 0) + 1;
  });

  console.log('\n📚 Top Imported Packages:\n');
  Object.entries(packageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .forEach(([pkg, count]) => {
      console.log(`  ${pkg}: ${count} imports`);
    });

  // Recommendations
  console.log('\n💡 Recommendations:\n');
  
  if (bundleSize > 2 * 1024 * 1024) {
    console.log('  ⚠️  Bundle size is large (>2MB). Consider:');
    console.log('     - Code splitting');
    console.log('     - Lazy loading screens');
    console.log('     - Removing unused dependencies');
  }

  if (Object.keys(packageCounts).length > 50) {
    console.log('  ⚠️  Many dependencies detected. Consider:');
    console.log('     - Tree shaking unused code');
    console.log('     - Using lighter alternatives');
  }

  console.log('\n');
}

analyzeBundle();

