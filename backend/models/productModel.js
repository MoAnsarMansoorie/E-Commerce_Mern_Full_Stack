import mongoose, { mongo } from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
    },
    description: {
        type: String,
        required: [true, 'Please enter product description'],
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        default: 0.0,
    },
    image: {
        type: Array,
        required: [true, 'Please enter product image'],
    },
    category: {
        type: String,
        required: [true, 'Please enter product category'],
    },
    subCategory: {
        type: String,
        required: [true, 'Please enter product subcategory'],
    },
    sizes: {
        type: Array,
        required: [true, 'Please enter product sizes'],
    },
    bestseller: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true,
});

const productModel = mongoose.model.product || mongoose.model('Product', productSchema);
export default productModel;