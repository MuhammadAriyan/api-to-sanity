import slugify from "slugify";
import { fetchApiData } from "./fetchData";
import { client } from "./client";
import { uploadImageToSanity } from "./uploadImage";

  export const importData = async () => {
    try {
      const products = await fetchApiData();
      for (const product of products) {
        const categoryRef = await createCategory({ name: product.category.name });
      
        if (!categoryRef) {
          console.warn(`Skipping product "${product.name}" due to missing category reference.`);
          continue;
        }
      
        const imageRef = await uploadImageToSanity(product.image);
      
        const newProduct = {
          _id: product._id || `product-${slugify(product.name, { lower: true })}`,
          _type: "product",
          name: product.name,
          slug: { _type: "slug", current: slugify(product.name, { lower: true }) },
          price: product.price,
          quantity: product.quantity || 0,
          tags: product.tags || [],
          description: product.description || "No description provided.",
          features:
            product.features?.map((feature: string, index: number) => ({
              _key: `feature-${index}`,
              value: feature,
            })) || [],
          dimensions: product.dimensions || { height: "N/A", width: "N/A", depth: "N/A" },
          category: { _type: "reference", _ref: categoryRef },
          image: imageRef ? { _type: "image", asset: { _type: "reference", _ref: imageRef } } : null,
        };
      
        await client.createIfNotExists(newProduct);
      }      
      console.log("Data imported successfully!");
    } catch (error) {
      console.error("Error importing data:", error);
    }
  };
  

interface Category {
  name: string;
}
export const createCategory = async (category: Category): Promise<string> => {
  const categorySlug = slugify(category.name, { lower: true });
  const categoryId = `category-${categorySlug}`;

  try {
    const existingCategory = await client.fetch(
      `*[_type == "category" && slug.current == $slug][0]`,
      { slug: categorySlug }
    );

    if (existingCategory) {
      return existingCategory._id;
    }

    const newCategory = await client.create({
      _id: categoryId,
      _type: "category",
      name: category.name,
      slug: { _type: "slug", current: categorySlug },
    });

    return newCategory._id;
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error(`Failed to create category "${category.name}"`); // ⬅️ Instead of returning ""
  }
};
