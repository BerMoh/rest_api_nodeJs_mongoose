const expect = require('chai').expect;

describe('Quick start with test ', function() {
    it('should add numbers correctly', function() {
        const num1 = 2;
        const num2 = 3;
        expect(num1+num2).to.equal(5);
    });
    
    it('should not give a result of 6', function() {
        const num1 = 3;
        const num2 = 3;
        expect(num1+num2).to.equal(6);
    });
})