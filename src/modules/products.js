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
            <td class="p-4">${product.category_id}</td>
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
window.openAddProductModal = function() {
    document.getElementById('productModal').classList.remove('hidden');
    document.getElementById('modalTitle').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
}
async function addProduct(productData) {
    const { name, description, price, category_id, quantity } = productData;
    try {
        const { error } = await supabaseClient
            .from('products')
            .insert([{ name, description, price, category_id, quantity }]);
        if (error) {
            console.error('Error adding product:', error);
            return;
        }
        document.getElementById('productForm').reset();
        document.getElementById('productModal').classList.add('hidden');
        fetchProducts();
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}
window.editProduct = async function(productId) {
    if (!productId) return;
    try {
        const { data: product, error } = await supabaseClient
            .from('products')
            .select('*')
            .eq('product_id', productId)
            .single();
        if (error) {
            console.error('Error fetching product for edit:', error);
            return;
        }
        const { name, description, price, category_id, quantity } = product;
        document.getElementById('productName').value = name;
        document.getElementById('productDescription').value = description;
        document.getElementById('productPrice').value = price;
        document.getElementById('productCategory').value = category_id;
        document.getElementById('productStock').value = quantity;
        document.getElementById('productId').value = productId;

        document.getElementById('modalTitle').textContent = 'Edit Product';
        document.getElementById('productModal').classList.remove('hidden');

    } catch (error) {
        console.error('Error:', error);
    }
}
async function handleFormSubmit(event) {
    event.preventDefault();
    const productId = document.getElementById('productId').value;
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDescription').value;
    const price = document.getElementById('productPrice').value;
    const category_id = document.getElementById('productCategory').value;
    const quantity = document.getElementById('productStock').value;
    if (productId) {
        await editProductData({ productId, name, description, price, category_id, quantity });
    } else {
        await addProduct({ name, description, price, category_id, quantity });
    }
}
async function editProductData(productData) {
    const { productId, name, description, price, category_id, quantity } = productData;
    try {
        const { error } = await supabaseClient
            .from('products')
            .update({ name, description, price, category_id, quantity })
            .eq('product_id', productId);
        if (error) {
            console.error('Error updating product:', error);
            return;
        }
        document.getElementById('productForm').reset();
        document.getElementById('productModal').classList.add('hidden');
        fetchProducts();
    } catch (error) {
        console.error('Unexpected error:', error);
    }
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
document.getElementById('openModalBtn').addEventListener('click', window.openAddProductModal);
document.getElementById('closeModalBtn').addEventListener('click', () => document.getElementById('productModal').classList.add('hidden'));
document.getElementById('cancelDeleteBtn').addEventListener('click', window.closeConfirmationModal);
document.getElementById('confirmDeleteBtn').addEventListener('click', window.deleteProduct);
document.getElementById('productForm').addEventListener('submit', handleFormSubmit);

fetchProducts();
