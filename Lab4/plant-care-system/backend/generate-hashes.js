const bcrypt = require('bcryptjs');

async function generateHashes() {
  const passwords = {
    admin: 'admin123',
    user1: 'password123',
    user2: 'password456', 
    user3: 'password789'
  };

  console.log('Generating password hashes...\n');
  
  for (const [user, password] of Object.entries(passwords)) {
    const hash = await bcrypt.hash(password, 10);
    console.log(`${user}:`);
    console.log(`  Password: ${password}`);
    console.log(`  Hash: ${hash}\n`);
  }
}

generateHashes();