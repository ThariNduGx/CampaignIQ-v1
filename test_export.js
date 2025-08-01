// Test script to check what data is being exported
const { generateReportData } = require('./server/services/reports');

async function testExport() {
  try {
    console.log('Testing report data generation...');
    
    const workspaceId = '2925fcce-c340-4034-a420-8dd20c547683';
    const startDate = '2025-07-02';
    const endDate = '2025-08-01';
    
    const reportData = await generateReportData(workspaceId, startDate, endDate);
    
    console.log('\n=== REPORT DATA ANALYSIS ===');
    console.log('Summary:', JSON.stringify(reportData.summary, null, 2));
    console.log('\nGoogle Analytics:', JSON.stringify(reportData.platforms.google.analytics, null, 2));
    console.log('\nGoogle Search Console:', JSON.stringify(reportData.platforms.google.searchConsole, null, 2));
    console.log('\nMeta Data:', JSON.stringify(reportData.platforms.meta, null, 2));
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testExport();