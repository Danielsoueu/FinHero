import html2canvas from 'html2canvas';

export const downloadElementAsImage = async (elementId: string, fileName: string, onSuccess?: () => void, onError?: () => void) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true,
            logging: false,
        });

        const link = document.createElement('a');
        link.download = fileName;
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        if (onSuccess) onSuccess();
    } catch (error) {
        console.error('Error downloading image:', error);
        if (onError) onError();
    }
};

export const printElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    // We open a new window to print cleanly
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        // We can't use toast here easily without context, but this is a browser restriction fallback
        alert('Por favor, permita popups para imprimir.');
        return;
    }

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Imprimir Documento</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                body { font-family: 'Inter', sans-serif; padding: 40px; -webkit-print-color-adjust: exact; }
                img { max-width: 80px; height: auto; border-radius: 50%; }
            </style>
        </head>
        <body>
            ${element.innerHTML}
            <script>
                window.onload = function() {
                    setTimeout(() => {
                        window.print();
                        window.close();
                    }, 500);
                }
            </script>
        </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
};

export const copyTextToClipboard = async (elementId: string, onSuccess?: () => void, onError?: () => void) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        await navigator.clipboard.writeText(element.innerText);
        if (onSuccess) onSuccess();
    } catch (err) {
        console.error('Failed to copy text: ', err);
        if (onError) onError();
    }
};