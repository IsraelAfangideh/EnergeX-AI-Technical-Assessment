# EnergeX-AI
Full Stack Technical Assessment given by Energex to Thompson Technology. 

Instructions here: https://github.com/energexai/EnergeX-AI-Hiring-Test

## Technical Priorities By Section:

#### Lumen API Code:
1. Security
2. Readability: Since this layer will have most of the logic it should be organized in a way that feels instinctive to people reading it for the first time. It should be formatted to follow MVC principles and the reader should instinctively understand how to go from one layer to the other and how the layers fit together.

#### Node.js API Code:

I don't think this layer will have too much code, should be pretty light, lets keep it that way

#### MySQL Database Structure:
1. Should be easy to change later
2. Should be easy to pull from for analysis
3. Should be normalized
4. Should have database structure that makes sense

#### Vuejs Client Code:
1. Should use Typescript so that we have type safety
2. Should be beautiful
3. Should be e2e tested. We can use cypress for this, and set up github actions to run it

#### JEST/PHPUnit for Integration testing
Only one goal here, be exhaustive. Test success cases AND failure cases. Assert exact json. Leave no test case unturned. Make the application unbreakable.

#### Docker
Make the app easy to restart and duplicate

#### CI/CD 
Set up github actions to automatically run our tests
