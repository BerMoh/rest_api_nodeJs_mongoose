const expect = require('chai').expect;
const authMiddlware = require('../middleware/is-auth');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

describe('Auth middleware', function() {
    it('should throw an error if no authorization header is present', function() {
        const req = {
            get : function() {
                return null;
            }
        };
        expect(authMiddlware.bind(this,req,{},()=> {})).to.throw('Not authenticated.');
    });
    
    
    it('should throw an error if authorization header is only one string', function() {
        const req = {
            get : function(headerName) {
                return 'token_value';
            }
        };
        expect(authMiddlware.bind(this,req,{},()=> {})).to.throw();
    });

    it('should yield a userId after decoding the token', function() {
        const req = {
            get : function(headerName) {
                return 'Bearer token_value';
            }
        };
        
        sinon.stub(jwt, 'verify');

        jwt.verify.returns({ userId: 'abc' });

        authMiddlware(req, {}, () => {});

        expect(req).to.have.property('userId');

        jwt.verify.restore();
    });

    it('should throw an error if the token cannot be verified', function() {
        const req = {
            get : function(headerName) {
                return 'Bearer token_value';
            }
        };
        expect(authMiddlware.bind(this,req,{},()=> {})).to.throw();
    });   

})
