const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../public/metronic/media/avatars/');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // In production, restrict this to your frontend's URL
    methods: ["GET", "POST"]
  }
});

const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/metronic/media/avatars', express.static(path.join(__dirname, '../public/metronic/media/avatars')));

// MariaDB connection
const db = mysql.createConnection({
  host: '127.0.0.1', // Your MariaDB host
  port: 4406,
  user: 'root', // Your MariaDB username
  password: 'admin', // Your MariaDB password
  database: 'moti_media', // Your database name
  multipleStatements: true
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database as id ' + db.threadId);

  // Create tables if they don't exist
  const createTablesQueries = `
    ALTER TABLE users ADD COLUMN IF NOT EXISTS passion_type VARCHAR(255) NULL;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(255) DEFAULT '/metronic/media/avatars/blank.png';
    ALTER TABLE messages ADD COLUMN IF NOT EXISTS conversation_id INT NOT NULL;

    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      post_id INT NOT NULL,
      user_id INT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    DROP TABLE IF EXISTS likes; -- Remove old table

    CREATE TABLE IF NOT EXISTS post_likes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        post_id INT NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_like (post_id, user_id),
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS followers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        follower_id INT NOT NULL,
        following_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_follow (follower_id, following_id),
        FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        project_name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        contribution_percentage DECIMAL(5,2),
        start_date DATE,
        end_date DATE,
        status VARCHAR(50),
        summary TEXT,
        commit_count INT DEFAULT 0,
        issues_resolved_count INT DEFAULT 0,
        performance_metric VARCHAR(255),
        team_evaluation TEXT,
        reference_link VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS conversations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        participant1_id INT NOT NULL,
        participant2_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_conversation (participant1_id, participant2_id),
        FOREIGN KEY (participant1_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (participant2_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        conversation_id INT NOT NULL,
        sender_id INT NOT NULL,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  db.query(createTablesQueries, (err, results) => {
    if (err) console.error("Error creating tables:", err);
    else console.log("Tables checked/created successfully.");
  });
});

// API routes
app.get('/', (req, res) => {
  res.send('Hello from the moti-media backend!');
});

// --- User APIs ---
// Get all users or search by name/email
app.get('/api/users', (req, res) => {
  const { passion_type, search } = req.query;
  let query = 'SELECT id, username, email, created_at, passion_type FROM users';
  const params = [];

  if (search) {
      query += ' WHERE username LIKE ? OR email LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
  } else if (passion_type) {
    query += ' WHERE passion_type = ?';
    params.push(passion_type);
  }

  db.query(query, params, (err, results) => {
    if (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
    res.json(results);
  });
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = `
    SELECT 
        id, username, email, created_at, passion_type, profile_image_url,
        (SELECT COUNT(*) FROM followers WHERE following_id = users.id) AS followers_count,
        (SELECT COUNT(*) FROM followers WHERE follower_id = users.id) AS following_count
    FROM users
    WHERE id = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('User not found');
      return;
    }
    res.json(results[0]);
  });
});

