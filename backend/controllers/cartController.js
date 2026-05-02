import userModel from "../models/userModel.js";


// add to user cart controller
const addToUserCartController = async (req, res) => {
    const { itemId, size } = req.body;
    const userId = req.user.id; // Get userId from the token

    const userData = await userModel.findById(userId);

    if (!userData) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    let cartData = await userData.cartData;

    try {
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                // If the item with the specified size already exists, increment the quantity
                cartData[itemId][size] += 1;
            } else {
                // If the item with the specified size does not exist, add it with quantity 1
                cartData[itemId][size] = 1;
            }
        } else {
            // If the item does not exist in the cart, create a new entry with the specified size and quantity 1
            cartData[itemId] = {}
            cartData[itemId][size] = 1;
        }

        // Update the user's cart data
        await userModel.findByIdAndUpdate(userId, { cartData });

        return res.status(200).json({
            success: true,
            message: "Item added to cart successfully",
            cartData
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error adding item to cart",
            error: error.message
        });
        
    }

}

// update user cart controller
const updateUserCartController = async (req, res) => {
    try {
        const { itemId, size, quantity } = req.body;
        const userId = req.user.id; // Get userId from token

        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        let cartData = userData.cartData;

        cartData[itemId][size] = quantity;

        await userModel.findByIdAndUpdate(userId, { cartData });

        return res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cartData
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating cart",
            error: error.message
        });
        
    }

}

// get user cart controller
const getUserCartController = async (req, res) => {
    try {
        const userId = req.user.id;

        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const cartData = userData.cartData;

        return res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            cartData
        });
        
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching cart",
            error
        });
        
    }

}

export { addToUserCartController, updateUserCartController, getUserCartController };