<div align="center">

# PAPERCUT PALS

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Apollo-GraphQL](https://img.shields.io/badge/-ApolloGraphQL-311C87?style=for-the-badge&logo=apollo-graphql)
![Chakra](https://img.shields.io/badge/chakra-%234ED1C5.svg?style=for-the-badge&logo=chakraui&logoColor=white)
![JavaScript Badge](https://img.shields.io/badge/js-F7DF1E?logo=javascript&logoColor=000&style=flat)
![JSON Badge](https://img.shields.io/badge/json-FF0000?logo=json&logoColor=fff&style=flat)
![npm Badge](https://img.shields.io/badge/npm-A020F0?logo=npm&logoColor=fff&style=flat)
![Node.JS Badge](https://img.shields.io/badge/node-orange?logo=node.js&logoColor=fff&style=flat)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![CSS3 Badge](https://img.shields.io/badge/css-1572B6?logo=css3&logoColor=fff&style=flat)
![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-darkgreen.svg)](https://opensource.org/licenses/MIT)

</div>

## Description

PAPERCUT PALS is a MERN Stack Single-Page Application that brings book lovers together in a virtual book club environment. It offers personalized book suggestions based on user preferences and provides a platform for literary discussion and discovery.

## Table of Contents

- [Description](#description)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [Credits](#credits)
- [License](#license)

## User Story

```md
AS A book lover
I WANT to explore new books, save my favorites, and express my opinions through comments
SO THAT I can track books I plan to read or buy and engage in discussions about them.
```

## Acceptance Criteria

```md
GIVEN a platform to discover and discuss books
WHEN I load the platform
THEN I am presented with a Signup page, with options to create an account or log in if I already have one.
WHEN I am on the Signup page
THEN a form is presented, giving me the option to either sign up or log in
WHEN I select the Signup option
THEN I am presented with input fields for a username, email address, password, and a signup button
WHEN I select the Login option
THEN I am presented with input fields for an email address, password, and a login button
WHEN I enter a valid email address, create a password, and click the signup button
THEN my user account is created, and I am automatically logged in
WHEN I enter my existing account’s email address and password and click the login button
THEN I am logged in to the platform.
WHEN I am logged in to the site
THEN I am taken to a homepage that presents the Books of the Month, and the navigation bar updates to include options to view the Library, My Favorites, an About page with information about the developers, and an avatar icon.
WHEN I click on the avatar icon
THEN I am presented with options to access my profile information and log out.
WHEN I click on the Library menu option
THEN I am presented with the platform's library of books and can search for specific titles using the search bar.
WHEN I enter a search term in the search bar and click the search button
THEN I am presented with several search results displayed as cards, each showing the book’s title, author, and book cover.
WHEN I click on the View Details button on a book
THEN I am taken to a page that displays the book’s full description, publishing date, category, and provides options to favorite the book and leave comments.
WHEN I click the Heart icon on a book
THEN that book is added to my Favorites page.
WHEN I click on the option to view my Favorites
THEN I am presented with a list of all the books I have favorited, each showing the book’s title, author, description, image, and a button to unheart and remove it from my favorites.
WHEN I click the Unheart button on a book
THEN that book is removed from my Favorites list.
WHEN I click on the Logout button
THEN I am logged out of the site and redirected to the Signup page, where I am presented with options to either sign up or log in.
```

## Technologies

- **Backend:** Node.js, Express.js, GraphQL
- **Database:** MongoDB, Mongoose ODM
- **Frontend:** React, CSS(for Polished UI and Responsiveness)
- **Authentication:** JSON Web Tokens (JWT)
- **Utilities:** Apollo Server (for GraphQL integration), Apollo Client (for GraphQL on the frontend )
- **Deployment:** Render
- **Version Control:** Git

## Installation

#### To install PAPERCUT PALS:

- Clone the repository: `https://github.com/girlnotfound/PAPERCUT-PALS`

- Navigate to the project directory

- Open the terminal and install the dependencies by running the command: `npm install`

## Usage
#### To use PAPERCUT PALS:
Start the application:
- In the terminal, run the command: `npm run develop`
- This will start both the server and the client concurrently
#### Access the application:
- Open your web browser and navigate to: `http://localhost:3000/`
#### Sign Up or Log In:
- If you're a new user, click on the "Sign Up" option and create an account
- Existing users can log in using their credentials
#### Explore the Homepage:
- Browse the featured "Books of the Month"
- Use the navigation bar to access different sections of the app
#### Discover Books:
-Click on "Library" in the navigation bar
- Use the search bar to find books by title, author, or genre
- Click on book cards to view more details
#### Interact with Books:
On a book's detail page, you can:
- Read the full description
- Add the book to your favorites by clicking the heart icon
- Leave comments and engage in discussions
#### Manage Your Favorites:
- Access your favorited books by clicking "My Favorites" in the navigation bar
- Remove books from your favorites by clicking the unheart button
#### Profile Management:
- Click on your avatar icon to access profile settings or log out
About Page:
- Learn more about the developers and the project by visiting the About page
#### To use PaperClip AI Assistant:
- Ensure you are logged in to access the PaperClip interface.
- Type your question or comment in the input field at the bottom of the screen.
- Click the "Get Response" button or press Enter to submit your query.
- Wait for Sir PaperClip to generate and display a response.

## Features
#### Book Discovery
- Books of the Month: Curated selection of featured books on the homepage
- Library: Extensive collection of books searchable by title, author, or genre
- Search Functionality: Robust search feature with results displayed as book cards
#### Book Details
- Title and author
- Cover image
- Synopsis
- Publishing date
- Genre
##### "View Details" option for each book to access full information
#### User Authentication
- Secure signup and login functionality
- User profile management with avatar customization
#### Personalization
- Favorites: Ability to mark books as favorites with a heart icon
- My Favorites Page: Dedicated page to view and manage favorited books
- Option to remove books from favorites by unhearting same heart icon.
#### Community Engagement
- Comment system allowing users to share thoughts and discuss books
- User-friendly interface for leaving and viewing comments on book detail pages
#### PaperClip AI Assistant
PaperClip is an AI-powered chatbot integrated into the PaperCut Pals book search web app. This feature enhances user experience by providing:
- Personalized book recommendations based on user's favorite books
- Instant responses to book-related queries
- Conversational interface for engaging discussions about literature
- Access to a vast knowledge base of books and authors
- Real-time, context-aware interactions tailored to each user

PaperClip utilizes advanced natural language processing to deliver accurate and relevant information, making it an invaluable tool for book enthusiasts and casual readers alike.
#### Responsive Design
- Polished UI that adapts to various screen sizes for optimal viewing on different devices
#### Navigation
- Intuitive navigation bar with options for Library, My Favorites, and About page
- User avatar menu for quick access to profile settings and logout option
#### Data Persistence
- User data, favorites, and comments are securely stored and persist across sessions

## Contributing

Contributions to PAPERCUT PALS are welcome! Here’s how you can contribute:

1. **Fork the repository** on GitHub.
2. **Create a branch** for your feature `git checkout -b new-feature`.
3. **Make changes** and commit them `git commit -m "Add some feature"`.
4. **Push to the branch** `git push origin new-feature`.
5. **Create a new Pull Request** against the main.

Please ensure your code adheres to the existing style of the project to make your changes easy to understand and integrate!

## Credits

**Frontend:** [Justin Herrera](https://github.com/Justino11247), [Kaila Ronquillo](https://github.com/girlnotfound), [Ryan Petersen](https://github.com/RyanPetersen-89)

**Backend:** [Adam Rosenberg](https://github.com/AcoderRose), [Renz Carl Supnet](https://github.com/renzsupnet)

Special thanks to Anthony Barragan, Erik Hirsch...

## License

PAPERCUT PALS is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute this application according to the terms of the license.
