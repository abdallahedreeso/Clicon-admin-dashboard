import supabaseClient from "../backend/supabase/index.js";
async function fetchCategories() {
  try {
    const { data: categories, error } = await supabaseClient
      .from("categories")
      .select("*")
      .order("category_id", { ascending: true });
    if (error) {
      console.error("Error fetching categories:", error);
      return;
    }
    const categoryTableBody = document.getElementById("categoryTableBody");
    categoryTableBody.innerHTML = "";
    categories.forEach((category) => {
      const row = document.createElement("tr");
      row.classList.add("bg-gray-800", "border-b", "border-gray-700");
      row.innerHTML = `
                <td class="p-4">${category.category_id}</td>
                <td class="p-4">${category.category}</td>
                <td class="p-4">${category.sub_category}</td>
                <td class="p-4">${category.description}</td>
                <td class="p-4 lg:flex lg:space-x-2">
                    <button class="bg-yellow-500 text-white w-full mb-2 lg:mb-0 p-2 rounded" onclick="editCategory(${category.category_id})">Edit</button>
                    <button class="bg-red-600 text-white w-full p-2 rounded" onclick="openConfirmationModal(${category.category_id})">Delete</button>
                </td>
            `;
      categoryTableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}
window.openAddCategoryModal = function () {
  document.getElementById("categoryModal").classList.remove("hidden");
  document.getElementById("modalTitle").textContent = "Add Category";
  document.getElementById("categoryForm").reset();
  document.getElementById("categoryId").value = "";
};
async function addCategory(categoryData) {
  const { category, sub_category, description } = categoryData;
  try {
    const { error } = await supabaseClient
      .from("categories")
      .insert([{ category, sub_category, description }]);
    if (error) {
      console.error("Error adding category:", error);
      return;
    }
    document.getElementById("categoryForm").reset();
    document.getElementById("categoryModal").classList.add("hidden");
    fetchCategories();
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}
window.editCategory = async function (categoryId) {
  if (!categoryId) return;
  try {
    const { data: category, error } = await supabaseClient
      .from("categories")
      .select("*")
      .eq("category_id", categoryId)
      .single();
    if (error) {
      console.error("Error fetching category for edit:", error);
      return;
    }
    const { category: categoryName, sub_category, description } = category;
    document.getElementById("categoryId").value = categoryId;
    document.getElementById("categoryName").value = categoryName;
    document.getElementById("categorySubCategory").value = sub_category;
    document.getElementById("categoryDescription").value = description;

    document.getElementById("modalTitle").textContent = "Edit Category";
    document.getElementById("categoryModal").classList.remove("hidden");
  } catch (error) {
    console.error("Error:", error);
  }
};
async function handleFormSubmit(event) {
  event.preventDefault();
  const category_id = document.getElementById("categoryId").value;
  const category = document.getElementById("categoryName").value;
  const sub_category = document.getElementById("categorySubCategory").value;
  const description = document.getElementById("categoryDescription").value;

  if (category_id) {
    await editCategoryData({
      category_id,
      category,
      sub_category,
      description,
    });
  } else {
    await addCategory({ category, sub_category, description });
  }
}
async function editCategoryData(categoryData) {
  const { category_id, category, sub_category, description } = categoryData;
  try {
    const { error } = await supabaseClient
      .from("categories")
      .update({ category, sub_category, description })
      .eq("category_id", category_id);
    if (error) {
      console.error("Error updating category:", error);
      return;
    }
    document.getElementById("categoryForm").reset();
    document.getElementById("categoryModal").classList.add("hidden");
    fetchCategories();
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}
window.openConfirmationModal = function (category_id) {
  const confirmationModal = document.getElementById("confirmationModal");
  confirmationModal.classList.remove("hidden");
  window.currentCategoryId = category_id;
};
window.closeConfirmationModal = function () {
  const confirmationModal = document.getElementById("confirmationModal");
  confirmationModal.classList.add("hidden");
};
window.deleteCategory = async function () {
  const categoryId = window.currentCategoryId;
  if (!categoryId) return;
  try {
    const { error: updateError } = await supabaseClient
      .from("products")
      .update({ category_id: null })
      .eq("category_id", categoryId);

    if (updateError) {
      console.error("Error updating products:", updateError);
      return;
    }

    const { error } = await supabaseClient
      .from("categories")
      .delete()
      .eq("category_id", categoryId);

    if (error) {
      console.error("Error deleting category:", error);
      return;
    }
    window.closeConfirmationModal();
    fetchCategories();
  } catch (error) {
    console.error("Unexpected error:", error);
  }
};

document
  .getElementById("openCategoryModalBtn")
  .addEventListener("click", window.openAddCategoryModal);
document
  .getElementById("closeCategoryModalBtn")
  .addEventListener("click", () =>
    document.getElementById("categoryModal").classList.add("hidden")
  );
document
  .getElementById("cancelDeleteBtn")
  .addEventListener("click", window.closeConfirmationModal);
document
  .getElementById("confirmDeleteBtn")
  .addEventListener("click", window.deleteCategory);
document
  .getElementById("categoryForm")
  .addEventListener("submit", handleFormSubmit);

fetchCategories();