// Get posts by user ID
app.get('/api/users/:userId/posts', (req, res) => {
    const userId = req.params.userId;
    const query = `
        SELECT 
            p.id, p.title, p.content, p.created_at, u.username,
            (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS like_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count
        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.user_id = ?
        ORDER BY p.created_at DESC
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user posts:', err);
            return res.status(500).send('Error fetching user posts');
        }
        res.json(results);
    });
});




// Update user's passion type
app.put('/api/users/me/passion-type', (req, res) => {
    const { userId, passionType } = req.body;
    if (!userId || !passionType) {
        return res.status(400).send('User ID and passion type are required.');
    }
    db.query('UPDATE users SET passion_type = ? WHERE id = ?', [passionType, userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating passion type');
        }
        res.status(200).send({ message: 'Passion type updated successfully.' });
    });
});

// Create a new user (Sign up)
app.post('/api/users', (req, res) => {
  const { username, email, password } = req.body;
  // In a real application, you should hash the password before saving
  const newUser = { username, email, password };
  db.query('INSERT INTO users SET ?', newUser, (err, result) => {
    if (err) {
        console.error(err);
        res.status(500).send('Error creating the user');
        return;
    }
    res.status(201).send({ id: result.insertId, ...newUser });
  });
});

app.post('/api/users/:id/profile-image', upload.single('profile_image'), (req, res) => {
  const userId = req.params.id;
  const imageUrl = `/metronic/media/avatars/${req.file.filename}`;

  db.query('UPDATE users SET profile_image_url = ? WHERE id = ?', [imageUrl, userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error updating profile image');
    }
    res.status(200).send({ profile_image_url: imageUrl });
  });
});

// User login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT id, username, email, password FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Server error');
      return;
    }
    if (results.length === 0) {
      res.status(401).send('Invalid credentials');
      return;
    }
    const user = results[0];
    // In a real application, compare hashed passwords
    if (user.password === password) {
      // For simplicity, returning user ID and username. In real app, generate a token (JWT)
      res.status(200).json({ id: user.id, username: user.username, email: user.email, profile_image_url: user.profile_image_url });
    } else {
      res.status(401).send('Invalid credentials');
    }
  });
});

// --- Chat APIs ---
// Find or create a conversation
app.post('/api/conversations/find-or-create', (req, res) => {
    const { userId1, userId2 } = req.body;
    if (!userId1 || !userId2) {
        return res.status(400).send('Both user IDs are required.');
    }

    const query = `
        SELECT id, participant1_id, participant2_id FROM conversations 
        WHERE (participant1_id = ? AND participant2_id = ?) OR (participant1_id = ? AND participant2_id = ?)
    `;
    db.query(query, [userId1, userId2, userId2, userId1], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error');
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            db.query('INSERT INTO conversations (participant1_id, participant2_id) VALUES (?, ?)', [userId1, userId2], (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error creating conversation');
                }
                res.status(201).json({ id: result.insertId, participant1_id: userId1, participant2_id: userId2 });
            });
        }
    });
});

// Get all conversations for a user, including the last message
app.get('/api/conversations', (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).send('User ID is required.');
    }
    const query = `
        SELECT 
            c.id, 
            IF(c.participant1_id = ?, u2.username, u1.username) AS partner_name,
            IF(c.participant1_id = ?, c.participant2_id, c.participant1_id) AS partner_id,
            (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message,
            (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) AS last_message_timestamp
        FROM conversations c
        JOIN users u1 ON c.participant1_id = u1.id
        JOIN users u2 ON c.participant2_id = u2.id
        WHERE c.participant1_id = ? OR c.participant2_id = ?
        ORDER BY last_message_timestamp DESC
    `;
    db.query(query, [userId, userId, userId, userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});

// Get messages for a conversation
app.get('/api/conversations/:id/messages', (req, res) => {
    const conversationId = req.params.id;
    const query = `
        SELECT m.id, m.sender_id, m.content, m.created_at, u.username AS sender_name
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.conversation_id = ?
        ORDER BY m.created_at ASC
    `;
    db.query(query, [conversationId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});

// --- Follow APIs ---
// ... (existing follow APIs)

// --- Post APIs ---
// Get all posts
app.get('/api/posts', (req, res) => {
    const query = `
        SELECT 
            p.id, p.title, p.content, p.created_at, u.username,
            (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS like_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching posts:', err);
            return res.status(500).send('Error fetching posts');
        }
        res.json(results);
    });
});

// Get a post by ID
app.get('/api/posts/:id', (req, res) => {
  const postId = req.params.id;

  const query = `
    SELECT 
      p.id, p.title, p.content, p.created_at, u.username,
      (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) AS like_count,
      (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comment_count
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ?
  `;

  db.query(query, [postId], (err, results) => {
    if (err) {
      console.error('Error fetching post by id:', err);
      return res.status(500).send('Error fetching post');
    }
    if (results.length === 0) {
      return res.status(404).send('Post not found');
    }
    res.json(results[0]);
  });
});

// Create a new post
app.post('/api/posts', (req, res) => {
  const { user_id, title, content } = req.body;
  const newPost = { user_id, title, content };
  db.query('INSERT INTO posts SET ?', newPost, (err, result) => {
    if (err) {
      console.error('Error creating post:', err);
      return res.status(500).send('Error creating post');
    }
    res.status(201).send({ id: result.insertId, ...newPost });
  });
});


// ... (existing post APIs)

// --- Project APIs ---
// Create a new project
app.post('/api/projects', (req, res) => {
  const { user_id, project_name, role, contribution_percentage, start_date, end_date, status, summary, commit_count, issues_resolved_count, performance_metric, team_evaluation, reference_link } = req.body;
  const newProject = { user_id, project_name, role, contribution_percentage, start_date, end_date, status, summary, commit_count, issues_resolved_count, performance_metric, team_evaluation, reference_link };
  
  db.query('INSERT INTO projects SET ?', newProject, (err, result) => {
    if (err) {
      console.error('Error creating the project:', err);
      return res.status(500).send('Error creating the project');
    }
    res.status(201).send({ id: result.insertId, ...newProject });
  });
});

