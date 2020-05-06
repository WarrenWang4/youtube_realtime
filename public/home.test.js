/* 
To run the unit test do "npm install --save-dev jest" and "npm run test" afterwards.
We will have to also uncomment out all the DOM manuplation and structures code (Stated where to uncomment on home.js).
After doing project 3 we learn that the hardest part of unit testing in JavaScript isn't the testing,
but it is learning how to properly structure and architect our code such that it is easily testable for future projects!
*/

const { isYoutube, CheckPassword } = require('./home')

test('Tesiting if given link is not a Youtube link', () => {
    expect(isYoutube("https://www.google.com/")).toBe(false)
})

test('Tesiting if given link is not a Youtube link', () => {
    expect(isYoutube("https://www.youtube.com/watch?v=Tw1hzpn4zC8")).toBe("Tw1hzpn4zC8")
})

test('Testing to see if password is not a valid password', () => {
    expect(CheckPassword("a")).toBe(false)
})

test('Testing to see if password is a valid password', () => {
    expect(CheckPassword("Password123!")).toBe(true)
})



