require('dotenv').config();

// Init app
const express = require('express');
const app = express();

// Init and config database
const knexConfig = require('./controllers/database/knexConfig');
const knex = require('knex')(knexConfig.deverlopment);
const { Model } = require('objection');
Model.knex(knex);

// Import routers
const employeeRouter = require('./routers/employees');
const customerRouter = require('./routers/customers');
const userRouter = require('./routers/users');

// Error handlers
const { errors } = require('celebrate');
const { ErrorHandler } = require('./controllers/middlewares/errorHandler/errorHandler');

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/employees', employeeRouter);
app.use('/customers', customerRouter);
app.use('/users', userRouter);

// Error handlers
app.use(errors());
app.use(ErrorHandler);

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is listening on port 3000');
});
