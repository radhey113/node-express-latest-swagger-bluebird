const swaggerJson = {
    "swagger": "2.0",
    "info": {
        "version": "1.0.0",
        "title": "Swagger Example",
        "description": "A sample API",
        "termsOfService": "http://swagger.io/terms/",
        "contact": {
            "name": "Swagger API Team"
        },
        "license": {
            "name": "MIT"
        }
    },
    "paths": {},
    "definitions": {},
    "host": "localhost:3000",
    "basePath": "/",
    "schemes": [
        "http",
        "https"
    ],
    "consumes": [
        "application/json"
    ],
    "produces": [
        "application/json"
    ]
};

exports.get = swaggerJson;

