// import supabaseClient from "../backend/supabase/index.js";

// // Fetch and display products
// async function fetchProducts() {
//     const { data: products, error } = await supabaseClient
//         .from('products')
//         .select('*');

//     if (error) {
//         console.error('Error fetching products:', error);
//         return;
//     }

//     const productTableBody = document.getElementById('productTableBody');
//     productTableBody.innerHTML = '';
//     products.forEach(product => {
//         const row = document.createElement('tr');
//         row.classList.add('bg-gray-800', 'border-b', 'border-gray-700');

//         row.innerHTML = `
//             <td class="p-4">${product.name}</td>
//             <td class="p-4">${product.category}</td>
//             <td class="p-4">${product.quantity}</td>
//             <td class="p-4">${product.price}</td>
//             <td class="p-4">${product.description}</td>
//             <td class="p-4"><img src="${product.image_url}" alt="${product.name}" class="w-16 h-16 object-cover rounded"></td>
//             <td class="p-4 flex space-x-2">
//                 <button class="bg-yellow-500 text-white p-2 rounded" onclick="editProduct(${product.id})">Edit</button>
//                 <button class="bg-red-600 text-white p-2 rounded" onclick="openConfirmationModal(${product.id})">Delete</button>
//             </td>
//         `;
//         productTableBody.appendChild(row);
//     });
// }

// // Handle form submission for adding or updating a product
// async function handleProductSubmit(event) { //add // edit
//     event.preventDefault();

//     const productId = event.target.dataset.productId;
//     console.log(event.target);
//     const name = document.getElementById('productName').value;
//     const category = document.getElementById('productCategory').value;
//     const quantity = document.getElementById('productStock').value;
//     const price = document.getElementById('productPrice').value;
//     const description = document.getElementById('productDescription').value;
//     const imageFile = document.getElementById('productImage').files[0];

//     let imageUrl = '';

//     if (imageFile) {
//         const { data, error: uploadError } = await supabaseClient.storage
//             .from('product-images')
//             .upload(`${imageFile.name}`, imageFile);

//         if (uploadError) {
//             console.error('Error uploading image:', uploadError);
//             return;
//         }

//         imageUrl = `${supabaseClient.storageUrl}/object/public/product-images/${imageFile.name}`;
//     }

//     const productData = {
//         name,
//         category,
//         quantity,
//         price,
//         description,
//         image_url: imageUrl
//     };

//     let response;

//     if (productId) {
//         response = await supabaseClient
//             .from('products')
//             .update(productData)
//             .eq('id', productId);
//     } else {
//         response = await supabaseClient
//             .from('products')
//             .insert([productData]);
//     }

//     if (response.error) {
//         console.error('Error saving product:', response.error);
//         return;
//     }

//     closeModal();
//     fetchProducts();
// }

// handleProductSubmit();

// // Delete a product
// async function deleteProduct(productId) {
//     const { error } = await supabaseClient
//         .from('products')
//         .delete()
//         .eq('id', productId);

//     if (error) {
//         console.error('Error deleting product:', error);
//         return;
//     }

//     fetchProducts();
// }

// // Populate form for editing a product
// async function editProduct(productId) {
//     const { data: product, error } = await supabaseClient
//         .from('products')
//         .select('*')
//         .eq('product_id', productId)
//         .single();

//     if (error || !product) {
//         console.error('Error fetching product:', error);
//         return;
//     }

//     document.getElementById('productName').value = product.name;
//     document.getElementById('productCategory').value = product.category;
//     document.getElementById('productStock').value = product.quantity;
//     document.getElementById('productPrice').value = product.price;
//     document.getElementById('productDescription').value = product.description;

//     document.getElementById('productForm').dataset.productId = productId;
//     openModal();
// }

// Open confirmation modal for deletion
// function openConfirmationModal(productId) {
//     const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
//     confirmDeleteBtn.onclick = () => deleteProduct(productId);
//     document.getElementById('confirmationModal').classList.remove('hidden');
// }

// // Close confirmation modal
// function closeConfirmationModal() {
//     document.getElementById('confirmationModal').classList.add('hidden');
// }

