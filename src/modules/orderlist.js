import supabaseClient from "../backend/supabase/index.js";

(async function showOrders() {
    let orders = await getData('orders');
    console.log(orders);

    let newOrderListBody = document.createElement('tbody');
    
    let orderItems = [];
    for (const order of orders) {
        const { order_id, order_status, date, user_id } = order;
        let order_products = await getData('order_products', 'order_id', order_id);

        let sum = 0;
        let newItemsListBody = document.createElement('tbody'); 
        newItemsListBody.className = 'items-list-body';
        for (const product of order_products) {
            const { product_id, quantity } = product;
            let productData = await getData('products', 'product_id', product_id);
            const { name, price, image_url } = productData[0];
            let newRow = document.querySelector('.items').cloneNode(true);
            let newRowCell = newRow.firstElementChild;
            let dataInList = [image_url, name, quantity, '$' + price, '$' + (price * quantity)];
            for (let i = 0; i < dataInList.length; i++) {
                if (i === 0) {
                    let productImage = document.createElement('img');
                    productImage.src = dataInList[0];
                    productImage.className = 'w-16 max-w-full max-h-full';
                    newRowCell.appendChild(productImage);
                } else {
                    newRowCell.innerText = dataInList[i];
                }
                newRowCell = newRowCell.nextElementSibling;
            }
            newItemsListBody.appendChild(newRow);
            sum += price * quantity;
        }
        let totalRow = document.createElement('tr');
        let title = document.createElement('td');
        let total = document.createElement('td');

        totalRow.className = 'bg-white border-b font-semibold text-black hover:bg-gray-50';
        title.className = 'px-6 py-4 text-lg';
        total.className = 'px-6 py-4';

        title.colSpan = '4';
        title.innerText = "Total";
        total.innerText = '$' + sum.toFixed(2);

        totalRow.append(title, total);
        newItemsListBody.appendChild(totalRow);
        orderItems.push({ id: order_id, body: newItemsListBody });

        let newRow = document.querySelector('.order').cloneNode(true);
        let newRowCell = newRow.firstElementChild;
        let dataInOrder = [order_id, order_status, date, '$' + sum.toFixed(2)];

        for (let i = 0; i < dataInOrder.length; i++) {
            newRowCell.innerText = dataInOrder[i];
            newRowCell = newRowCell.nextElementSibling;
        }

        // Set the color based on the order status
        newRow.querySelector('td:nth-child(2)').style.color = order_status === 'pending' ? 'orange' : order_status === 'accepted' ? 'green' : 'red';

        let actionsCell = document.createElement('td');
        let detailsBtn = document.createElement('button');
        let acceptBtn = document.createElement('button');
        let rejectBtn = document.createElement('button');

        actionsCell.className = "flex space-x-4 px-6 py-4 w-full";
        acceptBtn.className = "font-medium text-green-600 hover:underline w-1/3";
        rejectBtn.className = "font-medium text-red-600 hover:underline reject w-1/3";
        detailsBtn.className = "font-medium text-blue-600 hover:underline accept w-1/3";
        
        acceptBtn.innerText = "Accept";
        rejectBtn.innerText = "Reject";
        detailsBtn.innerText = "View details";

        detailsBtn.order_id = order_id;
        detailsBtn.user_id = user_id;
        acceptBtn.order_id = order_id;
        rejectBtn.order_id = order_id;

        acceptBtn.value = 'accepted';
        rejectBtn.value = 'rejected';

        // Add event listeners
        detailsBtn.addEventListener('click', () => {
            let itemsList = orderItems.find(obj => obj.id === detailsBtn.order_id);
            document.querySelector('.items-list-body').replaceWith(itemsList.body);
            document.querySelector('.orders-table').hidden = true;
            document.querySelector('.items-table').hidden = false;
        });

        acceptBtn.addEventListener('click', async () => {
            await updateData('orders', acceptBtn.value, 'order_id', order_id);
            updateUIAfterStatusChange(newRow, 'accepted');
        });

        rejectBtn.addEventListener('click', async () => {
            await updateData('orders', rejectBtn.value, 'order_id', order_id);
            updateUIAfterStatusChange(newRow, 'rejected');
        });

        actionsCell.append(acceptBtn, rejectBtn, detailsBtn);
        newRow.append(actionsCell);
        newOrderListBody.append(newRow);

        if(newRow.querySelector('td:nth-child(2)').innerText === 'accepted' || newRow.querySelector('td:nth-child(2)').innerText === 'rejected'){
            const buttons = newRow.querySelectorAll('button');
            buttons.forEach(button => {
                if (button.innerText === 'Accept' || button.innerText === 'Reject') {
                    button.remove();
                }
                detailsBtn.classList.replace('w-1/3','w-full');
            });
        }
    }

    let returnBtn = document.querySelector('.returnBtn');
    returnBtn.addEventListener('click', () => {
        document.querySelector('.orders-table').hidden = false;
        document.querySelector('.items-table').hidden = true;
    });

    document.querySelector('.order-list-body').replaceWith(newOrderListBody);
})();

async function getData(table, column = "", id = -1) {
    if (id === -1) {
        const { data, error } = await supabaseClient
            .from(table)
            .select(column);
        if (error) {
            console.error("Error fetching data from " + table + ":", error);
            return;
        }
        return data;
    } else {
        const { data, error } = await supabaseClient
            .from(table)
            .select()
            .eq(column, id);
        if (error) {
            console.error("Error fetching data from " + table + ":", error);
            return;
        }
        return data;
    }
}

async function updateData(table, newValue, idColumn, id) {
    const { data, error } = await supabaseClient
        .from(table)
        .update({ order_status: newValue })
        .eq(idColumn, id);
    if (error) {
        console.error("Error updating data:", error.message);
    } else {
        console.log("Data updated successfully!");
    }
}

// Function to update the UI after status change
function updateUIAfterStatusChange(row, newStatus) {
    const statusCell = row.querySelector('td:nth-child(2)');
    statusCell.innerText = newStatus;
    statusCell.style.color = newStatus === 'accepted' ? 'green' : 'red';
    
    // Remove the accept and reject buttons after the status change
    const buttons = row.querySelectorAll('button');
    console.log(buttons);
    buttons.forEach(button => {
        if (button.innerText === 'Accept' || button.innerText === 'Reject') {
            button.remove();
        }
        button.classList.replace('w-1/3','w-full');
    });
}  