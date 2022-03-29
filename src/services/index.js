class Services {
  search = async ({ q, limit = 9, offset }) => {
    try {
      const params = new URLSearchParams({
        q,
        limit,
        api_key: "iDbHNmwj2pTDGVwzKAXS4A0uHrfOD9U8",
        offset,
      });

      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?${params}`
      );
      const resPromise = await response.json();
      return resPromise;
    } catch (e) {
      console.error(e);
    }
  };
}
export default new Services();