// Get projects by user ID
// Get projects by user ID
app.get('/api/users/:userId/projects', (req, res) => {
  const userId = req.params.userId;
  const query = `
    SELECT 
        id, project_name, role, contribution_percentage, start_date, end_date, status, summary, commit_count, issues_resolved_count, performance_metric, team_evaluation, reference_link, created_at
    FROM projects
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching projects:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

// ... (existing project APIs)

// --- Like APIs ---
// Add a like to a post
app.post('/api/posts/:postId/likes', (req, res) => {
  const postId = req.params.postId;
  const { user_id } = req.body;
  const newLike = { post_id: postId, user_id };
  db.query('INSERT INTO post_likes SET ?', newLike, (err, result) => {
    if (err) {
      console.error(err);
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).send('Already liked');
      }
      return res.status(500).send('Error adding like');
    }
    res.status(201).send({ message: 'Like added', likeId: result.insertId });
  });
});

// Remove a like from a post
app.delete('/api/posts/:postId/likes', (req, res) => {
  const postId = req.params.postId;
  const { user_id } = req.body;
  db.query('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, user_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error removing like');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Like not found');
    }
    res.status(200).send({ message: 'Like removed' });
  });
});

// Check if user has liked a post
app.get('/api/posts/:postId/likes/status', (req, res) => {
  const postId = req.params.postId;
  const userId = req.query.user_id;
  if (!userId) {
    return res.status(400).send('User ID is required');
  }
  db.query('SELECT COUNT(*) AS count FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    const liked = results[0].count > 0;
    res.status(200).json({ liked });
  });
});

// --- Comment APIs ---
// Get comments for a post
app.get('/api/posts/:postId/comments', (req, res) => {
  const postId = req.params.postId;
  const query = `
    SELECT c.id, c.content, c.created_at, u.username 
    FROM comments c
    JOIN users u ON c.user_id = u.id
    WHERE c.post_id = ?
    ORDER BY c.created_at DESC
  `;
  db.query(query, [postId], (err, results) => {
    if (err) {
      console.error('Error fetching comments:', err);
      return res.status(500).send('Error fetching comments');
    }
    res.json(results);
  });
});

// Add a comment to a post
app.post('/api/posts/:postId/comments', (req, res) => {
  const postId = req.params.postId;
  const { user_id, content } = req.body;
  const newComment = { post_id: postId, user_id, content };
  db.query('INSERT INTO comments SET ?', newComment, (err, result) => {
    if (err) {
      console.error('Error adding comment:', err);
      return res.status(500).send('Error adding comment');
    }
    res.status(201).send({ id: result.insertId, ...newComment });
  });
});


// Socket.io connection
io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('join', (userId) => {
      console.log(`User ${userId} joined room`);
      socket.join(userId.toString());
  });

  socket.on('send_message', (message) => {
    const { conversationId, senderId, content } = message;
    const query = 'INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)';
    db.query(query, [conversationId, senderId, content], (err, result) => {
        if (err) {
            console.error('Error saving message:', err);
            return;
        }
        const newMessage = { id: result.insertId, conversation_id: conversationId, sender_id: senderId, content, created_at: new Date(), sender_name: '' };
        // Fetch sender_name for the new message
        db.query('SELECT username FROM users WHERE id = ?', [senderId], (err, userRows) => {
            if (err) {
                console.error('Error fetching sender username:', err);
                return;
            }
            if (userRows.length > 0) {
                newMessage.sender_name = userRows[0].username;
            }

            // Get recipient ID to send the message to their room
            const getRecipientQuery = 'SELECT IF(participant1_id = ?, participant2_id, participant1_id) as recipientId FROM conversations WHERE id = ?';
            db.query(getRecipientQuery, [senderId, conversationId], (err, rows) => {
                if (err) {
                    console.error('Error fetching recipient:', err);
                    return;
                }
                const recipientId = rows[0].recipientId;
                io.to(recipientId.toString()).emit('receive_message', newMessage);
                // Also send to sender for confirmation/sync
                io.to(senderId.toString()).emit('receive_message', newMessage);
            });
        });
    });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`)
});
