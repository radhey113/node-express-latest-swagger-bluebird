`use strict`;

var expect = require(`chai`).expect;
var request = require(`request`);

it(`Main page content`, (done) => {
    request('http://localhost:2201', (error, response, body) => {
        expect('Hello World').to.equal('Hello World');
        done();
    });
});
