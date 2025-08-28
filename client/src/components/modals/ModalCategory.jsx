import Modal from "../../layouts/Modal";
import TextInput from "../TextInput";
import SelectField from "../Dropdown";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { getPreviewClass } from "../../utils/colors";

export default function ModalCategory({ isOpen, onClose, category = null }) {
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [color, setColor] = useState("blue");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen && category) {
      setCategoryId(category.id || "");
      setCategoryName(category.category_name || "");
      setColor(category.color || "blue");
      setIsEditing(false);
    }
  }, [isOpen, category]);

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const handleCategoryNameChange = (e) => {
    const name = e.target.value;
    const slug = name.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9\_]/g, '');
    setCategoryName(name);
    setCategoryId(slug);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!categoryId || !categoryName) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from("categories")
        .update({
          id: categoryId,
          category_name: categoryName,
          color: color
        })
        .eq('id', category.id);
      
      if (error) throw error;

      setIsEditing(false);
      onClose();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!category?.id) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${category.category_name}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq('id', category.id);

      if (error) throw error;

      onClose();
    } catch (error) {
      alert(`Error deleting category: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  const getTitle = () => {
    if (isEditing) return "Edit category";
    return "Category Details";
  };

  const isViewMode = !isEditing;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={getTitle()}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
            Category ID
          </label>
          <input type="text" id="category_id" value={categoryId} readOnly className="mt-1 block w-full rounded-md p-2 bg-gray-300 text-gray-600 border border-gray-300" />
        </div>

        <TextInput label="Category Name" placeholder="Enter category name" value={categoryName} onChange={handleCategoryNameChange}disabled={isViewMode} required={true}/>

        <SelectField label="Color" value={color} onChange={(e) => setColor(e.target.value)} disabled={isViewMode} selectmessage="Please select a color" allowEmpty={false}
          options={[
            { value: "red", label: "Red" }, { value: "orange", label: "Orange" },
            { value: "amber", label: "Amber" }, { value: "yellow", label: "Yellow" },
            { value: "lime", label: "Lime" }, { value: "green", label: "Green" },
            { value: "emerald", label: "Emerald" }, { value: "teal", label: "Teal" },
            { value: "cyan", label: "Cyan" }, { value: "sky", label: "Sky" },
            { value: "blue", label: "Blue" }, { value: "indigo", label: "Indigo" },
            { value: "violet", label: "Violet" }, { value: "purple", label: "Purple" },
            { value: "fuchsia", label: "Fuchsia" }, { value: "pink", label: "Pink" },
            { value: "rose", label: "Rose" }, { value: "stone", label: "Stone" },
            { value: "neutral", label: "Neutral" }, { value: "zinc", label: "Zinc" },
            { value: "gray", label: "Gray" }, { value: "slate", label: "Slate" },
          ]}
          classfield="flex items-center gap-3">
          <div className={`w-10 h-10 rounded border border-gray-300 ${getPreviewClass(color)}`} />
        </SelectField>

        <div className="flex justify-between gap-2 mt-4">
          <div>
            {!loading && (
              <button type="button"onClick={handleDelete} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded"disabled={loading}>
                Delete
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            {isViewMode ? (
              <button type="button" onClick={(e) => { e.preventDefault(); setIsEditing(true);}}className="px-4 py-2 bg-sky-600 hover:scale-99 text-white rounded">
                Edit
              </button>
            ) : (
              <button type="submit" className="px-4 py-2 bg-sky-950 hover:scale-99 text-white rounded"disabled={loading}>
                {loading ? "Updating..." : "Update Category"}
              </button>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}