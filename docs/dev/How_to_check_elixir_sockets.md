# How to Check Elixir Sockets

Follow these steps to verify the Elixir sockets:

## 1. Migrate Database Changes
Run the following command to apply database migrations:
```bash
mix ecto.migrate
```

## 2. Start the Phoenix Server
Start the Phoenix server using:
```bash
mix phx.server
```

## 3. Install `wscat`
Install the WebSocket client `wscat` globally using npm:
```bash
npm install -g wscat
```

## 4. Connect to the WebSocket
Use `wscat` to connect to the WebSocket server. Replace `<user_name>` with your preferred username:
```bash
wscat -c ws://localhost:4000/socket/websocket?user_id=<user_name>
```

### Example:
```bash
wscat -c ws://localhost:4000/socket/websocket?user_id=yashaswini
```

If everything is set up correctly, you should see:
```
Connected (press CTRL+C to quit)
```

## 5. Join a Topic
Send the following JSON message to join a topic. Replace `<user_name>` with your username:
```json
{"topic": "message:<user_name>", "event": "phx_join", "payload": {}, "ref": 1}
```

## 6. Send a Message
Send a message to another user. Replace `<user_name2>` with the recipient's username:
```json
{"topic": "message:<user_name>", "event": "send_message", "payload": {"to": "<user_name2>", "body": "Hello I am talking!"}, "ref": 2}
```

## 7. Verify the Connection
To verify the connection, open another terminal and connect as the recipient user:
```bash
wscat -c ws://localhost:4000/socket/websocket?user_id=<user_name2>
```

Join the recipient's topic:
```json
{"topic": "message:<user_name2>", "event": "phx_join", "payload": {}, "ref": 1}
```

## 8. Test Messaging
Send another message as the first user to the second user and observe the message being received in the second terminal.

## 9. Check PostgreSQL
You can also check the PostgreSQL database to verify that messages are being saved correctly.
