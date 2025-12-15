const User = require('../models/User');

// Generate temporary password
function generateTempPassword(length = 8) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Get all users
exports.getAllUsers = (req, res) => {
    User.getAll((err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Failed to fetch users' });
        }
        res.json(results);
    });
};

// Get user by ID
exports.getUserById = (req, res) => {
    const { id } = req.params;

    User.getById(id, (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ error: 'Failed to fetch user' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(results[0]);
    });
};

// Create new user with auto-generated temporary password
exports.createUser = async (req, res) => {
    const { first_name, last_name, email, username, role, status } = req.body;

    if (!first_name || !last_name) {
        return res.status(400).json({ error: 'First name and last name are required' });
    }

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // Generate temporary password automatically
    const tempPassword = generateTempPassword(8);

    // Check if email already exists
    User.checkEmailExists(email, null, (err, results) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).json({ error: 'Failed to create user' });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Check if username already exists
        User.checkUsernameExists(username, null, (err, results) => {
            if (err) {
                console.error('Error checking username:', err);
                return res.status(500).json({ error: 'Failed to create user' });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: 'Username already exists' });
            }

            // Create user with temporary password
            const userData = { first_name, last_name, email, username, password: tempPassword, role, status };

            User.createManagement(userData, (err, result) => {
                if (err) {
                    console.error('Error creating user:', err);
                    return res.status(500).json({ error: 'Failed to create user' });
                }

                // Return temporary password so admin can share with user
                res.status(201).json({
                    message: 'User created successfully',
                    id: result.insertId,
                    credentials: {
                        email: email,
                        username: username,
                        temporaryPassword: tempPassword
                    }
                });
            });
        });
    });
};

// Update user
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, username, password, role, status } = req.body;

    if (!first_name || !last_name) {
        return res.status(400).json({ error: 'First name and last name are required' });
    }

    // Check if email already exists (excluding current user)
    User.checkEmailExists(email, id, (err, results) => {
        if (err) {
            console.error('Error checking email:', err);
            return res.status(500).json({ error: 'Failed to update user' });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Check if username already exists (excluding current user)
        User.checkUsernameExists(username, id, (err, results) => {
            if (err) {
                console.error('Error checking username:', err);
                return res.status(500).json({ error: 'Failed to update user' });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: 'Username already exists' });
            }

            // Update user
            const userData = { first_name, last_name, email, username, password, role, status };

            User.update(id, userData, (err, result) => {
                if (err) {
                    console.error('Error updating user:', err);
                    return res.status(500).json({ error: 'Failed to update user' });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'User not found' });
                }

                res.json({ message: 'User updated successfully' });
            });
        });
    });
};

// Delete user
exports.deleteUser = (req, res) => {
    const { id } = req.params;

    User.delete(id, (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);

            // Check if it's a foreign key constraint error
            if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.errno === 1451) {
                return res.status(400).json({
                    error: 'Cannot delete user',
                    message: 'This user has associated tasks and cannot be deleted. Please reassign or delete all tasks first.'
                });
            }

            return res.status(500).json({ error: 'Failed to delete user' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    });
};
