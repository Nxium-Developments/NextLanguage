const preloadContent = `const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('preloader', {
    showLoading: () => {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'preloader';
        loadingDiv.style.cssText = \`
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        \`;

        const spinner = document.createElement('div');
        spinner.style.cssText = \`
            width: 50px;
            height: 50px;
            border: 5px solid #ddd;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        \`;

        // Add CSS animation for spinning
        const style = document.createElement('style');
        style.textContent = \`
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        \`;
        document.head.appendChild(style);

        loadingDiv.appendChild(spinner);
        document.body.appendChild(loadingDiv);
    },
    hideLoading: () => {
        const loadingDiv = document.getElementById('preloader');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    },
});
`;

const indexFileContents = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Electron App</title>
</head>
<body>
    <h1>Welcome to Your Electron App!</h1>
    <p>Your app content goes here.</p>

    <script>
        // Show the preloader
        window.preloader.showLoading();

        // Simulate a delay (e.g., for data loading) and hide the preloader
        setTimeout(() => {
            window.preloader.hideLoading();
        }, 3000); // Adjust the delay as needed
    </script>
</body>
</html>
`;

module.exports = {
    preloadContent,
    indexFileContents,
};
