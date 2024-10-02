const mineflayer = require('mineflayer');
const http = require('http');

// Function to generate a random username
function generateRandomName() {
    const adjectives = ["Cool", "Funny", "Brave", "Silly", "Wise"];
    const nouns = ["Panda", "Dragon", "Knight", "Wizard", "Ninja"];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 1000)}`; // e.g., CoolPanda123
}

const serverIP = 'TheSMPsFel.aternos.me'; // Updated server hostname
const serverPort = 26383; // Updated server port
const version = '1.20.2'; // Replace with a supported version

function createBot() {
    const username = generateRandomName(); // Generate random name
    const bot = mineflayer.createBot({
        host: serverIP,
        port: serverPort,
        username: username,
        version: version,
    });

    bot.on('spawn', () => {
        console.log(`${username} has joined the server!`);

        // Random movement and fighting
        setInterval(() => {
            const nearbyEntities = bot.entities; // Get all nearby entities
            const zombies = Object.values(nearbyEntities).filter(entity => entity.type === 'mob' && entity.mobType === 'Zombie');

            if (zombies.length > 0) {
                const targetZombie = zombies[0]; // Target the first zombie found
                const distance = bot.entity.position.distanceTo(targetZombie.position);

                if (distance <= 3) { // Attack range
                    bot.attack(targetZombie); // Attack the zombie
                    console.log(`${username} is attacking a zombie!`);
                } else {
                    bot.lookAt(targetZombie.position.offset(0, 1, 0)); // Look at the zombie
                    bot.setControlState('forward', true); // Move towards the zombie
                }
            } else {
                // If no zombies, move randomly
                const randomDirection = Math.floor(Math.random() * 4);
                switch (randomDirection) {
                    case 0: // Move forward
                        bot.setControlState('forward', true);
                        break;
                    case 1: // Move backward
                        bot.setControlState('back', true);
                        break;
                    case 2: // Move left
                        bot.setControlState('left', true);
                        break;
                    case 3: // Move right
                        bot.setControlState('right', true);
                        break;
                }

                setTimeout(() => {
                    bot.setControlState('forward', false);
                    bot.setControlState('back', false);
                    bot.setControlState('left', false);
                    bot.setControlState('right', false);
                }, 200); // Stop moving after 0.2 seconds
            }
        }, 300); // Check every 0.3 seconds

        setTimeout(() => {
            if (bot) {
                console.log(`${username} has left the server!`);
                bot.quit();
            }
        }, 5000); // Stay in the server for 5 seconds
    });

    bot.on('chat', (username, message) => {
        // Ignore chat messages
    });

    bot.on('error', (err) => {
        console.error('Bot error:', err);
        if (bot) {
            bot.quit();
        }
    });

    bot.on('end', () => {
        setTimeout(createBot, 60000); // Restart after 60 seconds
    });
}

createBot();

// HTTP Server to respond to pings
http.createServer((req, res) => {
    console.log('Received a ping request'); // Log when a request is received
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running!\n');
}).listen(process.env.PORT || 3000, () => {
    console.log('HTTP Server running!');
});
