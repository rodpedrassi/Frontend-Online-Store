export async function getCategories() {
  const URL = 'https://api.mercadolibre.com/sites/MLB/categories';
  const response = await fetch(URL);
  const data = await response.json();
  return data;
}

export async function getProductsFromCategoryAndQuery(categoryId, query) {
  const URLQuery = `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
  const URLCategory = `https://api.mercadolibre.com/sites/MLB/search?category=${categoryId}`;
  const URLQueryAndCategory = `https://api.mercadolibre.com/sites/MLB/search?category=${categoryId}&q=${query}`;
  let URL;
  if (!categoryId) {
    URL = URLQuery;
  } else if (!query) {
    URL = URLCategory;
  } else {
    URL = URLQueryAndCategory;
  }
  const response = await fetch(URL);
  const data = await response.json();
  return data;
}
