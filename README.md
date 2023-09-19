# stackjourneyjs
## Time to Master JavaScript? Let's learn together.
What is StackJourney
StackJourney is a web application designed to allow users to upload concepts they would like to review later and be quizzed on. StackJourney is built with node.js, express.js, and SheetDB and uses bcrypt and JSON web tokens to manage registration and authentication. Flash is used to communicate error handling. 

### Signing up
Users can visit the registration page and enter an email, password, and confirmation password. The password is then hashed with a salt using bcrypt and stored on Google Sheets using SheetDB. 
Logging in
The email and hash of the password entered are checked against the ones in the Google Sheets. A JWT is stored as a session in the client web browser upon finding a match. The JWT expires after 1 hour. Users must be logged in to upload a concept or view their dashboard. 
### Logging Out
Accessing the logout route will remove the token from the browser, requiring users to log in again. 
### Uploading Concepts
The concepts page contains a form prompting the user to provide a question, four options, which option is the correct answer and a text area where they can make notes on the concept. If the question ends with a question mark, it is trimmed to remove that last character, as the question mark has unintended consequences once passed into the parameters of the HTTP request. 
### Dashboard
Loading the dashboard first checks if the user is authenticated. It then calculates the user's total score and correctness if there is data in the database (if the user has answered questions). A random question is generated, options are populated, and these are rendered to the client. 
### Quiz
After submitting a quiz, the answer is checked against the solution stored in the database. The total score, last score, and count of answered questions are then calculated and sent to the Google Sheet as an update.
Review and Updating Concepts
The study container of the dashboard only shows the user's question. Clicking on the review button triggers changes to the DOM, allowing users to see the concepts. The option to edit and delete the questions will change the question on the sheet and affect the user's score. 

## How to run this application
 * Use this current version to check it out. View the deployed heroku site [here](https://stackjourneyjs-5cb7b83591cd.herokuapp.com/)
* Create your own version. Fork this project and `npm install` the requirements. Visit [Sheet DB](https://sheetdb.io/) to set up your own API. Create a users tab and a questions tab. In the questions tab, ensure your columns are: username, password. In your questions tab, enter the following columns: username, category, difficulty, public, lastScore	totalScore, question, option1, option2, option3, option4, correctAnswer, answered, weighting, notes. Add your env variables for your sheet API and your SESSION_SECRET.																														 

## Photo Credits
* Photo by Alina Autumn [from Pexels:](https://www.pexels.com/photo/goats-on-a-grass-field-11512740/)
* Photo by Alina Autumn [from Pexels:](https://www.pexels.com/photo/goats-on-a-grass-field-11512740/)
* Photo by GEORGE DESIPRIS [from Pexels:](https://www.pexels.com/photo/big-waves-under-cloudy-sky-753619/)
* Photo by Jeremy Perkins [from Pexels:](https://www.pexels.com/photo/round-glass-ball-reflecting-man-standing-395612/)

## Future Considerations
* Add Error handling for duplicate email addresses. Emails are not verified before being entered into the database. Anyone wanting to test the project could run into a bug where duplicate emails are added to the Google Sheets. An improvement would be to check if an email exists in the sheets before adding them. 
* Currently, the user's score is based on the data in Google Sheets; a better implementation would be to store a lifetime score with the user's profile in the user's sheet. 
* Updating the logic to allow for concepts to have multiple correct answers or to ensure only one checkbox is selected. Currently, users can select multiple checkboxes, and if that selection includes the correct answer, the score will be updated to reflect a correct answer. 
* Difficulty and categories are recorded when the user adds a concept. With additional logic, this should allow users to filter their quizzes when they want more practice with a particular topic. 
* The last score and count of the number of times a question has been answered have been built in with the intention of creating a weighted algorithm that changes the probability of a question being asked to the user and allows for spaced-repetition learning. 