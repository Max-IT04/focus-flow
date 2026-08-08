require('dotenv').config();
const connectDB = require('./src/config/database');

async function test() {
  try {
    console.log('🔄 Подключение к MongoDB...');
    await connectDB();
    console.log('✅ Подключение успешно!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    process.exit(1);
  }
}

test();
