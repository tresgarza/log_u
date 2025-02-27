require('dotenv').config();
const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

async function createTestQRCodes() {
  console.log('Creating test QR codes...');
  
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Get approved applications
    const applicationsResult = await client.query(
      `SELECT ca.id, ca."campaignId", ca."influencerId", c.name as "campaignName"
       FROM campaign_applications ca
       JOIN campaigns c ON ca."campaignId" = c.id
       WHERE ca.status = 'approved' OR ca.status = 'completed'`
    );
    
    if (applicationsResult.rows.length === 0) {
      throw new Error('No approved applications found. Please run create-test-applications.js first.');
    }
    
    // Create QR codes for each approved application
    for (const application of applicationsResult.rows) {
      // Create 3 QR codes for each application with different statuses
      const statuses = ['active', 'used', 'active'];
      const redemptionValues = [100, 150, 200];
      
      for (let i = 0; i < 3; i++) {
        const code = uuidv4().substring(0, 8).toUpperCase();
        const status = statuses[i];
        const now = new Date();
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 3); // Expire in 3 months
        const usedAt = status === 'used' ? now : null;
        const redemptionValue = redemptionValues[i];
        
        const result = await client.query(
          `INSERT INTO qr_codes (
            id, code, "campaignId", "influencerId", status, "usedAt", "expiresAt", 
            "redemptionValue", metadata, "createdAt", "updatedAt"
          ) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW()) 
          RETURNING id, code`,
          [
            uuidv4(), 
            code, 
            application.campaignId, 
            application.influencerId, 
            status, 
            usedAt, 
            expiresAt,
            redemptionValue,
            JSON.stringify({
              applicationId: application.id,
              notes: `Test QR code for campaign: ${application.campaignName}`,
              generatedBy: 'test-script'
            })
          ]
        );
        
        console.log(`QR Code created: ${result.rows[0].code} (Status: ${status}, ID: ${result.rows[0].id})`);
      }
    }
    
    console.log('Test QR codes created successfully');
    
  } catch (error) {
    console.error('Error creating test QR codes:', error);
  } finally {
    await client.end();
  }
}

createTestQRCodes(); 