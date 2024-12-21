import * as dotenv from 'dotenv';

dotenv.config();
import TelegramBot from 'node-telegram-bot-api';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN environment variable is not set.');
}

const bot = new TelegramBot(token, { polling: true });

// bot.on('new_chat_members', (msg) => {  
//   if (msg.chat.id === bot.id) {
//     const chatId = msg.chat.id;
//     bot.sendMessage(chatId, 'Hello! I am an Instagram link converter bot. Send me an Instagram link and I will convert it to a ddInstagram link.');
//   }
// });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  if (messageText?.includes('instagram.com')) {
    try {
      const instagramLink = messageText.match(
        /(https?:\/\/www\.)?instagram\.com(\/[^\s]+)/
      )?.[0];
      if (instagramLink) {
        const ddInstagramLink = instagramLink.replace('instagram.com', 'ddinstagram.com');

        // Delete the original message
        await bot.deleteMessage(chatId, msg.message_id.toString());

        // Send the new message with the converted link
        await bot.sendMessage(chatId, ddInstagramLink);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      // Optionally send an error message to the user
      // await bot.sendMessage(chatId, 'An error occurred while processing your message.');
    }
  }
});

console.log('Bot is running!');

// Graceful shutdown
process.once('SIGINT', () => bot.stopPolling());
process.once('SIGTERM', () => bot.stopPolling());

// Optional: Send a startup message to a specific chat
// const adminChatId = process.env.ADMIN_CHAT_ID;
// if (adminChatId) {
//   bot.sendMessage(adminChatId, 'Bot started!');
// }
