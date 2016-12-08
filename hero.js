/* eslint no-unused-vars: 0 */
/*

Strategies for the hero are contained within the "moves" object as
name-value pairs, like so:

    //...
    ambusher : function(gamedData, helpers){
      // implementation of strategy.
    },
    heWhoLivesToFightAnotherDay: function(gamedData, helpers){
      // implementation of strategy.
    },
    //...other strategy definitions.

The "moves" object only contains the data, but in order for a specific
strategy to be implemented we MUST set the "move" variable to a
definite property.  This is done like so:

move = moves.heWhoLivesToFightAnotherDay;

You MUST also export the move function, in order for your code to run
So, at the bottom of this code, keep the line that says:

module.exports = move;

The "move" function must return "North", "South", "East", "West", or "Stay"
(Anything else will be interpreted by the game as "Stay")

The "move" function should accept two arguments that the website will be passing in:
- a "gameData" object which holds all information about the current state
  of the battle
- a "helpers" object, which contains useful helper functions
- check out the helpers.js file to see what is available to you

*/

// Strategy definitions
var moves = {
    haneybadger: function (gameData, helpers) {
        var haneybadger = gameData.activeHero;
        var healthLimit = 60;

        var healthWellStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, haneybadger, function (boardTile) {
            if (boardTile.type === 'HealthWell') {
                return true;
            }
        });
        var diamondMineStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, haneybadger, function (boardTile) {
            if (boardTile.type === 'DiamondMine')  {
                if (boardTile.owner) {
                    return false;
                } else {
                    return true;
                }
            }
        });
        var enemyStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, haneybadger, function (boardTile) {
            if (boardTile.type === 'Hero') {
                if (boardTile.team !== haneybadger.team) {
                    return true;
                } else {
                    return false;
                }
            }
        });
        var friendStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, haneybadger, function (boardTile) {
            if (boardTile.type === 'Hero') {
                if (boardTile.team === haneybadger.team) {
                    return true;
                } else {
                    return false;
                }
            }
        });


        var distanceToHealthWell = healthWellStats.distance;
        var directionToHealthWell = healthWellStats.direction;
        if (diamondMineStats) {
            var distanceToDiamondMine = diamondMineStats.distance;
            var directionToDiamondMine = diamondMineStats.direction;
        }
        if (enemyStats) {
            var distanceToEnemy = enemyStats.distance;
            var directionToEnemy = enemyStats.direction;
        }
        if (friendStats) {
            var distanceToFriend = friendStats.distance;
            var directionToFriend = friendStats.direction;
        }

        if (haneybadger.health > healthLimit) {
            if (friendStats && (friendStats.health <= healthLimit)) {
                if (diamondMineStats && (distanceToFriend < distanceToDiamondMine)) {
                    return directionToFriend;
                } else if (diamondMineStats) {
                    return directionToDiamondMine;
                } else if (enemyStats) {
                    return directionToEnemy;
                }
            } else if (diamondMineStats) {
                if (enemyStats && (distanceToDiamondMine < distanceToEnemy)) {
                    return directionToDiamondMine;
                } else {
                    return directionToEnemy;
                }
            } else if (enemyStats) {
                return directionToEnemy;
            }
        } else {
            if (friendStats && (friendStats.health <= healthLimit)) {
                if (distanceToFriend < distanceToHealthWell) {
                    return directionToFriend;
                } else {
                    return directionToHealthWell;
                }
            } else {
                return directionToHealthWell;
            }
        }

        return directionToHealthWell;
    }


};

// Set our hero's strategy
var move =  moves.haneybadger;

// Export the move function here
module.exports = move;
