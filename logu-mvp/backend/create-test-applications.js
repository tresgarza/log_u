require('dotenv').config();
const { Client } = require('pg');

async function createTestApplications() {
  console.log('Creating test campaign applications...');
  
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

    // Get the influencer user id
    const influencerResult = await client.query(
      `SELECT id FROM users WHERE email = 'influencer@logu-test.com'`
    );
    
    if (influencerResult.rows.length === 0) {
      throw new Error('Influencer user not found. Please run create-test-users.js first.');
    }
    
    const influencerId = influencerResult.rows[0].id;
    
    // Get active campaigns
    const campaignsResult = await client.query(
      `SELECT id, name FROM campaigns WHERE status = 'active'`
    );
    
    if (campaignsResult.rows.length === 0) {
      throw new Error('No active campaigns found. Please run create-test-campaigns.js first.');
    }
    
    // Create applications for each active campaign
    for (const campaign of campaignsResult.rows) {
      // Create one application with a different status for each campaign
      let status;
      
      if (campaign.id % 3 === 0) {
        status = 'approved';
      } else if (campaign.id % 3 === 1) {
        status = 'pending';
      } else {
        status = 'completed';
      }
      
      const message = `I'm excited to apply for the "${campaign.name}" campaign! I have experience creating content in this niche and my audience would love your products.`;
      const compensation = (1000 + (campaign.id * 250)).toFixed(2);
      
      const result = await client.query(
        `INSERT INTO campaign_applications (
          "campaignId", "influencerId", status, message, compensation, 
          "brandFeedback", "influencerRating", "brandRating", "createdAt", "updatedAt"
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()) 
        RETURNING id`,
        [
          campaign.id, 
          influencerId, 
          status, 
          message, 
          compensation,
          status === 'completed' ? 'Great work! We loved the content you created.' : null,
          status === 'completed' ? 5 : null,
          status === 'completed' ? 4 : null
        ]
      );
      
      console.log(`Application created for campaign: ${campaign.name} (Status: ${status}, ID: ${result.rows[0].id})`);
    }
    
    console.log('Test applications created successfully');
    
  } catch (error) {
    console.error('Error creating test applications:', error);
  } finally {
    await client.end();
  }
}

createTestApplications(); 