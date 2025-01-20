if (window.electronAPI) {
    window.electronAPI.onUpdateAvailable(() => {
        alert('Hay una nueva actualización disponible. Se descargará en segundo plano.');
    });

    window.electronAPI.onUpdateDownloaded(() => {
        const respuesta = confirm('Se descargó una nueva actualización. ¿Quieres reiniciar la aplicación para instalarla?');
        if (respuesta) {
            window.electronAPI.restartApp();
    }
    });
} else {
    console.error('electronAPI no está disponible. Verifica tu configuración de preload.js.');
}
