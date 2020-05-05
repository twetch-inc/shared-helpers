const PostValidator = require('./post-validator');

describe('descriptionLength', () => {
    it('counts length', () => {
        const postValidator = new PostValidator({ description: 'asdf asdf ' });
        expect(postValidator.descriptionLength()).toEqual(10);
    })
    it('strips extra spaces from length', () => {
        const postValidator = new PostValidator({ description: 'asdf' + ' ' + ' ' + ' ' + 'asdf' });
        expect(postValidator.descriptionLength()).toEqual(9);
    })
});