// // Modal handling functions
// function openModal(e) {
//     document.getElementById('productModal').classList.remove('hidden');
//     console.log(e.target);
// }

// function closeModal() {
//     document.getElementById('productForm').reset();
//     document.getElementById('productForm').removeAttribute('data-productId');
//     document.getElementById('productModal').classList.add('hidden');
// }

// // Expose functions globally
// window.editProduct = editProduct;
// window.deleteProduct = deleteProduct;

// // Event Listeners
// document.getElementById('openModalBtn').addEventListener('click', openModal);
// document.getElementById('closeModalBtn').addEventListener('click', closeModal);
// document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
// document.getElementById('cancelDeleteBtn').addEventListener('click', closeConfirmationModal);

// // Initial fetch of products
// fetchProducts();
import supabaseClient from "../backend/supabase/index.js";

async function fetchProducts() {
    const { data: products, error } = await supabaseClient
        .from('products')
        .select('*');

    if (error) {
        console.error('Error fetching products:', error);
        return;
    }

    const productTableBody = document.getElementById('productTableBody');
    productTableBody.innerHTML = '';
    products.forEach(product => {
        const row = document.createElement('tr');
        row.classList.add('bg-gray-800', 'border-b', 'border-gray-700');

        row.innerHTML = `
            <td class="p-4">${product.name}</td>
            <td class="p-4">${product.category}</td>
            <td class="p-4">${product.quantity}</td>
            <td class="p-4">${product.price}</td>
            <td class="p-4">${product.description}</td>
            <td class="p-4 flex space-x-2">
                <button class="bg-yellow-500 text-white p-2 rounded" onclick="editProduct(${product.product_id})">Edit</button>
                <button class="bg-red-600 text-white p-2 rounded" onclick="openConfirmationModal(${product.product_id})">Delete</button>
            </td>
        `;
        productTableBody.appendChild(row);
    });
}

window.openConfirmationModal = function(product_id) {
    const confirmationModal = document.getElementById('confirmationModal');
    confirmationModal.classList.remove('hidden');
    window.currentProductId = product_id;
}

window.closeConfirmationModal = function() {
    const confirmationModal = document.getElementById('confirmationModal');
    confirmationModal.classList.add('hidden');
}

window.deleteProduct = async function() {
    const productId = window.currentProductId;
    if (!productId) return;

    const { error } = await supabaseClient
        .from('products')
        .delete()
        .eq('product_id', productId);

    if (error) {
        console.error('Error deleting product:', error);
        return;
    }

    window.closeConfirmationModal();
    fetchProducts();
}

document.getElementById('openModalBtn').addEventListener('click', function() {
    document.getElementById('productModal').classList.remove('hidden');
});

// Function to close the Add Product modal
document.getElementById('closeModalBtn').addEventListener('click', function() {
    document.getElementById('productModal').classList.add('hidden');
});

// Function to add a product
window.addProduct = async function(event) {
    event.preventDefault();

    const name = document.getElementById('productName').value;
    const category = document.getElementById('productCategory').value;
    const stock = parseInt(document.getElementById('productStock').value, 10);
    const price = parseFloat(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value;

    if (!name || !category || isNaN(stock) || isNaN(price) || !description) {
        alert('Please fill in all fields correctly.');
        return;
    }

    try {
        const { error } = await supabaseClient
            .from('products')
            .insert([{ name, category, quantity: stock, price, description }]);

        if (error) {
            console.error('Error adding product:', error);
            alert('Error adding product. Please try again.');
            return;
        }

        document.getElementById('productModal').classList.add('hidden');
        fetchProducts();
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
};

// Attach event listener to form submission
document.getElementById('productForm').addEventListener('submit', window.addProduct);

// Attach event listeners
document.getElementById('openModalBtn').addEventListener('click', window.openAddProductModal);
document.getElementById('closeModalBtn').addEventListener('click', window.closeAddProductModal);
document.getElementById('productForm').addEventListener('submit', window.addProduct);

// Initial fetch of products
fetchProducts();
