import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
import logger from '../logCreator/log.js';
config();

const { DATABASE_URL, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const createSequelizeInstance = (url = null) => {
  if (url) {
    return new Sequelize(url, {
      dialect: 'postgres',
      logging: false,
      ssl: true,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    });
  } else {
    return new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST || 'localhost',
      port: DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
    });
  }
};

let sequelize;

try {
  console.log(`Conectado a ${DATABASE_URL}`)
  sequelize = createSequelizeInstance(DATABASE_URL);
  await sequelize.authenticate();
  console.log('Conectado a la base de datos usando DATABASE_URL.');
} catch (error) {
  logger.error('No se pudo conectar usando DATABASE_URL, intentando con configuración local...', error.message);
  console.error('No se pudo conectar usando DATABASE_URL, intentando con configuración local...', error.message);
  try {
    sequelize = createSequelizeInstance();
    await sequelize.authenticate();  
    logger.info('Conectado a la base de datos local.');
    console.log('Conectado a la base de datos local.');
  } catch (localError) {
    logger.error('No se pudo conectar a la base de datos local.', localError.message);
    console.error('No se pudo conectar a la base de datos local.', localError.message);
    process.exit(1);  
  }
}

export default sequelize;
