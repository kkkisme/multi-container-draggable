module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/multi-container-draggable/dist/'
        : '/'
}