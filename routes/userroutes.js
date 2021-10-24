
//importing user services 
const userServices = require('../services/userservice/userservice');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

//swagger options
const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Luxoft Assignment',
        version: '1.0.0',
      },
      servers:[{
           url:'http://localhost:6500/'
      }]
    },
    apis: ['./routes/userroutes.js'], // api routes
  };

//user apis
exports.routes = function(app){
    const swaggerSpec = swaggerJsdoc(options);
          app.use('/api-docs' , swaggerUi.serve,swaggerUi.setup(swaggerSpec));
    app.use(function timeLog(req, res, next) {
        try {
            let skipUrls = {"/":true,"/userlogin":true ,"/logout":true,"/api-docs/":true,"/api-docs/swagger-ui-init.js":true,"/api-docs/swagger-ui.css":true,
        "/api-docs/swagger-ui-standalone-preset.js":true,"/api-docs/swagger-ui-bundle.js":true,"/api-docs/swagger-ui-standalone-preset.js":true,
        "/api-docs/swagger-ui-init.js":true,"/api-docs/favicon-32x32.png":true,"/api-docs/favicon-16x16.png":true};
            if (skipUrls[req.url]) return next();
            let bearerHeader = req.headers["authorization"];
            let bearer = bearerHeader.split(" ");
            let bearerToken = bearer[1];
            if (req.session.userToken === bearerToken) {
                next();
            } else {
                res.status(401).send({ success: false, message: 'Failed to authenticate token.' });
            }
        } catch(err) {
            res.status(401).send({ success: false, message: 'Failed to authenticate token.' });
        }
    });

//login user schema swigger api

/**
 * @openapi
 *  components:
 *      schemas:
 *          login:
 *              type: object
 *              required:
 *                  - email
 *                  - password      
 *              example:
 *                  email: John@123.com
 *                  password: 1234
*/

//login user swigger api

/**
 * @openapi
 * /userlogin:
 *  post:
 *      summary: check user is exits or not in db.
 *      description: This api is used to check whether the user exits in the db or not.
 *      requestBody: 
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/login'
 *      responses:
 *          200:
 *            description: login success.
 *          401:
 *            description: Failed to authenticate token.
 *          500:
 *            description: Failed to process request.
 */

  app.post('/userlogin',userServices.userLogin);


//schema for get users apis

/**
 * @openapi
 *  components:
 *      schema:
 *          users:
 *              type: object
 *              properties:
 *                  user_name:
 *                              type: string
 *                  user_role:
 *                               type: string
 *                  user_email:
 *                                type: string                                  
*/

//get all users swigger api

/**
 * @openapi
 * /getusers:
 *   get:
 *     summary: This api is used to get the list of users.
 *     description: This api is used check if get method working or not.
 *     responses:
 *       200:
 *         description: Returns a list of available users.
 *         content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#components/schema/users'
 *      401:
 *        description: Failed to authenticate token.
 *      500:
 *        description: Failed to process request.
 */

 app.get('/getallusers',userServices.getAllUsersData);

//get single user  swigger api

    /**
 * @openapi
 * /getusers/{userId}:
 *   get:
 *     summary: This api is used to get the single user data.
 *     description: This api is used check if get method working or not.
 *     parameters:
 *          - in: path
 *            name: userId
 *            required: true
 *            description: user id is required
 *            schema:
 *              type: integer
 *     responses:
 *       200:
 *         description: Returns a single user data. 
 *         content:
 *              application/json:
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#components/schema/users'
 *      401:
 *        description: Failed to authenticate token.
 *      500:
 *        description: Failed to process request.
 */
    app.get('/getusers/:userId',userServices.getUserData);
    app.post('/logout', function (req, res) {
        try {
            if (req.session) {
                req.session.destroy();
            }
            res.json({ success: true, message: 'Logged out successfully' });
        } catch (e) {
            res.status(421).send({ message: 'Failed to process request' });
        }
    });
}