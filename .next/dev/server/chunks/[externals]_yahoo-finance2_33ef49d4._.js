module.exports = [
"[externals]/yahoo-finance2 [external] (yahoo-finance2, esm_import, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/[externals]_yahoo-finance2_db7c5e74._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[externals]/yahoo-finance2 [external] (yahoo-finance2, esm_import)");
    });
});
}),
];