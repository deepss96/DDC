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
    const { first_name, last_name, email, phone, role, status } = req.body;
    console.log("FULL REQUEST BODY:", req.body);
    console.log("ROLE RECEIVED:", role, "TYPE:", typeof role, "LENGTH:", role ? role.length : 'undefined');

    if (!first_name) {
        return res.status(400).json({ error: 'First name is required' });
    }

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    if (!phone || phone.length !== 12) {
        return res.status(400).json({ error: 'Please enter a valid 10-digit phone number' });
    }

    if (!role) {
        return res.status(400).json({ error: 'Role is required' });
    }

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    // Generate username from email (part before @)
    const username = email.split('@')[0];

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

            // Check if phone already exists
            User.checkPhoneExists(phone, null, (err, results) => {
                if (err) {
                    console.error('Error checking phone:', err);
                    return res.status(500).json({ error: 'Failed to create user' });
                }

                if (results.length > 0) {
                    return res.status(400).json({ error: 'Phone number already exists' });
                }

                // Create user with temporary password
                const userData = { first_name, last_name, email, phone, username, password: tempPassword, role, status };

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
                            phone: phone,
                            temporaryPassword: tempPassword
                        }
                    });
                });
            });
        });
    });
};

// Update user
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, phone, role, status, profile_image } = req.body;

    if (!first_name) {
        return res.status(400).json({ error: 'First name is required' });
    }

    if (!role) {
        return res.status(400).json({ error: 'Role is required' });
    }

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
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

        // Check if phone already exists (excluding current user)
        User.checkPhoneExists(phone, id, (err, results) => {
            if (err) {
                console.error('Error checking phone:', err);
                return res.status(500).json({ error: 'Failed to update user' });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: 'Phone number already exists' });
            }

            // Update user
            const userData = { first_name, last_name, email, phone, role, status, profile_image };

            User.update(id, userData, (err, result) => {
                if (err) {
                    console.error('Error updating user:', err);
                    console.error('Error message:', err.message);
                    console.error('Error taskDetails:', err.taskDetails);

                    // Check if it's a task validation error
                    if (err.message && err.message.includes('Cannot deactivate user with pending tasks')) {
                        console.log('Task validation error detected in controller');
                        const { assignedTo, assignedBy } = err.taskDetails || { assignedTo: [], assignedBy: [] };

                        let errorMessage = 'Cannot deactivate this user because they have pending tasks. ';
                        const taskNames = [];

                        if (assignedTo.length > 0) {
                            taskNames.push(...assignedTo.map(task => `"${task.name}" (assigned by ${task.assignedBy})`));
                        }

                        if (assignedBy.length > 0) {
                            taskNames.push(...assignedBy.map(task => `"${task.name}" (assigned to ${task.assignedTo})`));
                        }

                        if (taskNames.length > 0) {
                            errorMessage += `Please complete or reassign these tasks first: ${taskNames.join(', ')}`;
                        }

                        console.log('Sending task validation error response:', {
                            error: 'Cannot deactivate user',
                            message: errorMessage,
                            taskDetails: { assignedTo, assignedBy }
                        });

                        return res.status(400).json({
                            error: 'Cannot deactivate user',
                            message: errorMessage,
                            taskDetails: { assignedTo, assignedBy }
                        });
                    }

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

            // Check if it's a task validation error
            if (err.message && err.message.includes('Cannot delete user with pending assigned tasks')) {
                const { assignedTo } = err.taskDetails || { assignedTo: [] };

                let errorMessage = 'Cannot delete this user because they have pending tasks assigned to them. ';
                const taskNames = [];

                if (assignedTo.length > 0) {
                    taskNames.push(...assignedTo.map(task => `"${task.name}" (assigned by ${task.assignedBy})`));
                }

                if (taskNames.length > 0) {
                    errorMessage += `Please complete these tasks or reassign them to another user first: ${taskNames.join(', ')}`;
                }

                return res.status(400).json({
                    error: 'Cannot delete user',
                    message: errorMessage,
                    taskDetails: { assignedTo, assignedBy: [] }
                });
            }

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
