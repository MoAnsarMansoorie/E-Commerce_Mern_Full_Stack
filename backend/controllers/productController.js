import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// function for add product
const addProductController = async (req, res) => { 
    try {
        const { name, price, description, category, subCategory, sizes, bestSeller } = req.body;
        
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]  

        const images = [image1, image2, image3, image4].filter(image => image !== undefined)

        const imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {resource_type: "image"});
                return result.secure_url;
            })
        )

        // console.log(name, price, description, category, subCategory, sizes, bestSeller)
        // console.log(imagesUrl)

        // Here you would typically save the product to your database

        const productData = {
            name,
            price: Number(price),
            description,
            category,
            subCategory,
            sizes: JSON.parse(sizes),
            bestseller: bestSeller === "true" ? "true" : "false",
            image: imagesUrl,
            date: Date.now()
        }

        const product = new productModel(productData);
        await product.save();

        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product
        });
        
    } catch (error) {
        console.error("Error in addProducrController:", error);
        res.status(500).json({ message: "Internal Server Error" });
        
    }

}

// function for list product
const listProducrController = async (req, res) => {
    try {
        const products = await productModel.find({}).sort({ date: -1 });
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        res.status(200).json({
            success: true,
            message: "Products retrieved successfully",
            products
        });
        
    } catch (error) {
        console.error("Error in listProducrController:", error);
        res.status(500).json({ message: "Internal Server Error" });
        
    }

}

// function for remove product
const removeProducrController = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Product removed successfully"
        });
        
    } catch (error) {
        console.error("Error in removeProducrController:", error);
        res.status(500).json({ message: "Internal Server Error" });
        
    }

}

// function for single product info
const singleProducrController = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            success: true,
            message: "Product retrieved successfully",
            product
        });
        
    } catch (error) {
        console.error("Error in singleProducrController:", error);
        res.status(500).json({ message: "Internal Server Error" });
        
    }

}

export {addProductController, listProducrController, removeProducrController, singleProducrController};
