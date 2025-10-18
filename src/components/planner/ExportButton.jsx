import React, { useState } from 'react';
import { Button, useToast } from '@chakra-ui/react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const ExportButton = ({ elementId, fileName = "mi-dia-a-dia.pdf" }) => {
    const [isExporting, setIsExporting] = useState(false);
    const toast = useToast();

    const handleExport = () => {
        const captureElement = document.getElementById(elementId);
        if (!captureElement) {
            toast({
                title: "Error",
                description: "No se pudo encontrar el contenido para exportar.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        setIsExporting(true);

        html2canvas(captureElement, {
            useCORS: true,
            scale: 2,
            backgroundColor: '#f7fafc', // Corresponds to gray.50
        })
        .then(canvas => {
            const { jsPDF } = require("jspdf");
            const pdf = new jsPDF({
                orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(fileName);
            toast({
                title: "¡Éxito!",
                description: "PDF generado correctamente.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        })
        .catch(err => {
            console.error("Error al exportar a PDF:", err);
            toast({
                title: "Error de exportación",
                description: "Hubo un problema al generar el PDF.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        })
        .finally(() => {
            setIsExporting(false);
        });
    };

    return (
        <Button
            colorScheme="green"
            onClick={handleExport}
            isLoading={isExporting}
            loadingText="Exportando..."
        >
            Descargar Vista como PDF
        </Button>
    );
};

export default ExportButton;
