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
  if (query && !categoryId) {
    URL = URLQuery;
  } else if (categoryId && !query) {
    URL = URLCategory;
  } else if (categoryId && query) {
    URL = URLQueryAndCategory;
  } else {
    return [];
  }
  const response = await fetch(URL);
  const data = await response.json();
  return data;
}
