
import Product from "../models/product.js"
import {v2 as cloudinary} from "cloudinary"


const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];
const validCategories = ['Men', 'Women', 'Shorts', 'Striped Shirts(UNISEX)'];
// FUNCTION FOR ADD PRODUCT (-----DONE-----)
const addProduct = async (req, res) => {
    try {
        const {product_name, description, product_details, sizes, category_name, price, stock_quantity, is_bestseller, is_active} = req.body;

        const image_1 = req.files.image_1 && req.files.image_1[0];
        const image_2 = req.files.image_2 && req.files.image_2[0];
        const image_3 = req.files.image_3 && req.files.image_3[0];
        const image_4 = req.files.image_4 && req.files.image_4[0];

        const images = [image_1, image_2, image_3, image_4].filter((item) => item !== undefined);
        let imagesUrl = [];
        try {
            imagesUrl = await Promise.all(
                images.map(async (item) => {
                    let result = await cloudinary.uploader.upload(item.path, {resource_type:'image', folder: 'angle-online-store/products'});
                    return result.secure_url
                })
            )
        } catch (uploadError) {
            return res.json({ success: false, message: "Image upload failed", error: uploadError.message });
        }

        // VALIDATION OF FIRST IMAGE REQUIRED
        if (!imagesUrl[0]) {
            return res.json({ success: false, message: "Upload atleast 1 image." });
        }

        const sizesArray = Array.isArray(sizes) ? sizes : sizes.split(',').map(size => size.trim());

        if (sizesArray.some(size => !validSizes.includes(size))) {
            return res.json({ success: false, message: "Invalid sizes provided." });
        }

        if (!validCategories.includes(category_name)) {
            return res.json({ success: false, message: "Invalid category." });
          }

        if (isNaN(price) && isNaN(stock_quantity)) {
            return res.json({ success: false, message: "Price and stock quantity must be numbers." });
        }

        

        const newProductData = await Product.create ({
            product_name,
            description,
            product_details: product_details || '',
            sizes: sizesArray.join(','),
            category_name,
            image_1: imagesUrl[0],
            image_2: imagesUrl[1] || null,
            image_3: imagesUrl[2] || null,
            image_4: imagesUrl[3] || null,
            price: Number(price),
            stock_quantity: Number(stock_quantity),
            is_bestseller: is_bestseller === "true" ? true : false,            
            is_active: is_active === "true" ? true : false,
        })

        return res.json({
            success: true,
            message: "Product Added Successfully",
            products: {
                product_name: newProductData.product_name,
                description: newProductData.description,
                product_details: newProductData.product_details,
                sizes: newProductData.sizes,
                category_name: newProductData.category_name,
                price: newProductData.price,
                stock_quantity: newProductData.stock_quantity,
                is_bestseller: newProductData.is_bestseller,
                is_active: newProductData.is_active,
                images: imagesUrl,
            },
        });

    } catch (error) {
        console.log(error);
        return res.json({success:false, message:error.message});
    }
}

// FUNCTION FOR LIST PRODUCT (-----DONE-----)
const listProducts = async (req, res) => {
    try {
        const products = await Product.findAll({});
        if (products.length === 0) {
            return res.json({ success: true, message: "No products found.", products: [] });
        }
        return res.json({success: true, products});
    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message});
    }
}

// FUNCTION FOR UPDATE PRODUCT 
const updateProduct = async (req, res) => {
    try {
        const { product_id, product_name, description, product_details, sizes, category_name, price, stock_quantity, is_bestseller, is_active } = req.body;

        // Check if the product exists
        const product = await Product.findByPk(product_id);
        if (!product) {
            return res.json({ success: false, message: "Product not found."});
            
        }

        let sizesArray = [];
        if (sizes) {
            sizesArray = Array.isArray(sizes) ? sizes : sizes.split(',').map(size => size.trim());
            if (sizesArray.some(size => !validSizes.includes(size))) {
                return res.json({ success: false, message: "Invalid sizes provided." });
            }
        } else {
            return res.json({ success: false, message: "Specify at least one product size." });
        }

        if (category_name && !validCategories.includes(category_name)) {
            return res.json({ success: false, message: "Invalid category." });
        }

        // Validate price and stock_quantity
        if (price !== undefined && isNaN(price)) {
            return res.json({ success: false, message: "Price must be a number." });
        }
        if (stock_quantity !== undefined && isNaN(stock_quantity)) {
            return res.json({ success: false, message: "Stock quantity must be a number." });
        }

        // Handle image uploads if provided
        const imagesToUpdate = {};

        if (req.files.image_1) {
            const result = await cloudinary.uploader.upload(req.files.image_1[0].path, { resource_type: 'image', folder: 'angle-online-store/products' });
            imagesToUpdate.image_1 = result.secure_url;
        } else {
            imagesToUpdate.image_1 = product.image_1; // Retain existing image
        }

        if (req.files.image_2) {
            const result = await cloudinary.uploader.upload(req.files.image_2[0].path, { resource_type: 'image', folder: 'angle-online-store/products' });
            imagesToUpdate.image_2 = result.secure_url;
        } else {
            if (req.body.image_2 === "null") {
                imagesToUpdate.image_2 = null;
            }
        }

        if (req.files.image_3) {
            const result = await cloudinary.uploader.upload(req.files.image_3[0].path, { resource_type: 'image', folder: 'angle-online-store/products' });
            imagesToUpdate.image_3 = result.secure_url;
        } else {
            if (req.body.image_3 === "null") {
                imagesToUpdate.image_3 = null;
            }
        }

        if (req.files.image_4) {
            const result = await cloudinary.uploader.upload(req.files.image_4[0].path, { resource_type: 'image', folder: 'angle-online-store/products' });
            imagesToUpdate.image_4 = result.secure_url;
        } else {
            if (req.body.image_4 === "null") {
                imagesToUpdate.image_4 = null;
            }
        }

        // Prepare update data
        const updateData = {
            ...(product_name && { product_name }),
            ...(description && { description }),
            ...(product_details && { product_details }),
            ...(sizesArray.length > 0 && { sizes: sizesArray.join(',') }),
            ...(category_name && { category_name }),
            ...(price && { price: Number(price) }),
            ...(stock_quantity && { stock_quantity: Number(stock_quantity) }),
            ...(is_bestseller !== undefined && { is_bestseller: is_bestseller === "true" }),
            ...(is_active !== undefined && { is_active: is_active === "true" }),
            ...imagesToUpdate
        };

        // Update product in the database
        await Product.update(updateData, { where: { product_id } });
        return res.json({ success: true, message: "Product updated successfully." });

    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: error.message });
    }
}

// FUNCTION FOR REMOVE PRODUCT (-----DONE-----)
const removeProduct = async (req, res) => {
    try {
        const { product_id } = req.body;
        const removedProduct = await Product.destroy({ where: { product_id } }); 

        if (!removedProduct) {
            return res.json({ success: false, message: "Product not found." });
        }

        res.json({ success: true, message: "Product Removed" });
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: error.message });
    }
}

// FUNCTION FOR SINGLE PRODUCT INFO 
const singleProduct = async (req, res) => {
    try {
        const { product_id } = req.body;

        const product = await Product.findByPk(product_id);

        if (!product) {
            return res.json({ success: false, message: "Product not found." });
        }

        return res.json({ success: true, product });

    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: error.message });
    }
}

export {addProduct, listProducts, updateProduct, removeProduct, singleProduct};