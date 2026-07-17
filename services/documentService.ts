import html2canvas from 'html2canvas';

export const downloadElementAsImage = async (elementId: string, fileName: string, onSuccess?: () => void, onError?: () => void) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const canvas = await html2canvas(element, {
            scale: 3, // Increased scale to 3 for ultra-sharp high-resolution outputs
            backgroundColor: '#ffffff',
            useCORS: true,
            logging: false,
            allowTaint: true,
            scrollX: 0,
            scrollY: 0,
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight
        });

        const link = document.createElement('a');
        link.download = fileName;
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        if (onSuccess) onSuccess();
    } catch (error) {
        console.error('Error downloading image:', error);
        if (onError) onError();
    }
};

export const printElement = (elementId: string, title: string = 'Documento') => {
    const element = document.getElementById(elementId);
    if (!element) return;

    // We open a new window to print cleanly
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Por favor, permita popups para imprimir.');
        return;
    }

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Asap:ital,wght@0,100..900;1,100..900&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
            <script src="https://cdn.tailwindcss.com"></script>
            <script>
                tailwind.config = {
                    theme: {
                        extend: {
                            fontFamily: {
                                sans: ['Asap', 'Inter', 'sans-serif'],
                            },
                            colors: {
                                brand: {
                                    pink: '#FF0066',
                                    hover: '#E6005C',
                                    dark: '#101828',
                                    light: '#F3F3F3',
                                    slate: '#1E293B',
                                    hero: '#FF0066'
                                }
                            }
                        }
                    }
                }
            </script>
            <style>
                @page {
                    size: A4 portrait;
                    margin: 15mm;
                }
                body {
                    font-family: 'Asap', 'Inter', sans-serif;
                    background-color: #ffffff;
                    color: #1e293b;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    color-adjust: exact !important;
                    margin: 0;
                    padding: 0;
                }
                .print-container {
                    width: 100%;
                    max-width: 210mm;
                    margin: 0 auto;
                }
                img {
                    max-width: 100%;
                    height: auto;
                    display: block;
                }
                /* Avoid page break split inside receipt list items or total blocks */
                .avoid-break {
                    page-break-inside: avoid;
                    break-inside: avoid;
                }
            </style>
        </head>
        <body class="antialiased">
            <div class="print-container">
                ${element.innerHTML}
            </div>
            <script>
                window.onload = function() {
                    // Give Tailwind CDN and fonts a moment to compile/load
                    setTimeout(() => {
                        window.print();
                        window.close();
                    }, 800);
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