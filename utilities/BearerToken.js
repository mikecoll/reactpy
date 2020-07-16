const apiToken = document.head.querySelector('meta[name="api-token"]');

export default apiToken.content || null;
