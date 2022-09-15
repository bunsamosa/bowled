# Bowled

Bowled is a strategy-based game where a user becomes the manager of a T20 cricket team.

On joining the game, the user will be placed in one of the leagues in the game with other players or with bots.
The goal of the user is to win matches by managing finances and building the best-skilled team.

Read more on our [Game Wiki](https://wiki.bunsamosa.org/)

POC Demo - [Stumped](https://stumped.bunsamosa.org/)

Beta Application (WIP) - [Bowled](https://bowled.gg/)


# Current state
The POC demo is a small application built in the hackathon with minimal functionalities.
(Team and player generation, Game simulation based on probability distribution).

I am working on building a full fledged MVP / Beta with a 12 week plan.
Additional smart contract integrations, oracles and web3 frameworks coming soon.


# Technical Details
## Team and Players
- On connecting with wallet, a new user is provided with an option to create team
- On creating a team, the user is provided with 15 player NFTs
- Player NFTs are made of attributes and skills which are updated by the game
- NFT metadata is stored on IPFS (to be moved to Tableland)
- NFT contracts are deployed on Polygon and Aurora (Near protocol)


## Game engine
The game is simulated ball to ball based on the following
- Probability of outcome of each ball (Dot ball, 1 run, 2 runs, 3 runs, 4 or 6, Out etc.)
- Probability distribution based on skills of the player (bowler and batsmen)
- The pitch type (Green wicket, Flat wicket, Crumbling wicket etc.)
