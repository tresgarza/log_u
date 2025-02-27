require('dotenv').config();
const { Client } = require('pg');

async function createTestCampaigns() {
  console.log('Creating test campaigns...');
  
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

    // Get the brand user id
    const brandResult = await client.query(
      `SELECT id FROM users WHERE email = 'brand@logu-test.com'`
    );
    
    if (brandResult.rows.length === 0) {
      throw new Error('Brand user not found. Please run create-test-users.js first.');
    }
    
    const brandId = brandResult.rows[0].id;
    
    // Create test campaigns
    const campaigns = [
      {
        name: 'Summer Product Launch',
        description: 'Promote our new summer collection with creative content highlighting product features and benefits.',
        startDate: new Date(2024, 5, 1), // June 1, 2024
        endDate: new Date(2024, 7, 31), // August 31, 2024
        budget: 5000.00,
        status: 'active',
        brandId,
        objective: 'Increase product awareness and drive sales for the summer collection.',
        targetAudience: 'Young adults 18-35 interested in fashion and lifestyle.',
        requirements: 'Post at least 3 photos with our products on Instagram. Use provided hashtags.'
      },
      {
        name: 'Holiday Special Campaign',
        description: 'Create festive content featuring our products as perfect holiday gifts.',
        startDate: new Date(2024, 10, 1), // November 1, 2024
        endDate: new Date(2024, 11, 25), // December 25, 2024
        budget: 8000.00,
        status: 'draft',
        brandId,
        objective: 'Drive holiday season sales and position products as ideal gifts.',
        targetAudience: 'Gift shoppers across all demographics with focus on luxury and quality.',
        requirements: 'Create 2 Instagram posts and 1 video (30-60s) featuring our products.'
      },
      {
        name: 'Brand Awareness Campaign',
        description: 'Help establish our brand identity with authentic content that resonates with your audience.',
        startDate: new Date(2024, 3, 1), // April 1, 2024
        endDate: new Date(2024, 8, 30), // September 30, 2024
        budget: 12000.00,
        status: 'active',
        brandId,
        objective: 'Increase brand awareness and followers across social platforms.',
        targetAudience: 'Diverse audience with focus on lifestyle, wellness, and sustainability interests.',
        requirements: 'Monthly content (1 post + 1 story) for 6 months featuring brand messaging.'
      }
    ];
    
    for (const campaign of campaigns) {
      const result = await client.query(
        `INSERT INTO campaigns (
          name, description, "startDate", "endDate", budget, status, 
          "brandId", objective, "targetAudience", requirements, "createdAt", "updatedAt"
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) 
        RETURNING id, name`,
        [
          campaign.name, campaign.description, campaign.startDate, campaign.endDate, 
          campaign.budget, campaign.status, campaign.brandId, campaign.objective, 
          campaign.targetAudience, campaign.requirements
        ]
      );
      
      console.log(`Campaign created: ${result.rows[0].name} (ID: ${result.rows[0].id})`);
    }
    
    console.log('Test campaigns created successfully');
    
  } catch (error) {
    console.error('Error creating test campaigns:', error);
  } finally {
    await client.end();
  }
}

createTestCampaigns(); 