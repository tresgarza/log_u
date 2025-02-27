require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

async function createTestUsers() {
  console.log('Creating users...');
  
  const pool = new Pool({
    user: process.env.DB_USER || 'diegogg98',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'logu_dev',
    password: process.env.DB_PASSWORD || '',
    port: parseInt(process.env.DB_PORT || '5432'),
  });

  try {
    // Hash passwords - usando una contraseña simple para pruebas
    const saltRounds = 10;
    const defaultPassword = await bcrypt.hash('password123', saltRounds);
    
    // Format current timestamp for Postgres
    const now = new Date().toISOString();
    
    // Influencers data
    const influencers = [
      {
        name: 'Diego Garza',
        email: 'diegogg98@hotmail.com',
        phone: '8116364522',
        bio: 'Tech enthusiast and digital creator',
        socialMedia: JSON.stringify({
          instagram: '@diegogarza',
          twitter: '@diegogg98'
        })
      },
      {
        name: 'Mariana Rodriguez',
        email: 'diegoagarza98@gmail.com',
        phone: '8110661099',
        bio: 'Lifestyle and fashion content creator',
        socialMedia: JSON.stringify({
          instagram: '@marianar',
          tiktok: '@marianarodriguez'
        })
      },
      {
        name: 'Marco Polo',
        email: 'diego.garza@dgmxtech.com',
        phone: '8182802837',
        bio: 'Travel and adventure content creator',
        socialMedia: JSON.stringify({
          instagram: '@marcopolo',
          youtube: '@MarcoPoloTravel'
        })
      }
    ];

    // Brands data
    const brands = [
      {
        name: 'DGMX Tech',
        email: 'jos.villap@dgmxtech.com',
        phone: '8183030149',
        bio: 'Innovative technology solutions provider',
        website: 'https://dgmxtech.com'
      },
      {
        name: 'TORS',
        email: 'pablo@tors.com',
        phone: '8183269421',
        bio: 'Premium lifestyle brand',
        website: 'https://tors.com'
      },
      {
        name: 'FINCENTIVA',
        email: 'digital@fincentiva.com.mx',
        phone: '8110991022',
        bio: 'Financial technology solutions',
        website: 'https://fincentiva.com.mx'
      }
    ];
    
    // Create influencers
    for (const influencer of influencers) {
      const influencerQuery = `
        INSERT INTO users (
          name, email, password, type, status, "emailVerified", phone, bio, 
          "socialMedia", "createdAt", "updatedAt"
        )
        VALUES ($1, $2, $3, 'influencer', 'active', true, $4, $5, $6, $7, $7)
        ON CONFLICT (email) 
        DO UPDATE SET 
          name = $1,
          password = $3,
          status = 'active',
          phone = $4,
          bio = $5,
          "socialMedia" = $6,
          "updatedAt" = $7
        RETURNING id, email, type;
      `;
      
      const influencerResult = await pool.query(influencerQuery, [
        influencer.name,
        influencer.email,
        defaultPassword,
        influencer.phone,
        influencer.bio,
        influencer.socialMedia,
        now
      ]);
      console.log('Influencer created/updated:', influencerResult.rows[0]);
    }
    
    // Create brands
    for (const brand of brands) {
      const brandQuery = `
        INSERT INTO users (
          name, email, password, type, status, "emailVerified", phone, bio, 
          website, "createdAt", "updatedAt"
        )
        VALUES ($1, $2, $3, 'brand', 'active', true, $4, $5, $6, $7, $7)
        ON CONFLICT (email) 
        DO UPDATE SET 
          name = $1,
          password = $3,
          status = 'active',
          phone = $4,
          bio = $5,
          website = $6,
          "updatedAt" = $7
        RETURNING id, email, type;
      `;
      
      const brandResult = await pool.query(brandQuery, [
        brand.name,
        brand.email,
        defaultPassword,
        brand.phone,
        brand.bio,
        brand.website,
        now
      ]);
      console.log('Brand created/updated:', brandResult.rows[0]);
    }
    
    console.log('\nUsers created successfully');
    console.log('------------------------------');
    console.log('All users created with password: password123');
    console.log('------------------------------');
    
  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    await pool.end();
  }
}

createTestUsers(); 